/** Entrées de glossaire maths (algèbre / géométrie) avec schéma SVG. */

export type GlossaryFigureId =
  | 'nombre'
  | 'chiffre'
  | 'addition'
  | 'soustraction'
  | 'multiplication'
  | 'division'
  | 'somme'
  | 'difference'
  | 'produit'
  | 'quotient'
  | 'terme'
  | 'egal'
  | 'compare'
  | 'pair-impair'
  | 'point'
  | 'droite'
  | 'segment'
  | 'demi-droite'
  | 'angle'
  | 'angle-droit'
  | 'angle-aigu'
  | 'angle-obtus'
  | 'perpendiculaire'
  | 'parallele'
  | 'triangle'
  | 'carre'
  | 'rectangle'
  | 'cercle'
  | 'milieu'
  | 'axe-symetrie'

export type GlossaryEntry = {
  id: string
  term: string
  definition: string
  figure: GlossaryFigureId
}

export const ALGEBRA_GLOSSARY: GlossaryEntry[] = [
  { id: 'nombre', term: 'Nombre', definition: 'Objet mathématique qui sert à compter, mesurer ou ordonner.', figure: 'nombre' },
  { id: 'chiffre', term: 'Chiffre', definition: 'Symbole utilisé pour écrire les nombres : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.', figure: 'chiffre' },
  { id: 'unite', term: 'Unité', definition: 'Position des chiffres à droite dans un nombre entier (valeur 1).', figure: 'nombre' },
  { id: 'dizaine', term: 'Dizaine', definition: 'Groupe de dix unités ; position juste à gauche des unités.', figure: 'nombre' },
  { id: 'centaine', term: 'Centaine', definition: 'Groupe de cent unités ; position à gauche des dizaines.', figure: 'nombre' },
  { id: 'addition', term: 'Addition', definition: 'Opération qui regroupe des quantités. Symbole : +.', figure: 'addition' },
  { id: 'plus', term: 'Plus', definition: 'Signe + de l’addition : on ajoute.', figure: 'addition' },
  { id: 'somme', term: 'Somme', definition: 'Résultat d’une addition.', figure: 'somme' },
  { id: 'terme', term: 'Terme', definition: 'Chacun des nombres que l’on additionne ou soustrait.', figure: 'terme' },
  { id: 'soustraction', term: 'Soustraction', definition: 'Opération qui retire une quantité d’une autre. Symbole : −.', figure: 'soustraction' },
  { id: 'moins', term: 'Moins', definition: 'Signe − de la soustraction : on retire.', figure: 'soustraction' },
  { id: 'difference', term: 'Différence', definition: 'Résultat d’une soustraction.', figure: 'difference' },
  { id: 'multiplication', term: 'Multiplication', definition: 'Opération d’addition répétée. Symbole : ×.', figure: 'multiplication' },
  { id: 'fois', term: 'Fois', definition: 'Mot qui annonce une multiplication (3 fois 4).', figure: 'multiplication' },
  { id: 'produit', term: 'Produit', definition: 'Résultat d’une multiplication.', figure: 'produit' },
  { id: 'facteur', term: 'Facteur', definition: 'Chacun des nombres que l’on multiplie.', figure: 'produit' },
  { id: 'division', term: 'Division', definition: 'Opération qui partage en parts égales. Symbole : ÷.', figure: 'division' },
  { id: 'quotient', term: 'Quotient', definition: 'Résultat entier d’une division (nombre de parts).', figure: 'quotient' },
  { id: 'reste', term: 'Reste', definition: 'Ce qui reste après une division euclidienne.', figure: 'division' },
  { id: 'dividende', term: 'Dividende', definition: 'Nombre que l’on divise.', figure: 'division' },
  { id: 'diviseur', term: 'Diviseur', definition: 'Nombre par lequel on divise.', figure: 'division' },
  { id: 'egal', term: 'Égal', definition: 'Signe = : les deux membres ont la même valeur.', figure: 'egal' },
  { id: 'superieur', term: 'Supérieur', definition: 'Signe > : plus grand que.', figure: 'compare' },
  { id: 'inferieur', term: 'Inférieur', definition: 'Signe < : plus petit que.', figure: 'compare' },
  { id: 'pair', term: 'Nombre pair', definition: 'Nombre divisible par 2 (se termine par 0, 2, 4, 6 ou 8).', figure: 'pair-impair' },
  { id: 'impair', term: 'Nombre impair', definition: 'Nombre non divisible par 2 (se termine par 1, 3, 5, 7 ou 9).', figure: 'pair-impair' },
  { id: 'operation', term: 'Opération', definition: 'Calcul (+, −, ×, ÷) effectué sur des nombres.', figure: 'addition' },
  { id: 'total', term: 'Total', definition: 'Résultat d’un calcul, souvent d’une addition.', figure: 'somme' },
]

export const GEOMETRY_GLOSSARY: GlossaryEntry[] = [
  { id: 'point', term: 'Point', definition: 'Emplacement précis du plan, sans dimension. On le note souvent avec une majuscule.', figure: 'point' },
  { id: 'droite', term: 'Droite', definition: 'Ligne illimitée dans les deux sens. On la note (AB) ou d.', figure: 'droite' },
  { id: 'segment', term: 'Segment', definition: 'Portion de droite limitée par deux points. On le note [AB].', figure: 'segment' },
  { id: 'demi-droite', term: 'Demi-droite', definition: 'Partie de droite qui part d’un point et s’étend indéfiniment d’un seul côté.', figure: 'demi-droite' },
  { id: 'angle', term: 'Angle', definition: 'Figure formée par deux demi-droites de même origine (le sommet).', figure: 'angle' },
  { id: 'angle-droit', term: 'Angle droit', definition: 'Angle qui mesure 90°. On le marque d’un petit carré.', figure: 'angle-droit' },
  { id: 'angle-aigu', term: 'Angle aigu', definition: 'Angle plus petit qu’un angle droit (moins de 90°).', figure: 'angle-aigu' },
  { id: 'angle-obtus', term: 'Angle obtus', definition: 'Angle plus grand qu’un angle droit et plus petit qu’un angle plat (entre 90° et 180°).', figure: 'angle-obtus' },
  { id: 'cote', term: 'Côté', definition: 'Segment qui joint deux sommets d’un polygone.', figure: 'triangle' },
  { id: 'sommet', term: 'Sommet', definition: 'Point de rencontre de deux côtés d’un polygone ou d’un angle.', figure: 'triangle' },
  { id: 'perpendiculaire', term: 'Perpendiculaire', definition: 'Deux droites qui se coupent en formant un angle droit.', figure: 'perpendiculaire' },
  { id: 'parallele', term: 'Parallèle', definition: 'Deux droites qui ne se coupent jamais, même prolongées.', figure: 'parallele' },
  { id: 'triangle', term: 'Triangle', definition: 'Polygone à trois côtés et trois sommets.', figure: 'triangle' },
  { id: 'carre', term: 'Carré', definition: 'Quadrilatère à quatre côtés égaux et quatre angles droits.', figure: 'carre' },
  { id: 'rectangle', term: 'Rectangle', definition: 'Quadrilatère à quatre angles droits ; les côtés opposés sont égaux.', figure: 'rectangle' },
  { id: 'cercle', term: 'Cercle', definition: 'Ensemble des points situés à égale distance (le rayon) d’un centre.', figure: 'cercle' },
  { id: 'rayon', term: 'Rayon', definition: 'Segment qui joint le centre d’un cercle à un point du cercle.', figure: 'cercle' },
  { id: 'diametre', term: 'Diamètre', definition: 'Segment qui joint deux points du cercle en passant par le centre (deux rayons).', figure: 'cercle' },
  { id: 'centre', term: 'Centre', definition: 'Point fixe à partir duquel on mesure les rayons d’un cercle.', figure: 'cercle' },
  { id: 'milieu', term: 'Milieu', definition: 'Point d’un segment situé à égale distance des deux extrémités.', figure: 'milieu' },
  { id: 'axe-symetrie', term: 'Axe de symétrie', definition: 'Droite qui partage une figure en deux parties qui se superposent par pliage.', figure: 'axe-symetrie' },
  { id: 'polygone', term: 'Polygone', definition: 'Figure fermée formée de segments de droite (côtés).', figure: 'carre' },
]
