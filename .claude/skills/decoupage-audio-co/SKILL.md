---
name: decoupage-audio-co
description: >-
  Découpe un audio CO multi-dialogues / multi-documents en pistes mini
  (complet, association_images, et futurs six_courts / trois_moyens groupés),
  aligne transcriptions, retire intros/bips. À utiliser dès qu’un seul MP3
  contient plusieurs dialogues ou « Document N ».
---

# Découpage audio CO (multi-pistes)

Un **seul MP3** contient plusieurs documents / dialogues → produire **une
piste par unité**, comme les CO multi-supports.

| Type banque | Script | Champ après |
|---|---|---|
| `complet` multi-Document | `scripts/co-cut-complet.py` | `audios[]` + `transcription[]` + `questions[].audio` |
| `association_images` | `scripts/co-cut-association.py` | `audios[]` + `transcription[]` (`situations[].dialogue` inchangé) |
| `six_courts` / `trois_moyens` | — | **Pas d’entrées en banque** : le sélecteur tire des `complet` courts (1 ou 2 questions). Si un jour un MP3 groupé arrive : même règles, `support.audios` à 6 ou 3. |

Frontière : Whisper seul → `comprehension-orale`.  
Ce skill = **coupe + banque multi-pistes**.

## Règles non négociables

1. **1 piste = 1 document/dialogue = 1 écoute** — si le passage est joué deux
   fois, **ne garder que la 1ʳᵉ**.
2. **Début** = fin du bip + **0,5 s** (pas de bip dans le fichier final).
3. **Fin** = dernière phrase + **1 s**.
4. **Retirer** intros / consignes (« Épreuve blanche… », « Dialogue N… »,
   « Message numéro… », « Lisez… »).
5. **Remplacer** le gros MP3 par `stem-1.mp3`…`stem-n.mp3`, puis le supprimer.
6. Détection : Whisper **`large-v3`** + silences / bip ; relecture si
   « Sous-titrage Société Radio-Canada » ou piste < ~4 s.
7. Rien de copié d’une référence externe.

## Complet

```bash
python3 scripts/co-cut-complet.py --list
python3 scripts/co-cut-complet.py --exercise tcf-a2-s1-co-1
python3 scripts/co-cut-complet.py --all-pending
```

`support.audios[]` + `transcription: string[]` + `questions[].audio = N`.

## Association (situations illustrées)

```bash
python3 scripts/co-cut-association.py --list
python3 scripts/co-cut-association.py --exercise tcf-a1-s3-co-4
python3 scripts/co-cut-association.py --all-pending
```

`nb_dialogues` et `situations[].dialogue` restent les n° 1-based ; les pistes
`audios[i]` correspondent au dialogue `i+1`.

## six_courts / trois_moyens

Dans le catalogue UI : « 6 audios courts » / « 3 audios moyens », mais le
tirage (`draw-series.ts`) prend un **`complet`** avec 1 ou 2 questions — pas
une banque dédiée. Rien à découper tant qu’il n’existe pas d’exercice
`type_exercice: six_courts|trois_moyens` avec un MP3 groupé.

Si un tel exercice est ajouté : même pipeline (1 piste / extrait, 1 écoute),
`support.audios` de longueur 6 ou 3, `questions[].audio` 1-based.

## Images à reconnaître

En général **une seule piste** pour les 5 images. Si le fichier a une intro
d’examen + 2 écoutes du même contenu : tronquer (1 écoute, sans intro) en
gardant `support.audio` (string) — pas de multi-pistes.

## Checklist

- [ ] Multi-unités dans un seul MP3 ?
- [ ] Coupes sans bip / sans intro / +0,5 s / +1 s / 1 écoute
- [ ] Transcription propre par piste
- [ ] Références banque (`audio: N` ou `dialogue: N`) alignées
- [ ] Gros fichier source retiré
- [ ] `git push origin main` (skill `pousser-main`)
