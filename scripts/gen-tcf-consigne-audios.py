#!/usr/bin/env python3
"""
Génère les audios de consignes TCF CO CSC (DeniseNeural −25 %, 96 kb/s) :
intro par exercice, « Audio numéro N », silences, battements de lecture.

Sortie : public/lib/audio/tcf/consignes/
"""
from __future__ import annotations

import asyncio
import subprocess
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/lib/audio/tcf/consignes"
VOICE = "fr-FR-DeniseNeural"
RATE = "-25%"

# Textes lus (TTS). bip-d-annonce.mp3 = son-mélodie (déjà présent).
ITEMS: list[tuple[str, str]] = [
    (
        "ex1-intro.mp3",
        "Vous allez écouter six documents différents. Il y a deux écoutes. "
        "Avant chaque écoute, vous entendez le son suivant.",
    ),
    (
        "ex2-intro.mp3",
        "Vous allez écouter trois documents différents. Il y a deux écoutes. "
        "Avant chaque écoute, vous entendez le son suivant.",
    ),
    (
        "ex3-intro.mp3",
        "Vous allez écouter un seul document. Il y a deux écoutes. "
        "Avant chaque écoute, vous entendez le son suivant.",
    ),
    (
        "ex1-lisez.mp3",
        "Lisez les questions. Écoutez le document puis répondez.",
    ),
    (
        "ex3-lisez.mp3",
        "Lisez les questions. Écoutez le document, puis répondez.",
    ),
    (
        "ex4-intro.mp3",
        "Vous allez entendre quatre petits dialogues correspondant à quatre situations "
        "différentes. Il y a quinze secondes de pause après chaque dialogue. "
        "Notez, sous chaque image, le numéro du dialogue qui correspond. "
        "Puis vous allez entendre à nouveau les dialogues. Vous pouvez compléter vos réponses. "
        "Regardez les images. Attention, il y a six images, A, B, C, D, E et F, "
        "mais seulement quatre dialogues.",
    ),
    (
        "ex5-intro.mp3",
        "Vous allez entendre un message. Quels objets sont donnés dans le message ? "
        "Vous entendez le nom de l’objet ? Cochez oui. Sinon, cochez non. "
        "Puis vous allez entendre à nouveau le message. Vous pouvez compléter vos réponses.",
    ),
    ("audio-numero-1.mp3", "Audio numéro 1."),
    ("audio-numero-2.mp3", "Audio numéro 2."),
    ("audio-numero-3.mp3", "Audio numéro 3."),
    ("audio-numero-4.mp3", "Audio numéro 4."),
    ("audio-numero-5.mp3", "Audio numéro 5."),
    ("audio-numero-6.mp3", "Audio numéro 6."),
]


def run_ffmpeg(args: list[str]) -> None:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def encode_mp3(raw: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(
        [
            "-i",
            str(raw),
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "96k",
            str(dest),
        ]
    )


async def synth(text: str, dest: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "raw.mp3"
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(raw))
        encode_mp3(raw, dest)
    print(f"OK TTS {dest.relative_to(ROOT)} ({dest.stat().st_size} o)")


def make_silence(seconds: int, dest: Path) -> None:
    """Silence stéréo 44,1 kHz."""
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "silence.wav"
        run_ffmpeg(
            [
                "-f",
                "lavfi",
                "-i",
                f"anullsrc=r=44100:cl=stereo",
                "-t",
                str(seconds),
                str(raw),
            ]
        )
        encode_mp3(raw, dest)
    print(f"OK silence {dest.relative_to(ROOT)} ({seconds}s)")


def make_battement(seconds: int, dest: Path) -> None:
    """
    Battement de lecture : un tic doux (~880 Hz, 50 ms) chaque seconde,
    pendant `seconds` secondes (pour lire les questions / regarder les images).
    """
    with tempfile.TemporaryDirectory() as tmp:
        tick = Path(tmp) / "tick.wav"
        gap = Path(tmp) / "gap.wav"
        run_ffmpeg(
            [
                "-f",
                "lavfi",
                "-i",
                "sine=frequency=880:sample_rate=44100:duration=0.05",
                "-af",
                "volume=0.25,afade=t=out:st=0.03:d=0.02",
                str(tick),
            ]
        )
        run_ffmpeg(
            [
                "-f",
                "lavfi",
                "-i",
                "anullsrc=r=44100:cl=mono",
                "-t",
                "0.95",
                str(gap),
            ]
        )
        list_file = Path(tmp) / "list.txt"
        lines = []
        for _ in range(seconds):
            lines.append(f"file '{tick}'")
            lines.append(f"file '{gap}'")
        list_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
        concat_wav = Path(tmp) / "battement.wav"
        run_ffmpeg(["-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(concat_wav)])
        encode_mp3(concat_wav, dest)
    print(f"OK battement {dest.relative_to(ROOT)} ({seconds}s)")


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, text in ITEMS:
        await synth(text, OUT / name)

    for sec in (15, 25, 30):
        make_silence(sec, OUT / f"silence-{sec}s.mp3")
    for sec in (25, 30):
        make_battement(sec, OUT / f"battement-{sec}s.mp3")

    # bip-d-annonce.mp3 (son-mélodie) déjà versionné — ne pas écraser.


if __name__ == "__main__":
    asyncio.run(main())
