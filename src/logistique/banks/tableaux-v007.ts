import type { LogistiqueUnit } from '../approved-banks'

const blank = (answer: string) => ({ answer })

export const logistiqueTableExercises: readonly LogistiqueUnit[] = [
  {
    id: 'log-306-tableaux-formats-v007', module: '306', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'verification', theorySection: 'Comparer le format industriel et la demi-palette',
    prompt: 'Complétez les dimensions des trois supports illustrés dans le cours.',
    answer: 'Les trois formats ont des empreintes différentes.',
    table: {
      presentation: 'tableau-donnees',
      headers: ['Format', 'Longueur (mm)', 'Largeur (mm)'],
      rows: [
        ['EUR 1', '1 200', blank('800')],
        ['Industriel', blank('1 200'), '1 000'],
        ['Demi-palette', '800', blank('600')],
      ],
    },
  },
  {
    id: 'log-306-tableaux-supports-v007', module: '306', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'verification', theorySection: '6.6 Supports de charge spéciaux',
    prompt: 'Choisissez entre box-palette et palette synthétique pour chacun des postes.',
    answer: 'Vérifiez aussi la compatibilité du modèle avec le poste.',
    table: {
      presentation: 'tableau-donnees', headers: ['Besoin au poste', 'Support'],
      rows: [['Retenir des copeaux métalliques', blank('Box-palette')], ['Utiliser un plateau lavable', blank('Palette synthétique')]],
    },
  },
  {
    id: 'log-306-tableaux-pooleurs-v007', module: '306', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'verification', theorySection: '6.5.1 Pool fermé',
    prompt: 'Indiquez le type de pool et la règle de retour adaptée à chaque circuit.',
    answer: 'Le marquage et les règles de l’accord déterminent le traitement.',
    table: {
      presentation: 'tableau-donnees', headers: ['Support', 'Type de pool', 'Règle de retour'],
      rows: [['CHEP', blank('Fermé'), 'Collecte par le prestataire'], ['EUR 1 conforme', 'Ouvert', blank('Échange selon l’accord')]],
    },
  },
  {
    id: 'log-306-tableaux-support-pieces-v007', module: '306', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'verification', theorySection: "6.1 Qu'est-ce qu'un contenant ?",
    prompt: 'Nommez l’accessoire utilisé pour chaque fonction. Choisissez entre cadre et couvercle.',
    answer: 'Les deux accessoires doivent être compatibles avec le modèle de palette.',
    table: {
      presentation: 'tableau-donnees', headers: ['Fonction', 'Accessoire'],
      rows: [['Augmenter la hauteur des parois', blank('Cadre')], ['Fermer le dessus du contenant', blank('Couvercle')]],
    },
  },
  {
    id: 'log-308-tableaux-reception-v007', module: '308', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '8.2 Techniques de comptage',
    prompt: 'Complétez le tableau. Écart = reçu − prévu. Quel est l’écart total ?',
    calculation: '22 − 24 = −2\n15 + 3 = 18\n18 − 0 = 18\n−2 + 3 + 0 = +1',
    answer: 'Il y a un carton de plus que prévu.',
    table: {
      presentation: 'tableau-donnees', headers: ['Article', 'Prévu', 'Reçu', 'Écart'],
      rows: [['Cartons A', '24', '22', blank('−2')], ['Cartons B', '15', blank('18'), '+3'], ['Cartons C', blank('18'), '18', '0']],
    },
  },
  {
    id: 'log-308-tableaux-tare-v007', module: '308', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '8.2.5 Mesure du poids',
    prompt: 'Complétez les masses en kg. Quelle masse nette totale a été réceptionnée ?',
    calculation: '48 − 8 = 40 kg\n36 − 6 = 30 kg\n62 − 50 = 12 kg\n40 + 30 + 50 = 120 kg',
    answer: 'La masse nette totale est de 120 kg.',
    table: {
      presentation: 'tableau-donnees', headers: ['Bac', 'Brut', 'Tare', 'Net'],
      rows: [['M1', '48', '8', blank('40')], ['M2', '36', '6', blank('30')], ['M3', '62', blank('12'), '50']],
    },
  },
  {
    id: 'log-308-tableaux-groupes-v007', module: '308', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '8.2 Techniques de comptage',
    prompt: 'Complétez les quantités à partir des groupes. Combien de pièces y a-t-il en tout ?',
    calculation: '9 × 6 = 54\n5 × 8 = 40\n21 ÷ 7 = 3\n54 + 40 + 21 = 115',
    answer: 'Les trois lignes totalisent 115 pièces.',
    table: {
      presentation: 'tableau-donnees', headers: ['Lot', 'Groupes', 'Pièces/groupe', 'Total'],
      rows: [['A', '9', '6', blank('54')], ['B', '5', '8', blank('40')], ['C', blank('3'), '7', '21']],
    },
  },
  {
    id: 'log-308-tableaux-longueurs-v007', module: '308', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '8.2.3 Accessoires de mesure des longueurs (précision)',
    prompt: 'Complétez les écarts en mm. Écart = mesure − cible. Quelle pièce est la plus courte par rapport à sa cible ?',
    calculation: '49,8 − 50,0 = −0,2 mm\n52,1 − 52,0 = +0,1 mm\n47,6 − 48,0 = −0,4 mm',
    answer: 'La pièce C est plus courte de 0,4 mm.',
    table: {
      presentation: 'tableau-donnees', headers: ['Pièce', 'Cible', 'Mesure', 'Écart'],
      rows: [['A', '50,0', '49,8', blank('−0,2')], ['B', '52,0', '52,1', blank('+0,1')], ['C', '48,0', '47,6', blank('−0,4')]],
    },
  },
  {
    id: 'log-406-tableaux-bissextile-v007', module: '406', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'L’entrée est le jour 0. Complétez les dates et durées en jours.',
    calculation: 'A : du 28.02 au 02.03, comptez le 29.02, le 01.03 et le 02.03 : 3 jours.\nB : 30.04 + 2 jours = 02.05.',
    answer: 'A reste 3 jours. B sort le 02.05.2027.',
    table: {
      presentation: 'tableau-dates', headers: ['Lot', 'Entrée', 'Sortie', 'Jours'],
      rows: [['A', '28.02.2028', '02.03.2028', blank('3')], ['B', '30.04.2027', blank('02.05.2027'), '2']],
    },
  },
  {
    id: 'log-406-tableaux-nouvel-an-v007', module: '406', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'L’entrée est le jour 0. Complétez le tableau puis nommez le lot resté le plus longtemps.',
    calculation: 'A : 31.12 → 01.01 → 02.01 → 03.01 = 3 jours.\nB : 03.01 − 5 jours = 29.12.2026.\n5 > 3.',
    answer: 'Le lot B est resté le plus longtemps.',
    table: {
      presentation: 'tableau-dates', headers: ['Lot', 'Entrée', 'Sortie', 'Jours'],
      rows: [['A', '31.12.2026', '03.01.2027', blank('3')], ['B', blank('29.12.2026'), '03.01.2027', '5']],
    },
  },
  {
    id: 'log-406-tableaux-priorite-v007', module: '406', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'Calculez les durées au 12.11.2026. L’entrée est le jour 0. Quel lot doit sortir en premier en FIFO ?',
    calculation: 'A : 12 − 4 = 8 jours.\nB : 12 − 8 = 4 jours.\nLe 04.11 est antérieur au 08.11.',
    answer: 'Le lot A sort en premier en FIFO.',
    table: {
      presentation: 'tableau-dates', headers: ['Lot', 'Entrée', 'Jours'],
      rows: [['A', '04.11.2026', blank('8')], ['B', '08.11.2026', blank('4')]],
    },
  },
  {
    id: 'log-406-tableaux-sorties-v007', module: '406', revision: 'tableaux-v007', approvedFor: ['CFC','AFP'],
    kind: 'maths', theorySection: '6.4 LIFO — Last In, First Out',
    prompt: 'L’entrée est le jour 0. Retrouvez les dates. Quel lot est entré en dernier ?',
    calculation: 'A : 16.06 − 4 jours = 12.06.\nB : 14.06 + 2 jours = 16.06.\nLe 14.06 est postérieur au 12.06.',
    answer: 'Le lot B, entré en dernier, passe en premier en LIFO.',
    table: {
      presentation: 'tableau-dates', headers: ['Lot', 'Entrée', 'Sortie', 'Jours'],
      rows: [['A', blank('12.06.2026'), '16.06.2026', '4'], ['B', '14.06.2026', blank('16.06.2026'), '2']],
    },
  },
]
