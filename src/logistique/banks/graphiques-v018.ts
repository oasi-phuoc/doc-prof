import type { LogistiqueUnit } from '../approved-banks'

export const logistiqueChartExercises = [
  {
    id: 'log-601-lire-graphique-v018', module: '601', revision: 'graphiques-v018', kind: 'verification', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.1.5 Informations', prompt: 'Vous reprenez un relevé du quai. Lisez les quantités à l’aide de l’échelle.', answer: '',
    table: {
      presentation: 'lire-graphique', title: 'Commandes prêtes pour le départ', headers: ['Jour', 'Nombre de commandes'],
      rows: [['Lun.', '10'], ['Mar.', '20'], ['Mer.', '25'], ['Jeu.', '15']],
      questions: [
        { prompt: 'Quel jour compte le plus de commandes prêtes ?', answer: 'Mercredi, avec 25 commandes.' },
        { prompt: 'Combien de commandes sont prêtes le jeudi ?', answer: '15 commandes.' },
        { prompt: 'Quel est l’écart entre lundi et mardi ?', answer: '10 commandes, car 20 − 10 = 10.' },
      ],
    },
  },
  {
    id: 'log-701-lire-graphique-v018', module: '701', revision: 'graphiques-v018', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.3 Déroulement', prompt: 'Vous suivez l’avancement du comptage. Il faut contrôler 20 emplacements par zone.', answer: '',
    table: {
      presentation: 'lire-graphique', title: 'Avancement de l’inventaire', headers: ['Zone', 'Emplacements contrôlés'],
      rows: [['A', '8'], ['B', '12'], ['C', '16'], ['D', '4']],
      questions: [
        { prompt: 'Quelle zone a le moins avancé ?', answer: 'La zone D, avec 4 emplacements contrôlés.' },
        { prompt: 'Combien d’emplacements sont contrôlés en zone B ?', answer: '12 emplacements.' },
        { prompt: 'Combien reste-t-il à contrôler dans la zone C ?', answer: '4 emplacements (20 − 16).' },
      ],
    },
  },
  {
    id: 'log-107-completer-graphique-v018', module: '107', revision: 'graphiques-v018', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: "7.1 L'inventaire des déchets (sélection)",
    prompt: 'Votre dépôt a pesé trois matières triées. Tracez une barre pour chaque matière, à la hauteur indiquée dans le relevé.', answer: '',
    table: {
      presentation: 'completer-graphique', title: 'Matières triées au dépôt', headers: ['Matière', 'Masse en kg'],
      rows: [['Carton', '30'], ['Bois', '20'], ['Métal', '10']],
    },
  },
  {
    id: 'log-406-completer-graphique-v018', module: '406', revision: 'graphiques-v018', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'Vous représentez la quantité de trois lots classés par date d’entrée. Tracez les barres à partir du relevé.', answer: '',
    table: {
      presentation: 'completer-graphique', title: 'Quantités des lots en stock', headers: ['Entrée', 'Quantité en pièces'],
      rows: [['3 juin', '12'], ['6 juin', '20'], ['8 juin', '8']],
    },
  },
] satisfies readonly LogistiqueUnit[]
