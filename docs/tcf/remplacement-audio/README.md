# Remplacement des audios reçus

Le corpus reçu compte **836 entrées de fichiers sources** : 408 dans le premier lot et 428 dans les six collections supplémentaires. Après le retrait autorisé des deux pistes de copyright, **834 sources sont conservées et traitées**. Toutes passent le décodage intégral et disposent d’un brouillon de transcription horodatée.

**La préparation locale est terminée : 1 548 extraits FLAC et leurs 1 548 MP3 sont générés, avec les fenêtres de contrôle et les formes du signal.** Quatorze assemblages supplémentaires reconstituent des séries utiles sans les annonces de numérotation, dont le nouvel assemblage des six annonces scolaires. Le [suivi unifié](progression-unifiee.json) donne les compteurs des deux lots. Le remplacement de la bibliothèque servie et la migration D1 restent à faire.

Le premier lot fournit 887 extraits et huit assemblages ; le [lot supplémentaire](lot-supplementaire/README.md) fournit 661 extraits et six assemblages. Les échantillons décodés de chaque FLAC et de chaque fenêtre de contrôle sont comparés exactement à la source. Chaque MP3 est entièrement décodé. Le PCM des assemblages correspond exactement à la concaténation des passages retenus.

La nouvelle relecture textuelle corrige les limites de **170 entrées sources : 73 dans le premier lot et 97 dans le lot supplémentaire**. Elle retire des consignes et numéros résiduels, sépare six annonces auparavant réunies, récupère quatre situations complètes et rétablit le début d’un reportage sur les cafés ruraux. Les noms d’objets des pistes A1 50 et 51 disposent aussi d’extraits séparés et d’un assemblage sans numérotation. Le [registre des corrections](corrections-de-limites.json) conserve les décisions et les empreintes des plans précédents.

Les neuf premiers réalignements sont conservés. Des alignements DTW supplémentaires reprennent les chevauchements et mots fusionnés de trois nouvelles sources, ainsi que la séparation entre « Yousef » et l’annonce d’exercice suivante. Les adresses internet prononcées en une expression restent des unités indivisibles explicitement documentées. Les horodatages restent des estimations automatiques ; aucune durée phonétique certifiée n’est revendiquée.

**890 anciennes références sur 1 318 sont reliées à un candidat réel** : 889 par ancres du signal à décalage constant et une par ancres ordonnées dans un montage, avec un assemblage explicitement préparé. Les **432 références du lot restant ont toutes été retranscrites directement**. Quatre sources sont retrouvées ; pour les **428 autres**, le fichier actuel et sa nouvelle transcription constituent le repli demandé par l’utilisateur. Le [rapport de rapprochement](rapprochement-432/README.md) conserve les résultats et trois liaisons audio/questions décalées confirmées par deux reconnaissances distinctes. Les longues pauses d’examen et les lectures répétées sont prises en compte sans abaisser les seuils de confirmation. Les preuves antérieures et les 17 groupes d’alias à revoir restent conservés.

**Aucune écoute réelle n’est déclarée.** Les quatre fenêtres de frontière et les fichiers complets sont prêts à contrôler. Il reste à vérifier les premiers et derniers mots, les consignes encore éventuellement audibles, les transcriptions, les noms, les nombres et les réponses des exercices. Les champs d’attestation restent vierges. Les brouillons ASR contenant des passages mal reconnus ou en anglais sont signalés et ne constituent pas des transcriptions définitives.

Le [contrôle de structure et de couverture des questions](questions-a-controler.json) porte sur 4 059 questions de 541 exercices utilisant les 890 supports reliés. Elles présentent une formulation interrogative, trois choix et une seule réponse indiquée comme correcte. Trois banques ont été [complétées à quatre questions](questions-completees.json), avec une information explicite dans leurs transcriptions. Il reste 21 banques sous le minimum demandé, dont vingt associées à des phrases isolées ou questions d’entraînement très courtes. Leur contenu est à enrichir ou regrouper. Les alertes lexicales orientent la relecture des réponses ; les synonymes et erreurs d’ASR peuvent les déclencher. La justesse sémantique de l’ensemble reste à contrôler sur les sources.

Le [contrôle global des banques actuelles](../../../scripts/tcf-bank-audit.json) recense 9 466 questions, avec 107 pools CO et trois supports CE encore sous leur minimum. Il inclut les supports dont le remplacement reste à préparer.

## Registres

- [Avancement des deux lots](progression-unifiee.json) et [liaisons préparées unifiées](liaisons-unifiees.json).
- [Corrections textuelles des limites](corrections-de-limites.json).
- [Questions complétées](questions-completees.json) et [questions à contrôler](questions-a-controler.json).
- [Reprises des 111 passages et neuf premiers réalignements](reprises-et-realignements.json).
- [État du premier lot](etat.json), [sources](sources.json), [transcriptions horodatées](transcriptions.json), [extraits](decoupes.json) et [assemblages](assemblages.json).
- [Correspondances](correspondances.json), [CSV](remplacements-proposes.csv), [preuves de signal](preuves-signal.json), [candidats préparés](remplacements-prepares.json) et [comparaison des transcriptions](double-transcription.json).
- [Sources et résultats des collections supplémentaires](lot-supplementaire/README.md).

## Fichiers de travail et reprise

Les fichiers restent hors du site servi, dans `/workspace/work/tcf-audio-replacement` et `/workspace/work/tcf-audio-additional-20261102-work`. Chaque dossier contient `staged-boundaries-work/review-index.html`, les MP3, les FLAC, les quatre fenêtres de contrôle et les modèles de revue vierges. Les plans courants sont indexés dans `plans-textual-review-v4/segmentation-index.json` pour le premier lot et `plans-all-reviewed-v9/segmentation-index.json` pour le lot supplémentaire. Les versions antérieures restent conservées.

Les vues de mots utilisées pour le rapprochement proviennent de ces plans exacts. Elles conservent les groupes coarticulés et évitent de confondre leurs indices avec ceux d’une autre transcription brute. Chaque réception conserve son identifiant et sa provenance, y compris lorsque ses octets permettent de réutiliser une analyse antérieure. Pour tenir dans le stockage disponible, les copies de travail immuables et certains fichiers générés aux octets identiques partagent leur stockage ; tous leurs chemins et octets restent présents. Les originaux téléversés, sauvegardes et archives sont conservés.

Les [outils de traitement](../../../scripts/audio_replacement/README.md), le [guide des frontières](../../../scripts/README-tcf-audio-boundaries.md) et le [guide de préparation de migration](../../../scripts/README-tcf-audio-replacement.md) décrivent la reprise. Les liaisons publiées sont destinées à la revue et ne sont pas un mapping exécutable de production.

## Avant la bascule

Il reste à terminer les correspondances, contrôler chaque fichier par écoute selon le cahier des charges, affiner les transcriptions et métadonnées et vérifier les questions et réponses concernées. Les identifiants d’exercices restent conservés dans les brouillons de banques.

L’API des fiches est `https://clairfle-fiches.phuoc-van.workers.dev`. Sa connexion reste bloquée par la politique réseau du cloud, avant de joindre le Worker ; l’authentification et D1 ne sont pas vérifiées. La base n’a été ni inspectée ni migrée.

Après ces contrôles : sauvegarder les données et octets à remplacer, installer les fichiers validés dans **`public/lib/audio/tcf/co/`**, migrer les banques et recettes, vérifier les exercices, puis retirer uniquement les anciennes références et fichiers devenus inutilisés. Aucune seconde bibliothèque de production n’a été créée.
