import assert from 'node:assert/strict'
import test from 'node:test'
import {createServer} from 'vite'

const vite=await createServer({cacheDir:'/tmp/clairfle-word-sorting-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
  const {defaultPage,exerciseTypes}=await vite.ssrLoadModule('/src/math/catalog.ts')
  const {buildPage,buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
  const {applyPlanOptions,readPlanOptions,DEFAULT_PLAN_OPTIONS}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const {wordSortingGame,sortingSelection,sortingSentence,validWordPlacements}=await vite.ssrLoadModule('/src/interactive/domain/word-sorting.ts')
  const {positionOf}=await vite.ssrLoadModule('/src/interactive/domain/source-position.ts')
  const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const {runtimeFor}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const {roundsFor}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const {copySession}=await vite.ssrLoadModule('/src/interactive/domain/checkpoint.ts')
  const {competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const {interrogativeCandidates}=await vite.ssrLoadModule('/src/francais/phrase-interrogatives.ts')
  const {tagged}=await vite.ssrLoadModule('/src/francais/phrase-sentences.ts')
  const {PHRASE_CATEGORY_LABELS}=await vite.ssrLoadModule('/src/francais/phrase-banks.ts')
  const {readLocalPreset,presetOptions}=await vite.ssrLoadModule('/src/interactive/presets.ts')
  const {teacherSnapshot}=await vite.ssrLoadModule('/src/interactive/teacher-console/protocol.ts')
  const options={...DEFAULT_PLAN_OPTIONS,wordSorting:true}
  const source=tokens=>({layout:'phrase-color',tokens,answer:tokens.map(t=>t.category).join(' · ')})
  const original=source(tagged('Il/pronom la/pronom regarde/verbe dans/preposition la/determinant cour/nom'))
  const recipeFor=item=>({...demoRecipe(),seed:84,libreMode:true,pages:[{...defaultPage('gattegno'),topic:'phrase-simple',exerciseType:'phrase-simple-colorier',count:1,libreItems:[item],extraBlocks:undefined},{...defaultPage('algèbre'),count:1,libreItems:[{layout:'inline',a:2,b:2,op:'+',missing:'result',answer:'4'}]}]})
  const recipe=recipeFor(original),micro=convertRecipe(recipe),game=applyPlanOptions(micro,options),q=game.questions[0],targets=game.corrections[q.id].sortingTargets

  await test('seven real Gattegno themes retain every source occurrence and key across 420 configurations, with paper unchanged',()=>{
    const types=exerciseTypes.filter(type=>/^phrase-.+-colorier$/.test(type.id));assert.equal(types.length,7)
    for(const type of types)for(const difficulty of ['facile','moyen','difficile'])for(let seed=1;seed<=20;seed++){
      const config={...defaultPage('gattegno'),topic:type.topic,exerciseType:type.id,difficulty,count:2,verbGroup:'mixte',phrasePolarity:'mixed',phraseForm:'mixed',phraseVoice:'mixed',extraBlocks:undefined,libreItems:undefined}
      const recipe={...demoRecipe(),seed,pages:[config]},before=structuredClone(recipe),paper=seed===1?buildWorksheets(recipe.pages,seed):undefined
      const items=buildPage(config,seed).blocks.flatMap(block=>block.items),converted=convertRecipe(recipe),sorting=applyPlanOptions(converted,options)
      assert.equal(sorting.questions.length,items.length,`${type.id}/${seed}: ${JSON.stringify(sorting.issues)}`)
      for(const question of sorting.questions){
        const item=items[question.source.item],key=sorting.corrections[question.id]
        assert.equal(question.mode,'sorting');assert.equal(question.compatibility,'teacher-led');assert.equal(question.choices.length,0)
        assert.deepEqual(question.wordSorting.sentence.tokens,item.tokens.map(t=>t.text))
        assert.deepEqual(key.sortingTargets,item.tokens.map(t=>`category-${t.category}`))
        assert.equal(key.choiceId,undefined);assert.equal(question.sortingTargets,undefined);assert.ok(!JSON.stringify(question).includes('classificationCategory'))
      }
      assert.deepEqual(recipe,before);if(paper)assert.deepEqual(buildWorksheets(recipe.pages,seed),paper)
    }
  })
  await test('repeated spellings, nine categories, pronoun inversions and question joins remain distinct and complete',()=>{
    assert.deepEqual(q.wordSorting.sentence.tokens,['Il','la','regarde','dans','la','cour'])
    assert.notEqual(targets[1],targets[4]);assert.equal(sortingSentence(q.wordSorting.sentence),'Il la regarde dans la cour.')
    const many=source(tagged('Ah,/interjection tu/pronom prends/verbe vraiment/adverbe le/determinant petit/adjectif train/nom vers/preposition la/determinant gare/nom et/conjonction tu/pronom souris/verbe'))
    const board=applyPlanOptions(convertRecipe(recipeFor(many)),options).questions[0]
    assert.equal(board.wordSorting.categories.length,9);assert.equal(board.wordSorting.sentence.tokens.length,13)
    const interrogative=interrogativeCandidates(tagged('Le/determinant chat/nom regarde/verbe la/determinant souris/nom'),['regarder']).find(item=>item.form==='pourquoi')
    const question={...source(interrogative.tokens),phraseQuestion:true,phraseQuestionForm:interrogative.form}
    const changed=applyPlanOptions(convertRecipe(recipeFor(question)),options).questions[0]
    assert.match(sortingSentence(changed.wordSorting.sentence),/regarde-t-il/);assert.ok(sortingSentence(changed.wordSorting.sentence).endsWith(' ?'))
  })
  await test('incomplete groups, altered metadata and mismatched keys retain the original micro-questions with an explicit issue',()=>{
    for(const change of [copy=>copy.questions.splice(2,1),copy=>delete copy.corrections[copy.questions[0].id].classificationCategory,copy=>copy.corrections[copy.questions[1].id].classificationCategory={id:'category-nom',label:'Noms'},copy=>copy.questions[1].wordClassification.tokens[0]='Une autre phrase']){
      const copy=structuredClone(micro);change(copy);const before=structuredClone(copy),result=wordSortingGame(copy)
      assert.deepEqual(result.questions,copy.questions);assert.ok(result.issues.some(issue=>issue.reason.includes('Tri en colonnes')));assert.deepEqual(copy,before)
    }
  })
  await test('optional settings and preset selection preserve legacy cards, selected phrases, order and source positions',()=>{
    assert.deepEqual(readPlanOptions({...DEFAULT_PLAN_OPTIONS,wordSorting:false}),DEFAULT_PLAN_OPTIONS)
    assert.equal(applyPlanOptions(micro,{...DEFAULT_PLAN_OPTIONS,wordSorting:false}),micro)
    for(const bad of ['true',1,null,{}])assert.throws(()=>readPlanOptions({...options,wordSorting:bad}))
    const selected=[positionOf(micro.questions[2]),positionOf(micro.questions[4]),positionOf(micro.questions.at(-1))]
    const enabled=sortingSelection(selected,micro.questions,true);assert.deepEqual(enabled,[positionOf(q),positionOf(game.questions.at(-1))])
    const disabled=sortingSelection(enabled,game.questions,false);assert.deepEqual(disabled,micro.questions.map(positionOf))
    assert.deepEqual(applyPlanOptions(micro,{...options,maxChoices:2}).questions[0],q)
    const custom=applyPlanOptions(micro,{...options,orderMode:'custom',customOrder:[positionOf(game.questions.at(-1)),positionOf(q)]});assert.equal(custom.questions[0].mode,'choice')
    const preset={version:2,presetId:'tri',sourceKey:'saved-123',name:'Tri',conversionVersion:1,paletteVersion:1,contentHashAtSave:'source',selectedQuestionIds:enabled,...options,revealPolicy:'teacher-only',correctionTiming:'deferred',voteBeforeBoard:true,timer:{enabled:false,defaultSec:30,feedbackSec:5},scoring:{mode:'none'},effects:{badges:false},playMode:'class',revision:0,createdAt:1,updatedAt:1}
    assert.equal(presetOptions(readLocalPreset(preset)).wordSorting,true)
    assert.equal(presetOptions(readLocalPreset({...preset,wordSorting:undefined})).wordSorting,undefined)
  })
  await test('Class placement accepts partial and repeated categories without a selection phase, and obeys round, pause, lock and reveal guards',()=>{
    const roundId=roundsFor(game)[0].id,placements=[...targets];placements[4]=null
    let state=startSession(game),action={type:'WORD_SORT_SET',questionId:q.id,placements,roundId}
    state=transition(game,state,action);assert.equal(state.phase,'thinking');assert.deepEqual(state.selections,{})
    assert.deepEqual(runtimeFor(game,state).wordSorts[q.id],placements)
    assert.equal(transition(game,state,{...action,roundId:'stale'}),state)
    assert.equal(transition(game,state,{...action,questionId:game.questions[1].id}),state)
    const locked=transition(game,state,{type:'TEACHER_LOCK_SET',locked:true});assert.equal(transition(game,locked,action),locked)
    const paused=transition(game,state,{type:'PAUSE'});assert.equal(transition(game,paused,action),paused)
    state=transition(game,state,{type:'CARDS_UP'});state=transition(game,state,{type:'DISCUSS'});state=transition(game,state,{type:'REVEAL'},1000)
    assert.equal(transition(game,state,action),state);assert.equal(state.history[0].correct,undefined)
    state=transition(game,state,{type:'ASSESS',questionId:q.id,value:'acquired'});assert.equal(state.history[0].manual,'acquired')
    state=transition(game,state,{type:'RETRY_QUESTION',roundId});assert.equal(runtimeFor(game,state).wordSorts,undefined)
  })
  await test('invalid placements cannot enter a journal or checkpoint; navigation and snapshots retain independent copies',async()=>{
    const roundId=roundsFor(game)[0].id,action={type:'WORD_SORT_SET',questionId:q.id,placements:[...targets],roundId}
    const state=transition(game,startSession(game),action),record=compactSession(await newRecord(game,'class'),state),identity=await planIdentity(game)
    const navigated=transition(game,transition(game,state,{type:'NAVIGATE',index:1}),{type:'NAVIGATE',index:0})
    assert.deepEqual(runtimeFor(game,navigated).wordSorts[q.id],targets)
    assert.deepEqual(runtimeFor(game,replaySession(game,record,identity).state).wordSorts[q.id],targets)
    const copy=copySession(state);copy.roundStates[roundId].wordSorts[q.id][0]=null;assert.deepEqual(runtimeFor(game,state).wordSorts[q.id],targets)
    for(const bad of [targets.slice(1),[...targets,'category-pronom'],targets.map(()=>0),targets.map(()=>'unknown'),Array(targets.length)]){
      assert.equal(validWordPlacements(q,bad),false);assert.equal(transition(game,state,{...action,placements:bad}),state)
      const forged=structuredClone(record);forged.checkpoint.state.roundStates[roundId].wordSorts[q.id]=bad;assert.throws(()=>replaySession(game,forged,identity))
    }
    assert.ok(!JSON.stringify(record).includes('Il la regarde'));assert.ok(!JSON.stringify(record).includes('sortingTargets'))
  })
  await test('Solo reveals only at submission or timeout and keeps human appreciation; score competitions never contain sorting keys',()=>{
    let state=transition(game,startSession(game,'solo'),{type:'WORD_SORT_SET',questionId:q.id,placements:[...targets]})
    assert.equal(state.phase,'thinking');state=transition(game,state,{type:'TIMEOUT'});assert.equal(state.phase,'revealed');assert.equal(state.history[0].correct,undefined)
    state=transition(game,state,{type:'ASSESS',questionId:q.id,value:'retry'});assert.equal(state.history[0].manual,'retry')
    const quiz=competitionQuiz(game,'https://clairfle.test/');assert.equal(quiz.items.length,1);assert.ok(!JSON.stringify(quiz).includes('sortingTargets'));assert.ok(!JSON.stringify(quiz).includes('classificationCategory'))
    const snapshot=teacherSnapshot(game,startSession(game),{available:true,blocked:false,guard:'none',colors:[],shapes:[]},'private-fixture',0,1000)
    assert.equal(snapshot.questions[0].mode,'sorting');assert.ok(snapshot.questions[0].model.includes('1. Il → Pronoms'))
  })
  await test('adding private classification metadata preserves the fingerprint of existing word-by-word sessions',async()=>{
    const legacy=structuredClone(micro);for(const correction of Object.values(legacy.corrections))delete correction.classificationCategory
    assert.equal(await planIdentity(legacy),await planIdentity(micro));assert.notEqual(await planIdentity(game),await planIdentity(micro))
    for(const question of micro.questions.filter(q=>q.wordClassification))assert.ok(PHRASE_CATEGORY_LABELS[micro.corrections[question.id].classificationCategory.id.replace('category-','')])
  })
}finally{await vite.close()}
