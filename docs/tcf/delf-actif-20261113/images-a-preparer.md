# Illustrations des nouveaux audios DELF Actif

346 supports audio et 1 663 questions suivis. 475 trios concrets proposés à vérifier, 271 trios activés, 0 questions à examiner plus précisément.
Les 1,021 questions en attente de contexte ont été relues avec leur transcription complète et leurs trois réponses ; 41 ont été corrigées. Les décisions individuelles et citations sont dans [la revue contextuelle](revue-contexte-20261114.md). Une candidature reste à vérifier visuellement ; elle n’est pas une image livrée.


La génération des illustrations fait partie des tâches de ces nouveaux audios dès que les trois réponses sont illustrables : réutiliser les images adaptées, générer celles qui manquent, puis intégrer le trio contrôlé. Le tri automatique ne vaut pas relecture visuelle.

Cette extension complète les 370 anciens trios en attente sans les fusionner dans un compteur de questions déjà illustrables. Les dates, montants, noms et durées restent en texte quand une image ne prouve pas la réponse.

Ordre : A1, puis A2, puis B1. Réutiliser la banque avant toute génération. Trois réponses entières et distinctes, images 4:3 dans le style 48a753d8 ; personnages variés et inclusifs.

Le JSON conserve chaque support et son empreinte, les trois réponses, les candidats de réemploi, les briefs et les statuts de préparation. Aucune variante image incomplète n’est activée.

```sh
python3 scripts/prepare-delf-actif-images.py
python3 scripts/check-delf-actif-images.py
```
