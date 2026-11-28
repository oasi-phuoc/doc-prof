import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { buildWorksheets } = await vite.ssrLoadModule('/src/math/generate.ts')
  const { blockPointsTotal } = await vite.ssrLoadModule('/src/tpm/test.ts')
  const { limitTcfCeQuestions } = await vite.ssrLoadModule('/src/tcf/ce-questions.ts')
  const { buildTpfFamilyTestPages, resolveTcfExercise } = await vite.ssrLoadModule('/src/tcf/generate.ts')
  const { tcfBank, tcfExerciseById, tcfSlotBank } = await vite.ssrLoadModule('/src/tcf/loader.ts')
  const { tcfSlotByTypeId } = await vite.ssrLoadModule('/src/tcf/catalog.ts')
  const { tcfGroupId } = await vite.ssrLoadModule('/src/tcf/sources.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  const { parseFicheRecipe, buildFicheRecipe } = await vite.ssrLoadModule('/src/fiches/recipe.ts')
  const { textFontFamily } = await vite.ssrLoadModule('/src/typography/font-families.ts')
  const base = { domain: 'tcf-csc', topic: 'tcf-co', exerciseType: 'tcf-co-ex-3', difficulty: 'facile', count: 1, columns: 1 }
  const questions = Array.from({ length: 5 }, (_, i) => ({ type_reponse: 'qcm_texte', enonce: `Question ${i + 1} ?`, points: i + 0.5,
    choix: [{ id: 'a', texte: 'Oui', correct: true }, { id: 'b', texte: 'Non' }, { id: 'c', texte: 'Peut-être' }],
    formes: { lignes: { nb_lignes: 2, reponse_modele: 'Oui' } } }))
  const exercise = { id: 'audio-layout-test', niveau: 'A0-A1', competence: 'CO', type_exercice: 'complet',
    support: { audios: ['/fixture.mp3'], transcription: 'Le même document.' }, questions }
  const q = sheets => sheets.flatMap(sheet => sheet.items.flatMap(item => item.tcf?.kind === 'audio_cadre' ? item.tcf.questions : []))
  const points = sheets => sheets.reduce((sum, sheet) => sum + sheet.blocks.reduce((n, b) => n + blockPointsTotal(b.items, 1), 0), 0)

  await test('TCF B1 builds all four competencies from its own banks and retains the layout in saved recipes', async () => {
    const coPaths = new Set(tcfBank('A2-B1', 'CO').flatMap(ex => ex.support.audios ?? [ex.support.audio]))
    const lowerAudio = tcfBank('A0-A1', 'CO').find(ex => ex.support.audio)?.support.audio
    const pages = buildTpfFamilyTestPages('tcf-b1', 42)
    assert.equal(pages.length, 15)
    assert.ok(pages.every(page => page.domain === 'tcf-b1' && page.difficulty === 'avance'))
    const sources = pages.slice(1).map(page => resolveTcfExercise(page, createRng(42)))
    assert.deepEqual(sources.map(ex => ex.competence), [
      'CO', 'CO', 'CO', 'CO', 'CE', 'CE', 'CE', 'CE', 'PE', 'PE', 'PE', 'PO', 'PO', 'PO',
    ])
    assert.ok(sources.every(ex => ex.niveau === 'A2-B1'))
    assert.ok(sources.filter(ex => ex.competence === 'CO').every(ex =>
      (ex.support.audios ?? [ex.support.audio]).every(audio => coPaths.has(audio))))
    assert.deepEqual(sources.filter(ex => ex.competence === 'PO').map(tcfGroupId),
      ['entretien', 'interaction', 'point-de-vue'])
    const picked = resolveTcfExercise({ ...pages[1], difficulty: 'facile', tcfExercise: undefined,
      tcfAudioPickMode: 'libre', tcfAudioSlots: [lowerAudio] }, createRng(42))
    assert.ok(picked.support.audios.every(audio => coPaths.has(audio)))
    const template = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
    const recipe = parseFicheRecipe(JSON.parse(JSON.stringify(buildFicheRecipe({ ...template, pages }))))
    assert.ok(recipe.pages.every(page => page.domain === 'tcf-b1'))
    const sheets = buildWorksheets(recipe.pages, 42)
    assert.ok(sheets.every(sheet => sheet.items.every(item => item.tcf?.kind !== 'vide')))
    assert.ok(sheets[0].items.find(item => item.tcf?.kind === 'informations').tcf.pointsByCompetence.PO > 0)
  })

  await test('CE defaults to five questions, with an explicit choice up to the full source', () => {
    const slot = tcfSlotByTypeId['tcf-ce-ex-4']
    for (const [domain, difficulty, level] of [['tcf-csc', 'facile', 'A0-A1'], ['tcf-cfr', 'moyen', 'A1-A2'], ['tpf', 'moyen', 'A1-A2']]) {
      const full = tcfSlotBank(level, slot).find(ex => ex.questions.length > 5)
      assert(full)
      const snapshot = structuredClone(full)
      const config = { ...base, domain, difficulty, topic: 'tcf-ce', exerciseType: slot.typeId, tcfBankId: full.id }
      assert.equal(resolveTcfExercise(config, createRng(42)).questions.length, 5)
      assert.equal(resolveTcfExercise({ ...config, tcfQuestionCount: full.questions.length }, createRng(42)).questions.length, full.questions.length)
      assert.equal(limitTcfCeQuestions(full, 2).questions.length, 2)
      assert.deepEqual(full, snapshot)
      assert.equal(resolveTcfExercise({ ...config, tcfExercise: full }, createRng(42)).questions.length, full.questions.length, 'An already edited selection is preserved.')
    }
  })

  await test('changing CE typography preserves frozen manual edits and question selections', () => {
    const source = structuredClone(tcfSlotBank('A0-A1', tcfSlotByTypeId['tcf-ce-ex-4']).find(ex => ex.questions.length > 5))
    source.support.texte = 'Document personnalisé conservé.'
    source.questions = source.questions.slice(0, 3)
    source.questions[0].enonce = 'Question personnalisée conservée ?'
    const config = { ...base, topic: 'tcf-ce', exerciseType: 'tcf-ce-ex-4', tcfExercise: source, tcfCeTextFont: 'marelle' }
    const frozen = buildWorksheets([config], 42).flatMap(sheet => sheet.items)
    const before = structuredClone(frozen)
    for (const tcfCeTextFont of ['gothic', 'playwrite', 'arial']) {
      const changed = buildWorksheets([{ ...config, libreItems: frozen, tcfCeTextFont }], 42).flatMap(sheet => sheet.items)
      const document = changed.find(item => item.tcf?.kind === 'support')
      assert.equal(document.tcf.ceTextFont, tcfCeTextFont)
      assert.deepEqual(document.tcf.exercise, before.find(item => item.tcf?.kind === 'support').tcf.exercise)
      assert.deepEqual(changed.filter(item => item.tcf?.kind !== 'support'), before.filter(item => item.tcf?.kind !== 'support'))
    }
    assert.deepEqual(frozen, before)
  })

  await test('each internal audio question can start a page without changing answers, points, audio or form indexes', () => {
    for (const domain of ['tcf-csc', 'tcf-cfr', 'tpf']) {
      const config = { ...base, domain, tcfExercise: exercise }
      const joined = buildWorksheets([config], 42)
      const split = buildWorksheets([{ ...config, tcfQuestionPageBreakBefore: [2, 3, 4, 5] }], 42)
      assert.equal(split.length, 5)
      assert.deepEqual(q(split), q(joined))
      assert.equal(points(split), points(joined))
      assert.deepEqual(split.map(sheet => sheet.isContinuation), [false, true, true, true, true])
      assert.equal(split[0].blocks[0].pointsWeights.reduce((a, b) => a + b, 0), points(joined))
      assert.ok(split.slice(1).every(sheet => sheet.blocks[0].title === '' && sheet.blocks[0].instruction === ''))
      assert.ok(split.flatMap(sheet => sheet.items).filter(item => item.tcf?.kind === 'audio_cadre').every(item => item.tcf.audioSrc === '/fixture.mp3'))
    }
  })

  await test('multiple recordings and another exercise survive internal and existing item cuts together', () => {
    const multi = { ...exercise, support: { audios: ['/one.mp3', '/two.mp3'], transcription: ['Premier.', 'Deuxième.'] }, questions: questions.map((question, i) => ({ ...question, audio: i < 2 ? 1 : 2 })) }
    const config = { ...base, tcfExercise: multi, tcfQuestionPageBreakBefore: [2, 4], tcfPageBreakAfter: [false, true], extraBlocks: [{ ...base, exerciseNo: 9, tcfExercise: exercise }] }
    const joined = buildWorksheets([{ ...config, tcfQuestionPageBreakBefore: undefined, tcfPageBreakAfter: undefined }], 42)
    const split = buildWorksheets([config], 42)
    assert.deepEqual(q(split), q(joined))
    assert.equal(points(split), points(joined))
    assert.ok(split.flatMap(sheet => sheet.blocks).some(block => block.exerciseIndex === 9))
    assert.ok(q(split).some(question => question.formModeIndex === 4 && question.numero === 2))
  })

  await test('illustrated reading pages stay separate when the same worksheet also has a cut inside an audio', () => {
    const reading = tcfExerciseById('tcf-a0a1-ce-001')
    const ce = { ...base, topic: 'tcf-ce', exerciseType: 'tcf-ce-ex-1', tcfExercise: reading, tcfCeFormat: 'image' }
    const audio = { ...base, tcfExercise: exercise, tcfQuestionPageBreakBefore: [3] }
    const mixed = buildWorksheets([{ ...audio, extraBlocks: [ce] }], 42)
    const audioSheets = buildWorksheets([audio], 42)
    const withoutAudioCut = buildWorksheets([{ ...audio, tcfQuestionPageBreakBefore: undefined, extraBlocks: [ce] }], 42)
    const readingItems = withoutAudioCut.flatMap(sheet => sheet.items).filter(item => item.tcfExerciseId === reading.id)
    assert.equal(mixed.length, 4)
    assert.deepEqual(q(mixed), q(audioSheets))
    assert.equal(points(mixed), points(withoutAudioCut))
    assert.equal(mixed[2].cePosterLandscape, true)
    assert.equal(mixed[2].blocks[0].sourceBlockIndex, 1)
    assert.equal(mixed[3].blocks[0].itemOffset, 1)
    assert.equal(mixed[3].blocks[0].tcfPageBreakAfter[0], true)
    assert.deepEqual(mixed.slice(2).flatMap(sheet => sheet.items), readingItems)
  })

  await test('older frame cuts remain cancellable, with no duplicate cut button on a continued question', async () => {
    const { WorksheetSheet } = await vite.ssrLoadModule('/src/components/generator/WorksheetSheet.tsx')
    const { DEFAULT_INSTITUTIONAL } = await vite.ssrLoadModule('/src/components/math/PrintDocumentChrome.tsx')
    const { createElement } = await import('react')
    const { renderToStaticMarkup } = await import('react-dom/server')
    const sheets = buildWorksheets([{ ...base, tcfExercise: exercise, tcfPageBreakAfter: [true], tcfQuestionPageBreakBefore: [3] }], 42)
    assert.equal(sheets.length, 3)
    const markup = index => renderToStaticMarkup(createElement(WorksheetSheet, { page: sheets[index], mode: 'student', institutional: DEFAULT_INSTITUTIONAL,
      pageNumber: index + 1, total: 3, sheetIndex: index, interactiveTcfPageBreaks: true, onToggleTcfPageBreak() {} }))
    assert.match(markup(1), /Remettre cette question et les suivantes sur la page précédente/)
    const continued = markup(2)
    assert.equal((continued.match(/aria-label="Saut de page avant la question 3/g) ?? []).length, 1)
    assert.match(continued, /aria-pressed="true"/)
    assert.equal(sheets[2].items.find(item => item.tcf?.kind === 'audio_cadre').tcf.startsInsideAudio, true)
  })

  await test('worksheet font, independent CE font and per-question cuts round-trip in saved recipes', async () => {
    const template = JSON.parse(await readFile('docs/interactive/demo-source-recipe.json', 'utf8'))
    const recipe = buildFicheRecipe({ ...template, sheetFont: 'gothic', pages: [{ ...base, tcfExercise: exercise, tcfCeTextFont: 'playwrite', tcfQuestionPageBreakBefore: [3] }] })
    const restored = parseFicheRecipe(JSON.parse(JSON.stringify(recipe)))
    assert.equal(restored.sheetFont, 'gothic')
    assert.equal(restored.pages[0].tcfCeTextFont, 'playwrite')
    assert.deepEqual(restored.pages[0].tcfQuestionPageBreakBefore, [3])
    assert.equal(buildWorksheets(restored.pages, restored.seed).length, 2)
    assert.equal(parseFicheRecipe({ ...recipe, sheetFont: 'invalid' }).sheetFont, undefined)
    assert.match(textFontFamily('marelle'), /Marelle/)
    assert.match(textFontFamily('playwrite'), /Playwrite/)
    assert.match(textFontFamily('gothic'), /Didact Gothic/)
  })

  await test('optional geometric worksheet font is vendored with its license and checksum', async () => {
    const manifest = JSON.parse(await readFile('public/fonts/worksheet/manifest.json', 'utf8'))
    for (const font of manifest.fonts) {
      const bytes = await readFile(`public/fonts/worksheet/${font.file}`)
      assert.equal(bytes.length, font.bytes)
      assert.equal(createHash('sha256').update(bytes).digest('hex'), font.sha256)
      assert.match(await readFile(`public/fonts/worksheet/${font.family}-OFL.txt`, 'utf8'), /SIL OPEN FONT LICENSE/)
    }
  })
} finally { await vite.close() }
