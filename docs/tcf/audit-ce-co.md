# Audit des questions CE et CO — contrôle visuel du 2 novembre 2026

Les 1 262 supports de la banque ont été relus : 339 supports CE et 923 exercices CO. La banque contient **9 463 questions**, contre 5 104 avant audit, soit **4 359 questions supplémentaires**.

Les questions ont été réécrites ou vérifiées à partir des textes et transcriptions. Chaque question comporte un mot interrogatif, trois propositions distinctes et un seul corrigé. Les réponses rédigées et les variantes QCM sont synchronisées. Les énoncés sans rapport avec le support, les réponses fausses et les distracteurs incohérents ont été remplacés. Une seconde relecture a corrigé des choix numériques qui se recoupaient et des réponses insuffisamment étayées.

Les textes et chemins audio ont été conservés. La précision « jusqu’au 30 avril » apportée à une transcription sur origin/main a été intégrée. Des images de reconnaissance ambiguës ont été précisées et certaines consignes ont été adaptées aux questions corrigées.

## Résultat par banque

| Niveau | Compétence | Supports | Questions avant | Questions après |
|---|---|---:|---:|---:|
| A0-A1 | CE | 162 | 710 | 1450 |
| A0-A1 | CO | 434 | 1484 | 2889 |
| A1-A2 | CE | 177 | 663 | 1472 |
| A1-A2 | CO | 432 | 1905 | 3082 |
| A2-B1 | CO | 57 | 342 | 570 |

La banque ne contient actuellement aucun support CE A2-B1.

## Couverture et limites des sources

Objectifs retenus : CE 8 questions, idéal 10 ; CO court 2, idéal 3 ; CO moyen 4, idéal 5 ; CO long 8, idéal 10. Le tag pédagogique des pistes déjà relues sur origin/main est conservé en priorité. Pour les autres pistes, la durée du fichier détermine la catégorie : court ≤ 15 s, moyen > 15 à 45 s, long > 45 s. Cette durée comprend les éventuelles consignes et répétitions ; elle ne mesure pas le nombre de faits disponibles. Le moteur conserve désormais cette catégorie lorsqu’on enrichit les questions.

**336 des 339 supports CE atteignent au moins huit questions.** Trois textes restent en dessous :

| Support | Questions retenues | Minimum demandé |
|---|---:|---:|
| `tcf-a1-sem1-ce-3` | 6 | 8 |
| `delf-a2r-ce-046` | 6 | 8 |
| `delf-a2r-ce-052` | 7 | 8 |

**110 séries CO restent sous leur minimum, correspondant à 109 fichiers audio distincts.** Une piste est présente à deux niveaux. Le détail figure dans `supports-a-completer.csv`, avec le nombre manquant ; les motifs précis par support figurent dans `relecture-editoriale.json`. Ce sont notamment des mots isolés, des consignes sans réponse, des messages brefs répétés ou des transcriptions dégradées. Aucune question supplémentaire n’a été inventée pour remplir un quota.

| Catégorie CO | Séries par niveau | Minimum atteint | Sous minimum | Idéal atteint |
|---|---:|---:|---:|---:|
| court | 462 | 436 | 26 | 302 |
| moyen | 604 | 560 | 44 | 356 |
| long | 253 | 213 | 40 | 124 |

Deux contrôles audio/transcription sont particulièrement nécessaires :

- `tcf-ss-a2-s36-co-1` : transcription très tronquée ; une seule question fiable a été conservée.
- `delf-a2-2021-co-ex1-06` : piste de 1,65 seconde malgré une transcription plus longue ; la concordance nécessite une réécoute.

La relecture s’appuie sur les transcriptions conservées ; elle ne constitue pas une nouvelle écoute intégrale de tous les fichiers. Les anomalies de date déjà présentes dans certains textes (30 février, dates inversées, durées télévisées contradictoires) sont signalées dans la relecture éditoriale ; les questions nouvelles évitent les informations contradictoires.

## QCM image et reprise de la génération

**1 406 variantes QCM image** utilisent des images déjà disponibles, avec les mêmes choix et corrigés que le QCM texte. Les horloges ne sont utilisées que si les trois cadrans sont distincts ; 6 h et 18 h ne sont pas traités comme deux images distinctes. Les montants, dates, jours et mois restent en texte.

Le fichier `images-a-generer.json` contient **618 questions candidates** et **1101 images manquantes dédupliquées**, avec références aux supports, trois propositions, images réutilisables, prompts et chemins prévus. `images-a-generer.md` permet de parcourir la liste. Ce plan conservateur doit être relu avant génération, notamment pour vérifier que les trois scènes se distinguent sans légende.

**Aucune image n’a été générée.** Aucun lien de la banque ne pointe vers une image future inexistante. À la prochaine session, lire d’abord le fichier de reprise, contrôler les trois propositions contre le support, générer par petits lots puis vérifier les images avant d’activer les nouvelles variantes.

## Inspection visuelle des réponses

**639 images de réponse actives ont été contrôlées visuellement**, avec leurs usages et libellés. Les 1406 variantes QCM image conservées ont des choix distincts et un corrigé synchronisé.

- 80 variantes ont été corrigées ou rebranchées vers les bons fichiers.
- 64 variantes trompeuses ont été retirées ; les questions restent disponibles en QCM texte et réponse rédigée.
- 15 remplacements ont fiabilisé 10 exercices de reconnaissance, chacun avec cinq images distinctes et au moins une réponse vraie.
- Les 91 cadrans et les 12 images d’objets déplacées sur origin/main ont été ouverts : heures, minutes et dénombrements exacts.
- 13 scènes d’association sont en attente, dont 12 fichiers déjà absents et une scène de bus contradictoire. Elles ne sont pas affichées comme illustrations prêtes et sont exclues des tirages automatiques. Leurs références et briefs sont dans `images-a-generer.json`.

Exemples corrigés : avocat fruit/métier, bleu couleur/cuisson de viande, buffet meuble/repas, lentilles aliment/accessoire de vue, ballon de baudruche/sport, ceinture vestimentaire/sécurité, couleurs de vêtements et documents vierges. Les pictogrammes de catégorie restent acceptés au singulier quand aucune quantité n’est demandée.

Le registre `scripts/tcf-qcm-image-visual-overrides.json` empêche la réapparition des correspondances rejetées. Le rapport détaillé et les empreintes des images actives figurent dans `audit-visuel-images.json`.

## Vérifications effectuées

- Contrôle de toutes les questions : 0 erreur, 0 avertissement de structure ; trois choix, réponse unique, mot interrogatif, absence de doublon par piste et concordance des corrigés.
- Les 1 262 exercices chargent dans l’application et les 1 318 fichiers audio sont indexés avec leur pool de questions.
- Rendu des 1 406 variantes image et 12 cas de mélange : correspondance des réponses texte/image validée.
- Dix tests de correspondance sémantique des images, compilation TypeScript, build Vite et lint des fichiers modifiés réussis.

## Fichiers utiles

- `audit-structure-et-couverture.json` : inventaire et couverture complets.
- `relecture-editoriale.json` : rapports détaillés de chaque lot et secondes relectures.
- `audit-visuel-images.json` : inspection visuelle, corrections et empreintes des fichiers actifs.
- `supports-a-completer.csv` : trois textes CE et 110 séries CO sous minimum.
- `images-a-generer.json` et `.md` : reprise des illustrations.

Les deux commits ajoutés sur origin/main pendant la relecture ont été intégrés. Cette version conserve les changements distants, les corrections complètes des banques et le contrôle visuel.

