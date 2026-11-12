import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

const server = await createServer({ cacheDir: '/tmp/clairfle-csc-game-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { verifiedCscMath } = await server.ssrLoadModule('/src/interactive/domain/csc-math.ts')
  const { convertRecipe } = await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { demoRecipe } = await server.ssrLoadModule('/src/interactive/demo.ts')
  const { generateCscExercise } = await server.ssrLoadModule('/src/tcm-csc/items.ts')
  const { CSC_PROBLEM_BANK, buildCscProblem } = await server.ssrLoadModule('/src/tcm-csc/problems.ts')
  const { startSession, transition } = await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const { buildTcmCscTestPages } = await server.ssrLoadModule('/src/tcm-csc/test.ts')
  const { createGameSource, renewGameSource } = await server.ssrLoadModule('/src/interactive/game-run.ts')
  const base = demoRecipe()
  function game(items, seed = 42) { return convertRecipe({ ...base, seed, pages: [{ ...base.pages[0], domain: 'tcm-csc', topic: 'tcm-csc-test', exerciseType: 'tcm-csc-ex22', count: items.length, extraBlocks: undefined, libreItems: items }] }) }
  function problemItem(id, a, b) { const p = buildCscProblem(id, a, b); return { layout: 'algebra', prompt: p.statement, answer: p.answer, cscTask: { kind: 'problem', templateId: id, a, b } } }
  function legacyOperators(seed) { return Array.from({length:6},(_,index)=>{const operation=index%2?'−':'+',blank=index%3===2?'equals':'operator';return {layout:'csc-task',answer:blank==='equals'?'=':operation,cscTask:{kind:'operator',a:20+seed%50,b:7,operation,blank}}}) }

  await test('real CSC generator problems remain playable across 100 seeds', () => {
    for (let seed = 1; seed <= 100; seed++) for (const number of [22, 23, 24]) {
      const items = generateCscExercise(`tcm-csc-ex${number}`, 1, seed), converted = game(items, seed)
      assert.equal(converted.questions.length, 1)
      assert.deepEqual(converted.issues, [])
      assert.equal(converted.corrections[converted.questions[0].id].text, items[0].answer)
    }
  })

  await test('legacy saved CSC operators retain exactly one correct source sign over 100 seeds', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const items = legacyOperators(seed), converted = game(items, seed)
      assert.equal(converted.questions.length, 6); assert.deepEqual(converted.issues, [])
      for (const [index, question] of converted.questions.entries()) {
        const answer = converted.corrections[question.id]
        assert.equal(question.choices.length, 3)
        assert.deepEqual(question.choices.map((choice) => choice.text), ['+', '−', '='])
        assert.equal(question.choices.find((choice) => choice.id === answer.choiceId).text, items[index].answer)
        assert.match(question.prompt, /□/)
        assert.equal(question.compatibility, 'auto')
        assert.equal('correct' in question, false)
      }
    }
  })
  await test('all 103 CSC contexts keep their statement and verified result with unique numeric cards', () => {
    for (const entry of CSC_PROBLEM_BANK) for (const [a, b] of [[98, 54], [1, 1], [21, 1], [999, 999]]) {
      const item = problemItem(entry.id, a, b), before = structuredClone(item), converted = game([item])
      assert.equal(converted.questions.length, 1); assert.deepEqual(converted.issues, [])
      const question = converted.questions[0], correct = converted.corrections[question.id]
      const result = entry.operation === '+' ? a + b : a - b
      assert.equal(question.choices.find((choice) => choice.id === correct.choiceId).text, result.toLocaleString('fr-CH'))
      assert.equal(new Set(question.choices.map((choice) => choice.text)).size, question.choices.length)
      assert.ok(question.choices.length >= 2 && question.choices.length <= 6)
      assert.equal(`${question.context}\n\n${question.prompt}`, item.prompt)
      assert.equal(correct.text, item.answer)
      assert.equal(question.compatibility, 'assisted')
      assert.deepEqual(item, before)
    }
  })
  await test('CSC distractors are deterministic, vary with the seed and never alter the problem context', () => {
    const source = [problemItem('crayons-nadia-julie', 12, 24)]
    assert.deepEqual(game(source, 42), game(source, 42))
    const variants = Array.from({ length: 12 }, (_, index) => game(source, index + 1).questions[0])
    assert.equal(new Set(variants.map((question) => question.context)).size, 1)
    assert.ok(new Set(variants.map((question) => JSON.stringify(question.choices))).size > 1)
  })
  await test('relaunching a saved CSC recipe changes its numbers while preserving all three source contexts and the template', () => {
    const recipe = { ...base, pages: buildTcmCscTestPages().filter(page=>[page,...(page.extraBlocks??[])].some(block=>/^tcm-csc-ex(?:22|23|24)$/.test(block.exerciseType))), libreMode: false, libreSnapshot: null }, original = structuredClone(recipe)
    let source = createGameSource({ recipe, name: 'Problèmes CSC' }, 'saved', 'csc-template')
    const statements = new Set()
    for (let run = 0; run < 8; run++) {
      const converted = convertRecipe(source.recipe)
      assert.equal(converted.questions.length, 3); assert.deepEqual(converted.issues, [])
      assert.match(converted.questions[0].context, /Nadia et Julie/)
      assert.match(converted.questions[1].context, /Martigny/)
      assert.match(converted.questions[2].context, /Patricia/)
      statements.add(JSON.stringify(converted.questions.map((question) => question.context)))
      source = renewGameSource(source, null)
    }
    assert.ok(statements.size > 1)
    assert.deepEqual(recipe, original)
  })
  await test('stale answers, changed problem text, unknown templates and invalid operands cannot invent a CSC verdict', () => {
    const item = problemItem('crayons-nadia-julie', 12, 24)
    for (const broken of [
      { ...item, answer: '37 crayons' }, { ...item, prompt: item.prompt.replace('12', '13') },
      { ...item, cscTask: { ...item.cscTask, templateId: 'missing' } },
      { ...item, cscTask: { ...item.cscTask, a: -1 } },
      { ...item, libreError: 'Non validé' },
    ]) { const rejected = game([broken]); assert.equal(rejected.questions.length, 0); assert.ok(rejected.issues.length > 0) }
  })
  await test('ambiguous zero operators, corrupt signs and impossible sums are reported instead of auto-graded', () => {
    const item = legacyOperators(42).find((entry) => entry.cscTask.blank === 'operator')
    for (const broken of [
      { ...item, answer: '+' , cscTask: { ...item.cscTask, a: 3, b: 0, operation: '+' } },
      { ...item, cscTask: { ...item.cscTask, operation: '×' } },
      { ...item, cscTask: { ...item.cscTask, blank: 'missing' } },
      { ...item, answer: '+', cscTask: { ...item.cscTask, a: 99, b: 99, operation: '+' } },
      { ...item, answer: 'incorrect' },
    ]) { const rejected = game([broken]); assert.equal(rejected.questions.length, 0); assert.ok(rejected.issues.length > 0) }
    assert.equal(verifiedCscMath({ layout: 'text', answer: 'unverified' }), undefined)
  })
  await test('Solo grades a CSC choice and timeout using the same verified correction', () => {
    const converted = game([problemItem('soustraction-01', 98, 54)]), question = converted.questions[0]
    const correctId = converted.corrections[question.id].choiceId
    const answered = transition(converted, startSession(converted, 'solo'), { type: 'SELECT', choiceId: correctId })
    assert.equal(answered.phase, 'revealed'); assert.equal(answered.history[0].correct, true)
    const timeout = transition(converted, startSession(converted, 'solo'), { type: 'TIMEOUT' })
    assert.equal(timeout.phase, 'revealed'); assert.equal(timeout.history[0].correct, false)
  })
} finally { await server.close() }
