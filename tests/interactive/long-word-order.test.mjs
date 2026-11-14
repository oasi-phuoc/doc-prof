import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'

const vite=await createServer({cacheDir:'/tmp/clairfle-long-word-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {adaptSourceItem}=await vite.ssrLoadModule('/src/interactive/domain/source-adapters.ts')
  const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
  const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
  const {buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
  const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const {runtimeFor}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const {roundsFor}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const {competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const {interrogativeCandidates}=await vite.ssrLoadModule('/src/francais/phrase-interrogatives.ts')
  const {tagged}=await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
  const {phraseSentence}=await vite.ssrLoadModule('/src/francais/phrase-forms.ts')
  const words='Le petit garçon regarde attentivement les oiseaux dans le grand jardin voisin'.split(' ')
  const model=words.join(' ')+'.'
  const sentence={layout:'phrase-order',tokens:[...words.slice(1),words[0]].map(text=>({text,category:'nom'})),labels:words,answer:model,responseAnswer:model}
  const page={...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-ordre',verbGroup:'libre',count:1,phraseItems:[sentence],extraBlocks:undefined}
  const recipe={...demoRecipe(),seed:74,pages:[page,{...defaultPage('algèbre'),count:1,libreItems:[{layout:'inline',a:2,b:2,op:'+',answer:'4',missing:'result'}]}]}
  await test('seven to twelve source elements remain complete, including repeated words and a twelve-element inverted question',()=>{
    const before=structuredClone(sentence),entry=adaptSourceItem(sentence,'phrase-simple-ordre').items[0]
    assert.equal(entry.words.length,12);assert.equal(entry.model,model);assert.equal(entry.teacherLed,true)
    assert.deepEqual([...entry.words].map(x=>x.toLowerCase()).sort(),words.map(x=>x.toLowerCase()).sort());assert.equal(entry.words.filter(x=>x.toLowerCase()==='le').length,2)
    const q=interrogativeCandidates(tagged('Le/determinant petit/adjectif garçon/nom ne/adverbe regarde/verbe pas/adverbe les/determinant oiseaux/nom du/preposition jardin/nom'),['regarder']).find(q=>q.form==='pourquoi')
    assert.equal(q.tokens.length,12)
    const ordered=q.tokens.map(t=>({...t,text:t.text.toLowerCase()})),text=phraseSentence(q.tokens,true,true)
    const adapted=adaptSourceItem({layout:'phrase-order',phraseQuestion:true,phraseQuestionForm:q.form,tokens:[...ordered.slice(1),ordered[0]],labels:ordered.map(t=>(t.joinBefore??'')+t.text),answer:text,responseAnswer:text},'phrase-simple-ordre').items[0]
    assert.equal(adapted.words.length,12);assert.ok(adapted.words.includes('-t-il'));assert.equal(adapted.prompt,'Crée une question.');assert.equal(adapted.model,'Pourquoi le petit garçon ne regarde-t-il pas les oiseaux du jardin ?')
    assert.deepEqual(sentence,before)
  })
  await test('oversized, malformed and inconsistent lists produce an issue without truncation or an invented model',()=>{
    const thirteen=Array.from({length:13},(_,i)=>'mot'+i)
    const cases=[{...sentence,tokens:thirteen.map(text=>({text})),labels:thirteen,answer:thirteen.join(' '),responseAnswer:undefined},{...sentence,labels:words.slice(1)},{...sentence,answer:'Une autre phrase.',responseAnswer:'Une autre phrase.'},{...sentence,tokens:[null]},{...sentence,tokens:[{text:9}]},{...sentence,tokens:[{text:'mot',joinBefore:'secret'}]},{...sentence,tokens:[{text:'x'.repeat(121)},{text:'fin'}],labels:['x'.repeat(121),'fin'],responseAnswer:'x'.repeat(121)+' fin.'},{...sentence,labels:[...words.slice(1),null]}]
    for(const source of cases){const before=structuredClone(source),result=adaptSourceItem(source,'phrase-simple-ordre');assert.equal(result.items.length,0);assert.ok(result.issues.length);assert.deepEqual(source,before)}
    const plain={layout:'order',prompt:'Remettez la phrase en ordre.',sequence:[...words].reverse(),placeParts:words,answer:model}
    assert.equal(adaptSourceItem(plain,'soutien').items[0].words.length,12)
  })
  await test('long ordering preserves source paper, Class collective phases and every repeated-word position',()=>{
    const before=structuredClone(recipe),paper=buildWorksheets(recipe.pages,recipe.seed),game=convertRecipe(recipe),q=game.questions[0]
    assert.equal(q.mode,'sequence');assert.equal(q.compatibility,'teacher-led');assert.equal(q.words.length,12);assert.equal(q.choices.length,0)
    let state=startSession(game),round=roundsFor(game)[0].id,order=[...Array(12).keys()].slice(1).concat(0)
    const unchanged=transition(game,state,{type:'SELECT',questionId:q.id,choiceId:'x'});assert.equal(unchanged,state)
    state=transition(game,state,{type:'IMAGE_ORDER_SET',questionId:q.id,order,roundId:round});assert.deepEqual(runtimeFor(game,state).imageOrders[q.id],order)
    state=transition(game,state,{type:'NAVIGATE',index:1});state=transition(game,state,{type:'NAVIGATE',index:0});assert.deepEqual(runtimeFor(game,state).imageOrders[q.id],order)
    state=transition(game,state,{type:'CARDS_UP'});state=transition(game,state,{type:'DISCUSS'});state=transition(game,state,{type:'REVEAL'},1000);assert.equal(state.history[0].correct,undefined)
    state=transition(game,state,{type:'ASSESS',questionId:q.id,value:'acquired'});assert.equal(state.history[0].manual,'acquired')
    assert.deepEqual(buildWorksheets(recipe.pages,recipe.seed),paper);assert.deepEqual(recipe,before)
  })
  await test('checkpoints restore all twelve positions and reject duplicates, missing elements and out-of-range indices',async()=>{
    const game=convertRecipe(recipe),q=game.questions[0],roundId=roundsFor(game)[0].id,order=[...Array(12).keys()].reverse()
    let state=transition(game,startSession(game),{type:'IMAGE_ORDER_SET',questionId:q.id,order,roundId})
    const record=compactSession(await newRecord(game,'class'),state),identity=await planIdentity(game)
    assert.deepEqual(replaySession(game,record,identity,Date.now(),'class').state.roundStates[roundId].imageOrders[q.id],order)
    assert.ok(!JSON.stringify(record).includes(model))
    for(const bad of [order.slice(1),[...order.slice(0,-1),order[0]],[12,...order.slice(1)],order.map(String)]){
      assert.equal(transition(game,state,{type:'IMAGE_ORDER_SET',questionId:q.id,order:bad,roundId}),state)
      const forged=structuredClone(record);forged.checkpoint.state.roundStates[roundId].imageOrders[q.id]=bad;assert.throws(()=>replaySession(game,forged,identity,Date.now(),'class'))
    }
    state=transition(game,state,{type:'CARDS_UP'});state=transition(game,state,{type:'DISCUSS'});state=transition(game,state,{type:'REVEAL'},1000);state=transition(game,state,{type:'RETRY_QUESTION',roundId});assert.equal(runtimeFor(game,state).attempt,1);assert.deepEqual(runtimeFor(game,state).imageOrders,{})
  })
  await test('Solo retains manual appreciation for full sentences and competitions exclude their open models',()=>{
    const game=convertRecipe(recipe),q=game.questions[0],order=[...Array(12).keys()].reverse()
    let state=transition(game,startSession(game,'solo'),{type:'IMAGE_ORDER_SET',questionId:q.id,order})
    assert.equal(state.phase,'thinking');state=transition(game,state,{type:'TIMEOUT'});assert.equal(state.phase,'revealed');assert.equal(state.history[0].correct,undefined)
    state=transition(game,state,{type:'ASSESS',questionId:q.id,value:'retry'});assert.equal(state.history[0].manual,'retry')
    const quiz=competitionQuiz(game,'https://clairfle.test/');assert.equal(quiz.items.length,1);assert.ok(!JSON.stringify(quiz).includes(model))
  })
}finally{await vite.close()}
