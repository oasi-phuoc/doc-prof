import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

const server=await createServer({cacheDir:'/tmp/clairfle-place-value-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try {
  const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {exactDecimal}=await server.ssrLoadModule('/src/interactive/domain/exact-math.ts')
  const {buildPage,buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts')
  const {defaultPage,exerciseTypes}=await server.ssrLoadModule('/src/math/catalog.ts')
  const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
  const {prepareGame}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const {positionOf}=await server.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const {createGameSource,renewGameSource}=await server.ssrLoadModule('/src/interactive/game-run.ts')
  const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const {newRecord,compactSession,replaySession,planIdentity}=await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const {generateCscExercise}=await server.ssrLoadModule('/src/tcm-csc/items.ts')
  const base=demoRecipe()
  const families=[['tpm','tpm-decompose-99'],['tpm','tpm-decompose-9999'],['algèbre','nombres-decompose'],['tcm-cfr','tcm-cfr-ex05'],['tcm-csc','tcm-csc-ex08']]
  const configFor=(domain,type)=>({...defaultPage(domain),topic:exerciseTypes.find(entry=>entry.id===type).topic,exerciseType:type,count:2,extraBlocks:undefined,libreItems:undefined})
  const decomposition=(value,parts,labels)=>({layout:'place-value',prompt:value,placeParts:parts,labels,answer:parts.join(' + ')})
  const fixture=decomposition('4 070',['4000','0','70','0'],['milliers','centaines','dizaines','unités'])
  const gameFor=(...items)=>convertRecipe({...base,pages:[{...configFor('tcm-csc','tcm-csc-ex08'),count:items.length,libreItems:items}]})
  const numeric=text=>exactDecimal(text)?.units

  await test('five real decomposition families preserve every place over 1,500 configurations without changing paper',()=>{
    for(const [domain,type] of families) for(const difficulty of ['facile','moyen','avance']) for(let seed=1;seed<=100;seed++) {
      const config={...configFor(domain,type),difficulty},recipe={...base,pages:[config],seed,libreMode:false},before=structuredClone(recipe)
      const source=buildPage(config,seed).blocks.flatMap(block=>block.items),paper=seed===1?structuredClone(buildWorksheets(recipe.pages,seed)):undefined
      const game=convertRecipe(recipe)
      assert.deepEqual(game.issues,[],`${type}/${difficulty}/${seed}`)
      assert.equal(game.questions.length,source.reduce((count,item)=>count+item.placeParts.length,0))
      for(const q of game.questions) {
        const item=source[q.source.item],part=q.source.part,correct=q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId)
        const digits=String(Number(item.prompt.replace(/['’\s]/g,''))),weight=10**(digits.length-1-part)
        assert.equal(numeric(correct.text),BigInt(Number(digits[part])*weight))
        assert.match(q.prompt,new RegExp(item.labels[part]))
        assert.equal(q.choices.length,6);assert.equal(new Set(q.choices.map(choice=>numeric(choice.text))).size,6)
        assert.equal(q.compatibility,'assisted');assert.equal('answer' in q,false)
      }
      assert.deepEqual(recipe,before)
      if(seed===1){assert.deepEqual(convertRecipe(recipe),game);assert.deepEqual(buildWorksheets(recipe.pages,seed),paper)}
    }
  })
  await test('zero places, grouped school numbers and two-digit decompositions retain the complete value, not just the digit',()=>{
    for(const item of [fixture,decomposition('99',['90','9'],['dizaines','unités']),decomposition('1’001',['1000','0','0','1'],fixture.labels)]) {
      const game=gameFor(item)
      assert.deepEqual(game.issues,[])
      assert.deepEqual(game.questions.map(q=>numeric(q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text)),item.placeParts.map(BigInt))
      assert.ok(game.questions.every(q=>!q.prompt.includes('4000 + 0 + 70 + 0')))
    }
  })
  await test('mismatched sums, swapped positions, digit-only keys, bad labels and unsupported decimal decompositions are rejected',()=>{
    for(const item of [
      {...fixture,answer:'4000 + 0 + 7 + 0'}, {...fixture,placeParts:['4000','0','7','0']},
      {...fixture,placeParts:['4000','70','0','0'],answer:'4000 + 70 + 0 + 0'},
      {...fixture,labels:['unités','dizaines','centaines','milliers']},
      {...fixture,prompt:'4,07'}, {...fixture,prompt:'40 700'}, {...fixture,prompt:'−4070'},
      {...fixture,placeParts:['4000','0','70']}, {...fixture,answer:'4070'},
      {...fixture,prompt:'1+4070'}, {...fixture,labels:['milliers','centaines','dizaines','réponse']},
    ]) {const before=structuredClone(item),game=gameFor(item);assert.equal(game.questions.length,0);assert.ok(game.issues.length);assert.deepEqual(item,before)}
  })
  await test('CSC sign names keep three verified words over 100 seeds while stale or unknown symbols are refused',()=>{
    for(let seed=1;seed<=100;seed++) {
      const items=generateCscExercise('tcm-csc-ex09',3,seed),before=structuredClone(items),game=gameFor(...items)
      assert.deepEqual(game.issues,[]);assert.equal(game.questions.length,3)
      for(const [index,q] of game.questions.entries()) {
        assert.deepEqual(q.choices.map(choice=>choice.text),['plus','moins','égal'])
        assert.equal(q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId).text,items[index].answer)
        assert.ok(q.prompt.includes(items[index].prompt));assert.equal(q.compatibility,'auto')
      }
      assert.deepEqual(items,before)
    }
    const item=generateCscExercise('tcm-csc-ex09',3,1)[0]
    for(const bad of [{...item,answer:'faux'},{...item,prompt:'×'},{...item,cscTask:{kind:'sign-name',symbol:'×'}},{...item,libreError:'Non validé'}]) assert.equal(gameFor(bad).questions.length,0)
  })
  await test('choice caps and exact numeric sorting retain zero answers and source parts under custom order',()=>{
    const game=gameFor(fixture),before=structuredClone(game)
    for(const maxChoices of [2,3,4,5,6]) {
      const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices,numericOrder:true,orderMode:'custom',customOrder:game.questions.map(positionOf).reverse()}))
      assert.deepEqual(plan.questions.map(positionOf),game.questions.map(positionOf).reverse())
      for(const q of plan.questions) {
        assert.equal(q.choices.length,maxChoices);assert.ok(q.choices.some(choice=>choice.id===game.corrections[q.id].choiceId))
        const values=q.choices.map(choice=>numeric(choice.text));assert.deepEqual(values,[...values].sort((a,b)=>a<b?-1:a>b?1:0))
      }
    }
    assert.deepEqual(game,before)
  })
  await test('new seeds change decomposition numbers without changing the saved template',()=>{
    for(const [domain,type] of families) {
      const recipe={...base,pages:[configFor(domain,type)],libreMode:false},before=structuredClone(recipe)
      let source=createGameSource({recipe,name:type},'saved',type)
      const signatures=new Set()
      for(let draw=0;draw<6;draw++){const game=convertRecipe(source.recipe);assert.equal(game.issues.length,0);signatures.add(JSON.stringify(game.questions.map(q=>q.prompt)));source=renewGameSource(source,null)}
      assert.ok(signatures.size>1,type);assert.deepEqual(recipe,before)
    }
  })
  await test('Class is collective and Solo correction, zero answers and checkpoints use the same verified key',async()=>{
    const game=prepareGame(gameFor(fixture)),first=game.questions[0]
    let state=startSession(game,'class')
    assert.equal(transition(game,state,{type:'SELECT',choiceId:first.choices[0].id}),state)
    state=startSession(game,'solo')
    for(const [index,kind] of ['correct','correct','timeout','wrong'].entries()) {
      const q=game.questions[index],correctId=game.corrections[q.id].choiceId
      state=transition(game,state,kind==='timeout'?{type:'TIMEOUT'}:{type:'SELECT',choiceId:kind==='correct'?correctId:q.choices.find(choice=>choice.id!==correctId).id})
      assert.equal(state.phase,'revealed');assert.equal(state.history.at(-1).correct,kind==='correct')
      state=transition(game,state,{type:'NEXT'})
    }
    assert.equal(state.finished,true)
    const record=compactSession(await newRecord(game,'solo'),state)
    assert.deepEqual(replaySession(game,record,await planIdentity(game),Date.now(),'solo').state,state)
  })
  await test('competition transports decomposition and sign-name questions without publishing their key before correction',()=>{
    const game=gameFor(fixture,...generateCscExercise('tcm-csc-ex09',3,7)),before=structuredClone(game)
    const quiz=parseCompetitionQuiz(competitionQuiz(game,'https://clairfle.example'))
    assert.equal(quiz.items.length,7)
    let room=createCompetition(quiz,{enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false},'online','ABC234',1000)
    room=competitionStep(room,{type:'join',avatarId:'panda'},1100);room=competitionStep(room,{type:'start'},1200)
    const view=competitionView(room,1250,'p1')
    assert.equal(view.question.prompt,game.questions[0].prompt);assert.equal(view.correctChoiceId,undefined);assert.equal('answer' in view.question,false)
    assert.deepEqual(game,before)
  })
} finally {await server.close()}
