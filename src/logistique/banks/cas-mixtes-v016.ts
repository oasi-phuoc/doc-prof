import type { LogistiqueUnit } from '../approved-banks'

export const logistiqueMixedCases = [
  {
    id: 'log-308-cas-masse-v016', module: '308', revision: 'cas-mixtes-v016', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '8.2.5 Mesure du poids',
    prompt: 'Vous contrôlez une palette avant l’expédition. Le client limite la masse de la marchandise seule à 190 kg.', answer: '',
    table: {
      presentation: 'cas-mixte', title: 'Relevé de pesée', headers: ['Pesée', 'Masse'],
      rows: [['Palette chargée', '214 kg'], ['Palette vide', '28 kg']],
      questions: [
        { kind: 'choix', prompt: 'Comment appelle-t-on la masse de la palette chargée ?', options: ['Brut', 'Tare', 'Net'], answer: 'Brut', points: 1 },
        { kind: 'calcul', prompt: 'Calculez la masse de la marchandise seule.', calculation: '214 kg − 28 kg = 186 kg', answer: 'La masse nette est de 186 kg.', points: 3 },
        { prompt: 'Le chargement respecte-t-il la limite du client ?', answer: 'Oui. La masse nette de 186 kg est inférieure à 190 kg.', points: 2 },
      ],
    },
  },
  {
    id: 'log-406-cas-repartir-fifo-v016', module: '406', revision: 'cas-mixtes-v016', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'Vous préparez 36 pièces du même article selon FIFO. Les deux lots sont disponibles.', answer: '',
    table: {
      presentation: 'cas-mixte', title: 'Fiche des lots disponibles', headers: ['Lot', 'Date d’entrée', 'Stock'],
      rows: [['P', '5 mai', '30 pièces'], ['R', '8 mai', '20 pièces']],
      questions: [
        { kind: 'choix', prompt: 'Quel lot commencez-vous à prélever ?', options: ['Le lot R', 'Le lot P', 'Le lot de votre choix'], answer: 'Le lot P', points: 1 },
        { kind: 'calcul', prompt: 'Combien de pièces prenez-vous dans le lot R ?', calculation: '36 pièces − 30 pièces = 6 pièces', answer: 'Vous prenez 6 pièces dans le lot R.', points: 3 },
        { prompt: 'Quel mouvement notez-vous pour le lot R ?', answer: 'Une sortie de 6 pièces pour la commande.', points: 2 },
      ],
    },
  },
  {
    id: 'log-601-cas-conditionnement-v016', module: '601', revision: 'cas-mixtes-v016', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.1.5 Informations',
    prompt: 'Préparez 28 pièces D52 selon la fiche de préparation.', answer: '',
    table: {
      presentation: 'cas-mixte', title: 'Fiche de préparation P-602', headers: ['Donnée', 'Information'],
      rows: [['Adresse de D52', 'B-06'], ['Carton complet', '8 pièces']],
      questions: [
        { kind: 'choix', prompt: 'À quelle adresse prélevez-vous D52 ?', options: ['B-08', 'D-52', 'B-06'], answer: 'B-06', points: 1 },
        { kind: 'calcul', prompt: 'Prélevez 3 cartons complets. Combien de pièces ajoutez-vous à l’unité ?', calculation: '28 − (3 × 8) = 4 pièces', answer: 'Vous ajoutez 4 pièces.', points: 3 },
        { prompt: 'Quelles indications vérifiez-vous avant validation ?', answer: 'La référence D52 et la quantité totale de 28 pièces.', points: 2 },
      ],
    },
  },
  {
    id: 'log-701-cas-ecart-positive-v016', module: '701', revision: 'cas-mixtes-v016', kind: 'situation', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.4 Évaluation',
    prompt: 'Vous comparez le relevé d’inventaire au système. La procédure impose un recomptage si l’écart dépasse 2 unités.', answer: '',
    table: {
      presentation: 'cas-mixte', title: 'Contrôle de l’article V-21', headers: ['Stock', 'Quantité'],
      rows: [['Théorique', '63 unités'], ['Compté', '67 unités']],
      questions: [
        { kind: 'choix', prompt: 'Quelle valeur correspond au stock réel relevé ?', options: ['63 unités', '67 unités', '2 unités'], answer: '67 unités', points: 1 },
        { kind: 'calcul', prompt: 'Calculez l’écart signé selon la règle réel moins théorique.', calculation: '67 − 63 = +4 unités', answer: 'L’écart est de +4 unités.', points: 3 },
        { prompt: 'Que faites-vous avant de modifier le stock ?', answer: 'Recomptez le stock. L’écart de 4 dépasse le seuil de 2.', points: 2 },
      ],
    },
  },
] satisfies readonly LogistiqueUnit[]
