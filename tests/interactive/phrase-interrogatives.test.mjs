import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({ cacheDir: '/tmp/clairfle-interrogatives-unit', server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { interrogativeCandidates } = await vite.ssrLoadModule('/src/francais/phrase-interrogatives.ts')
  const { tagged } = await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
  const { phraseSentence, phraseSyntaxRoles } = await vite.ssrLoadModule('/src/francais/phrase-forms.ts')
  const { passivePhrase } = await vite.ssrLoadModule('/src/francais/phrase-passive.ts')
  const { tryGeneratePhraseBatch } = await vite.ssrLoadModule('/src/francais/phrase.ts')
  const { createRng } = await vite.ssrLoadModule('/src/math/rng.ts')
  const { phraseImageClues } = await vite.ssrLoadModule('/src/francais/phrase-images.ts')
  const { PhraseSvcBlock } = await vite.ssrLoadModule('/src/components/item-view/phrase-svc.tsx')
  const { PhraseColorBlock } = await vite.ssrLoadModule('/src/components/item-view/phrase.tsx')
  const { adaptWordClassification } = await vite.ssrLoadModule('/src/interactive/domain/word-classification.ts')
  const { WordClassificationView } = await vite.ssrLoadModule('/src/interactive/components/WordClassificationView.tsx')
  const { competitionQuiz, parseCompetitionQuiz } = await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const { convertRecipe } = await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const { defaultPage } = await vite.ssrLoadModule('/src/math/catalog.ts')
  const { demoRecipe } = await vite.ssrLoadModule('/src/interactive/demo.ts')
  const get = (source, lemma, form, cats, picturedChoice=false) => {
    const result = interrogativeCandidates(tagged(source), [lemma], cats, picturedChoice).find(q => q.form === form)
    assert.ok(result, `${form}: ${source}`); return result
  }
  const sentence = q => phraseSentence(q.tokens, true, true)
  const item = q => ({ layout: 'phrase-color', tokens: q.tokens, phraseQuestion: true, phraseQuestionForm: q.form, answer: q.tokens.map(t => t.category).join(' · ') })

  await test('est-ce que is an explicit adverbial locution with its own printed classification and correct elision', () => {
    for (const [source, expected] of [['Il/pronom mange/verbe une/determinant pomme/nom', 'Est-ce qu’il mange une pomme ?'], ['Tu/pronom écris/verbe une/determinant lettre/nom', 'Est-ce que tu écris une lettre ?'], ['Je/pronom écris/verbe une/determinant lettre/nom', 'Est-ce que j’écris une lettre ?']]) {
      const q = get(source, 'manger', 'est-ce-que')
      assert.equal(sentence(q), expected); assert.equal(q.tokens[0].category, 'adverbe')
      const printed = renderToStaticMarkup(createElement(PhraseColorBlock, { item: item(q), mode: 'answers' }))
      assert.equal((printed.match(/Est-ce qu/g) ?? []).length, 1)
      const adapted = adaptWordClassification(item(q)); assert.equal(adapted.items[0].correctId, 'category-adverbe'); assert.equal(adapted.items.length, q.tokens.length)
    }
  })
  await test('pronoun inversions preserve persons, negative particles, reflexive clitics and the euphonic t', () => {
    for (const [source, lemma, expected] of [
      ['Il/pronom mange/verbe une/determinant pomme/nom','manger','Mange-t-il une pomme ?'],
      ['Tu/pronom prends/verbe un/determinant livre/nom','prendre','Prends-tu un livre ?'],
      ['Elle/pronom prend/verbe un/determinant livre/nom','prendre','Prend-elle un livre ?'],
      ['Elles/pronom finissent/verbe un/determinant exercice/nom','finir','Finissent-elles un exercice ?'],
      ['Tu/pronom ne/adverbe manges/verbe pas/adverbe de/determinant pain/nom','manger','Ne manges-tu pas de pain ?'],
      ['Nous/pronom nous/pronom lavons/verbe les/determinant mains/nom','se laver','Nous lavons-nous les mains ?'],
      ['Tu/pronom t’/pronom habilles/verbe','s’habiller','T’habilles-tu ?'],
    ]) assert.equal(sentence(get(source, lemma, 'inversion')), expected)
    assert.ok(!interrogativeCandidates(tagged('Je/pronom mange/verbe une/determinant pomme/nom'), ['manger']).some(q => q.form === 'inversion'))
  })
  await test('nominal inversions agree the reprise with the reviewed singular and plural subjects', () => {
    for (const [source, expected] of [
      ['La/determinant fille/nom chante/verbe','La fille chante-t-elle ?'],
      ['Le/determinant garçon/nom chante/verbe','Le garçon chante-t-il ?'],
      ['Les/determinant filles/nom chantent/verbe','Les filles chantent-elles ?'],
      ['Les/determinant hommes/nom chantent/verbe','Les hommes chantent-ils ?'],
      ['Marie/nom chante/verbe','Marie chante-t-elle ?'],
    ]) assert.equal(sentence(get(source, 'chanter', 'inversion')), expected)
  })
  await test('quel, quelle, quels and quelles are determiners and replace the original object article', () => {
    for (const [object, expected] of [['un/determinant manteau/nom', 'Quel manteau portes-tu ?'], ['une/determinant chemise/nom', 'Quelle chemise portes-tu ?'], ['des/determinant livres/nom', 'Quels livres portes-tu ?'], ['des/determinant fleurs/nom', 'Quelles fleurs portes-tu ?']]) {
      const q = get('Tu/pronom portes/verbe ' + object, 'porter', 'quel')
      assert.equal(sentence(q), expected); assert.equal(q.tokens[0].category, 'determinant'); assert.equal(q.tokens.filter(t => t.category === 'determinant').length, 1)
    }
    assert.equal(sentence(get('Tu/pronom embrasses/verbe son/determinant amie/nom','embrasser','quel')), 'Quelle amie embrasses-tu ?')
  })
  await test('lequel refers to the pictured backpack choice without repeating the noun', () => {
    const q=get('Tu/pronom choisis/verbe un/determinant sac/nom','choisir','lequel',undefined,true)
    assert.equal(sentence(q),'Lequel choisis-tu ?')
    assert.equal(q.tokens[0].category,'pronom')
  })
  await test('qui, que and quoi retain pronoun roles, remove their target and elide que before a vowel', () => {
    assert.equal(sentence(get('La/determinant voisine/nom chante/verbe une/determinant chanson/nom', 'chanter', 'qui')), 'Qui chante une chanson ?')
    assert.equal(sentence(get('Tu/pronom aides/verbe une/determinant voisine/nom', 'aider', 'qui')), 'Qui aides-tu ?')
    assert.equal(sentence(get('Tu/pronom manges/verbe une/determinant pomme/nom', 'manger', 'que')), 'Que manges-tu ?')
    assert.equal(sentence(get('Il/pronom aime/verbe une/determinant chanson/nom', 'aimer', 'que')), 'Qu’aime-t-il ?')
    assert.equal(sentence(get('Marie/nom mange/verbe une/determinant pomme/nom', 'manger', 'que')), 'Que mange Marie ?')
    assert.equal(sentence(get('Tu/pronom penses/verbe à/preposition une/determinant histoire/nom', 'penser', 'quoi')), 'À quoi penses-tu ?')
    assert.equal(sentence(get('Tu/pronom rêves/verbe de/preposition la/determinant mer/nom', 'rêver', 'quoi')), 'De quoi rêves-tu ?')
    for (const q of [get('Tu/pronom manges/verbe une/determinant pomme/nom','manger','que'),get('Tu/pronom penses/verbe à/preposition une/determinant histoire/nom','penser','quoi')]) assert.ok(q.tokens.some(t => t.category === 'pronom' && /^(?:que|qu’|quoi)$/i.test(t.text)))
  })
  await test('où and d’où remove an actual spatial complement without confusing topics or transport', () => {
    assert.equal(sentence(get('La/determinant fille/nom joue/verbe dans/preposition le/determinant parc/nom','jouer','où')), 'Où la fille joue-t-elle ?')
    assert.equal(sentence(get('Il/pronom vient/verbe de/preposition l’/determinant école/nom','venir','où')), 'D’où vient-il ?')
    for (const [s, lemma] of [['Il/pronom pense/verbe à/preposition l’/determinant école/nom','penser'],['Il/pronom voyage/verbe en/preposition train/nom','voyager']]) assert.ok(!interrogativeCandidates(tagged(s),[lemma]).some(q => q.form === 'où'))
  })
  await test('quand, comment, combien and pourquoi are adverbs with no repeated time, manner or counted object', () => {
    for (const [source, lemma, form, expected] of [
      ['Tu/pronom manges/verbe le/determinant matin/nom','manger','quand','Quand manges-tu ?'],
      ['Tu/pronom écris/verbe très/adverbe vite/adverbe','écrire','comment','Comment écris-tu ?'],
      ['Tu/pronom manges/verbe des/determinant pommes/nom','manger','combien','Combien de pommes manges-tu ?'],
      ['Tu/pronom chantes/verbe une/determinant chanson/nom','chanter','pourquoi','Pourquoi chantes-tu une chanson ?'],
    ]) { const q = get(source,lemma,form);assert.equal(sentence(q),expected);assert.equal(q.tokens[0].category,'adverbe') }
  })
  await test('S-V-C keeps complete nominal subjects and finite/passive verbs after question movement', () => {
    const q = get('La/determinant petite/adjectif fille/nom ne/adverbe mange/verbe pas/adverbe de/determinant pain/nom','manger','pourquoi')
    const roles = phraseSyntaxRoles(q.tokens)
    assert.deepEqual(q.tokens.filter((_, i) => roles[i] === 'sujet').map(t => t.text), ['la','petite','fille'])
    assert.deepEqual(q.tokens.filter((_, i) => roles[i] === 'verbe').map(t => t.text), ['mange'])
    const sv = { ...item(q), layout: 'phrase-svc' }, student = renderToStaticMarkup(createElement(PhraseSvcBlock, { item: sv, mode: 'student' })), correction = renderToStaticMarkup(createElement(PhraseSvcBlock, { item: sv, mode: 'answers' }))
    assert.ok(!student.includes('phrase-svc-sujet'));assert.ok(correction.includes('la petite fille'));assert.ok(!correction.includes('Est-ce'))
    const passive = passivePhrase(tagged('Marie/nom écrit/verbe une/determinant lettre/nom'),['écrire'])
    const p = interrogativeCandidates(passive,['écrire']).find(q => q.form === 'pourquoi')
    assert.equal(sentence(p), 'Pourquoi une lettre est-elle écrite par Marie ?')
    assert.deepEqual(p.tokens.filter((_, i) => phraseSyntaxRoles(p.tokens)[i] === 'verbe').map(t => t.text), ['est','écrite'])
    assert.equal(phraseSentence(passivePhrase(tagged('Elles/pronom rangent/verbe parfois/adverbe leur/determinant chambre/nom'),['ranger'])), 'Leur chambre est parfois rangée par elles.')
  })
  await test('all six formats use varied tagged questions reproducibly and keep independent polarity and voice settings', () => {
    const seen = new Set()
    for (const kind of ['svc','colorier','ordre','construire','images','ecrire']) for (const theme of ['simple','determinants','pronominaux','preposition','adverbe','adjectif','conjonctions']) for (let seed = 1; seed <= 12; seed++) {
      const generate = () => tryGeneratePhraseBatch(`phrase-${theme}-${kind}`, 6, createRng(seed), 'moyen','mixte','mixed',undefined,false,'mixed','mixed')
      const batch = generate();assert.deepEqual(batch,generate());assert.equal(batch.items.length,6)
      assert.equal(batch.items.filter(i => i.phraseQuestion).length,3)
      for (const i of batch.items.filter(i => i.phraseQuestion)) { assert.ok(i.phraseQuestionForm);seen.add(i.phraseQuestionForm);assert.ok((kind==='colorier'?phraseSentence(i.tokens,true,true):i.responseAnswer).endsWith(' ?'));if(kind==='colorier')assert.equal(i.answer,i.tokens.map(t=>t.category).join(' · ')) }
    }
    for (const form of ['est-ce-que','inversion','qui','que','quoi','quel','où','quand','comment','combien','pourquoi']) assert.ok(seen.has(form),form)
  })
  await test('category exclusions remain effective and image clues retain the interrogative determiner and subject order', () => {
    const source = tagged('Tu/pronom manges/verbe des/determinant pommes/nom'), before = structuredClone(source)
    const q = interrogativeCandidates(source,['manger'],{adverbe:false}).find(q=>q.form==='quel')
    assert.ok(q);assert.ok(interrogativeCandidates(source,['manger'],{adverbe:false}).every(q=>q.tokens.every(t=>t.category!=='adverbe')))
    assert.ok(!interrogativeCandidates(source,['manger'],{preposition:false}).some(q=>q.form==='combien'))
    assert.deepEqual(phraseImageClues(q.tokens,['manger']).map(c=>c.label),['Quelles','pommes','manger','tu'])
    assert.deepEqual(source,before)
  })
  await test('neutral classification displays inversion links, includes new word categories and transports no source roles', () => {
    const q = get('Il/pronom mange/verbe une/determinant pomme/nom','manger','pourquoi'), adapted = adaptWordClassification(item(q)), target = q.tokens.findIndex(t=>t.text==='il')
    const entry = adapted.items[target], html = renderToStaticMarkup(createElement(WordClassificationView,{classification:entry.classification}))
    assert.equal(entry.correctId,'category-pronom');assert.ok(html.includes('-t-'));assert.ok(!html.includes('data-category'));assert.equal(entry.classification.prefix,undefined)
    const game = { id:'question-classification',title:'Questions',questions:adapted.items.map((e,i)=>({id:'q'+i,source:{page:1,block:1,item:1,part:i,exerciseType:'phrase-simple-colorier'},title:'Tri',instruction:'Classez.',prompt:e.prompt,mode:'choice',compatibility:'auto',images:[],choices:e.choices,wordClassification:e.classification})),corrections:Object.fromEntries(adapted.items.map((e,i)=>['q'+i,{choiceId:e.correctId,text:e.model}])),issues:[] }
    const bundle=competitionQuiz(game,'https://clairfle.test/'),parsed=parseCompetitionQuiz(bundle)
    assert.deepEqual(parsed.items[target].question.wordClassification, entry.classification)
    assert.ok(!JSON.stringify(bundle.items.map(q=>q.question)).includes('syntaxRole'))
    for (const bad of [['wrong'],q.tokens.map(()=>'+'),q.tokens.map(()=>null)]) { const altered=structuredClone(bundle);altered.items[target].question.wordClassification.joins=bad;assert.throws(()=>parseCompetitionQuiz(altered)) }
  })
  await test('new image and S-V-C questions enter the game once without a second interrogative prefix or automatic evaluation', () => {
    for(const exerciseType of ['phrase-simple-svc','phrase-simple-images']){
      const recipe={...demoRecipe(),seed:41,pages:[{...defaultPage('gattegno'),topic:'phrase-simple',exerciseType,count:6,phraseSentenceType:'interrogative',verbGroup:'mixte',extraBlocks:undefined}]},before=structuredClone(recipe)
      const converted=convertRecipe(recipe);assert.equal(converted.questions.length,6)
      for(const q of converted.questions){assert.equal(q.mode,'oral');assert.equal(q.compatibility,'teacher-led');assert.equal(q.phraseImagePrefix,undefined);assert.equal(q.choices.length,0)}
      assert.deepEqual(recipe,before)
    }
  })
} finally { await vite.close() }
