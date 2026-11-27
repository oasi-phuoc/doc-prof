# Suivi des exercices d’algèbre et de géométrie

**Mise à jour le 27 novembre 2026**

[Cahier des charges · version 1.0](cahier-des-charges.md)

| Lot | État | Preuve ou étape suivante |
|---|---|---|
| M0 · Inventaire | Réalisé | Comparaison des deux livrets et d’un échantillon des fiches Word et PDF CSC/CFR avec les 25 thèmes et 221 entrées du catalogue. Les tableaux du cahier rattachent les compléments aux supports de cours. |
| Théories illustrées | Intégrées au générateur | 23 thèmes et 31 pages contrôlées en PDF A4 et double A5. La relecture avec les élèves valide ensuite les supports selon la démarche FALC. [Addition avec retenue](exemple-addition-falc.png) · [Transformations](exemple-transformations-falc.png) |
| M1 · Algèbre | Premier pilote intégré | **Additions → Addition avec retenue, pas à pas.** Un exemple associe la retenue et la somme à leurs chiffres par la couleur et la place dans le tableau. Puis l’élève complète un calcul avec les colonnes nommées et un calcul sans cette aide. Les niveaux font travailler une ou deux retenues. Le corrigé remplit les cases. |
| M1 · Géométrie | Premier pilote intégré | **Conversions d’unités → Lire un segment sur une règle.** L’exemple montre un segment entre 2 et 7 cm. L’élève lit ensuite les graduations pour trouver une longueur avec puis sans les libellés de départ et d’arrivée. Les niveaux proposent des lectures au zéro et ailleurs sur la règle, en centimètres ou en millimètres. Le corrigé montre la soustraction. |
| M1 · Soustraction | Intégrée | **Soustractions → Soustraction avec échange, pas à pas.** L’exemple montre pourquoi 42 s’écrit avec 3 dizaines et 12 unités pendant le calcul. Les niveaux moyen et avancé introduisent le passage d’une centaine aux unités à travers un zéro. |
| M1 · Périmètre et aire | Intégré | **Aires → Périmètre et aire du même rectangle.** Le contour est épaissi et l’intérieur est hachuré dans l’exemple. Le corrigé exprime le tour en cm et la surface en cm². |
| M1 · Transformations | Premier exercice intégré | **Transformations géométriques → Translation, pas à pas.** L’exemple reprend le quadrillage de la théorie. Le niveau facile montre le déplacement du premier sommet. Le corrigé montre les trois sommets déplacés et les relie. |
| M1 · Plan sur image réelle | Trois fonds intégrés | **Repérage dans le plan → Lire un plan de Sion.** Le réglage **Fond du plan** propose une photo réelle, une photo avec les routes et les chemins surlignés, et un plan simplifié en noir et blanc. Les mêmes repères, cases et questions s’appliquent aux trois fonds. |
| M2 · Fondamentaux | Prévu | Numération, droite des décimaux, problèmes courts et mesures. |
| M3 · Progression CFR | Prévu | Fractions d’une quantité, graphiques contextualisés, équations guidées et transformations. |
| M4 · Évaluations | Prévu | Séries comparables et mini-évaluations après les essais avec les élèves. |

## Vérifications des premiers exercices

La génération a été contrôlée sur 128 graines par pilote et par niveau. Les vérifications couvrent les chiffres et les retenues des additions, l’écart entre les graduations de la règle et l’unité demandée. Le contrôle d’impression en A4 et en double A5 couvre la présence de l’exemple, l’aide sur le premier exercice, les réponses masquées sur la fiche élève et les corrections visibles. Les deux pilotes restent à relire en classe avec les élèves.

Les quatre exercices suivants ont aussi été contrôlés en PDF A4 et double A5. Les tests couvrent les échanges à travers zéro, les deux calculs du rectangle, la position des sommets translatés et les réponses sur le plan. Le plan a été relu en niveaux de gris. La relecture avec les élèves porte sur les six exercices du premier lot.

### Sources du plan de Sion

La photo provient de SWISSIMAGE et porte le crédit © swisstopo sur la fiche. L’emprise LV95 va de 2 593 720 E, 1 120 070 N à 2 594 660 E, 1 120 697 N. Les repères de Saint-Théodule, Valère et Tourbillon reprennent les coordonnées fédérales. Le point de l’hôtel de ville reprend le registre cantonal. [SWISSIMAGE](https://www.swisstopo.admin.ch/fr/orthophotos-swissimage-10-cm) · [Conditions d’utilisation](https://www.swisstopo.admin.ch/fr/conditions-geodonnees) · [Registre fédéral](https://www.bak.admin.ch/dam/bak/de/dokumente/kulturpflege/publikationen/verzeichnis_der_denkmaelerensemblesundarchaeologischenstaettenvo.pdf.download.pdf/verzeichnis_der_denkmaelerensemblesundarchaeologischenstaettenvo.pdf) · [Registre valaisan](https://lex.vs.ch/api/fr/versions/1935/pdf_file)

La photo annotée et le dessin simplifié ont la même emprise et la même taille de 1 200 × 800 pixels. Sur la photo annotée, un trait clair montre les routes principales et des pointillés montrent les chemins à pied. Sur le PNG en noir et blanc, les bâtiments sont représentés par des blocs. Le quadrillage et les points sont superposés aux trois images. [Génération des fonds](../../scripts/build-sion-simplified-map.py)
