import assert from 'node:assert/strict'
import { test } from 'node:test'
import { updateInlineCalculation as update } from '../../src/components/generator/libre/arithmetic.ts'

for (const [op, [a, b, result], [nextA, nextResult]] of [
  ['+', [12, 3, 15], [21, 24]], ['−', [12, 3, 9], [21, 18]],
  ['×', [12, 3, 36], [21, 63]], ['÷', [12, 3, 4], [21, 7]],
]) {
  test(`calcul direct et réciproque pour ${op}`, () => {
    assert.equal(update({ a, b, result, op, missing: 'result' }, { a: nextA }).calculation.result, nextResult)
    assert.equal(update({ a, b, result, op, missing: 'a' }, { result: nextResult }).calculation.a, nextA)
    assert.equal(update({ a, b, result, op, missing: 'b' }, { a: nextA, result: nextResult }).calculation.b, b)
  })
}

test('les opérations non définies ou sans résultat entier sont rejetées', () => {
  const division = { a: 12, b: 3, result: 4, op: '÷', missing: 'result' }
  assert.match(update(division, { b: 0 }).error, /zéro/)
  assert.match(update(division, { a: 13 }).error, /entiers/)
  assert.match(update(division, { missing: 'b', result: 0 }).error, /quotient nul/)
  assert.match(update({ a: 0, b: 3, result: 0, op: '×', missing: 'result' }, { missing: 'b' }).error, /facteur nul/)
})
