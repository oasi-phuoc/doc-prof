---
name: medias-image-audio
description: >-
  Génère ou complète les médias vocabulaire ClairFLE : images réalistes
  (fond blanc, sujet centré, 800×600 WebP) et audios TTS (voix féminine
  edge-tts DeniseNeural à −25 %). À utiliser dès qu’on crée, régénère ou
  aligne une image / un MP3 de mot (Soutien, Voc, Jeux, lecture).
---

# Médias image + audio (vocabulaire FLE)

Référentiel des médias déjà en vigueur dans `public/lib/` (importés depuis
`soutien-scolaire` via `scripts/copy-lib-medias.mjs`).

## Chemins ClairFLE

| Type | Chemin | Format |
|---|---|---|
| Image | `public/lib/images/vocabulaire/{theme}/{slug}.webp` | WebP |
| Audio | `public/lib/audio/vocabulaire/{theme}/{slug}.mp3` | MP3 96 kb/s |

- **Thèmes** : mêmes dossiers que `scripts/copy-lib-medias.mjs` (`presenter`,
  `famille`, `logement`, `achats`, `vetements`, `nourriture`, `sante`,
  `transports`, `travail`, `journee`, `loisirs`, `ecole`, `animaux`,
  `administration`, `actualite`, `nature`, `couleurs`, `objets`, …).
- **Slug** : libellé normalisé — suivre le voisinage du dossier thème.
- Résolution runtime : `soutienImageFor` / `soutienAudioFor`
  (`src/francais/soutien/images.ts`, `audio.ts`) — l’audio dérive du même
  thème/slug que l’image.

Ne pas inventer un autre arbre (`/assets/…` est l’ancien chemin
soutien-scolaire ; ici c’est **`/lib/…`**).

---

## Images

### Spécification visuelle (obligatoire)

1. **Style** : photo **réaliste** (pas de dessin, pas de manga, pas d’icône plate).
2. **Fond** : **blanc pur** (`#FFFFFF`), sans dégradé, sans ombre portée au sol,
   sans décor (pièce, paysage, table texturée, texte, logo, filigrane).
3. **Sujet** : objet **ou** personne **seul(e), centré(e)**, occupant l’essentiel
   du cadre ; marge blanche autour.
4. **Taille** : **800 × 600** px (ratio 4:3) — taille dominante déjà en vigueur
   dans `public/lib/images/vocabulaire/`. Repli accepté seulement si un lot
   historique du même thème est en 600×450 : alors rester cohérent avec ce thème.
5. **Export** : WebP qualité ~85.
6. **Registre** : adulte / neutre (pas « cartoon enfant »).

### Prompt type (génération)

> Photorealistic [objet/personne], centered, plain pure white background,
> no shadows on the floor, no props, no text, no watermark, studio product
> photo, 4:3

Puis redimensionner / recadrer en **800×600** (`fit: contain` sur fond blanc,
ou `cover` centré si le sujet remplit déjà le cadre sans découpe utile).

### Contrôles qualité

- Coins de l’image ≈ blanc (pas de cadre gris, pas de scène).
- Un seul sujet identifiable (« quel mot y voit-on ? »).
- Pas de texte incrusté.
- Fichier placé sous le bon `{theme}/` ; référencé dans la banque Voc si besoin.

---

## Audio (TTS)

### Outil et voix (ClairFLE)

| Priorité | Outil | Voix | Débit |
|---|---|---|---|
| **Standard** | **edge-tts** | **`fr-FR-DeniseNeural`** (féminin) | **`-25 %`** (mots lents, allophones) |
| Historique | ElevenLabs / Piper Siwis | — | **Ne jamais écraser** un MP3 déjà présent |

Référence soutien-scolaire : `scripts/generate-missing-word-audio.py`
(`VOICE = "fr-FR-DeniseNeural"`, `RATE = "-25%"`).

**Ne pas utiliser Piper Siwis** pour les nouveaux audios ClairFLE : la voix
officielle est **DeniseNeural** avec ralentissement **−25 %**.

### Paramètres audio

- Conteneur : **MP3**, bitrate **96 kb/s** (`ffmpeg` + `libmp3lame`).
- Texte lu = **libellé du mot** (forme affichée), une seule énonciation, sans
  préfixe « le mot est… ».
- Même `{theme}/{slug}` que l’image pour `soutienAudioFor` et les QR
  (origine `https://doc-prof.vercel.app`).

### Procédure

1. Vérifier si `public/lib/audio/vocabulaire/{theme}/{slug}.mp3` existe.
2. Sinon générer avec **edge-tts DeniseNeural −25 %**, puis normaliser en MP3 96k.
3. Ne pas régénérer par-dessus un fichier existant sans demande explicite.

```bash
pip install edge-tts
# Exemple
python3 - <<'PY'
import asyncio, edge_tts, subprocess, tempfile
from pathlib import Path

async def main():
    text = "bateau"
    dest = Path("public/lib/audio/vocabulaire/transports/bateau.mp3")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "raw.mp3"
        await edge_tts.Communicate(text, "fr-FR-DeniseNeural", rate="-25%").save(str(raw))
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
             "-codec:a", "libmp3lame", "-b:a", "96k", str(dest)],
            check=True,
        )

asyncio.run(main())
PY
```

---

## Quand brancher image + audio ensemble

Pour un **nouveau mot** Voc / Soutien / Jeux :

1. Image 800×600 WebP fond blanc → `images/vocabulaire/{theme}/`.
2. Audio DeniseNeural −25 % → `audio/vocabulaire/{theme}/` (même slug).
3. Entrée banque avec `imageSrc` → `/lib/images/vocabulaire/...`.
4. Contrôle : aperçu fiche + QR audio (type 15) si pertinent.

## Terminé quand

- Image : 800×600 (ou cohérente au thème), fond blanc, sujet centré, WebP.
- Audio : MP3 96k, **DeniseNeural −25 %**, chemin aligné.
- Pas d’écrasement d’anciens MP3 sans accord.
- Résolution OK via `soutienImageFor` / `soutienAudioFor`.
