import type { ExerciseType, Topic } from '@/math/types'

export const TCM_CSC_DOMAIN = 'tcm-csc' as const

export const TCM_CSC_TOPICS: Topic[] = [
  { id: 'tcm-csc-info', label: 'Informations', domain: 'tcm-csc' },
  { id: 'tcm-csc-test', label: 'Test CSC', domain: 'tcm-csc' },
]

const exercise = (number: number, label: string, instruction: string, columns = 1): ExerciseType => ({
  id: `tcm-csc-ex${String(number).padStart(2, '0')}`, topic: 'tcm-csc-test', label: `${number} — ${label}`,
  description: instruction, instruction, visual: 'texte', preferredColumns: columns,
})
export const TCM_CSC_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'tcm-csc-consignes',
    topic: 'tcm-csc-info',
    label: 'Consignes du test',
    description: 'Page d’informations et consignes du test TCM CSC.',
    instruction: 'Lisez les consignes avant de commencer le test.',
    visual: 'texte',
    preferredColumns: 1,
  },
  exercise(1, 'Nombres entendus', 'Écrivez le nombre que vous entendez.'),
  exercise(2, 'Calculs entendus', 'Écrivez le résultat du calcul que vous entendez.'),
  exercise(3, 'Entourer les nombres', 'Entourez les cinq nombres entendus.'),
  exercise(4, 'Suites avec aide', 'Complétez les suites de nombres en utilisant l’aide indiquée.'),
  exercise(5, 'Suites sans aide', 'Complétez les suites de nombres.'),
  exercise(6, 'Ranger de 0 à 100', 'Rangez les nombres dans l’ordre indiqué.'),
  exercise(7, 'Comparer de 0 à 100', 'Comparez les nombres. Écrivez <, = ou >.', 2),
  exercise(8, 'Comparer jusqu’à 999', 'Comparez les nombres. Écrivez <, = ou >.', 2),
  exercise(9, 'Compléter les signes', 'Complétez avec +, − ou =.', 2),
  exercise(10, 'Additions et soustractions posées', 'Calculez. Les additions sont à gauche et les soustractions à droite.', 2),
  exercise(11, 'Poser les opérations', 'Posez les nombres dans les grilles, puis calculez.', 2),
  exercise(12, 'Reproduire une figure', 'Reproduisez la figure à l’identique sur le deuxième quadrillage.'),
  exercise(13, 'Agrandir une figure', 'Reproduisez la figure en l’agrandissant : un carré du modèle correspond à deux carrés de côté.'),
  exercise(14, 'Comparer des longueurs', 'Mesurez les segments avec la règle, puis cochez le plus long et le plus court.'),
  exercise(15, 'Relier des points', 'Avec la règle, reliez A à B en rouge, puis C à D en bleu.'),
  exercise(16, 'Suites graphiques', 'Cochez la forme qui continue la suite.'),
  exercise(17, 'Nommer quatre formes', 'Écrivez le nom de chaque forme géométrique.'),
  exercise(18, 'Compter les formes', 'Comptez les formes demandées.'),
  exercise(19, 'Lire les coordonnées', 'Écrivez les coordonnées de chaque forme.'),
  exercise(20, 'Placer les formes', 'Dessinez chaque forme à l’emplacement indiqué.'),
  // Exercice 21 réservé par le propriétaire ; il n’apparaît pas dans le test.
  exercise(22, 'Problème — crayons', 'Résolvez le problème.'),
  exercise(23, 'Problème — bus', 'Résolvez le problème.'),
  exercise(24, 'Problème — perles', 'Résolvez le problème.'),
]
