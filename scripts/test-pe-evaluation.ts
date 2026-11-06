import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { peEvaluation, peEvaluationsOf } from '../src/tcf/pe-evaluation.ts'
import type { TcfPeExercise } from '../src/tcf/types.ts'
import type { WorksheetPage } from '../src/math/types.ts'

const exercises: TcfPeExercise[] = ['a0-a1', 'a1-a2', 'a2-b1'].flatMap((level) =>
  JSON.parse(readFileSync(new URL(`../src/tcf/content/${level}/pe.json`, import.meta.url), 'utf8')),
)

test('barèmes de référence Ex1, Ex2 et Ex3', () => {
  for (const [type, total, maxima] of [
    ['formulaire', 5, [1, 1, 1, 0.5, 0.5, 1]],
    ['question_texte', 10, [3, 2, 1, 2, 2]],
    ['sms_reponse', 10, [3, 1, 2, 2, 1, 1]],
  ] as const) {
    const exercise = exercises.find((ex) => ex.type_exercice === type)!
    assert.deepEqual(peEvaluation(exercise, total).criteria.map((c) => c.levels[0].points), [...maxima])
  }
})

test('toute la banque respecte le total personnalisé et des niveaux décroissants', () => {
  assert(exercises.length > 0)
  for (const ex of exercises) for (const total of [0, 5, 10, 13, 7.25]) {
    const grid = peEvaluation(ex, total)
    assert.equal(Math.round(grid.criteria.reduce((sum, c) => sum + c.levels[0].points, 0) * 100), total * 100, ex.id)
    for (const c of grid.criteria) {
      assert.equal(c.levels.at(-1)!.points, 0)
      for (let i = 1; i < c.levels.length; i++) assert(c.levels[i - 1].points >= c.levels[i].points)
    }
  }
})

test('la grille suit son item final, sans doublon entre items et blocs', () => {
  const evaluation = peEvaluation(exercises[0], 10)
  const page = { items: [{ tcfPeEvaluation: evaluation }], blocks: [
    { exerciseIndex: 7, items: [{ tcfPeEvaluation: evaluation }] },
  ] } as WorksheetPage
  const grids = peEvaluationsOf(page)
  assert.equal(grids.length, 1)
  assert.match(grids[0].title, /^Exercice 7 — /)
  assert.deepEqual(peEvaluationsOf(undefined), [])
  assert.deepEqual(peEvaluationsOf({ items: [], blocks: [] } as unknown as WorksheetPage), [])
})
