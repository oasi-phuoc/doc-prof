# Lots d’images TCF du 24 novembre 2026

Demande : terminer les **21 candidats DELF Actif**, puis les **261 trios historiques** par lots de **100, 100 et 61**. Les fichiers restent séparés de ceux des lots anciens et gardent les sources, questions, corrigés et empreintes de départ.

| Lot | Cible | Activés | Prêts après revue comparative | Trios avec briefs | Nouvelles images publiées | Images à finaliser |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [DELF — reliquat final](delf-final21-preparation.json) | 21 | 21 | 21 | 21 | 50 | 0 |
| [Historique — lot 1](historique-lot01-preparation.json) | 100 | 100 | 100 | 100 | 345 | 0 |
| [Historique — lot 2](historique-lot02-preparation.json) | 100 | 0 | 58 | 100 | 181 | 88 |
| [Historique — lot 3](historique-lot03-preparation.json) | 61 | 0 | 0 | 61 | 4 | 176 |

**Reste : 0 candidat DELF et 161 trios historiques.** Les briefs et les images publiées d’un lot incomplet ne sont pas comptés comme des trios activés.

**Reprise prioritaire — question 39.** Les trois nouvelles scènes du rayon frais ont été comparées. Les portes, les caisses et la profondeur du magasin permettent de distinguer les emplacements. Les frigos sont intégrés aux rayons et les passages restent dégagés. Le trio est actif dans le premier lot. [Preuves de la reprise](reprise-question39.json).

**Reprise des personnages et du comptoir.** Le comptoir de l’office du tourisme masque les chaussures de l’employé. La comparaison de 10 lots a signalé 97 trios. 60 trios actifs utilisent les nouvelles versions et 37 trios historiques redessinés sont prêts. 178 illustrations ont été redessinées et contrôlées. Les 4 scènes de table corrigées ont été vérifiées dans le catalogue audio. [Questions et versions](../reprise-personnages-20261127.json).

**Génération suspendue par le quota du service.** Réouverture annoncée le 28/11/2026 à 21 h 37 min 40 s, heure suisse. [Réponse du service et demandes concernées](generation-blocker-20261128.json). Les revues déjà terminées sont conservées ; aucun lot incomplet n’est activé.

Les 21 derniers DELF ont été activés avec 50 nouveaux PNG natifs 1448 × 1086 et 13 images réutilisées. Les objets ont un fond ivoire contrôlé par mesure. Les variantes relationnelles partagent leur sujet et leur cadrage. Les propositions trop photographiques ont été reprises et leurs sources conservées dans le dossier de preuves.

Chaque activation exige trois illustrations contrôlées et une note comparative liée à la source. Aucune nouvelle écoute humaine n’est déclarée : la relecture porte sur les transcriptions actives. Les fichiers MP3, les bonnes réponses, les textes et les fragments JSON éditoriaux restent inchangés.

Contrôles : `python3 scripts/check-tcf-image-batch-20261124.py <registre-activation>`, `python3 scripts/check-delf-actif-images.py`, `node scripts/check-tcf-bank.mjs`, `node scripts/check-tcf-qcm-images.mjs` et tests du catalogue. Passer également les registres d’activation ultérieurs. Pour vérifier les corrections et l’ajout audio, ajouter `--revisions docs/tcf/corrections-transports-20261126.json`, `--revisions docs/tcf/reprise-personnages-20261127.json`, `--revisions docs/tcf/remplacement-audio/contre-verification-audio-pdf-20261127.json` et `--revisions docs/tcf/reussir-delf-a1-20261127/installation.json`.

Outils de reprise : `scripts/tcf-image-batch-jobs-20261124.py` sélectionne les générations dont la référence a été revue ; `scripts/publish-tcf-image-batch-20261124.py` publie uniquement une liste de revues visuelles explicites ; `scripts/activate-tcf-image-batch-20261124.py` active un lot entièrement prêt. Actualiser ce bilan avec `scripts/report-tcf-image-batches-20261124.py`.

Lorsque la banque locale contient déjà des activations et des corrections documentées, passer leurs registres à l’outil d’activation avec `--previous-activation` (dans l’ordre des lots) et `--revisions` (dans l’ordre des corrections). La banque et les sources sont revérifiées avant l’écriture du lot suivant.
