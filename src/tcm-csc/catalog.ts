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
  exercise(2, 'Calculs entendus', 'Écrivez le calcul et son résultat.'),
  exercise(3, 'Entourer les nombres', 'Entourez les cinq nombres entendus.'),
  exercise(4, 'Suites avec indication', 'Complétez les suites de nombres.'),
  exercise(5, 'Suites sans aide', 'Complétez les suites de nombres.'),
  exercise(6, 'Ranger de 0 à 100', 'Rangez les nombres dans l’ordre indiqué.'),
  exercise(7, 'Comparer de 0 à 100', 'Comparez les nombres et coloriez le signe correct.', 2),
  exercise(8, 'Décomposer les nombres', 'Décomposez chaque nombre.'),
  exercise(9, 'Nommer les signes', 'Écrivez le nom de chaque signe.'),
  exercise(10, 'Additions et soustractions posées', 'Calculez les additions et les soustractions.', 2),
  exercise(11, 'Poser les opérations', 'Posez les nombres dans les grilles, puis calculez.', 2),
  exercise(12, 'Reproduire une figure', 'Reproduisez la même figure sur le quadrillage de gauche.'),
  exercise(13, 'Agrandir une figure', 'Reproduisez la figure en l’agrandissant.\n1 carré à droite = 2 carrés à gauche.'),
  exercise(14, 'Comparer des longueurs', ''),
  exercise(15, 'Relier des points', 'Avec la règle, reliez A à B en rouge, puis C à D en bleu.'),
  exercise(16, 'Suites graphiques', 'Cochez la forme qui continue la suite.'),
  exercise(17, 'Nommer quatre formes', 'Écrivez le nom de chaque forme géométrique.'),
  exercise(18, 'Compter les formes', ''),
  exercise(19, 'Lire les coordonnées', 'Écrivez les coordonnées de chaque forme.'),
  exercise(20, 'Placer les formes', 'Dessinez chaque forme à l’emplacement indiqué.'),
  // Exercice 21 réservé par le propriétaire ; il n’apparaît pas dans le test.
  exercise(22, 'Problème — crayons', 'Résolvez le problème.'),
  exercise(23, 'Problème — bus', 'Résolvez le problème.'),
  exercise(24, 'Problème — perles', 'Résolvez le problème.'),
]
