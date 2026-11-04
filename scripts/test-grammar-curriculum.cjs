/** Integration checks against the real catalog, generators and TCF render models. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const cache = new Map()
function load(file) {
  file = path.resolve(file)
  if (!path.extname(file)) file = fs.existsSync(file + '.ts') ? file + '.ts' : fs.existsSync(file + '.tsx') ? file + '.tsx' : path.join(file, 'index.ts')
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'))
  if (/\.(?:webp|png|jpg|svg)$/.test(file)) return file // Vite static asset imports are URL strings.
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }; cache.set(file, module)
  let source = fs.readFileSync(file, 'utf8')
  // The same twelve JSON modules as Vite's eager glob, without a browser or mocks.
  source = source.replace("import.meta.glob('./content/*/*.json', { eager: true, import: 'default' })", "require('__tcf_content_glob__')")
  source = source.replace(/import\.meta\.glob\('\.\/phrases\/\*\.json',\s*\{[^}]*\}\)/, "require('__soutien_phrase_glob__')")
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText
  const req = (id) => {
    if (id === '__soutien_phrase_glob__') {
      const folder = path.join(root, 'src/francais/soutien/phrases')
      return Object.fromEntries(fs.readdirSync(folder).filter(name => name.endsWith('.json')).map(name => [`./phrases/${name}`, load(path.join(folder, name))]))
    }
    if (id === '__tcf_content_glob__') {
      const content = path.join(root, 'src/tcf/content')
      return Object.fromEntries(['a0-a1', 'a1-a2', 'a2-b1'].flatMap(niveau => ['ce', 'co', 'pe', 'po'].map(kind => [`./content/${niveau}/${kind}.json`, load(path.join(content, niveau, kind + '.json'))])))
    }
    return id.startsWith('@/') ? load(path.join(root, 'src', id.slice(2))) : id.startsWith('.') ? load(path.resolve(path.dirname(file), id)) : require(id)
  }
  new Function('require', 'module', 'exports', code)(req, module, module.exports)
  return module.exports
}
const get = name => load(path.join(root, 'src/grammaire', name))
const { createRng } = load(path.join(root, 'src/math/rng.ts'))
const { GRAM_LESSONS_REVISED: lessons } = get('exercises/bank/lessons-revised.ts')
const { GRAM_LESSONS_PROTECTED: protectedLessons } = get('exercises/bank/lessons-protected.ts')
const { ALL_GRAM_SUBTHEMES, buildGrammairePracticeTypes } = get('exercises/catalog-exercises.ts')
const { tryGenerateGrammaireExerciseBlock: generate } = get('exercises/generate.ts')
const { gramExerciseFormUi } = get('exercises/qui-suis-je-ui.ts')
const { GRAMMAIRE_THEORY_DOCS: theory } = get('theory/index.ts')
const { validateTcfExercise } = load(path.join(root, 'src/tcf/validate.ts'))
const comm = get('exercises/communication.ts')
const illustrations = load(path.join(root, 'docs/grammaire/illustrations.json'))
let checks = 0
function check(condition, message) { assert.ok(condition, message); checks++ }
const normalize = text => text.normalize('NFC').toLocaleLowerCase('fr').replace(/[’']/g, "'").replace(/\s+/g, ' ').trim()
check(theory.length === 113, 'all theory ids retained')
for (const [file, hash] of Object.entries(load(path.join(root, 'scripts/grammar_curriculum/protected-theory-hashes.json')))) {
  check(crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex') === hash, 'protected theory ' + file)
}
const protectedTopics = new Set(['gram-se-presenter', 'gram-entrer-contact'])
const originalTheory = load(path.join(root, 'scripts/grammar_curriculum/theory-source.json')).docs
for (const doc of theory) {
  const original = originalTheory.find(d => d.typeId === doc.typeId)
  for (const field of ['id','typeId','index','title','topic','public','objectif']) {
    check(doc[field] === (doc.id === 'c4' && field === 'topic' ? 'gram-exclamation' : original[field]), `theory identity ${doc.typeId} ${field}`)
  }
  assert.deepEqual(doc.blocks, original.blocks, `restored theory ${doc.typeId}`)
}
// Imported listening contexts have audio supports, rather than new 50-question theory banks.
const audioSubthemes = new Set(get('exercises/co-bank.ts').grammarCoSubthemes().map(s=>s.id))
const subthemes = ALL_GRAM_SUBTHEMES.filter(s => !protectedTopics.has(s.topic) && !audioSubthemes.has(s.id))
assert.deepEqual(new Set(lessons.map(l => l.subId)), new Set(subthemes.map(s => s.id)))
const catalog = buildGrammairePracticeTypes()
check(lessons.length === 104, '104 rewritten subthemes')
check(protectedLessons.length === 7 && protectedLessons.every(l => l.items.length === 50), 'seven retained introductory banks of 50')
for (const les of [...lessons, ...protectedLessons]) {
  if (['c1', 'c2', 'c3'].includes(les.subId)) continue // Superseded by the two full-sentence question banks.
  check(les.items.length === 50, les.subId + ' pool size')
  check(new Set(les.items.map(row => normalize(row.prompt))).size === 50, les.subId + ' no repeated prompts')
  check(les.label.length <= 42, les.subId + ' short label')
  for (const row of les.items) {
    if (lessons.includes(les)) {
      check((row.prompt.match(/___/g) || []).length === 1, les.subId + ' one response')
      check(!/[\r\n]/.test(row.prompt), les.subId + ' one sentence item')
      check(row.prompt.length <= 200, les.subId + ' short prompt: ' + row.prompt)
    }
    if (row.options) {
      check(row.options.length === 3 && new Set(row.options).size === 3, les.subId + ' three distinct choices')
      check(row.options.filter(x => x === row.answer).length === 1, les.subId + ' one correct choice')
    }
  }
  const typeId = `gram-ex-${les.subId}-${les.kindId}`
  check(catalog.some(t => t.id === typeId), 'catalog includes ' + typeId)
  const config = { exerciseType: typeId, count: 50 }
  const result = generate(config, 917)
  check(result?.bankQuestionCap === 50, 'real cap ' + typeId)
  const questions = result.items.filter(i => i.tcf?.kind === 'qcm' || i.tcf?.kind === 'lignes')
  // Free writing in the retained introduction can have a different presentation.
  if (lessons.includes(les)) {
    check(questions.length === 50, 'all 50 usable questions ' + typeId)
    check(gramExerciseFormUi(typeId) === 'header2', 'one QCM / inline type ' + typeId)
    const inline = generate({ ...config, tcfFormModes: Array(51).fill('lignes') }, 917)
    const lines = inline.items.filter(i => i.tcf?.kind === 'lignes')
    check(lines.length === 50, 'inline selection ' + typeId)
    check(lines.every(i => i.tcf.nbLignes === 0 && i.tcf.reponseModele), 'inline answers in blanks ' + typeId)
    assert.deepEqual(generate(config, 917), result, 'stable seed ' + typeId)
    const one = generate({ ...config, count: 1 }, 2)
    check(one.items.filter(i => ['qcm','lignes'].includes(i.tcf?.kind)).length === 1, 'single-question selection ' + typeId)
  }
}
const modes = ['communication-ce', 'communication-pe', 'communication-po']
for (const group of comm.GRAM_COMMUNICATION_GROUPS) {
  if (group.subId === 'c2') continue // Replaced by the five dedicated open-question types.
  check(group.variants.length === 10, 'ten scenarios ' + group.subId)
  check(new Set(group.variants.map(v => normalize(v.text))).size === 10, 'ten different documents')
  for (const v of group.variants) {
    if (illustrations[v.id]) {
      const file = path.join(root, 'public', v.image)
      check(v.image === illustrations[v.id].image && fs.existsSync(file), 'reviewed illustration is used ' + v.id)
      check(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') === illustrations[v.id].sha256, 'illustration bytes retained ' + v.id)
    } else check(!v.image, 'no ungenerated placeholder is loaded ' + v.id)
    check(v.questions.length === 5, 'five short CE questions')
    for (const q of v.questions) {
      check(v.text.includes(q.answer), v.id + ' answer present in source: ' + q.answer)
      check(q.options.length === 3 && new Set(q.options).size === 3, v.id + ' three coherent choices')
    }
    check(v.pe.length <= 160 && v.po.length <= 160, 'one short production task ' + v.id)
    check(v.imageDescription.length > 30, 'future image description exists')
  }
  for (const kindId of modes) {
    const typeId = `gram-ex-${group.subId}-${kindId}`
    check(catalog.some(t => t.id === typeId), 'communication catalog entry ' + typeId)
    const seen = new Set()
    // Sample the real RNG to ensure all ten documents can actually be selected.
    for (let n = 1; n <= 150; n++) {
      const ex = comm.buildGrammarCommunication({ subId: group.subId, kindId, typeId, rng: createRng(n * 17713), count: 50 })
      check(validateTcfExercise(ex).errors.length === 0, 'valid TCF exercise ' + ex.id + ': ' + validateTcfExercise(ex).errors.join(';'))
      seen.add(ex.id)
      if (kindId !== 'communication-ce') {
        const visible = kindId === 'communication-pe' ? ex.consigne_supplementaire : ex.support.situation
        check(!visible.includes('Voici une phrase utile'), 'production model hidden')
      }
      if (group.variants.every(v => v.image)) {
        if (kindId === 'communication-ce') check(Boolean(ex.support.image), 'CE illustration rendered')
        if (kindId === 'communication-pe') check(ex.type_exercice === 'image_question' && Boolean(ex.support.image), 'PE illustration rendered')
        if (kindId === 'communication-po') check(ex.support.images?.length === 1, 'PO has one illustration')
      }
    }
    check(seen.size === 10, 'all variants reachable ' + typeId)
    const built = generate({ exerciseType: typeId, count: 50 }, 7331)
    check(built.items.length > 0, 'communication rendered ' + typeId)
    if (kindId === 'communication-ce') {
      check(built.items.filter(i => i.tcf?.kind === 'qcm').length === 5, 'five CE items')
      check(gramExerciseFormUi(typeId) === 'header2', 'CE format toggle')
    } else if (group.subId === 'modaux') check(built.items.filter(i => i.tcf?.kind === 'lignes').length === 50, 'fifty modal production prompts')
    else if (kindId === 'communication-pe') check(built.items.some(i => i.tcf?.kind === 'ecriture'), 'PE write area')
    else check(built.items.some(i => i.tcf?.kind === 'dialogue' && i.tcf.auCorrige === true), 'PO answer hidden on student sheet')
  }
}
// Language regressions that matter beyond structural validation.
const find = id => lessons.find(l => l.subId === id)
check(find('pronominaux').items.some(r => r.answer === 'se lève'), 'pronominal accented stem')
check(find('er-particuliers').items.some(r => /mangeons|commençons/.test(r.answer)), 'ger/cer forms')
check(find('pc-pronominaux').items.some(r => /lavé$/.test(r.answer) && /les mains/.test(r.prompt)), 'indirect reflexive body part')
check(find('accord-pp').items.some(r => r.answer === 'écrite'), 'preceding COD agreement')
check(find('f9').items.some(r => r.answer === 'meilleure'), 'irregular comparison')
check(find('i4').items.some(r => /^Le mécanicien ___ répare/.test(r.prompt)), 'multiword subject preserved')
check(find('f14').items.some(r => r.answer === 'autant d’' && /___appartements/.test(r.prompt)), 'quantified comparison elision')
check(find('e4').items.every(r => r.answer !== 'jamais' || /\bne |\bn’/.test(r.prompt)), 'negative frequency includes ne or n’')
check(find('pc-pronominaux').items.some(r => r.answer === 'se sont écrit'), 'reciprocal indirect object remains invariant')
check(find('c1').items.some(r => r.answer.startsWith('Regarde-t-elle')), 'question inversion with linking t')
check(find('i1').items.some(r => r.answer === 'où'), 'relative location covered')
check(find('k10').items.some(r => r.answer === 'prenne'), 'visible irregular subjunctive')
check(find('l8').items.find(r => r.answer === 'goût').options.every(o => o !== 'gout'), 'admitted spelling not a distractor')
const personal = generate({ exerciseType: 'gram-ex-a1-infos-perso', count: 50 }, 2)
check(personal.items.filter(i => i.tcf?.kind === 'lignes').length === 7, 'personal information retains all seven fields')
check(!personal.items.some(i => i.tcf?.kind === 'qcm'), 'personal answers are not arbitrarily graded by QCM')
const lonePast = generate({ exerciseType: 'gram-ex-pc-avoir-qcm-conj', count: 1 }, 4)
check(/passé composé/.test(lonePast.instruction), 'single question retains required tense')
const loneAdj = generate({ exerciseType: 'gram-ex-f7-qcm-verbe', count: 1 }, 4)
check(!/Conjuguez/.test(loneAdj.instruction), 'adjective cue never becomes verb instruction')
// Previously image-only family supports must remain answerable after the asset removal.
const { buildFamilleExercise } = load(path.join(root, 'src/grammaire/exercises/famille.ts'))
for (const kindId of ['fam-faire-part', 'fam-arbre', 'fam-photo', 'fam-email']) {
  for (const value of [.05, .25, .45, .65, .85]) {
    const ex = buildFamilleExercise({ kindId, typeId: `gram-ex-famille-${kindId}`, rng: () => value, count: 6 })
    check(ex.competence === 'CE' && ex.support.texte.length > 40, `${kindId} keeps a readable source`)
    check(kindId === 'fam-faire-part' ? fs.existsSync(path.join(root, 'public', ex.support.image)) : ex.support.image == null, `${kindId} uses only available images`)
    check(ex.questions.length > 0, `${kindId} keeps its questions`)
  }
}
// Introductory pronouns: one type, gender cues by the inline blank, both formats.
check(!catalog.some(t => t.id === 'gram-ex-a2-fill-conj'), 'duplicate pronoun type removed')
check(catalog.find(t => t.id === 'gram-ex-a2-qcm-verbe').label === 'Complétez le pronom', 'pronoun label')
const pronouns = protectedLessons.find(l => l.subId === 'a2')
check(pronouns.items.every(row => !/\([^)]*\)\.?$/.test(row.prompt)), 'subject cues moved away from sentence end')
check(pronouns.items.some(row => /___ \(Paul ♂ et Omar ♂\)/.test(row.prompt)), 'male cues next to blank')
check(pronouns.items.some(row => /___ \(Lina ♀ et Nadia ♀\)/.test(row.prompt)), 'female cues next to blank')
for (const typeId of ['gram-ex-a2-qcm-verbe', 'gram-ex-a3-nat-accorder']) {
  check(gramExerciseFormUi(typeId) === 'header2', 'QCM and inline selector ' + typeId)
  for (const format of ['qcm_texte', 'lignes']) {
    const result = generate({ exerciseType: typeId, count: 50, tcfFormModes: Array(51).fill(format) }, 17)
    const questions = result.items.filter(i => ['qcm','lignes'].includes(i.tcf?.kind))
    check(questions.length > 0 && questions.every(i => i.tcf.kind === (format === 'lignes' ? 'lignes' : 'qcm')), 'active format ' + typeId + format)
    if (format === 'lignes') check(questions.every(i => i.tcf.nbLignes === 0), 'inline rather than separate lines ' + typeId)
  }
}
const { buildQuiSuisJeExercise, QUI_SUIS_JE_KIND_IDS } = get('exercises/qui-suis-je.ts')
for (const kindId of QUI_SUIS_JE_KIND_IDS) {
  if (kindId === 'ordre') continue
  for (let seed = 1; seed <= 15; seed++) {
    const ex = buildQuiSuisJeExercise({ kindId, typeId: `gram-ex-a1-${kindId}`, rng: createRng(seed), count: 50 })
    check(ex.questions.every(q => !/…|\.{3}/.test(q.enonce)), 'question ellipses replaced ' + kindId)
  }
}
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { renderEnonceText, QuestionQCMTexte } = load(path.join(root, 'src/components/tcf/TcfQuestions.tsx'))
for (const text of ['___ (Lina ♀) est suisse.', '___ (masculin)', 'Je suis ___ aujourd’hui (féminin).', 'Transformez (masculin pluriel).']) {
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null, renderEnonceText(text)))
  check(html.includes('tcf-verbe-theme'), 'theme-colored cue ' + text)
}
const html = renderToStaticMarkup(React.createElement(QuestionQCMTexte, { numero: 1, enonce: 'Elle est ___.', choix: [], mode: 'student', blankStyle: 'line' }))
check(html.includes('tcf-blank-inline') && !html.includes('tcf-blank-dots'), 'QCM introductory answer line')
// Family possessives share a single catalog type and retain all three banks.
const familyTypes = catalog.filter(t => t.topic === 'gram-se-presenter' && t.id.startsWith('gram-ex-famille-'))
check(familyTypes.some(t => t.id === 'gram-ex-famille-fam-det' && t.label === 'Déterminants possessifs'), 'one possessive label')
check(!familyTypes.some(t => /fam-pronoms-[12]$/.test(t.id)), 'old possessive activities hidden')
for (const format of ['qcm_texte', 'lignes']) {
  const result = generate({ exerciseType: 'gram-ex-famille-fam-det', count: 100, tcfFormModes: Array(101).fill(format) }, 28)
  const questions = result.items.filter(i => ['qcm','lignes'].includes(i.tcf?.kind))
  check(questions.length === 35 && result.bankQuestionCap === 35, 'all 35 possessive questions retained')
  check(questions.some(i => /Ce n’est pas|Ce ne sont pas/.test(i.tcf.enonce)), 'second activity retained')
  check(questions.some(i => /C’est ___ mari/.test(i.tcf.enonce)), 'first activity retained')
  check(questions.every(i => i.tcf.kind === (format === 'lignes' ? 'lignes' : 'qcm')), 'possessive format ' + format)
}
const fairePart = buildFamilleExercise({ kindId: 'fam-faire-part', typeId: 'gram-ex-famille-fam-faire-part', rng: createRng(12), count: 6 })
assert.deepEqual(fairePart.support.texte.split('\n'), [
  'Julie et Thomas annoncent la naissance de leur fils Lucas.',
  'Lucas a un frère, Noah, et une sœur, Emma.',
  'Paul et Anne sont leurs grands-parents.',
])
const { TexteSupport } = load(path.join(root, 'src/components/tcf/TexteSupport.tsx'))
const birthHtml = renderToStaticMarkup(React.createElement(TexteSupport, { exercise: fairePart, mode: 'student' }))
check(birthHtml.includes('bebe.webp') && birthHtml.includes('is-image-bullets'), 'restored baby image in column layout')
check((birthHtml.match(/<li>/g) || []).length === 3, 'one bullet for each birth announcement sentence')
check(fairePart.questions.length === 6 && fairePart.questions.every(q => !/Jackie|Sara|Mina|Léo/.test(q.enonce)), 'questions match Lucas announcement')
check(familyTypes.at(-1).id === 'gram-ex-famille-fam-pe', 'family writing comes last')
const familyPe = buildFamilleExercise({ kindId: 'fam-pe', typeId: 'gram-ex-famille-fam-pe', rng: createRng(1), count: 50 })
check(familyPe.competence === 'PE' && familyPe.type_exercice === 'question_texte', 'family writing uses PE model')
check(validateTcfExercise(familyPe).errors.length === 0, 'valid PE family exercise')
const familyWriting = generate({ exerciseType: 'gram-ex-famille-fam-pe', count: 50 }, 5)
const writing = familyWriting.items.find(i => i.tcf?.kind === 'ecriture')
check(familyWriting.bankQuestionCap === 1 && writing?.tcf.cadre === 'message', 'single PE tablet writing area')
const { ZoneEcriture } = load(path.join(root, 'src/components/tcf/TcfProduction.tsx'))
const writingHtml = renderToStaticMarkup(React.createElement(ZoneEcriture, { ...writing.tcf, mode: 'student' }))
check(writingHtml.includes('tcf-phone-screen') && writingHtml.includes('Nombre de mots'), 'PE tablet and word counter rendered')
check(!writingHtml.includes('Je m’appelle Léa'), 'sample response hidden on student sheet')
// Combined family CE banks: authored documents, real TCF forms and manual pagination.
const { FAMILY_READING_TEXTS, FAMILY_MESSAGE_TEXTS, buildFamilyReading } = get('exercises/family-reading.ts')
check(!familyTypes.some(t => /fam-(arbre|recit)$/.test(t.id)), 'old reading types combined under Photo de famille')
check(familyTypes.find(t => t.id.endsWith('fam-photo')).label === 'Photo de famille', 'photo label retained')
check(familyTypes.find(t => t.id.endsWith('fam-email')).label === 'Message et email', 'message label')
check(familyTypes.find(t => t.id.endsWith('co-theme')).label === 'Compréhension orale', 'shared oral comprehension label')
check(new Set(FAMILY_MESSAGE_TEXTS.map(doc => doc.direction)).size === 2, 'sent and received messages')
check(new Set(FAMILY_MESSAGE_TEXTS.map(doc => doc.genre)).size === 2, 'messages and emails')
check(new Set(FAMILY_READING_TEXTS.map(doc => doc.genre)).size >= 10, 'varied reading genres')
for (const [messages, docs] of [[false, FAMILY_READING_TEXTS], [true, FAMILY_MESSAGE_TEXTS]]) {
  check(docs.length === 20 && new Set(docs.map(d => normalize(d.text))).size === 20, 'twenty unique authored documents')
  const typeId = `gram-ex-famille-${messages ? 'fam-email' : 'fam-photo'}`
  check(gramExerciseFormUi(typeId) === 'margin3', 'CE per-question formats ' + typeId)
  const selected = new Set()
  docs.forEach((doc, index) => {
    check(doc.text.length > 250 && doc.questions.length === 5, 'complete document ' + doc.slug)
    for (const q of doc.questions) {
      check(q.options.length === 3 && new Set(q.options).size === 3, 'distinct options ' + doc.slug)
      check(q.options.filter(o => o === q.answer).length === 1, 'one correct answer ' + doc.slug)
    }
    const ex = buildFamilyReading({ typeId, messages, count: 50, rng: () => (index + .5) / 20 })
    check(ex.competence === 'CE' && ex.id.endsWith(doc.slug), 'each document selectable ' + doc.slug)
    check(validateTcfExercise(ex).errors.length === 0, 'valid CE document ' + doc.slug)
    selected.add(ex.id)
    const supportHtml = renderToStaticMarkup(React.createElement(TexteSupport, { exercise: ex, mode: 'student' }))
    check(supportHtml.length > 200, 'readable support ' + doc.slug)
    for (const format of ['qcm_texte', 'lignes']) {
      const result = generate({ exerciseType: typeId, count: 5, tcfExercise: ex, tcfFormModes: Array(6).fill(format) }, 3)
      const qs = result.items.filter(i => ['qcm','lignes'].includes(i.tcf?.kind))
      check(qs.length === 5 && qs.every(i => i.tcf.kind === (format === 'lignes' ? 'lignes' : 'qcm')), 'all CE question formats ' + doc.slug)
    }
  })
  check(selected.size === 20, 'all twenty variants available')
}
const familyCorpus = normalize(FAMILY_READING_TEXTS.map(d => d.text).join(' '))
for (const term of ['père','mère','fils','fille','grand-père','grand-mère','oncle','tante','cousin','cousine','neveu','nièce']) check(familyCorpus.includes(term), 'kinship term ' + term)
const { buildWorksheets, buildPage } = load(path.join(root, 'src/math/generate.ts'))
const { defaultPage } = load(path.join(root, 'src/math/catalog.ts'))
for (const typeId of ['gram-ex-famille-fam-photo', 'gram-ex-famille-fam-email', 'gram-ex-c1-question-reading-ce']) {
  const config = { ...defaultPage('grammaire'), exerciseType: typeId, topic: typeId.includes('-c1-') ? 'gram-questions' : 'gram-se-presenter', count: 5 }
  const uncut = buildWorksheets([config], 44)
  check(uncut.length === 1 && uncut[0].items.length === 6, 'CE support plus five separate questions')
  for (let after = 0; after < 5; after++) {
    const split = buildWorksheets([{ ...config, tcfPageBreakAfter: Array.from({ length: 6 }, (_, i) => i === after) }], 44)
    check(split.length === 2, 'page break before question ' + (after + 1))
    assert.deepEqual(split.flatMap(p => p.items), uncut[0].items, 'break keeps text and question numbering')
    check(split[1].blocks[0].itemOffset === after + 1, 'continuation source offset')
  }
  const everyQuestion = buildWorksheets([{ ...config, tcfPageBreakAfter: [true,true,true,true,true] }], 44)
  check(everyQuestion.length === 6, 'each question can begin a page')
  const multi = { ...config, exerciseType: 'gram-ex-famille-fam-det', count: 2, extraBlocks: [
    { exerciseType: typeId, count: 5, tcfPageBreakAfter: [false,true] },
    { exerciseType: 'gram-ex-famille-fam-co', count: 2 },
  ] }
  const original = buildPage(multi, 44)
  const splitMulti = buildWorksheets([multi], 44)
  check(splitMulti.length === 2, 'manual break in second block')
  assert.deepEqual(splitMulti.flatMap(p => p.items), original.items, 'other exercise blocks retained')
  check(splitMulti[1].blocks[0].sourceBlockIndex === 1 && splitMulti[1].blocks[0].itemOffset === 2, 'continuation links original block and item')
}
// Being / having: fifty authored correction items and fifty phrases per level.
const { PRESENT_SUPPLEMENT_DATA, PRESENT_SUPPLEMENT_LESSONS } = get('exercises/present-supplement.ts')
const { joinPhrase } = load(path.join(root, 'src/francais/phrase-sentences.ts'))
const { PHRASE_COLORS } = load(path.join(root, 'src/francais/phrase-banks.ts'))
const { PhraseOrderBlock } = load(path.join(root, 'src/components/item-view/phrase.tsx'))
check(PRESENT_SUPPLEMENT_LESSONS.length === 33, 'three supplemental types for all eleven present subthemes')
for (const subId of Object.keys(PRESENT_SUPPLEMENT_DATA)) {
  const source = PRESENT_SUPPLEMENT_DATA[subId]
  check(source.corrections.length === 50 && new Set(source.corrections.map(row => row.prompt)).size === 50, 'fifty unique errors ' + subId)
  for (const row of source.corrections) {
    check(row.prompt !== row.answer, 'real conjugation error ' + row.prompt)
    check(source.a1.some(correct => correct.answer === row.answer), 'authored correction answer')
  }
  const correctionType = `gram-ex-${subId}-corriger-erreur`
  check(catalog.some(t => t.id === correctionType), 'correction catalog ' + subId)
  const correction = generate({ exerciseType: correctionType, count: 100 }, 3)
  check(correction.bankQuestionCap === 50 && correction.items.filter(i => i.tcf?.kind === 'lignes').length === 50, 'all fifty correction questions')
  check(correction.items.filter(i => i.tcf?.kind === 'lignes').every(i => i.tcf.nbLignes === (['etre','avoir'].includes(subId) ? 1 : 0) && i.tcf.reponseModele), 'rewrite entire corrected sentence')
  const allSentences = new Set()
  for (const level of ['a1','a2']) {
    check(source[level].length === 50, 'fifty ordering phrases ' + subId + level)
    for (const row of source[level]) {
      check(row.answer === joinPhrase(row.tokens), 'ordered answer reconstructs tokens')
      check(row.tokens.every(token => PHRASE_COLORS[token.category]), 'all Gattegno categories defined')
      check(row.tokens.some(token => token.category === 'verbe'), 'verb in every phrase')
      allSentences.add(row.answer)
    }
    const typeId = `gram-ex-${subId}-ordre-${level}`
    check(catalog.some(t => t.id === typeId), 'ordering type in catalog')
    const result = generate({ exerciseType: typeId, count: 100 }, 919)
    check(result.bankQuestionCap === 50 && result.items.length === 50, 'all fifty ordering tasks')
    for (const item of result.items) {
      check(item.layout === 'phrase-order' && item.tokens.length >= 3, 'Gattegno ordering layout')
      const original = source[level].find(row => row.answer === item.responseAnswer)
      assert.deepEqual(item.tokens.map(t => t.text).sort(), original.tokens.map(t => t.text).sort(), 'shuffle preserves all words')
      check(item.tokens.some((token, index) => token.text !== original.tokens[index].text), 'words always mixed')
    }
    assert.deepEqual(generate({ exerciseType: typeId, count: 100 }, 919), result, 'stable ordering seed')
    const studentHtml = renderToStaticMarkup(React.createElement(PhraseOrderBlock, { item: result.items[0], mode: 'student' }))
    const answerHtml = renderToStaticMarkup(React.createElement(PhraseOrderBlock, { item: result.items[0], mode: 'answers' }))
    check(studentHtml.includes('phrase-bubble') && studentHtml.includes('background-color'), 'colored Gattegno word bubbles')
    check(answerHtml.includes(result.items[0].responseAnswer.replace(/’/g, '’')), 'ordering answer shown in correction')
    check(generate({ exerciseType: typeId, count: 1 }, 2).items.length === 1, 'single ordering question')
  }
  check(allSentences.size === 100, 'A1 and A2 contain one hundred unique sentences per verb')
}
for (const sub of ALL_GRAM_SUBTHEMES.filter(row => row.topic === 'gram-present' && !audioSubthemes.has(row.id))) {
  check(PRESENT_SUPPLEMENT_DATA[sub.id], 'all present subthemes covered ' + sub.id)
  if (['etre','avoir','aller-destination'].includes(sub.id)) continue
  for (const kindId of ['ordre-a1','ordre-a2']) {
    const item = generate({ exerciseType: `gram-ex-${sub.id}-${kindId}`, count: 1 }, 2).items[0]
    check(Boolean(item.responseVerb), 'multi-verb category retains its infinitive')
    const html = renderToStaticMarkup(React.createElement(PhraseOrderBlock, { item, mode: 'student' }))
    check(html.indexOf('phrase-write-line') < html.indexOf('phrase-verb-hint'), 'infinitive to the right of the answer line')
    check(html.includes(`(${item.responseVerb})`) && html.includes('tcf-verbe-theme'), 'themed infinitive hint')
  }
  const correction = generate({ exerciseType: `gram-ex-${sub.id}-corriger-erreur`, count: 1 }, 2)
  const q = correction.items.find(item => item.tcf?.kind === 'lignes').tcf
  check(/___ \([^)]+\)/.test(q.enonce), 'correction infinitive follows the blank')
  const lesson = lessons.find(row => row.subId === sub.id)
  if (lesson.kindId === 'qcm-conj') {
    const result = generate({ exerciseType: `gram-ex-${sub.id}-qcm-conj`, count: 1 }, 2)
    check(result.items.some(item => /___\s*\(/.test(item.tcf?.enonce ?? '')), 'original single-question conjugation keeps infinitive')
  }
}
const presentSubthemes = ALL_GRAM_SUBTHEMES.filter(sub => sub.topic === 'gram-present')
check(presentSubthemes.find(sub => sub.id === 'modaux').label === 'Verbes modaux', 'modal subtheme renamed')
check(presentSubthemes.find(sub => sub.id === 'aller-destination').label === 'Aller', 'Aller subtheme renamed')
check(presentSubthemes.findIndex(sub => sub.id === 'aller-destination') + 1 === presentSubthemes.findIndex(sub => sub.id === 'er'), 'Aller immediately before -er verbs')
const { GRAMMAIRE_TOPICS, GRAMMAIRE_EXERCISE_TYPES, assertGrammaireCatalog } = get('catalog.ts')
assertGrammaireCatalog()
for (const [id, label] of [['c1','Questions fermées'], ['c2','Questions ouvertes'], ['c3','Questions avec quel']]) {
  const sub = ALL_GRAM_SUBTHEMES.find(row => row.id === id)
  check(sub.label === label && sub.topic === 'gram-questions', 'question subtheme label ' + id)
}
const questionTopicIndex = GRAMMAIRE_TOPICS.findIndex(topic => topic.id === 'gram-questions')
check(GRAMMAIRE_TOPICS[questionTopicIndex + 1].id === 'gram-exclamation', 'exclamation theme immediately below questions')
check(ALL_GRAM_SUBTHEMES.find(sub => sub.id === 'c4').topic === 'gram-exclamation', 'exclamation removed from questions subthemes')
check(GRAMMAIRE_EXERCISE_TYPES.filter(type => type.id === 'gram-c4-theorie' || type.id.startsWith('gram-ex-c4-')).every(type => type.topic === 'gram-exclamation'), 'exclamation theory and exercises in dedicated theme')
const { QUESTION_TRANSFORM_LESSONS } = get('exercises/question-transforms.ts')
const c1Types = catalog.filter(type => type.id.startsWith('gram-ex-c1-'))
assert.deepEqual(c1Types.map(type => type.label), ['Poser des questions avec est-ce que', 'Poser des questions avec l’inversion', 'Réponse affirmative', 'Réponse négative', 'Lire un texte (CE)', 'Lire un texte et écrire des questions'], 'six closed question types in requested order')
for (const lesson of QUESTION_TRANSFORM_LESSONS) {
  check(lesson.items.length === 50 && new Set(lesson.items.map(row => row.prompt)).size === 50, 'fifty affirmative prompts per method')
  check(lesson.items.every(row => !/___|est-ce que|inversion|Question avec|idée/.test(row.prompt) && row.prompt.endsWith('.')), 'affirmative phrase only in each prompt')
  const typeId = `gram-ex-c1-${lesson.kindId}`
  const result = generate({ exerciseType: typeId, count: 50 }, 21)
  const questions = result.items.filter(item => item.tcf?.kind === 'lignes')
  check(questions.length === 50 && questions.every(item => item.tcf.nbLignes === 1), 'one writing line below every affirmative sentence')
  check(!result.items.some(item => item.tcf?.kind === 'qcm'), 'written transformation rather than QCM')
  if (lesson.kindId === 'question-est-ce-que') {
    check(questions.every(item => /^Est-ce qu[e’]/.test(item.tcf.reponseModele)), 'all answers use est-ce que or elided est-ce qu’')
    check(lesson.items.some(item => /^Est-ce qu’il/.test(item.answer)), 'elision before il')
  } else {
    check(questions.every(item => /-(?:t-)?(?:tu|il|elle|nous|vous|ils|elles) /.test(item.tcf.reponseModele)), 'all answers use subject inversion')
    check(lesson.items.some(item => /-t-elle|-t-il/.test(item.answer)), 'inversion connecting t')
  }
}
const { renderSoutienInstruction } = load(path.join(root, 'src/components/generator/WorksheetSheet.tsx'))
for (const lesson of QUESTION_TRANSFORM_LESSONS) {
  const instructionHtml = renderToStaticMarkup(React.createElement('p', { className: 'exercise-instruction' }, renderSoutienInstruction(lesson.instruction)))
  check(instructionHtml.includes('class="det-choice"') && !instructionHtml.includes('[[em]]'), 'bold themed question instruction')
}
// Closed questions: full affirmative/negative replies, with one line below each question.
const { CLOSED_RESPONSE_LESSONS, CLOSED_QUESTION_READINGS, buildClosedQuestionReading } = get('exercises/closed-questions.ts')
const { QuestionLignes } = load(path.join(root, 'src/components/tcf/TcfQuestions.tsx'))
check(CLOSED_RESPONSE_LESSONS.length === 2, 'two reply banks')
for (const lesson of CLOSED_RESPONSE_LESSONS) {
  check(lesson.items.length === 50 && new Set(lesson.items.map(row => row.prompt)).size === 50, 'fifty distinct questions for ' + lesson.kindId)
  check(lesson.items.every(row => /^Est-ce qu[e’]/.test(row.prompt) && row.prompt.endsWith('?') && !row.prompt.includes('___')), 'question only above the reply line')
  const positive = lesson.kindId === 'response-affirmative'
  check(lesson.items.every(row => row.answer.startsWith(positive ? 'Oui, ' : 'Non, ')), 'all replies use requested polarity')
  if (!positive) {
    check(lesson.items.every(row => /\bne |n’/.test(row.answer) && row.answer.includes(' pas ')), 'complete ne…pas in every negative answer')
    check(lesson.items.some(row => row.answer.includes('pas d’attestation')), 'negative indefinite article and elision')
    check(lesson.items.some(row => row.answer.includes('pas de logement')), 'negative indefinite article de')
    check(lesson.items.some(row => row.answer.includes('pas la salade')), 'definite article retained after negation')
  }
  const result = generate({ exerciseType: `gram-ex-c1-${lesson.kindId}`, count: 100 }, 29)
  const questions = result.items.filter(item => item.tcf?.kind === 'lignes')
  check(result.bankQuestionCap === 50 && questions.length === 50, 'all fifty complete written replies')
  check(questions.every(item => item.tcf.nbLignes === 1 && item.tcf.reponseModele && !item.tcf.formSelect?.filled.some(form => form !== 'lignes')), 'one response line without QCM')
  assert.deepEqual(generate({ exerciseType: `gram-ex-c1-${lesson.kindId}`, count: 100 }, 29), result, 'stable question selection')
  const first = questions[0].tcf
  const student = renderToStaticMarkup(React.createElement(QuestionLignes, { ...first, mode: 'student' }))
  const corrected = renderToStaticMarkup(React.createElement(QuestionLignes, { ...first, mode: 'answers' }))
  check(student.includes('tcf-enonce') && student.indexOf('tcf-enonce') < student.indexOf('answer-line-field'), 'response line rendered below question')
  check(!student.includes(positive ? 'Oui, ' : 'Non, ') && corrected.includes(positive ? 'Oui, ' : 'Non, '), 'reply model only visible in correction')
}
check(CLOSED_QUESTION_READINGS.length === 20 && new Set(CLOSED_QUESTION_READINGS.map(doc => normalize(doc.text))).size === 20, 'twenty distinct closed-question CE texts')
const readingType = 'gram-ex-c1-question-reading-ce'
const selectedReadings = new Set()
CLOSED_QUESTION_READINGS.forEach((doc, index) => {
  check(doc.questions.length === 5 && new Set(doc.questions.map(q => q.affirmative)).size === 2, 'mixed yes and no answers in ' + doc.slug)
  check(doc.questions.every(q => doc.text.includes(q.evidence)), 'answers grounded in explicit evidence ' + doc.slug)
  check(doc.questions.every(q => q.answer.startsWith(q.affirmative ? 'Oui, ' : 'Non, ') && /^Est-ce qu[e’]/.test(q.prompt)), 'est-ce que and consistent model polarity ' + doc.slug)
  const ex = buildClosedQuestionReading({ typeId: readingType, rng: () => (index + .5) / 20, count: 50 })
  selectedReadings.add(ex.id)
  check(ex.id.endsWith(doc.slug) && ex.competence === 'CE' && ex.questions.length === 5, 'real CE text selection ' + doc.slug)
  check(validateTcfExercise(ex).errors.length === 0, 'valid closed-question CE ' + doc.slug)
  check(ex.questions.every(q => q.type_reponse === 'lignes' && q.nb_lignes === 1), 'CE lines below questions ' + doc.slug)
  const result = generate({ exerciseType: readingType, count: 5, tcfExercise: ex }, 41)
  check(result.items[0].tcf.kind === 'support' && result.items.filter(item => item.tcf?.kind === 'lignes').length === 5, 'CE document followed by written questions ' + doc.slug)
})
check(selectedReadings.size === 20, 'all reading variants selectable')
for (let seed = 1; seed <= 20; seed++) {
  for (const count of [2,3,4,5]) {
    const ex = buildClosedQuestionReading({ typeId: readingType, rng: createRng(seed), count })
    check(ex.questions.length === count && ex.questions.some(q => q.reponse_modele.startsWith('Oui, ')) && ex.questions.some(q => q.reponse_modele.startsWith('Non, ')), 'both polarities retained when selecting fewer questions')
  }
}
const generatedReading = generate({ exerciseType: readingType, count: 100 }, 88)
check(generatedReading.bankQuestionCap === 5 && generatedReading.items.length === 6, 'CE question cap and support')
assert.deepEqual(generate({ exerciseType: readingType, count: 100 }, 88), generatedReading, 'stable reading seed')
const singleReading = generate({ exerciseType: readingType, count: 1 }, 88)
check(singleReading.items.filter(item => item.tcf?.kind === 'lignes').length === 1, 'single CE question selection')
const { applyType } = load(path.join(root, 'src/components/generator/page-helpers.ts'))
check(applyType(c1Types.find(type => type.id === readingType)).count === 5, 'CE defaults to all five mixed questions')
const { OPEN_QUESTION_LESSONS } = get('exercises/open-questions.ts')
const { QUEL_QUESTION_LESSONS } = get('exercises/quel-questions.ts')
const openTypes = catalog.filter(type => type.id.startsWith('gram-ex-c2-'))
const quelTypes = catalog.filter(type => type.id.startsWith('gram-ex-c3-'))
assert.deepEqual(openTypes.map(type => type.label), ['Pronom interrogatif + est-ce que', 'Pronom interrogatif + inversion', 'Répondre à la question', 'Lire un texte (CE)', 'Lire un texte et écrire des questions'])
assert.deepEqual(quelTypes.map(type => type.label), ['Poser des questions avec quel', 'Répondre à la question avec quel', 'Lire un texte (CE)', 'Lire un texte et écrire des questions'])
for (const lesson of [...OPEN_QUESTION_LESSONS, ...QUEL_QUESTION_LESSONS]) {
  check(lesson.items.length === 50 && new Set(lesson.items.map(item => item.prompt)).size === 50, 'fifty unique prompts ' + lesson.kindId)
  const result = generate({ exerciseType: `gram-ex-${lesson.subId}-${lesson.kindId}`, count: 100 }, 37)
  const questions = result.items.filter(item => item.tcf?.kind === 'lignes')
  check(result.bankQuestionCap === 50 && questions.length === 50, 'all fifty items rendered ' + lesson.kindId)
  check(questions.every(item => item.tcf.nbLignes === 1 && item.tcf.reponseModele), 'full written response below prompt')
}
check(OPEN_QUESTION_LESSONS[0].items.find(item => item.prompt === 'Il va à l’école.').answer === 'Où est-ce qu’il va ?', 'requested open est-ce que example')
check(OPEN_QUESTION_LESSONS[1].items.find(item => item.prompt === 'Il va à l’école.').answer === 'Où va-t-il ?', 'requested open inversion example')
check(OPEN_QUESTION_LESSONS[2].items.find(item => item.prompt === 'Où déjeunez-vous ?').answer === 'Nous déjeunons au café.', 'open reply changes vous to nous')
check(QUEL_QUESTION_LESSONS[1].items.find(item => item.prompt === 'Quels documents apportez-vous ?').answer === 'Nous apportons nos passeports.', 'quel reply changes subject and possessive')
for (const word of ['Quel','Quelle','Quels','Quelles']) check(QUEL_QUESTION_LESSONS[0].items.some(item => new RegExp(word, 'i').test(item.answer)), 'all quel agreements ' + word)
const { QUESTION_READING_BANKS, buildQuestionReading } = get('exercises/question-reading.ts')
const { MODAL_READING_TEXTS, MODAL_PRODUCTION_SITUATIONS, tryBuildModalCommunication } = get('exercises/modal-communication.ts')
const allQuestionTexts = Object.values(QUESTION_READING_BANKS).flat()
check(allQuestionTexts.length === 60 && new Set(allQuestionTexts.map(doc => normalize(doc.text))).size === 60, 'sixty independently written question reading texts')
const stopWords = new Set('le la les un une de du des à au aux et en pour dans sur avec ce cette ces il elle ils elles nous vous on que qui est sont se son sa ses leur leurs ne pas a ont'.split(' '))
function vocabulary(text) { return new Set(normalize(text).match(/[\p{L}]+/gu).filter(word => !stopWords.has(word))) }
for (const [topic, docs] of [...Object.entries(QUESTION_READING_BANKS), ['modaux', MODAL_READING_TEXTS]]) {
  check(docs.length === 20 && new Set(docs.map(doc => doc.genre)).size >= 10, 'twenty texts in varied genres ' + topic)
  for (let i = 0; i < docs.length; i++) for (let j = i + 1; j < docs.length; j++) {
    const a = vocabulary(docs[i].text), b = vocabulary(docs[j].text)
    const common = [...a].filter(word => b.has(word)).length
    check(common / new Set([...a,...b]).size < .6, 'readings not copies with names swapped ' + topic + i + '-' + j)
  }
}
for (const [subId, docs] of Object.entries(QUESTION_READING_BANKS)) {
  for (const writing of [false,true]) {
    const typeId = `gram-ex-${subId}-question-reading-${writing ? 'write' : 'ce'}`
    check(applyType(catalog.find(type => type.id === typeId)).count === 5, 'five default questions ' + typeId)
    const seen = new Set()
    docs.forEach((doc,index) => {
      check(doc.questions.length === 5 && doc.questions.every(q => doc.text.includes(q.evidence)), 'explicit source evidence ' + subId + doc.slug)
      const ex = buildQuestionReading({ typeId, count: 50, rng: () => (index + .5) / 20 })
      check(ex.id.endsWith(doc.slug) && ex.questions.length === 5, 'each reading can be drawn ' + typeId + doc.slug)
      check(validateTcfExercise(ex).errors.length === 0, 'valid TCF reading ' + typeId + doc.slug)
      check(ex.questions.every(q => q.nb_lignes === 1 && q.type_reponse === 'lignes'), 'one line under each question or writing slot')
      if (writing) {
        check(ex.questions.every(q => q.enonce === 'Votre question :' && q.reponse_modele.endsWith('?')), 'write own questions without showing models')
      } else if (subId === 'c1') {
        check(ex.questions.some(q => q.enonce.startsWith('Est-ce ')) && ex.questions.some(q => !q.enonce.startsWith('Est-ce ')), 'closed CE mixes est-ce que and inversion')
        check(ex.questions.some(q => q.reponse_modele.startsWith('Oui,')) && ex.questions.some(q => q.reponse_modele.startsWith('Non,')), 'closed CE mixes positive and negative')
      } else {
        check(ex.questions.every(q => q.enonce.endsWith('?') && !q.reponse_modele.startsWith('Oui,')), 'open information questions and full answers')
        if (subId === 'c3') check(ex.questions.every(q => /\bquell?e?s?\b/i.test(q.enonce)), 'quel CE uses quel family in each question')
      }
      seen.add(ex.id)
    })
    check(seen.size === 20, 'twenty variants accessible ' + typeId)
    const config = { ...defaultPage('grammaire'), topic: 'gram-questions', exerciseType: typeId, count: 5 }
    const base = buildWorksheets([config], 72)
    const split = buildWorksheets([{ ...config, tcfPageBreakAfter: [true,true,true,true,true] }], 72)
    check(base.length === 1 && split.length === 6, 'break before every CE question ' + typeId)
    assert.deepEqual(split.flatMap(page => page.items), base[0].items, 'page breaks preserve all text, questions and answers')
  }
}
check(MODAL_PRODUCTION_SITUATIONS.length === 50 && new Set(MODAL_PRODUCTION_SITUATIONS.map(row => row.prompt)).size === 50, 'fifty modal production situations')
for (let i = 0; i < MODAL_READING_TEXTS.length; i++) {
  const doc = MODAL_READING_TEXTS[i]
  check(doc.questions.length === 5 && doc.questions.every(q => q.options.length === 3 && new Set(q.options).size === 3), 'modal CE question choices')
  const result = tryBuildModalCommunication({ typeId: 'gram-ex-modaux-communication-ce', kindId: 'communication-ce', count: 50, rng: () => (i + .5) / 20 })
  check(result.items[0].tcf.exercise.id.endsWith(doc.slug), 'each modal reading selectable')
}
// Enforce the requested bank sizes for every visible type in both themes.
for (const type of catalog.filter(type => ['gram-present','gram-questions'].includes(type.topic))) {
  const isReading = /question-reading-(?:ce|write)$/.test(type.id) || type.id === 'gram-ex-modaux-communication-ce'
  const result = generate({ exerciseType: type.id, count: 1000 }, 99)
  if (type.id.endsWith('-co-theme')) {
    check(result.bankQuestionCap === 0 && result.items.length === 1 && result.items[0].tcf?.kind === 'support', 'imported audio has no invented questions ' + type.id)
    continue
  }
  if (isReading) {
    check(result.bankQuestionCap === 5, 'CE has five questions per document ' + type.id)
  } else {
    check(result.bankQuestionCap === 50, 'exactly fifty questions in every non-CE type ' + type.id)
    const usable = result.items.filter(item => item.layout === 'phrase-order' || ['qcm','lignes'].includes(item.tcf?.kind))
    check(usable.length === 50, 'all fifty questions usable ' + type.id)
  }
}
console.log(`${checks} contrôles réussis : 113 théories, 40 lectures de famille, 33 banques supplémentaires du présent et 15 types d’exercices sur les questions.`)
