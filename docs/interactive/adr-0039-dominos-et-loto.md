# ADR 0039 — Associations des planches Dominos et Loto

Les fiches **Jeux › Dominos** et **Jeux › Loto** peuvent fournir des associations image–mot au mode jeu. Elles réutilisent le moteur M06 : groupes de six paires au maximum, mots déjà corrigés grisés à leur place, progression collective en Classe, correction et suite automatiques en Solo, reprise et compétition.

## Données source

Dans un domino, le mot imprimé à droite désigne l’image du domino suivant. Le générateur conserve désormais `dominoWord`, le libellé de sa propre image à gauche. La conversion utilise cette correspondance explicite et vérifie que l’ensemble des libellés concorde avec les mots imprimés sur la planche. Les numéros et l’ordre des cartes ne servent pas à deviner la réponse. Le modèle courant fournit seize associations, réparties en groupes de six, six et quatre.

Les anciennes planches Dominos figées sans ce libellé sont signalées et demandent une régénération depuis leur modèle. Un mot étranger à la planche ou un verso non validé ne produit aucun corrigé arbitraire. Les cartes de remplissage vides sont ignorées ; les images manquantes sont signalées.

Le Loto fournit ses paires depuis le **lot animateur**, où chaque mot et son image sont explicitement associés. Les grilles et leurs dos sont contrôlés mais ne multiplient pas les questions. Une grille contenant un mot absent du lot animateur est signalée comme incohérente. Le modèle à vingt-sept mots produit vingt-sept associations en cinq groupes de six, six, six, six et trois.

## Moteur partagé

Le calcul des groupes est commun aux sources Vocabulaire, Mémory, Dominos et Loto. Une fin de groupe avec une seule paire est rééquilibrée en cinq et deux. Les images partagées, les mots répétés et les remplacements d’image ambigus restent guidés, avec appréciation humaine. Une image remplacée est appliquée une seule fois et ne modifie pas le libellé source.

Les plafonds de choix et l’ordre des questions conservent les corrigés. Les groupes restent indépendants entre fiches, même lorsqu’elles emploient les mêmes mots. Les cartes utilisées sont bloquées par le moteur local et par le moteur de compétition ; les joueurs d’un même tour conservent les mêmes choix disponibles. La sauvegarde et le bilan par groupe réutilisent les journaux existants, sans nouvelle version de schéma.

## Impression et périmètre

Le nouveau champ des Dominos n’est pas imprimé. Aucun tirage aléatoire supplémentaire n’est ajouté au générateur ; les mots, images, positions et dos des cartes restent ceux de la fiche. Les grilles et le lot animateur du Loto sont réutilisés tels quels. Le [parcours navigateur](printable-decks-results.json) compare aussi la planche A4 Dominos avec et sans ce champ.

Ce lot active les **associations** issues des deux banques. Le plateau, le tirage et les objectifs de Loto M12, le retournement de cartes M11 et le tri M08 restent ouverts. La chaîne de pose des dominos ne fait pas partie de ces micro-questions. Les nouvelles synthèses audio restent reportées.

Neuf tests de domaine couvrent 600 configurations réelles sur le thème des fruits et les trois difficultés, ainsi que les planches réordonnées, les anciens formats, les cas incomplets, les groupes courts, les remplacements, les plafonds, les nouvelles graines, la feuille enseignant, la reprise et le corrigé privé en compétition. Ils vérifient la fidélité aux données ; ils ne déclarent pas les autres thèmes relus pédagogiquement. Voir le [relevé qualité](quality-decks-results.json).

```sh
node --test tests/interactive/printable-decks.test.mjs tests/interactive/printable-pairs.test.mjs tests/interactive/matching.test.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:interactive:decks
```
