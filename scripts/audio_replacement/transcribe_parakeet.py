#!/usr/bin/env python3
"""Local French ASR with native Parakeet TDT token timing and estimated word bounds.

Model: official sherpa-onnx GitHub Parakeet TDT 0.6b v3 INT8 distribution.
Words aggregate SentencePiece fragments. TDT times have an 80ms frame step;
durations represent predicted frame skips, not precise acoustic word endings.
Outputs are automatic drafts and must be reviewed before exact audio cuts.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import importlib.metadata
import json
from pathlib import Path
import re
import time

from transcribe_words import decode_audio_local, sha256, write_json, speech_processing_windows


def group_words(tokens, timestamps, durations, offset, chunk_index):
    words = []
    pending_boundary = False
    for i, (token, timestamp, duration) in enumerate(zip(tokens, timestamps, durations)):
        if not token:
            continue
        starts_word = pending_boundary or token.startswith((" ", "▁", "\t", "\n"))
        piece = token.replace("▁", " ").lstrip() if starts_word else token
        if not piece:
            pending_boundary = True
            continue
        pending_boundary = False
        if words and all(character in ",.;:!?%)]}»”\"" for character in piece):
            starts_word = False
        start = offset + float(timestamp)
        end = start + float(duration)
        if starts_word or not words:
            words.append({"word": piece, "start": start, "end": end, "chunk_index": chunk_index,
                          "native_token_indices": [i], "zero_duration_token": float(duration) == 0})
        else:
            word = words[-1]
            word["word"] += piece
            word["end"] = max(word["end"], end)
            word["native_token_indices"].append(i)
            word["zero_duration_token"] |= float(duration) == 0
    return words


def marker_candidates(words):
    """Annotations only: neither discards speech nor classifies processing windows as dialogues."""
    characters, positions = [], []
    for i, word in enumerate(words):
        if characters:
            characters.append(" ")
        start = sum(map(len, characters))
        characters.append(word["word"])
        positions.append((start, start + len(word["word"]), i))
    text = "".join(characters)
    patterns = {
        "instruction_candidate": r"\b(?:vous allez entendre|vous allez écouter|vous devez|écoutez|répondez|choisissez|associez|cochez|lisez|entourez|complétez|notez|regardez|observez|indiquez|répétez|reliez|écrivez)\b",
        "exercise_label_candidate": r"\b(?:activité|exercice|document|question|dialogue|conversation|numéro|piste)\b(?:\s+(?:\d+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix))?",
        "number_candidate": r"(?<!\w)\d+(?!\w)",
    }
    markers = []
    for kind, pattern in patterns.items():
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            indices = [i for start, end, i in positions if end > match.start() and start < match.end()]
            if not indices:
                continue
            first, last = min(indices), max(indices)
            markers.append({"type": kind, "text": match.group(), "start": words[first]["start"],
                            "end": words[last]["end"], "word_indices": indices,
                            "context": " ".join(w["word"] for w in words[max(0, first-5):last+9]),
                            "requires_review": True})
    return sorted(markers, key=lambda marker: (marker["start"], marker["type"]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, action="append", default=[])
    parser.add_argument("--input-dir", type=Path)
    parser.add_argument("--catalogue", type=Path, help="Source catalogue JSON with source_id/source_file")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--model-dir", type=Path, required=True)
    parser.add_argument("--threads", type=int, default=3)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    sources = list(args.input)
    source_metadata = {}
    if args.catalogue:
        catalogue = json.loads(args.catalogue.read_text())
        for item in catalogue["sources"]:
            source = Path(item["source_file"]).resolve()
            sources.append(source)
            source_metadata[str(source)] = item
    if args.input_dir:
        sources += sorted(p for p in args.input_dir.rglob("*") if p.suffix.lower() == ".mp3")
    sources = list(dict.fromkeys(p.resolve() for p in sources))
    if not sources or (not args.output and not args.output_dir):
        parser.error("Provide inputs and --output or --output-dir")
    if args.output and (len(sources) != 1 or args.output_dir):
        parser.error("--output requires one source and excludes --output-dir")
    for source in sources:
        if not source.is_file():
            parser.error(f"Missing source: {source}")

    import sherpa_onnx

    encoder = next(args.model_dir.glob("encoder*.onnx"))
    decoder = next(args.model_dir.glob("decoder*.onnx"))
    joiner = next(args.model_dir.glob("joiner*.onnx"))
    tokens_file = args.model_dir / "tokens.txt"
    started = time.perf_counter()
    params = {
        "pipeline_version": 4, "engine": "sherpa-onnx", "version": importlib.metadata.version("sherpa-onnx"),
        "model": "nemo-parakeet-tdt-0.6b-v3-int8", "language": "multilingual_auto_includes_fr",
        "model_files_sha256": {str(p): sha256(p) for p in (encoder, decoder, joiner, tokens_file)},
        "provider": "cpu", "decoding_method": "greedy_search", "native_tdt_frame_step_seconds": 0.08,
        "processing_windows": "Silero VAD utterances merged into <=27s processing windows for inputs >=29s; max 26s speech, 350ms silence, 200ms padding",
    }
    recognizer = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=str(encoder), decoder=str(decoder), joiner=str(joiner), tokens=str(tokens_file),
        num_threads=args.threads, sample_rate=16000, decoding_method="greedy_search",
        provider="cpu", model_type="nemo_transducer",
    )
    load_seconds = time.perf_counter() - started
    records, failures = [], 0
    def save_progress():
        if not args.output_dir:
            return
        summary = {"sources": records, "failed": failures, "model_load_seconds": load_seconds,
                   "parameters": params, "total": len(sources), "processed": len(records),
                   "transcribed": sum(r["status"] == "transcribed" for r in records),
                   "skipped": sum(r["status"] == "skipped" for r in records),
                   "updated_utc": datetime.now(timezone.utc).isoformat(),
                   "complete": len(records) == len(sources)}
        write_json(args.output_dir / "batch-summary.json", summary)
        write_json(args.output_dir / "batch-progress.json", summary)
        write_json(args.output_dir / "index.json", {r.get("source_id", r["source"]): r for r in records})

    save_progress()
    for source in sources:
        digest = sha256(source)
        metadata = source_metadata.get(str(source), {})
        source_id = metadata.get("source_id", f"{source.stem}-{digest[:12]}")
        if metadata.get("sha256") and metadata["sha256"] != digest:
            raise RuntimeError(f"Catalogue SHA256 differs for {source_id}")
        filename = re.sub(r"[^A-Za-z0-9_.:-]", "_", source_id) + ".json"
        destination = args.output or args.output_dir / filename
        if destination.exists() and not args.force:
            old = json.loads(destination.read_text())
            if old.get("status") == "transcribed" and old.get("source_sha256") == digest and old.get("parameters") == params:
                record = {"source_id": source_id, "source": str(source), "output": str(destination), "status": "skipped"}
                records.append(record)
                save_progress()
                print(json.dumps(record, ensure_ascii=False), flush=True)
                continue
        wall_start, cpu_start = time.perf_counter(), time.process_time()
        result = {
            "status": "transcribing", "source_id": source_id, "source": str(source), "source_sha256": digest,
            "source_metadata": metadata, "parameters": params,
            "quality": "automatic_draft_requires_review",
            "word_timing_method": "aggregate native TDT token emissions and predicted skip durations; estimated bounds, 80ms frame step",
            "provenance": "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2",
        }
        try:
            audio = decode_audio_local(source)
            duration = len(audio) / 16000
            if duration < 29:
                windows = [{"start": 0, "end": len(audio)}]
            else:
                windows = speech_processing_windows(audio)
            chunks, words = [], []
            for chunk_index, window in enumerate(windows):
                offset, end = window["start"] / 16000, window["end"] / 16000
                stream = recognizer.create_stream()
                stream.accept_waveform(16000, audio[window["start"]:window["end"]])
                recognizer.decode_stream(stream)
                native = stream.result
                tokens = list(native.tokens)
                timestamps = list(native.timestamps)
                durations = list(native.durations)
                if not (len(tokens) == len(timestamps) == len(durations)):
                    raise RuntimeError("Native token/timestamp/duration arrays differ in length")
                chunk_words = group_words(tokens, timestamps, durations, offset, chunk_index)
                reconstructed_text = " ".join(word["word"] for word in chunk_words)
                normalize_spaces = lambda value: re.sub(r"\s+", " ", value).strip()
                chunks.append({"start": offset, "end": end, "text": native.text,
                               "tokens": tokens, "timestamps": timestamps, "durations": durations,
                               "ys_log_probs": list(native.ys_log_probs),
                               "reconstructed_word_text": reconstructed_text,
                               "word_text_matches_result": normalize_spaces(reconstructed_text) == normalize_spaces(native.text)})
                words.extend(chunk_words)
            result.update({"status": "transcribed", "text": " ".join(c["text"].strip() for c in chunks).strip(),
                           "duration_seconds": duration, "chunks": chunks, "words": words,
                           "word_text_matches_result": all(c["word_text_matches_result"] for c in chunks),
                           "instruction_numbering_candidates": marker_candidates(words),
                           "processing_windows": [{"start": w["start"] / 16000, "end": w["end"] / 16000} for w in windows]})
        except Exception as error:
            failures += 1
            result.update({"status": "failed", "error_type": type(error).__name__, "error": str(error)})
        result["wall_seconds"] = time.perf_counter() - wall_start
        result["cpu_seconds"] = time.process_time() - cpu_start
        write_json(destination, result)
        record = {"source_id": source_id, "source": str(source), "output": str(destination), "status": result["status"],
                  "wall_seconds": result["wall_seconds"], "cpu_seconds": result["cpu_seconds"]}
        records.append(record)
        print(json.dumps(record, ensure_ascii=False), flush=True)
        save_progress()
    print(json.dumps({"failed": failures, "sources_processed": len(records), "model_load_seconds": load_seconds}, ensure_ascii=False), flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
