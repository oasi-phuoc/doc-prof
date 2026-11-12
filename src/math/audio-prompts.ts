import type { WorksheetBlock } from './types'
import { cscAudioPrompts } from '@/tcm-csc/audio'

export const hasMathAudioPrompts = (type: string) => /^tcm-csc-ex0[123]$/.test(type) || /^tcm-cfr-ex0[12]$/.test(type)
export function mathAudioPrompts(block: Pick<WorksheetBlock,'exerciseType'|'items'>): string[][] | undefined {
  const csc=cscAudioPrompts(block.exerciseType,block.items)
  if (csc) return csc
  if (/^tcm-cfr-ex0[12]$/.test(block.exerciseType)) return block.items.map(item=>item.audioParts ?? (item.audioSrc?[item.audioSrc]:[])).filter(parts=>parts.length)
  return undefined
}
