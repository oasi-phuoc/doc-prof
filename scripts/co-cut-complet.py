#!/usr/bin/env python3
"""
Découpe les CO complet multi-Document en pistes mini (1 écoute / document).

Règles : début = fin bip + 0,5 s ; fin = dernière phrase + 1 s ; retire intros.
Met à jour src/tcf/content/*/co.json (audios[] + transcription[] + audio:N).
Voir .claude/skills/decoupage-audio-co/SKILL.md
"""
from __future__ import annotations

import argparse
import json
import math
import re
import struct
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src" / "tcf" / "content"
PAD_AFTER_BEEP = 0.5
PAD_AFTER_LAST = 1.0
WHISPER_MODEL = "large-v3"


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, capture_output=True, text=True, **kw)


def ffprobe_duration(path: Path) -> float:
    out = run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]
    )
    return float(out.stdout.strip())


def silencedetect(path: Path, noise: str = "-35dB", d: float = 1.2) -> list[tuple[float, float, float]]:
    """Return list of (silence_start, silence_end, duration)."""
    proc = subprocess.run(
        ["ffmpeg", "-i", str(path), "-af", f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    log = proc.stderr
    starts, ends = [], []
    for line in log.splitlines():
        if "silence_start:" in line:
            starts.append(float(line.split("silence_start:")[1].split("|")[0].strip()))
        elif "silence_end:" in line:
            m = re.search(r"silence_end:\s*([\d.]+).*silence_duration:\s*([\d.]+)", line)
            if m:
                ends.append((float(m.group(1)), float(m.group(2))))
    out = []
    for i, (end, dur) in enumerate(ends):
        start = starts[i] if i < len(starts) else max(0.0, end - dur)
        out.append((start, end, dur))
    return out


def to_mono16(src: Path, dest: Path) -> None:
    run(["ffmpeg", "-y", "-i", str(src), "-ac", "1", "-ar", "16000", str(dest)])


def load_samples(wav: Path) -> tuple[int, list[int]]:
    with wave.open(str(wav), "rb") as w:
        assert w.getsampwidth() == 2 and w.getnchannels() == 1
        rate = w.getframerate()
        raw = w.readframes(w.getnframes())
    samples = list(struct.unpack("<" + "h" * (len(raw) // 2), raw))
    return rate, samples


def rms_at(samples: list[int], rate: int, t: float, win: float = 0.05) -> float:
    i = int(t * rate)
    n = max(1, int(win * rate))
    chunk = samples[i : i + n]
    if not chunk:
        return 0.0
    return math.sqrt(sum(x * x for x in chunk) / len(chunk))


def find_beep_end(samples: list[int], rate: int, approx_start: float, search: float = 3.0) -> float:
    """Beep = short energy burst after silence; return end time of burst."""
    t0 = max(0.0, approx_start - 0.2)
    t1 = approx_start + search
    # Find first window with RMS > 1500, then track until drop below 400 for 0.15s
    step = 0.02
    t = t0
    while t < t1 and rms_at(samples, rate, t) < 1500:
        t += step
    if t >= t1:
        return approx_start  # fallback: treat approx as content start
    # track beep
    end = t
    quiet = 0.0
    while t < t1:
        r = rms_at(samples, rate, t)
        if r >= 400:
            end = t + step
            quiet = 0.0
        else:
            quiet += step
            if quiet >= 0.15 and (end - (t0 if end == t else approx_start)) > 0.3:
                break
        t += step
    return round(end, 2)


def speech_end(samples: list[int], rate: int, start: float, limit: float) -> float:
    """Last time speech (RMS>800) before limit."""
    step = 0.05
    last = start
    t = start
    while t < limit:
        if rms_at(samples, rate, t, 0.1) > 800:
            last = t
        t += step
    return round(last + 0.15, 2)  # small tail into decay


def whisper_txt(wav_or_mp3: Path, out_dir: Path) -> str:
    run(
        [
            "whisper",
            str(wav_or_mp3),
            "--model",
            WHISPER_MODEL,
            "--language",
            "French",
            "--task",
            "transcribe",
            "--output_dir",
            str(out_dir),
            "--output_format",
            "txt",
            "--fp16",
            "False",
        ]
    )
    txt = out_dir / (wav_or_mp3.stem + ".txt")
    return txt.read_text(encoding="utf-8").strip()


def cut_mp3(src: Path, dest: Path, start: float, end: float) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            f"{start:.3f}",
            "-to",
            f"{end:.3f}",
            "-i",
            str(src),
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(dest),
        ]
    )



def clean_transcription(text: str) -> str:
    t = text.strip()
    # Couper tout le blabla avant le corps (Exercice / Document / consignes orales)
    m = re.search(
        r"(?:Document\s+\d+\.?\s*)+(?:Lisez[^.]*\.\s*)?(?:Écoutez[^.]*\.\s*)?(?:puis répondez\.?\s*)?",
        t,
        flags=re.I,
    )
    # Si "Document N" n'est qu'un label en tête, le retirer ; sinon retirer intros répétées
    t = re.sub(r"^(Exercice\s+\d+\.?\s*)+", "", t, flags=re.I)
    t = re.sub(r"^Lisez les questions\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Lisez la question\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Écoutez l[\'']enregistrement[,.]?\s*puis répondez\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Écoutez le document[,.]?\s*puis répondez\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Vous (?:allez )?écouter[^.]*\.\s*", "", t, flags=re.I)
    t = re.sub(r"^Répondez aux questions\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^(Document\s+\d+\.?\s*)+", "", t, flags=re.I)
    return t.strip()

def document_nums(ex: dict) -> list[int]:
    nums = []
    for q in ex.get("questions", []):
        m = re.search(r"Document\s+(\d+)", q.get("enonce", ""), re.I)
        if m:
            n = int(m.group(1))
            if n not in nums:
                nums.append(n)
    return sorted(nums)


def public_path(audio_ref: str) -> Path:
    if audio_ref.startswith("/lib/"):
        return ROOT / "public" / audio_ref.lstrip("/")
    return ROOT / audio_ref


def lib_ref(path: Path) -> str:
    rel = path.relative_to(ROOT / "public")
    return "/" + str(rel).replace("\\", "/")


def detect_exam_style_cuts(mono: Path, n_docs: int) -> list[tuple[float, float]] | None:
    """
    Exam style: ~15s silence before each listen, beep then content.
    Returns list of (start, end) for first listen of each document.
    """
    silences = silencedetect(mono, d=2.0)
    long_sil = [(s, e, d) for s, e, d in silences if d >= 8.0]
    # Content starts after long silences that follow "Document N" (~15s reading)
    # Pattern: ~15s then content; ~11s between listens
    rate, samples = load_samples(mono)
    duration = len(samples) / rate

    # Lecture avant 1ʳᵉ écoute ≈ 15 s ; entre 2 écoutes ≈ 10–12 s (ne pas chevaucher).
    reading = [(s, e, d) for s, e, d in long_sil if 14.0 <= d <= 16.5]
    between = [(s, e, d) for s, e, d in long_sil if 9.0 <= d < 14.0]

    if len(reading) < n_docs:
        # Élargir un peu (13,5–17 s) sans descendre aux silences « entre 2 écoutes ».
        reading = [(s, e, d) for s, e, d in long_sil if 13.5 <= d <= 17.0]
    # Parfois le 1er document a une lecture plus courte (~9–11 s) : compléter
    # avec le silence ~10 s qui précède le premier silence ~15 s.
    if len(reading) == n_docs - 1 and n_docs >= 2:
        first_long = reading[0][0]
        short_reads = [
            (s, e, d)
            for s, e, d in silences
            if 8.5 <= d <= 11.5 and e < first_long - 1.0
        ]
        if short_reads:
            reading = [short_reads[-1]] + reading
    if len(reading) != n_docs:
        return None

    cuts = []
    for i in range(n_docs):
        _s, silence_end, _d = reading[i]
        beep_end = find_beep_end(samples, rate, silence_end)
        start = round(beep_end + PAD_AFTER_BEEP, 2)
        limit = duration
        for bs, _be, _bd in between:
            if bs > start + 3:
                limit = min(limit, bs)
                break
        if i + 1 < len(reading):
            limit = min(limit, reading[i + 1][0])
        end_speech = speech_end(samples, rate, start, min(limit, start + 35))
        end = round(end_speech + PAD_AFTER_LAST, 2)
        if end <= start + 2:
            return None
        # Piste trop courte / trop longue → douteux (relecture manuelle)
        if end - start < 8.0 or end - start > 45.0:
            return None
        cuts.append((start, end))
    return cuts


def detect_compact_cuts(mono: Path, n_docs: int) -> list[tuple[float, float]] | None:
    """Short file: documents separated by ~2–4 s silences."""
    silences = silencedetect(mono, d=1.2)
    rate, samples = load_samples(mono)
    duration = len(samples) / rate
    # Gaps between docs
    gaps = [(s, e, d) for s, e, d in silences if 1.5 <= d <= 5.0 and s > 3.0]
    if len(gaps) < n_docs - 1:
        # try slightly looser
        gaps = [(s, e, d) for s, e, d in silences if 1.2 <= d <= 6.0 and s > 2.0]
    if len(gaps) < n_docs - 1:
        return None

    # Take the n_docs-1 largest mid-file gaps as boundaries
    gaps_sorted = sorted(gaps, key=lambda x: -x[2])[: n_docs - 1]
    boundaries = sorted(e for _s, e, _d in gaps_sorted)  # silence_end = start of next doc

    starts = [0.0] + boundaries
    ends_raw = []
    for i in range(n_docs):
        if i < n_docs - 1:
            # silence_start of the gap after this doc
            gap = sorted(gaps_sorted, key=lambda x: x[1])[i]
            ends_raw.append(gap[0])
        else:
            ends_raw.append(duration)

    cuts = []
    for i in range(n_docs):
        # For compact files often no beep — start at speech after previous gap end
        start = starts[i]
        # Skip leading micro-silence
        t = start
        while t < ends_raw[i] - 1 and rms_at(samples, rate, t) < 500:
            t += 0.05
        start = round(t, 2)
        end_speech = speech_end(samples, rate, start, ends_raw[i])
        end = round(min(duration, end_speech + PAD_AFTER_LAST), 2)
        if end <= start + 1.5:
            return None
        # Compact = une écoute courte ; si > 45 s on a probablement collé 2 écoutes
        if end - start < 8.0 or end - start > 45.0:
            return None
        cuts.append((start, end))
    return cuts


def load_banks() -> dict[str, tuple[Path, list]]:
    """id -> (path, list of exercises)"""
    out = {}
    for p in sorted(CONTENT.glob("*/co.json")):
        data = json.loads(p.read_text(encoding="utf-8"))
        for ex in data:
            out[ex["id"]] = (p, data)
    return out


def update_exercise(ex: dict, audio_refs: list[str], transcriptions: list[str]) -> None:
    docs = document_nums(ex)
    support = ex["support"]
    support.pop("audio", None)
    support["audios"] = audio_refs
    support["transcription"] = transcriptions
    for q in ex["questions"]:
        m = re.search(r"Document\s+(\d+)", q.get("enonce", ""), re.I)
        if m:
            q["audio"] = int(m.group(1))
        elif docs:
            q["audio"] = docs[0]


def process_exercise(ex_id: str, dry_run: bool = False, keep_source: bool = False) -> bool:
    banks = load_banks()
    if ex_id not in banks:
        print(f"ERROR: exercise {ex_id} not found", file=sys.stderr)
        return False
    path, data = banks[ex_id]
    ex = next(e for e in data if e["id"] == ex_id)
    if ex.get("type_exercice") != "complet":
        print(f"SKIP {ex_id}: not complet")
        return False
    if ex["support"].get("audios"):
        print(f"SKIP {ex_id}: already multi-audio")
        return True
    docs = document_nums(ex)
    if len(docs) < 2:
        print(f"SKIP {ex_id}: fewer than 2 Document N")
        return False
    audio_ref = ex["support"].get("audio") or ""
    src = public_path(audio_ref)
    if not src.exists():
        print(f"ERROR: missing {src}", file=sys.stderr)
        return False

    n = max(docs)
    print(f"\n=== {ex_id}  {src.name}  docs=1..{n}  dur={ffprobe_duration(src):.1f}s ===")

    with tempfile.TemporaryDirectory(prefix="co-cut-") as tmp:
        tmp_p = Path(tmp)
        mono = tmp_p / "mono.wav"
        to_mono16(src, mono)
        cuts = detect_exam_style_cuts(mono, n)
        style = "exam"
        if not cuts:
            cuts = detect_compact_cuts(mono, n)
            style = "compact"
        if not cuts:
            print(f"ERROR: could not detect {n} cuts for {ex_id}", file=sys.stderr)
            return False
        print(f"style={style}")
        for i, (a, b) in enumerate(cuts, 1):
            print(f"  Doc{i}: {a:.2f} → {b:.2f} ({b - a:.1f}s)")

        if dry_run:
            return True

        stem = src.stem
        parent = src.parent
        out_paths = []
        transcriptions = []
        for i, (a, b) in enumerate(cuts, 1):
            dest = parent / f"{stem}-{i}.mp3"
            cut_mp3(src, dest, a, b)
            out_paths.append(dest)
            # Whisper each clip
            clip_wav = tmp_p / f"clip{i}.wav"
            to_mono16(dest, clip_wav)
            try:
                text = whisper_txt(clip_wav, tmp_p / f"w{i}")
            except subprocess.CalledProcessError as e:
                print(f"WARN whisper failed doc{i}: {e}", file=sys.stderr)
                text = ""
            # Clean repeated lines (double listen leak) — keep unique consecutive
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
            dedup = []
            for ln in lines:
                if not dedup or dedup[-1] != ln:
                    dedup.append(ln)
            # If exact duplicate of first half, keep half
            if len(dedup) >= 2 and len(dedup) % 2 == 0:
                half = len(dedup) // 2
                if dedup[:half] == dedup[half:]:
                    dedup = dedup[:half]
            transcriptions.append(clean_transcription(" ".join(dedup) if dedup else text))
            print(f"  wrote {dest.name}  tr={transcriptions[-1][:80]}…")

        refs = [lib_ref(p) for p in out_paths]
        update_exercise(ex, refs, transcriptions)
        # Recharger la banque juste avant écriture (évite d’écraser d’autres exercices
        # traités en parallèle / corrigés entre-temps).
        fresh = json.loads(path.read_text(encoding="utf-8"))
        for i, item in enumerate(fresh):
            if item.get("id") == ex_id:
                fresh[i] = ex
                break
        else:
            fresh.append(ex)
        path.write_text(json.dumps(fresh, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  updated {path.relative_to(ROOT)}")

        if not keep_source:
            src.unlink()
            print(f"  removed {src.name}")

    return True


def list_pending() -> list[str]:
    ids = []
    for p in sorted(CONTENT.glob("*/co.json")):
        for ex in json.loads(p.read_text(encoding="utf-8")):
            if ex.get("type_exercice") != "complet":
                continue
            if ex["support"].get("audios"):
                continue
            if len(document_nums(ex)) >= 2:
                ids.append(ex["id"])
    return ids


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--exercise", help="Exercise id to process")
    ap.add_argument("--all-pending", action="store_true", help="All multi-Document still mono")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--keep-source", action="store_true", help="Do not delete original MP3")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    if args.list:
        for i in list_pending():
            print(i)
        return 0

    targets = []
    if args.all_pending:
        targets = list_pending()
    elif args.exercise:
        targets = [args.exercise]
    else:
        ap.print_help()
        return 2

    ok = True
    for eid in targets:
        if not process_exercise(eid, dry_run=args.dry_run, keep_source=args.keep_source):
            ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
