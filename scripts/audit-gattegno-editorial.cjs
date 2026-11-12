/** Language regressions, semantic pairings and measured expansion since 9fccae6f. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { get, load, root } = require('./gattegno-loader.cjs')
const { phraseSelection } = get('phrase-options.ts')
const { frameForContext } = get('phrase-theme-frames.ts')
const { PHRASE_THEME_DEFS } = get('phrase-themes.ts')
const { PHRASE_DOMAINS, REVIEWED_SIMPLE, REVIEWED_ADJECTIVES, REVIEWED_PREPOSITIONS, predicateDomain } = get('phrase-reviewed-corpus.ts')
const { REVIEWED_REFLEXIVES } = get('phrase-reviewed-reflexives.ts')
const { phraseVerbGroupOf } = get('phrase-verb-groups.ts')
const { sentenceOf, instantiateThemeFrame, tagged, pronounsForFrame } = get('phrase-sentences.ts')
const { tryGeneratePhraseBatch } = get('phrase.ts')
const { conjugateCore, baseInfinitive } = get('phrase-conjugate.ts')
const { createRng } = load(path.join(root, 'src/math/rng.ts'))
const baseline = require('../docs/gattegno/expansion-baseline.json')
let checks = 0
function check(value, message) { assert.ok(value, message); checks++ }
const key = (id, c) => JSON.stringify([id, c.pred, c.rightId, c.rightPred])
function contextsFor(theme, group) {
  const { frames } = phraseSelection(theme, group)
  return [...new Map(frames.flatMap(frame => (frame.contexts ?? frame.preds.map(pred => ({ pred })))
    .map(context => [key(frame.id, context), { id: frame.id, ...context }]))).values()]
}
const report = {
  baselineCommit: baseline.sourceCommit,
  definition: 'Constructions sources distinctes (verbe, complément complet et éventuelle seconde action). Les sujets et les formes négatives ne sont pas comptés comme de nouvelles constructions.',
  banks: [], domains: [], uniqueConstructionsAcrossThemes: 0,
  correctedExamples: [
    'Je ne me souviens pas du rendez-vous.',
    'Je ne me rappelle pas la date du rendez-vous.',
    'Nous emportons notre sac.',
    'Je grimpe à un arbre.',
    'Je me sèche les mains mouillées.',
  ],
}
const all = new Map()
for (const before of baseline.banks) {
  const entries = contextsFor(before.theme, before.group)
  check(before.constructions ? entries.length >= 2 * before.constructions : entries.length >= 100,
    `bank doubled or newly available: ${before.theme}/${before.group}: ${entries.length}/${before.constructions}`)
  report.banks.push({ theme: before.theme, group: before.group, before: before.constructions, after: entries.length, ratio: before.constructions ? Number((entries.length / before.constructions).toFixed(2)) : null })
  if (before.group === 'mixte') for (const entry of entries) all.set(key(entry.id, entry), entry)
}
report.uniqueConstructionsAcrossThemes = all.size
if (baseline.uniqueConstructionsAcrossThemes) check(all.size >= 2 * baseline.uniqueConstructionsAcrossThemes, 'global bank doubled after deduplicating shared themes')

let instantiated = 0, coordinated = 0
for (const entry of all.values()) {
  check(!/grimpe\/verbe (?:un|une|le|la|l’)\/determinant|sait\/verbe une\/determinant recette\/nom|rappelle\/verbe le\/determinant rendez-vous\/nom|se_tait\/verbe chaque\/determinant matin\/nom/.test(entry.pred), 'awkward legacy construction removed: ' + entry.pred)
  check(tagged(entry.pred).filter(t => t.category === 'verbe').length === 1, 'one finite verb per source predicate')
  if (entry.rightPred) {
    check(baseInfinitive(entry.id) !== baseInfinitive(entry.rightId), 'different coordinated verb roots, including reflexive forms')
    check(phraseVerbGroupOf(entry.id) === phraseVerbGroupOf(entry.rightId), 'both clauses respect the verb-group setting')
    check(Boolean(predicateDomain(entry.id, entry.pred)) && predicateDomain(entry.id, entry.pred) === predicateDomain(entry.rightId, entry.rightPred), 'coordinated actions share a reviewed setting: ' + key(entry.id, entry))
    coordinated++
  }
  for (const subject of pronounsForFrame(entry.id, [entry.pred])) for (const theme of ['phrase-pronominaux', 'phrase-negation-pronominaux']) {
    const tokens = instantiateThemeFrame(theme, frameForContext(entry.id, entry), () => subject, preds => preds[0], () => 'La/determinant collègue/nom')
    const text = sentenceOf(tokens)
    check(!/(?<![\p{L}])(?:à le|à les|de le|de les|de un|de une)(?![\p{L}])|[Jj]’n’|\b(?:me|te|se) ne\b|_|\s{2}/u.test(text), 'contractions, clitics and spacing: ' + text)
    check(tokens.filter(t => t.category === 'verbe').length === (entry.rightPred ? 2 : 1), 'both complete actions retained: ' + text)
    instantiated++
  }
}

const say = (id, pred, subject = 'Je/pronom', negative = false) => sentenceOf(instantiateThemeFrame(negative ? 'phrase-negation-pronominaux' : 'phrase-pronominaux', { id, preds: [pred] }, () => subject, preds => preds[0]))
assert.equal(say('se souvenir', 'se_souvient/verbe du/preposition rendez-vous/nom', 'Je/pronom', true), 'Je ne me souviens pas du rendez-vous.'); checks++
assert.equal(say('se rappeler', 'se_rappelle/verbe la/determinant date/nom du/preposition rendez-vous/nom', 'Je/pronom', true), 'Je ne me rappelle pas la date du rendez-vous.'); checks++
for (const [subject, determiner] of [['Je/pronom','mon'],['Tu/pronom','ton'],['Nous/pronom','notre'],['Vous/pronom','votre'],['Ils/pronom','leur']]) {
  check(say('emporter','emporte/verbe son/determinant sac/nom',subject).includes(determiner + ' sac'), 'subject-owned possessive agrees')
}
assert.equal(say('s’offrir','s’offre/verbe un/determinant livre/nom pour/preposition son/determinant anniversaire/nom'), 'Je m’offre un livre pour mon anniversaire.'); checks++
assert.equal(say('se réunir','se_réunit/verbe avec/preposition ses/determinant collègues/nom','Nous/pronom'), 'Nous nous réunissons avec nos collègues.'); checks++
assert.equal(say('se choisir','se_choisit/verbe un/determinant livre/nom','Vous/pronom'), 'Vous vous choisissez un livre.'); checks++
for (const [id, third, person, expected] of [
  ['remplir','remplit','nous','remplissons'], ['réussir','réussit','ils','réussissent'],
  ['nourrir','nourrit','ils','nourrissent'], ['applaudir','applaudit','je','applaudis'],
  ['réunir','réunit','vous','réunissez'], ['rafraîchir','rafraîchit','nous','rafraîchissons'],
  ['salir','salit','nous','salissons'], ['agrandir','agrandit','vous','agrandissez'],
  ['assouplir','assouplit','tu','assouplis'], ['se réjouir','réjouit','nous','réjouissons'],
  ['se dégourdir','dégourdit','nous','dégourdissons'],
]) { assert.equal(conjugateCore(id,person,third), expected); checks++ }

for (const domain of Object.keys(PHRASE_DOMAINS)) {
  const examples = REVIEWED_SIMPLE.filter(entry => entry.domain === domain)
  const verbs = new Set(examples.map(entry => entry.id))
  check(examples.length >= 12 && verbs.size >= 2, 'meaningful lexical variety in ' + domain)
  report.domains.push({ id: domain, label: PHRASE_DOMAINS[domain], reviewedSimpleConstructions: examples.length, verbs: verbs.size,
    examples: examples.filter((_,i) => i === 0 || i === examples.length - 1).map(entry => say(entry.id,entry.pred)) })
}
for (const entries of [REVIEWED_SIMPLE, REVIEWED_ADJECTIVES, REVIEWED_PREPOSITIONS]) {
  check(new Set(entries.map(entry => key(entry.id, entry))).size === entries.length, 'curated regular supplement has no duplicates')
}
check(REVIEWED_REFLEXIVES.every(frame => new Set(frame.preds).size === frame.preds.length), 'curated reflexive complement lists are unique')

// All real UI groups, all category settings, all polarities and four layouts.
for (const { topic } of PHRASE_THEME_DEFS) for (const group of ['er','ir','autres','mixte']) for (let mask=0;mask<16;mask++) {
  const categories = Object.fromEntries(['adverbe','preposition','conjonction','adjectif'].map((category,bit) => [category,Boolean(mask & (1<<bit))]))
  const selection = phraseSelection(topic,group,categories)
  check(selection.frames.length > 0, 'no empty group/filter combination: ' + topic + group + mask)
  check(new Set(selection.frames.map(frame => frame.id)).size === selection.frames.length, 'one model per infinitive')
  for (const frame of selection.frames) {
    check(group === 'mixte' || phraseVerbGroupOf(frame.id) === group, 'correct left verb group')
    for (const context of frame.contexts ?? []) if (context.rightId) check(group === 'mixte' || phraseVerbGroupOf(context.rightId) === group, 'correct right verb group')
  }
  for (const polarity of ['positive','negative','mixed']) {
    let reference
    for (const kind of ['colorier','ordre','construire','ecrire']) {
      const batch = tryGeneratePhraseBatch(topic+'-'+kind,6,createRng(582+mask),'moyen',group,polarity,categories)
      check(batch.items.length === Math.min(6,selection.frames.length), 'available question count')
      const sentences = batch.items.map(item => kind === 'colorier' ? sentenceOf(item.tokens) : item.responseAnswer)
      if (kind === 'colorier') reference = sentences
      else { assert.deepEqual(sentences, reference, 'same sentences across formats'); checks++ }
    }
  }
}
report.coordinatedConstructions = coordinated
report.instantiationsChecked = instantiated
report.checks = checks
if (process.argv.includes('--write')) fs.writeFileSync(path.join(root,'docs/gattegno/editorial-expansion.json'),JSON.stringify(report,null,2)+'\n')
console.log(`${checks} contrôles ; ${all.size} constructions uniques hors sujets et négation ; ${instantiated} instanciations ; 27 banques au moins doublées et une nouvelle banque pronominale du deuxième groupe.`)
