# Illustrations des nouveaux audios DELF Actif

346 supports audio et 1 663 questions suivis. 342 trios concrets proposés à vérifier, 28 trios activés, 1021 questions à examiner plus précisément.

La génération des illustrations fait partie des tâches de ces nouveaux audios dès que les trois réponses sont illustrables : réutiliser les images adaptées, générer celles qui manquent, puis intégrer le trio contrôlé. Le tri automatique ne vaut pas relecture visuelle.

Cette extension complète les 386 anciens trios en attente sans les fusionner dans un compteur de questions déjà illustrables. Les dates, montants, noms et durées restent en texte quand une image ne prouve pas la réponse.

Ordre : A1, puis A2, puis B1. Réutiliser la banque avant toute génération. Trois réponses entières et distinctes, images 4:3 dans le style 48a753d8 ; personnages variés et inclusifs.

Le JSON conserve chaque support et son empreinte, les trois réponses, les candidats de réemploi, les briefs et les statuts de préparation. Aucune variante image incomplète n’est activée.

```sh
python3 scripts/prepare-delf-actif-images.py
python3 scripts/check-delf-actif-images.py
```
