import { hash } from './convert'
import type { Game, Question, Round } from './types'

export function roundsFor(game: Game): Round[] {
  return (
    game.rounds ??
    game.questions.map((q) => ({
      id: q.id,
      questionIds: [q.id],
      audio: q.audio,
    }))
  )
}

export function questionsForRound(game: Game, index: number): Question[] {
  const ids = roundsFor(game)[index]?.questionIds ?? []
  return ids.flatMap((id) => {
    const q = game.questions.find((question) => question.id === id)
    return q ? [q] : []
  })
}

/** Select at most two source questions per recording, without changing the recipe.
 * With two questions, A–C belong to the first and D–F to the second.
 * A verified answer is always retained when reducing an existing bank to 3 choices.
 */
export function prepareGame(
  game: Game,
  selected = game.questions.map((q) => q.id),
): Game {
  const source = game.questions.filter((q) => selected.includes(q.id))
  const audioGroups = new Map<string, Question[]>()
  for (const q of source) {
    if (q.audio)
      audioGroups.set(q.audio, [...(audioGroups.get(q.audio) ?? []), q])
  }
  const keep = new Set<string>()
  const issues = [...game.issues]
  for (const group of audioGroups.values()) {
    const chosen = [...group]
      .sort(
        (a, b) =>
          hash(`${game.id}:${a.id}`) - hash(`${game.id}:${b.id}`) ||
          a.id.localeCompare(b.id),
      )
      .slice(0, 2)
    chosen.forEach((q) => keep.add(q.id))
    if (group.length > 2)
      issues.push({
        source: 'Document audio',
        reason: `2 questions retenues sur ${group.length} pour écouter ce document une seule fois. Vous pouvez modifier la sélection avant de commencer.`,
      })
  }
  const questions = source
    .filter((q) => !q.audio || keep.has(q.id))
    .map((q) => ({
      ...q,
      choices: q.choices.map((choice) => ({ ...choice })),
    }))
  const rounds: Round[] = []
  const used = new Set<string>()
  for (const q of questions) {
    if (used.has(q.id)) continue
    const peers = q.audio
      ? questions.filter((other) => other.audio === q.audio)
      : [q]
    // Open productions stay teacher-led; grouping never invents answer cards.
    const group =
      peers.length === 2 && peers.every((other) => other.mode === 'choice')
        ? peers
        : [q]
    if (group.length === 2) {
      for (const member of group) {
        if (member.choices.length <= 3) continue
        const correctId = game.corrections[member.id]?.choiceId
        const correct = member.choices.find((choice) => choice.id === correctId)
        if (!correct)
          throw new Error(
            'La réponse de cette question ne peut pas être vérifiée.',
          )
        const retained = new Set([
          correct.id,
          ...member.choices
            .filter((choice) => choice.id !== correctId)
            .sort(
              (a, b) =>
                hash(`${member.id}:${a.id}`) - hash(`${member.id}:${b.id}`),
            )
            .slice(0, 2)
            .map((choice) => choice.id),
        ])
        member.choices = member.choices.filter((choice) =>
          retained.has(choice.id),
        )
        issues.push({
          source: member.prompt,
          reason:
            'Trois choix de la fiche sont conservés pour partager les six cartes entre deux questions audio.',
        })
      }
    }
    group.forEach((member) => used.add(member.id))
    rounds.push({
      id: group.map((member) => member.id).join(':'),
      questionIds: group.map((member) => member.id),
      audio: q.audio,
    })
  }
  return {
    ...game,
    id: `${game.id}-plan2-${hash(JSON.stringify(rounds))}`,
    questions,
    corrections: Object.fromEntries(
      questions.map((q) => [q.id, game.corrections[q.id]!]),
    ),
    rounds,
    issues,
  }
}
