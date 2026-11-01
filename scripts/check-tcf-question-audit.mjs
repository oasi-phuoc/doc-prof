import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const normalize = (text) => String(text).normalize('NFD').replace(/\p{M}/gu, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const levels = ['a0-a1', 'a1-a2', 'a2-b1']
const banks = levels.flatMap((level) => ['ce', 'co'].flatMap((skill) =>
  read(`src/tcf/content/${level}/${skill}.json`)))
const ce = banks.filter((e) => e.competence === 'CE')
const co = banks.filter((e) => e.competence === 'CO')
const review = read('scripts/tcf-question-semantic-review-report.json')
const poolTags = read('src/tcf/content/co-reviewed-pools.json')
const targets = { court: 2, moyen: 4, long: 10 }
const textForm = (q) => q.type_reponse === 'qcm_texte' ? q : q.formes?.qcm_texte
const linesForm = (q) => q.type_reponse === 'lignes' ? q : q.formes?.lignes

function checkReviewed(questions, facts, source, context) {
  assert.equal(questions.length, facts.length, context)
  assert.equal(new Set(facts.map((f) => f.fact)).size, facts.length, context)
  assert.equal(new Set(facts.map((f) => normalize(f.correct_answer))).size, facts.length, context)
  questions.forEach((q, index) => {
    const fact = facts[index]
    assert.equal(q.enonce, fact.question, context)
    const choices = textForm(q)?.choix ?? []
    assert.equal(choices.filter((c) => c.correct).length, 1, context)
    assert.equal(choices.find((c) => c.correct)?.texte, fact.correct_answer, context)
    assert.equal(linesForm(q)?.reponse_modele, fact.correct_answer, context)
    for (const quote of Array.isArray(fact.evidence) ? fact.evidence : [fact.evidence]) {
      assert.ok(normalize(source).includes(normalize(quote)), `${context}: ${quote}`)
    }
    const images = q.type_reponse === 'qcm_image' ? q : q.formes?.qcm_image
    for (const choice of images?.choix ?? []) {
      assert.ok(existsSync(`public${choice.image}`), choice.image)
      assert.equal(choice.correct, choices.find((c) => c.id === choice.id)?.correct, context)
    }
  })
}

for (const reviewed of review.reviewed_exercises) {
  const exercise = ce.find((e) => e.id === reviewed.id)
  assert.ok(exercise, reviewed.id)
  const source = Object.values(exercise.support).filter((v) => typeof v === 'string').join('\n')
  checkReviewed(exercise.questions, reviewed.facts, source, reviewed.id)
}

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { tcfAudioEntries } = await vite.ssrLoadModule('/src/tcf/audio-bank.ts')
  const entries = tcfAudioEntries(co)
  const reviewedAudio = new Set(review.reviewed_audio.map((r) => r.audio))
  for (const reviewed of review.reviewed_audio) {
    const entry = entries.find((e) => e.audio === reviewed.audio)
    assert.ok(entry, reviewed.audio)
    assert.ok(entry.tags.includes(reviewed.tag), reviewed.audio)
    if (reviewed.scenario) assert.ok(entry.tags.includes('scenario'), reviewed.audio)
    assert.equal(entry.questionPool?.length, targets[reviewed.tag], reviewed.audio)
    assert.deepEqual(poolTags[reviewed.audio], { tag: reviewed.tag, questions: targets[reviewed.tag] })
    // Contrôler chaque référence, pas seulement le meilleur pool retenu par l’index.
    for (const exercise of co) {
      const audios = exercise.support.audios ?? [exercise.support.audio]
      const index = audios.indexOf(reviewed.audio)
      if (index < 0) continue
      const transcript = exercise.support.transcription
      const source = Array.isArray(transcript) ? transcript[index] : transcript
      const questions = audios.length > 1
        ? exercise.questions.filter((q) => q.audio === index + 1) : exercise.questions
      checkReviewed(questions, reviewed.facts, source, `${exercise.id}: ${reviewed.audio}`)
    }
  }
  assert.equal(Object.keys(poolTags).length, reviewedAudio.size)
  const reviewedCe = new Set(review.reviewed_exercises.map((r) => r.id))
  let questionCount = 0
  let mismatchedModels = 0
  for (const exercise of banks) for (const q of exercise.questions ?? []) {
    questionCount++
    const text = textForm(q), lines = linesForm(q)
    assert.ok(text?.choix?.length >= 3, exercise.id)
    assert.equal(text.choix.filter((c) => c.correct).length, 1, exercise.id)
    assert.ok(lines?.reponse_modele, exercise.id)
    const correct = text.choix.find((c) => c.correct).texte
    if (normalize(correct) !== normalize(lines.reponse_modele)) mismatchedModels++
  }
  const countGaps = entries.flatMap((entry) => {
    const tag = entry.tags.includes('scenario') ? 'court'
      : ['court', 'moyen', 'long'].find((t) => entry.tags.includes(t))
    if (!tag || entry.questionPool?.length === targets[tag]) return []
    return [{ audio: entry.audio, tag, questions: entry.questionPool?.length ?? 0, target: targets[tag] }]
  })
  const status = {
    status: reviewedCe.size === ce.length && reviewedAudio.size === entries.length ? 'complete' : 'in-progress',
    questions: questionCount,
    reviewed_questions: review.reviewed_questions,
    ce: { exercises: ce.length, reviewed: reviewedCe.size, remaining: ce.length - reviewedCe.size },
    co: { audio: entries.length, reviewed: reviewedAudio.size, remaining: entries.length - reviewedAudio.size,
      scenarios: entries.filter((e) => e.tags.includes('scenario')).length,
      reviewed_scenarios: review.reviewed_audio.filter((e) => e.scenario).length },
    pending_count_corrections: countGaps.length,
    // Une différence peut être une simple variante de formulation : à relire, pas à corriger aveuglément.
    answer_model_differences_to_review: mismatchedModels,
    pending_ce: ce.filter((e) => !reviewedCe.has(e.id)).map((e) => e.id),
    pending_audio_counts: countGaps,
  }
  if (process.argv.includes('--write')) {
    writeFileSync('scripts/tcf-question-audit-status.json', JSON.stringify(status, null, 2) + '\n')
  }
  console.log(JSON.stringify(Object.fromEntries(Object.entries(status).filter(([k]) => !k.startsWith('pending_') || k === 'pending_count_corrections'))))
  if (process.argv.includes('--complete')) assert.equal(status.status, 'complete', 'La relecture intégrale reste en cours')
} finally {
  await vite.close()
}
