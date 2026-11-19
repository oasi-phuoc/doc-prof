# Prompt pour les enregistrements TCM CSC et CFR

Génère les fichiers MP3 séparés du tableau, plus les lettres F à L, la consigne « entourer » et la consigne des multiplications CFR. Regroupe-les dans un seul ZIP. Utilise la voix française Microsoft **fr-FR-DeniseNeural**, avec un débit de **−25 %**, un volume normal et une intonation naturelle. Conserve la même voix et les mêmes réglages pour tous les fichiers. Si cet outil ne propose pas cette voix, indique-le sans la remplacer par une autre voix.

Enregistre exactement les textes suivants, sans annoncer les noms des fichiers :

| Fichier | Texte prononcé |
|---|---|
| `consigne-entourer.mp3` | Entourez les nombres que vous entendez. Il y a deux écoutes. |
| `consigne-nombres.mp3` | Écrivez le nombre que vous entendez. Il y a deux écoutes. |
| `consigne-calculs.mp3` | Écrivez le calcul et son résultat. Il y a deux écoutes. |
| `consigne-multiplications.mp3` | Écrivez le résultat de la multiplication. Il y a deux écoutes. |
| `lettre-a.mp3` | A |
| `lettre-b.mp3` | B |
| `lettre-c.mp3` | C |
| `lettre-d.mp3` | D |
| `lettre-e.mp3` | E |
| `lettre-f.mp3` | F |
| `lettre-g.mp3` | G |
| `lettre-h.mp3` | H |
| `lettre-i.mp3` | I |
| `lettre-j.mp3` | J |
| `lettre-k.mp3` | K |
| `lettre-l.mp3` | L |
| `plus.mp3` | plus, avec le « s » final prononcé, comme dans « deux plus cinq » : /plys/ |
| `moins.mp3` | moins : /mwɛ̃/ |
| `fois.mp3` | fois |

Les lettres doivent être prononcées à la française (« a », « bé », « cé », « dé », « e », « effe », « gé », « ache », « i », « ji », « ka », « elle »). Pour les opérateurs, prononce uniquement le mot demandé : n’énonce ni sa transcription phonétique ni l’exemple. Ne prononce aucun résultat de calcul.

Produis des MP3 mono de bonne qualité, idéalement à 24 kHz. Laisse seulement de très courtes marges de silence autour de chaque prise. N’ajoute ni musique, ni bruitage, ni bip réel, ni pauses de cinq ou sept secondes dans ces fichiers : l’application doit composer ces pauses et réutiliser son bip TCF existant.

## Montage à réaliser après réception des fichiers

Les nombres du générateur restent variables : on garde leurs clips existants et on assemble les enregistrements, sans figer un exercice complet dans un MP3.

1. Lire la consigne correspondante une fois.
2. Laisser deux secondes, puis jouer `/lib/audio/tcf/consignes/bip-d-annonce.mp3`.
3. Première écoute : A, une demi-seconde, puis le nombre ou le calcul (chiffre, symbole, chiffre), puis cinq secondes ; B, une demi-seconde, l’énoncé, cinq secondes ; continuer jusqu’à la dernière lettre.
4. Après cinq secondes, jouer le même bip et répéter exactement les mêmes lettres et énoncés pour la seconde écoute.
5. Aucun résultat n’est prononcé dans les calculs. Les silences de début et de fin des clips doivent être pris en compte pour obtenir les battements réels demandés.

Les prises DeniseNeural −25 % sont dans `public/lib/audio/tcm-csc/denise/`. Le montage (consigne, 2 s, bip, lettre, 0,5 s, énoncé, 5 s, puis 2e écoute) s’active quand le manifeste est `generated`.

Le CFR reprend `consigne-nombres.mp3` et `consigne-multiplications.mp3`. Les fichiers téléchargés du CSC suivent l’ordre affiché : exercice 1 entourer, exercice 2 nombres, exercice 3 calculs.
