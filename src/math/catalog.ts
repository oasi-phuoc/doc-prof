import type { Domain, ExerciseType, Topic } from './types'

export const topics: Topic[] = [
  { id: 'nombres', label: 'Nombres naturels', domain: 'algèbre' },
  { id: 'addition', label: 'Additions', domain: 'algèbre' },
  { id: 'soustraction', label: 'Soustractions', domain: 'algèbre' },
  { id: 'estimation', label: 'Estimation et arrondi', domain: 'algèbre' },
  { id: 'multiplication', label: 'Multiplications', domain: 'algèbre' },
  { id: 'division', label: 'Divisions', domain: 'algèbre' },
  { id: 'multiples', label: 'Multiples, PGCD et PPCM', domain: 'algèbre' },
  { id: 'fractions', label: 'Fractions', domain: 'algèbre' },
  { id: 'decimaux', label: 'Nombres décimaux', domain: 'algèbre' },
  { id: 'proportionnalite', label: 'Pourcentages et proportions', domain: 'algèbre' },
  { id: 'relatifs', label: 'Nombres relatifs', domain: 'algèbre' },
  { id: 'puissances', label: 'Puissances et racines', domain: 'algèbre' },
  { id: 'expressions', label: 'Expressions algébriques', domain: 'algèbre' },
  { id: 'equations', label: 'Équations', domain: 'algèbre' },
  { id: 'figures', label: 'Formes', domain: 'géométrie' },
  { id: 'conversions', label: 'Conversions d’unités', domain: 'géométrie' },
  { id: 'perimetres', label: 'Périmètres', domain: 'géométrie' },
  { id: 'aires', label: 'Aires', domain: 'géométrie' },
  { id: 'volumes', label: 'Volumes', domain: 'géométrie' },
  { id: 'reperage', label: 'Repérage dans le plan', domain: 'géométrie' },
  { id: 'transformations', label: 'Transformations géométriques', domain: 'géométrie' },
]

export const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic])) as Record<string, Topic>
export const algebraTopics = topics.filter((topic) => topic.domain === 'algèbre')
export const geometryTopics = topics.filter((topic) => topic.domain === 'géométrie')

const t = (
  id: string,
  topic: string,
  label: string,
  description: string,
  instruction: string,
  visual: ExerciseType['visual'],
  extra: Partial<ExerciseType> = {},
): ExerciseType => ({ id, topic, label, description, instruction, visual, ...extra })

export const exerciseTypes: ExerciseType[] = [
  t('nombres-chiffres', 'nombres', 'Écrire en chiffres', 'Le nombre est écrit en lettres, on l’écrit en chiffres.', 'Écrivez chaque nombre en chiffres.', 'ligne'),
  t('nombres-lettres', 'nombres', 'Écrire en lettres', 'Le nombre est écrit en chiffres, on l’écrit en lettres (Suisse romande).', 'Écrivez chaque nombre en lettres.', 'texte'),
  t('nombres-position', 'nombres', 'Valeur positionnelle', 'Retrouver le chiffre des unités, dizaines, centaines…', 'Indiquez le chiffre demandé.', 'ligne'),
  t('nombres-decompose', 'nombres', 'Décomposer', 'Écrire un nombre en sommes de puissances de 10.', 'Décomposez chaque nombre.', 'ligne'),
  t('nombres-comparer', 'nombres', 'Comparer', 'Compléter avec <, = ou >.', 'Comparez les nombres. Écrivez <, = ou >.', 'ligne'),
  t('nombres-encadrer', 'nombres', 'Encadrer', 'Encadrer un nombre entre deux dizaines ou centaines.', 'Complétez l’encadrement.', 'ligne'),
  t('nombres-pair', 'nombres', 'Pairs et impairs', 'Reconnaître un nombre pair ou impair.', 'Écrivez pair ou impair.', 'ligne'),
  t('nombres-ranger', 'nombres', 'Ranger', 'Ranger des nombres dans l’ordre croissant.', 'Rangez les nombres du plus petit au plus grand.', 'suite'),
  t('nombres-suite', 'nombres', 'Suites à trous', 'Compléter une suite numérique.', 'Complétez les termes manquants.', 'suite'),

  t('addition-ligne', 'addition', 'En ligne', 'Calculer 46 + 37 = ?', 'Calculez chaque addition.', 'ligne'),
  t('addition-trou', 'addition', 'En ligne avec des trous', 'Compléter 46 + ? = 83 ou ? + 37 = 83.', 'Complétez le nombre manquant.', 'trou'),
  t('addition-colonne', 'addition', 'En colonnes (nombres posés)', 'Les nombres sont déjà alignés dans le tableau.', 'Effectuez les additions en colonnes. Écrivez le résultat et les retenues.', 'colonne', { preferredColumns: 2 }),
  t('addition-colonne-poser', 'addition', 'En colonnes (à poser)', 'Poser soi-même les nombres dans le tableau.', 'Posez les nombres dans le tableau, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('addition-comparer', 'addition', 'Comparer des sommes', 'Comparer 12 + 8 et 15 + 4.', 'Comparez les deux sommes. Écrivez <, = ou >.', 'ligne'),
  t('addition-problemes', 'addition', 'Problèmes', 'Petits problèmes d’addition en français simple.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('soustraction-ligne', 'soustraction', 'En ligne', 'Calculer 83 − 46 = ?', 'Calculez chaque soustraction.', 'ligne'),
  t('soustraction-trou', 'soustraction', 'En ligne avec des trous', 'Compléter 83 − ? = 46 ou ? − 37 = 46.', 'Complétez le nombre manquant.', 'trou'),
  t('soustraction-colonne', 'soustraction', 'En colonnes (nombres posés)', 'Les nombres sont déjà alignés dans le tableau.', 'Effectuez les soustractions en colonnes. Écrivez le résultat et les emprunts.', 'colonne', { preferredColumns: 2 }),
  t('soustraction-colonne-poser', 'soustraction', 'En colonnes (à poser)', 'Poser soi-même les nombres dans le tableau.', 'Posez les nombres dans le tableau, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('soustraction-comparer', 'soustraction', 'Comparer des différences', 'Comparer 90 − 12 et 88 − 8.', 'Comparez les deux différences. Écrivez <, = ou >.', 'ligne'),
  t('soustraction-problemes', 'soustraction', 'Problèmes', 'Petits problèmes de soustraction.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('estimation-dizaine', 'estimation', 'Arrondir à la dizaine', 'Arrondir 47 à la dizaine la plus proche.', 'Arrondissez à la dizaine la plus proche.', 'ligne'),
  t('estimation-centaine', 'estimation', 'Arrondir à la centaine', 'Arrondir 382 à la centaine la plus proche.', 'Arrondissez à la centaine la plus proche.', 'ligne'),
  t('estimation-somme', 'estimation', 'Estimer une somme', 'Estimer 48 + 33 à la dizaine.', 'Estimez le résultat à la dizaine la plus proche.', 'ligne'),
  t('estimation-difference', 'estimation', 'Estimer une différence', 'Estimer 91 − 28 à la dizaine.', 'Estimez le résultat à la dizaine la plus proche.', 'ligne'),

  t('multiplication-ligne', 'multiplication', 'En ligne (tables)', 'Calculer 7 × 8 = ?', 'Calculez chaque produit.', 'ligne'),
  t('multiplication-trou', 'multiplication', 'En ligne avec des trous', 'Compléter 7 × ? = 56.', 'Complétez le nombre manquant.', 'trou'),
  t('multiplication-colonne', 'multiplication', 'En colonnes × 1 chiffre', 'Nombres déjà posés, multiplicateur à 1 chiffre.', 'Effectuez les multiplications en colonnes.', 'colonne', { preferredColumns: 2 }),
  t('multiplication-colonne-poser', 'multiplication', 'En colonnes à poser × 1 chiffre', 'Poser le calcul dans le tableau.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('multiplication-2chiffres', 'multiplication', 'En colonnes × 2 chiffres', 'Produits partiels, nombres déjà posés.', 'Effectuez les multiplications en colonnes. Écrivez les produits partiels.', 'colonne', { preferredColumns: 1 }),
  t('multiplication-problemes', 'multiplication', 'Problèmes', 'Problèmes de multiplication.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('division-ligne', 'division', 'En ligne', 'Calculer 56 ÷ 7 = ?', 'Calculez chaque quotient.', 'ligne'),
  t('division-trou', 'division', 'En ligne avec des trous', 'Compléter 56 ÷ ? = 8.', 'Complétez le nombre manquant.', 'trou'),
  t('division-colonne', 'division', 'En colonnes (nombres posés)', 'Division posée, dividend et diviseur écrits.', 'Effectuez les divisions en colonnes.', 'colonne', { preferredColumns: 1 }),
  t('division-colonne-poser', 'division', 'En colonnes (à poser)', 'Poser dividend et diviseur, puis diviser.', 'Posez la division, puis calculez le quotient et le reste.', 'colonne-vide', { preferredColumns: 1 }),
  t('division-reste', 'division', 'Quotient et reste', 'Divisions non exactes.', 'Calculez le quotient et le reste.', 'ligne'),
  t('division-problemes', 'division', 'Problèmes', 'Problèmes de division.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('multiples-reconnaitre', 'multiples', 'Reconnaître un multiple', 'Dire si un nombre est multiple d’un autre.', 'Répondez par oui ou non.', 'ligne'),
  t('multiples-diviseurs', 'multiples', 'Lister les diviseurs', 'Trouver tous les diviseurs d’un nombre.', 'Écrivez tous les diviseurs, du plus petit au plus grand.', 'texte'),
  t('multiples-pgcd', 'multiples', 'PGCD', 'Plus grand commun diviseur de deux nombres.', 'Calculez le PGCD.', 'ligne'),
  t('multiples-ppcm', 'multiples', 'PPCM', 'Plus petit commun multiple de deux nombres.', 'Calculez le PPCM.', 'ligne'),

  t('fractions-identifier', 'fractions', 'Lire une fraction', 'Donner le numérateur ou le dénominateur.', 'Complétez.', 'ligne'),
  t('fractions-equivalentes', 'fractions', 'Fractions équivalentes', 'Compléter 2/5 = ?/10.', 'Complétez la fraction équivalente.', 'ligne'),
  t('fractions-simplifier', 'fractions', 'Simplifier', 'Réduire une fraction.', 'Simplifiez chaque fraction.', 'ligne'),
  t('fractions-comparer', 'fractions', 'Comparer', 'Comparer deux fractions.', 'Comparez. Écrivez <, = ou >.', 'ligne'),
  t('fractions-add', 'fractions', 'Additionner / soustraire', 'Même dénominateur, puis dénominateurs différents.', 'Calculez et simplifiez si possible.', 'ligne'),
  t('fractions-mul', 'fractions', 'Multiplier', 'Produit de deux fractions.', 'Calculez et simplifiez si possible.', 'ligne'),
  t('fractions-div', 'fractions', 'Diviser', 'Division de deux fractions.', 'Calculez et simplifiez si possible.', 'ligne'),

  t('decimaux-lire', 'decimaux', 'Lire et écrire', 'Passer de 3,25 à « trois virgule vingt-cinq ».', 'Écrivez le nombre demandé.', 'texte'),
  t('decimaux-comparer', 'decimaux', 'Comparer', 'Comparer 3,8 et 3,75.', 'Comparez. Écrivez <, = ou >.', 'ligne'),
  t('decimaux-arrondir', 'decimaux', 'Arrondir', 'Arrondir au dixième, au centième ou à l’unité.', 'Arrondissez comme indiqué.', 'ligne'),
  t('decimaux-ligne', 'decimaux', 'Addition / soustraction en ligne', 'Calculer 3,4 + 2,75.', 'Calculez.', 'ligne'),
  t('decimaux-colonne', 'decimaux', 'En colonnes (nombres posés)', 'Aligner les virgules, nombres déjà posés.', 'Calculez en colonnes.', 'colonne', { preferredColumns: 2 }),
  t('decimaux-colonne-poser', 'decimaux', 'En colonnes (à poser)', 'Poser les décimaux en alignant les virgules.', 'Posez les nombres, puis calculez.', 'colonne-vide', { preferredColumns: 2 }),
  t('decimaux-mul', 'decimaux', 'Multiplication', 'Multiplier un décimal par un entier.', 'Calculez.', 'ligne'),

  t('proportion-notion', 'proportionnalite', 'Notion de pourcentage', 'Écrire 1/4 = 25 %.', 'Complétez.', 'ligne'),
  t('proportion-de', 'proportionnalite', 'Pourcentage d’un nombre', 'Calculer 20 % de 80.', 'Calculez.', 'ligne'),
  t('proportion-var', 'proportionnalite', 'Augmentation et réduction', 'Augmenter ou diminuer d’un pourcentage.', 'Calculez le nouveau montant.', 'ligne'),
  t('proportion-problemes', 'proportionnalite', 'Problèmes', 'Situations de proportionnalité.', 'Lisez le problème. Écrivez le calcul et la réponse.', 'texte', { preferredColumns: 1 }),

  t('relatifs-comparer', 'relatifs', 'Comparer', 'Comparer −7 et −3.', 'Comparez. Écrivez <, = ou >.', 'ligne'),
  t('relatifs-add', 'relatifs', 'Addition et soustraction', 'Calculer (−8) + 5.', 'Calculez.', 'ligne'),
  t('relatifs-mul', 'relatifs', 'Multiplication et division', 'Calculer (−6) × 3.', 'Calculez.', 'ligne'),

  t('puissances-calcul', 'puissances', 'Calculer une puissance', 'Calculer 3², 2⁴.', 'Calculez.', 'ligne'),
  t('puissances-10', 'puissances', 'Puissances de 10', 'Écrire 10³ ou 0,01.', 'Écrivez le nombre demandé.', 'ligne'),
  t('puissances-racine', 'puissances', 'Racine carrée', 'Calculer √81.', 'Calculez.', 'ligne'),
  t('puissances-priorite', 'puissances', 'Priorité des opérations', 'Calculer 3 + 2 × 4².', 'Calculez en respectant les priorités.', 'ligne'),

  t('expressions-lire', 'expressions', 'Lire une expression', 'Traduire « le double de x plus 3 ».', 'Écrivez l’expression ou sa lecture.', 'texte'),
  t('expressions-substituer', 'expressions', 'Substitution', 'Calculer 2x + 5 pour x = 3.', 'Remplacez la lettre par sa valeur, puis calculez.', 'ligne'),
  t('expressions-reduire', 'expressions', 'Réduction', 'Réduire 3x + 5x − 2.', 'Réduisez chaque expression.', 'ligne'),
  t('expressions-developper', 'expressions', 'Développement', 'Développer 3(x + 4).', 'Développez, puis réduisez si besoin.', 'ligne'),
  t('expressions-factoriser', 'expressions', 'Factorisation', 'Factoriser 6x + 9.', 'Factorisez.', 'ligne'),

  t('equations-simple', 'equations', 'Équations simples', 'Résoudre x + 7 = 15.', 'Trouvez la valeur de x.', 'ligne'),
  t('equations-deux-cotes', 'equations', 'Inconnue des deux côtés', 'Résoudre 3x + 2 = x + 10.', 'Trouvez la valeur de x.', 'ligne'),
  t('equations-fractions', 'equations', 'Avec fractions', 'Résoudre x/2 + 3 = 7.', 'Trouvez la valeur de x.', 'ligne'),
  t('equations-systeme', 'equations', 'Systèmes (substitution)', 'Deux équations, deux inconnues.', 'Trouvez le couple (x ; y).', 'texte', { preferredColumns: 1 }),
  t('equations-systeme-add', 'equations', 'Systèmes (addition)', 'Combinaison linéaire.', 'Trouvez le couple (x ; y).', 'texte', { preferredColumns: 1 }),

  t('figures-nommer', 'figures', 'Nommer la figure', 'Reconnaître carré, triangle, cercle…', 'Nommez chaque figure.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('figures-proprietes', 'figures', 'Propriétés', 'Côtés, sommets, angles droits.', 'Complétez la propriété.', 'geo', { figure: 'square', preferredColumns: 2 }),

  t('conversions-longueur', 'conversions', 'Longueurs', 'm, km, cm, mm.', 'Convertissez.', 'ligne'),
  t('conversions-aire', 'conversions', 'Aires', 'm², cm², km².', 'Convertissez.', 'ligne'),
  t('conversions-volume', 'conversions', 'Volumes', 'm³, cm³, dm³.', 'Convertissez.', 'ligne'),
  t('conversions-capacite', 'conversions', 'Capacités', 'L, cL, mL.', 'Convertissez.', 'ligne'),
  t('conversions-masse', 'conversions', 'Masses', 'kg, g, t.', 'Convertissez.', 'ligne'),
  t('conversions-temps', 'conversions', 'Temps', 'h, min, s.', 'Convertissez.', 'ligne'),

  t('perimetres-carre', 'perimetres', 'Carré', 'Périmètre d’un carré.', 'Calculez le périmètre.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('perimetres-rectangle', 'perimetres', 'Rectangle', 'Périmètre d’un rectangle.', 'Calculez le périmètre.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('perimetres-triangle', 'perimetres', 'Triangle', 'Périmètre d’un triangle (tous types).', 'Calculez le périmètre.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('perimetres-parallelogramme', 'perimetres', 'Parallélogramme', 'Périmètre d’un parallélogramme.', 'Calculez le périmètre.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('perimetres-trapeze', 'perimetres', 'Trapèze', 'Périmètre d’un trapèze.', 'Calculez le périmètre.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('perimetres-cercle', 'perimetres', 'Cercle', 'Périmètre = 2πr. Prenez π = 3,14.', 'Calculez le périmètre. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),

  t('aires-carre', 'aires', 'Carré', 'Aire d’un carré.', 'Calculez l’aire.', 'geo', { figure: 'square', preferredColumns: 2 }),
  t('aires-rectangle', 'aires', 'Rectangle', 'Aire d’un rectangle.', 'Calculez l’aire.', 'geo', { figure: 'rectangle', preferredColumns: 2 }),
  t('aires-triangle', 'aires', 'Triangle', 'Aire = (b × h) / 2 (tous types).', 'Calculez l’aire.', 'geo', { figure: 'triangle', preferredColumns: 2 }),
  t('aires-parallelogramme', 'aires', 'Parallélogramme', 'Aire = b × h.', 'Calculez l’aire.', 'geo', { figure: 'parallelogram', preferredColumns: 2 }),
  t('aires-trapeze', 'aires', 'Trapèze', 'Aire = (B + b) × h / 2.', 'Calculez l’aire.', 'geo', { figure: 'trapezoid', preferredColumns: 2 }),
  t('aires-disque', 'aires', 'Disque', 'Aire = πr². Prenez π = 3,14.', 'Calculez l’aire. Prenez π = 3,14.', 'geo', { figure: 'circle', preferredColumns: 2 }),

  t('volumes-cube', 'volumes', 'Cube', 'Volume d’un cube.', 'Calculez le volume.', 'geo', { figure: 'cube', preferredColumns: 2 }),
  t('volumes-pave', 'volumes', 'Pavé droit', 'Volume L × l × h.', 'Calculez le volume.', 'geo', { figure: 'cuboid', preferredColumns: 2 }),
  t('volumes-cylindre', 'volumes', 'Cylindre', 'Volume = πr²h. Prenez π = 3,14.', 'Calculez le volume. Prenez π = 3,14.', 'geo', { figure: 'cylinder', preferredColumns: 2 }),

  t('reperage-lire', 'reperage', 'Lire des coordonnées', 'Donner les coordonnées d’un point.', 'Écrivez les coordonnées du point.', 'ligne', { preferredColumns: 1 }),
  t('reperage-abscisse', 'reperage', 'Abscisse et ordonnée', 'Identifier x ou y.', 'Complétez.', 'ligne', { preferredColumns: 1 }),

  t('transformations-axiale', 'transformations', 'Symétrie axiale', 'Image d’un point par une symétrie.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-centrale', 'transformations', 'Symétrie centrale', 'Symétrie par rapport à l’origine.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-translation', 'transformations', 'Translation', 'Translater un point d’un vecteur.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
  t('transformations-rotation', 'transformations', 'Rotation', 'Rotation de 90° autour de l’origine.', 'Donnez les coordonnées de l’image.', 'ligne', { preferredColumns: 1 }),
]

export const exerciseTypeById = Object.fromEntries(exerciseTypes.map((type) => [type.id, type])) as Record<string, ExerciseType>

export function typesForTopic(topic: string): ExerciseType[] {
  return exerciseTypes.filter((type) => type.topic === topic)
}

export function firstTypeFor(domain: Domain, topic?: string): ExerciseType {
  if (topic) {
    const list = typesForTopic(topic)
    if (list[0]) return list[0]
  }
  const fallbackTopic = domain === 'algèbre' ? 'addition' : 'aires'
  return typesForTopic(fallbackTopic)[0]!
}

export function defaultPage(domain: Domain = 'algèbre'): { domain: Domain; topic: string; exerciseType: string; count: number; columns: number } {
  const type = firstTypeFor(domain)
  return { domain, topic: type.topic, exerciseType: type.id, count: 8, columns: type.preferredColumns ?? 2 }
}
