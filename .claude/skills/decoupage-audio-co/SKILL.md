---
name: decoupage-audio-co
description: >-
  Découpe un audio CO `complet` multi-documents en pistes mini (audio 1..n),
  aligne transcriptions, retire intros/bips. À utiliser dès qu’on ajoute un
  nouvel audio d’annonce / radio / informations avec plusieurs « Document N »,
  ou qu’on relance le découpage d’une piste existante.
---

# Découpage audio CO complet (multi-documents)

Pour les exercices TCF / TPF **`type_exercice: complet`** dont **un seul MP3**
contient plusieurs documents (annonces, infos radio…). On produit **une piste
par document**, comme les CO `six_courts` / `trois_moyens`.

Frontière : transcription Whisper seule → skill `comprehension-orale`.  
Import banques soutien → aussi `comprehension-orale`.  
Ce skill = **coupe + banque multi-pistes**.

## Règles non négociables

1. **1 piste = 1 document = 1 écoute** — si l’annonce est jouée deux fois dans
   le fichier source, **ne garder que la 1ʳᵉ** (ignorer la 2ᵉ écoute).
2. **Début** = fin du bip + **0,5 s** (pas de bip dans le fichier final).
3. **Fin** = dernière phrase du document + **1 s**.
4. **Retirer** intros / consignes orales (« Épreuve blanche… », « Exercice 1… »,
   « Document N. Lisez la question… »).
5. **Banque** : `support.audios[]` + `support.transcription: string[]` (une par
   piste) + chaque question porte `audio: N` (= n° du Document).
6. **Remplacer** le gros MP3 : créer `stem-1.mp3`…`stem-n.mp3`, mettre à jour
   la banque, **supprimer** `stem.mp3` (plus de référence).
7. Détection : **Whisper `large-v3`** (skill `comprehension-orale`) + repères
   (« Document N », bip, silences). Relire les cas douteux à l’oreille.
8. Jamais de contenu copié d’une référence externe.

## Forme banque (après)

```json
{
  "type_exercice": "complet",
  "support": {
    "audios": [
      "/lib/audio/tcf/co/radio/exemple-1.mp3",
      "/lib/audio/tcf/co/radio/exemple-2.mp3"
    ],
    "transcription": [
      "Texte du document 1 sans intro.",
      "Texte du document 2 sans intro."
    ]
  },
  "questions": [
    { "enonce": "Document 1 — …", "audio": 1 },
    { "enonce": "Document 1 — …", "audio": 1 },
    { "enonce": "Document 2 — …", "audio": 2 }
  ]
}
```

Mono-document : garder `support.audio` (string) + `transcription` (string) —
pas besoin de découper.

## Pipeline (nouvel audio)

1. Placer le MP3 sous `public/lib/audio/tcf/co/{scénario}/…`.
2. Créer / mettre l’exercice `complet` dans `src/tcf/content/*/co.json`
   (questions avec « Document N » dans l’énoncé).
3. Lancer le script (ou découpe manuelle équivalente) :

```bash
python3 scripts/co-cut-complet.py --exercise tcf-a2-s1-co-1
# ou tous les multi-Document encore en mono-piste :
python3 scripts/co-cut-complet.py --all-pending
```

4. Écouter chaque `stem-N.mp3` (début/fin propres).
5. Relire les transcriptions Whisper ; corriger chiffres, noms, « Document N ».
6. Vérifier `audio: N` sur chaque question (= Document N).
7. Commit + `git push origin main` (skill `pousser-main`).

## Détection des coupures

### Style examen (long, ~3–10 min)

Structure typique :

```
intro orale → « Document N. Lisez… » → ~15 s silence → BIP (~1,5 s)
→ pause → annonce (écoute 1) → ~11 s → BIP → écoute 2 → document suivant…
```

Repères : `ffmpeg silencedetect`, pics d’énergie (bip), Whisper sur **clips
courts** (pas tout le fichier d’un coup si > 3 min — risque d’hallucination).

### Style déjà compact (~1 min, 3 docs)

Silences ~2–3 s entre documents ; souvent **pas** d’intro ni de double écoute.
Couper sur les silences ; Whisper chaque segment.

## Nommage fichiers

| Avant | Après |
|---|---|
| `les-annonces-publiques-3.mp3` | `les-annonces-publiques-3-1.mp3` … `-6.mp3` |
| `loisirs-3.mp3` | `loisirs-3-1.mp3` … `-3.mp3` |

Chemin banque : `/lib/audio/tcf/co/…` (absolu).

## Checklist nouvel audio

- [ ] Multi-documents ? sinon laisser `support.audio` mono
- [ ] Coupes : pas de bip, pas d’intro, +0,5 s / +1 s
- [ ] Une transcription propre par piste
- [ ] `questions[].audio` = n° Document
- [ ] Gros fichier source retiré
- [ ] Push `origin/main`
