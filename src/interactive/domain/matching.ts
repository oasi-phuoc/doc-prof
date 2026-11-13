import type { Game, Question, Session } from './types'

export const matchingTextKey = (text: string) => text.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr')

/** Keep the planned slots intact. Only already revealed pairs become unavailable;
 * a skipped question or a different group never consumes a word. */
export function usedMatchingChoices(game: Game, state: Session, question: Question): string[] {
  if (!question.matchingGroup) return []
  const completed = new Set(state.history.filter(attempt => !attempt.skipped).map(attempt => attempt.questionId))
  const used = new Set(game.questions.filter(other => other.id !== question.id &&
    other.matchingGroup?.groupId === question.matchingGroup?.groupId && completed.has(other.id))
    .map(other => game.corrections[other.id]?.choiceId).filter(Boolean))
  const currentKey = game.corrections[question.id]?.choiceId
  return question.choices.filter(choice => choice.id !== currentKey && used.has(choice.id)).map(choice => choice.id)
}

export function matchingSummary(game: Game, state: Session) {
  const groups = new Map<string, { groupId: string; number: number; total: number; title: string; size: number; completed: number; correct: number }>()
  for (const question of game.questions) {
    if (!question.matchingGroup) continue
    const group = groups.get(question.matchingGroup.groupId) ?? { ...question.matchingGroup, title: question.title, size: 0, completed: 0, correct: 0 }
    const attempt = state.history.find(attempt => attempt.questionId === question.id)
    group.size++
    if (attempt && !attempt.skipped) {
      group.completed++
      if (state.mode === 'solo' && attempt.correct) group.correct++
    }
    groups.set(group.groupId, group)
  }
  return [...groups.values()]
}
