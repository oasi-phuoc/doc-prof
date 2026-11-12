const assert=require('node:assert/strict')
const fs=require('node:fs')
const {createHash}=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {contractFixture}=load(root+'/tests/grammar/fixtures/contracts.ts')
const {isGrammarSnapshot,validGrammarUnit,assertGrammarBank}=load(root+'/src/grammaire/curriculum/validation.ts')
const {generateGrammarSelection,grammarRequestKey}=load(root+'/src/grammaire/curriculum/generate.ts')
const {GRAMMAR_PILOT_BANKS}=load(root+'/src/grammaire/curriculum/registry.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {buildWorksheets}=load(root+'/src/math/generate.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {prepareGame}=load(root+'/src/interactive/domain/plan.ts')
const {blockItemsForConfig}=load(root+'/src/components/generator/sheet-items.ts')
const input=page=>({pages:[page],seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
const entries=[['closed',undefined,4],['open',undefined,1],['imageChoice','choice',1],['imageChoice','gap',1],['imageWriting',undefined,1]]
for(const [name,presentation,total] of entries) {
 const config=contractFixture(name,presentation),snapshot=config.grammarSnapshot
 assert(isGrammarSnapshot(snapshot))
 assert.deepEqual(generateGrammarSelection(config,839),snapshot)
 assert(snapshot.questions.every(q=>validGrammarUnit(q.unit)))
 assert(snapshot.questions.every(q=>!GRAMMAR_PILOT_BANKS.some(b=>b.units.some(u=>u.id===q.id))),'Technical fixtures must never count as a published or pilot bank.')
 const recipe=buildFicheRecipe(input(config)),restored=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)))
 assert(restored)
 assert.deepEqual(restored.pages[0].grammarSnapshot,snapshot)
 const archived=structuredClone(restored),page=archived.pages[0]
 page.grammarBankRevision='archived-technical'
 page.grammarSnapshot.bankRevision=page.grammarBankRevision
 page.grammarSnapshot.requestKey=grammarRequestKey(page)
 assert(parseFicheRecipe(archived))
 assert.deepEqual(generateGrammarSelection(page,839).questions,snapshot.questions)
 const game=convertRecipe(restored),prepared=prepareGame(game)
 assert.equal(game.questions.length,total)
 assert(game.questions.every(q=>!('answers' in q)&&!('correctId' in q)))
 assert(game.questions.every(q=>game.corrections[q.id]?.text))
 for(const q of prepared.questions.filter(q=>q.mode==='choice')) {
  assert.equal(q.choiceOrderPolicy,'fixed')
  assert.deepEqual(q.choices,game.questions.find(s=>s.id===q.id).choices)
 }
 if(name==='closed') {
  assert.equal(new Set(game.questions.map(q=>q.source.scenarioId)).size,2)
  assert(game.questions.every(q=>q.context.includes(' : ')))
  assert.equal(game.questions.filter(q=>q.compatibility==='auto').length,2)
  assert.equal(game.questions.filter(q=>q.compatibility==='teacher-led').length,2)
 }
 if(name==='open'||name==='imageWriting') {
  assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0&&!game.corrections[q.id].choiceId))
  assert(game.questions.every(q=>/Repères enseignant/.test(game.corrections[q.id].text)))
 }
 if(name.startsWith('image')) {
  assert(game.questions.every(q=>q.grammarImages.length===1&&q.images.length===0))
  const image=snapshot.questions[0].unit.imageSupports[0]
  const bytes=fs.readFileSync(root+'/public'+image.src)
  assert.equal(createHash('sha256').update(bytes).digest('hex'),image.sha256)
  assert.deepEqual(bytes,fs.readFileSync(root+'/public'+image.source.path))
  assert(game.questions.every(q=>q.grammarImages[0].sha256===image.sha256))
 }
}
const closed=contractFixture('closed'),snapshot=closed.grammarSnapshot
const childIds=sheets=>sheets.flatMap(s=>s.items.flatMap(i=>i.grammar?.scenarioPart?.kind==='question'?[i.grammar.scenarioPart.questionId]:[]))
const sheets=buildWorksheets([closed],839)
const candidates=sheets.find(s=>s.items.filter(i=>i.grammar?.scenarioPart?.kind==='question').length>1)
assert(candidates)
const first=candidates.items.find(i=>i.grammar?.scenarioPart?.kind==='question').grammar.scenarioPart.questionId
const broken={...closed,grammarPageBreakAfterQuestionIds:[first]},split=buildWorksheets([broken],839)
assert.deepEqual(generateGrammarSelection(broken,839),snapshot)
assert(split.length>sheets.length)
assert.deepEqual(childIds(split),childIds(sheets))
assert(split.every(s=>s.items[0].grammar.scenarioPart.kind==='support'))
const reassembled=blockItemsForConfig(split,0,0)
assert.equal(reassembled.items.filter(i=>i.grammar.scenarioPart.kind==='support').length,2)
assert.equal(reassembled.items.filter(i=>i.grammar.scenarioPart.kind==='question').length,4)
for(const change of ['role','question','blank','options','group','part','child-root-id']) {
 const bad=structuredClone(buildFicheRecipe(input(closed))),s=bad.pages[0].grammarSnapshot,u=s.questions[0].unit
 if(change==='role')u.turns[0].roleId='absent'
 if(change==='question')u.questions[1].id=u.questions[0].id
 if(change==='blank')u.turns[0].text='Réplique sans blanc.'
 if(change==='options') {
  const options=s.questions[0].scenarioOptions[u.questions[0].id]
  options[0]={...options[0],text:'Option étrangère'}
 }
 if(change==='group')s.groups[0].questionIds=['question absente']
 if(change==='part')s.questions[0].scenarioPart={kind:'question',questionId:u.questions[0].id,number:1}
 if(change==='child-root-id') {
  const old=u.questions[0].id
  u.questions[0].id=u.id
  u.turns.find(t=>t.questionId===old).questionId=u.id
  s.questions[0].scenarioOptions[u.id]=s.questions[0].scenarioOptions[old]
  delete s.questions[0].scenarioOptions[old]
  s.groups[0].questionIds[0]=u.id
 }
 assert.equal(parseFicheRecipe(bad),null,change)
}
for(const change of ['criteria','follow-ups','open-answers','image-url','image-hash','image-rights']) {
 const config=contractFixture(change.startsWith('image')?'imageChoice':'open'),bad=buildFicheRecipe(input(config)),u=bad.pages[0].grammarSnapshot.questions[0].unit
 if(change==='criteria')u.rubric=[]
 if(change==='follow-ups')u.followUps=[]
 if(change==='open-answers')u.answers=[]
 if(change==='image-url')u.imageSupports[0].src=u.imageSupports[0].source.path
 if(change==='image-hash')u.imageSupports[0].sha256='0'.repeat(64)
 if(change==='image-rights')u.imageSupports[0].source.rights='unknown'
 assert.equal(parseFicheRecipe(bad),null,change)
}
assert.throws(()=>assertGrammarBank({schemaVersion:1,activityId:closed.exerciseType,revision:'technical',level:'A1',presentations:['scenario-set'],instructions:{'scenario-set':snapshot.instruction},units:snapshot.questions.map(q=>q.unit),editorialStatus:'reviewed',review:{humanReview:'pending'}}),e=>e.code==='GRAMMAR_BANK_INVALID','Two fixture dialogues can never satisfy the 50-situation bank quota.')
console.log('Grammar contracts: closed/open scenarios, groups, mixed answers, immutable image bytes, archived recipes, page breaks and teacher-led productions verified. Fixtures are excluded from bank quotas.')
