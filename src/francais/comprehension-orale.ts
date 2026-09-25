/** Règles et types pour la compréhension orale (audios + QCM). */
import type { Difficulty } from '@/math/types'
import type { ComprehensionLevel } from './comprehension-ecrite'
import { COMPREHENSION_ORALE_DOCS } from './comprehension-orale-banks'

export type OralAnswerMode = 'qcm' | 'text' | 'images'

export type FrOralChoice = {
  prompt: string
  options: string[]
  answer: string
  /** Chemins d’images pour le mode QCM images (3 choix). */
  optionImages?: string[]
  /** true si les 3 options ont une image résolue. */
  imagesAvailable?: boolean
}

export type ComprehensionOraleDoc = {
  id: string
  level: ComprehensionLevel
  themes: string[]
  title: string
  transcript: string
  audioSrc: string
  questions: FrOralChoice[]
}

export function comprehensionLevelFromDifficulty(difficulty: Difficulty | undefined): ComprehensionLevel {
  if (difficulty === 'facile') return 'a1'
  if (difficulty === 'avance') return 'b1'
  return 'a2'
}

export function oralDocsFor(topic: string, level: ComprehensionLevel): ComprehensionOraleDoc[] {
  const folder = topic.replace(/^fr-/, '')
  const atLevel = COMPREHENSION_ORALE_DOCS.filter(
    (doc) => doc.level === level && doc.themes.includes(topic),
  )
  // Préférer les audios dont le dossier correspond au thème (sauf description → presenter/couleurs)
  const folderMatch = atLevel.filter((doc) => {
    if (topic === 'fr-description') {
      return (
        doc.audioSrc.includes('/comprehension/presenter/') ||
        doc.audioSrc.includes('/comprehension/couleurs/')
      )
    }
    return doc.audioSrc.includes(`/comprehension/${folder}/`)
  })
  if (folderMatch.length > 0) return folderMatch
  if (atLevel.length > 0) return atLevel
  const sameTheme = COMPREHENSION_ORALE_DOCS.filter((doc) => doc.themes.includes(topic))
  if (sameTheme.length > 0) return sameTheme
  return COMPREHENSION_ORALE_DOCS.filter((doc) => doc.level === level)
}

export function cycleOralAnswerMode(
  current: OralAnswerMode,
  imagesAvailable: boolean,
): OralAnswerMode {
  if (current === 'qcm') return 'text'
  if (current === 'text') return imagesAvailable ? 'images' : 'qcm'
  return 'qcm'
}

export function oralAnswerModeLabel(mode: OralAnswerMode): string {
  if (mode === 'text') return 'Texte'
  if (mode === 'images') return 'Images'
  return 'QCM'
}
