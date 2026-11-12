import type { Figure } from '@/math/types'

export type CscTask =
  | { kind: 'calculation-audio'; a: number; b: number; operation: '+' | '−' }
  | { kind: 'number-grid'; numbers: number[]; heard: number[] }
  | { kind: 'operator'; a: number; b: number; operation: '+' | '−'; blank: 'operator' | 'equals' }
  | { kind: 'sign-name'; symbol: '+' | '−' | '=' }
  | { kind: 'sequence-hint'; step: number }
  | { kind: 'copy'; scale: 1 | 2 }
  | { kind: 'length-table' }
  | { kind: 'connect-points'; points: { label: string; x: number; y: number }[] }
  | { kind: 'shape-names'; figures: Figure[] }
  | { kind: 'large-count' }
  | { kind: 'coordinates-left' }
  | { kind: 'problem'; templateId: string; a: number; b: number }
