#!/usr/bin/env python3
"""
Découpe les CO complet multi-unités (Document / Annonce / Dialogue) en pistes mini
(1 écoute / unité).

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
UNIT_RE = re.compile(
    r"(?:Document|Annonce|Dialogue(?:\s+numéro)?)\s+(\d+)",
    re.I,
)
# Annonces / messages numérotés « 1. … 2. … » (ex. DELF A2 pistes radio).
NUMBERED_UNIT_RE = re.compile(r"(?m)^\s*(\d+)\.\s+\S")

# Coupes manuelles (start, end) — 1ʳᵉ écoute seulement, pads inclus côté appelant.
# Clé = id exercice. Valeurs = fenêtres brutes (speech) ; +PAD_AFTER_LAST à l’export.
MANUAL_CUTS: dict[str, list[tuple[float, float]]] = {
    # DELF A2 2021 — deux annonces dans un seul MP3
    "delf-a2-2021-co-ex2-15": [
        (4.0, 13.1),
        (16.5, 23.5),
    ],
    # 1ʳᵉ écoute seulement (la piste rejoue l’annonce 1 après ~14 s)
    "delf-a2-2021-co-ex1-33": [
        (6.0, 13.5),
        (38.5, 50.0),
    ],
    # Annonces courtes numérotées (après intro / bip « 1. »)
    "delf-a2-2021-co-ex1-01": [
        (29.0, 35.0),
        (37.0, 42.0),
        (44.0, 50.0),
        (52.0, 58.5),
    ],
    "delf-a2-2021-co-ex1-02": [
        (3.0, 7.0),
        (10.0, 13.0),
        (16.0, 20.0),
        (23.0, 29.0),
        (31.0, 37.0),
    ],
    "delf-a2-2021-co-ex1-03": [
        (8.5, 19.8),
        (23.0, 38.0),
        (40.3, 61.8),
        (68.0, 82.8),
    ],
    "delf-a2-2021-co-ex1-08": [
        (3.5, 6.0),
        (8.5, 12.0),
        (14.5, 20.0),
        (22.5, 27.5),
    ],
    "delf-a2-2021-co-ex3-17": [
        (9.0, 17.0),
        (19.0, 25.0),
        (27.0, 35.0),
        (37.0, 42.0),
    ],
    "delf-a2-2021-co-ex3-21": [
        (4.0, 11.0),
        (13.0, 20.0),
        (22.0, 30.0),
        (32.0, 38.5),
    ],
    "delf-a2-2021-co-ex3-23": [
        (3.5, 11.5),
        (14.0, 18.5),
        (20.5, 26.5),
        (29.5, 35.0),
        (38.0, 43.0),
    ],
    # Annonces compactes (1 écoute)
    "tcf-a2j-s1-co-1": [
        (4.5, 16.4),
        (18.6, 32.6),
        (37.8, 47.4),
        (52.9, 63.6),
        (66.5, 79.5),
        (84.8, 95.5),
    ],
    "tcf-a2j-s2-co-1": [
        (0.15, 14.3),
        (19.6, 29.45),
        (31.95, 46.3),
        (48.75, 59.6),
        (65.25, 76.05),
        (81.6, 90.9),
    ],
    # mag3 / vq21 : 1ʳᵉ île = intro → 6 suivantes
    "tcf-ss-a2-s3-co-3": [
        (15.75, 26.1),
        (31.45, 43.8),
        (48.8, 63.0),
        (67.7, 77.6),
        (82.4, 92.85),
        (98.0, 109.8),
    ],
    "tcf-ss-a2-s48-co-3": [
        (15.0, 24.35),
        (29.8, 39.5),
        (42.45, 52.65),
        (57.9, 69.15),
        (74.85, 89.65),
        (92.75, 104.05),
    ],
    "tcf-ss-a2-s7-co-3": [
        (1.6, 13.8),
        (16.4, 24.8),
        (26.9, 35.5),
        (37.7, 49.7),
        (51.6, 65.0),
        (67.0, 82.2),
    ],
    # Quatre dialogues (1ʳᵉ écoute)
    "tcf-a2p-s1-co-4": [
        (3.9, 17.9),
        (20.9, 36.9),
        (42.0, 57.5),
        (62.8, 80.1),
    ],
    "tcf-a2p-s2-co-4": [
        (0.4, 15.6),
        (21.5, 35.7),
        (42.5, 57.0),
        (64.3, 81.2),
    ],
    "tcf-a2-s1-co-4": [
        (61.9, 73.6),
        (76.8, 93.0),
        (96.2, 109.5),
        (112.6, 127.2),
    ],
    "tcf-a2-sa-co-4": [
        (62.8, 77.9),
        (81.0, 98.2),
        (103.9, 117.9),
        (121.2, 135.4),
    ],
    "tcf-a2-sb-co-4": [
        (62.4, 72.7),
        (75.9, 90.5),
        (93.7, 108.0),
        (111.2, 127.0),
    ],
    "tcf-a2-sc-co-4": [
        (40.5, 54.5),
        (112.5, 130.1),
        (181.5, 201.6),
        (255.5, 269.6),
    ],
    "tcf-a1-sem1-co-2": [
        (54.5, 71.2),
        (101.7, 118.2),
        (150.2, 164.3),
        (194.1, 204.2),
    ],
    "delf-a1-2022-co-74": [
        (4.0, 10.8),
        (11.1, 17.9),
        (18.2, 25.0),
        (25.3, 32.1),
        (32.4, 39.2),
        (39.5, 46.3),
        (46.6, 53.4),
    ],
    "delf-a1-2022-co-75": [
        (2.35, 6.7),
        (7.35, 12.7),
        (13.35, 21.7),
        (22.35, 31.7),
        (32.35, 40.0),
    ],
    "delf-a1-2022-co-78": [
        (1.54, 7.2),
        (7.85, 12.7),
        (13.35, 17.7),
        (18.35, 23.2),
        (23.85, 28.84),
    ],
    "delf-a1-2022-co-79": [
        (1.67, 14.34),
        (14.99, 30.5),
        (31.15, 42.98),
        (43.63, 56.02),
        (56.67, 71.9),
    ],
    "delf-a1-2022-co-81": [
        (1.74, 6.78),
        (7.43, 12.38),
        (13.03, 17.22),
        (17.87, 22.74),
        (23.39, 27.94),
        (28.59, 33.5),
        (34.15, 38.9),
    ],
    "delf-a1-2022-co-85": [
        (1.75, 12.7),
        (13.35, 22.7),
        (23.35, 35.7),
        (36.35, 51.31),
    ],
    "delf-a1-2022-co-86": [
        (2.35, 8.7),
        (9.35, 14.7),
        (15.35, 20.7),
        (21.35, 26.7),
        (27.35, 34.71),
    ],
    "delf-a1-2022-co-ex1-02": [
        (2.35, 17.7),
        (18.35, 33.7),
        (34.35, 50.42),
    ],
    "delf-a1-2022-co-ex1-03": [
        (1.55, 16.7),
        (17.35, 30.26),
        (30.91, 43.91),
    ],
    "delf-a1-2022-co-ex1-04": [
        (2.35, 15.7),
        (16.35, 29.7),
        (30.35, 45.89),
    ],
    "delf-a1-2022-co-ex1-05": [
        (2.35, 8.7),
        (9.35, 17.7),
        (18.35, 27.38),
    ],
    "delf-a1-2022-co-ex1-06": [
        (2.35, 11.7),
        (12.35, 18.7),
        (19.35, 27.85),
    ],
    "delf-a1-2022-co-ex1-08": [
        (2.71, 17.58),
        (18.23, 30.86),
        (31.51, 43.49),
    ],
    "delf-a1-2022-co-ex1-09": [
        (2.35, 14.7),
        (15.35, 25.7),
        (26.35, 40.57),
    ],
    "delf-a1-2022-co-ex1-10": [
        (2.35, 10.7),
        (11.35, 19.7),
        (20.35, 33.64),
    ],
    "delf-a1-2022-co-ex1-11": [
        (1.61, 16.7),
        (17.35, 31.1),
        (31.75, 44.9),
    ],
    "delf-a1-2022-co-ex1-12": [
        (2.35, 12.7),
        (13.35, 26.7),
        (27.35, 43.38),
    ],
    "delf-a1-2022-co-ex2-15": [
        (3.85, 9.7),
        (10.35, 19.7),
        (20.35, 32.13),
    ],
    "delf-a1-2022-co-ex2-16": [
        (1.62, 17.86),
        (18.51, 29.46),
        (30.11, 43.96),
    ],
    "delf-a1-2022-co-ex2-17": [
        (2.35, 21.7),
        (22.35, 39.7),
        (40.35, 58.6),
    ],
    "delf-a1-2022-co-ex2-20": [
        (2.35, 22.7),
        (23.35, 39.7),
        (40.35, 61.52),
    ],
    "delf-a1-2022-co-ex2-21": [
        (1.75, 6.7),
        (7.35, 11.7),
        (12.35, 16.7),
        (17.35, 20.7),
        (21.35, 25.7),
        (26.35, 30.98),
    ],
    "delf-a1-2022-co-ex2-23": [
        (1.69, 17.7),
        (18.35, 35.44),
        (36.09, 51.62),
    ],
    "delf-a1-2022-co-ex2-25": [
        (1.4, 23.9),
        (24.55, 43.7),
        (44.35, 64.96),
    ],
    "delf-a1-2022-co-ex3-27": [
        (2.35, 17.7),
        (18.35, 29.7),
        (30.35, 47.35),
    ],
    "delf-a1-2022-co-ex3-28": [
        (2.35, 15.7),
        (16.35, 32.7),
        (33.35, 47.87),
    ],
    "delf-a1-2022-co-ex3-30": [
        (2.35, 7.7),
        (8.35, 14.7),
        (15.35, 22.7),
        (23.35, 29.7),
        (30.35, 37.81),
    ],
    "delf-a1-2022-co-ex3-31": [
        (1.05, 9.7),
        (10.35, 20.7),
        (21.35, 32.33),
    ],
    "delf-a1-2022-co-ex3-34": [
        (1.75, 12.7),
        (13.35, 25.7),
        (26.35, 39.94),
    ],
    "delf-a1-2022-co-ex3-35": [
        (1.4, 15.7),
        (16.35, 30.7),
        (31.35, 47.14),
    ],
    "delf-a1-2022-co-ex3-36": [
        (2.35, 19.7),
        (20.35, 39.7),
        (40.35, 57.93),
    ],
    "delf-a1-2022-co-ex4-37": [
        (4.0, 32.8),
        (33.1, 61.9),
        (62.2, 91.0),
    ],
    "delf-a1-2022-co-ex4-39": [
        (1.75, 12.82),
        (13.47, 20.9),
        (21.55, 30.62),
        (31.27, 43.75),
    ],
    "delf-a1-2022-co-ex4-41": [
        (1.26, 21.5),
        (22.15, 37.5),
        (38.15, 55.87),
    ],
    "delf-a1-2022-co-ex4-44": [
        (3.08, 12.7),
        (13.35, 27.5),
        (28.15, 39.58),
    ],
    "delf-a1-2022-co-ex4-45": [
        (2.35, 13.7),
        (14.35, 28.7),
        (29.35, 41.09),
    ],
    "delf-a1-2022-co-ex4-46": [
        (2.95, 14.7),
        (15.35, 31.7),
        (32.35, 45.16),
    ],
    "delf-a1-2022-co-ex4-47": [
        (2.35, 9.7),
        (10.35, 19.7),
        (20.35, 31.7),
        (32.35, 49.25),
    ],
    "delf-a1-2022-co-ex4-48": [
        (1.65, 11.62),
        (12.27, 22.66),
        (23.31, 37.7),
        (38.35, 49.95),
    ],
    "delf-a1-2022-co-ex4-70": [
        (2.35, 13.7),
        (14.35, 24.7),
        (25.35, 35.7),
        (36.35, 47.58),
    ],
    # Retry — auto BAD / Dialogue 1ʳᵉ écoute
    "delf-a1-2022-co-ex2-14": [
        (8.2, 15.7),
        (16.3, 25.7),
        (26.3, 35.7),
        (36.3, 46.0),
    ],
    "delf-a1-2022-co-ex3-26": [
        (8.2, 19.8),
        (22.2, 32.8),
        (35.8, 47.5),
    ],
    "delf-a1-2022-co-ex4-43": [
        (0.2, 7.9),
        (8.3, 16.9),
        (17.4, 30.6),
        (33.1, 42.5),
    ],
    "delf-a1-2022-co-ex4-68": [
        (7.9, 13.5),
        (16.5, 27.6),
        (30.9, 37.5),
        (40.2, 51.5),
    ],
    # Dialogues longs : 1ʳᵉ écoute seulement (sans « Dialogue N »)
    "delf-a1-2022-co-91": [
        (42.5, 55.5),
        (70.3, 84.5),
        (94.3, 113.5),
        (130.3, 145.0),
    ],
    "delf-a1-2022-co-96": [
        (36.2, 49.5),
        (63.2, 79.5),
        (95.2, 109.5),
        (124.2, 139.5),
    ],
    # Messages / annonces numérotés (sans « 1. » / Activité)
    "delf-a1-2022-co-ex1-01": [
        (32.0, 42.0),
        (45.0, 58.0),
        (60.0, 74.5),
    ],
    "delf-a1-2022-co-ex1-13": [
        (0.15, 14.0),
        (16.5, 28.5),
        (30.6, 41.6),
    ],
    "delf-a1-2022-co-ex2-18": [
        (0.15, 16.5),
        (19.5, 34.5),
        (36.8, 48.8),
    ],
    "delf-a1-2022-co-ex2-19": [
        (0.15, 14.4),
        (16.5, 28.0),
        (32.4, 41.2),
    ],
    "delf-a1-2022-co-ex2-22": [
        (1.1, 11.0),
        (13.6, 20.9),
        (23.5, 30.4),
        (34.0, 42.6),
        (45.4, 54.2),
    ],
    "delf-a1-2022-co-ex3-29": [
        (0.15, 18.0),
        (20.0, 35.0),
        (37.0, 55.5),
    ],
    "delf-a1-2022-co-ex4-40": [
        (0.15, 56.5),
        (59.0, 104.5),
    ],
    "delf-a1-2022-co-ex4-69": [
        (0.15, 9.0),
        (12.0, 20.0),
        (22.0, 31.0),
        (35.0, 42.5),
    ],
    "delf-a1-2022-co-84": [
        (7.4, 9.4),
        (12.6, 15.1),
        (18.2, 20.6),
        (24.0, 26.3),
        (29.0, 31.6),
    ],

    # Soutien multi-dialogues (marqueurs Dialogue N / listes numérotées)
    "tcf-ss-a1-s6-co-4": [
        (1.0, 16.16),
        (17.3, 32.94),
    ],
    "tcf-ss-a1-s19-co-3": [
        (2.52, 10.76),
        (12.44, 21.1),
        (22.76, 34.46),
    ],
    "tcf-ss-a1-s25-co-4": [
        (7.24, 13.01),
        (13.16, 18.87),
        (19.02, 25.29),
        (25.44, 32.49),
        (32.64, 37.87),
    ],
    "tcf-ss-a1-s47-co-1": [
        (10.56, 21.26),
        (22.48, 35.16),
        (36.1, 45.84),
    ],
    "tcf-ss-a1-s47-co-2": [
        (0.15, 10.12),
        (11.22, 24.56),
        (25.66, 37.56),
    ],
    "tcf-ss-a1-s47-co-3": [
        (1.0, 12.12),
        (13.18, 26.5),
        (27.56, 41.76),
    ],
    "tcf-ss-a1-s54-co-2": [
        (3.32, 11.44),
        (12.66, 22.72),
    ],
    "tcf-ss-a2-s2-co-4": [
        (3.38, 20.64),
        (21.86, 36.44),
        (37.66, 51.44),
        (52.66, 71.12),
    ],
    "tcf-ss-a2-s10-co-1": [
        (2.68, 23.56),
        (24.78, 42.14),
        (43.36, 64.06),
        (65.36, 80.62),
    ],
    "tcf-ss-a2-s14-co-4": [
        (23.28, 38.18),
        (39.2, 52.7),
        (53.72, 67.1),
        (68.12, 80.46),
    ],
    "tcf-ss-a2-s15-co-1": [
        (0.15, 18.36),
        (19.34, 37.16),
        (38.14, 62.38),
    ],
    "tcf-ss-a2-s20-co-4": [
        (1.32, 18.96),
        (20.02, 35.64),
        (36.62, 53.22),
        (54.2, 69.54),
    ],
    "tcf-ss-a2-s21-co-1": [
        (2.54, 25.92),
        (27.3, 44.82),
        (46.12, 65.82),
    ],
    "tcf-ss-a2-s24-co-3": [
        (24.82, 38.9),
        (40.0, 58.64),
        (59.7, 71.88),
        (72.86, 86.68),
    ],
    "tcf-ss-a2-s24-co-4": [
        (13.04, 26.72),
        (27.96, 44.26),
        (45.32, 62.36),
        (63.34, 73.08),
    ],
    "tcf-ss-a2-s48-co-4": [
        (20.12, 38.12),
        (39.34, 52.74),
        (53.8, 72.02),
        (72.92, 85.68),
    ],
    "tcf-ss-a2-s49-co-1": [
        (16.0, 36.74),
        (38.08, 53.32),
        (54.38, 76.74),
        (77.72, 90.4),
    ],
    "tcf-ss-a2-s49-co-2": [
        (6.5, 24.6),
        (25.84, 39.76),
        (40.74, 62.88),
        (64.02, 77.38),
    ],
    "tcf-ss-a2-s49-co-3": [
        (0.15, 16.0),
        (16.98, 33.7),
        (34.76, 48.76),
        (49.82, 61.5),
    ],
    "tcf-ss-a2-s49-co-4": [
        (0.15, 16.08),
        (16.98, 30.42),
        (31.4, 44.1),
        (45.08, 56.64),
    ],
    "tcf-ss-a2-s50-co-1": [
        (2.96, 19.12),
        (20.34, 38.58),
        (39.88, 59.22),
        (60.36, 76.52),
    ],
    "tcf-ss-a2-s50-co-2": [
        (3.62, 21.02),
        (23.96, 36.94),
        (38.16, 55.3),
        (57.84, 71.28),
    ],
    "tcf-ss-a2-s55-co-4": [
        (3.44, 23.66),
        (24.88, 43.62),
        (44.68, 68.22),
    ],
    "tcf-ssx-a2-conversation-22-co-4": [
        (13.7, 26.76),
        (27.98, 43.48),
        (44.38, 63.82),
        (64.96, 80.84),
    ],
    "tcf-ssx-a2-conversation-25-co-4": [
        (17.0, 37.58),
        (38.72, 55.78),
        (56.92, 78.22),
        (79.2, 93.34),
    ],
    "tcf-ssx-a2-conversation-32-co-4": [
        (14.28, 31.38),
        (32.52, 49.88),
        (51.02, 64.98),
        (66.12, 76.72),
    ],
}


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
    """Transcription finale : faster-whisper large-v3 (repli openai-whisper)."""
    out_dir.mkdir(parents=True, exist_ok=True)
    txt_path = out_dir / (wav_or_mp3.stem + ".txt")
    try:
        from faster_whisper import WhisperModel

        model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        segments, _ = model.transcribe(
            str(wav_or_mp3), language="fr", vad_filter=False, beam_size=5
        )
        text = " ".join((s.text or "").strip() for s in segments).strip()
        txt_path.write_text(text + "\n", encoding="utf-8")
        return text
    except Exception:
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
        return txt_path.read_text(encoding="utf-8").strip()


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
    t = re.sub(r"^(Exercice\s+\d+\.?\s*)+", "", t, flags=re.I)
    t = re.sub(r"^Activit[eé]\s+\d+\s*[,.]?\s*", "", t, flags=re.I)
    t = re.sub(r"^Lisez les questions\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Lisez la question\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Écoutez l[\'']enregistrement[,.]?\s*puis répondez\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Écoutez le document[,.]?\s*puis répondez\.?\s*", "", t, flags=re.I)
    t = re.sub(r"^Vous (?:allez )?écouter[^.]*\.\s*", "", t, flags=re.I)
    t = re.sub(r"^Répondez aux questions\.?\s*", "", t, flags=re.I)
    t = re.sub(
        r"^(?:Document|Annonce|Dialogue(?:\s+numéro)?)\s+\d+\s*[—\-–:.]?\s*",
        "",
        t,
        flags=re.I,
    )
    return t.strip()


def numbered_units_in_text(text: str) -> list[int]:
    """Suite 1..n si la transcription est une liste « 1. … 2. … ».

    Plafond 8 : au-delà, souvent une grille Q/R d’entretien (pistes 47/49),
    pas des documents audio distincts à découper.
    """
    found = [int(m.group(1)) for m in NUMBERED_UNIT_RE.finditer(text or "")]
    if len(found) < 2 or len(found) > 8:
        return []
    expected = list(range(1, len(found) + 1))
    return expected if found == expected else []


def document_nums(ex: dict) -> list[int]:
    """N° d’unités (Document / Annonce / Dialogue / liste 1. 2.) présents dans l’exercice."""
    nums: list[int] = []

    def add(n: int) -> None:
        if n not in nums:
            nums.append(n)

    for q in ex.get("questions", []):
        if not isinstance(q, dict):
            continue
        for m in UNIT_RE.finditer(q.get("enonce", "") or ""):
            add(int(m.group(1)))
        for row in q.get("tableau") or []:
            if isinstance(row, dict):
                for m in UNIT_RE.finditer(row.get("label", "") or ""):
                    add(int(m.group(1)))
    if len(nums) >= 2:
        return sorted(nums)

    # Repli : labels dans la transcription banque
    tr = ex.get("support", {}).get("transcription") or ""
    text = "\n".join(tr) if isinstance(tr, list) else str(tr)
    for m in UNIT_RE.finditer(text):
        add(int(m.group(1)))
    if len(nums) >= 2:
        return sorted(nums)

    numbered = numbered_units_in_text(text)
    if numbered:
        return numbered
    return sorted(nums)


def split_bank_transcription(tr: str | list, n: int) -> list[str] | None:
    """Découpe une transcription banque en n textes (sans labels)."""
    if isinstance(tr, list):
        parts = [clean_transcription(p) for p in tr if str(p).strip()]
        if len(parts) >= n:
            return parts[:n]
        return None
    text = (tr or "").strip()
    if not text:
        return None
    # Annonce/Dialogue/Document numérotés
    if UNIT_RE.search(text):
        m = UNIT_RE.search(text)
        assert m
        # Souvent le 1er dialogue n’a pas de label : garder le préambule.
        preamble = ""
        if int(m.group(1)) >= 2:
            preamble = clean_transcription(text[: m.start()])
        text = text[m.start() :]
        parts = re.split(
            r"\s*(?:Document|Annonce|Dialogue(?:\s+numéro)?)\s+\d+\s*[—\-–:.]?\s*",
            text,
            flags=re.I,
        )
        parts = [clean_transcription(p) for p in parts if p.strip()]
        parts = [p for p in parts if len(p) > 15]
        if preamble and len(preamble) > 15:
            parts = [preamble] + parts
        if len(parts) >= 2 * n and parts[:n] == parts[n : 2 * n]:
            return parts[:n]
        if len(parts) >= n:
            return parts[:n]
    # Liste « 1. … 2. … »
    if NUMBERED_UNIT_RE.search(text):
        parts = re.split(r"(?m)^\s*\d+\.\s+", text)
        parts = [clean_transcription(p) for p in parts if p.strip()]
        parts = [re.sub(r"\s+", " ", p).strip() for p in parts]
        parts = [p for p in parts if len(p) > 12]
        if len(parts) >= n:
            return parts[:n]

    # Paragraphes (annonces collège sans labels)
    paras = [clean_transcription(p) for p in re.split(r"\n\s*\n", text) if p.strip()]
    paras = [p for p in paras if len(p) > 20]
    if len(paras) >= n:
        return paras[:n]
    return None


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
        if not isinstance(q, dict):
            continue
        m = UNIT_RE.search(q.get("enonce", "") or "")
        if m:
            q["audio"] = int(m.group(1))
        elif docs and len(ex["questions"]) == len(docs):
            # 1 question / unité dans l’ordre
            idx = ex["questions"].index(q)
            if 0 <= idx < len(docs):
                q["audio"] = docs[idx]
        elif docs and len(audio_refs) == 1:
            q["audio"] = docs[0]


def finalize_cuts(raw: list[tuple[float, float]], duration: float) -> list[tuple[float, float]]:
    """Ajoute PAD_AFTER_LAST et borne à la durée."""
    out = []
    for a, b in raw:
        end = round(min(duration, b + PAD_AFTER_LAST), 2)
        start = round(max(0.0, a), 2)
        if end > start + 1.5:
            out.append((start, end))
    return out


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
        print(f"SKIP {ex_id}: fewer than 2 units (Document/Annonce/Dialogue)")
        return False
    audio_ref = ex["support"].get("audio") or ""
    src = public_path(audio_ref)
    if not src.exists():
        print(f"ERROR: missing {src}", file=sys.stderr)
        return False

    n = max(docs)
    duration = ffprobe_duration(src)
    print(f"\n=== {ex_id}  {src.name}  units=1..{n}  dur={duration:.1f}s ===")

    with tempfile.TemporaryDirectory(prefix="co-cut-") as tmp:
        tmp_p = Path(tmp)
        mono = tmp_p / "mono.wav"
        to_mono16(src, mono)

        style = "auto"
        if ex_id in MANUAL_CUTS:
            cuts = finalize_cuts(MANUAL_CUTS[ex_id], duration)
            style = "manual"
        else:
            cuts = detect_exam_style_cuts(mono, n)
            style = "exam"
            if not cuts:
                cuts = detect_compact_cuts(mono, n)
                style = "compact"
        if not cuts or len(cuts) != n:
            print(
                f"ERROR: could not detect {n} cuts for {ex_id} (got {0 if not cuts else len(cuts)})",
                file=sys.stderr,
            )
            return False
        print(f"style={style}")
        for i, (a, b) in enumerate(cuts, 1):
            print(f"  Unit{i}: {a:.2f} → {b:.2f} ({b - a:.1f}s)")

        if dry_run:
            return True

        bank_trs = split_bank_transcription(ex["support"].get("transcription") or "", n)
        if bank_trs:
            print(f"  bank transcriptions: {len(bank_trs)}")

        stem = src.stem
        parent = src.parent
        out_paths = []
        transcriptions = []
        for i, (a, b) in enumerate(cuts, 1):
            dest = parent / f"{stem}-{i}.mp3"
            cut_mp3(src, dest, a, b)
            out_paths.append(dest)
            if bank_trs and i <= len(bank_trs):
                transcriptions.append(bank_trs[i - 1])
            else:
                clip_wav = tmp_p / f"clip{i}.wav"
                to_mono16(dest, clip_wav)
                try:
                    text = whisper_txt(clip_wav, tmp_p / f"w{i}")
                except subprocess.CalledProcessError as e:
                    print(f"WARN whisper failed unit{i}: {e}", file=sys.stderr)
                    text = ""
                lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
                dedup: list[str] = []
                for ln in lines:
                    if not dedup or dedup[-1] != ln:
                        dedup.append(ln)
                if len(dedup) >= 2 and len(dedup) % 2 == 0:
                    half = len(dedup) // 2
                    if dedup[:half] == dedup[half:]:
                        dedup = dedup[:half]
                transcriptions.append(clean_transcription(" ".join(dedup) if dedup else text))
            print(f"  wrote {dest.name}  tr={transcriptions[-1][:80]}…")

        refs = [lib_ref(p) for p in out_paths]
        update_exercise(ex, refs, transcriptions)
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
    ap.add_argument(
        "--all-pending",
        action="store_true",
        help="All multi-unit still mono (Document/Annonce/Dialogue)",
    )
    ap.add_argument(
        "--manual",
        action="store_true",
        help="Only exercises with MANUAL_CUTS defined",
    )
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--keep-source", action="store_true", help="Do not delete original MP3")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    if args.list:
        for i in list_pending():
            mark = " [manual]" if i in MANUAL_CUTS else ""
            print(f"{i}{mark}")
        return 0

    targets = []
    if args.manual:
        targets = [i for i in MANUAL_CUTS if i in load_banks()]
    elif args.all_pending:
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
