"""Lossless FLAC preparation without storing a decoded PCM source on disk.

The caller owns word-boundary planning and review. This module only preserves
exact signed 16-bit PCM frames, records integrity evidence and draws waveforms.
It never claims that an audio file has been listened to.
"""
from __future__ import annotations

import hashlib
import math
import re
import subprocess
import sys
from array import array
from pathlib import Path


CONTEXT_SECONDS = 2
WINDOW_KEYS = ('start_before', 'start_after', 'end_before', 'end_after')


class CompactAudioError(ValueError):
    pass


def _require(condition, message):
    if not condition:
        raise CompactAudioError(message)


def _sha256(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def _format(info):
    rate, channels = info.get('sample_rate'), info.get('channels')
    _require(type(rate) is int and 8000 <= rate <= 192000, 'Fréquence PCM invalide.')
    _require(type(channels) is int and 1 <= channels <= 2, 'Canaux PCM invalides.')
    return rate, channels, channels * 2


def _root(path):
    raw = Path(path).expanduser().absolute()
    resolved = raw.resolve()
    _require(raw == resolved and resolved.is_dir(), 'Dossier de travail existant sans lien symbolique requis.')
    _require(any(part == 'work' or part.startswith('work-') for part in resolved.parts),
             'Sorties compactes réservées à un dossier work ou work-….')
    _require(not any(part in ('public', 'lib', 'audio', '.git') for part in resolved.parts),
             'Sorties dans la production interdites.')
    return resolved


def _artifact(root, relative, must_exist=False):
    _require(isinstance(relative, str) and relative and '\\' not in relative,
             'Chemin compact relatif invalide.')
    relative = Path(relative)
    _require(not relative.is_absolute() and '..' not in relative.parts, 'Traversée de chemin interdite.')
    path = root / relative
    _require(path.absolute() == path.resolve() and path.resolve().is_relative_to(root),
             'Lien symbolique ou sortie hors travail interdit.')
    if must_exist:
        _require(path.is_file(), f'Contrôle compact introuvable : {relative}')
    else:
        _require(not path.exists(), f'Le contrôle existe déjà : {relative}')
    return path


def _decode(source, info):
    """Yield frame-aligned PCM blocks; ffmpeg never writes PCM to a file."""
    source = Path(source).resolve()
    _require(source.is_file(), 'Source locale introuvable.')
    rate, channels, frame_bytes = _format(info)
    command = ['ffmpeg', '-nostdin', '-v', 'error', '-i', str(source), '-map', '0:a:0',
               '-vn', '-c:a', 'pcm_s16le', '-ar', str(rate), '-ac', str(channels),
               '-f', 's16le', 'pipe:1']
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    pending = b''
    try:
        while True:
            chunk = process.stdout.read(65536 * frame_bytes)
            if not chunk:
                break
            chunk = pending + chunk
            usable = len(chunk) - len(chunk) % frame_bytes
            if usable:
                yield chunk[:usable]
            pending = chunk[usable:]
        process.stdout.close()
        error = process.stderr.read()
        process.stderr.close()
        returncode = process.wait()
        _require(returncode == 0, 'Décodage ffmpeg refusé : ' + error.decode('utf-8', errors='replace')[-1000:])
        _require(not pending, 'Source PCM incomplète à la frontière d’un échantillon.')
    finally:
        if process.poll() is None:
            process.kill()
            process.wait()
        if process.stdout and not process.stdout.closed:
            process.stdout.close()
        if process.stderr and not process.stderr.closed:
            process.stderr.close()


def inspect_pcm(source, info):
    """Count and hash the exact decoder output in one bounded-memory pass."""
    rate, _, frame_bytes = _format(info)
    digest, size = hashlib.sha256(), 0
    for chunk in _decode(source, info):
        digest.update(chunk)
        size += len(chunk)
    _require(size > 0, 'PCM source vide.')
    return {'decoded_frames': size // frame_bytes, 'decoded_duration': size / frame_bytes / rate,
            'decoded_pcm_sha256': digest.hexdigest()}


def _windows(first, last, total, rate):
    context = CONTEXT_SECONDS * rate
    return dict(zip(WINDOW_KEYS, ((max(0, first-context), first), (first, min(total, first+context)),
                                 (max(0, last-context), last), (last, min(total, last+context)))))


class _Encoder:
    def __init__(self, path, info, first, last):
        self.path, self.first, self.last = path, first, last
        rate, channels, self.frame_bytes = _format(info)
        self.digest, self.frames, self.process, self.closed = hashlib.sha256(), 0, None, False
        self.command = ['ffmpeg', '-nostdin', '-v', 'error', '-n', '-f', 's16le', '-ar', str(rate),
                        '-ac', str(channels), '-i', 'pipe:0', '-c:a', 'flac', '-compression_level', '5', str(path)]

    def feed(self, data, first):
        last = first + len(data) // self.frame_bytes
        start, end = max(first, self.first), min(last, self.last)
        if end <= start:
            return
        if self.process is None:
            self.process = subprocess.Popen(self.command, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        selected = data[(start-first)*self.frame_bytes:(end-first)*self.frame_bytes]
        try:
            self.process.stdin.write(selected)
        except BrokenPipeError as exc:
            raise CompactAudioError(f'Encodage FLAC interrompu : {self.path.name}') from exc
        self.digest.update(selected)
        self.frames += end-start

    def close(self):
        _require(self.process is not None and self.frames == self.last-self.first,
                 f'Plage FLAC absente ou incomplète : {self.path.name}')
        self.process.stdin.close()
        self.process.stdin = None
        _, error = self.process.communicate()
        _require(self.process.returncode == 0, 'Encodage FLAC refusé : ' + error.decode('utf-8', errors='replace')[-1000:])
        self.process = None
        self.closed = True
        return {'encoding': 'flac', 'sha256': _sha256(self.path), 'pcm_sha256': self.digest.hexdigest(),
                'frames': self.frames}

    def abort(self):
        if self.process is not None:
            if self.process.stdin and not self.process.stdin.closed:
                self.process.stdin.close()
            self.process.kill()
            self.process.wait()
            if self.process.stderr:
                self.process.stderr.close()
            self.process = None


class _Waveform:
    def __init__(self, first, last, start, end, info):
        self.first, self.last, self.start, self.end = first, last, start, end
        self.rate, self.channels, self.frame_bytes = _format(info)
        self.width, self.peaks = 1000, [0] * 1000

    def feed(self, data, first):
        last, total = first + len(data) // self.frame_bytes, self.last-self.first
        if last <= self.first or first >= self.last:
            return
        lo = max(0, (max(first, self.first)-self.first) * self.width // total)
        hi = min(self.width-1, (min(last, self.last)-self.first) * self.width // total)
        for index in range(lo, hi+1):
            start = max(first, self.first + index*total//self.width)
            end = min(last, self.first + (index+1)*total//self.width)
            if end <= start:
                continue
            samples = array('h', data[(start-first)*self.frame_bytes:(end-first)*self.frame_bytes])
            if sys.byteorder != 'little':
                samples.byteswap()
            self.peaks[index] = max(self.peaks[index], max((abs(value) for value in samples), default=0))

    def write(self, destination):
        bars = ''.join(f'<path d="M{x},90 v{-value/32768*70:.2f} M{x},90 v{value/32768*70:.2f}"/>'
                       for x, value in enumerate(self.peaks))
        lines = ''.join(f'<path stroke="#b91c1c" d="M{(frame-self.first)/(self.last-self.first)*self.width:.3f},0 v180"/>'
                        for frame in (self.start, self.end))
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.width} 180" role="img" '
               f'aria-label="Signal PCM de {self.first/self.rate:.3f} à {self.last/self.rate:.3f} secondes ; frontières rouges">'
               f'<rect width="{self.width}" height="180" fill="#f8fafc"/><g stroke="#334155">{bars}</g>{lines}</svg>')
        with destination.open('x', encoding='utf-8') as handle:
            handle.write(svg)


def prepare_compact(source, run, info, segments, decoded=None):
    """Create FLAC candidates/windows and SVGs; mutate artifact fields in segments.

    Use ``inspect_pcm`` first, recompute plans with its exact duration, and pass
    that metadata as ``decoded``. If omitted, this function inspects the source.
    A second streaming decode fans each required frame range to FLAC encoders.
    No full PCM file or full in-memory source buffer is created.
    """
    root, (rate, _, frame_bytes) = _root(run), _format(info)
    decoded = inspect_pcm(source, info) if decoded is None else dict(decoded)
    total = decoded.get('decoded_frames')
    _require(type(total) is int and total > 0, 'Nombre exact d’échantillons source requis.')
    encoders, waveforms, artifacts = [], [], []
    for item in segments:
        identifier, first, last = item.get('id'), item.get('start_frame'), item.get('end_frame')
        _require(isinstance(identifier, str) and re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,99}', identifier), 'Identifiant compact invalide.')
        _require(type(first) is int and type(last) is int and 0 <= first < last <= total, 'Plage de candidat hors source.')
        folder = root / identifier
        _require(not folder.exists(), f'Dossier de candidat déjà présent : {identifier}')
        folder.mkdir()
        output = _artifact(root, f'{identifier}/candidate.flac')
        item['audio'] = {'path': str(output.relative_to(root))}
        encoder = _Encoder(output, info, first, last)
        encoders.append(encoder)
        artifacts.append((encoder, item['audio']))
        item['windows'] = {}
        for key, (start, end) in _windows(first, last, total, rate).items():
            entry = {'available': end > start, 'start_frame': start, 'end_frame': end}
            if end > start:
                output = _artifact(root, f'{identifier}/{key}.flac')
                entry['path'] = str(output.relative_to(root))
                encoder = _Encoder(output, info, start, end)
                encoders.append(encoder)
                artifacts.append((encoder, entry))
            else:
                entry['reason'] = 'source_start' if start == 0 else 'source_end'
            item['windows'][key] = entry
        output = _artifact(root, f'{identifier}/waveform.svg')
        item['waveform'] = {'path': str(output.relative_to(root))}
        waveforms.append((_Waveform(max(0, first-CONTEXT_SECONDS*rate), min(total, last+CONTEXT_SECONDS*rate),
                                    first, last, info), output, item['waveform']))
    full_digest, current = hashlib.sha256(), 0
    try:
        for chunk in _decode(source, info):
            full_digest.update(chunk)
            for encoder in encoders:
                if not encoder.closed and current < encoder.last:
                    encoder.feed(chunk, current)
            for waveform, _, _ in waveforms:
                waveform.feed(chunk, current)
            current += len(chunk) // frame_bytes
            for encoder, entry in artifacts:
                if not encoder.closed and current >= encoder.last:
                    entry.update(encoder.close())
        _require(current == total and full_digest.hexdigest() == decoded.get('decoded_pcm_sha256'),
                 'PCM source modifié entre inspection et préparation.')
        _require(all(encoder.closed for encoder in encoders), 'Plage compacte après la fin source.')
        for waveform, output, entry in waveforms:
            waveform.write(output)
            entry['sha256'] = _sha256(output)
    except BaseException:
        for encoder in encoders:
            encoder.abort()
        raise
    for item in segments:
        item['status'] = 'needs_review'
    return {**decoded, 'storage_mode': 'compact_flac'}


def verify_compact(source, info, segments, root, source_pcm_sha256):
    """Verify source and every exact PCM slice, with bounded-memory decoding."""
    root, (_, _, frame_bytes) = _root(root), _format(info)
    specs = []
    for item in segments:
        first, last = item['start_frame'], item['end_frame']
        specs.append((item['audio'], first, last, hashlib.sha256()))
        for window in item['windows'].values():
            if window['available']:
                specs.append((window, window['start_frame'], window['end_frame'], hashlib.sha256()))
        waveform = _artifact(root, item['waveform']['path'], must_exist=True)
        _require(_sha256(waveform) == item['waveform']['sha256'], 'Forme d’onde compacte modifiée.')
    current, source_digest = 0, hashlib.sha256()
    for chunk in _decode(source, info):
        source_digest.update(chunk)
        end = current + len(chunk) // frame_bytes
        for _, first, last, digest in specs:
            lo, hi = max(current, first), min(end, last)
            if hi > lo:
                digest.update(chunk[(lo-current)*frame_bytes:(hi-current)*frame_bytes])
        current = end
    _require(source_digest.hexdigest() == source_pcm_sha256, 'PCM source compact modifié.')
    for artifact, first, last, expected in specs:
        _require(type(first) is int and type(last) is int and 0 <= first < last <= current,
                 'Plage de contrôle compact invalide.')
        _require(artifact.get('encoding') == 'flac' and artifact.get('frames') == last-first,
                 'Encodage ou nombre d’échantillons compact incorrect.')
        path = _artifact(root, artifact['path'], must_exist=True)
        _require(_sha256(path) == artifact.get('sha256'), 'Fichier FLAC de contrôle modifié.')
        command = ['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries',
                   'stream=codec_name,sample_rate,channels,bits_per_raw_sample', '-of', 'csv=p=0', str(path)]
        try:
            values = subprocess.run(command, check=True, capture_output=True, text=True).stdout.strip().split(',')
            _require(values == ['flac', str(info['sample_rate']), str(info['channels']), '16'],
                     'Format FLAC différent de la fréquence, des canaux ou des 16 bits attendus.')
        except subprocess.CalledProcessError as exc:
            raise CompactAudioError('Flux FLAC illisible.') from exc
        actual = inspect_pcm(path, info)
        _require(actual['decoded_frames'] == last-first and
                 actual['decoded_pcm_sha256'] == artifact.get('pcm_sha256') == expected.hexdigest(),
                 'PCM FLAC différent de la coupe exacte prévue.')
    return {'decoded_frames': current, 'decoded_pcm_sha256': source_digest.hexdigest()}
