import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let catalog
let defaultPage
let buildPage
let buildWorksheets
let validateTcfExercise

before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  const [sante, math, generate, validator] = await Promise.all([
    server.ssrLoadModule('/src/sante/catalog.ts'),
    server.ssrLoadModule('/src/math/catalog.ts'),
    server.ssrLoadModule('/src/math/generate.ts'),
    server.ssrLoadModule('/src/tcf/validate.ts'),
  ])
  catalog = sante
  defaultPage = math.defaultPage
  buildPage = generate.buildPage
  buildWorksheets = generate.buildWorksheets
  validateTcfExercise = validator.validateTcfExercise
})

after(() => server?.close())

test('Sciences et santé has all four competencies at every selectable topic and level', async () => {
  const { SANTE_TOPICS, SANTE_EXERCISE_TYPES, santeLevelsForTopic, santeActivityByType } = catalog
  assert.equal(SANTE_TOPICS.length, 10)
  assert.equal(new Set(SANTE_EXERCISE_TYPES.map(({ id }) => id)).size, SANTE_EXERCISE_TYPES.length)
  for (const { id: topic } of SANTE_TOPICS) {
    const types = SANTE_EXERCISE_TYPES.filter((type) => type.topic === topic)
    assert.ok(types.some(({ label }) => label.startsWith('Théorie')), topic)
    for (const level of santeLevelsForTopic(topic)) {
      const group = types.filter(({ id }) => santeActivityByType.get(id).level === level)
      const skills = group.filter(({ label }) => /^(CE|CO|PE|PO) —/.test(label)).map(({ label }) => label.slice(0, 2))
      assert.deepEqual([...new Set(skills)].sort(), ['CE', 'CO', 'PE', 'PO'], `${topic} ${level}`)
    }
  }
  for (const { id, topic } of SANTE_EXERCISE_TYPES) {
    const activity = santeActivityByType.get(id)
    const config = { ...defaultPage('santé'), topic, exerciseType: id }
    const sheet = buildPage(config, 42)
    assert.ok(sheet.items.length > 0 && !sheet.items.some((item) => item.prompt?.includes('indisponible')), id)
    assert.deepEqual(buildPage(config, 42).items, sheet.items, id)
    if (activity.exercise) {
      assert.deepEqual(validateTcfExercise(activity.exercise).errors, [], id)
      for (const question of activity.exercise.questions) {
        assert.ok(question.formes?.lignes?.reponse_modele, id)
        for (const choice of question.formes?.qcm_image?.choix ?? []) {
          await access(join('public', decodeURI(choice.image)))
        }
      }
    }
    for (const path of sheet.blocks.flatMap((block) => block.corrigeAudios ?? [])) {
      await access(join('public', decodeURI(path)))
    }
  }
})

test('Santé keeps the complete B1 reading and a second activity in multi-page output', () => {
  const config = {
    ...defaultPage('santé'),
    topic: 'sante-stress',
    exerciseType: 'sante-stress-ce-b1',
    extraBlocks: [{ topic: 'sante-stress', exerciseType: 'sante-stress-po-b1', count: 1, columns: 1 }],
  }
  const pages = buildWorksheets([config], 42)
  assert.deepEqual(pages.map((sheet) => sheet.isContinuation), [false, true, true])
  assert.deepEqual(pages.map((sheet) => sheet.blocks[0].sourceBlockIndex), [0, 0, 1])
  assert.equal(pages[0].items.filter((item) => item.tcf?.kind === 'support').length, 1)
  assert.equal(pages.slice(0, 2).flatMap((sheet) => sheet.items.filter((item) => item.tcf?.kind === 'qcm')).length, 4)
  assert.equal(pages[2].items[0].tcf?.kind, 'dialogue')
})
