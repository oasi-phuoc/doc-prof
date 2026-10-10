#!/usr/bin/env python3
"""Génère les MP3 des phrases Soutien type 9 (edge-tts DeniseNeural −25 %, 96 kb/s)."""
from __future__ import annotations

import asyncio
import re
import subprocess
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/lib/audio/soutien/phrases"
VOICE = "fr-FR-DeniseNeural"
RATE = "-25%"

NAMES = ["Léa", "Noah", "Sara", "Adam", "Inès", "Liam", "Maya", "Yanis"]

SOUND_BONUS = {
    "/a/": ["grand", "malade", "agréable", "brave"],
    "/o/": ["joli", "gros", "rose", "beau"],
    "/i/": ["petit", "joli", "vite", "gris"],
    "/y/": ["dur", "pur", "sûr"],
    "/ə/": ["petit", "ferme", "jeune"],
    "/b/": ["beau", "bon", "blanc"],
    "/k/": ["court", "calme", "clair"],
    "/s/": ["simple", "sage", "souple"],
    "/d/": ["doux", "dur", "droit"],
    "/g/": ["grand", "gai", "gris"],
    "/ʒ/": ["jaune", "joli", "jeune", "gentil"],
    "/p/": ["petit", "propre", "plein"],
    "/t/": ["tout", "triste", "tendre"],
    "/f/": ["fort", "frais", "fin"],
    "/l/": ["joli", "léger", "long", "libre"],
    "/m/": ["même", "mou", "mature"],
    "/n/": ["nouveau", "net", "noble"],
    "/r/": ["rouge", "rare", "rond"],
    "/v/": ["vert", "vive", "vrai"],
    "/z/": ["rose", "aise"],
    "/w/": ["ouaté"],
    "/ʃ/": ["riche", "chaude", "chère"],
    "/u/": ["lourd", "doux", "rouge"],
    "/wa/": ["froid", "droit"],
    "/ɑ̃/": ["blanc", "grand", "content"],
    "/ɛ̃/": ["plein", "fin", "malin"],
    "/ɔ̃/": ["bon", "rond", "long"],
    "/ɲ/": ["mignon", "gagnant"],
    "/j/": ["brillant", "paresseux", "joyeux"],
}


def slug(sentence: str) -> str:
    import unicodedata

    s = unicodedata.normalize("NFD", sentence)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower()
    s = s.replace("'", "").replace("’", "")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:96]


def is_feminine(word: str) -> bool:
    w = word.strip().lower()
    return bool(
        re.search(
            r"e$|ion$|ette$|elle$|ance$|ence$|ure$|ade$|ise$|ine$|ille$|asse$|otte$|ière$",
            w,
        )
        and not re.search(r"age$|isme$|eau$|ou$", w)
    )


def starts_vowel(word: str) -> bool:
    return bool(re.match(r"^[aeiouyàâäéèêëïîôöùûüh]", word.strip(), re.I))


def art_indef(word: str) -> str:
    return "une" if is_feminine(word) else "un"


def art_def(word: str) -> str:
    if starts_vowel(word):
        return "l’"
    return "la" if is_feminine(word) else "le"


def with_art(art: str) -> str:
    return f"{art}«MOT»" if art == "l’" else f"{art} «MOT»"


def pick_bonus(phoneme: str, word: str, index: int) -> str:
    pool = [b for b in SOUND_BONUS.get(phoneme, ["joli", "petit"]) if b.lower() != word.lower()]
    if not pool:
        pool = ["joli"]
    return pool[index % len(pool)]


def phrases_for(word: str, phoneme: str, name_index: int) -> list[str]:
    name = NAMES[name_index % len(NAMES)]
    adj = pick_bonus(phoneme, word, name_index)
    adj2 = pick_bonus(phoneme, word, name_index + 2)
    indef, def_ = art_indef(word), art_def(word)
    templates = [
        f"Sur l’image, on voit {with_art(indef)}.",
        f"{name} regarde {with_art(def_)} {adj}.",
        f"{'L’' if def_ == 'l’' else ('La ' if def_ == 'la' else 'Le ')}«MOT» {adj} est sur la photo.",
        f"Voici {with_art(indef)} {adj2} sur l’image.",
        f"{name} montre {with_art(def_)} à la classe.",
        f"Dans l’image, {with_art(def_)} est bien {adj}.",
    ]
    if phoneme == "/ʒ/":
        templates += [
            f"Je vois déjà {with_art(indef)} {adj} sur l’image.",
            f"{name} a toujours {with_art(indef)} {adj2}.",
        ]
    if phoneme == "/a/":
        templates.append(f"À la maison, {name} a {with_art(indef)}.")
    out: list[str] = []
    seen: set[str] = set()
    for t in templates:
        if "«MOT»" not in t:
            continue
        sentence = t.replace("«MOT»", word)
        matches = re.findall(re.escape(word), sentence, flags=re.I)
        if len(matches) != 1:
            continue
        key = sentence.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(sentence)
        if len(out) >= 3:
            break
    return out


def load_lecture_by_phoneme() -> dict[str, list[str]]:
    text = (ROOT / "src/francais/soutien/lecture-word-items.ts").read_text(encoding="utf-8")
    by: dict[str, list[str]] = {}
    for m in re.finditer(
        r'label:\s*"([^"]+)".*?phonemes:\s*\[([^\]]+)\]', text, flags=re.S
    ):
        label = m.group(1)
        phs = re.findall(r'"([^"]+)"', m.group(2))
        for ph in phs:
            by.setdefault(ph, []).append(label)
    return by


def load_vowel_words() -> dict[str, list[str]]:
    """Extrait words: [...] des banques voyelles dans banks.ts."""
    text = (ROOT / "src/francais/soutien/banks.ts").read_text(encoding="utf-8")
    by: dict[str, list[str]] = {}
    for block in re.finditer(
        r"sound:\s*'([^']+)'.*?words:\s*\[(.*?)\]", text, flags=re.S
    ):
        sound = block.group(1)
        words = re.findall(r"'([^']+)'", block.group(2))
        by.setdefault(sound, []).extend(words)
    return by


async def synthesize(text: str, dest: Path) -> None:
    if dest.exists() and dest.stat().st_size > 500:
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "raw.mp3"
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(raw))
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(raw),
                "-codec:a",
                "libmp3lame",
                "-b:a",
                "96k",
                str(dest),
            ],
            check=True,
        )


async def main() -> None:
    sentences: dict[str, str] = {}
    lecture = load_lecture_by_phoneme()
    vowels = load_vowel_words()
    for phoneme, words in {**lecture, **{k: vowels.get(k, []) + lecture.get(k, []) for k in set(lecture) | set(vowels)}}.items():
        seen_w: set[str] = set()
        wi = 0
        for w in words:
            key = w.strip().lower()
            if not key or key in seen_w:
                continue
            seen_w.add(key)
            for sentence in phrases_for(w.strip(), phoneme, wi):
                sentences[slug(sentence)] = sentence
            wi += 1
            if len(seen_w) >= 32:
                break

    print(f"{len(sentences)} phrases à générer → {OUT}")
    OUT.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(6)

    async def one(sl: str, sentence: str) -> None:
        async with sem:
            dest = OUT / f"{sl}.mp3"
            try:
                await synthesize(sentence, dest)
                print("ok", sl)
            except Exception as e:
                print("FAIL", sl, e)

    await asyncio.gather(*(one(sl, s) for sl, s in sorted(sentences.items())))


if __name__ == "__main__":
    asyncio.run(main())
