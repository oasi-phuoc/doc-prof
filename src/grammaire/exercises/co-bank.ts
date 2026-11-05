import rawBank from './co-bank.json'
import { GRAMMAR_CO_THEMES, grammarCoThemeForType, type GrammarCoLevel, type GrammarCoThemeId } from './co-themes'
import type { TcfCoComplet } from '@/tcf/types'

export type GrammarCoEntry = {
  theme: GrammarCoThemeId
  level: GrammarCoLevel
  audioChecked: boolean
  status: 'audio-only' | 'transcribed' | 'complete'
  transcriptionReview?: { status: 'automatic_cross_check_and_text_review'; sourceSha256: string; reading: 'parakeet' | 'whisper_fr' | 'editorial'; humanListening: false }
  source: { uploadId: string; filename: string; sha256: string; start: number; end: number }
  exercise: TcfCoComplet
}
export const GRAMMAR_CO_BANK = rawBank as GrammarCoEntry[]
export function grammarCoEntries(theme: GrammarCoThemeId, level: GrammarCoLevel, bank: readonly GrammarCoEntry[] = GRAMMAR_CO_BANK) {
  return bank.filter(entry=>{
    const audio=entry.exercise.support.audio||entry.exercise.support.audios?.[0]
    return entry.theme===theme&&entry.level===level&&entry.audioChecked&&entry.source.end>entry.source.start&&Boolean(audio)
  })
}
export function hasGrammarCoTheme(theme: GrammarCoThemeId): boolean {
  return grammarCoEntries(theme,'A1').length>0||grammarCoEntries(theme,'A2').length>0
}
export function defaultGrammarCoLevel(theme: GrammarCoThemeId, bank: readonly GrammarCoEntry[] = GRAMMAR_CO_BANK): GrammarCoLevel {
  return grammarCoEntries(theme,'A1',bank).length>0 ? 'A1' : grammarCoEntries(theme,'A2',bank).length>0 ? 'A2' : 'A1'
}
/** Audio-only lots are available immediately; transcripts/questions may be added later. */
export function grammarCoSubthemes() {
  return GRAMMAR_CO_THEMES.filter(theme=>!('existing' in theme)&&hasGrammarCoTheme(theme.id)).map(theme=>({
    id:theme.subId,label:theme.label,topic:theme.topic,theoryTypeIds:[] as string[],
  }))
}
export function isAudioOnlyGrammarCo(typeId: string, level?: GrammarCoLevel, audioId?: string): boolean {
  const theme=grammarCoThemeForType(typeId)
  if (!theme) return false
  const entries=grammarCoEntries(theme.id,level??defaultGrammarCoLevel(theme.id))
  const entry=entries.find(item=>item.exercise.id===audioId)??entries[0]
  return entry?.exercise.questions.length===0
}
