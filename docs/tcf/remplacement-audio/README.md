# Remplacement des audios reçus

Le traitement des sources est préparé. **Le remplacement de la bibliothèque de production n’est pas terminé.** Aucun audio servi, exercice ou enregistrement D1 n’a été modifié par ce traitement.

Le lot contient 408 originaux distincts : 180 A1, 130 A2 et 98 B1, soit 8 h 42 min 43 s. Les 408 fichiers passent un décodage intégral et disposent d’une transcription automatique conservant les horodatages natifs. Les originaux et tous les fichiers de travail restent conservés.

Le repérage corrigé propose 875 segments sur les 408 sources. Les 875 candidats FLAC sans perte et leurs MP3 sont générés. Cinq séries disposent aussi d’un assemblage sans annonces de numérotation, dont le PCM correspond exactement aux passages utiles concaténés. Pour chaque FLAC et fenêtre de contrôle, les échantillons décodés sont comparés exactement à l’original ; chaque MP3 est entièrement décodé pour vérifier son intégrité. Les neuf sources précédemment bloquées ont été réalignées avec les horodatages natifs DTW de Whisper, sur une grille de 20 ms. Les mots coarticulés sans durée propre restent groupés, avec leurs horodatages natifs conservés ; aucune coupe ne passe à l’intérieur de ces groupes. Ces contrôles techniques n’établissent ni l’exactitude de la transcription ni la qualité audible des frontières.

617 anciennes références sont rapprochées des sources par comparaison du signal. Les 617 disposent maintenant d’un candidat préparé correspondant au passage. Les 111 découpes précédemment signalées sont reprises : premières lectures complètes sélectionnées, consignes retirées, messages séparés et fins de phrases complétées. Onze groupes d’anciens chemins proposent le même candidat et demandent un examen des alias. Les autres références de la bibliothèque actuelle restent à identifier. Une absence de correspondance ne prouve pas que l’original manque.

**Aucune écoute réelle n’est déclarée.** Les quatre fenêtres de frontière et les fichiers complets sont prêts à contrôler. Les transcriptions et les découpes restent des propositions. Un second moteur a examiné huit sources sensibles : des divergences sur des noms, dates, heures et numéros de téléphone sont conservées pour vérification. Les champs de contrôle ne sont jamais remplis automatiquement comme si une écoute avait eu lieu.

## Registres

- [Reprises des 111 passages et réalignement des 9 sources](reprises-et-realignements.json) : suivi des cas demandés, désormais sans blocage de découpe.
- [État chiffré](etat.json) : état réel du traitement, couverture et blocages.
- [Sources reçues](sources.json) : niveaux, noms originaux, identifiants de pièces jointes, durées et SHA-256.
- [Transcriptions et mots horodatés](transcriptions.json) : brouillons automatiques et ajustements temporels déclarés.
- [Assemblages sans numérotation](assemblages.json) : cinq séries reconstituées, avec preuve PCM et liens vers chaque frontière.
- [Découpes proposées](decoupes.json) : frontières, identifiants des candidats, noms/tags proposés et empreintes des fichiers générés.
- [Correspondances avec les exercices](correspondances.json) et [CSV](remplacements-proposes.csv) : identifiants d’exercices conservés, passages candidats et alertes sur les réponses.
- [Preuves de comparaison du signal](preuves-signal.json) : ancres audio, corrélations et décalages dans les originaux.
- [Remplacements préparés](remplacements-prepares.json) : liens vers les candidats réels et cas nécessitant un travail supplémentaire ; ce fichier n’est pas un mapping exécutable de production.
- [Comparaison des deux transcriptions](double-transcription.json) : résultats séparés, y compris les sorties incomplètes du second moteur sur certains originaux.

## Fichiers de travail et reprise

Le dossier de travail actuel est `/workspace/work/tcf-audio-replacement`. Il est hors du site servi. Il contient les originaux dans `incoming/`, les sorties ASR brutes dans `source-asr-parakeet/`, les plans dans `plans-native-final/` et les fichiers générés dans `staged-boundaries-work/`.

`staged-boundaries-work/review-index.html` ouvre les pages de contrôle : MP3 complet, quatre fenêtres FLAC et signal. Les modèles de revue sont laissés vierges. `mp3-index.json` et `batch-progress.json` relient les fichiers à leurs sources et à leurs empreintes. Les versions antérieures d’une découpe corrigée sont conservées. Les brouillons des banques, avec IDs et questions inchangés, sont dans `proposed-replacements-work/`.

Les scripts et leurs commandes sont décrits dans [le guide de traitement](../../../scripts/audio_replacement/README.md), [le guide des frontières](../../../scripts/README-tcf-audio-boundaries.md) et [le guide de préparation de migration](../../../scripts/README-tcf-audio-replacement.md).

## Avant la bascule

Il reste à vérifier l’écoute exigée par le cahier des charges, corriger les transcriptions et frontières incertaines, terminer les correspondances et confirmer les réponses de chaque exercice concerné. La granularité des candidats et les reprises doivent être contrôlées : le repérage automatique ne suffit pas à choisir un dialogue définitif.

L’accès à la base Cloudflare D1 distante `clairfle-fiches` n’est pas configuré dans cet environnement. L’inventaire local et les outils pour parcourir les recettes exportées sont prêts ; la base distante n’a été ni inspectée ni migrée.

Après ces contrôles : sauvegarder les données et octets à remplacer, mettre les nouveaux fichiers validés dans **`public/lib/audio/tcf/co/`**, migrer les banques et recettes, vérifier les exercices puis retirer uniquement les anciens fichiers devenus inutilisés. Les sources historiques, sauvegardes et fichiers temporaires restent conservés jusqu’à validation complète. Aucune seconde bibliothèque de production n’a été créée.
