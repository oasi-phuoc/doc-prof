const assert=require('node:assert/strict')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {generateGrammarSelection:select,generateGradedGrammarBlock,grammarEligibleCount}=load(root+'/src/grammaire/curriculum/generate.ts')
const {isGrammarSnapshot,isGrammarQuestion}=load(root+'/src/grammaire/curriculum/validation.ts')
const {tryGenerateGrammaireBlock:generate}=load(root+'/src/grammaire/generate.ts')
const {isProtectedGrammarCo}=load(root+'/src/grammaire/curriculum/types.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {pageAsConfig,pageBlocks}=load(root+'/src/math/page-model.ts')
const {buildPage,buildWorksheets}=load(root+'/src/math/generate.ts')
const {adaptSourceItem}=load(root+'/src/interactive/domain/source-adapters.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {prepareGame}=load(root+'/src/interactive/domain/plan.ts')
const {grammarItems}=load(root+'/src/grammaire/curriculum/items.ts')
const base=(id='gram-ex-etre-qcm-conj')=>({domain:'grammaire',topic:'gram-present',exerciseType:id,difficulty:'facile',columns:1,count:6,...defaultGrammarPilot(id)})
const {typeChoicesForBlock}=load(root+'/src/components/generator/generator-derived.ts')
assert(typeChoicesForBlock('grammaire',base()).some(t=>t.id==='gram-ex-etre-curriculum-a'))
assert(!typeChoicesForBlock('grammaire',{...base(),exerciseType:'gram-ex-avoir-qcm-conj'}).some(t=>t.id==='gram-ex-etre-curriculum-a'))
const recipeInput=pages=>({pages,seed:839,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
const targetRegistry=load(root+'/docs/grammaire/implementation/target-registry.json')
let variants=0
for (const bank of banks) {
 const reading=bank.presentations.includes('document-set')
 assert.equal(bank.units.length,reading?20:50)
 assert.equal(bank.review.humanReview,'pending')
 for (const presentation of bank.presentations) {
  assert.equal(targetRegistry.offerings.filter(o=>o.activityId===bank.activityId&&o.level===bank.level&&o.presentation===presentation).length,1,'A pilot offering must belong to the agreed curriculum.')
  const block={...base(bank.activityId),topic:bank.topic??'gram-present',count:reading?1:50,grammarDocumentCount:reading?20:undefined,grammarLevel:bank.level,grammarBankRevision:bank.revision,grammarPresentation:presentation}
  const selected=select(block,839)
  assert(isGrammarSnapshot(selected))
  assert.equal(selected.questions.length,bank.units.length)
  assert.equal(new Set(selected.questions.map(q=>q.id)).size,bank.units.length)
  assert.deepEqual(select(block,839),selected)
  assert.notDeepEqual(select(block,840).questions.map(q=>q.id),selected.questions.map(q=>q.id))
  assert(selected.questions.every(q=>q.presentation===presentation))
  assert.equal(grammarEligibleCount(block),bank.units.length)
  for (const q of selected.questions) {
   assert(isGrammarQuestion(q))
   const parts=grammarItems({...selected,questions:[q]})
   const adapted={items:[],issues:[]}
   for(const part of parts) {
    const result=adaptSourceItem(part,block.exerciseType,selected.instruction)
    assert(result);adapted.items.push(...result.items);adapted.issues.push(...result.issues)
   }
   assert(adapted && adapted.items.length>0)
   assert(!adapted.issues.some(s=>/invalide|non vérifiable/.test(s)))
   if(presentation==='choice') assert(adapted.items[0].choices.some(c=>c.id===adapted.items[0].correctId))
   if(presentation==='order') {
    assert.notDeepEqual(q.tokens.map(t=>t.text),q.unit.tokens.map(t=>t.text))
    assert.equal(adapted.items[0].mode,'sequence')
   }
   if(q.unit.givenVerb) {
    if(presentation==='choice'||presentation==='gap') assert(adapted.items[0].prompt.includes(`___ (${q.unit.givenVerb})`))
    else assert((adapted.items[0].prompt+' '+adapted.items[0].instruction).includes(`(${q.unit.givenVerb})`))
   }
   if(presentation==='transform') {
    assert.equal(adapted.items[0].teacherLed,true)
    if(q.unit.targetSubject) {
     assert(adapted.items[0].instruction.includes(q.unit.targetSubject))
     assert(adapted.items[0].prompt.includes(`Réécrivez avec le sujet « ${q.unit.targetSubject} ».`))
    } else assert(adapted.items[0].prompt.includes(q.unit.directive))
    assert.equal(adapted.items[0].correctId,undefined)
    assert(adapted.items[0].model.includes(q.unit.answers[0]))
   }
  }
  const sheets=buildWorksheets([block],839)
  assert(sheets.length>1)
  if(reading) {
   assert.deepEqual(sheets.flatMap(s=>s.items.filter(i=>i.grammar.readingPart.kind==='question').map(i=>i.grammar.readingPart.questionId)),selected.questions.flatMap(q=>q.unit.questions.map(c=>c.id)))
   assert(sheets.every(s=>s.items[0].grammar.readingPart.kind==='support'))
  } else assert.deepEqual(sheets.flatMap(s=>s.items.map(i=>i.grammar.id)),selected.questions.map(q=>q.id))
  assert(sheets.every(s=>s.blocks[0].sourceBlockIndex===0))
  const recipe=buildFicheRecipe(recipeInput([block]))
  assert(isGrammarSnapshot(recipe.pages[0].grammarSnapshot))
  const roundTrip=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)))
  assert(roundTrip)
  assert.deepEqual(roundTrip.pages[0].grammarSnapshot,recipe.pages[0].grammarSnapshot)
  assert.deepEqual(buildPage(roundTrip.pages[0],839).items,buildPage(block,839).items)
  const game=convertRecipe(roundTrip)
  assert.equal(game.questions.length,reading?60:presentation==='match'?150:50)
  assert(game.questions.every(q=>!('answer' in q)&&!('correctId' in q)))
  assert(game.questions.every(q=>game.corrections[q.id]?.text))
  const prepared=prepareGame(game)
  for (const q of prepared.questions.filter(q=>q.mode==='choice')) {
   assert.equal(q.choiceOrderPolicy,'fixed')
   assert.deepEqual(q.choices,game.questions.find(original=>original.id===q.id).choices,'Paper option letters stay identical at the board.')
  }
  variants+=reading?selected.questions.reduce((n,q)=>n+q.unit.questions.length,0):selected.questions.length
 }
}
// m5 follows the approved matrix: Q/L and order at both levels, C/T at A2.
const m5='gram-ex-er-particuliers-'
const m5Banks=banks.filter(b=>b.activityId.startsWith(m5))
assert.equal(m5Banks.length,6)
assert.equal(m5Banks.reduce((sum,b)=>sum+b.presentations.length*50,0),400)
const {grammarBanksForType,GRAMMAR_NEW_PILOT_TYPES}=load(root+'/src/grammaire/curriculum/registry.ts')
assert.deepEqual(grammarBanksForType(m5+'corriger-erreur').map(b=>b.level),['A2'])
assert.deepEqual(grammarBanksForType(m5+'curriculum-t').map(b=>b.level),['A2'])
assert.equal(GRAMMAR_NEW_PILOT_TYPES.filter(t=>t.id===m5+'curriculum-t').length,1)
assert.equal(typeChoicesForBlock('grammaire',base(m5+'qcm-conj')).filter(t=>t.id===m5+'curriculum-t').length,1)
assert(!typeChoicesForBlock('grammaire',base()).some(t=>t.id===m5+'curriculum-t'))
const grade=(suffix,level)=>{
 const b=grammarBanksForType(m5+suffix).find(b=>b.level===level)
 return {...base(b.activityId),grammarLevel:level,grammarBankRevision:b.revision}
}
for(const level of ['A1','A2']) {
 const block=grade('qcm-conj',level)
 const choice=select(block,71),gap=select({...block,grammarPresentation:'gap'},71)
 assert.deepEqual(choice.questions.map(q=>q.unit),gap.questions.map(q=>q.unit),'QCM and gap use the same sources at each level.')
}
const a2=grade('qcm-conj','A2'),a1=grade('qcm-conj','A1')
assert.notDeepEqual(select(a1,71).questions.map(q=>q.id),select(a2,71).questions.map(q=>q.id))
assert.throws(()=>select({...a2,grammarLevel:'B1'},71),e=>e.code==='GRAMMAR_ACTIVITY_UNAVAILABLE')
const fullOrder=select({...grade('ordre','A2'),count:50},71)
assert(fullOrder.questions.every(q=>q.tokens.every(t=>t.category!=='negation')))
const transform=buildFicheRecipe(recipeInput([{...grade('curriculum-t','A2'),count:50}]))
const malformedTransform=structuredClone(transform)
delete malformedTransform.pages[0].grammarSnapshot.questions[0].unit.targetSubject
assert.equal(parseFicheRecipe(malformedTransform),null)
const malformedHint=structuredClone(transform)
malformedHint.pages[0].grammarSnapshot.questions[0].unit.givenVerb=''
assert.equal(parseFicheRecipe(malformedHint),null)
const payForms=banks.flatMap(b=>b.units).filter(u=>u.kind==='completion'&&u.answers.includes('paie'))
assert(payForms.length>0 && payForms.every(u=>u.answers.includes('paye')))
// h8 selects documents, preserves all child questions and paginates by stable ID.
const h8='gram-ex-imparfait-ou-pc-'
const h8Base=suffix=>({...base(h8+suffix),topic:'gram-passe'})
const read={...h8Base('communication-ce'),count:1,grammarDocumentCount:2}
const readSelection=select(read,839)
assert.equal(readSelection.questions.length,2)
assert.equal(readSelection.groups.length,2)
assert.equal(readSelection.groups.flatMap(g=>g.questionIds).length,6)
assert.deepEqual(select({...read,count:9},839),readSelection,'The old question count never selects CE documents.')
assert.throws(()=>select({...read,grammarDocumentCount:21},839),e=>e.code==='GRAMMAR_CONFIG_INVALID')
const plainPages=buildWorksheets([read],839)
const splitTarget=plainPages.find(s=>s.items.filter(i=>i.grammar.readingPart.kind==='question').length>1)
assert(splitTarget,'At least one continuation can hold two short questions.')
const firstChild=splitTarget.items.find(i=>i.grammar.readingPart.kind==='question').grammar.readingPart.questionId
const withBreak={...read,grammarPageBreakAfterQuestionIds:[firstChild]}
assert.deepEqual(select(withBreak,839),readSelection,'Page breaks never redraw content or options.')
const brokenPages=buildWorksheets([withBreak],839)
assert(brokenPages.length>plainPages.length)
const childIds=sheets=>sheets.flatMap(s=>s.items.filter(i=>i.grammar?.readingPart?.kind==='question').map(i=>i.grammar.readingPart.questionId))
assert.deepEqual(childIds(brokenPages),childIds(plainPages))
assert(brokenPages.some(s=>s.items.at(-1).grammar.readingPart?.questionId===firstChild))
const {blockItemsForConfig}=load(root+'/src/components/generator/sheet-items.ts')
const fullReading=blockItemsForConfig(brokenPages,0,0)
assert.deepEqual(fullReading.items,buildPage(withBreak,839).items,'Reassembling a CE for the editor must remove repeated supports without overwriting questions.')
assert.deepEqual(childIds(buildWorksheets([{...withBreak,libreItems:fullReading.items,libreInstruction:fullReading.instruction}],839)),childIds(brokenPages))
const ceRecipe=buildFicheRecipe(recipeInput([withBreak]))
assert(parseFicheRecipe(ceRecipe))
assert.deepEqual(ceRecipe.pages[0].grammarPageBreakAfterQuestionIds,[firstChild])
const archivedCE=structuredClone(ceRecipe),archivePage=archivedCE.pages[0]
archivePage.grammarBankRevision='h8-archived'
archivePage.grammarSnapshot.bankRevision='h8-archived'
const archiveKey=JSON.parse(archivePage.grammarSnapshot.requestKey);archiveKey.revision='h8-archived';archivePage.grammarSnapshot.requestKey=JSON.stringify(archiveKey)
assert(parseFicheRecipe(archivedCE))
assert.deepEqual(buildPage(archivePage,839).items,buildPage(withBreak,839).items,'Archived documents keep their text, evidence and options without a current bank revision.')
for(const mutation of ['proof','group','part','duplicates']) {
 const bad=structuredClone(ceRecipe),s=bad.pages[0].grammarSnapshot
 if(mutation==='proof')s.questions[0].unit.questions[0].evidence=['citation absente du document']
 if(mutation==='group')s.groups[0].questionIds=['question absente']
 if(mutation==='part')s.questions[0].readingPart={kind:'question',questionId:firstChild,number:1}
 if(mutation==='duplicates')s.questions[0].unit.questions[1].id=s.questions[0].unit.questions[0].id
 assert.equal(parseFicheRecipe(bad),null,mutation)
}
const ceGame=convertRecipe(ceRecipe)
assert.equal(ceGame.questions.length,6)
assert.equal(new Set(ceGame.questions.map(q=>q.source.documentId)).size,2)
assert(ceGame.questions.every(q=>q.context&&q.source.documentId))
assert.equal(ceGame.questions.filter(q=>q.compatibility==='auto').length,2)
assert.equal(ceGame.questions.filter(q=>q.compatibility==='teacher-led').length,4)
for(const suffix of ['communication-pe','communication-po']) {
 const production=buildFicheRecipe(recipeInput([h8Base(suffix)])),game=convertRecipe(production)
 assert(game.questions.every(q=>q.compatibility==='teacher-led'&&q.choices.length===0))
 assert(game.questions.every(q=>!game.corrections[q.id].choiceId))
 assert(game.questions.every(q=>/Repères enseignant/.test(game.corrections[q.id].text)))
}
const readingBank=grammarBanksForType(h8+'communication-ce')[0]
assert.equal(readingBank.units.reduce((n,u)=>n+u.questions.length,0),60)
assert.equal(new Set(readingBank.units.map(u=>u.genre)).size,20)
assert(readingBank.units.every(u=>u.text.split(/\s+/).length>=60&&u.text.split(/\s+/).length<=120))
// COD: all four forms, precise references and frozen UTF-16 error intervals.
const codPrefix='gram-ex-i4-',codBanks=banks.filter(b=>b.activityId.startsWith(codPrefix))
assert.equal(codBanks.length,6)
assert.equal(codBanks.reduce((n,b)=>n+b.presentations.reduce((sum,p)=>sum+(p==='document-set'?60:50),0),0),360)
const codQ=grammarBanksForType(codPrefix+'qcm-verbe')[0],codC=grammarBanksForType(codPrefix+'curriculum-c')[0]
assert.deepEqual(Object.fromEntries(['le','la','les','l’'].map(p=>[p,codQ.units.filter(u=>u.answers[0]===p).length])),{le:12,la:12,les:14,'l’':12})
assert(codQ.units.every(u=>u.reference&&u.cue.includes(u.reference.text)))
assert(codQ.units.filter(u=>u.reference.number==='plural').every(u=>u.answers[0]==='les'))
assert(codQ.units.filter(u=>u.answers[0]==='l’').every(u=>/^[aàâeéèêiîoôuûh]/i.test(u.prompt.split('___')[1])))
assert(codQ.units.find(u=>u.reference.text==='le drapeau').answers[0]==='le')
assert(codQ.units.filter(u=>u.answers[0]==='l’').every(u=>!u.prompt.replace('___',u.answers[0]).includes('l’ ')))
assert.equal(GRAMMAR_NEW_PILOT_TYPES.filter(t=>t.id===codPrefix+'curriculum-c').length,1)
assert.equal(typeChoicesForBlock('grammaire',{...base(codPrefix+'qcm-verbe'),topic:'gram-pronoms'}).filter(t=>t.id===codPrefix+'curriculum-c').length,1)
const codCorrection={...base(codPrefix+'curriculum-c'),topic:'gram-pronoms',count:50}
for(const u of codC.units) {
 assert.equal(u.error.segmentId,'prompt')
 assert.equal(u.prompt.slice(u.error.start,u.error.end),u.error.text)
 assert(u.reference&&u.cue.includes(u.reference.text))
}
const codFrozen=buildFicheRecipe(recipeInput([codCorrection]))
for(const change of ['bounds','segment','text','reference']) {
 const bad=structuredClone(codFrozen),unit=bad.pages[0].grammarSnapshot.questions[0].unit
 if(change==='bounds')unit.error.end=unit.prompt.length+1
 if(change==='segment')unit.error.segmentId='absent'
 if(change==='text')unit.error.text='erreur étrangère au segment'
 if(change==='reference')unit.reference.number='dual'
 assert.equal(parseFicheRecipe(bad),null,change)
}
// Missing new fields is the legacy route, never implicit A1.
const old={...base(),grammarLevel:undefined,grammarActivityId:undefined,grammarPresentation:undefined,grammarBankRevision:undefined,grammarPreview:undefined}
assert.equal(generateGradedGrammarBlock(old,17),null)
assert(!generate(old,17).items.some(item=>item.layout==='grammar'))
const oldRecipe=buildFicheRecipe(recipeInput([old]))
assert.equal(oldRecipe.pages[0].grammarSnapshot,undefined)
// New settings never leak from the main block into a legacy or CO extra block.
const mixed={...base(),extraBlocks:[{...old,topic:'gram-present'},{...old,exerciseType:'gram-ex-a3-nat-co',topic:'gram-se-presenter'}]}
for(const extra of pageBlocks(mixed).slice(1)) {
 const single=pageAsConfig(mixed,extra)
 assert.equal(single.grammarLevel,undefined)
 assert.equal(generateGradedGrammarBlock(single,17),null)
}
const mixedReading={...read,grammarPageBreakAfterQuestionIds:[firstChild],extraBlocks:[old]}
const legacyNeighbor=pageAsConfig(mixedReading,pageBlocks(mixedReading)[1])
assert.equal(legacyNeighbor.grammarDocumentCount,undefined)
assert.equal(legacyNeighbor.grammarPageBreakAfterQuestionIds,undefined)
const different={...base(),extraBlocks:[{...base('gram-ex-etre-corriger-erreur'),contentSeed:5}]}
const frozen=buildFicheRecipe(recipeInput([different,base('gram-ex-etre-ordre')]))
assert.deepEqual(buildPage(frozen.pages[0],839).items,buildPage(different,839).items)
assert.deepEqual(buildPage(frozen.pages[1],839+7919).items,buildPage(base('gram-ex-etre-ordre'),839+7919).items)
// Saved selection remains readable independently of the current bank revision.
const archived=structuredClone(frozen.pages[0]); archived.grammarBankRevision='archived-revision';
archived.grammarSnapshot.bankRevision='archived-revision'
const key=JSON.parse(archived.grammarSnapshot.requestKey);key.revision='archived-revision';archived.grammarSnapshot.requestKey=JSON.stringify(key)
assert.equal(select(archived,839).bankRevision,'archived-revision')
const noSnap={...archived,grammarSnapshot:undefined}
assert.throws(()=>select(noSnap,839),e=>e.code==='GRAMMAR_BANK_REVISION_MISSING')
for(const id of ['gram-ex-a3-nat-co','gram-ex-a1-co-audio','gram-ex-famille-fam-co','gram-ex-a1-co-theme']) {
 assert(isProtectedGrammarCo(id))
 assert.equal(generateGradedGrammarBlock({...base(),exerciseType:id},17),null)
}
assert(!isProtectedGrammarCo('gram-ex-a6-prov-pays'))
assert.throws(()=>select({...base(),count:51},17),e=>e.code==='GRAMMAR_CONFIG_INVALID')
assert.throws(()=>select({...base(),grammarPreview:false},17),e=>e.code==='GRAMMAR_ACTIVITY_UNAVAILABLE')
const filtered={...base('gram-ex-etre-ordre'),phraseCategories:{preposition:false}}
const cap=grammarEligibleCount(filtered)
assert(cap<50)
assert.throws(()=>select({...filtered,count:50},17),e=>e.code==='GRAMMAR_CAPACITY_EXCEEDED')
assert.equal(grammarEligibleCount({...base('gram-ex-etre-ordre'),phrasePolarity:'negative'}),0)
const invalid=structuredClone(frozen);invalid.pages[0].grammarSnapshot.questions[0].options=[null]
assert.equal(parseFicheRecipe(invalid),null)
const badTokens=structuredClone(buildFicheRecipe(recipeInput([base('gram-ex-etre-ordre')])));badTokens.pages[0].grammarSnapshot.questions[0].tokens=[null]
assert.equal(parseFicheRecipe(badTokens),null)
assert.equal(parseFicheRecipe({...oldRecipe,pages:[{...base(),grammarLevel:'B2'}]}),null)
const badSeed=structuredClone(frozen);badSeed.pages[0].grammarSnapshot.seed+=1
assert.equal(parseFicheRecipe(badSeed),null)
const badKey=structuredClone(frozen);badKey.pages[0].grammarSnapshot.requestKey='different'
assert.equal(parseFicheRecipe(badKey),null)
// Cardinality is grammatical, never truncated by the shared TCF renderer.
const first=select(base(),17).questions[0]
assert(!isGrammarQuestion({...first,unit:{...first.unit,answers:first.unit.options.slice(0,2).map(o=>o.text)}}))
for(const count of [2,3,4,5,6]) {
 const answer=first.unit.answers[0]
 const labels=[answer,...['suis','es','est','sommes','êtes','sont'].filter(v=>v!==answer)].slice(0,count)
 const options=labels.map((text,i)=>({id:'o'+i,text}))
 const q={...first,unit:{...first.unit,options},options}
 assert(isGrammarQuestion(q))
 assert.equal(adaptSourceItem({layout:'grammar',grammar:q},base().exerciseType).items[0].choices.length,count)
}
load(root+'/src/grammaire/catalog.ts').assertGrammaireCatalog()
assert(!generate({...old,exerciseType:'gram-a5-theorie'},17).items.some(i=>i.prompt==='empty'))
console.log(`Grammar pilot: ${variants} reviewed variants, recipes, filters, pagination, 2–6 options and board adaptations verified. Teacher approval remains pending.`)
