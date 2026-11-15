import assert from 'node:assert/strict'
import test from 'node:test'
import {readFile,readdir} from 'node:fs/promises'
import {createServer} from 'vite'

const vite=await createServer({cacheDir:'/tmp/clairfle-word-drop-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {sourceWordBlank,isWordDropQuestion,validWordDrop}=await vite.ssrLoadModule('/src/interactive/domain/word-drop.ts')
  const {adaptSourceItem}=await vite.ssrLoadModule('/src/interactive/domain/source-adapters.ts')
  const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
  const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
  const {buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
  const {createGrammarQuestion}=await vite.ssrLoadModule('/src/grammaire/curriculum/questions.ts')
  const {grammarItems}=await vite.ssrLoadModule('/src/grammaire/curriculum/items.ts')
  const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const {runtimeFor}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const {roundsFor,prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {copySession}=await vite.ssrLoadModule('/src/interactive/domain/checkpoint.ts')
  const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const {competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const banks=[]
  for(const file of (await readdir('src/grammaire/curriculum/data')).filter(file=>file.endsWith('.json'))){const raw=JSON.parse(await readFile('src/grammaire/curriculum/data/'+file,'utf8'));for(const bank of Array.isArray(raw)?raw:[raw])if(Array.isArray(bank.units))banks.push(bank)}
  const bank=banks.find(bank=>bank.activityId==='gram-ex-er-qcm-conj'&&bank.level==='A1'),unit=bank.units[0]
  const item=grammarItems({questions:[createGrammarQuestion(unit,'choice',14)]})[0]
  const syllables={layout:'vocab-match',labels:['ma','vo'],options:['ison','iture','ble','me','l','son'],vocabMatchMode:'syllables',vocabPairs:[{left:'ma',right:'ison'},{left:'vo',right:'iture'}],answer:'ma + ison → maison · vo + iture → voiture'}
  const recipe={...demoRecipe(),libreMode:true,seed:14,pages:[{...defaultPage('grammaire'),count:1,extraBlocks:undefined,libreItems:[item]},{...defaultPage('soutien-fr'),count:1,extraBlocks:undefined,libreItems:[syllables]},{...defaultPage('algèbre'),count:1,extraBlocks:undefined,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]}
  const game=convertRecipe(recipe),q=game.questions[0],key=game.corrections[q.id].choiceId,wrong=q.choices.find(choice=>choice.id!==key).id,roundId=roundsFor(game)[0].id

  await test('real curriculum sources retain exact gaps and leave dialogue turns without an explicit blank unchanged over two seeds',()=>{
    let checked=0;const contracts=new Set()
    for(const bank of banks)for(const presentation of bank.presentations.filter(p=>['choice','match','scenario-set'].includes(p)))for(const u of bank.units.slice(0,5))for(const seed of [1,47]){
      const question=createGrammarQuestion(u,presentation,seed),before=structuredClone(question)
      for(const item of grammarItems({questions:[question]})){
        const result=adaptSourceItem(item,bank.activityId)
        if(u.kind==='scenario')for(const entry of result.items)if(!entry.prompt.includes('___'))assert.equal(entry.wordBlank,undefined)
        for(const entry of result.items.filter(entry=>entry.wordBlank)){
          checked++;contracts.add(u.kind)
          assert.equal(entry.wordBlank.before+'___'+entry.wordBlank.after,entry.prompt)
          assert.equal(entry.choices.filter(choice=>choice.id===entry.correctId).length,1)
          assert.equal(entry.mode,undefined);assert.ok(entry.model)
          assert.ok(entry.choices.every(choice=>!choice.image&&!choice.audio&&choice.text.length<=120))
        }
      }
      assert.deepEqual(question,before)
    }
    assert.ok(checked>=100,`Only ${checked} source gaps found`);assert.ok(contracts.has('completion'));assert.ok(contracts.has('match'))
    console.log(`Verified ${checked} explicit source gaps from ${banks.length} curriculum banks; existing pilot status is unchanged.`)
  })
  await test('syllables keep the complete source word, six original options and a single explicit missing fragment; ordinary QCM are never inferred',()=>{
    const before=structuredClone(recipe),paper=buildWorksheets(recipe.pages,recipe.seed)
    assert.equal(game.questions.length,4);assert.equal(q.wordBlank.before+'___'+q.wordBlank.after,q.prompt)
    assert.ok(q.prompt.includes('(parler)'));assert.equal(isWordDropQuestion(q),true)
    for(const question of game.questions.slice(1,3)){assert.equal(question.choices.length,6);assert.ok(question.wordBlank);assert.ok(question.choices.every(choice=>syllables.options.includes(choice.text)))}
    assert.equal(game.questions[3].wordBlank,undefined);assert.equal(adaptSourceItem({layout:'text',prompt:'Une question avec ___',answer:'oui',options:['oui','non']},'ordinary'),undefined)
    assert.deepEqual(buildWorksheets(recipe.pages,recipe.seed),paper);assert.deepEqual(recipe,before)
  })
  await test('ambiguous placeholders, long payloads, media choices and inconsistent metadata keep the plain card fallback',()=>{
    for(const prompt of ['Pas de blanc.','Un ___ puis un ___.','Un ____ seul.','x'.repeat(3000)+'___'])assert.equal(sourceWordBlank(prompt,q.choices),undefined)
    for(const changes of [{image:'/image.webp'},{audio:'/audio.mp3'},{text:'x'.repeat(121)},{id:'x'.repeat(121)}]){const choices=structuredClone(q.choices);Object.assign(choices[0],changes);assert.equal(sourceWordBlank(q.prompt,choices),undefined)}
    assert.equal(isWordDropQuestion({...q,wordBlank:{before:'inventé',after:''}}),false);assert.equal(validWordDrop(q,'foreign'),false)
  })
  await test('Class previews are optional, removable and never set a student selection or advance the phase',()=>{
    let state=startSession(game),action={type:'WORD_DROP_SET',questionId:q.id,choiceId:wrong,roundId}
    state=transition(game,state,action);assert.equal(state.phase,'thinking');assert.deepEqual(state.selections,{});assert.deepEqual(state.history,[]);assert.equal(runtimeFor(game,state).wordDrops[q.id],wrong)
    const locked=transition(game,state,{type:'TEACHER_LOCK_SET',locked:true});assert.equal(transition(game,locked,action),locked)
    const paused=transition(game,state,{type:'PAUSE'});assert.equal(transition(game,paused,action),paused)
    for(const bad of [{...action,choiceId:'foreign'},{...action,questionId:game.questions[3].id},{...action,roundId:'stale'}])assert.equal(transition(game,state,bad),state)
    state=transition(game,state,{...action,choiceId:null});assert.equal(runtimeFor(game,state).wordDrops[q.id],undefined)
    state=transition(game,state,action);state=transition(game,state,{type:'CARDS_UP'});state=transition(game,state,{type:'DISCUSS'});state=transition(game,state,{type:'REVEAL'},1000)
    assert.equal(state.history[0].correct,undefined);assert.equal(transition(game,state,action),state)
    state=transition(game,state,{type:'UNREVEAL',roundId},1100);assert.equal(runtimeFor(game,state).wordDrops[q.id],wrong)
    state=transition(game,state,{type:'RETRY_QUESTION',roundId});assert.equal(runtimeFor(game,state).wordDrops,undefined)
  })
  await test('navigation, checkpoints and event replay preserve independent proposals while forged IDs and Solo preview maps are refused',async()=>{
    const state=transition(game,startSession(game),{type:'WORD_DROP_SET',questionId:q.id,choiceId:wrong,roundId}),record=compactSession(await newRecord(game,'class'),state),identity=await planIdentity(game)
    const moved=transition(game,transition(game,state,{type:'NAVIGATE',index:1}),{type:'NAVIGATE',index:0});assert.equal(runtimeFor(game,moved).wordDrops[q.id],wrong)
    assert.equal(runtimeFor(game,replaySession(game,record,identity).state).wordDrops[q.id],wrong)
    const copy=copySession(state);copy.roundStates[roundId].wordDrops[q.id]=key;assert.equal(runtimeFor(game,state).wordDrops[q.id],wrong)
    for(const bad of [{[q.id]:'foreign'},{[game.questions[3].id]:wrong},[wrong],null]){const forged=structuredClone(record);forged.checkpoint.state.roundStates[roundId].wordDrops=bad;assert.throws(()=>replaySession(game,forged,identity))}
    const solo=transition(game,startSession(game,'solo'),{type:'SELECT',questionId:q.id,choiceId:key}),saved=compactSession(await newRecord(game,'solo'),solo);saved.checkpoint.state.roundStates[roundId].wordDrops={[q.id]:key};assert.throws(()=>replaySession(game,saved,identity,Date.now(),'solo'))
    assert.ok(!JSON.stringify(record).includes(unit.prompt));assert.ok(!JSON.stringify(record).includes('wordBlank'))
  })
  await test('Solo retains immediate correct, wrong and timeout scoring through the existing select action',()=>{
    const initial=startSession(game,'solo');assert.equal(transition(game,initial,{type:'WORD_DROP_SET',questionId:q.id,choiceId:key}),initial)
    for(const choiceId of [key,wrong]){const state=transition(game,initial,{type:'SELECT',questionId:q.id,choiceId});assert.equal(state.phase,'revealed');assert.equal(state.history[0].correct,choiceId===key)}
    const timeout=transition(game,initial,{type:'TIMEOUT'});assert.equal(timeout.history[0].correct,false);assert.equal(timeout.history[0].selected,undefined)
  })
  await test('display metadata leaves old choice-plan fingerprints valid, while source and answer changes still invalidate the plan',async()=>{
    const legacy=structuredClone(game);for(const question of legacy.questions)delete question.wordBlank
    assert.equal(await planIdentity(legacy),await planIdentity(game))
    const changed=structuredClone(game);changed.questions[0].prompt+=' Un indice.';assert.notEqual(await planIdentity(changed),await planIdentity(game))
    const answer=structuredClone(game);answer.corrections[q.id].choiceId=wrong;assert.notEqual(await planIdentity(answer),await planIdentity(game))
  })
  await test('choice caps, physical slots and competition payloads retain original grading and do not carry preview state',()=>{
    for(const mode of ['class','solo']){const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices:2}),undefined,mode);assert.ok(plan.questions[0].choices.some(choice=>choice.id===key));assert.ok(plan.questions[0].wordBlank)}
    const quiz=competitionQuiz(game,'https://clairfle.test/');assert.equal(quiz.items.length,4);assert.ok(!JSON.stringify(quiz).includes('wordDrops'));assert.ok(!JSON.stringify(quiz).includes('wordBlank'))
  })
}finally{await vite.close()}
