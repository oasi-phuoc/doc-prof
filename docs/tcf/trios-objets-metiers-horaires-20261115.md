# Objets, métiers et horaires — 15 novembre 2026

**23 trios QCM image supplémentaires sont activés : 18 A1 et cinq A2.** Neuf appartiennent au suivi historique et quatorze aux nouveaux audios DELF Actif. Deux trios déjà actifs reçoivent aussi la vraie carte de cantine à la place d’un plateau-repas. Les textes, réponses, corrigés, transcriptions et pistes audio sont conservés.

Le lot ajoute **19 PNG originaux en paysage exact 4:3** : huit illustrations générées en 1 448 × 1 086 et onze cadrans en 1 280 × 960. Les **50 autres usages** des nouveaux trios réemploient **43 images distinctes** examinées dans la banque. Les fichiers originaux sont conservés sans conversion. Le style reste celui du commit `48a753d8`.

## Images et questions livrées

- Carnet personnel ouvert et calendrier mural vierge, face au choix ordinateur. Le carnet de notes scolaires est écarté pour les tâches et événements personnels ; il reste adapté à son contexte scolaire antérieur.
- Un disque musical unique et plusieurs paires de chaussures, avec guitare, billet de concert, sacs et chapeaux réutilisés. L’image des chaussures illustre la catégorie plurielle ; la question ne demande pas de compter les vingt et une paires citées.
- Volcans, océans et forêt pour le sujet de l’exposé ; ne pas confondre le sujet recherché avec le lieu de recherche, la bibliothèque.
- Caméra de surveillance fixée au mur, distincte de l’appareil photo et de la tablette. Le caméscope professionnel est écarté.
- Carte plastique de cantine avec portrait et pictogramme de repas. Elle apparaît dans le nouveau trio passeport/carte/permis et remplace deux anciens usages du plateau-repas. L’ancien fichier est conservé avec son libellé corrigé dans la galerie.
- Zones de douleur, vêtements, photographie et documents, puis cinq métiers A2 : les trois choix sont contrôlés avec le support complet. Les images de métiers représentent des catégories professionnelles, pas les personnes nommées dans les textes.
- Huit questions d’horaires : départ à 10 h 38, téléfilm à 22 h 55 et les six heures successives de la piste A1 042. Onze cadrans manquants complètent les cadrans existants.

Les nouvelles horloges reprennent **le même fond peint et le même modèle d’aiguilles calculées approuvés par l’utilisateur**. L’aiguille des heures avance avec les minutes. Les heures du soir conservent leur valeur dans les métadonnées et leur représentation analogique sur douze heures. Les trois faces de chaque question sont distinctes. Aucun montant ni date n’est ajouté aux nouvelles illustrations.

Le [registre de relecture](revue-trios-objets-metiers-horaires-20261115.json) conserve les sources complètes, les trois réponses, les motifs de réemploi et de rejet, les prompts, les chemins et leurs empreintes. Le [registre des onze cadrans](horaires-trios-20261115.json) précise les angles et le modèle commun. Aucune nouvelle écoute humaine n’est déclarée.

## Avancement actuel

| Suivi | Actif | Conservé en texte | Restant |
| --- | ---: | ---: | ---: |
| Revue historique de 763 questions | 290 trios | 112 questions | **361 trios à compléter** |
| Dont lot initial de 433 | 72 trios | — | 361 trios |
| Dont extension initiale de 573 | 211 trios | 1 question | 361 trios |
| DELF Actif : 1 663 questions, 346 supports | **291 trios** | 917 questions | **455 candidats à vérifier visuellement** |

Les lignes « dont » sont incluses dans la revue historique : ne pas additionner ces lignes. Les candidats DELF Actif ne sont pas tous déclarés illustrables avant inspection du sens complet et des trois images.

Le reliquat historique comprend **144 A1, 194 A2 et 23 B1** : 271 relations ou lieux contextuels, 72 concepts complets et 18 distinctions de documents. Les candidatures DELF Actif restantes comprennent **86 A1, 232 A2 et 137 B1** ; les trios actifs se répartissent en 176 A1, 106 A2 et neuf B1. Les **1 021 relectures de contexte sont terminées**, avec les 41 corrections antérieures conservées.

Galerie : **6 786 images**. Catalogue audio : **8 801 fichiers, 6 734 questions et 15 074 formats de réponse**.

## Reste du cahier des charges

1. Compléter les **361 trios historiques** et examiner les **455 candidatures DELF Actif**, en priorité A1 puis A2. Réemployer les images conformes au contexte et générer les manquantes ; garder les dates, montants et identités arbitraires en texte.
2. Continuer la grammaire : **233 pistes CO à traiter** et **148 situations à illustrer**. L’état actuel contient 100 questions sur 19 pistes ; la réécriture FALC de toute la théorie et les validations enseignantes restent dans le [suivi de grammaire](../grammaire/README.md) et le [chantier CO](../grammaire/co-import/chantier-questions-images-20261114.md).
3. Réaliser la **migration et le contrôle serveur D1 des fiches enregistrées**, avec l’accès serveur nécessaire. Les anciennes fiches conservant des choix image figés, dont l’ancienne carte de cantine, ou les anciens leurres doivent être régénérées pour appliquer les nouvelles images et le tirage issu des audios.
4. Poursuivre le contrôle contextuel de la bibliothèque audio, distinct de l’installation technique déjà terminée, puis revérifier questions, images, tags et corrigés après chaque changement de transcription ou d’audio. Les 870 références sans correspondance fiable avec les seuls PDF fournis ne sont pas assimilées à des erreurs.

Les **117 pistes de scénario restent actives**, avec **80 clés de leurres issues d’autres audios non sélectionnés**. Aucun signalement suivi ne reste pour les interlocuteurs, les 21 cadrages ou les trois gestes de guichet. Le menu à icône « Catalogue », à gauche des paramètres, regroupe fiches, images et audios ; les retraits de déconnexion demandés sont conservés. Ces réalisations sont détaillées dans le [rapport précédent](cadrages-finaux-20261115.md).

## Vérifications

Les contrôles actuels des 763 décisions, des 346 supports et 1 663 questions DELF Actif, des 1 021 revues de contexte, de la banque et des **2 297 variantes QCM image** passent. Les **13 tests des catalogues**, les six tests de géométrie, TypeScript et la compilation passent.

Le [contrôle Chromium](trios-objets-metiers-horaires-20261115-browser.json) vérifie **10 vues sur ordinateur et mobile**, soit 20 affichages de questions et 60 images : fichiers chargés, proportions, absence de recadrage, cases du corrigé et conservation de l’exercice lors du changement de format. Aucune erreur navigateur.

La [comparaison complète des six banques](verification-trios-objets-metiers-horaires-20261115.json) prouve uniquement 23 ajouts de forme image et deux corrections de choix image depuis `c5b047aa`. Les 19 fichiers intégrés correspondent aux octets des originaux ; les onze nouveaux cadrans correspondent aussi pixel par pixel au moteur commun.

L’ancien vérificateur `check_tcf_context_review.py` reste incompatible avec son instantané d’intégration du 7 novembre : il exige 387 exercices A1, alors que le commit de départ de ce lot en contient déjà 507. Cet échec antérieur au lot est consigné dans la comparaison ; les contrôles actuels liés aux sources et la comparaison des six banques ci-dessus passent.
