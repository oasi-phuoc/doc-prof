# Refonte FALC de la théorie de grammaire

Les **98 fiches des 19 thèmes** ont un repère visuel et une application courte avec corrigé expliqué. **77 fiches** ouvrent sur une ou plusieurs scènes. **21 fiches** ouvrent sur un tableau qui fait voir une terminaison, un ordre de mots ou une autre différence dans la phrase. Les repères, exemples et détails peuvent être répartis sur des pages séparées. [Cahier des charges](../cahier-des-charges-theorie-falc.md) · [Registre des fiches et des relectures](theorie-falc.csv)

Dans **Grammaire**, choisir un thème, un sous-thème et le type **Théorie**. Le bouton **Lire la théorie** affiche le texte en continu avec les mêmes blocs que la version imprimable. Celle-ci utilise Didact Gothic, la police de la théorie de maths, avec Arial en repli. Les coupures suivent le format A4 ou double A5. Quand une théorie côtoie des exercices sur la même fiche, elle dispose de ses propres pages. [Rendu et police](../../../src/App.css) · [Coupures de page](../../../src/grammaire/theory/falc-pagination.ts)

## Exemples de fiches

| Fiche | Ce que l’élève peut comparer |
|---|---|
| Tu et vous | Demander de l’aide à une amie ou à une personne inconnue dans la rue. L’application fait aussi choisir « vous » pour plusieurs amis. |
| Les salutations | Entrer à la boulangerie le matin, entrer au restaurant le soir et choisir une formule quand on s’en va. |
| Le verbe être | Dire où l’on est, comparer deux émotions, donner son métier ou sa nationalité. La nationalité est indiquée par le texte de présentation. |
| L’accord du participe passé | Mettre en évidence le complément avant ou après le verbe pour expliquer le changement de « mangé » à « mangée ». |

Douze emplacements utilisent des images du dépôt. Les **130 emplacements à compléter** portent chacun une description de scène et des exemples en texte. En mode Libre, ouvrir le bloc **Images** de la fiche pour remplacer un emplacement par une illustration et modifier sa légende ou son texte alternatif. Les phrases à compléter se modifient aussi en mode Libre. [Fiches en situation](../../../src/grammaire/theory/falc-contextes.ts) · [Descriptions des illustrations](../../../src/grammaire/theory/falc-visuels.ts) · [Tableaux annotés](../../../src/grammaire/theory/falc-schemas.ts)

## Correspondance avec la source

- Vingt fiches ont reçu de nouveaux exemples, repères et tableaux de référence. Les soixante-dix-huit autres commencent par un repère visuel et gardent des blocs de détail issus de leur source. Chaque identifiant du registre renvoie à son fichier d’origine. Le contrôle compare les 977 blocs de détail réemployés et vérifie la présence d’une application et d’un repère visuel dans les 98 fiches. [Adaptation des blocs](../../../src/grammaire/theory/falc-lesson.ts) · [Contrôle de couverture](../../../scripts/test-grammar-theory-falc.cjs)
- Les textes réemployés ont été précisés, par exemple sur le choix de l’auxiliaire et l’emploi des deux types de futur. [Reformulations détaillées](../../../src/grammaire/theory/falc-revisions.ts) · [Phrases à compléter](../../../src/grammaire/theory/falc-exercices.ts)
- L’identifiant des destinations ouvre toujours « Le verbe aller ». Les versions Libre enregistrées conservent leur contenu. Les recettes avec d’anciennes coupures conservent la structure dans laquelle les coupures ont été enregistrées. [Archive de théorie](../../../scripts/grammar_curriculum/theory-source.json) · [Compatibilité des recettes](../../../src/grammaire/generate.ts)
- Les deux schémas de « devant et derrière » sont des dessins originaux de la même maison et du même vélo. Chaque dessin possède sa propre légende et son texte alternatif. [Vélo devant](../../../public/lib/images/grammaire/theorie/velo-devant.png) · [Vélo derrière](../../../public/lib/images/grammaire/theorie/velo-derriere.png)

## Vérifications

| Contrôle | Résultat |
|---|---|
| Contenu du catalogue | Les 98 fiches et l’alias des destinations sont couverts. Les formats A4 et double A5 reprennent les mêmes textes, tableaux et médias. |
| Compatibilité | Réouverture d’une ancienne fiche Libre et conservation du texte modifié. Ordre et contenu vérifiés dans une fiche mêlant théorie et exercices. |
| Mise en page | Les 98 fiches et le parcours du cabinet ont été vérifiés en A4 et en double A5 avec les réglages par défaut, en version élève et corrigé. Les blocs tiennent dans les pages prévues. |
| Vérification PDF | Les PDF A4 de « Tu et vous », « Les salutations », « Le verbe être » et du parcours du cabinet ont servi aux essais. |
| Lecture à l’écran | La vue « Lire la théorie » a été contrôlée à 320 px sur les 98 fiches. Les explications des applications s’affichent au corrigé. |
| Relecture pédagogique | La relecture par une personne enseignante et par des élèves allophones reste à mener. Le registre distingue ces deux étapes. |

Le contrôle historique des banques attend encore les anciennes séries ordinaires qui ont été retirées lors du passage aux banques graduées. Le contrôle de la nouvelle théorie se lance indépendamment avec `node scripts/test-grammar-theory-falc.cjs`. [Historique du retrait](retrait-banques-20261122.md)
