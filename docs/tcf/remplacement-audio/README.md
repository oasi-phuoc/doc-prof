# Remplacement des audios reçus

**Mise à jour du 5 novembre : les 297 anciennes références sans original ont été retirées à la demande de l’utilisateur, ainsi que les 253 exercices associés. Les 14 nouveaux audios corrigés restent présents. Les chiffres de rapprochement ci-dessous constituent le registre historique avant retrait.** Le détail est dans `docs/tcf/remplacement-audio/retrait-297-references-20261104.json`.

Les lots DELF reçus comptent **836 entrées de fichiers sources** : 408 dans le premier lot et 428 dans les six collections supplémentaires. Après le retrait autorisé des deux pistes de copyright, **834 sources sont conservées et traitées**. Toutes passent le décodage intégral et disposent d’un brouillon de transcription horodatée. Les **127 originaux A1 ajoutés pour la grammaire** sont transcrits dans leur propre banque et ont aussi servi au rapprochement CO : le corpus de recherche compte donc **961 réceptions actives**, soit 963 entrées reçues avant les deux retraits de copyright.

**1 681 extraits FLAC et leurs MP3 sont préparés : 1 548 issus des lots DELF, 131 issus des originaux de grammaire et deux coupes de fichiers actuels de repli.** Les fenêtres de contrôle et les formes du signal sont conservées. Quatorze assemblages supplémentaires reconstituent des séries utiles sans les annonces de numérotation, dont le nouvel assemblage des six annonces scolaires. Le [suivi unifié](progression-unifiee.json) donne les compteurs des deux lots. Quatorze audios corrigés sont installés dans la banque servie ; la bascule globale et la migration D1 restent à poursuivre.

Le premier lot fournit 887 extraits et huit assemblages ; le [lot supplémentaire](lot-supplementaire/README.md) fournit 661 extraits et six assemblages. Les échantillons décodés de chaque FLAC et de chaque fenêtre de contrôle sont comparés exactement à la source. Chaque MP3 est entièrement décodé. Le PCM des assemblages correspond exactement à la concaténation des passages retenus.

La nouvelle relecture textuelle corrige les limites de **170 entrées sources : 73 dans le premier lot et 97 dans le lot supplémentaire**. Elle retire des consignes et numéros résiduels, sépare six annonces auparavant réunies, récupère quatre situations complètes et rétablit le début d’un reportage sur les cafés ruraux. Les noms d’objets des pistes A1 50 et 51 disposent aussi d’extraits séparés et d’un assemblage sans numérotation. Le [registre des corrections](corrections-de-limites.json) conserve les décisions et les empreintes des plans précédents.

Les neuf premiers réalignements sont conservés. Des alignements DTW supplémentaires reprennent les chevauchements et mots fusionnés de trois nouvelles sources, ainsi que la séparation entre « Yousef » et l’annonce d’exercice suivante. Les adresses internet prononcées en une expression restent des unités indivisibles explicitement documentées. Les horodatages restent des estimations automatiques ; aucune durée phonétique certifiée n’est revendiquée.

**1 021 anciennes références sur 1 318 ont une source identifiée** : toutes disposent maintenant d’un candidat préparé. Le [registre des identités](identites-sources-unifiees.json) inclut les 131 rapprochements trouvés dans les nouveaux originaux de grammaire ; le [registre des candidats](liaisons-unifiees.json) conserve seulement les fichiers déjà préparés. Les **432 références du lot restant ont toutes été retranscrites directement** : 135 sont rapprochées, et pour les **297 autres**, le fichier actuel et sa transcription constituent le repli demandé. Le [rapport de rapprochement](rapprochement-432/README.md) conserve les résultats et trois liaisons audio/questions décalées, confirmées par deux reconnaissances distinctes puis corrigées avec des enregistrements authentiques et des questions adaptées. Les longues pauses d’examen et les lectures répétées sont prises en compte sans abaisser les seuils de confirmation. Les preuves antérieures et les 17 groupes d’alias à revoir restent conservés.

Les [131 nouvelles coupes](rapprochement-432/extension-127/README.md) passent les contrôles techniques et une reconnaissance du MP3 final. Le premier « Oh » de la piste 094 a été rétabli après détection d’une limite trop tardive. Les [corrections appliquées](corrections-appliquees-20261104.json) documentent les sept exercices modifiés, leurs versions précédentes, les quatorze audios installés et les preuves textuelles des 57 questions relues. Les identifiants d’exercice sont conservés ; des alias reconnaissent les anciennes sélections audio.

**Aucune écoute humaine n’est déclarée.** Les quatre fenêtres de frontière et les fichiers complets sont prêts à contrôler. Il reste à vérifier les premiers et derniers mots, les consignes encore éventuellement audibles, les transcriptions, les noms, les nombres et les réponses des exercices. Les champs d’attestation restent vierges. Les brouillons ASR contenant des passages mal reconnus ou en anglais sont signalés et ne constituent pas des transcriptions définitives.

Le [contrôle de structure et de couverture des questions](questions-a-controler.json) porte sur 4 877 questions de 669 exercices utilisant les 1 021 anciennes références reliées. Elles présentent une formulation interrogative, trois choix et une seule réponse indiquée comme correcte. Trois banques avaient été [complétées à quatre questions](questions-completees.json). Les sept banques insuffisantes du nouveau lot atteignent aussi leur minimum : deux questions par règle courte, quatre pour Christian et huit pour Nina. Il reste 21 banques sous le minimum demandé, dont vingt associées à des phrases isolées ou questions d’entraînement très courtes. Leur contenu est à enrichir ou regrouper. Les alertes lexicales orientent la relecture des réponses ; les synonymes et erreurs d’ASR peuvent les déclencher. La justesse sémantique de l’ensemble reste à contrôler sur les sources.

Le [contrôle global des banques actuelles](audit-banque-apres-corrections-20261104.json) recense 9 490 questions, avec 97 pools CO et trois supports CE encore sous leur minimum. Il inclut les supports dont le remplacement reste à préparer.

## Registres

- [Avancement des deux lots](progression-unifiee.json) et [liaisons préparées unifiées](liaisons-unifiees.json).
- [Corrections textuelles des limites](corrections-de-limites.json), [nouvelles coupes contrôlées](rapprochement-432/extension-127/validation-technique.json) et [corrections appliquées](corrections-appliquees-20261104.json).
- [Questions complétées](questions-completees.json) et [questions à contrôler](questions-a-controler.json).
- [Reprises des 111 passages et neuf premiers réalignements](reprises-et-realignements.json).
- [État du premier lot](etat.json), [sources](sources.json), [transcriptions horodatées](transcriptions.json), [extraits](decoupes.json) et [assemblages](assemblages.json).
- [Correspondances](correspondances.json), [CSV](remplacements-proposes.csv), [preuves de signal](preuves-signal.json), [candidats préparés](remplacements-prepares.json) et [comparaison des transcriptions](double-transcription.json).
- [Sources et résultats des collections supplémentaires](lot-supplementaire/README.md).

## Fichiers de travail et reprise

Les candidats encore en attente restent hors du site servi, dans `/workspace/work/tcf-audio-replacement` et `/workspace/work/tcf-audio-additional-20261102-work`. Chaque dossier contient `staged-boundaries-work/review-index.html`, les MP3, les FLAC, les quatre fenêtres de contrôle et les modèles de revue vierges. Les plans courants sont indexés dans `plans-textual-review-v4/segmentation-index.json` pour le premier lot et `plans-all-reviewed-v9/segmentation-index.json` pour le lot supplémentaire. Les versions antérieures restent conservées. Le troisième dossier est `/workspace/work/tcf-audio-reconciliation-20261104/grammar-cuts-work`, avec `segmentation-index-v3.json` ; les deux replis sont dans `repair-daily-dialogues-work`.

Les vues de mots utilisées pour le rapprochement proviennent de ces plans exacts. Elles conservent les groupes coarticulés et évitent de confondre leurs indices avec ceux d’une autre transcription brute. Chaque réception conserve son identifiant et sa provenance, y compris lorsque ses octets permettent de réutiliser une analyse antérieure. Pour tenir dans le stockage disponible, les copies de travail immuables et certains fichiers générés aux octets identiques partagent leur stockage ; tous leurs chemins et octets restent présents. Les originaux téléversés, sauvegardes et archives sont conservés.

Les [outils de traitement](../../../scripts/audio_replacement/README.md), le [guide des frontières](../../../scripts/README-tcf-audio-boundaries.md) et le [guide de préparation de migration](../../../scripts/README-tcf-audio-replacement.md) décrivent la reprise. Les liaisons publiées sont destinées à la revue et ne sont pas un mapping exécutable de production.

## Poursuivre la bascule

Il reste à terminer les correspondances, contrôler chaque fichier par écoute selon le cahier des charges, affiner les transcriptions et métadonnées et vérifier les questions et réponses concernées. Les identifiants d’exercices restent conservés dans les brouillons de banques.

L’API des fiches est `https://clairfle-fiches.phuoc-van.workers.dev`. Sa connexion reste bloquée par la politique réseau du cloud, avant de joindre le Worker ; l’authentification et D1 ne sont pas vérifiées. La base n’a été ni inspectée ni migrée.

Après ces contrôles : sauvegarder les données et octets à remplacer, installer les fichiers validés dans **`public/lib/audio/tcf/co/`**, migrer les banques et recettes, vérifier les exercices, puis retirer uniquement les anciennes références et fichiers devenus inutilisés. Aucune seconde bibliothèque de production n’a été créée.

Le [bilan des vérifications du 4 novembre](verification-20261104.json) distingue les contrôles réussis du contrôle historique CE désynchronisé : sa première fiche a déjà huit questions dans le commit antérieur, mais le vieux rapport de revue ne contient que trois faits. Aucun texte ni aucune question CE n’a été modifié par cette reprise.
