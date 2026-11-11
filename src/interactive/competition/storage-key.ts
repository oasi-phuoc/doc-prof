export const localCompetitionKey = (quizId: string) => `clairfle.competition.local.${quizId}`

export function hasLocalCompetition(quizId: string): boolean {
  try { return sessionStorage.getItem(localCompetitionKey(quizId)) !== null }
  catch { return false }
}
