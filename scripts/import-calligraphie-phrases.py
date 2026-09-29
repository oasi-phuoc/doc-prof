#!/usr/bin/env python3
"""Importe un document de phrases corrigées dans sentences.phrase des banques Voc.

Format attendu (voir scripts/data/calligraphie-phrases-corrigees.txt) :
  ##### FICHIER fr-xxx.ts #####
  === word-id | label | subgroup ===
  --- A1 ---
  1. Phrase…
  --- A2 ---
  …
  --- B1 ---
  …

Ne modifie ni trous ni dictee.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK_DIR = ROOT / "src" / "francais" / "vocab-banks"
DEFAULT_DOC = ROOT / "scripts" / "data" / "calligraphie-phrases-corrigees.txt"

FILE_RE = re.compile(r"^##### FICHIER (\S+) #####\s*$")
BLOCK_RE = re.compile(r"^=== (.+?) \| (.+?) \| (.+?) ===\s*$")
LEVEL_RE = re.compile(r"^---\s*(A1|A2|B1)\s*---\s*$", re.I)
PHRASE_RE = re.compile(r"^\d+\.\s+(.+?)\s*$")


def parse_document(path: Path) -> dict[str, dict[str, dict[str, list[str]]]]:
    """fichier → wordId → {a1|a2|b1: [phrases]}."""
    by_file: dict[str, dict[str, dict[str, list[str]]]] = {}
    current_file: str | None = None
    current_id: str | None = None
    current_level: str | None = None

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip("\n")
        m_file = FILE_RE.match(line)
        if m_file:
            current_file = m_file.group(1)
            by_file.setdefault(current_file, {})
            current_id = None
            current_level = None
            continue
        m_block = BLOCK_RE.match(line)
        if m_block:
            if not current_file:
                raise SystemExit(f"Bloc hors fichier : {line}")
            current_id = m_block.group(1).strip()
            by_file[current_file][current_id] = {"a1": [], "a2": [], "b1": []}
            current_level = None
            continue
        m_level = LEVEL_RE.match(line)
        if m_level:
            current_level = m_level.group(1).lower()
            continue
        m_ph = PHRASE_RE.match(line.strip())
        if m_ph and current_file and current_id and current_level:
            phrase = m_ph.group(1).strip()
            if phrase:
                by_file[current_file][current_id][current_level].append(phrase)
    return by_file


def apply_to_bank(path: Path, phrases_by_id: dict[str, dict[str, list[str]]]) -> tuple[int, int, int]:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    out: list[str] = []
    updated = missing = words = 0
    for line in lines:
        stripped = line.strip()
        if not (stripped.startswith("{") and '"label":' in stripped and '"sentences":' in stripped):
            out.append(line)
            continue
        trailing = ""
        payload = stripped
        if payload.endswith(","):
            trailing = ","
            payload = payload[:-1]
        try:
            entry = json.loads(payload)
        except json.JSONDecodeError as exc:
            print(f"JSON error in {path.name}: {exc}", file=sys.stderr)
            out.append(line)
            continue
        words += 1
        word_id = entry.get("id")
        if word_id not in phrases_by_id:
            missing += 1
            out.append(line)
            continue
        levels = phrases_by_id[word_id]
        phrase = entry.setdefault("sentences", {}).setdefault("phrase", {})
        for level in ("a1", "a2", "b1"):
            got = levels.get(level) or []
            if len(got) < 10:
                print(
                    f"WARN {path.name} {word_id}/{level}: {len(got)} phrases (10 attendues)",
                    file=sys.stderr,
                )
            phrase[level] = got[:10] if len(got) >= 10 else got + phrase.get(level, [])[len(got) : 10]
            phrase[level] = phrase[level][:10]
        out.append("      " + json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + trailing + "\n")
        updated += 1
    path.write_text("".join(out), encoding="utf-8")
    return words, updated, missing


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "document",
        nargs="?",
        type=Path,
        default=DEFAULT_DOC,
        help=f"Document corrigé (défaut: {DEFAULT_DOC})",
    )
    args = parser.parse_args()
    if not args.document.is_file():
        raise SystemExit(f"Document introuvable : {args.document}")

    by_file = parse_document(args.document)
    total_w = total_u = total_m = 0
    for file_name, phrases_by_id in sorted(by_file.items()):
        path = BANK_DIR / file_name
        if not path.is_file():
            print(f"SKIP fichier manquant : {file_name}", file=sys.stderr)
            continue
        w, u, m = apply_to_bank(path, phrases_by_id)
        total_w += w
        total_u += u
        total_m += m
        print(f"{file_name}: {u}/{w} mis à jour ({m} ids absents du doc)")
    print(f"Total: {total_u}/{total_w} (ids du doc sans entrée: {total_m})")


if __name__ == "__main__":
    main()
