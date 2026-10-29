#!/usr/bin/env python3
"""
Découpe les CO association_images multi-dialogues en pistes mini (1 écoute / dialogue).

Règles : comme decoupage-audio-co — 0,5 s après bip, 1 s après dernière phrase,
ignore la 2ᵉ écoute. Met à jour support.audios[] + transcription[].
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


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, capture_output=True, text=True)


def ffprobe_duration(path: Path) -> float:
    out = run(
        ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]
    )
    return float(out.stdout.strip())


def silencedetect(path: Path, noise: str = "-35dB", d: float = 1.0) -> list[tuple[float, float, float]]:
    proc = subprocess.run(
        ["ffmpeg", "-i", str(path), "-af", f"silencedetect=noise={noise}:d={d}", "-f", "null", "-"],
        capture_output=True,
        text=True,
    )
    starts, ends = [], []
    for line in proc.stderr.splitlines():
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
    return rate, list(struct.unpack("<" + "h" * (len(raw) // 2), raw))


def rms_at(samples: list[int], rate: int, t: float, win: float = 0.05) -> float:
    i = int(t * rate)
    n = max(1, int(win * rate))
    chunk = samples[i : i + n]
    if not chunk:
        return 0.0
    return math.sqrt(sum(x * x for x in chunk) / len(chunk))


def speech_islands(
    samples: list[int], rate: int, min_dur: float = 2.0, thr: float = 600
) -> list[tuple[float, float]]:
    """Contiguous speech regions above thr, merged across micro-gaps < 0.8s."""
    duration = len(samples) / rate
    step = 0.05
    raw: list[tuple[float, float]] = []
    t = 0.0
    while t < duration:
        if rms_at(samples, rate, t) >= thr:
            s = t
            while t < duration and rms_at(samples, rate, t) >= thr * 0.5:
                t += step
            raw.append((s, t))
        t += step
    if not raw:
        return []
    merged = [raw[0]]
    for s, e in raw[1:]:
        ps, pe = merged[-1]
        # Micro-pauses dans un même tour de parole (pas entre 2 écoutes ~3 s+)
        if s - pe < 1.2:
            merged[-1] = (ps, e)
        else:
            merged.append((s, e))
    return [(s, e) for s, e in merged if e - s >= min_dur]


def beep_end(samples: list[int], rate: int, approx_start: float) -> float:
    t0 = max(0.0, approx_start - 0.3)
    t1 = approx_start + 2.5
    t = t0
    while t < t1 and rms_at(samples, rate, t) < 1500:
        t += 0.02
    if t >= t1:
        return approx_start
    end = t
    quiet = 0.0
    while t < t1:
        r = rms_at(samples, rate, t)
        if r >= 400:
            end = t + 0.02
            quiet = 0.0
        else:
            quiet += 0.02
            if quiet >= 0.12:
                break
        t += 0.02
    return round(end, 2)


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


def whisper_txt(path: Path, out_dir: Path) -> str:
    run(
        [
            "whisper",
            str(path),
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
    return (out_dir / (path.stem + ".txt")).read_text(encoding="utf-8").strip()


def clean_transcription(text: str) -> str:
    t = text.strip()
    t = re.sub(r"^(Exercice\s+\d+\.?\s*)+", "", t, flags=re.I)
    t = re.sub(r"^(Dialogue|Message|Document)\s+\d+\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^numéro\s+\d+\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Lisez[^.]*\.\s*", "", t, flags=re.I)
    t = re.sub(r"^Écoutez[^.]*\.\s*", "", t, flags=re.I)
    t = re.sub(r"^Sous-titrage[^.]*\.?\s*", "", t, flags=re.I)
    t = re.sub(
        r"^Il y a \d+ secondes de pause[^.]*\.\s*",
        "",
        t,
        flags=re.I,
    )
    return t.strip()


def split_bank_transcription(tr: str, n: int) -> list[str] | None:
    if not tr.strip():
        return None
    m = re.search(r"(Dialogue|Message|Document)\s+\d+", tr, re.I)
    if m:
        tr = tr[m.start() :]
    parts = re.split(r"\s*(?:Dialogue|Message|Document)\s+\d+\s*[—\-–:.]?\s*", tr, flags=re.I)
    parts = [clean_transcription(p) for p in parts if p.strip()]
    # Drop pure instruction blobs
    parts = [p for p in parts if len(p) > 20 and "Regardez les images" not in p]
    if len(parts) >= n:
        # If double (exact 2n), take first half
        if len(parts) == 2 * n and parts[:n] == parts[n:]:
            return parts[:n]
        return parts[:n]
    return None


def select_islands(
    islands: list[tuple[float, float]],
    n: int,
    silences: list[tuple[float, float, float]] | None = None,
) -> list[tuple[float, float]] | None:
    """Pick n first-listen islands (drop 2nd plays / intro)."""
    if len(islands) == n:
        return islands

    work = list(islands)

    # Style examen : long silence de lecture (≥ 12 s) → ignorer tout ce qui précède
    if silences:
        long_ends = [e for _s, e, d in silences if d >= 12.0]
        if long_ends:
            t0 = long_ends[0]
            after = [(a, b) for a, b in work if a >= t0 - 0.5]
            if len(after) >= n:
                work = after

    # Retirer intros orales courtes en tête
    while len(work) > n and (work[0][1] - work[0][0]) < 5.0:
        work = work[1:]

    if len(work) == n:
        return work

    # Double écoute : L1, L2, L1, L2… → garder les L1
    if len(work) >= 2 * n:
        pair = work[: 2 * n]
        return [pair[i] for i in range(0, 2 * n, 2)]

    for candidate in (work[1:], work[:-1]):
        if len(candidate) == n:
            return candidate
        if len(candidate) >= 2 * n:
            pair = candidate[: 2 * n]
            return [pair[i] for i in range(0, 2 * n, 2)]

    if len(work) > n:
        scored = sorted(work, key=lambda x: -(x[1] - x[0]))
        chosen = sorted(scored[:n], key=lambda x: x[0])
        if all(e - s >= 4.0 for s, e in chosen) and (chosen[-1][1] - chosen[0][0]) > 20:
            return chosen
    return None


def public_path(audio_ref: str) -> Path:
    if audio_ref.startswith("/lib/"):
        return ROOT / "public" / audio_ref.lstrip("/")
    return ROOT / audio_ref


def lib_ref(path: Path) -> str:
    return "/" + str(path.relative_to(ROOT / "public")).replace("\\", "/")


def load_banks() -> dict[str, tuple[Path, list]]:
    out = {}
    for p in sorted(CONTENT.glob("*/co.json")):
        data = json.loads(p.read_text(encoding="utf-8"))
        for ex in data:
            out[ex["id"]] = (p, data)
    return out


def list_pending() -> list[str]:
    ids = []
    for p in sorted(CONTENT.glob("*/co.json")):
        for ex in json.loads(p.read_text(encoding="utf-8")):
            if ex.get("type_exercice") != "association_images":
                continue
            if ex["support"].get("audios"):
                continue
            if (ex["support"].get("nb_dialogues") or 0) >= 2 and ex["support"].get("audio"):
                ids.append(ex["id"])
    return ids


def process_exercise(ex_id: str, dry_run: bool = False, keep_source: bool = False) -> bool:
    banks = load_banks()
    if ex_id not in banks:
        print(f"ERROR: {ex_id} not found", file=sys.stderr)
        return False
    path, _data = banks[ex_id]
    # Always reload fresh
    data = json.loads(path.read_text(encoding="utf-8"))
    ex = next(e for e in data if e["id"] == ex_id)
    if ex.get("type_exercice") != "association_images":
        print(f"SKIP {ex_id}: not association_images")
        return False
    if ex["support"].get("audios"):
        print(f"SKIP {ex_id}: already multi")
        return True
    n = int(ex["support"].get("nb_dialogues") or 0)
    if n < 2:
        print(f"SKIP {ex_id}: nb_dialogues < 2")
        return False
    audio_ref = ex["support"].get("audio") or ""
    src = public_path(audio_ref)
    if not src.exists():
        print(f"ERROR: missing {src}", file=sys.stderr)
        return False

    print(f"\n=== {ex_id}  {src.name}  dialogues={n}  dur={ffprobe_duration(src):.1f}s ===")
    bank_trs = split_bank_transcription(ex["support"].get("transcription") or "", n)

    with tempfile.TemporaryDirectory(prefix="co-assoc-") as tmp:
        tmp_p = Path(tmp)
        mono = tmp_p / "mono.wav"
        to_mono16(src, mono)
        rate, samples = load_samples(mono)
        silences = silencedetect(mono, d=1.2)
        islands = speech_islands(samples, rate)
        print(f"  speech islands ({len(islands)}): " + ", ".join(f"{a:.1f}-{b:.1f}" for a, b in islands))
        chosen = select_islands(islands, n, silences)
        if not chosen:
            print(f"ERROR: could not select {n} islands from {len(islands)}", file=sys.stderr)
            return False

        cuts: list[tuple[float, float]] = []
        for a, b in chosen:
            be = beep_end(samples, rate, a)
            # If island starts with speech (no beep), beep_end ≈ a
            start = round(be + PAD_AFTER_BEEP, 2) if be > a + 0.3 else round(a, 2)
            # Don't start after speech began
            if start > a + 1.5:
                start = round(a, 2)
            end = round(b + PAD_AFTER_LAST, 2)
            if end - start < 2.0:
                print(f"ERROR: cut too short {start}-{end}", file=sys.stderr)
                return False
            cuts.append((start, end))
            print(f"  → {start:.2f} → {end:.2f} ({end - start:.1f}s)")

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
            if bank_trs and i <= len(bank_trs) and len(bank_trs[i - 1]) > 20:
                text = bank_trs[i - 1]
            else:
                clip = tmp_p / f"c{i}.wav"
                to_mono16(dest, clip)
                try:
                    text = clean_transcription(whisper_txt(clip, tmp_p / f"w{i}"))
                except subprocess.CalledProcessError:
                    text = bank_trs[i - 1] if bank_trs and i <= len(bank_trs) else ""
            if "Sous-titrage" in text or len(text) < 15:
                if bank_trs and i <= len(bank_trs):
                    text = bank_trs[i - 1]
            transcriptions.append(text)
            print(f"  wrote {dest.name}  tr={text[:70]}…")

        refs = [lib_ref(p) for p in out_paths]
        support = ex["support"]
        support.pop("audio", None)
        support["audios"] = refs
        support["transcription"] = transcriptions
        # situations[].dialogue already 1-based dialogue numbers — unchanged

        fresh = json.loads(path.read_text(encoding="utf-8"))
        for i, item in enumerate(fresh):
            if item.get("id") == ex_id:
                fresh[i] = ex
                break
        path.write_text(json.dumps(fresh, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  updated {path.relative_to(ROOT)}")
        if not keep_source:
            src.unlink()
            print(f"  removed {src.name}")
    return True


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--exercise")
    ap.add_argument("--all-pending", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--keep-source", action="store_true")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()
    if args.list:
        for i in list_pending():
            print(i)
        return 0
    targets = list_pending() if args.all_pending else ([args.exercise] if args.exercise else [])
    if not targets:
        ap.print_help()
        return 2
    ok = True
    for eid in targets:
        if not process_exercise(eid, dry_run=args.dry_run, keep_source=args.keep_source):
            ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
