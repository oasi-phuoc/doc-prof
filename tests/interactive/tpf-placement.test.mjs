import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'

let server
let generate
let worksheet
let placement
let audio

before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
  generate = await server.ssrLoadModule('/src/tcf/generate.ts')
  worksheet = await server.ssrLoadModule('/src/math/generate.ts')
  placement = await server.ssrLoadModule('/src/tcf/tpf-placement.ts')
  audio = await server.ssrLoadModule('/src/tcf/download-audios.ts')
})

test('TPF audio jobs keep the four placement levels and sequence order in exports', () => {
  const pages = worksheet.buildWorksheets(generate.buildTpfFamilyTestPages('tpf', 42), 42)
  const jobs = audio.collectTcfAudioJobs(pages)
  const levels = ['A1', 'A2.1', 'A2.2', 'B1']
  assert.deepEqual(jobs.map((job) => job.placementLevel), levels)
  assert.deepEqual(audio.listTcfAudioDownloadFiles(jobs, 'TPF').map(({ name }) => name.split('_')[1]), levels)
})

after(() => server?.close())

test('TPF has 16 exercises in placement order and 25 points per competence', () => {
  for (const seed of [1, 42, 923]) {
    const configs = generate.buildTpfFamilyTestPages('tpf', seed)
    assert.equal(configs.length, 17)
    assert.deepEqual(configs.slice(1).map((page) => page.exerciseType),
      placement.TPF_PLACEMENT_TASKS.map((task) => task.typeId))
    assert.equal(new Set(configs.slice(1).map((page) => page.tcfBankId)).size, 16)
    assert.ok(configs.slice(1).every((page) => page.tcfBankId))
    const sheets = worksheet.buildWorksheets(configs, seed)
    const items = sheets.flatMap((sheet) => sheet.items)
    assert.equal(items[0].tcf.placement, true)
    assert.deepEqual(items[0].tcf.pointsByCompetence, { CO: 25, CE: 25, PE: 25, PO: 25 })
    assert.ok(items.every((item) => item.tcf?.kind !== 'vide'))
    for (const type of ['tpf-ce-a1', 'tpf-ce-a2-1', 'tpf-ce-a2-2', 'tpf-ce-b1']) {
      const ceSheets = sheets.filter((sheet) => sheet.exerciseType === type)
      assert.deepEqual(ceSheets.map((sheet) => sheet.isContinuation), [false, true])
      assert.deepEqual(ceSheets.map((sheet) => sheet.items.filter((item) => item.tcf?.kind === 'qcm').length), [3, 2])
    }
    assert.deepEqual(items.filter((item) => item.tcf?.kind === 'ecriture').map((item) => item.tcf.nbMots),
      [{ min: 40, max: 50 }, { min: 60, max: 80 }])
    const lecture = items.find((item) => item.tcf?.kind === 'support' &&
      item.tcf.exercise.type_exercice === 'lecture_progressive')
    assert.equal(lecture.tcf.exercise.support.texte.split('\n\n').length, 3)
    assert.ok(items.some((item) => item.tcf?.kind === 'dialogue' && /pour ou contre/.test(item.tcf.situation)))
  }
})
