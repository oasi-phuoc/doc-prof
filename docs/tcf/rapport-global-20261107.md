# Avancement TCF — 7 novembre 2026

Les lots initiaux de pictogrammes, PO, 254 usages, horloges et tirage « objet » sont terminés. La revue des 763 candidates est achevée ; 573 trios restent à préparer après les 79 activations et les 111 décisions de conserver le texte. **Les 299 remplacements audio restent bloqués par les fichiers sources manquants. La consigne utilisateur a été actualisée : envoyer les changements sur `origin/main` après la revue des 763 questions, les audios restant en attente des sources.**

Ce bilan reprend les critères de `style-images.md`, des illustrations CO et PO, et les dernières demandes utilisateur. Les anciens plans datés des 2–5 novembre restent des archives ; leurs compteurs ne décrivent plus la banque actuelle. Aucun pourcentage global n’est calculé à partir de périmètres différents.

| Demande | État vérifié | Reste |
|---|---|---|
| Quatre pictogrammes de communication | Téléphone avec combiné ; même téléphone avec bulle ; enveloppe ouverte avec @ ; même enveloppe avec feuille lignée. 85 usages corrigés. | 0 dans ce lot |
| PO : trois thèmes pour poser des questions | 15 thèmes dans chacun des deux niveaux ; 238 références remplacées par des illustrations thématiques validées. Anciens supports enregistrés redirigés. | 0 dans ce lot |
| Quatre images PO de l’automate de bus | Quatre étapes dessinées, personnages et accessoires cohérents ; manifeste PO complet : 407 images, aucune correction de style identifiée en attente. | 0 dans ce lot |
| 254 usages CE/CO, 150 fichiers | 98 fichiers conformes conservés à l’identique, 8 réutilisations validées, 44 reprises générées et inspectées. 60 occurrences remplacées. | 0 dans ce lot |
| Horloges | 120 horloges et 18 minuteurs : même cadran et aiguilles calculées ; durées rouges et unités vérifiées. | 0 dans l’inventaire dédié |
| Reconnaissance d’objets | Catalogue de 211 concepts illustrés ; **107 pistes sur 1 025** satisfont le seuil d’au moins trois objets distincts identifiés dans leur transcription. Tags cumulables, 3 OUI / 2 NON et cinq positions mélangées. | Enrichissement possible du lexique pour les noms non encore couverts |
| Revue des 763 candidates | 79 variantes complètes activées, 111 décisions de conserver le texte, toutes les décisions liées à la source. | 573 trios à préparer |
| Remplacement audio | 726 références déjà installées, 299 restantes. Aucune des 299 n’a été remplacée sans les sources de contrôle. | 299 |

## Images et réponses : état de la banque actuelle

Les **5 630 usages d’images actifs CE/CO** sont rattachés à un fichier relu et vérifié par empreinte. Aucun ne pointe encore vers le dossier d’images du vocabulaire. Les fichiers originaux restent conservés, sauf l’harmonisation des cadrans expressément autorisée et les quatre corrections PO. La nouvelle version amont de `co834-velo-dessine.webp` est gardée au chemin courant ; sa version précédente est archivée à l’octet près, avec preuve dans le registre d’intégration.

Par rapport au commit de référence `c8b5ea2f`, le registre dénombre 1 958 usages d’images remplacés, 606 ajoutés (202 variantes QCM complètes) et 42 retirés dans 14 variantes ambiguës. Les questions correspondantes restent disponibles en texte. Le lot de reprise compte 527 fichiers relus, dont 516 utilisés par ces modifications ; 240 autres cibles déjà relues sont réutilisées. Ces nombres ne représentent pas autant de générations nouvelles dans cette seule session.

Les 1 800 variantes QCM image actives conservent trois propositions distinctes et les mêmes identifiants/corrigés que le texte. Les quatre distracteurs explicitement demandés ont été corrigés. Les 26 banques historiques de reconnaissance d’objets et leurs 130 images principales restent compatibles avec les fiches enregistrées. Le nouveau tirage est construit séparément à partir de la piste choisie.

La revue contextuelle couvre **7 851 questions dans 1 009 supports** : 6 140 décisions antérieures conservées pour un contenu source/question identique, 558 liaisons adaptées par les substitutions suisses exactes du commit amont, 1 093 questions revues lors de la phase initiale et 60 lors de l’intégration. Le registre `integration-main-20261107.json` documente les 458 opérations amont, les exceptions relues et les trois modèles écrits resynchronisés. Aucun support CE ni pool CO n’est sous le minimum structurel actuellement demandé. Cette relecture des textes/transcriptions ne constitue pas une écoute humaine de tous les audios.

## Ce qui reste à faire selon les critères et la couverture demandée

1. **Retrouver les sources audio et finaliser les 299 références.** Le dossier `/workspace/work` a disparu avec les originaux extraits et les découpes candidates. Les six anciennes références d’archives téléversées ont été essayées : aucune n’est actuellement autorisée/résoluble. Les fichiers audio servis sont présents, mais aucun des 299 n’a l’empreinte du candidat préparé attendu. Les sources ou les candidats vérifiables doivent être fournis à un emplacement accessible avant reprise des coupes, contrôles et installations. Les registres conservent 151 décisions éditoriales ; 148 références demandent encore leur décision. Les motifs techniques peuvent se cumuler, notamment 110 contrôles de frontière de source. Ne pas remplacer ces sources par de la parole synthétique.
2. **Étendre les variantes image aux autres questions concrètes encore textuelles.** La revue des 763 candidates est terminée : 79 nouvelles variantes activées, 111 conservées en texte avec motif individuel, et 573 trios à préparer ou compléter, en commençant par réutiliser la banque. Voir `revue-763-20261107.md` et son registre JSON. Ce n’est pas un nombre ferme d’images nouvelles : il faut contrôler le sens entier des trois choix et leur distinction avant activation. Ce travail est distinct de la revue des 254 usages existants, maintenant clôturée.
3. **Trier 3 622 autres questions textuelles sur le plan visuel.** Ce compteur automatique recouvre des situations concrètes et des notions abstraites ; il ne signifie pas 3 612 images à générer. Les 545 questions de personne/rôle/diagnostic, 417 de montant/mesure/taux et 782 de calendrier/identité/langue restent classées séparément. Garder les réponses en texte lorsqu’une image ne permet pas de les prouver, notamment les montants, dates, jours et mois.
4. **Compléter la CE A2-B1 si la couverture des trois niveaux TPF est attendue.** La banque actuelle ne contient aucun support CE dans ce niveau. Les niveaux TCF CSC et CFR sont présents.
5. **Après reprise des audios, refaire les contrôles contextuels et le calcul des tags.** Le tag « objet » dépend de la transcription exacte de chaque piste ; les mots ambigus ou non couverts ne sont pas comptés automatiquement. Le catalogue peut être enrichi avec des synonymes et des images validées. Une piste nommant seulement deux concepts admissibles reste exclue. Les petites horloges accessoires des scènes ne font pas partie de l’inventaire des 138 cadrans dédiés.
6. **Publication finale.** Reprendre les éventuels changements récents de `origin/main`, vérifier l’ensemble, puis pousser sans force après cette revue, selon la nouvelle instruction utilisateur. Les 299 audios restent explicitement en attente et n’empêchent plus cet envoi. La migration des fiches déjà enregistrées dans D1 n’est pas attestée par ce travail et nécessite l’accès serveur approprié.

## Contrôles réalisés

Compilation TypeScript et build Vite réussis. Contrôles réussis : 1 009 exercices / 1 025 pistes, 7 851 liaisons question/source, 1 800 variantes QCM et 12 régressions de mélange, 407 illustrations PO et anciens chemins, 15 thèmes PO et 64 tirages, 138 cadrans et quatre tests géométriques, dix tests de correspondance QCM et sept de réutilisation sémantique. Le tirage objet est vérifié pour chaque piste éligible : cinq images distinctes, trois vraies, deux fausses, exclusion de tous les concepts nommés des distracteurs, source de la bonne piste, stabilité du corrigé, reproductibilité avec la même graine et variation réelle des positions sur 64 graines. Aucun remplacement des 299 audios n’est déclaré validé.

L’intégration conserve les nouveaux documents CE suisses, les changements de format et les modifications d’interface amont. Les contrôles des 162 textes CE suisses, des 100 documents disponibles, des formats, des lecteurs et des sauts de page passent. Le build signale toujours un paquet JavaScript volumineux ; il réussit. L’optimisation de ce paquet ne fait pas partie de ce lot.

## Registres de référence

- `communication-pictogrammes-20261107.json` et `po-trois-themes-images-20261107.json` ;
- `po-corrections-style-20261107.json` et le manifeste PO ;
- `revue-254-usages-20261107.json`, `images-generees.json`, `reprise-images-20261106.json` ;
- `audit-contextuel-20261106.json`, `operations-contexte-20261106.json`, `images-restantes-contextuelles-20261106.json` ;
- `objets-tirage-20261107.json` et `horloges-aiguilles-uniformes-20261106.json` ;
- `remplacement-audio/bascule-restant-20261105.json` et les preuves de reconnaissance associées.

La liste des **252 fichiers originaux distincts nécessaires aux 299 références audio** est disponible dans `remplacement-audio/fichiers-originaux-necessaires-20261107.txt`. La correspondance détaillée figure dans le CSV associé.

## Compléments relevés sur le dernier main intégré

Le manifeste amont `ce-art-status.json` indique **100 documents CE CSC complets disponibles et 62 encore à produire/reprendre**. Ces documents contiennent le texte source et suivent leurs critères propres (prix CHF et dates du texte autorisés) ; ils sont distincts des illustrations de réponses QCM dont les 5 630 usages sont contrôlés ici.

Le plan amont `co-character-refresh.json` prévoit **10 reprises de personnages CO** (quatre scènes de bibliothèque et six scènes d’achats). Elles ne sont pas annoncées comme achevées. La correspondance avec les chemins actifs après harmonisation est dans `co-personnages-cibles-actuelles-20261107.json` ; utiliser ces cibles pour les prochaines reprises.

La localisation suisse fait également apparaître une candidate visuelle hors du lot initial figé de 763 : `tcf-a1p-s3-ce-4#6` (Schauspielhaus, parc du Zürichhorn, université). Elle reste à préparer et figure dans l’inventaire global. Le bilan du lot initial reste 79 variantes activées, 111 conservées en texte et 573 trios à préparer.
