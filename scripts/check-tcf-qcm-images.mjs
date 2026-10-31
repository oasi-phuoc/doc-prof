import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { tcfExerciseItems } = await vite.ssrLoadModule('/src/tcf/generate.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  const q = {
    enonce: 'Choisir un lieu', type_reponse: 'qcm_texte', melanger: true,
    choix: [
      { id: 'a', texte: 'A', correct: false },
      { id: 'b', texte: 'B', correct: true },
      { id: 'c', texte: 'C', correct: false, fixe: true },
    ],
    formes: { qcm_image: { melanger: true, choix: [
      { id: 'c', image: '/c.webp', correct: false, fixe: true },
      { id: 'a', image: '/a.webp', correct: false },
      { id: 'b', image: '/b.webp', correct: true },
    ] } },
  }
  function* selectors(value) {
    if (!value || typeof value !== 'object') return
    if (value.formSelect) yield value.formSelect
    for (const [key, child] of Object.entries(value)) {
      if (key !== 'formSelect') yield* selectors(child)
    }
  }
  let synthetic = 0
  for (const type of ['sms', 'six_courts', 'trois_moyens']) {
    const exercise = { id: 'tcf-regression', niveau: 'A0-A1', competence: type === 'sms' ? 'CE' : 'CO',
      type_exercice: type, support: { texte: 'Support', audios: ['/a.mp3', '/b.mp3', '/c.mp3'] },
      questions: [{ ...q, audio: 1 }] }
    for (const seed of [1, 42, 123, 9876]) {
      const items = tcfExerciseItems(exercise, createRng(seed))
      for (const selector of selectors(items)) {
        const text = selector.variants.qcm_texte
        const image = selector.variants.qcm_image
        assert.ok(text && image)
        assert.equal(text.answer, image.answer)
        text.choix.forEach((choice, i) => {
          assert.equal(image.choix[i].image, `/${choice.texte.toLowerCase()}.webp`)
          assert.equal(choice.correct, image.choix[i].correct)
        })
        assert.equal(text.choix[2].texte, 'C', 'fixed option keeps its place')
        synthetic++
      }
    }
  }
  assert.equal(synthetic, 12, 'all rendering paths exercised')
  let bankVariants = 0
  let expectedBankVariants = 0
  for (const level of ['a0-a1', 'a1-a2']) for (const skill of ['ce', 'co']) {
    const bank = JSON.parse(readFileSync(`src/tcf/content/${level}/${skill}.json`, 'utf8'))
    for (const exercise of bank) {
      expectedBankVariants += exercise.questions.filter((question) =>
        (question.type_reponse === 'qcm_texte' || question.formes?.qcm_texte) &&
        (question.type_reponse === 'qcm_image' || question.formes?.qcm_image),
      ).length
      for (const selector of selectors(tcfExerciseItems(exercise, createRng(42)))) {
        const text = selector.variants.qcm_texte
        const image = selector.variants.qcm_image
        if (!text || !image) continue
        assert.equal(text.choix.length, image.choix.length, exercise.id)
        assert.equal(text.answer, image.answer, exercise.id)
        text.choix.forEach((c, i) => assert.equal(c.correct, image.choix[i].correct, exercise.id))
        bankVariants++
      }
    }
  }
  assert.ok(bankVariants > 0)
  assert.equal(bankVariants, expectedBankVariants, 'all bank image variants were rendered and checked')
  console.log(`QCM rendering verified: ${synthetic} shuffle regressions, ${bankVariants} bank variants`)
} finally {
  await vite.close()
}
