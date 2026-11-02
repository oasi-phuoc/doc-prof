#!/usr/bin/env python3
"""French ASR using the official sherpa-onnx GitHub Whisper distribution.

Runs locally. Emits genuine segment timestamps; token timestamps are enabled only
when the ONNX decoder has attention outputs. Never treats BPE tokens as words.
Long recordings are VAD-split before decoding to avoid sherpa's 29.5s truncation.
"""
from __future__ import annotations

import argparse
import importlib.metadata
import json
from pathlib import Path
import time

from transcribe_words import sha256, write_json, decode_audio_local, speech_processing_windows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, action="append", default=[])
    parser.add_argument("--input-dir", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--model-dir", type=Path, required=True)
    parser.add_argument("--threads", type=int, default=3)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    sources = list(args.input)
    if args.input_dir:
        sources += sorted(p for p in args.input_dir.rglob("*") if p.suffix.lower() == ".mp3")
    sources = list(dict.fromkeys(p.resolve() for p in sources))
    if not sources or (not args.output and not args.output_dir):
        parser.error("Provide inputs and --output or --output-dir")
    if args.output and (len(sources) != 1 or args.output_dir):
        parser.error("--output requires one source and excludes --output-dir")
    for source in sources:
        if not source.is_file():
            parser.error(f"Missing input: {source}")
    encoder = next(args.model_dir.glob("*-encoder.int8.onnx"))
    decoder = next(args.model_dir.glob("*-decoder.int8.onnx"))
    tokens = next(args.model_dir.glob("*-tokens.txt"))

    import onnxruntime as ort
    import sherpa_onnx

    model_loading_start = time.perf_counter()
    session_options = ort.SessionOptions()
    session_options.intra_op_num_threads = args.threads
    inspection_session = ort.InferenceSession(str(decoder), sess_options=session_options, providers=["CPUExecutionProvider"])
    decoder_outputs = [out.name for out in inspection_session.get_outputs()]
    token_timestamps_available = len(decoder_outputs) >= 4
    del inspection_session
    model_files = {str(p): sha256(p) for p in (encoder, decoder, tokens)}
    params = {
        "engine": "sherpa-onnx", "version": importlib.metadata.version("sherpa-onnx"),
        "model_files_sha256": model_files, "language": "fr", "task": "transcribe",
        "provider": "cpu", "decoding_method": "greedy_search",
        "enable_segment_timestamps": True, "enable_token_timestamps": token_timestamps_available,
        "long_audio_segmentation": "Silero VAD utterances merged into <=27s processing windows; max 26s speech, 350ms silence, 200ms padding",
    }
    recognizer = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=str(encoder), decoder=str(decoder), tokens=str(tokens),
        language="fr", task="transcribe", num_threads=args.threads, provider="cpu",
        enable_token_timestamps=token_timestamps_available, enable_segment_timestamps=True,
    )
    model_load_seconds = time.perf_counter() - model_loading_start
    records = []
    failures = 0
    for source in sources:
        source_hash = sha256(source)
        destination = args.output or args.output_dir / f"{source.stem}-{source_hash[:12]}.json"
        if destination.exists() and not args.force:
            old = json.loads(destination.read_text())
            if old.get("status") == "transcribed" and old.get("source_sha256") == source_hash and old.get("parameters") == params:
                record = {"source": str(source), "output": str(destination), "status": "skipped"}
                records.append(record)
                print(json.dumps(record, ensure_ascii=False), flush=True)
                continue
        started, cpu_started = time.perf_counter(), time.process_time()
        result = {
            "status": "transcribing", "source": str(source), "source_sha256": source_hash,
            "parameters": params, "decoder_outputs": decoder_outputs,
            "token_timestamps_available": token_timestamps_available,
            "word_timestamps_available": False,
            "quality": "automatic_draft_requires_review",
            "provenance": "https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models",
        }
        try:
            audio = decode_audio_local(source, sampling_rate=16000)
            duration = len(audio) / 16000
            if duration < 29:
                windows = [{"start": 0, "end": len(audio)}]
            else:
                windows = speech_processing_windows(audio)
            chunks, segments = [], []
            for window in windows:
                offset, end = window["start"] / 16000, window["end"] / 16000
                if end - offset >= 29:
                    raise RuntimeError("VAD generated a >=29s chunk: refusing implicit truncation")
                stream = recognizer.create_stream()
                stream.accept_waveform(16000, audio[window["start"]:window["end"]])
                recognizer.decode_stream(stream)
                native = stream.result
                chunk = {"start": offset, "end": end, "text": native.text, "language": native.lang}
                for name in ("tokens", "timestamps", "durations", "segment_texts", "segment_timestamps", "segment_durations"):
                    try:
                        chunk[name] = list(getattr(native, name))
                    except UnicodeDecodeError as error:
                        chunk[name] = []
                        chunk[f"{name}_error"] = str(error)
                chunks.append(chunk)
                for text, timestamp, length in zip(chunk["segment_texts"], chunk["segment_timestamps"], chunk["segment_durations"]):
                    segments.append({"text": text, "start": offset + timestamp, "end": offset + timestamp + length})
            result.update({
                "status": "transcribed", "text": " ".join(chunk["text"].strip() for chunk in chunks).strip(),
                "duration_seconds": duration, "chunks": chunks, "segments": segments,
                "speech_windows": [{"start": w["start"] / 16000, "end": w["end"] / 16000} for w in windows],
            })
        except Exception as error:
            failures += 1
            result.update({"status": "failed", "error_type": type(error).__name__, "error": str(error)})
        result["wall_seconds"] = time.perf_counter() - started
        result["cpu_seconds"] = time.process_time() - cpu_started
        write_json(destination, result)
        record = {"source": str(source), "output": str(destination), "status": result["status"],
                  "wall_seconds": result["wall_seconds"], "cpu_seconds": result["cpu_seconds"]}
        records.append(record)
        print(json.dumps(record, ensure_ascii=False), flush=True)
    summary = {"sources": records, "failed": failures, "model_load_seconds": model_load_seconds, "parameters": params}
    if args.output_dir:
        write_json(args.output_dir / "batch-summary.json", summary)
    print(json.dumps({k: v for k, v in summary.items() if k != "sources"}, ensure_ascii=False), flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
