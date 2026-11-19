import type { ExerciseType, Topic } from '@/math/types'

export const TCM_CSC_DOMAIN = 'tcm-csc' as const

export const TCM_CSC_TOPICS: Topic[] = [
  { id: 'tcm-csc-info', label: 'Informations', domain: 'tcm-csc' },
  { id: 'tcm-csc-test', label: 'Test CSC', domain: 'tcm-csc' },
]

/**
 * Numéro affiché. Entourer (type 3) ouvre le test, puis les deux écoutes.
 * Le type 25 est le second rangement, inséré en 7 ; les types 7 à 20 avancent d’un cran.
 */
export function cscSheetNumber(typeNumber: number): number {
  if (typeNumber === 3) return 1
  if (typeNumber === 1) return 2
  if (typeNumber === 2) return 3
  if (typeNumber === 25) return 7
  if (typeNumber >= 7 && typeNumber <= 20) return typeNumber + 1
  return typeNumber
}

/** Plafond du champ Questions quand il compte des éléments d’un seul dessin. */
export function cscQuestionLimit(typeId: string): number | undefined {
  if (typeId === 'tcm-csc-ex03') return 12
  if (typeId === 'tcm-csc-ex14') return 6
  if (typeId === 'tcm-csc-ex15') return 5
  if (typeId === 'tcm-csc-ex17') return 9
  if (typeId === 'tcm-csc-ex19' || typeId === 'tcm-csc-ex20') return 15
  return undefined
}
const exercise = (number: number, label: string, instruction: string, columns = 1): ExerciseType => ({
  id: `tcm-csc-ex${String(number).padStart(2, '0')}`, topic: 'tcm-csc-test', label: `${cscSheetNumber(number)} — ${label}`,
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
  exercise(3, 'Entourer les nombres', 'Entourez les nombres que vous entendez.'),
  exercise(1, 'Nombres entendus', 'Écrivez le nombre que vous entendez.'),
  exercise(2, 'Calculs entendus', 'Écrivez le calcul et son résultat.'),
  exercise(4, 'Suites avec indication', 'Complétez les suites de nombres.'),
  exercise(5, 'Suites sans aide', 'Complétez les suites de nombres.'),
  exercise(6, 'Ranger du plus petit au plus grand', 'Écrivez les nombres du plus petit au plus grand.'),
  exercise(25, 'Ranger du plus grand au plus petit', 'Écrivez les nombres du plus grand au plus petit.'),
  exercise(7, 'Comparer de 0 à 100', 'Comparez les nombres et écrivez <, > ou =.', 2),
  exercise(8, 'Décomposer les nombres', 'Décomposez les nombres en centaines, dizaines et unités.\nExemple : 243 = 200 + 40 + 3'),
  exercise(9, 'Nommer les signes', 'Écrivez le nom de chaque signe.'),
  exercise(10, 'Additions et soustractions posées', 'Calculez les additions et les soustractions.', 2),
  exercise(11, 'Poser les opérations', 'Posez les nombres dans les grilles, puis calculez.', 2),
  exercise(12, 'Reproduire une figure', 'Reproduisez la même figure sur le quadrillage de droite.'),
  exercise(13, 'Agrandir une figure', 'Reproduisez la même figure sur le quadrillage de droite.\n1 carré à gauche = 2 carrés à droite.'),
  exercise(14, 'Comparer des longueurs', ''),
  exercise(15, 'Relier des points', 'Avec la règle, reliez les points.'),
  exercise(16, 'Suites graphiques', 'Cochez la forme qui continue la suite.'),
  exercise(17, 'Nommer les formes', 'Écrivez le nom de chaque forme géométrique.'),
  exercise(18, 'Compter les formes', ''),
  exercise(19, 'Lire les coordonnées', 'Écrivez les coordonnées de chaque forme.'),
  exercise(20, 'Placer les formes', 'Dessinez chaque forme à l’emplacement indiqué.'),
  // Exercice 21 réservé par le propriétaire ; il n’apparaît pas dans le test.
  exercise(22, 'Problème — crayons', 'Résolvez le problème.'),
  exercise(23, 'Problème — bus', 'Résolvez le problème.'),
  exercise(24, 'Problème — perles', 'Résolvez le problème.'),
]
