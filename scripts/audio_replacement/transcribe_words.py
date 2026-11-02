#!/usr/bin/env python3
"""Local French ASR with word timestamps; never uploads source audio.

Example:
  asr-venv/bin/python transcribe_words.py --model /path/to/ctranslate2-model \
    --input-dir /workspace/attachments --output-dir /workspace/work/source-asr

Model names require a populated Hugging Face cache unless --download-model is
explicitly supplied. Downloading a model still obeys the environment proxy.
ASR is a draft: punctuation, names, speaker changes and timings need review.
"""
from __future__ import annotations

import argparse
import dataclasses
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import platform
import subprocess
import sys
import time


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)


def decode_audio_local(path: Path, sampling_rate: int = 16000):
    """Decode via the installed ffmpeg, avoiding version-specific PyAV APIs."""
    import numpy as np
    process = subprocess.run(
        ["ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error", "-i", str(path),
         "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "1", "-ar", str(sampling_rate), "pipe:1"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
    )
    if process.returncode:
        raise RuntimeError(process.stderr.decode("utf-8", errors="replace"))
    return np.frombuffer(process.stdout, dtype=np.float32).copy()


def speech_processing_windows(audio):
    """Merge short VAD utterances into <=27s windows with their original pauses."""
    from faster_whisper.vad import get_speech_timestamps, VadOptions
    utterances = get_speech_timestamps(
        audio, VadOptions(max_speech_duration_s=26, min_silence_duration_ms=350, speech_pad_ms=200),
    )
    windows = []
    for utterance in utterances:
        if windows and utterance["end"] - windows[-1]["start"] <= 27 * 16000:
            windows[-1]["end"] = utterance["end"]
        else:
            windows.append(dict(utterance))
    return windows


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, action="append", default=[])
    parser.add_argument("--input-dir", type=Path)
    parser.add_argument("--output", type=Path, help="Single input JSON destination")
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--model", default="small")
    parser.add_argument("--model-cache", type=Path, default=Path(__file__).parent / "model-cache")
    parser.add_argument("--download-model", action="store_true")
    parser.add_argument("--threads", type=int, default=min(3, os.cpu_count() or 1))
    parser.add_argument("--beam-size", type=int, default=5)
    parser.add_argument("--language", default="fr")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    paths = list(args.input)
    if args.input_dir:
        paths.extend(sorted(p for p in args.input_dir.rglob("*") if p.suffix.lower() == ".mp3"))
    args.paths = list(dict.fromkeys(path.resolve() for path in paths))
    if not args.paths:
        parser.error("Supply --input or --input-dir containing MP3 files")
    if args.output and (len(args.paths) != 1 or args.output_dir):
        parser.error("--output requires exactly one input and excludes --output-dir")
    if not args.output and not args.output_dir:
        parser.error("Supply --output for one source or --output-dir for a batch")
    for path in args.paths:
        if not path.is_file():
            parser.error(f"Input does not exist: {path}")
    return args


def main() -> int:
    args = arguments()
    from faster_whisper import WhisperModel

    params = {
        "model": args.model,
        "device": "cpu",
        "compute_type": "int8",
        "language": args.language,
        "beam_size": args.beam_size,
        "word_timestamps": True,
        "vad_filter": True,
        "condition_on_previous_text": False,
    }
    versions = {package: importlib.metadata.version(package)
                for package in ("faster-whisper", "ctranslate2", "av", "onnxruntime", "huggingface-hub")}
    versions["python"] = platform.python_version()
    started = time.perf_counter()
    model = WhisperModel(
        args.model, device="cpu", compute_type="int8", cpu_threads=args.threads,
        download_root=str(args.model_cache), local_files_only=not args.download_model,
    )
    load_seconds = time.perf_counter() - started
    successes = skipped = failed = 0
    records = []
    for source in args.paths:
        digest = sha256(source)
        destination = args.output or args.output_dir / f"{source.stem}-{digest[:12]}.json"
        if destination.is_file() and not args.force:
            existing = json.loads(destination.read_text())
            if (existing.get("status") == "transcribed"
                and existing.get("source_sha256") == digest
                and existing.get("parameters") == params):
                skipped += 1
                records.append({"source": str(source), "output": str(destination), "status": "skipped"})
                print(json.dumps(records[-1], ensure_ascii=False), flush=True)
                continue
        wall_start, cpu_start = time.perf_counter(), time.process_time()
        result = {
            "status": "transcribing", "source": str(source), "source_sha256": digest,
            "parameters": params, "versions": versions,
            "quality": "automatic_draft_requires_review",
        }
        try:
            segments_iterator, info = model.transcribe(
                decode_audio_local(source), language=args.language, beam_size=args.beam_size,
                word_timestamps=True, vad_filter=True,
                condition_on_previous_text=False,
            )
            segments = [dataclasses.asdict(segment) for segment in segments_iterator]
            result.update({
                "status": "transcribed", "text": "".join(s["text"] for s in segments).strip(),
                "segments": segments,
                "words": [word for segment in segments for word in (segment.get("words") or [])],
                "duration_seconds": info.duration,
                "speech_duration_seconds": info.duration_after_vad,
                "detected_language": info.language,
                "language_probability": info.language_probability,
            })
            successes += 1
        except Exception as error:
            result.update({"status": "failed", "error_type": type(error).__name__, "error": str(error)})
            failed += 1
        result["wall_seconds"] = time.perf_counter() - wall_start
        result["cpu_seconds"] = time.process_time() - cpu_start
        write_json(destination, result)
        records.append({"source": str(source), "output": str(destination), "status": result["status"],
                        "wall_seconds": result["wall_seconds"], "cpu_seconds": result["cpu_seconds"]})
        print(json.dumps(records[-1], ensure_ascii=False), flush=True)
    summary = {"model_load_seconds": load_seconds, "transcribed": successes, "skipped": skipped,
               "failed": failed, "sources": records, "parameters": params, "versions": versions}
    if args.output_dir:
        write_json(args.output_dir / "batch-summary.json", summary)
    print(json.dumps({key: value for key, value in summary.items() if key != "sources"}, ensure_ascii=False), flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
