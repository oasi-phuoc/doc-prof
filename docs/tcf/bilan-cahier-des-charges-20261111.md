# Bilan du cahier des charges — mise à jour du 12 novembre 2026

Ce bilan remplace les anciens compteurs d’avancement. Les sources des nombres sont les registres liés ; les contrôles structurels ne prouvent pas à eux seuls la justesse de toutes les réponses ou une écoute humaine.

## Réalisé

- Bascule technique des **1 025 références audio actives**, avec conservation des URL et preuves de provenance. Il ne reste aucune installation dans ce périmètre historique ; le contrôle final n’est pas terminé ([registre](remplacement-audio/bascule-complete-20261105.json)).
- Complément des **60 banques CO et trois supports CE**. Audit du 11 novembre : 1 009 supports, 7 851 questions, aucun support CE ni pool CO sous le minimum, aucune erreur ni avertissement.
- Les **252 transcriptions de grammaire** sont intégrées : 127 A1 et 125 A2. Les 34 réserves A2 ont été reprises ; un numéro incomplet reste documenté dans la source ([suivi](../grammaire/co-import/revue-34-points-20261105.json)).
- Harmonisation des images actives : le dernier inventaire recense **zéro usage restant du dossier vocabulaire**. Les anciens nombres de 1 036 et 1 906 usages sont dépassés ([registre](reprise-images-20261106.json)).
- **208 PDF** extraits et indexés par collection. Le rapprochement actuel repère 103 égalités normalisées, 45 correspondances fortes et sept possibles à revoir. Dix corrections éditoriales documentées : neuf sur les transcriptions et une sur le format des réponses ([corrections](remplacement-audio/verification-pdf-corrections-20261111.json)).
- **Nouvelles collections retirées à la demande de l’utilisateur** : 205 copies téléchargées retirées de la file d’import, dont 201 supprimées et quatre sources conservées uniquement pour les corrections d’édition explicitement demandées. Aucun exercice ajouté et aucun audio actif supprimé ([retrait](remplacement-audio/retrait-nouvelles-collections-20261111.json)).
- **87 validations différées clôturées** : 82 dossiers satisfont les contrôles de convergence après les résolutions documentées ; cinq ont une relecture contextuelle explicite, avec les désaccords bruts conservés. Les graphies de noms non épelés sont présentées comme des conventions éditoriales. Aucune écoute humaine n’est attestée ([preuves](remplacement-audio/validation-87-20261111.json)).
- **Quatre écarts d’édition corrigés et installés** : samedi uniquement, espèces uniquement, fermeture dans vingt minutes et promotion FMAC du 9 au 16 mars sur les imprimantes. Questions, réponses et variantes image réutilisées synchronisées ([journal](remplacement-audio/corrections-4-editions-20261111.json)).
- **Début « Allô, Brigitte » rétabli** depuis les trames natives de l’original, puis reconnu par deux moteurs sur le nouveau MP3. Le téléphone de l’école ABC est corrigé en 05 43 98 76 54, confirmé par trois sorties ([coupe](remplacement-audio/correction-debut-allo-brigitte-20261112.json), [téléphone](remplacement-audio/correction-telephone-abc-20261112.json)).
- Compilation CSC : pour chaque document, annonce unique, bip, première écoute, pause, bip, deuxième écoute, pause. Les quatre scénarios sont désormais traités successivement avec leurs deux écoutes. Pas d’annonce « Audio 1 » pour l’audio complet unique. Pauses conservées à **15 secondes**, ou **30 secondes** pour le document long. La pause manquante de reconnaissance d’objets est ajoutée.
- Tirage CSC OBJET : les deux images NON appartiennent aux thèmes des images OUI affichées ; tous les concepts nommés dans la transcription sont exclus des leurres. Les images existantes sont réutilisées. Vérification des 107 pistes éligibles parmi les 1 025 actives et des cinq formats de compilation.

- **50 dialogues PE : double présentation de la situation supprimée.** La consigne indique « Complétez le dialogue. » ; la situation détaillée apparaît une seule fois. Les anciennes recettes sont normalisées lors de leur affichage, sans migration D1. Les échanges et barèmes sont conservés ([audit](pe-dialogue-consignes-20261112.json)).

## À terminer, dans l’ordre

Le lot demandé de 87 validations et quatre corrections d’édition est terminé. Le contrôle final de toute la bibliothèque reste un périmètre distinct ; les contrôles complémentaires historiques sont conservés dans le registre de relecture. Les 870 références sans correspondance fiable avec les seuls PDF fournis ne sont pas assimilées à des transcriptions erronées.

1. **Images après stabilisation des questions** : les 433 trios demandés disposent maintenant d’un dossier lié au support et aux trois choix actuels, avec candidats de réemploi et priorité A1/A2 ([préparation](preparation-433-trios-20261112.json)). Douze trios sont intégrés (documents A1/A2, plats/desserts A2, jeunes animaux A1, lieux de visite A2, accessoires de vélo A1, cadeaux, meubles et vêtements A1), 421 restent à compléter. Un ancien trio supplémentaire est invalidé par la correction « ses sacs » : **422 trios restent donc au total**, dont 183 A1, 216 A2 et 23 B1. Une correspondance de libellé est une proposition de réemploi, pas une validation contextuelle anticipée. Les 97 dossiers dont la transcription avait changé ont été relus et leurs liens actualisés ([relecture](relecture-images-apres-audio-20261112.json)). Les **dix reprises de personnages CO sont terminées**, soit quatorze usages mis à jour. L’affiche « La clé de sol » est intégrée : **162 documents CE disponibles, aucun restant dans ce lot**. Les cinq exercices d’association ont leurs leurres contrôlés ; quatre images existantes sont réutilisées et deux leurres hors thème ont été redessinés. Le tirage aléatoire utilise huit leurres contrôlés, dans les thèmes entendus, et rejette une source modifiée sans relecture ([association](revue-leurres-association-20261112.json)).
2. **Grammaire** : les banques de phrases et activités de communication existent ; la réécriture FALC complète de la théorie n’est pas attestée. Les questions des supports CO de grammaire restent à créer, ainsi que **150 illustrations** prévues ([suivi grammaire](../grammaire/README.md)).
3. **Fiches enregistrées dans D1** : migration et vérification restent à effectuer avec l’accès serveur. L’URL publique du Worker ne donne pas cet accès.
4. Refaire le contrôle contextuel des questions, images, tags et corrigés après chaque changement audio, puis publier les lots vérifiés sur `origin/main`.

## Rappels de fichiers

Le rappel des pistes 31, 46, 53 et 54 est **annulé** : elles appartenaient à la collection de nouvelles voix désormais exclue. Le PDF A1 Piste76.pdf reste absent du lot documentaire ; ce point n’empêche pas la clôture du lot demandé.

## Vérification de cette reprise

`node scripts/check-tcf-co-playlists.mjs` vérifie les cinq formats, les pauses entre les écoutes, les annonces et les fichiers nécessaires. `node scripts/check-tcf-object-pool.mjs` vérifie les thèmes des leurres, leur absence dans la transcription, les cinq images distinctes, les corrigés, le mélange et la conservation des sources. La reprise images du 12 novembre intègre **34 nouveaux PNG originaux sans conversion** : cinq paires de documents, dix scènes CO, une affiche CE, trois plats/desserts, trois jeunes animaux, un aquarium public, trois variantes d’accessoires de vélo, trois ensembles de cadeaux, trois ensembles de meubles et deux vêtements, tous en paysage exact 4:3. Le style reste lié au commit `48a753d8`. Les scènes CO renouvellent les visages, carnations, âges, genres, morphologies et situations de handicap, sans déduire une nationalité de l’apparence.

`python3 scripts/check-tcf-final-review.py` contrôle les 87 empreintes actives, les instantanés des exercices, les relectures contextuelles explicites et les quatre corrections d’édition.

`node scripts/check-tcf-association-images.mjs` vérifie les 21 sources, les huit leurres approuvés, les cinq exercices et 600 tirages reproductibles (images distinctes, thème et absence, corrigés conservés). `python3 scripts/check_tcf_763_review.py` vérifie toutes les décisions d’images liées aux sources et aux choix actuels.

Affiche CE : le contrôle Chromium charge bien le PNG 1448 × 1086 avec `object-fit: contain`, sans ancienne image ; les 162 entrées du catalogue correspondent aux supports actuels ([preuve](verification-affiche-20261112.json)). L’ancien test global `check-tcf-formats.mjs` échoue sur `cePosterSheet`, un drapeau retiré antérieurement de la pagination ; cette reprise ne modifie pas la pagination. Les autres vérifications citées et TypeScript passent.

Les deux leurres du trio « Quel plat espagnol est cité ? » sont remplacés par risotto/hamburger-frites, absents de l’annonce : les anciens choix couscous/pâtes étaient entendus ([avant/après](correction-leurres-paella-20261112.json)). Réponse correcte, identifiants et barème conservés. Les autres nouveaux trios gardent leurs réponses texte.

`node scripts/check-tcf-pe-dialogue-consignes.mjs` vérifie les 50 dialogues, la conservation des situations et échanges, ainsi que le rendu des anciennes recettes TPF/CSC/CFR. Les tests d’évaluation PE et TypeScript passent.
