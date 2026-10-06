import type { TcfNiveau } from './types'

/** Test blanc complet : suite ordonnée d’exercices de la banque (ids). */
export type TcfSerie = {
  id: string
  label: string
  niveau: TcfNiveau
  exercices: readonly string[]
}

export const TCF_SERIES: readonly TcfSerie[] = [
  {
    id: 'a1j-serie-1',
    label: 'Test blanc A1 Junior · série 1',
    niveau: 'A0-A1',
    exercices: [
      'tcf-a1j-s1-co-1',
      'tcf-a1j-s1-co-2',
      'tcf-a1j-s1-co-3',
      'tcf-a1j-s1-co-4',
      'tcf-a1j-s1-ce-1',
      'tcf-a1j-s1-ce-2',
      'tcf-a1j-s1-ce-3',
      'tcf-a1j-s1-ce-4',
      'tcf-a1j-s1-pe-1',
      'tcf-a1j-s1-pe-2',
      'tcf-a1j-s1-po-1',
      'tcf-a1j-s1-po-2',
      'tcf-a1j-s1-po-3',
    ],
  },
  {
    id: 'a1j-serie-2',
    label: 'Test blanc A1 Junior · série 2',
    niveau: 'A0-A1',
    exercices: [
      'tcf-a1j-s2-co-1',
      'tcf-a1j-s2-co-2',
      'tcf-a1j-s2-co-3',
      'tcf-a1j-s2-co-4',
      'tcf-a1j-s2-co-5',
      'tcf-a1j-s2-ce-1',
      'tcf-a1j-s2-ce-2',
      'tcf-a1j-s2-ce-3',
      'tcf-a1j-s2-ce-4',
      'tcf-a1j-s2-pe-1',
      'tcf-a1j-s2-pe-2',
      'tcf-a1j-s2-po-1',
      'tcf-a1j-s2-po-2',
      'tcf-a1j-s2-po-3',
    ],
  },
  {
    id: 'a1j-serie-3',
    label: 'Test blanc A1 Junior · série 3',
    niveau: 'A0-A1',
    exercices: [
      'tcf-a1j-s3-co-1',
      'tcf-a1j-s3-co-2',
      'tcf-a1j-s3-co-3',
      'tcf-a1j-s3-co-4',
      'tcf-a1j-s3-co-5',
      'tcf-a1j-s3-ce-1',
      'tcf-a1j-s3-ce-2',
      'tcf-a1j-s3-ce-3',
      'tcf-a1j-s3-ce-4',
      'tcf-a1j-s3-pe-1',
      'tcf-a1j-s3-pe-2',
      'tcf-a1j-s3-po-1',
      'tcf-a1j-s3-po-2',
      'tcf-a1j-s3-po-3',
    ],
  },
]
