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
  if (!path.extname(file)) file = fs.existsSync(file + '.ts') ? file + '.ts' : path.join(file, 'index.ts')
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'))
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }; cache.set(file, module)
  let source = fs.readFileSync(file, 'utf8')
  // The same twelve JSON modules as Vite's eager glob, without a browser or mocks.
  source = source.replace("import.meta.glob('./content/*/*.json', { eager: true, import: 'default' })", "require('__tcf_content_glob__')")
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
  const req = (id) => {
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
    check(doc[field] === original[field], `theory identity ${doc.typeId} ${field}`)
  }
  if (protectedTopics.has(doc.topic)) continue
  for (const role of ['regarder','expliquer','retenir']) {
    check(doc.blocks.some(b => b.kind === 'section' && b.role === role), `${doc.typeId} visual section ${role}`)
  }
  const explain = doc.blocks.find(b => b.kind === 'section' && b.role === 'expliquer')
  check(explain.blocks.filter(b => b.kind === 'paragraph' && !b.text.startsWith('{ligne')).length >= 8, `${doc.typeId} developed explanation`)
  check(doc.blocks.some(b => b.kind === 'page'), `${doc.typeId} retained page division`)
}
const subthemes = ALL_GRAM_SUBTHEMES.filter(s => !protectedTopics.has(s.topic))
assert.deepEqual(new Set(lessons.map(l => l.subId)), new Set(subthemes.map(s => s.id)))
const catalog = buildGrammairePracticeTypes()
check(lessons.length === 104, '104 rewritten subthemes')
check(protectedLessons.length === 8 && protectedLessons.every(l => l.items.length === 50), 'eight existing banks topped up to 50')
for (const les of [...lessons, ...protectedLessons]) {
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
    } else if (kindId === 'communication-pe') check(built.items.some(i => i.tcf?.kind === 'ecriture'), 'PE write area')
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
console.log(`${checks} contrôles réussis : 105 théories réécrites, 104 banques de 50 phrases, 8 banques complétées, 480 variantes CE/PE/PO.`)
