#!/usr/bin/env python3
"""
Lie chaque audio CO court (1 question) / moyen (2 questions) à une image de scène.

Ne génère PAS les images : crée les dossiers, écrit les chemins dans les banques,
et un README listant les fichiers WebP à déposer.

Convention :
  audio  /lib/audio/tcf/co/{dossier}/{stem}.mp3
  image  /lib/images/tcf/co/scenes/{dossier}/{stem}.webp
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src" / "tcf" / "content"
SCENES = ROOT / "public" / "lib" / "images" / "tcf" / "co" / "scenes"


def strip_acc(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def scene_slug(stem: str) -> str:
    """Nom de fichier image : même stem que l’audio, accents retirés, safe FS."""
    s = strip_acc(stem).lower().strip()
    s = s.replace("’", "'").replace("`", "'")
    s = re.sub(r"[^\w\-]+", "-", s, flags=re.UNICODE)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "scene"


def audio_to_image(audio_ref: str) -> tuple[str, Path]:
    """Retourne (chemin banque /lib/…, chemin disque public/…)."""
    # /lib/audio/tcf/co/{dossier}/{file}.mp3
    parts = audio_ref.strip("/").split("/")
    # lib audio tcf co dossier file
    if len(parts) < 6 or parts[0] != "lib" or parts[1] != "audio":
        dossier = "divers"
        stem = Path(audio_ref).stem
    else:
        dossier = parts[4] if len(parts) >= 6 else "divers"
        stem = Path(parts[-1]).stem
    # Dossier image ASCII (miroir audio)
    dossier_slug = scene_slug(dossier)
    file_slug = scene_slug(stem)
    rel = f"tcf/co/scenes/{dossier_slug}/{file_slug}.webp"
    bank = f"/lib/images/{rel}"
    disk = ROOT / "public" / "lib" / "images" / rel
    return bank, disk


def main() -> None:
    rows: list[dict] = []
    folders: set[Path] = set()

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
            audios = support.get("audios")
            if isinstance(audios, list) and any(str(a).strip() for a in audios):
                refs = [str(a).strip() for a in audios if str(a).strip()]
                images: list[str] = []
                for ref in refs:
                    bank_img, disk = audio_to_image(ref)
                    images.append(bank_img)
                    folders.add(disk.parent)
                    rows.append(
                        {
                            "id": ex["id"],
                            "kind": "court" if nq == 1 else "moyen",
                            "scene": ex.get("scene") or "",
                            "scenario": ex.get("scenario") or "",
                            "audio": ref,
                            "image": bank_img,
                            "fichier": disk.name,
                            "dossier": str(disk.parent.relative_to(ROOT)),
                        }
                    )
                support["images"] = images
                support.pop("image", None)
                changed = True
            else:
                audio = (support.get("audio") or "").strip()
                if not audio:
                    continue
                bank_img, disk = audio_to_image(audio)
                support["image"] = bank_img
                support.pop("images", None)
                folders.add(disk.parent)
                rows.append(
                    {
                        "id": ex["id"],
                        "kind": "court" if nq == 1 else "moyen",
                        "scene": ex.get("scene") or "",
                        "scenario": ex.get("scenario") or "",
                        "audio": audio,
                        "image": bank_img,
                        "fichier": disk.name,
                        "dossier": str(disk.parent.relative_to(ROOT)),
                    }
                )
                changed = True
        if changed:
            bank_path.write_text(
                json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f"updated {bank_path.relative_to(ROOT)}")

    for folder in sorted(folders):
        folder.mkdir(parents=True, exist_ok=True)
        keep = folder / ".gitkeep"
        if not keep.exists():
            keep.write_text("", encoding="utf-8")

    SCENES.mkdir(parents=True, exist_ok=True)
    readme = SCENES / "README.md"
    lines = [
        "# Scènes CO — audios courts et moyens",
        "",
        "Images de **scène / scénario** pour chaque audio CO à 1 question (court)",
        "ou 2 questions (moyen). À déposer ici en **WebP** (bande dessinée réaliste,",
        "décor quotidien — pas fond blanc vocabulaire).",
        "",
        "Convention de nommage :",
        "",
        "```",
        "audio  /lib/audio/tcf/co/{dossier}/{stem}.mp3",
        "image  /lib/images/tcf/co/scenes/{dossier-slug}/{stem-slug}.webp",
        "```",
        "",
        "Les banques JSON pointent déjà vers ces chemins. Dès qu’un fichier",
        "`.webp` est déposé sous le bon nom, il apparaît sur la fiche.",
        "",
        f"**{len(rows)} images** attendues ({sum(1 for r in rows if r['kind']=='court')} court,",
        f"{sum(1 for r in rows if r['kind']=='moyen')} moyen).",
        "",
        "| Kind | Exercice | Scène | Fichier à déposer | Audio source |",
        "|---|---|---|---|---|",
    ]
    for r in sorted(rows, key=lambda x: (x["dossier"], x["fichier"], x["id"])):
        scene = (r["scene"] or "—").replace("|", "/")
        lines.append(
            f"| {r['kind']} | `{r['id']}` | {scene} | `{r['dossier']}/{r['fichier']}` | `{r['audio']}` |"
        )
    lines.append("")
    readme.write_text("\n".join(lines), encoding="utf-8")

    manifest = SCENES / "manifest.json"
    manifest.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {readme.relative_to(ROOT)} ({len(rows)} entries)")
    print(f"wrote {manifest.relative_to(ROOT)}")
    print(f"folders: {len(folders)}")


if __name__ == "__main__":
    main()
