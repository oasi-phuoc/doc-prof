import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
try {
  const { collectWorksheetTranscriptions: collect, paginateTranscriptions: paginate, formatExerciseTranscription: format } = await vite.ssrLoadModule('/src/tcf/transcriptions.ts')
  const exercise = transcription => ({ id: 'transcription-pages', niveau: 'A0-A1', competence: 'CO', type_exercice: 'complet', scene: 'Messages', support: { audios: ['/one.mp3', '/two.mp3', '/three.mp3'], transcription }, questions: [] })
  const sheet = (ex, exerciseIndex = 1) => ({ blocks: [{ exerciseIndex, items: [{ tcf: { kind: 'support', exercise: ex } }] }] })
  const normalized = text => text.replace(/\s+/g, ' ').trim()

  await test('short dialogues each receive a separate physical page', () => {
    const entries = collect([sheet(exercise(['Bonjour, ici la mairie.', 'Le train arrive.']))])
    const pages = paginate(entries)
    assert.equal(entries.length, 2)
    assert.equal(pages.length, 2)
    assert.deepEqual(pages.map(page => page.map(entry => entry.text)), [['Bonjour, ici la mairie.'], ['Le train arrive.']])
    assert.match(pages[0][0].title, /Document 1$/)
    assert.match(pages[1][0].title, /Document 2$/)
  })

  await test('blank tracks create no empty page and preserve the original document numbers', () => {
    const ex = exercise(['Premier document.', '   ', 'Troisième document.'])
    const entries = collect([sheet(ex)])
    assert.equal(paginate(entries).length, 2)
    assert.match(entries[1].title, /Document 3$/)
    assert.equal(format(ex), 'Document 1 — Premier document.\n\nDocument 3 — Troisième document.')
  })

  await test('association dialogues keep their labels, text and order', () => {
    const ex = { ...exercise(['Bonjour !', 'Message 2 — À demain.']), type_exercice: 'association_images' }
    const entries = collect([sheet(ex, 4)])
    assert.deepEqual(entries.map(entry => entry.text), ex.support.transcription)
    assert.match(entries[0].title, /Dialogue 1$/)
    assert.match(entries[1].title, /Message 2$/)
    assert.ok(entries.every(entry => entry.exerciseNo === 4))
    assert.equal(format(ex), 'Dialogue 1 — Bonjour !\n\nMessage 2 — À demain.')
  })

  await test('continuation worksheets do not duplicate transcripts, while another exercise retains its copy', () => {
    const ex = exercise(['Une seule fois par exercice.'])
    assert.equal(collect([sheet(ex), sheet(ex)]).length, 1)
    assert.deepEqual(collect([sheet(ex, 1), sheet(ex, 2)]).map(entry => entry.exerciseNo), [1, 2])
  })

  await test('paragraphs in one recording remain together rather than becoming separate dialogues', () => {
    const text = 'Première réplique.\n\nDeuxième réplique.'
    const entries = collect([sheet(exercise(text))])
    assert.equal(entries.length, 1)
    assert.equal(paginate(entries).length, 1)
    assert.equal(entries[0].text, text)
    assert.equal(format(exercise(text)), text)
  })

  await test('a long recording continues on its own pages without splitting words or sharing with the next recording', () => {
    const long = Array.from({ length: 210 }, (_, index) => `réplique-${index}`).join(' ')
    const ex = exercise([long, 'Dialogue suivant.'])
    const pages = paginate(collect([sheet(ex)]), 600)
    assert.ok(pages.length > 3)
    assert.ok(pages.every(page => page.length === 1))
    assert.equal(normalized(pages.slice(0, -1).map(page => page[0].text).join(' ')), long)
    assert.equal(pages.at(-1)[0].text, 'Dialogue suivant.')
    assert.match(pages[1][0].title, /Document 1 \(suite\)$/)
    assert.match(pages.at(-1)[0].title, /Document 2$/)
  })

  await test('a blank or non-audio support creates no appendix', () => {
    assert.deepEqual(paginate(collect([sheet(exercise(['', ' ']))])), [])
    assert.deepEqual(collect([sheet({ id: 'reading', type_exercice: 'sms', support: { texte: 'Texte de lecture.' } })]), [])
    assert.equal(format(exercise('   ')), null)
  })
} finally {
  await vite.close()
}
