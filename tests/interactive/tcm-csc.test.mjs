import assert from 'node:assert/strict'
import { test } from 'node:test'
import { access } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { buildTcmCscTestPages, TCM_CSC_STEPS, TCM_CSC_MAX_SCORE } = await server.ssrLoadModule('/src/tcm-csc/test.ts')
  const { generateCscExercise } = await server.ssrLoadModule('/src/tcm-csc/items.ts')
  const { CSC_PROBLEM_BANK, CSC_DEFAULT_PROBLEMS, buildCscProblem, rollCscProblem } = await server.ssrLoadModule('/src/tcm-csc/problems.ts')
  const { recalculateCsc } = await server.ssrLoadModule('/src/tcm-csc/recalculate.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { logiqueBankOptions, logiqueItemById } = await server.ssrLoadModule('/src/logique/generate.ts')
  const { cscAudioGroups } = await server.ssrLoadModule('/src/tcm-csc/audio.ts')
  const samples = Array.from({ length: 100 }, (_, seed) => new Map(TCM_CSC_STEPS.map((step) => [step.number, generateCscExercise(`tcm-csc-ex${String(step.number).padStart(2, '0')}`, step.count, seed + 1)])))
  await test('CSC test contains the 23 requested exercises and preserves the reserved number 21', () => {
    const pages = buildTcmCscTestPages(), blocks = pages.flatMap((page) => [page, ...(page.extraBlocks ?? [])])
    assert.equal(blocks[0].exerciseType, 'tcm-csc-consignes')
    assert.deepEqual(blocks.slice(1).map((block) => block.exerciseNo), [...Array.from({ length: 20 }, (_, i) => i + 1), 22, 23, 24])
    assert.equal(blocks.filter((block) => block.exerciseNo === 21).length, 0)
    assert.equal(blocks.slice(1).reduce((sum, block) => sum + block.count * block.pointsPerQuestion, 0), TCM_CSC_MAX_SCORE)
    for (const sample of samples) for (const step of TCM_CSC_STEPS) assert.equal(sample.get(step.number).length, step.count)
  })
  await test('five numbers and five spoken calculations stay within CSC bounds across 100 seeds', async () => {
    const assets = new Set()
    for (const sample of samples) {
      const numbers = sample.get(1)
      assert.equal(new Set(numbers.map((item) => item.answer)).size, 5)
      for (const item of numbers) { assert.ok(Number(item.answer) >= 1 && Number(item.answer) <= 100); assert.equal(item.audioParts[0], `/lib/audio/nombre/${item.answer}.mp3`); assets.add(item.audioParts[0]) }
      for (const item of sample.get(2)) {
        const { a, b, operation } = item.cscTask
        assert.equal(Number(item.answer), operation === '+' ? a + b : a - b)
        assert.ok(Number(item.answer) >= 0 && Number(item.answer) <= 100)
        assert.ok(item.audioParts.includes(operation === '+' ? '/lib/audio/nombre/plus.mp3' : '/lib/audio/nombre/moins.mp3'))
        item.audioParts.forEach((src) => assets.add(src))
      }
    }
    for (const src of assets) await access(`public${src}`)
  })
  await test('the listening grid keeps thirty distinct numbers and five audible targets, including an editable zero', async () => {
    for (const sample of samples) {
      const item = sample.get(3)[0], { numbers, heard } = item.cscTask
      assert.equal(numbers.length, 30); assert.equal(new Set(numbers).size, 30)
      assert.ok(numbers.every((n) => Number.isInteger(n) && n >= 0 && n <= 100))
      assert.equal(new Set(heard).size, 5); assert.ok(heard.every((n) => numbers.includes(n)))
      assert.equal(item.audioParts.filter((src) => src.endsWith('silence-6s.mp3')).length, 4)
    }
    const item = structuredClone(samples[0].get(3)[0]); item.cscTask.numbers = Array.from({ length: 30 }, (_, i) => i); item.cscTask.heard = [0, 1, 2, 3, 4]
    const zero = recalculateCsc(item, 'tcm-csc-ex03')
    assert.equal(zero.libreError, undefined); assert.ok(zero.audioParts.includes('/lib/audio/vocabulaire/objets/zéro.mp3'))
    await access('public/lib/audio/vocabulaire/objets/zéro.mp3')
  })
  await test('both sequence exercises contain five regular integer terms between zero and one hundred', () => {
    for (const sample of samples) for (const exercise of [4, 5]) for (const item of sample.get(exercise)) {
      const values = item.sequence.map(Number), step = values[1] - values[0]
      assert.ok(values.every((n, i) => Number.isInteger(n) && n >= 0 && n <= 100 && (i === 0 || n - values[i - 1] === step)))
      assert.ok(step !== 0); assert.equal(item.blankIndexes.length, 2)
      assert.equal(item.answer, item.blankIndexes.map((i) => item.sequence[i]).join(' ; '))
      assert.equal(Boolean(item.prompt), exercise === 4)
    }
  })
  await test('sorting contains integers only and comparisons contain exactly two of each sign', () => {
    for (const sample of samples) {
      for (const item of sample.get(6)) {
        assert.equal(new Set(item.sequence).size, 7)
        assert.ok(item.sequence.every((value) => /^\d+$/.test(value) && Number(value) <= 100))
        const sorted = item.sequence.map(Number).sort((a, b) => item.orderOp === '<' ? a - b : b - a)
        assert.equal(item.answer, sorted.join(` ${item.orderOp} `))
      }
      for (const exercise of [7, 8]) {
        const items = sample.get(exercise)
        for (const sign of ['<', '=', '>']) assert.equal(items.filter((item) => item.answer === sign).length, 2)
        for (const item of items) {
          const a = Number(item.left), b = Number(item.right)
          assert.ok([a, b].every((n) => Number.isInteger(n) && n >= 0 && n <= (exercise === 7 ? 100 : 999)))
          assert.equal(item.answer, a === b ? '=' : a < b ? '<' : '>')
        }
      }
      assert.deepEqual(sample.get(9).map((item) => item.answer).sort(), ['+', '+', '=', '=', '−', '−'].sort())
    }
  })
  await test('posed columns preserve left additions, right subtractions and the requested digit progression', () => {
    for (const sample of samples) for (const exercise of [10, 11]) sample.get(exercise).forEach((item, i) => {
      assert.equal(item.op, i % 2 ? '−' : '+')
      assert.equal(Number(item.answer), item.op === '+' ? item.a + item.b : item.a - item.b)
      assert.ok([item.a, item.b].every((n) => Number.isInteger(n) && n >= 1 && n <= 999))
      const row = Math.floor(i / 2), expectedDigits = exercise === 10 ? row === 3 ? 3 : 2 : row === 0 ? 2 : 3
      assert.equal(String(item.a).length, expectedDigits)
      assert.equal(String(item.b).length, exercise === 10 && row === 0 ? 1 : expectedDigits)
      assert.equal(Boolean(item.blankOperands), exercise === 11)
    })
  })
  await test('geometry retains source figures, four names, a single large counting frame and six coordinates', () => {
    for (const sample of samples) {
      assert.equal(sample.get(12)[0].cscTask.scale, 1); assert.equal(sample.get(13)[0].cscTask.scale, 2)
      for (const number of [12, 13]) assert.ok(sample.get(number)[0].symmetryFigure.polylines.length)
      const names = sample.get(17)[0]
      assert.equal(names.cscTask.figures.length, 4); assert.equal(new Set(names.cscTask.figures).size, 4); assert.equal(names.answer.split(' ; ').length, 4)
      const count = sample.get(18)[0]
      assert.equal(count.cscTask.kind, 'large-count'); assert.equal(count.countIcons.tokens.filter((token) => token.kind === count.countIcons.targetKind).length, Number(count.answer))
      for (const number of [19, 20]) {
        const item = sample.get(number)[0]
        assert.equal(item.coordScene.marks.length, 6); assert.equal(item.coordQuestions.length, 6); assert.equal(item.cscTask.kind, 'coordinates-left')
        assert.equal(item.coordTask, number === 19 ? 'read' : 'place')
      }
      const segments = sample.get(14)[0]
      assert.equal(new Set(segments.segments.map((s) => s.mm)).size, 3)
      const values = segments.segments.map((s) => s.mm)
      assert.equal(segments.answer, `${String.fromCharCode(65 + values.indexOf(Math.max(...values)))} ; ${String.fromCharCode(65 + values.indexOf(Math.min(...values)))}`)
    }
  })
  await test('two distinct logic questions can be selected explicitly without altering their source bank', () => {
    for (const sample of samples) assert.equal(new Set(sample.get(16).map((item) => item.logique.id)).size, 2)
    const options = logiqueBankOptions('logique-suite-graphique'), original = structuredClone(options)
    for (const option of options) {
      const item = logiqueItemById('logique-suite-graphique', option.id, createRng(7))
      assert.equal(item.logique.id, option.id); assert.deepEqual(item.logique.stem, option.stem)
      assert.equal(item.answer, item.logique.choiceLabels[item.logique.correctIndex])
    }
    assert.deepEqual(logiqueBankOptions('logique-suite-graphique'), original)
  })
  await test('103 distinct problem templates preserve the original defaults and produce correct variable results', () => {
    assert.equal(CSC_PROBLEM_BANK.length, 103); assert.equal(new Set(CSC_PROBLEM_BANK.map((p) => p.id)).size, 103)
    assert.equal(CSC_PROBLEM_BANK.filter((p) => p.operation === '+').length, 52); assert.equal(CSC_PROBLEM_BANK.filter((p) => p.operation === '−').length, 51)
    assert.deepEqual(CSC_DEFAULT_PROBLEMS.map((id) => { const p = CSC_PROBLEM_BANK.find((p) => p.id === id); return buildCscProblem(id, ...p.defaults).result }), [36, 37, 44])
    for (const template of CSC_PROBLEM_BANK) for (let seed = 0; seed < 20; seed++) {
      const p = rollCscProblem(template.id, createRng(seed + 1))
      assert.equal(p.result, template.operation === '+' ? p.a + p.b : p.a - p.b)
      assert.ok(p.result >= 0 && p.result <= 100); assert.ok(!/[{}]/.test(p.statement))
    }
    assert.throws(() => buildCscProblem('perles-patricia', 10, 11))
    assert.throws(() => buildCscProblem('unknown', 10, 5))
    assert.throws(() => buildCscProblem('perles-patricia', 3.5, 1))
    const singular = buildCscProblem('addition-01', 21, 1)
    assert.match(singular.statement, /21 livres/); assert.match(singular.statement, /1 livre le mardi/)
  })
  await test('free edits recompute answers and audio, while invalid tasks report an error instead of guessing', () => {
    const item = structuredClone(samples[0].get(2)[0]); item.answer = '999'; item.cscTask = { kind: 'calculation-audio', a: 21, b: 7, operation: '−' }
    const fixed = recalculateCsc(item, 'tcm-csc-ex02')
    assert.equal(fixed.answer, '14'); assert.ok(fixed.audioParts.includes('/lib/audio/nombre/moins.mp3'))
    const bad = recalculateCsc({ ...item, cscTask: { ...item.cscTask, b: 50 } }, 'tcm-csc-ex02')
    assert.ok(bad.libreError); assert.equal(bad.answer, '')
    const story = recalculateCsc({ layout: 'algebra', answer: 'stale', cscTask: { kind: 'problem', templateId: 'perles-patricia', a: 98, b: 54 } }, 'tcm-csc-ex24')
    assert.equal(story.answer, '44 perles'); assert.match(story.prompt, /98 perles/); assert.match(story.prompt, /54 perles/)
  })
  await test('the complete worksheet is deterministic, renews its numbers and groups three separately named audio exercises', () => {
    const pages = buildTcmCscTestPages(), before = structuredClone(pages)
    const first = buildWorksheets(pages, 21), again = buildWorksheets(pages, 21), next = buildWorksheets(pages, 22)
    assert.deepEqual(first, again); assert.notDeepEqual(first, next); assert.deepEqual(pages, before)
    const blocks = first.flatMap((sheet) => sheet.blocks)
    assert.equal(blocks.filter((block) => block.exerciseIndex > 0).length, 23)
    assert.ok(!blocks.some((block) => block.exerciseIndex === 21))
    assert.deepEqual(cscAudioGroups(first).map((g) => [g.number, g.parts.length]), [[1, 5], [2, 5], [3, 1]])
    assert.equal(new Set(cscAudioGroups(first).map((g) => g.name)).size, 3)
  })
} finally { await server.close() }
