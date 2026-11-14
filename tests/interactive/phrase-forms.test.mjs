import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile} from 'node:fs/promises'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createServer} from 'vite'
const vite=await createServer({cacheDir:'/tmp/clairfle-phrase-forms-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
const {passivePhrase,phraseSentence,phraseSyntaxRoles}=await vite.ssrLoadModule('/src/francais/phrase-forms.ts')
const {tagged,verbPersonOf}=await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
const {withNegation}=await vite.ssrLoadModule('/src/francais/phrase-negation.ts')
const {tryGeneratePhraseBatch}=await vite.ssrLoadModule('/src/francais/phrase.ts')
const {createRng}=await vite.ssrLoadModule('/src/math/rng.ts')
const {buildPage,buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
const {defaultPage,typesForTopic}=await vite.ssrLoadModule('/src/math/catalog.ts')
const {PHRASE_THEME_DEFS}=await vite.ssrLoadModule('/src/francais/phrase-themes.ts')
const {PhraseSvcBlock}=await vite.ssrLoadModule('/src/components/item-view/phrase-svc.tsx')
const {phraseImageClues,imageSubjectsForFrame}=await vite.ssrLoadModule('/src/francais/phrase-images.ts')
const page={...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-svc',count:6,columns:3,extraBlocks:undefined,verbGroup:'mixte'}
await test('S-V-C precedes the five existing formats in all seven themes',()=>{for(const theme of PHRASE_THEME_DEFS)assert.deepEqual(typesForTopic(theme.topic).map(type=>type.id.split('-').at(-1)),['svc','colorier','ordre','construire','images','ecrire'])})
await test('independent passive fixtures retain objects, agents, agreement and source tokens',()=>{
 for(const [source,id,expected]of [
 ['Elle/pronom écrit/verbe une/determinant lettre/nom','écrire','Une lettre est écrite par elle.'],
 ['Le/determinant voisin/nom lit/verbe les/determinant lettres/nom','lire','Les lettres sont lues par le voisin.'],
 ['Les/determinant enfants/nom mangent/verbe les/determinant pommes/nom','manger','Les pommes sont mangées par les enfants.'],
 ['Marie/nom ouvre/verbe la/determinant fenêtre/nom','ouvrir','La fenêtre est ouverte par Marie.'],
 ['Marie/nom prend/verbe les/determinant photos/nom','prendre','Les photos sont prises par Marie.']]){
  const tokens=tagged(source),before=structuredClone(tokens),passive=passivePhrase(tokens,[id]);assert.ok(passive);assert.equal(phraseSentence(passive),expected);assert.deepEqual(tokens,before)
 }
 assert.equal(passivePhrase(tagged('Elle/pronom parle/verbe à/preposition son/determinant ami/nom'),['parler']),undefined)
 assert.equal(passivePhrase(tagged('Elle/pronom se/pronom lave/verbe'),['se laver']),undefined)
})
await test('question and negation compose naturally with passive agreement',()=>{
 const active=tagged('Marie/nom écrit/verbe une/determinant lettre/nom'),passive=passivePhrase(active,['écrire'])
 assert.equal(phraseSentence(withNegation(passive,['être']),true),'Est-ce qu’une lettre n’est pas écrite par Marie ?')
 assert.equal(phraseSentence(tagged('J’/pronom écris/verbe une/determinant lettre/nom'),true),'Est-ce que j’écris une lettre ?')
})
await test('syntax correction circles whole subjects, excludes negative/reflexive clitics and underlines both passive parts',()=>{
 const source=tagged('La/determinant petite/adjectif fille/nom ne/adverbe se/pronom lave/verbe pas/adverbe')
 assert.deepEqual(phraseSyntaxRoles(source),['sujet','sujet','sujet',null,null,'verbe',null])
 const item={layout:'phrase-svc',tokens:source},student=renderToStaticMarkup(createElement(PhraseSvcBlock,{item,mode:'student'})),answer=renderToStaticMarkup(createElement(PhraseSvcBlock,{item,mode:'answers'}))
 assert.ok(!student.includes('phrase-svc-sujet'));assert.ok(answer.includes('La petite fille'));assert.ok(answer.includes('phrase-svc-verbe'))
 const passive=passivePhrase(tagged('Marie/nom lit/verbe les/determinant lettres/nom'),['lire'])
 assert.deepEqual(phraseSyntaxRoles(passive).slice(0,4),['sujet','sujet','verbe','verbe'])
})
await test('all six formats balance question types and voices independently of positive/negative polarity',()=>{
 for(const kind of ['svc','colorier','ordre','construire','images','ecrire'])for(const polarity of ['positive','negative','mixed']){
  const batch=tryGeneratePhraseBatch('phrase-simple-'+kind,6,createRng(678),'moyen','mixte',polarity,undefined,false,'mixed','mixed');assert.equal(batch.items.length,6)
  assert.equal(batch.items.filter(item=>item.phraseQuestion).length,3)
  if(kind==='svc'||kind==='colorier'||kind==='images')assert.equal(batch.items.filter(item=>item.tokens.some(token=>token.verbPart==='auxiliary')).length,3)
 }
 const impossible=tryGeneratePhraseBatch('phrase-pronominaux-svc',4,createRng(5),'moyen','mixte','positive',undefined,false,'interrogative','passive');assert.deepEqual(impossible.items,[]);assert.match(impossible.instruction,/Aucune construction/)
})
await test('form settings persist per block and Gattegno always renders one column',()=>{
 const config={...page,phraseSentenceType:'interrogative',phraseVoice:'passive',extraBlocks:[{...page,phraseSentenceType:undefined,phraseVoice:undefined,count:2}]},before=structuredClone(config)
 const rebuilt=buildPage(JSON.parse(JSON.stringify(config)),48)
 assert.equal(rebuilt.blocks[0].columns,1);assert.equal(rebuilt.blocks[1].columns,1)
 assert.ok(rebuilt.blocks[0].items.every(item=>item.phraseQuestion&&item.tokens.some(token=>token.verbPart==='auxiliary')))
 assert.ok(rebuilt.blocks[1].items.every(item=>!item.phraseQuestion&&!item.tokens.some(token=>token.verbPart==='auxiliary')))
 assert.equal(buildWorksheets([config],48).flatMap(sheet=>sheet.blocks).length,2);assert.deepEqual(config,before)
})
await test('objects can be subjects and image clues follow the exact source word order',()=>{
 const tokens=tagged('La/determinant voiture/nom roule/verbe sur/preposition la/determinant route/nom')
 assert.deepEqual(imageSubjectsForFrame({id:'rouler',preds:[]}),['La/determinant voiture/nom'])
 assert.equal(verbPersonOf('Les/determinant femmes/nom'),'ils')
 assert.deepEqual(phraseImageClues(tokens,['rouler']).map(clue=>clue.label),['voiture','rouler','sur','route'])
 assert.equal(phraseSentence(tokens),'La voiture roule sur la route.')
})
await test('every source verb has a real picture or an explicit pending generation entry',async()=>{
 const {ACTION_PICTOGRAMS}=await vite.ssrLoadModule('/src/francais/phrase-pictograms.ts'),{phraseSelection}=await vite.ssrLoadModule('/src/francais/phrase-options.ts')
 const images=new Map(ACTION_PICTOGRAMS.map(image=>[image.label,image.src])),verbs=new Set()
 for(const {topic}of PHRASE_THEME_DEFS)for(const frame of phraseSelection(topic,'mixte').frames){verbs.add(frame.id);for(const context of frame.contexts??[])if(context.rightId)verbs.add(context.rightId)}
 const pending=new Set(JSON.parse(await readFile('docs/gattegno/illustrations-en-attente.json','utf8')).pending.map(row=>row.label))
 for(const verb of verbs)assert.ok(images.has(verb)!==pending.has(verb),verb)
 assert.equal([...verbs].filter(verb=>!images.has(verb)).length,42)
 assert.equal(verbs.size,281)
})
await test('passive without prepositions omits the agent, and S-V-C stays teacher-led in the game',async()=>{
 const items=tryGeneratePhraseBatch('phrase-simple-svc',6,createRng(42),'moyen','mixte','negative',{preposition:false},false,'interrogative','passive').items
 assert.equal(items.length,6);for(const item of items)assert.ok(item.tokens.every(token=>token.category!=='preposition'))
 const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts'),{demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
 const recipe={...demoRecipe(),pages:[{...page,phraseVoice:'passive',phraseSentenceType:'interrogative'}]},game=convertRecipe(recipe)
 assert.equal(game.questions.length,6);assert.ok(game.questions.every(question=>question.mode==='oral'&&question.compatibility==='teacher-led'&&question.choices.length===0))
 assert.ok(game.questions.every(question=>!question.prompt.includes('à entourer')))
 assert.ok(Object.values(game.corrections).every(correction=>correction.text.includes('à entourer')))
})
}finally{await vite.close()}
