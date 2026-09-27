#!/usr/bin/env python3
"""Découpe les collages de bordures jeux → webp 360×520, centre transparent."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "lib" / "images" / "jeux" / "borders"
ASSETS = Path("/home/ubuntu/.cursor/projects/workspace/assets")
TARGET = (360, 520)

# Collages fournis
COLLAGES = [
    ASSETS / "c82b48d9-a178-4c57-b766-f41dfa241c5d.png",
    ASSETS / "ff4e7c53-3531-45e4-86d2-3d0288dbc303.png",
    ASSETS / "72b7de5f-f8a5-4fae-8ce5-f0bb5140cc17.png",
]

# Skip : fusée / nuit spatiale (style 5 des collages 1 et 3)
# collage_index, face ('recto'|'verso'), style_col 0..4
SKIP = {
    (0, "recto", 4),  # fusée
    (2, "recto", 4),  # espace
    (2, "verso", 4),  # espace
}


def find_card_boxes(im: Image.Image) -> list[tuple[int, int, int, int]]:
    """Retourne 10 boîtes (5 recto + 5 verso) en (l,t,r,b)."""
    a = np.array(im.convert("RGB"))
    h, w = a.shape[:2]
    # Contenu = non-blanc (tolérance pour anti-alias)
    content = ~((a[:, :, 0] > 248) & (a[:, :, 1] > 248) & (a[:, :, 2] > 248))

    def ranges(mask_1d: np.ndarray) -> list[tuple[int, int]]:
        out: list[tuple[int, int]] = []
        in_run = False
        start = 0
        for i, v in enumerate(mask_1d):
            if v and not in_run:
                in_run = True
                start = i
            elif not v and in_run:
                in_run = False
                if i - start > 40:
                    out.append((start, i))
        if in_run and len(mask_1d) - start > 40:
            out.append((start, len(mask_1d)))
        return out

    # Deux bandes horizontales principales = cartes (ignorer labels)
    y_runs = ranges(content.any(axis=1))
    # Garder les deux plus hautes
    y_runs = sorted(y_runs, key=lambda r: r[1] - r[0], reverse=True)[:2]
    y_runs = sorted(y_runs, key=lambda r: r[0])
    if len(y_runs) < 2:
        raise RuntimeError(f"Bandes Y introuvables: {y_runs}")

    boxes: list[tuple[int, int, int, int]] = []
    for y0, y1 in y_runs:
        band = content[y0:y1]
        x_runs = ranges(band.any(axis=0))
        # 5 cartes
        x_runs = sorted(x_runs, key=lambda r: r[1] - r[0], reverse=True)[:5]
        x_runs = sorted(x_runs, key=lambda r: r[0])
        if len(x_runs) < 5:
            raise RuntimeError(f"Colonnes X introuvables: {x_runs}")
        for x0, x1 in x_runs:
            boxes.append((x0, y0, x1, y1))
    return boxes


def punch_center(rgba: np.ndarray) -> np.ndarray:
    """Rend transparent le centre blanc par flood-fill depuis le milieu."""
    h, w = rgba.shape[:2]
    rgb = rgba[:, :, :3].astype(np.int16)
    # « Blanc intérieur » : très clair, saturation faible
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    near_white = (mx >= 235) & ((mx - mn) <= 28)

    visited = np.zeros((h, w), dtype=bool)
    from collections import deque

    q: deque[tuple[int, int]] = deque()
    seeds = [
        (h // 2, w // 2),
        (h // 2 - h // 8, w // 2),
        (h // 2 + h // 8, w // 2),
        (h // 2, w // 2 - w // 8),
        (h // 2, w // 2 + w // 8),
    ]
    for y, x in seeds:
        if 0 <= y < h and 0 <= x < w and near_white[y, x]:
            q.append((y, x))
            visited[y, x] = True

    while q:
        y, x = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if ny < 0 or nx < 0 or ny >= h or nx >= w or visited[ny, nx]:
                continue
            if near_white[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    # Ne pas vider une couronne trop proche du bord (garde le cadre)
    margin = max(8, int(min(h, w) * 0.04))
    edge = np.zeros((h, w), dtype=bool)
    edge[:margin, :] = True
    edge[-margin:, :] = True
    edge[:, :margin] = True
    edge[:, -margin:] = True
    clear = visited & ~edge

    out = rgba.copy()
    out[clear, 3] = 0
    # Adoucir légèrement le pourtour
    # pixels near_white encore opaques proches du clear → alpha réduit
    return out


def refine_card_crop(im: Image.Image) -> Image.Image:
    """Rogne le fond blanc autour de la carte dans la cellule."""
    a = np.array(im.convert("RGBA"))
    rgb = a[:, :, :3]
    content = ~((rgb[:, :, 0] > 248) & (rgb[:, :, 1] > 248) & (rgb[:, :, 2] > 248))
    if not content.any():
        return im
    ys, xs = np.where(content)
    pad = 2
    l = max(0, xs.min() - pad)
    t = max(0, ys.min() - pad)
    r = min(a.shape[1], xs.max() + 1 + pad)
    b = min(a.shape[0], ys.max() + 1 + pad)
    return Image.fromarray(a[t:b, l:r], "RGBA")


def process_card(cell: Image.Image) -> Image.Image:
    card = refine_card_crop(cell)
    card = card.resize(TARGET, Image.Resampling.LANCZOS)
    arr = np.array(card.convert("RGBA"))
    arr = punch_center(arr)
    # Arrondir légèrement les coins (masque)
    h, w = arr.shape[:2]
    yy, xx = np.ogrid[:h, :w]
    rx, ry = w * 0.08, h * 0.055
    # ellipse corners via distance to rounded rect — simple: keep as is
    return Image.fromarray(arr, "RGBA")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    # Nouveaux ids à partir de 16
    next_id = 16
    catalog: list[dict] = []

    labels_by_collage = [
        # collage 1
        [
            ("Aquarelle botanique", "Feuilles eucalyptus"),
            ("Géométrie vive", "Nuages pastel"),
            ("Pinceaux colorés", "Vague violette"),
            ("Vichy scrapbook", "Formes terre"),
            (None, "Bord de mer"),  # recto fusée skip
        ],
        # collage 2
        [
            ("Cœurs roses", "Fleurs roses"),
            ("Feuilles sauge", "Vagues vertes"),
            ("Étoiles jaunes", "Étoiles bleues"),
            ("Bandes pastel", "Ondes pastel"),
            ("Avions papier", "Ciel soleil"),
        ],
        # collage 3
        [
            ("Bouquet floral", "Bouquet miroir"),
            ("Carnet formes", "Carnet formes B"),
            ("Doodles noirs", "Doodles noirs B"),
            ("Bulles douces", "Bulles douces B"),
            (None, None),  # espace skip
        ],
    ]

    for ci, path in enumerate(COLLAGES):
        im = Image.open(path).convert("RGB")
        boxes = find_card_boxes(im)
        print(path.name, "boxes", len(boxes))
        assert len(boxes) == 10, len(boxes)
        # boxes 0-4 recto, 5-9 verso
        for col in range(5):
            lab_recto, lab_verso = labels_by_collage[ci][col]
            faces = [("recto", boxes[col], lab_recto), ("verso", boxes[col + 5], lab_verso)]
            saved: dict[str, str] = {}
            for face, box, label in faces:
                if (ci, face, col) in SKIP or not label:
                    print(f"  skip collage{ci+1} style{col+1} {face}")
                    continue
                l, t, r, b = box
                cell = im.crop((l, t, r, b))
                out_im = process_card(cell)
                # id temporaire par face si on flatten, sinon pair
                saved[face] = label
                # stash image under temp key
                key = f"_tmp_{ci}_{col}_{face}"
                tmp_path = OUT / f"{key}.webp"
                out_im.save(tmp_path, "WEBP", quality=90, method=6)
                saved[f"path_{face}"] = str(tmp_path)
                print(f"  saved {key} {label}")

            # Paire recto/verso (ou une seule face dupliquée) — même liste pour les deux onglets
            if "path_recto" not in saved and "path_verso" not in saved:
                continue
            sid = f"{next_id:02d}"
            next_id += 1
            dest_r = OUT / f"border-{sid}-recto.webp"
            dest_v = OUT / f"border-{sid}-verso.webp"
            if "path_recto" in saved and "path_verso" in saved:
                Path(saved["path_recto"]).replace(dest_r)
                Path(saved["path_verso"]).replace(dest_v)
                label = saved["recto"]
            elif "path_recto" in saved:
                Path(saved["path_recto"]).replace(dest_r)
                Image.open(dest_r).save(dest_v, "WEBP", quality=90, method=6)
                label = saved["recto"]
            else:
                Path(saved["path_verso"]).replace(dest_r)
                Image.open(dest_r).save(dest_v, "WEBP", quality=90, method=6)
                label = saved["verso"]
            catalog.append(
                {
                    "id": sid,
                    "label": label,
                    "recto": f"/lib/images/jeux/borders/{dest_r.name}",
                    "verso": f"/lib/images/jeux/borders/{dest_v.name}",
                }
            )

    import json

    (OUT / "new-borders-catalog.json").write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("Catalog entries:", len(catalog))
    for e in catalog:
        print(e["id"], e["label"])


if __name__ == "__main__":
    main()
