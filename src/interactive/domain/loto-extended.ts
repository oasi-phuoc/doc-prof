import { createRng, shuffle } from '@/math/rng'
import { matchingTextKey } from './matching'
import { deriveSeed, hash } from './seeds'
import { positionOf } from './source-position'
import type { Choice, Game, LotoBoardData, LotoGoal, Question } from './types'

const MAX_BOARD_SIZE = 25
const MAX_WORD_LENGTH = 24
const deckKey = ({ source }: Question) => `${source.page}:${source.block}:${source.item}`

function verifiedPair(question: Question, game: Game) {
  const choice = question.choices.find(item => item.id === game.corrections[question.id]?.choiceId)
  if (question.mode !== 'choice' || !question.matchingGroup || question.audio || question.images.length !== 1 ||
      !question.images[0]?.trim() || !choice || !choice.text.trim() || choice.text.length > MAX_WORD_LENGTH || choice.image || choice.audio) return undefined
  return { question, word: { id: choice.id, text: choice.text } }
}

/** A separate grid preserves all verified images and words, even when each draw uses only three cards. */
export function extendedLotoGame(game: Game, goal: LotoGoal, maxChoices: number): Game {
  const decks = new Map<string, Question[]>()
  for (const question of game.questions) {
    if (question.source.exerciseType !== 'jeux-loto') continue
    const key = deckKey(question)
    const deck = decks.get(key) ?? []
    deck.push(question)
    decks.set(key, deck)
  }
  const issues = [...game.issues]
  const replacements = new Map<string, Question>()
  const originalSeed = game.seed ?? hash(game.id)
  for (const [key, source] of decks) {
    const ordered = [...source].sort((a, b) => a.source.part - b.source.part)
    const pairs = ordered.flatMap(question => verifiedPair(question, game) ?? [])
    if (pairs.length < 2 || pairs.length !== source.length || new Set(ordered.map(positionOf)).size !== pairs.length ||
        new Set(ordered.map(q => q.images[0])).size !== pairs.length || new Set(pairs.map(pair => pair.word.id)).size !== pairs.length ||
        new Set(pairs.map(pair => matchingTextKey(pair.word.text))).size !== pairs.length) {
      issues.push({ source: ordered[0]!.title, reason: 'Loto en grande grille : vérifiez que chaque mot et chaque image forment une paire distincte. Les questions source sont conservées.' })
      continue
    }
    const total = Math.ceil(pairs.length / MAX_BOARD_SIZE)
    const draws: Question[] = []
    for (let start = 0, number = 1; start < pairs.length; number++) {
      // Leave a playable last board, including for a bank of 26 or 51 words.
      const size = pairs.length - start === MAX_BOARD_SIZE + 1 ? MAX_BOARD_SIZE - 1 : MAX_BOARD_SIZE
      const members = pairs.slice(start, start + size)
      start += members.length
      const groupId = `loto-extended:${key}:${number}`
      const rng = createRng(deriveSeed({ originalSeed, sourceKey: groupId, purpose: 'order' }))
      const cells = shuffle(rng, members.map(pair => pair.word))
      const columns: LotoBoardData['columns'] = cells.length <= 4 ? 2 : cells.length <= 9 ? 3 : cells.length <= 16 ? 4 : 5
      const board: LotoBoardData = { groupId, number, total, columns, goal, layout: 'extended', sourceKeys: members.map(pair => positionOf(pair.question)), cells }
      for (const { question, word } of shuffle(rng, members)) {
        const options = createRng(deriveSeed({ originalSeed, sourceKey: question.id, purpose: 'distractors' }))
        const distractors = shuffle(options, cells.filter(cell => cell.id !== word.id)).slice(0, maxChoices - 1)
        const choices: Choice[] = shuffle(options, [word, ...distractors]).map(cell => ({ ...cell }))
        const draw: Question = { ...question, prompt: 'Retrouvez le mot.', instruction: 'Retrouvez le mot de l’image pour cocher sa case dans la grille.', choices, choiceOrderPolicy: 'fixed', lotoBoard: board }
        delete draw.matchingGroup
        draws.push(draw)
      }
    }
    source.forEach((question, index) => replacements.set(question.id, draws[index]!))
  }
  if (!replacements.size) return issues.length === game.issues.length ? game : { ...game, issues }
  return { ...game, questions: game.questions.map(question => replacements.get(question.id) ?? question), issues, ...(game.rounds ? { rounds: undefined } : {}) }
}
