# Prompt pour les enregistrements TCM CSC

Génère **neuf fichiers MP3 séparés**, puis regroupe-les dans un ZIP. Utilise la voix française Microsoft **fr-FR-DeniseNeural**, avec un débit de **−25 %**, un volume normal et une intonation naturelle. Conserve la même voix et les mêmes réglages pour tous les fichiers. Si cet outil ne propose pas cette voix, indique-le sans la remplacer par une autre voix.

Enregistre exactement les textes suivants, sans annoncer les noms des fichiers :

| Fichier | Texte prononcé |
|---|---|
| `consigne-nombres.mp3` | Écrivez le nombre que vous entendez. Il y a deux écoutes. Avant chaque écoute, vous entendez un bip. |
| `consigne-calculs.mp3` | Écrivez le calcul et son résultat. Il y a deux écoutes. Avant chaque écoute, vous entendez un bip. |
| `lettre-a.mp3` | A |
| `lettre-b.mp3` | B |
| `lettre-c.mp3` | C |
| `lettre-d.mp3` | D |
| `lettre-e.mp3` | E |
| `plus.mp3` | plus, avec le « s » final prononcé, comme dans « deux plus cinq » : /plys/ |
| `moins.mp3` | moins : /mwɛ̃/ |

Les lettres doivent être prononcées à la française (« a », « bé », « cé », « dé », « e »). Pour les deux opérateurs, prononce uniquement le mot demandé : n’énonce ni sa transcription phonétique ni l’exemple. Ne prononce aucun résultat de calcul.

Produis des MP3 mono de bonne qualité, idéalement à 24 kHz. Laisse seulement de très courtes marges de silence autour de chaque prise. N’ajoute ni musique, ni bruitage, ni bip réel, ni pauses de cinq ou sept secondes dans ces fichiers : l’application doit composer ces pauses et réutiliser son bip TCF existant.

## Montage à réaliser après réception des fichiers

Les nombres du générateur restent variables : on garde leurs clips existants et on assemble les enregistrements, sans figer un exercice complet dans un MP3.

1. Lire la consigne correspondante une fois.
2. Laisser cinq secondes, puis jouer `/lib/audio/tcf/consignes/bip-d-annonce.mp3`.
3. Première écoute : A + nombre/calcul, puis sept secondes ; B + nombre/calcul, puis sept secondes ; continuer jusqu’à E.
4. Après sept secondes, jouer le même bip et répéter exactement les mêmes questions A à E pour la seconde écoute, avec sept secondes entre les questions.
5. Aucun résultat n’est prononcé dans les calculs. Les silences de début et de fin des clips doivent être pris en compte pour obtenir les battements réels demandés.

**État actuel : enregistrements non générés.** L’accès sortant à `speech.platform.bing.com` est refusé dans l’environnement cloud (proxy CONNECT 403). Les anciens clips et les téléchargements existants sont conservés ; le nouveau montage à deux écoutes n’est pas annoncé comme livré.

## Complément CFR conservé du document partagé

Le projet prévoit aussi une dixième prise pour le CFR, distincte du lot de neuf MP3 CSC demandé ici :

| Fichier supplémentaire CFR | Texte prononcé |
|---|---|
| `consigne-multiplications.mp3` | Écrivez le résultat de la multiplication que vous entendez. Il y a deux écoutes. Avant chaque écoute, vous entendez un bip. |

Le CFR garde ses nombres et ses multiplications : seule la narration est ajoutée. Le fichier `consigne-nombres.mp3` est commun aux deux tests ; `consigne-calculs.mp3` sert aux additions/soustractions CSC et `consigne-multiplications.mp3` aux multiplications CFR. Le générateur `generate-tcm-csc-denise.py` produit uniquement le lot CSC de neuf MP3 ; ce complément CFR n’est pas inclus dans ce ZIP.
