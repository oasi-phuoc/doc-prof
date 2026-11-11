import { createRng, shuffle } from '@/math/rng'
import { deriveSeed, hash } from './seeds'
import type { ChoiceOrderPolicy, Game, Question } from './types'

const normalized = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/[.!?]+$/, '').replace(/\s+/g, ' ')
const aggregates = new Set(['aucune de ces reponses', 'aucune des reponses', 'aucune reponse', 'toutes les reponses', 'toutes ces reponses', 'les deux', 'les deux reponses'])
const isAggregate = (text: string) => aggregates.has(normalized(text))
const isTrueFalse = (q: Question) => q.choices.length === 2 && q.choices.some((choice) => normalized(choice.text) === 'vrai') && q.choices.some((choice) => normalized(choice.text) === 'faux')
function referencesLetters(q: Question): boolean {
  const content = [q.prompt, ...q.choices.map((choice) => choice.text)].join('\n')
  return /\b(?:r[ée]ponses?|choix|options?|propositions?|cartes?)\s+[A-F]\b/i.test(content) || /\b[A-F]\s+(?:et|ou)\s+[A-F]\b/.test(content) || q.choices.some((choice) => /^\s*[A-F][.)]\s/.test(choice.text))
}
export function choiceOrderPolicy(q: Question): ChoiceOrderPolicy {
  if (isTrueFalse(q) || referencesLetters(q)) return 'fixed'
  if (q.choiceOrderPolicy) return q.choiceOrderPolicy
  const pinned = q.choices.filter((choice) => isAggregate(choice.text)).length
  return pinned === 1 ? 'pin-last' : pinned > 1 ? 'fixed' : 'shuffle'
}

type Group = { total: number; used: number; counts: number[]; floor: number; ceiling: number }

/** Balanced quotas with seeded tie-breaking. Backtracking resolves conflicts
 * between interleaved choice counts without changing any group's quotas.
 * The iterative search also handles large series without recursive stack use.
 */
function balancedTargets(questions: Question[], seed: number): number[] {
  const groups = new Map<number, Group>()
  for (const q of questions) {
    const n = q.choices.length
    const group = groups.get(n) ?? { total: 0, used: 0, counts: Array<number>(n).fill(0), floor: 0, ceiling: 0 }
    group.total++
    groups.set(n, group)
  }
  for (const [n, group] of groups) { group.floor = Math.floor(group.total / n); group.ceiling = Math.ceil(group.total / n) }
  const ranks = questions.map((q) => shuffle(createRng(deriveSeed({ originalSeed: seed, sourceKey: q.id, purpose: 'order' })), q.choices.map((_, i) => i)))
  const targets: number[] = []
  const stack: ({ candidates: number[]; next: number } | undefined)[] = []
  let index = 0
  let steps = 0
  while (index < questions.length) {
    if (++steps > Math.max(100_000, questions.length * 100)) throw new Error('L’équilibrage des cartes dépasse la limite de préparation.')
    const q = questions[index]!
    const group = groups.get(q.choices.length)!
    if (!stack[index]) {
      const candidates = ranks[index]!.filter((position) => {
        if (group.counts[position]! >= group.ceiling || index >= 2 && targets[index - 1] === position && targets[index - 2] === position) return false
        const deficit = group.counts.reduce((sum, count, slot) => sum + Math.max(0, group.floor - count - (slot === position ? 1 : 0)), 0)
        return deficit <= group.total - group.used - 1
      }).sort((a, b) => group.counts[a]! - group.counts[b]!)
      stack[index] = { candidates, next: 0 }
    }
    const current = stack[index]!
    const position = current.candidates[current.next++]
    if (position === undefined) {
      stack[index] = undefined
      if (--index < 0) throw new Error('Aucune répartition équilibrée des cartes n’est possible.')
      const previous = groups.get(questions[index]!.choices.length)!
      const previousPosition = targets[index]!
      previous.counts[previousPosition] = previous.counts[previousPosition]! - 1
      previous.used--
      continue
    }
    targets[index] = position
    group.counts[position] = group.counts[position]! + 1
    group.used++
    index++
    stack[index] = undefined
  }
  return targets
}

/** Keep choices and their stable IDs together; the answer key is never changed. */
export function assignChoicePositions(game: Game, source: Question[]): Question[] {
  const seed = game.seed ?? hash(game.id)
  const policies = source.map(choiceOrderPolicy)
  const shuffled = source.filter((q, index) => q.mode === 'choice' && policies[index] === 'shuffle')
  for (const q of source.filter((question) => question.mode === 'choice')) {
    if (q.choices.length < 2 || q.choices.length > 6 || !q.choices.some((choice) => choice.id === game.corrections[q.id]?.choiceId)) throw new Error('Les cartes de cette question ne peuvent pas être vérifiées.')
  }
  const targets = balancedTargets(shuffled, seed)
  let next = 0
  return source.map((q, index) => {
    if (q.mode !== 'choice') return q
    const policy = policies[index]!
    const rng = createRng(deriveSeed({ originalSeed: seed, sourceKey: q.id, purpose: 'slots' }))
    let choices = [...q.choices]
    if (isTrueFalse(q)) choices.sort((a, b) => Number(normalized(b.text) === 'vrai') - Number(normalized(a.text) === 'vrai'))
    else if (policy === 'shuffle') {
      const correct = choices.find((choice) => choice.id === game.corrections[q.id]!.choiceId)!
      const others = shuffle(rng, choices.filter((choice) => choice !== correct))
      others.splice(targets[next++]!, 0, correct)
      choices = others
    } else if (policy === 'pin-last') choices = [...shuffle(rng, choices.filter((choice) => !isAggregate(choice.text))), ...choices.filter((choice) => isAggregate(choice.text))]
    else if (policy === 'ascending') {
      if (choices.some((choice) => !/^n-?\d+$/.test(choice.id))) throw new Error('Le tri croissant nécessite des choix numériques vérifiés.')
      choices.sort((a, b) => BigInt(a.id.slice(1)) < BigInt(b.id.slice(1)) ? -1 : BigInt(a.id.slice(1)) > BigInt(b.id.slice(1)) ? 1 : 0)
    }
    return { ...q, choices, choiceOrderPolicy: isTrueFalse(q) ? 'fixed' : policy, ...(referencesLetters(q) ? { compatibility: 'assisted' as const } : {}) }
  })
}
