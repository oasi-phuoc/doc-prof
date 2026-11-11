import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { teacherSheetRows, teacherSheetData, teacherSheetHtml, teacherSheetSignature } = await server.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts')
  const { PALETTE, defaultShapes } = await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const { planIdentity } = await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const colors = PALETTE.map((card) => card.color)
  const question = (id) => ({ id, mode: 'choice', prompt: `Question ${id}`, choices: [{ id: `${id}-1`, text: 'Un' }, { id: `${id}-2`, text: 'Deux' }, { id: `${id}-3`, text: 'Trois' }], images: [] })
  const game = { id: 'teacher-test', title: 'Test', questions: [question('q1'), question('q2')], corrections: { q1: { choiceId: 'q1-2', text: 'Deux' }, q2: { choiceId: 'q2-2', text: 'Deux' } }, rounds: [{ id: 'pair', questionIds: ['q1', 'q2'] }], issues: [] }
  await test('teacher sheet uses B and E for the second choice in paired audio columns', async () => {
    const original = structuredClone(game)
    const data = await teacherSheetData(game, colors, defaultShapes)
    assert.deepEqual(data.rows.map((row) => row.card.letter), ['B', 'E'])
    assert.deepEqual(data.rows.map((row) => row.number), [1, 2])
    assert.equal(data.planId, await planIdentity(game))
    assert.deepEqual(game, original)
  })
  await test('open activities keep the model and hints without assigning an answer card', () => {
    const open = { ...game, rounds: undefined, questions: [{ id: 'oral', mode: 'oral', prompt: 'Racontez.', choices: [], hints: ['Qui ?', 'Où ?'], images: [] }], corrections: { oral: { text: 'Un exemple, parmi plusieurs réponses possibles.' } } }
    const [row] = teacherSheetRows(open, colors, defaultShapes)
    assert.equal(row.card, undefined)
    assert.equal(row.answer, open.corrections.oral.text)
    assert.equal(row.notes, 'Qui ? · Où ?')
  })
  await test('missing answer keys and unsafe palettes refuse export instead of guessing', () => {
    assert.throws(() => teacherSheetRows({ ...game, corrections: {} }, colors, defaultShapes), /corrigé/)
    assert.throws(() => teacherSheetRows(game, ['red; background:url(x)', ...colors.slice(1)], defaultShapes), /palette/)
  })
  await test('print document escapes source text, embeds only data images, and carries the plan hash', () => {
    const rows = teacherSheetRows(game, colors, defaultShapes)
    rows[0].answer = '<script>alert(1)</script>'
    rows[0].notes = '<img src=x onerror=alert(1)>'
    rows[0].image = 'https://unapproved.invalid/file.webp'
    const html = teacherSheetHtml('"<script>title</script>', 'test-plan', rows)
    assert.ok(!html.includes('<script>'))
    assert.ok(html.includes('&lt;script&gt;'))
    assert.ok(!html.includes('<img src=x'))
    assert.ok(!html.includes('src="https://'))
    assert.match(html, /data-plan-id="test-plan"/)
    assert.match(html, /ENSEIGNANT — NE PAS PROJETER/)
    assert.match(html, /size:A4 portrait/)
    assert.match(html, /illustration\(s\) non incorporée/)
  })
  await test('changing source, card colors or shapes invalidates the exported signature', () => {
    const initial = teacherSheetSignature(game, colors, defaultShapes)
    assert.notEqual(initial, teacherSheetSignature({ ...game, title: 'Autre' }, colors, defaultShapes))
    assert.notEqual(initial, teacherSheetSignature(game, ['#000000', ...colors.slice(1)], defaultShapes))
    assert.notEqual(initial, teacherSheetSignature(game, colors, ['moon', ...defaultShapes.slice(1)]))
    const long = { ...game, rounds: undefined, questions: [{ ...question('q1'), prompt: 'é🙂'.repeat(100) }] }
    assert.equal([...teacherSheetRows(long, colors, defaultShapes)[0].prompt].length, 80)
  })
} finally { await server.close() }
