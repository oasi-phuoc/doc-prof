import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'

const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {adaptWordClassification}=await server.ssrLoadModule('/src/interactive/domain/word-classification.ts')
  const {convertRecipe}=await server.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {WordClassificationView}=await server.ssrLoadModule('/src/interactive/components/WordClassificationView.tsx')
  const {buildPage,buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts')
  const {defaultPage}=await server.ssrLoadModule('/src/math/catalog.ts')
  const {demoRecipe}=await server.ssrLoadModule('/src/interactive/demo.ts')
  const {PHRASE_THEME_DEFS}=await server.ssrLoadModule('/src/francais/phrase-themes.ts')
  const {PHRASE_CATEGORY_LABELS,PHRASE_COLORS}=await server.ssrLoadModule('/src/francais/phrase-banks.ts')
  const {prepareGame}=await server.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {applyPlanOptions,DEFAULT_PLAN_OPTIONS,positionOf}=await server.ssrLoadModule('/src/interactive/domain/plan-options.ts')
  const {startSession,transition}=await server.ssrLoadModule('/src/interactive/domain/session.ts')
  const {usedMatchingChoices}=await server.ssrLoadModule('/src/interactive/domain/matching.ts')
  const {newRecord,compactSession,replaySession,planIdentity}=await server.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const {createGameSource,renewGameSource}=await server.ssrLoadModule('/src/interactive/game-run.ts')
  const {teacherSheetRows}=await server.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts')
  const {PALETTE,defaultShapes}=await server.ssrLoadModule('/src/interactive/domain/palette.ts')
  const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionStep,competitionView}=await server.ssrLoadModule('/src/interactive/competition/core.ts')
  const base=demoRecipe(),colors=PALETTE.map(entry=>entry.color)
  const config=(theme='phrase-simple')=>({...defaultPage('gattegno'),topic:theme,exerciseType:theme+'-colorier',count:1,columns:1,extraBlocks:undefined,libreItems:undefined})
  const recipe=(page=config(),seed=42)=>({...base,pages:[page],libreMode:false,seed})
  const item=tokens=>({layout:'phrase-color',tokens:tokens.map(([text,category])=>({text,category})),answer:tokens.map(([,category])=>category).join(' · ')})
  const repeated=item([['Le','determinant'],['professeur','nom'],['le','pronom'],['félicite','verbe']])
  const custom=(...items)=>convertRecipe(recipe({...config(),count:items.length,libreItems:items}))
  const answer=(game,q)=>q.choices.find(choice=>choice.id===game.corrections[q.id].choiceId)?.text
  const reveal=(game,state)=>['CARDS_UP','DISCUSS','REVEAL'].reduce((state,type)=>transition(game,state,{type},1000),state)

  await test('all seven Gattegno themes over 2800 source configurations keep each tagged occurrence, the source key and the printed worksheet',()=>{
    for(const {topic}of PHRASE_THEME_DEFS)for(const verbGroup of ['er','ir','autres','mixte'])for(let seed=1;seed<=100;seed++){
      const page={...config(topic),verbGroup,phrasePolarity:['positive','negative','mixed'][seed%3]},input=recipe(page,seed),before=structuredClone(input)
      const paper=seed===1?structuredClone(buildWorksheets(input.pages,seed)):undefined
      const source=buildPage(page,seed).blocks[0].items,game=convertRecipe(input)
      assert.equal(game.questions.length,source.reduce((sum,item)=>sum+item.tokens.length,0),JSON.stringify(game.issues))
      for(const q of game.questions){
        const original=source[q.source.item],token=original.tokens[q.source.part],categories=[...new Set(original.tokens.map(token=>token.category))]
        assert.deepEqual(q.wordClassification,{tokens:original.tokens.map(token=>token.text),target:q.source.part})
        assert.deepEqual(Object.keys(q.wordClassification),['tokens','target'])
        assert.ok(!JSON.stringify(q.wordClassification).includes('category'))
        assert.equal(q.choiceOrderPolicy,'fixed');assert.equal(q.matchingGroup,undefined)
        assert.equal(q.mode,categories.length>=2&&categories.length<=6?'choice':'oral')
        if(q.mode==='choice'){
          assert.equal(answer(game,q),PHRASE_CATEGORY_LABELS[token.category])
          assert.deepEqual(q.choices.map(c=>c.text),Object.keys(PHRASE_CATEGORY_LABELS).filter(category=>categories.includes(category)).map(category=>PHRASE_CATEGORY_LABELS[category]))
          assert.ok(q.choices.length>=2&&q.choices.length<=6)
        }else assert.equal(game.corrections[q.id].choiceId,undefined)
      }
      assert.deepEqual(input,before)
      if(paper){assert.deepEqual(buildWorksheets(input.pages,seed),paper);assert.deepEqual(convertRecipe(input),game)}
    }
  })
  await test('repeated spelling keeps its category in context; apostrophes and multi-word source elements remain whole and neutral',()=>{
    const apostrophes=item([['L’','determinant'],['élève','nom'],['l’','pronom'],['écoute','verbe']])
    const locution=item([['Le','determinant'],['chien','nom'],['dort','verbe'],['près de','preposition'],['la','determinant'],['porte','nom']])
    const game=custom(repeated,apostrophes,locution)
    assert.equal(answer(game,game.questions[0]),'Déterminants');assert.equal(answer(game,game.questions[2]),'Pronoms')
    assert.equal(game.questions.find(q=>q.source.item===2&&q.source.part===3).wordClassification.tokens[3],'près de')
    const q=game.questions.find(q=>q.source.item===1),html=renderToStaticMarkup(createElement(WordClassificationView,{classification:q.wordClassification}))
    assert.ok(!html.includes('style='));assert.equal((html.match(/aria-current="step"/g)||[]).length,1)
    for(const color of Object.values(PHRASE_COLORS))assert.ok(!html.includes(color))
    assert.match(game.corrections[q.id].text,/L’élève l’écoute\./)
  })
  await test('bad source tags, altered printed keys, missing elements, unsupported instructions and oversized data never invent a classification',()=>{
    for(const change of [
      value=>{value.tokens[0].category='unknown'},value=>{value.tokens[0].category='__proto__'},value=>{value.answer='nom · verbe'},
      value=>{value.tokens[0].text=' '},value=>{value.tokens[0]=null},value=>{delete value.tokens},value=>{value.tokens=[]},
      value=>{value.tokens[0].text='x'.repeat(121)},value=>{value.tokens=Array(65).fill({text:'mot',category:'nom'})},
      value=>{value.prompt='Une autre tâche modifiée.'},
    ]){
      const source=structuredClone(repeated);change(source);const before=structuredClone(source),game=custom(source)
      assert.equal(game.questions.length,0);assert.ok(game.issues.length);assert.deepEqual(source,before)
    }
  })
  await test('one or more than six categories stays teacher-led for every element and never enters a scored competition',()=>{
    const many=item([['Il','pronom'],['lit','verbe'],['un','determinant'],['livre','nom'],['intéressant','adjectif'],['souvent','adverbe'],['dans','preposition'],['Paris','nom']])
    const one=item([['pain','nom'],['eau','nom']]),game=custom(many,one)
    assert.equal(game.questions.length,10);assert.ok(game.questions.every(q=>q.mode==='oral'&&q.compatibility==='teacher-led'&&!q.choices.length))
    assert.equal(competitionQuiz(game,'https://class.example').items.length,0)
    for(const row of teacherSheetRows(prepareGame(game),colors,defaultShapes)){
      assert.equal(row.answer,game.corrections[row.questionId].text)
      assert.ok(row.answer.includes('Phrase :'));assert.equal(row.card,undefined)
    }
    const state=transition(game,startSession(game,'solo'),{type:'TIMEOUT'})
    assert.equal(state.history[0].correct,undefined)
    assert.equal(adaptWordClassification({layout:'text',answer:''}),undefined)
  })
  await test('fixed category cards survive caps, selection and question reordering; a source recording cannot truncate classification to two words',()=>{
    const game=custom({...repeated,audioSrc:'/phrase.mp3'}),before=structuredClone(game)
    for(const maxChoices of [2,3,4,5,6]){
      const plan=prepareGame(applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,maxChoices,orderMode:'custom',customOrder:game.questions.map(positionOf).reverse()}))
      assert.equal(plan.questions.length,4)
      for(const q of plan.questions)assert.deepEqual(q.choices,game.questions.find(original=>original.id===q.id).choices)
    }
    const selected=prepareGame(game,[game.questions[2].id])
    assert.equal(selected.questions[0].wordClassification.target,2)
    assert.deepEqual(game,before)
  })
  await test('Class remains collective; Solo can reuse a category and persists correct, wrong and timed-out word results',async()=>{
    const source=item([['Le','determinant'],['chien','nom'],['regarde','verbe'],['le','determinant'],['chat','nom']]),game=prepareGame(custom(source),undefined,'solo')
    let collective=startSession(game)
    assert.equal(transition(game,collective,{type:'SELECT',choiceId:game.questions[0].choices[0].id}),collective)
    collective=reveal(game,collective);assert.equal(collective.phase,'revealed')
    let state=startSession(game,'solo')
    for(let index=0;index<game.questions.length;index++){
      const q=game.questions[index],key=game.corrections[q.id].choiceId
      assert.deepEqual(usedMatchingChoices(game,state,q),[])
      state=transition(game,state,index===2?{type:'TIMEOUT'}:{type:'SELECT',choiceId:index===1?q.choices.find(c=>c.id!==key).id:key})
      assert.equal(state.history.at(-1).correct,index!==1&&index!==2)
      state=transition(game,state,{type:'NEXT'})
    }
    const record=compactSession(await newRecord(game,'solo'),state)
    assert.deepEqual(replaySession(game,record,await planIdentity(game),Date.now(),'solo').state,state)
    assert.ok(!JSON.stringify(record).includes('tokens'))
  })
  await test('new source seeds vary the sentence while preserving generation settings, and teacher sheets retain per-word source models',()=>{
    const input=recipe({...config('phrase-adjectif'),verbGroup:'mixte',phrasePolarity:'mixed'}),before=structuredClone(input),sentences=new Set()
    let source=createGameSource({recipe:input,name:'Tri'},'saved','classification')
    for(let draw=0;draw<8;draw++){
      const game=prepareGame(convertRecipe(source.recipe))
      sentences.add(game.questions[0].wordClassification.tokens.join(' '))
      const rows=teacherSheetRows(game,colors,defaultShapes)
      for(const row of rows){
        const question=game.questions.find(question=>question.id===row.questionId)
        // Guided activities put the model in the answer column, without a card.
        assert.equal(question.mode==='choice'?row.explanation:row.answer,game.corrections[question.id].text)
        assert.equal(!!row.card,question.mode==='choice')
      }
      source=renewGameSource(source,null)
      assert.equal(source.recipe.pages[0].verbGroup,'mixte');assert.equal(source.recipe.pages[0].phrasePolarity,'mixed')
    }
    assert.ok(sentences.size>1);assert.deepEqual(input,before)
  })
  await test('competition copies only neutral tokens and target, rejects forged categories, and permits the same category on successive words',()=>{
    const source=item([['Le','determinant'],['professeur','nom'],['voit','verbe'],['le','determinant'],['chat','nom']]),game=prepareGame(custom(source)),before=structuredClone(game)
    const quiz=parseCompetitionQuiz(competitionQuiz(game,'https://class.example'))
    for(const [index,item]of quiz.items.entries())assert.deepEqual(item.question.wordClassification,game.questions[index].wordClassification)
    for(const change of [
      v=>{v.target=-1},v=>{v.target=5},v=>{v.target=0.5},v=>{v.tokens=['seul']},v=>{v.tokens[0]={text:'Le',category:'determinant'}},
      v=>{v.categories=['nom']},v=>{v.tokens[0]='x'.repeat(121)},
    ]){const copy=structuredClone(quiz);change(copy.items[0].question.wordClassification);assert.throws(()=>parseCompetitionQuiz(copy),/tri invalides/)}
    let room=createCompetition(quiz,{enabled:false,seconds:30,feedbackSeconds:10,speedPoints:false},'online','123456',1000)
    room=competitionStep(room,{type:'join',avatarId:'panda'},1001);room=competitionStep(room,{type:'start'},1002)
    for(let index=0;index<quiz.items.length;index++){
      const at=1100+index*100,publicView=competitionView(room,at,'p1')
      assert.equal(publicView.correctChoiceId,undefined);assert.equal(publicView.question.wordClassification.category,undefined)
      room=competitionStep(room,{type:'answer',playerId:'p1',questionId:quiz.items[index].question.id,choiceId:quiz.items[index].correctChoiceId},at+10)
      room=competitionStep(room,{type:'next'},at+20)
    }
    assert.equal(room.players[0].score,5000);assert.deepEqual(game,before)
  })
}finally{await server.close()}
