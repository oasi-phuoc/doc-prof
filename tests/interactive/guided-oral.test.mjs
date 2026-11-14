import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFile} from 'node:fs/promises'
import {createServer} from 'vite'

const vite=await createServer({cacheDir:'/tmp/clairfle-guided-oral-unit',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {adaptGuidedOral}=await vite.ssrLoadModule('/src/interactive/domain/guided-oral.ts')
  const {convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
  const {buildPage,buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
  const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts')
  const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts')
  const {prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
  const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts')
  const {runtimeFor}=await vite.ssrLoadModule('/src/interactive/domain/round-runtime.ts')
  const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts')
  const {teacherSheetRows,teacherSheetHtml}=await vite.ssrLoadModule('/src/interactive/domain/teacher-sheet.ts')
  const {competitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
  const {PALETTE,defaultShapes}=await vite.ssrLoadModule('/src/interactive/domain/palette.ts')
  const banks=(await Promise.all(['a0-a1','a1-a2'].map(level=>readFile(`src/tcf/content/${level}/po.json`,'utf8').then(JSON.parse)))).flat()
  const illustrated=banks.filter(exercise=>exercise.type_exercice==='image_interaction')
  const story=illustrated.find(exercise=>exercise.id==='tcf-a0a1-po-img-accident-velo')
  assert.ok(story)
  const base=demoRecipe()
  const page=exercise=>({...defaultPage(exercise.niveau==='A0-A1'?'tcf-csc':'tcf-cfr'),topic:'tcf-po',exerciseType:'tcf-po',tcfBankId:exercise.id,count:1,libreItems:undefined,extraBlocks:undefined})
  const recipe=(exercise=story,seed=42)=>({...base,libreMode:false,pages:[page(exercise)],seed})

  await test('all current illustrated PO banks retain their exact images, source prompts and complete private examples over three seeds without changing worksheets',()=>{
    assert.ok(illustrated.length)
    for(const exercise of illustrated)for(const seed of [1,42,20261114]){
      const input=recipe(exercise,seed),before=structuredClone(input),paper=seed===1?structuredClone(buildWorksheets(input.pages,seed)):undefined
      const source=buildPage(input.pages[0],seed).blocks[0].items.find(item=>item.tcf?.kind==='support').tcf.exercise
      const game=convertRecipe(input),q=game.questions[0]
      assert.equal(game.questions.length,1,`${exercise.id}: ${JSON.stringify(game.issues)}`)
      assert.deepEqual(q.images,source.support.images);assert.deepEqual(q.hints,source.support.questions)
      assert.equal(q.mode,q.images.length===4?'sequence':'oral');assert.equal(q.compatibility,'teacher-led');assert.deepEqual(q.choices,[])
      assert.ok(game.corrections[q.id].text.includes(source.support.description_modele))
      for(const turn of source.support.repliques)assert.ok(game.corrections[q.id].text.includes(turn.texte))
      assert.ok(q.oralSituation.includes(source.support.vous_voulez))
      assert.deepEqual(input,before)
      if(paper)assert.deepEqual(buildWorksheets(input.pages,seed),paper)
    }
  })
  await test('one to four images are preserved in edited scenes, including the single-image alias; invalid counts and ambiguous fields never silently remove a picture',()=>{
    for(let count=1;count<=4;count++){
      const exercise=structuredClone(story);exercise.support.images=exercise.support.images.slice(0,count)
      const result=adaptGuidedOral(exercise,'Décrivez les images.')
      assert.deepEqual(result.issues,[]);assert.equal(result.question.images.length,count)
    }
    const single=structuredClone(story);single.support.image=single.support.images[0];delete single.support.images
    assert.equal(adaptGuidedOral(single,'Décrivez.').question.images.length,1)
    for(const change of [e=>{e.support.images=[]},e=>{e.support.images.push('/fifth.webp')},e=>{e.support.images[0]=''},e=>{e.support.images[0]=null},e=>{e.support.images='photo'},e=>{e.support.image='/contradiction.webp'},e=>{e.type_exercice='sequence_4_images';e.support.images.pop()}]){
      const exercise=structuredClone(story);change(exercise)
      const before=structuredClone(exercise),result=adaptGuidedOral(exercise,'Décrivez.')
      assert.equal(result.question,undefined);assert.ok(result.issues.length);assert.deepEqual(exercise,before)
    }
  })
  await test('public roles and staged prompts contain neither narration nor dialogue answers; missing examples remain explicitly unavailable',()=>{
    const result=adaptGuidedOral(story,'Racontez.'),publicText=JSON.stringify(result.question)
    assert.ok(result.question.oralSituation.includes('Rôle de l’enseignant : votre mère'))
    assert.ok(!publicText.includes(story.support.description_modele))
    for(const turn of story.support.repliques)assert.ok(!publicText.includes(turn.texte))
    const missing=structuredClone(story);delete missing.support.description_modele;delete missing.support.repliques
    assert.match(adaptGuidedOral(missing,'Racontez.').model,/Aucun modèle/)
  })
  await test('malformed or oversized prompts, roles and dialogue models are rejected rather than truncated or reinterpreted',()=>{
    for(const change of [e=>{e.support.questions=['']},e=>{e.support.questions=[{}]},e=>{e.support.questions=Array(33).fill('Question ?')},e=>{e.support.vous_etes={role:'élève'}},e=>{e.support.lieu='x'.repeat(501)},e=>{e.support.repliques=[{locuteur:'other',texte:'Proposition'}]},e=>{e.support.repliques=[{locuteur:'eleve',texte:''}]},e=>{e.support.description_modele='x'.repeat(24001)},e=>{e.support.description_modele={invented:'answer'}},e=>{e.support.reponse_modele=['answer']}]){
      const exercise=structuredClone(story);change(exercise)
      assert.equal(adaptGuidedOral(exercise,'Racontez.').question,undefined)
    }
    assert.equal(adaptGuidedOral({...story,competence:'CE'},'Racontez.'),undefined)
  })
  await test('source image replacements stay associated with the same oral roles and models while the saved recipe remains untouched',()=>{
    const input=recipe(),source=story.support.images[0],replacement=story.support.images[1]
    input.imageOverrides={[source]:replacement}
    const before=structuredClone(input),game=convertRecipe(input),q=game.questions[0]
    assert.equal(q.images[0],replacement);assert.ok(game.corrections[q.id].text.includes(story.support.description_modele));assert.deepEqual(input,before)
  })
  await test('Class remains collective and guided; hints, reordered scenes and human appreciation never manufacture an automatic score or competition question',()=>{
    const game=prepareGame(convertRecipe(recipe())),q=game.questions[0]
    let state=startSession(game)
    assert.equal(transition(game,state,{type:'SELECT',choiceId:'invented'}),state)
    assert.equal(transition(game,state,{type:'HINT_SHOW',questionId:q.id}),state)
    state=transition(game,state,{type:'IMAGE_ORDER_SET',questionId:q.id,order:[2,1,0,3]})
    assert.deepEqual(runtimeFor(game,state).imageOrders[q.id],[2,1,0,3])
    state=transition(game,state,{type:'CARDS_UP'});state=transition(game,state,{type:'HINT_SHOW',questionId:q.id})
    assert.equal(runtimeFor(game,state).hintsShown[q.id],1)
    const locked=transition(game,state,{type:'TEACHER_LOCK_SET',locked:true})
    assert.equal(transition(game,locked,{type:'HINT_SHOW',questionId:q.id}),locked)
    state=transition(game,state,{type:'DISCUSS'});state=transition(game,state,{type:'REVEAL'},1000)
    assert.equal(state.history[0].correct,undefined)
    state=transition(game,state,{type:'ASSESS',value:'acquired',questionId:q.id});assert.equal(state.history[0].manual,'acquired')
    const solo=transition(game,startSession(game,'solo'),{type:'TIMEOUT'})
    assert.equal(solo.history[0].correct,undefined);assert.equal(competitionQuiz(game,'https://class.example').items.length,0)
  })
  await test('scene order, staged hints and teacher appreciation survive checkpoint and event replay without storing any private example',async()=>{
    const game=prepareGame(convertRecipe(recipe())),q=game.questions[0],planId=await planIdentity(game)
    let state=startSession(game)
    const actions=[{type:'IMAGE_ORDER_SET',questionId:q.id,order:[1,0,2,3]},{type:'CARDS_UP'},{type:'HINT_SHOW',questionId:q.id},{type:'DISCUSS'},{type:'REVEAL'},{type:'ASSESS',questionId:q.id,value:'retry'}]
    const events=actions.map((action,index)=>({eventId:String(index),at:1000+index,action}))
    for(const event of events)state=transition(game,state,event.action,event.at)
    const record={...await newRecord(game,'class'),updatedAt:1010,events}
    assert.deepEqual(replaySession(game,record,planId,1020).state,state)
    const compacted=compactSession(record,state)
    assert.deepEqual(replaySession(game,compacted,planId,1020).state,state)
    assert.ok(!JSON.stringify(compacted).includes(story.support.description_modele));assert.ok(!JSON.stringify(compacted).includes('Exemple d’échange'))
  })
  await test('teacher sheets keep the whole dialogue and public situation as an example, with no answer card assigned',()=>{
    const game=prepareGame(convertRecipe(recipe())),rows=teacherSheetRows(game,PALETTE.map(card=>card.color),defaultShapes)
    assert.equal(rows.length,1);assert.equal(rows[0].card,undefined);assert.ok(rows[0].notes.includes('Votre objectif :'))
    assert.ok(rows[0].answer.includes(story.support.repliques.at(-1).texte));assert.ok(teacherSheetHtml('Oral','plan',rows).includes('Exemple d’échange'))
  })
  await test('every illustrated source refers to existing WebP bytes; no unrendered placeholder counts as an oral image',async()=>{
    const sources=[...new Set(illustrated.flatMap(exercise=>exercise.support.images))]
    for(const src of sources){const bytes=await readFile('public'+src);assert.equal(bytes.subarray(0,4).toString(),'RIFF',src);assert.equal(bytes.subarray(8,12).toString(),'WEBP',src)}
  })
}finally{await vite.close()}
