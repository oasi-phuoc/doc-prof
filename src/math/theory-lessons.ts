export type MathTheoryLesson = {
  title: string
  goal: string
  words: Array<[string, string]>
  steps: string[]
  example: string
  visualAlt: string
}

export const mathTheoryLessons: Record<string, MathTheoryLesson> = {
  nombres: {
    title: 'Lire et former un nombre',
    goal: 'La place d’un chiffre indique sa valeur.',
    words: [['Unité', 'Un objet.'], ['Dizaine', 'Un groupe de 10 unités.'], ['Centaine', 'Un groupe de 100 unités.']],
    steps: ['Repérez d’abord le chiffre tout à droite.', 'Repérez les unités, les dizaines, puis les centaines.', 'Additionnez la valeur de chaque chiffre.'],
    example: '243 = 200 + 40 + 3. Il y a 24 dizaines complètes et 3 unités.',
    visualAlt: '243 représenté par deux centaines, quatre dizaines et trois unités.',
  },
  addition: {
    title: 'Additionner',
    goal: 'On réunit deux quantités pour trouver le total.',
    words: [['+', 'Plus.'], ['Somme', 'Le résultat de l’addition.'], ['Retenue', 'Un groupe de 10 que l’on passe à la colonne suivante.']],
    steps: ['Placez les unités sous les unités.', 'Additionnez d’abord les unités. 12 unités font 1 dizaine et 2 unités.', 'Écrivez 2 sous les unités. Ajoutez la retenue aux dizaines.'],
    example: '27 + 15 = 42.',
    visualAlt: 'Addition posée de 27 et 15. La retenue est écrite au-dessus des dizaines.',
  },
  soustraction: {
    title: 'Soustraire',
    goal: 'On enlève une quantité ou on cherche l’écart entre deux nombres.',
    words: [['−', 'Moins.'], ['Différence', 'Le résultat de la soustraction.']],
    steps: ['Placez les unités sous les unités.', 'Pour faire 2 − 7, échangez une dizaine contre 10 unités. Vous avez maintenant 12 unités.', 'Calculez 12 − 7. Puis soustrayez les dizaines qui restent.'],
    example: '42 − 17 = 25. Vérifiez avec 25 + 17 = 42.',
    visualAlt: 'Soustraction posée 42 moins 17. Quatre dizaines deviennent trois dizaines et douze unités.',
  },
  estimation: {
    title: 'Arrondir et estimer',
    goal: 'On choisit un nombre proche pour calculer plus vite.',
    words: [['Arrondir', 'Choisir la dizaine ou la centaine la plus proche.'], ['≈', 'À peu près égal à.']],
    steps: ['Trouvez les deux dizaines qui entourent le nombre.', 'Regardez de quelle dizaine le nombre est le plus proche.', 'Au milieu, prenez la dizaine du dessus.'],
    example: '47 est plus proche de 50 que de 40. On écrit 47 ≈ 50.',
    visualAlt: 'Droite graduée de 40 à 50 avec 47 près de 50.',
  },
  multiplication: {
    title: 'Multiplier',
    goal: 'On compte plusieurs groupes de même taille.',
    words: [['×', 'Fois.'], ['Facteurs', 'Les deux nombres que l’on multiplie.'], ['Produit', 'Le résultat.']],
    steps: ['Comptez les groupes.', 'Comptez les objets dans un groupe.', 'Multipliez le nombre de groupes par le nombre d’objets par groupe.'],
    example: '3 sacs de 4 pommes donnent 3 × 4 = 12 pommes.',
    visualAlt: 'Trois groupes de quatre points, soit douze points.',
  },
  division: {
    title: 'Diviser et partager',
    goal: 'On partage en parts égales ou on forme des groupes de même taille.',
    words: [['Dividende', 'La quantité à partager.'], ['Diviseur', 'Ici, le nombre de parts.'], ['Quotient et reste', 'La quantité par part et ce qui reste.']],
    steps: ['Distribuez la même quantité à chaque groupe.', 'Continuez tant que vous pouvez donner un objet à chaque groupe.', 'Comptez les objets par groupe et ceux qui restent.'],
    example: '14 ÷ 4 donne 3 par groupe et il reste 2. Vérifiez avec 4 × 3 + 2 = 14.',
    visualAlt: 'Quatre groupes de trois points et deux points à côté.',
  },
  problemes: {
    title: 'Comprendre un problème',
    goal: 'La question dit ce qu’il faut trouver.',
    words: [['Énoncé', 'Le texte du problème.'], ['Données', 'Les informations données dans le texte.'], ['Réponse', 'Une phrase qui répond à la question.']],
    steps: ['Lisez la question et dites-la avec vos mots.', 'Repérez les quantités qui servent à répondre.', 'Écrivez le calcul. Répondez avec l’unité ou le nom de l’objet.'],
    example: 'Lina a 4 crayons. On lui en donne 3. Elle a maintenant 4 + 3 = 7 crayons.',
    visualAlt: 'Quatre crayons, puis trois crayons ajoutés, puis sept crayons en tout.',
  },
  multiples: {
    title: 'Multiples et diviseurs',
    goal: 'Un diviseur partage un nombre sans laisser de reste.',
    words: [['Multiple', 'Résultat d’une multiplication par un nombre entier.'], ['PGCD', 'Le plus grand diviseur commun.'], ['PPCM', 'Le plus petit multiple commun supérieur à zéro.']],
    steps: ['Pour trouver des multiples de 4, écrivez 4 × 1, 4 × 2, 4 × 3…', 'Repérez les nombres qui apparaissent dans les deux listes.', 'Pour chercher un diviseur, faites la division. Le reste doit être 0.'],
    example: '12 est le PPCM de 4 et de 6. Le PGCD de 4 et de 6 est 2.',
    visualAlt: 'Les listes des multiples de 4 et de 6 se rencontrent en 12.',
  },
  fractions: {
    title: 'Lire une fraction',
    goal: 'Une fraction peut décrire des parts égales.',
    words: [['Dénominateur', 'Le nombre du bas. Il indique le nombre de parts égales.'], ['Numérateur', 'Le nombre du haut. Il indique le nombre de parts prises.']],
    steps: ['Vérifiez que les parts ont la même taille.', 'Comptez toutes les parts. Écrivez ce nombre en bas.', 'Comptez les parts coloriées. Écrivez ce nombre en haut.'],
    example: '3/4 signifie trois parts coloriées sur quatre parts égales.',
    visualAlt: 'Une bande partagée en quatre parts égales. Les trois premières sont coloriées.',
  },
  decimaux: {
    title: 'Lire et calculer avec la virgule',
    goal: 'La virgule sépare les unités des dixièmes.',
    words: [['Dixième', 'Une unité partagée en 10 parts égales.'], ['Centième', 'Une unité partagée en 100 parts égales.']],
    steps: ['Pour additionner, placez les virgules l’une sous l’autre.', 'Ajoutez un zéro pour voir les colonnes. 1,2 = 1,20.', 'Calculez en commençant à droite. Remettez la virgule dans la même colonne.'],
    example: '1,20 + 0,35 = 1,55.',
    visualAlt: 'Tableau avec unités, dixièmes et centièmes. Les virgules sont alignées.',
  },
  proportionnalite: {
    title: 'Proportions et pourcentages',
    goal: 'Dans une situation proportionnelle, le même facteur relie les deux quantités.',
    words: [['Facteur', 'Le nombre par lequel on multiplie.'], ['Pourcentage', 'Une part sur 100.']],
    steps: ['Trouvez ce qui correspond à une seule unité.', 'Multipliez par le nombre d’unités demandé.', 'Pour lire 25 %, pensez à 25 parts sur 100.'],
    example: 'Si 2 jus coûtent 6 CHF, alors 1 jus coûte 3 CHF et 4 jus coûtent 12 CHF.',
    visualAlt: 'Tableau de prix donnant 3 francs pour un jus, 6 pour deux et 12 pour quatre.',
  },
  relatifs: {
    title: 'Nombres positifs et négatifs',
    goal: 'Les nombres négatifs sont plus petits que zéro.',
    words: [['Positif', 'Plus grand que 0.'], ['Négatif', 'Plus petit que 0.']],
    steps: ['Trouvez zéro sur la droite graduée.', 'Allez à droite pour les nombres positifs.', 'Allez à gauche pour les nombres négatifs. Plus on va à gauche, plus le nombre est petit.'],
    example: '−3 est plus petit que −1. On écrit −3 < −1.',
    visualAlt: 'Droite graduée allant de moins 4 à plus 4, avec moins 3 à gauche de moins 1.',
  },
  puissances: {
    title: 'Puissances et racines',
    goal: 'Une puissance répète la multiplication d’un même nombre.',
    words: [['Carré', 'Le nombre multiplié par lui-même.'], ['Racine carrée', 'Le nombre positif ou nul dont on connaît le carré.']],
    steps: ['Lisez 3² comme « trois au carré ».', 'Calculez 3 × 3. Vous obtenez 9.', 'Faites le chemin inverse. Le carré de 3 est 9, donc √9 = 3.'],
    example: '3² = 9 et √9 = 3.',
    visualAlt: 'Un carré de trois carreaux de côté contient neuf carreaux.',
  },
  expressions: {
    title: 'Calculer avec une lettre',
    goal: 'Une lettre peut remplacer un nombre.',
    words: [['Expression', 'Un calcul avec des nombres, des signes ou des lettres.'], ['2x', 'Deux fois x.']],
    steps: ['Repérez la valeur donnée pour la lettre.', 'Remplacez la lettre par cette valeur.', 'Faites d’abord la multiplication, puis l’addition.'],
    example: 'Pour x = 4, 2x + 3 = 2 × 4 + 3 = 11.',
    visualAlt: 'Deux cases x deviennent deux cases 4, puis on ajoute 3.',
  },
  fonctions: {
    title: 'Entrée, règle et résultat',
    goal: 'Une fonction donne un seul résultat pour chaque entrée.',
    words: [['x', 'Le nombre d’entrée.'], ['y', 'Le résultat après le calcul.']],
    steps: ['Choisissez une valeur de x.', 'Appliquez la règle dans l’ordre.', 'Écrivez le résultat y.'],
    example: 'Avec y = 2x + 1, si x = 3, alors y = 7.',
    visualAlt: 'La valeur 3 entre dans une boîte : multiplier par 2 puis ajouter 1. La valeur 7 sort.',
  },
  equations: {
    title: 'Trouver le nombre caché',
    goal: 'Les deux côtés du signe égal ont la même valeur.',
    words: [['Équation', 'Une égalité avec une valeur à trouver.'], ['Solution', 'La valeur qui rend l’égalité vraie.']],
    steps: ['Repérez la lettre qui cache le nombre.', 'Faites la même opération des deux côtés du signe égal.', 'Remplacez la lettre par votre résultat pour vérifier.'],
    example: 'x + 3 = 8. Enlevez 3 des deux côtés. Il reste x = 5.',
    visualAlt: 'Égalité x plus 3 égale 8. On enlève 3 à gauche et à droite pour obtenir x égale 5.',
  },
  figures: {
    title: 'Côtés, sommets et angles',
    goal: 'On observe une figure pour pouvoir la nommer.',
    words: [['Côté', 'Un segment du bord.'], ['Sommet', 'Le point où deux côtés se rencontrent.'], ['Angle droit', 'Un angle comme le coin d’une feuille.']],
    steps: ['Comptez les côtés et les sommets.', 'Cherchez les angles droits.', 'Comparez les longueurs des côtés.'],
    example: 'Le carré a quatre côtés de même longueur et quatre angles droits.',
    visualAlt: 'Carré dont un côté et un sommet sont indiqués, avec un angle droit marqué.',
  },
  conversions: {
    title: 'Changer d’unité de longueur',
    goal: 'La longueur reste la même. Seuls le nombre et l’unité changent.',
    words: [['m', 'Mètre.'], ['cm', 'Centimètre. 100 cm font 1 m.'], ['mm', 'Millimètre. 10 mm font 1 cm.']],
    steps: ['Lisez l’unité de départ.', 'Trouvez combien de petites unités font une grande unité.', 'Pour passer de m à cm, multipliez par 100. Dans l’autre sens, divisez par 100.'],
    example: '2 m = 200 cm. 50 cm = 0,50 m.',
    visualAlt: 'Une ligne de conversion indique 1 mètre, 100 centimètres et 1 000 millimètres.',
  },
  perimetres: {
    title: 'Calculer le périmètre',
    goal: 'Le périmètre est la longueur du tour.',
    words: [['Périmètre', 'La longueur de tout le bord.'], ['Côtés opposés', 'Les côtés qui se font face.']],
    steps: ['Suivez le bord avec le doigt.', 'Notez la longueur de chaque côté.', 'Additionnez toutes les longueurs dans la même unité.'],
    example: 'Rectangle de 5 cm sur 3 cm. Son périmètre est 5 + 3 + 5 + 3 = 16 cm.',
    visualAlt: 'Rectangle coté 5 cm et 3 cm. Le bord est mis en évidence.',
  },
  aires: {
    title: 'Calculer une aire',
    goal: 'L’aire mesure la place occupée à l’intérieur d’une figure.',
    words: [['Aire', 'La mesure de la surface intérieure.'], ['cm²', 'Aire d’un carré de 1 cm sur 1 cm.']],
    steps: ['Regardez l’intérieur de la figure.', 'Comptez les carreaux entiers, ou comptez les rangées et les carreaux dans chaque rangée.', 'Écrivez la réponse en unités carrées, par exemple cm².'],
    example: 'Rectangle de 5 cm sur 3 cm. Son aire est 5 × 3 = 15 cm².',
    visualAlt: 'Rectangle découpé en trois rangées de cinq carreaux.',
  },
  volumes: {
    title: 'Calculer un volume',
    goal: 'Le volume indique la place occupée par un solide.',
    words: [['Volume', 'La place dans l’espace en trois dimensions.'], ['cm³', 'Volume d’un cube de 1 cm de côté.']],
    steps: ['Comptez les cubes d’une couche.', 'Comptez les couches.', 'Multipliez. Dans un pavé droit, c’est longueur × largeur × hauteur.'],
    example: '3 × 2 × 2 = 12 cm³ pour un pavé de 3 cm, 2 cm et 2 cm.',
    visualAlt: 'Deux couches de six cubes, donc douze cubes en tout.',
  },
  reperage: {
    title: 'Placer un point dans un repère',
    goal: 'Deux nombres indiquent où se trouve un point.',
    words: [['Origine', 'Le point 0.'], ['Abscisse', 'Le premier nombre, de gauche à droite.'], ['Ordonnée', 'Le deuxième nombre, de bas en haut.']],
    steps: ['Partez de l’origine.', 'Déplacez-vous d’abord à gauche ou à droite.', 'Puis descendez ou montez. Marquez le point.'],
    example: 'A (3 ; 2) est à 3 carreaux à droite et 2 carreaux vers le haut.',
    visualAlt: 'Quadrillage avec un trajet de trois carreaux vers la droite puis deux vers le haut.',
  },
  transformations: {
    title: 'Déplacer ou retourner une figure',
    goal: 'La figure peut changer de place sans changer de taille.',
    words: [['Translation', 'On fait glisser la figure.'], ['Rotation', 'On tourne la figure autour d’un point.'], ['Symétrie axiale', 'On construit le reflet de l’autre côté d’une ligne.']],
    steps: ['Repérez la transformation demandée.', 'Pour un reflet, comptez la distance de chaque sommet à l’axe.', 'Placez chaque nouveau sommet à la même distance, de l’autre côté, puis reliez les points.'],
    example: 'Un point à 2 carreaux de l’axe a un reflet à 2 carreaux de l’autre côté.',
    visualAlt: 'Un triangle et son reflet sur un quadrillage, séparés par un axe vertical.',
  },
}

export const MATH_THEORY_PREFIX = 'math-theorie-'

export function mathTheoryTopic(typeId: string): string | undefined {
  if (!typeId.startsWith(MATH_THEORY_PREFIX)) return undefined
  const topic = typeId.slice(MATH_THEORY_PREFIX.length)
  return Object.hasOwn(mathTheoryLessons, topic) ? topic : undefined
}
