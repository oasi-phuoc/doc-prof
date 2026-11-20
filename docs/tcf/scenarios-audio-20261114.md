# Scènes d’association CO — suivi du lot du 14 novembre 2026

Le [registre de reprise](reprise-dialogues-provisoires-20261114.json) intègre **12 PNG natifs en 4:3 et 24 images réutilisées**, pour 38 liaisons examinées. Le coureur et son interlocutrice se regardent pendant leur échange ; la porte de la classe est replacée dans le mur du fond. Les premières versions refusées ne sont pas activées.

Les scènes A1 corrigées couvrent aussi la piscine, les deux élèves parlant du self, la présentation d’Anissa avec l’enseignante, l’invitation à déjeuner, musique et lecture, jeu sur ordinateur et dossier photo. Les corrections A2 montrent Claudine et sa camarade, le père et son enfant, ainsi que la fleuriste et son client. Diego, le changement de place, le sac sous le blouson bleu, le trajet depuis la gare, la place réservée, le projet de bateau et l’aide de l’enseignante réutilisent des variantes adaptées.

À la demande de l’utilisateur, le genre non précisé d’un personnage est **choisi provisoirement**, avec trace dans les métadonnées. Les rôles explicités par le texte sont respectés. Tous les interlocuteurs réels doivent être visibles et en interaction ; un tiers mentionné ou un figurant ne remplace pas un locuteur. **Aucune écoute directe des voix n’est déclarée.**

| Suivi | État |
|---|---:|
| Supports DELF Actif classés en contexte | 346 |
| Supports DELF Actif retenus comme scénarios | 96 |
| Scénarios DELF Actif liés à une image | 87 |
| Scénarios historiques conservés | 21 |
| Total des liaisons actives | 108 |
| Scénarios DELF Actif encore à terminer | 9, tous B1 |
| Liaisons avec interlocuteur manquant encore à reprendre | 11, pour 10 images |

Les **11 reprises restantes** concernent neuf liaisons A2 déjà actives et deux B1 encore préparées : conseil du pull, horaires du magasin, musée, monnaie, voiture, deux usages de l’arrêt de transport, pâtisserie, retour des îles, Elsa et homme débordé. Les deux B1 font aussi partie des neuf scénarios non terminés ; il reste donc **sept autres scènes B1 sans image**. La liste des pistes figure dans le registre. Ces compteurs se recoupent et ne doivent pas être additionnés.

Le contrôle visuel couvre les 103 images principales préparées avant cette reprise. L’[audit initial](reprise-interlocuteurs-scenes-20261114.json) et le [recontrôle historique des rôles](recontrole-genres-scenes-20261114.json) restent des preuves datées ; leurs chiffres ne décrivent pas l’état courant. La [consolidation](consolidation-scenes-20261114.json) conserve la liaison actuelle de chaque audio et les alternatives restent traçables.

Les fichiers partagés avec un QCM ou un simple décor sont remplacés uniquement lorsqu’ils servent de scène d’association. Les autres anciens chemins de scènes chargent leur nouvelle version, y compris sur les fiches enregistrées. Cela ne nécessite aucune modification de D1 et ne remplace pas une migration des fiches dans cette base.

Les questions, réponses, transcriptions et MP3 restent identiques. Dans les six banques CE/CO, seules deux images de l’association historique A1 changent : piscine et coureur. La [comparaison des banques](verification-scenes-priorite-20261114.json) en conserve la preuve. Aucun nouveau trio QCM n’est créé pendant cette priorité aux scènes.

Galerie : **6 968 images**. Catalogue audio : 8 801 fichiers, 5 057 transcriptions, 6 634 questions et 14 856 formats de réponse. Les PNG de ce lot gardent leurs octets originaux en 1 448 × 1 086, selon le style approuvé du commit `48a753d8`.

Les contrôles portent sur les empreintes, les liaisons audio/texte/image, les tirages déterministes, les leurres thématiques, les 1 021 décisions de contexte, les catalogues et l’affichage des six cadres dans la zone imprimable. Le test dédié aux nouvelles scènes charge les 12 PNG et une ancienne recette contenant le décor de piscine.

```sh
node scripts/check-tcf-association-images.mjs
python scripts/check-delf-actif-context-review.py
node --test tests/audio-catalog/catalog.test.mjs tests/gallery/catalog.test.mjs
node tests/audio-replacement/scenarios-browser.mjs --dialogue-repair
node tests/audio-replacement/scenarios-browser.mjs --gender-review
./node_modules/.bin/tsc -b
```
