# Refonte FALC de la théorie de grammaire

Le générateur affiche les **98 fiches des 19 thèmes**, du pré-A1 au B1, avec un exemple résolu et une explication courte en tête de chaque fiche. Les titres de section décrivent le contenu de la fiche. Les tableaux, les autres exemples et les exceptions restent accessibles à la suite. [Cahier des charges](../cahier-des-charges-theorie-falc.md) · [Registre des fiches et des relectures](theorie-falc.csv)

Dans **Grammaire**, choisir un thème, un sous-thème et le type **Théorie**. Le bouton **Lire la théorie** affiche le texte en continu avec les mêmes blocs que la version imprimable. Celle-ci utilise Didact Gothic, la police de la théorie de maths, avec Arial en repli. Les coupures suivent le format A4 ou double A5. Quand une théorie côtoie des exercices sur la même fiche, elle dispose de ses propres pages. [Rendu et police](../../../src/App.css) · [Coupures de page](../../../src/grammaire/theory/falc-pagination.ts)

## Correspondance avec la source

- Chaque identifiant du registre renvoie à son fichier source. Dans la fiche révisée, les blocs pédagogiques d’origine gardent leur ordre relatif. Les espaces et les anciennes rubriques cèdent la place aux espacements de lecture. L’introduction FALC et les titres de référence complètent les blocs sources. Le contrôle automatique compare **1 247 blocs pédagogiques** aux blocs du générateur. [Adaptation des blocs](../../../src/grammaire/theory/falc-lesson.ts) · [Contrôle de couverture](../../../scripts/test-grammar-theory-falc.cjs)
- Le registre des **43 reformulations** relie chaque texte exact d’origine à son nouveau texte. Il inclut les précisions sur « pendant », sur le choix de l’auxiliaire et sur l’emploi des deux types de futur. Les objectifs du passif et du subjonctif passé ont aussi été précisés dans le catalogue. [Exemples résolus](../../../src/grammaire/theory/falc-openings.ts) · [Reformulations détaillées](../../../src/grammaire/theory/falc-revisions.ts)
- L’identifiant des destinations ouvre toujours « Le verbe aller ». Les versions Libre enregistrées conservent leur contenu. Les recettes avec d’anciennes coupures conservent la structure dans laquelle les coupures ont été enregistrées. [Archive de théorie](../../../scripts/grammar_curriculum/theory-source.json) · [Compatibilité des recettes](../../../src/grammaire/generate.ts)
- Les deux schémas de « devant et derrière » sont des dessins originaux de la même maison et du même vélo. Chaque dessin possède sa propre légende et son texte alternatif. [Vélo devant](../../../public/lib/images/grammaire/theorie/velo-devant.png) · [Vélo derrière](../../../public/lib/images/grammaire/theorie/velo-derriere.png)

## Vérifications

| Contrôle | Résultat |
|---|---|
| Contenu du catalogue | Les 98 fiches et l’alias des destinations sont couverts. Les formats A4 et double A5 reprennent les mêmes textes, tableaux et médias. |
| Compatibilité | Réouverture d’une ancienne fiche Libre et conservation du texte modifié. Ordre et contenu vérifiés dans une fiche mêlant théorie et exercices. |
| Mise en page | Les 98 fiches ont été mesurées en A4 et en double A5 avec les réglages par défaut. Les blocs tiennent dans les pages prévues. |
| Vérification PDF | « Le verbe être », « Autres prépositions et adverbes de lieu » et « L’accord du participe passé » ont servi aux essais en A4 et double A5. |
| Lecture à l’écran | La vue « Lire la théorie » a été contrôlée à 320 px sur les 98 fiches et à 200 % de zoom dans le générateur sur « Le verbe être ». La fonte du projet est chargée. |
| Relecture pédagogique | La relecture par une personne enseignante et par des élèves allophones reste à mener. Le registre distingue ces deux étapes. |

Le contrôle historique des banques attend encore les anciennes séries ordinaires qui ont été retirées lors du passage aux banques graduées. Le contrôle de la nouvelle théorie se lance indépendamment avec `node scripts/test-grammar-theory-falc.cjs`. [Historique du retrait](retrait-banques-20261122.md)
