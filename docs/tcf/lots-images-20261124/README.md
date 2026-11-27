# Lots d’images TCF du 24 novembre 2026

Demande : terminer les **21 candidats DELF Actif**, puis les **261 trios historiques** par lots de **100, 100 et 61**. Les fichiers restent séparés de ceux des lots anciens et gardent les sources, questions, corrigés et empreintes de départ.

| Lot | Cible | Activés | Prêts après revue comparative | Trios avec briefs | Nouvelles images publiées | Images à finaliser |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [DELF — reliquat final](delf-final21-preparation.json) | 21 | 21 | 21 | 21 | 50 | 0 |
| [Historique — lot 1](historique-lot01-preparation.json) | 100 | 100 | 100 | 100 | 270 | 0 |
| [Historique — lot 2](historique-lot02-preparation.json) | 100 | 0 | 20 | 20 | 53 | 0 |
| [Historique — lot 3](historique-lot03-preparation.json) | 61 | 0 | 0 | 0 | 0 | À définir |

**Reste : 0 candidat DELF et 161 trios historiques.** Les briefs et les images publiées d’un lot incomplet ne sont pas comptés comme des trios activés.

Les 21 derniers DELF sont illustrés par 50 nouveaux PNG natifs 1448 × 1086 et 13 images existantes réutilisées. Le catalogue et les métadonnées visuelles sont actualisés. Les objets ont un fond ivoire contrôlé par mesure ; les variantes relationnelles partagent leur sujet et leur cadrage. Les propositions trop photographiques ont été reprises et leurs sources conservées hors catalogue dans le dossier de preuves.

Chaque activation exige trois illustrations contrôlées et une note comparative liée à la source. Aucune nouvelle écoute humaine n’est déclarée : la relecture porte sur les transcriptions actives. Les fichiers MP3, les bonnes réponses, les textes et les fragments JSON éditoriaux restent inchangés.

Contrôles : `python3 scripts/check-tcf-image-batch-20261124.py <registre-activation>`, `python3 scripts/check-delf-actif-images.py`, `node scripts/check-tcf-bank.mjs`, `node scripts/check-tcf-qcm-images.mjs` et tests du catalogue. Passer également les registres ultérieurs au premier contrôle si d’autres lots ont depuis ajouté leurs variantes.

Outils de reprise : `scripts/tcf-image-batch-jobs-20261124.py` sélectionne les générations dont la référence a été revue ; `scripts/publish-tcf-image-batch-20261124.py` publie uniquement une liste de revues visuelles explicites ; `scripts/activate-tcf-image-batch-20261124.py` active un lot entièrement prêt. Actualiser ce bilan avec `scripts/report-tcf-image-batches-20261124.py`.


**Deuxième lot — jalon du 27 novembre.** Les 20 premières sources sont relues intégralement et leurs 60 choix comparés. Les 53 créations natives 4:3 et sept réemplois distincts sont contrôlés ; 20 trios sont prêts, sans activation partielle du lot de100. Les propositions écartées et les captures antérieures à la revue sont conservées. [État et contrôles](historique-lot02-reprise-20261127.json).
