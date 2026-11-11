# Bilan du cahier des charges — 11 novembre 2026

Ce bilan remplace les anciens compteurs d’avancement. Les sources des nombres sont les registres liés ; les contrôles structurels ne prouvent pas à eux seuls la justesse de toutes les réponses ou une écoute humaine.

## Réalisé

- Bascule technique des **1 025 références audio actives**, avec conservation des URL et preuves de provenance. Il ne reste aucune installation dans ce périmètre historique ; le contrôle final n’est pas terminé ([registre](remplacement-audio/bascule-complete-20261105.json)).
- Complément des **60 banques CO et trois supports CE**. Audit du 11 novembre : 1 009 supports, 7 851 questions, aucun support CE ni pool CO sous le minimum, aucune erreur ni avertissement.
- Les **252 transcriptions de grammaire** sont intégrées : 127 A1 et 125 A2. Les 34 réserves A2 ont été reprises ; un numéro incomplet reste documenté dans la source ([suivi](../grammaire/co-import/revue-34-points-20261105.json)).
- Harmonisation des images actives : le dernier inventaire recense **zéro usage restant du dossier vocabulaire**. Les anciens nombres de 1 036 et 1 906 usages sont dépassés ([registre](reprise-images-20261106.json)).
- **208 PDF** extraits et indexés par collection. Le rapprochement actuel repère 103 égalités normalisées, 45 correspondances fortes et sept possibles à revoir. Dix corrections éditoriales documentées : neuf sur les transcriptions et une sur le format des réponses ([corrections](remplacement-audio/verification-pdf-corrections-20261111.json)).
- **205 nouveaux fichiers** conservés séparément après la bascule : 82 A1, 62 A2 et 61 B1. Les 61 B1 sont appariés aux PDF par leur contenu avec deux moteurs de reconnaissance, sans installation dans les exercices actifs ([appariements](remplacement-audio/appariement-b1-039804-pdf-20261111.json)).
- Compilation CSC : pour chaque document, annonce unique, bip, première écoute, pause, bip, deuxième écoute, pause. Les quatre scénarios sont désormais traités successivement avec leurs deux écoutes. Pas d’annonce « Audio 1 » pour l’audio complet unique. Pauses conservées à **15 secondes**, ou **30 secondes** pour le document long. La pause manquante de reconnaissance d’objets est ajoutée.
- Tirage CSC OBJET : les deux images NON appartiennent aux thèmes des images OUI affichées ; tous les concepts nommés dans la transcription sont exclus des leurres. Les images existantes sont réutilisées. Vérification des 107 pistes éligibles parmi les 1 025 actives et des cinq formats de compilation.

## À terminer, dans l’ordre

1. **Validation finale audio, transcription et réponses.** Les 87 validations différées du registre restent ouvertes. Les PDF ne couvrent pas toutes les éditions actives : les 870 références sans correspondance fiable dans ce lot ne sont pas assimilées à des transcriptions erronées.
2. **Quatre différences d’édition** : radio du samedi, commande payable en espèces uniquement, fermeture du magasin dans 20 minutes et promotion FMAC jusqu’au 16 mars. Les nouveaux originaux correspondants sont reçus et leur contenu recoupé ; découpe finale, vérification des frontières, installation et synchronisation des questions restent à terminer. Ces quatre cas ne sont pas les quatre fichiers manquants.
3. **Traiter les 205 nouveaux originaux** A1/A2/B1 : vérifier les transcriptions, retirer les annonces techniques, découper les documents utiles, adapter ou créer les questions et réponses, respecter les banques minimales puis intégrer les extraits pertinents. Ne pas remplacer un ancien exercice par un sujet sans rapport. Les 61 appariements B1 ne constituent pas cette intégration.
4. **Images après stabilisation des questions** : le dernier registre conserve **433 trios** à préparer ou compléter (279 scènes de lieux/positions, 121 concepts entiers, 33 types ou combinaisons de documents). Il ne s’agit pas de 433 images nouvelles : réutiliser les illustrations existantes quand leur sens entier convient. Restent également dix reprises de personnages CO et une affiche CE dans les registres dédiés. Le tri des autres questions textuelles reste ouvert ; les notions non prouvables visuellement restent en texte. Vérifier séparément les leurres des scènes d’association : la nouvelle contrainte de thème du tirage OBJET ne certifie pas les scènes d’un autre exercice.
5. **Grammaire** : les banques de phrases et activités de communication existent ; la réécriture FALC complète de la théorie n’est pas attestée. Les questions des supports CO de grammaire restent à créer, ainsi que **150 illustrations** prévues ([suivi grammaire](../grammaire/README.md)).
6. **Fiches enregistrées dans D1** : migration et vérification restent à effectuer avec l’accès serveur. L’URL publique du Worker ne donne pas cet accès.
7. Refaire le contrôle contextuel des questions, images, tags et corrigés après chaque changement audio, puis publier les lots vérifiés sur `origin/main`.

## Fichiers à redemander au besoin

La collection A1 039803 contient 82 fichiers sur les 86 attendus. Conserver ce rappel pour une prochaine reprise : **039803_31.mp3, 039803_46.mp3, 039803_53.mp3 et 039803_54.mp3**. Le PDF A1 **Piste76.pdf** manque aussi au lot de transcriptions. Ce suivi ne programme pas de notification automatique.

## Vérification de cette reprise

`node scripts/check-tcf-co-playlists.mjs` vérifie les cinq formats, les pauses entre les écoutes, les annonces et les fichiers nécessaires. `node scripts/check-tcf-object-pool.mjs` vérifie les thèmes des leurres, leur absence dans la transcription, les cinq images distinctes, les corrigés, le mélange et la conservation des sources. Aucune nouvelle image n’a été générée dans cette reprise.
