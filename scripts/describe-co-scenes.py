#!/usr/bin/env python3
"""
Ajoute une description de scène (pour génération d’image / vidéo externe)
à chaque audio CO court (1Q) / moyen (2Q).

Ne génère PAS d’images. Met à jour :
- support.image_description (mono) ou support.images_descriptions[] (multi)
- public/lib/images/tcf/co/scenes/manifest.json
- public/lib/images/tcf/co/scenes/README.md
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src" / "tcf" / "content"
SCENES = ROOT / "public" / "lib" / "images" / "tcf" / "co" / "scenes"

# Dossier audio → lieu type pour la description visuelle
LIEU_PAR_DOSSIER: dict[str, str] = {
    "bibliotheque": "dans une bibliothèque municipale",
    "cinema": "dans le hall ou devant un cinéma",
    "ecole": "dans un établissement scolaire (couloir, classe ou secrétariat)",
    "famille": "dans un intérieur familial (salon ou cuisine)",
    "fetes": "lors d’une fête ou d’une réunion entre amis",
    "loisirs": "dans un lieu de loisir du quotidien",
    "magasins": "dans un magasin ou un commerce",
    "restaurant": "dans un restaurant ou un café",
    "sante": "dans un lieu de santé (pharmacie, cabinet, hôpital)",
    "scenes-courtes": "dans un lieu de vie quotidienne en ville",
    "temporaire": "dans un lieu de vie quotidienne",
    "travail": "sur un lieu de travail (bureau, atelier ou commerce)",
    "vie-quotidienne": "dans une situation de vie quotidienne",
    "transports": "dans les transports ou en ville",
    "radio": "dans un contexte d’annonce ou de conversation du quotidien",
}

SCENARIO_LIEU: dict[str, str] = {
    "lieux-publics": "dans un lieu public",
    "vie-quotidienne": "dans la vie quotidienne",
    "transports": "dans les transports",
    "ecole": "à l’école",
    "loisirs": "pendant un loisir",
    "travail": "au travail",
    "famille": "en famille",
    "sante": "dans un contexte de santé",
    "magasins": "dans un magasin",
    "restaurant": "au restaurant",
}


def strip_acc(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def scene_slug(stem: str) -> str:
    s = strip_acc(stem).lower().strip()
    s = s.replace("’", "'").replace("`", "'")
    s = re.sub(r"[^\w\-]+", "-", s, flags=re.UNICODE)
    return re.sub(r"-{2,}", "-", s).strip("-") or "scene"


def audio_dossier(audio_ref: str) -> str:
    parts = audio_ref.strip("/").split("/")
    if len(parts) >= 6 and parts[0] == "lib" and parts[1] == "audio":
        return scene_slug(parts[4])
    return "divers"


def clean_dialogue(text: str) -> str:
    t = (text or "").strip()
    t = re.sub(r"^(Document|Annonce|Dialogue(?:\s+numéro)?)\s+\d+\s*[—\-–:.]?\s*", "", t, flags=re.I)
    t = re.sub(r"[ \t]+", " ", t)
    return t.strip()


def dialogue_beats(transcription: str, max_beats: int = 4) -> list[str]:
    t = clean_dialogue(transcription)
    if not t:
        return []
    raw = re.split(r"\n+|\s*[—–]\s*|(?<=[.!?])\s+", t)
    beats: list[str] = []
    for p in raw:
        p = p.strip(" .;:")
        if len(p) < 3:
            continue
        beats.append(p[0].upper() + p[1:])
        if len(beats) >= max_beats:
            break
    return beats


def build_description(
    *,
    scene: str,
    scenario: str,
    dossier: str,
    transcription: str,
    kind: str,
) -> str:
    lieu = LIEU_PAR_DOSSIER.get(dossier) or SCENARIO_LIEU.get(scenario) or "dans un lieu de vie quotidienne"
    titre = (scene or "").strip()
    beats = dialogue_beats(transcription)
    if beats:
        echange = " → ".join(beats)
        action = (
            "Deux personnes (ou un usager et un agent) sont en interaction. "
            f"Fil de la scène : {echange}."
        )
    else:
        action = "Deux personnes discutent dans ce décor."
    head = f"Scène audio {kind}"
    if titre:
        head += f" « {titre} »"
    return (
        f"{head}. "
        f"Lieu : {lieu}. "
        f"{action} "
        f"À illustrer en une seule image (ou plan fixe vidéo) : bande dessinée réaliste, "
        f"décor quotidien lisible, personnages expressifs, pas de texte ni de sous-titres à l’écran, "
        f"pas de fond blanc studio."
    )



def transcription_for_audio(ex: dict, audio_ref: str) -> str:
    support = ex.get("support") or {}
    tr = support.get("transcription")
    audios = support.get("audios")
    if isinstance(audios, list) and isinstance(tr, list):
        for i, a in enumerate(audios):
            if a == audio_ref and i < len(tr):
                return str(tr[i] or "")
        return str(tr[0] if tr else "")
    if isinstance(tr, list):
        return str(tr[0] if tr else "")
    return str(tr or "")


def main() -> None:
    rows: list[dict] = []

    for bank_path in sorted(CONTENT.glob("*/co.json")):
        data = json.loads(bank_path.read_text(encoding="utf-8"))
        changed = False
        for ex in data:
            if ex.get("type_exercice") != "complet":
                continue
            nq = len(ex.get("questions") or [])
            if nq not in (1, 2):
                continue
            support = ex.setdefault("support", {})
            kind = "court" if nq == 1 else "moyen"
            scene = (ex.get("scene") or "").strip()
            scenario = (ex.get("scenario") or "").strip()

            audios = support.get("audios")
            if isinstance(audios, list) and any(str(a).strip() for a in audios):
                refs = [str(a).strip() for a in audios if str(a).strip()]
                images = support.get("images") or []
                descs: list[str] = []
                for i, ref in enumerate(refs):
                    dossier = audio_dossier(ref)
                    tr = transcription_for_audio(ex, ref)
                    # Titre un peu plus précis pour multi-dialogues
                    scene_i = f"{scene} — dialogue {i + 1}" if scene else f"Dialogue {i + 1}"
                    desc = build_description(
                        scene=scene_i,
                        scenario=scenario,
                        dossier=dossier,
                        transcription=tr,
                        kind=kind,
                    )
                    descs.append(desc)
                    img = images[i] if i < len(images) else ""
                    rows.append(
                        {
                            "id": ex["id"],
                            "kind": kind,
                            "scene": scene_i,
                            "scenario": scenario,
                            "audio": ref,
                            "image": img,
                            "fichier": Path(img).name if img else "",
                            "dossier": str(
                                (SCENES / dossier).relative_to(ROOT)
                            ),
                            "description": desc,
                        }
                    )
                support["images_descriptions"] = descs
                support.pop("image_description", None)
                changed = True
            else:
                audio = (support.get("audio") or "").strip()
                if not audio:
                    continue
                dossier = audio_dossier(audio)
                tr = transcription_for_audio(ex, audio)
                desc = build_description(
                    scene=scene,
                    scenario=scenario,
                    dossier=dossier,
                    transcription=tr,
                    kind=kind,
                )
                support["image_description"] = desc
                support.pop("images_descriptions", None)
                img = (support.get("image") or "").strip()
                rows.append(
                    {
                        "id": ex["id"],
                        "kind": kind,
                        "scene": scene,
                        "scenario": scenario,
                        "audio": audio,
                        "image": img,
                        "fichier": Path(img).name if img else "",
                        "dossier": str((SCENES / dossier).relative_to(ROOT)),
                        "description": desc,
                    }
                )
                changed = True

        if changed:
            bank_path.write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f"updated {bank_path.relative_to(ROOT)}")

    # Manifest + README
    SCENES.mkdir(parents=True, exist_ok=True)
    (SCENES / "manifest.json").write_text(
        json.dumps(rows, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    lines = [
        "# Scènes CO — audios courts et moyens",
        "",
        "Images de **scène / scénario** pour chaque audio CO à 1 question (court)",
        "ou 2 questions (moyen). À générer ailleurs (image ou vidéo), puis déposer",
        "ici en **WebP** (bande dessinée réaliste, décor quotidien — pas fond blanc).",
        "",
        "Convention de nommage :",
        "",
        "```",
        "audio  /lib/audio/tcf/co/{dossier}/{stem}.mp3",
        "image  /lib/images/tcf/co/scenes/{dossier-slug}/{stem-slug}.webp",
        "```",
        "",
        "Chaque ligne ci-dessous donne le **fichier attendu** et la **description**",
        "du scénario à utiliser dans l’outil de génération.",
        "",
        f"**{len(rows)} scènes** ({sum(1 for r in rows if r['kind']=='court')} court, "
        f"{sum(1 for r in rows if r['kind']=='moyen')} moyen).",
        "",
    ]
    for r in sorted(rows, key=lambda x: (x["dossier"], x["fichier"], x["id"])):
        lines.append(f"## `{r['fichier']}`")
        lines.append("")
        lines.append(f"- **Kind** : {r['kind']}")
        lines.append(f"- **Exercice** : `{r['id']}`")
        if r.get("scene"):
            lines.append(f"- **Scène** : {r['scene']}")
        if r.get("scenario"):
            lines.append(f"- **Scénario** : {r['scenario']}")
        lines.append(f"- **Déposer** : `{r['dossier']}/{r['fichier']}`")
        lines.append(f"- **Audio** : `{r['audio']}`")
        lines.append(f"- **Description** : {r['description']}")
        lines.append("")

    (SCENES / "README.md").write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote manifest + README ({len(rows)} descriptions)")


if __name__ == "__main__":
    main()
