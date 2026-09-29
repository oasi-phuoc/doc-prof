#!/usr/bin/env python3
"""Enrichit les preds des modèles Gattegno (phrase-simple) depuis les phrases A1 calligraphie.

Ajoute des compléments étiquetés aux verbes déjà présents, sans créer de nouveaux ids.
Pas de préposition (thème phrase-simple). Respecte phrase-gattegno.
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK_DIR = ROOT / "src" / "francais" / "vocab-banks"
FRAMES = ROOT / "src" / "francais" / "phrase-simple-frames.ts"

VERB_MAP = {
    "aime": "aimer",
    "achète": "acheter",
    "porte": "porter",
    "range": "ranger",
    "cherche": "chercher",
    "trouve": "trouver",
    "lave": "laver",
    "met": "mettre",
    "mange": "manger",
    "boit": "boire",
    "ouvre": "ouvrir",
    "ferme": "fermer",
    "prend": "prendre",
    "donne": "donner",
    "montre": "montrer",
    "regarde": "regarder",
    "dessine": "dessiner",
    "écrit": "écrire",
    "lit": "lire",
    "prépare": "préparer",
    "coupe": "couper",
    "nettoie": "nettoyer",
    "visite": "visiter",
    "écoute": "écouter",
    "appelle": "appeler",
    "invite": "inviter",
    "aide": "aider",
    "apporte": "apporter",
    "emporte": "emporter",
    "pose": "poser",
    "cache": "cacher",
}

CONJ = {inf: form for form, inf in VERB_MAP.items()}

PERSON = re.compile(
    r"^(Léa|Noah|Mila|Inès|Karim|Emma|Théo|Sara|Yanis|Chloé|Hugo|Amina|Lucas|Nora|"
    r"Papa|Maman|Elle|Il|Ma sœur|Mon frère|Ma mère|Mon père|La fille|Le garçon|"
    r"L’élève|Un ami|Une amie)\s+",
    re.I,
)
NEG = re.compile(r"\bne\b|\bn’|\bpas\b|\bplus\b|\bjamais\b", re.I)
SIMPLE = re.compile(
    r"^(?P<sub>.+?)\s+(?P<verb>"
    + "|".join(sorted(VERB_MAP.keys(), key=len, reverse=True))
    + r")\s+"
    r"(?P<comp>(?:un|une|le|la|l’|les|des|du|de\s+la|mon|ma|mes|ton|ta|tes|son|sa|ses)\s+\S+?)"
    r"(?:\s+(?:aujourd’hui|maintenant|vite|bien))?[\.!]?\s*$",
    re.I,
)

MAX_NEW_PER_VERB = 6
MAX_PREDS = 10

SKIP_NOUNS = {
    "caleçon",
    "culotte",
    "soutien-gorge",
    "slip",
}

FRAME_RE = re.compile(r"frame\('(?P<id>[^']+)',\s*\[(?P<body>[^\]]*)\]\)", re.S)


def tag_complement(comp: str) -> str | None:
    c = re.sub(r"\s+", " ", comp.strip())
    # « de la X » implique une préposition — hors thème phrase-simple.
    if re.match(r"^de la\s+", c, re.I):
        return None
    m = re.match(
        r"^(du|des|un|une|le|la|les|mon|ma|mes|ton|ta|tes|son|sa|ses|l’)\s+(.+)$",
        c,
        re.I,
    )
    if not m:
        return None
    det = m.group(1)
    noun = m.group(2).strip(" .,;:")
    if not noun or " " in noun or noun.lower() in SKIP_NOUNS:
        return None
    if det in ("l'", "l’"):
        det = "l’"
    return f"{det}/determinant {noun}/nom"


def collect_complements() -> dict[str, list[str]]:
    by_inf: dict[str, set[str]] = defaultdict(set)
    for path in sorted(BANK_DIR.glob("fr-*.ts")):
        for line in path.read_text(encoding="utf-8").splitlines():
            s = line.strip()
            if not (s.startswith("{") and '"sentences":' in s):
                continue
            payload = s[:-1] if s.endswith(",") else s
            try:
                entry = json.loads(payload)
            except json.JSONDecodeError:
                continue
            for ph in entry.get("sentences", {}).get("phrase", {}).get("a1", []):
                if len(ph) > 50 or ph.endswith("?") or NEG.search(ph) or not PERSON.match(ph):
                    continue
                m = SIMPLE.match(ph)
                if not m:
                    continue
                inf = VERB_MAP.get(m.group("verb").lower())
                if not inf:
                    continue
                tagged = tag_complement(m.group("comp"))
                if tagged:
                    by_inf[inf].add(tagged)
    return {k: sorted(v) for k, v in by_inf.items()}


def main() -> None:
    comps = collect_complements()
    src = FRAMES.read_text(encoding="utf-8")
    added_total = 0
    per_verb: dict[str, int] = {}

    def repl(match: re.Match[str]) -> str:
        nonlocal added_total
        frame_id = match.group("id")
        body = match.group("body")
        existing = [p.strip() for p in re.findall(r"'([^']+)'", body)]
        existing_set = set(existing)
        conj = CONJ.get(frame_id)
        if not conj or frame_id not in comps:
            return match.group(0)
        candidates: list[str] = []
        for tagged in comps[frame_id]:
            pred = f"{conj}/verbe {tagged}"
            if pred not in existing_set:
                candidates.append(pred)
        room = max(0, MAX_PREDS - len(existing))
        take = candidates[: min(MAX_NEW_PER_VERB, room)]
        if not take:
            return match.group(0)
        added_total += len(take)
        per_verb[frame_id] = per_verb.get(frame_id, 0) + len(take)
        all_preds = existing + take
        inner = ", ".join(f"'{p}'" for p in all_preds)
        return f"frame('{frame_id}', [{inner}])"

    new_src = FRAME_RE.sub(repl, src)
    FRAMES.write_text(new_src, encoding="utf-8")
    print(f"Compléments ajoutés : {added_total}")
    for inf, n in sorted(per_verb.items()):
        print(f"  {inf}: +{n}")


if __name__ == "__main__":
    main()
