"""Nine Denise recordings and their ZIP; never fall back to a different voice.

pip install 'edge-tts>=7.2,<8'
python scripts/generate-tcm-csc-denise.py --dry-run
python scripts/generate-tcm-csc-denise.py --output /tmp/tcm-csc-denise --install

--install only activates the new montage after all nine MP3s pass validation.
Existing shared number/operator recordings are never overwritten.
"""
from __future__ import annotations

import argparse
import array
import asyncio
import hashlib
import importlib.metadata
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / 'src/tcm-csc/denise-recordings.json'
DESTINATION = ROOT / 'public/lib/audio/tcm-csc/denise'


def validate(path: Path) -> dict:
    data = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,channels:format=duration', '-of', 'json', str(path)]))
    stream = data['streams'][0]
    duration = float(data['format']['duration'])
    if (stream['codec_name'], stream['sample_rate'], stream['channels']) != ('mp3', '24000', 1) or not 0.1 < duration < 30:
        raise RuntimeError(f'Format ou durée incorrects : {path.name}')
    pcm = subprocess.check_output(['ffmpeg', '-nostdin', '-v', 'error', '-i', str(path), '-f', 's16le', '-acodec', 'pcm_s16le', '-'])
    samples = array.array('h')
    samples.frombytes(pcm)
    if not samples or max(abs(value) for value in samples) < 33:
        raise RuntimeError(f'Prise silencieuse : {path.name}')
    return {'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size, 'duration': duration, 'sampleRate': 24000, 'channels': 1}


async def generate(args: argparse.Namespace) -> None:
    spec = json.loads(SPEC.read_text())
    assert len(spec['files']) == len({row['filename'] for row in spec['files']}) == 9
    assert (spec['voice'], spec['rate'], spec['volume'], spec['pitch']) == ('fr-FR-DeniseNeural', '-25%', '+0%', '+0Hz')
    if args.dry_run:
        print(json.dumps({'status': 'plan_only_no_audio_generated', **{key: spec[key] for key in ['voice', 'rate', 'volume', 'pitch', 'sampleRate', 'channels', 'files']}}, ensure_ascii=False, indent=2))
        return
    try:
        import edge_tts
    except ImportError as error:
        raise RuntimeError("Installer edge-tts : python -m pip install 'edge-tts>=7.2,<8'. Aucune autre voix ne sera utilisée.") from error
    args.output.mkdir(parents=True, exist_ok=True)
    if any((args.output / row['filename']).exists() for row in spec['files']) or (args.output / 'TCM-CSC_DENISE_9-MP3.zip').exists():
        raise RuntimeError('Ce dossier contient déjà des prises ; choisissez un nouveau dossier de sortie.')
    if args.install and DESTINATION.exists():
        raise RuntimeError('Le dossier Denise existe déjà ; aucune prise existante ne sera écrasée.')
    with tempfile.TemporaryDirectory(prefix='tcm-csc-denise-') as temporary:
        stage = Path(temporary)
        measurements = {}
        for row in spec['files']:
            raw, final = stage / 'raw.mp3', stage / row['filename']
            # French letter names and "plusse" are pronunciation inputs only.
            # No examples, filenames, phonetic symbols, numbers or real beeps are read.
            await edge_tts.Communicate(row['synthesisText'], spec['voice'], rate=spec['rate'], volume=spec['volume'], pitch=spec['pitch']).save(str(raw))
            subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', str(raw), '-af', 'silenceremove=start_periods=1:start_duration=0.005:start_threshold=-60dB,areverse,silenceremove=start_periods=1:start_duration=0.005:start_threshold=-60dB,areverse,apad=pad_dur=0.02', '-ar', '24000', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '96k', str(final)], check=True)
            measurements[row['filename']] = validate(final)
            print(f"Prise validée : {row['filename']}", flush=True)
        archive = stage / 'TCM-CSC_DENISE_9-MP3.zip'
        with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_STORED) as zip_file:
            for row in spec['files']:
                zip_file.write(stage / row['filename'], row['filename'])
        with zipfile.ZipFile(archive) as zip_file:
            assert len(zip_file.namelist()) == 9 and zip_file.testzip() is None
        manifest = {**spec, 'status': 'generated', 'engine': 'edge-tts', 'engineVersion': importlib.metadata.version('edge-tts'), 'humanListeningVerified': False, 'files': [{**row, **measurements[row['filename']]} for row in spec['files']]}
        for row in spec['files']:
            shutil.copy2(stage / row['filename'], args.output / row['filename'])
        shutil.copy2(archive, args.output / archive.name)
        (args.output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
        if args.install:
            DESTINATION.parent.mkdir(parents=True, exist_ok=True)
            installed = DESTINATION.with_name('denise-installing')
            if installed.exists():
                raise RuntimeError('Installation précédente à examiner : denise-installing.')
            installed.mkdir()
            try:
                for row in spec['files']:
                    shutil.copy2(stage / row['filename'], installed / row['filename'])
                installed.rename(DESTINATION)
                # The app keeps its legacy audio path until this final manifest commit.
                pending = SPEC.with_suffix('.json.tmp')
                pending.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
                pending.replace(SPEC)
            except BaseException:
                shutil.rmtree(installed, ignore_errors=True)
                raise
        print(f'ZIP prêt : {args.output / archive.name}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'work/tcm-csc-denise')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--install', action='store_true')
    try:
        asyncio.run(generate(parser.parse_args()))
    except Exception as error:
        parser.exit(1, f'Génération Denise interrompue, sans voix de remplacement : {error}\n')
