import type { LogistiqueUnit } from '../approved-banks'

export const logistiqueDocumentExercises = [
  {
    id: 'log-303-lire-bulletin-v012', module: '303', kind: 'verification', revision: 'documents-v012', approvedFor: ['CFC', 'AFP'],
    theorySection: '3.3.1 Réception planifiée',
    prompt: 'Vous réceptionnez une livraison. Comparez le bulletin au relevé effectué au quai.',
    answer: '',
    table: {
      presentation: 'lire-document', title: 'BL-184 — Relevé de réception',
      headers: ['Article', 'Annoncé', 'Compté'], rows: [['Bac B12', '18', '16'], ['Boîte P4', '12', '12']],
      questions: [
        { prompt: 'Quelle ligne est conforme ?', answer: 'Boîte P4, avec 12 unités annoncées et 12 comptées.' },
        { prompt: 'Combien de bacs B12 manquent ?', answer: 'Il manque 2 bacs B12 (18 − 16).' },
        { prompt: 'Quelle quantité de B12 notez-vous comme constatée ?', answer: '16 bacs B12, la quantité réellement comptée.' },
      ],
    },
  },
  {
    id: 'log-601-lire-preparation-v012', module: '601', kind: 'situation', revision: 'documents-v012', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.1.5 Informations',
    prompt: 'Vous préparez la commande P-418. Au premier contrôle, le bac du rayon B-06 ne contient que 4 pièces.',
    answer: '',
    table: {
      presentation: 'lire-document', title: 'Liste de préparation P-418',
      headers: ['Référence', 'Emplacement', 'À prélever'], rows: [['C17', 'A-02', '3 pièces'], ['D52', 'B-06', '7 pièces']],
      questions: [
        { prompt: 'Où et en quelle quantité prélevez-vous C17 ?', answer: '3 pièces à l’emplacement A-02.' },
        { prompt: 'Combien de D52 manquent au rayon ?', answer: '3 pièces sur les 7 demandées.' },
        { prompt: 'Quel écart signalez-vous avant de valider D52 ?', answer: 'P-418, rayon B-06. Il y a 4 pièces pour 7 demandées.' },
      ],
    },
  },
  {
    id: 'log-406-corriger-sorties-v012', module: '406', kind: 'verification', revision: 'documents-v012', approvedFor: ['CFC', 'AFP'],
    theorySection: '6.3 FIFO — First In, First Out',
    prompt: 'Le dépôt applique FIFO. Le tableau indique l’ordre proposé pour sortir trois lots du même article.',
    answer: '',
    table: {
      presentation: 'corriger-erreurs', title: 'Ordre de sortie proposé',
      headers: ['Lot', 'Date d’entrée', 'Rang proposé'], rows: [['N8', '9 juin', '1'], ['L3', '4 juin', '2'], ['K7', '6 juin', '3']],
      questions: [
        { prompt: 'Quel lot est placé trop tôt ?', answer: 'N8, entré le 9 juin, devrait sortir en dernier.' },
        { prompt: 'Indiquez l’ordre de sortie corrigé.', answer: 'L3 (4 juin), K7 (6 juin), N8 (9 juin).' },
        { prompt: 'Quelle donnée justifie votre correction ?', answer: 'Les dates d’entrée. Avec FIFO, le plus ancien lot sort en premier.' },
      ],
    },
  },
  {
    id: 'log-701-corriger-releve-v012', module: '701', kind: 'situation', revision: 'documents-v012', approvedFor: ['CFC', 'AFP'],
    theorySection: '1.3 Déroulement',
    prompt: 'Vous vérifiez un inventaire. Le stock théorique et la quantité relevée doivent être exprimés en pièces.',
    answer: '',
    table: {
      presentation: 'corriger-erreurs', title: 'Fiche de comptage — Article V-9',
      headers: ['Stock théorique', 'Quantité observée', 'Relevé saisi'],
      rows: [['66 pièces', '6 boîtes de 10 et 4 pièces', '10 pièces']],
      questions: [
        { prompt: 'Pourquoi le relevé saisi est-il erroné ?', answer: 'Il additionne 6 boîtes et 4 pièces sans convertir les boîtes.' },
        { prompt: 'Quelle quantité devez-vous inscrire ?', answer: '64 pièces, car 6 × 10 + 4 = 64.' },
        { prompt: 'Quel écart reste-t-il avec le stock théorique ?', answer: 'Il manque 2 pièces (66 − 64).' },
      ],
    },
  },
] satisfies readonly LogistiqueUnit[]
