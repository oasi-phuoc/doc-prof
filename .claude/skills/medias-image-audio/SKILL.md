---
name: medias-image-audio
description: >-
  Génère ou complète les médias vocabulaire ClairFLE : images réalistes
  (fond blanc, sujet centré, 800×600 WebP) et audios TTS (voix féminine
  suisse Piper Siwis ; repli DeniseNeural). À utiliser dès qu’on crée,
  régénère ou aligne une image / un MP3 de mot (Soutien, Voc, Jeux, lecture).
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
- **Slug** : libellé normalisé (minuscules, accents conservés dans le nom de
  fichier si c’est déjà le cas du thème ; sinon ASCII avec tirets — suivre le
  voisinage du dossier).
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
5. **Export** : WebP qualité ~85 (comme `finalize-manga-image.cjs` côté
   soutien-scolaire).
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

### Outil et voix (source : soutien-scolaire)

| Priorité | Outil | Voix | Usage |
|---|---|---|---|
| **1 — standard** | **Piper TTS** | **`fr_FR-siwis-medium`** (féminin, **français de Suisse**) modèle `/tmp/piper-voices/fr_FR-siwis-medium.onnx` | Vocabulaire + lecture (`son_f`) |
| 2 — manquants | **edge-tts** | **`fr-FR-DeniseNeural`**, débit **`-25 %`** | Uniquement si le MP3 n’existe pas encore |
| Historique | ElevenLabs (féminin) | — | **Ne jamais écraser** un MP3 déjà présent |

Scripts de référence dans le dépôt **soutien-scolaire** (clone local typique
`/tmp/soutien-scolaire` ou `SOUTIEN_ROOT`) :

- `scripts/generate-word-audio.py --voice f` → Piper Siwis → MP3 96k (`ffmpeg` +
  `libmp3lame`).
- `scripts/generate-missing-word-audio.py` → edge-tts DeniseNeural, ne touche
  pas aux fichiers existants.

Voix masculine Piper (`fr_FR-tom-medium`, `son_m`) : **hors périmètre** ClairFLE
fiches imprimables / QR Soutien (on garde la **voix féminine** uniquement).

### Paramètres audio ClairFLE

- Conteneur : **MP3**, bitrate **96 kb/s**.
- Texte lu = **libellé du mot** (ou forme affichée à l’élève), une seule
  énonciation claire, sans préfixe « le mot est… ».
- Locale attendue : **français de Suisse** (Siwis) ; DeniseNeural en repli
  France si Piper indisponible.
- Même `{theme}/{slug}` que l’image pour que `soutienAudioFor` et les QR
  (origine `https://doc-prof.vercel.app`) résolvent le fichier.

### Procédure recommandée

1. Vérifier si `public/lib/audio/vocabulaire/{theme}/{slug}.mp3` existe.
2. Sinon générer avec **Piper Siwis** (préféré).
3. Si Piper indisponible : **edge-tts DeniseNeural −25 %**, puis normaliser en
   MP3 96k via `ffmpeg`.
4. Ne pas régénérer par-dessus un fichier existant sans demande explicite.

Prérequis typiques Piper :

```bash
# modèles (exemple soutien-scolaire)
# /tmp/piper-voices/fr_FR-siwis-medium.onnx
pip install piper-tts   # ou environnement déjà utilisé côté soutien-scolaire
ffmpeg -version
```

---

## Quand brancher image + audio ensemble

Pour un **nouveau mot** Voc / Soutien / Jeux :

1. Image 800×600 WebP fond blanc → `images/vocabulaire/{theme}/`.
2. Audio Piper Siwis → `audio/vocabulaire/{theme}/` (même slug).
3. Entrée banque (`vocab-banks`, soutien, etc.) avec `imageSrc` pointant vers
   `/lib/images/vocabulaire/...`.
4. Contrôle : aperçu fiche + QR audio (type 15) si pertinent.

## Terminé quand

- Image : 800×600 (ou cohérente au thème), fond blanc, sujet centré, WebP.
- Audio : MP3 96k, voix féminine Siwis (ou DeniseNeural en repli), chemin aligné.
- Pas d’écrasement d’anciens MP3 sans accord.
- Résolution OK via `soutienImageFor` / `soutienAudioFor`.
