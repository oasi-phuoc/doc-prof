import assert from 'node:assert/strict'
import {readFile,access} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',cacheDir:'/tmp/clairfle-pool-unit'})
try{
 const {POOL_TYPES,newPoolEntry,readPoolConfig}=await vite.ssrLoadModule('/src/interactive/pools/config.ts'),{poolRecipe,checkPoolQuestions,convertPoolRecipe}=await vite.ssrLoadModule('/src/interactive/pools/recipe.ts')
 const {prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts'),{applyPlanOptions,DEFAULT_PLAN_OPTIONS,positionOf}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts')
 const {createGameSource,renewGameSource}=await vite.ssrLoadModule('/src/interactive/game-run.ts'),{sourcePlan}=await vite.ssrLoadModule('/src/interactive/domain/source-plan.ts')
 const {startSession,transition}=await vite.ssrLoadModule('/src/interactive/domain/session.ts'),{readSessionSource}=await vite.ssrLoadModule('/src/interactive/domain/source.ts')
 const {newRecord,compactSession,replaySession,planIdentity}=await vite.ssrLoadModule('/src/interactive/domain/persistence.ts'),{competitionQuiz,parseCompetitionQuiz}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
 const {blockingPoolIssues}=await vite.ssrLoadModule('/src/interactive/pools/issues.ts')
 const {collectMedia}=await vite.ssrLoadModule('/src/interactive/media/assets.ts')
 const type=(domain,id)=>{const found=POOL_TYPES.find(t=>t.domain===domain&&t.type===id);assert.ok(found,`${domain} / ${id} must be offered`);return found}
 const addition=type('algèbre','addition-ligne'),area=type('géométrie','aires-carre'),words=type('gattegno','phrase-simple-svc')
 const config={version:1,entries:[{...newPoolEntry(addition),count:3,range:{min:1,max:10,decimals:false}},{...newPoolEntry(area),count:3},{...newPoolEntry(words),count:1}],shuffle:true}
 const poolId='aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',options={...DEFAULT_PLAN_OPTIONS,orderMode:'shuffled'}
 await test('the displayed catalogue contains only complete, issue-free playable source types and verified local media',async()=>{
  const catalogue=JSON.parse(await readFile('src/interactive/pools/catalog.generated.json')),inventory=await readFile('docs/interactive/inventory.json'),rows=JSON.parse(inventory).rows
  assert.equal(catalogue.inventorySha256,createHash('sha256').update(inventory).digest('hex'));assert.equal(catalogue.verifiedSeeds.length,3);assert.ok(POOL_TYPES.length>100);assert.equal(new Set(POOL_TYPES.map(t=>t.id)).size,POOL_TYPES.length)
  for(const offered of POOL_TYPES){const raw=rows.find(r=>r.id===offered.type&&r.domain===offered.domain);const gradedProof=offered.domain==='grammaire'&&JSON.parse(await readFile('docs/grammaire/implementation/questions-20261122-proofs/pools.json','utf8')).results.some(r=>r.type===offered.type&&r.status==='passed'&&r.positions===16&&r.seeds===3);assert.ok(gradedProof||raw?.playableQuestions>0&&!blockingPoolIssues(raw.issues).length);assert.ok(offered.levels?.length)
   for(const difficulty of offered.levels){const {game}=checkPoolQuestions({version:1,entries:[{...newPoolEntry(offered),difficulty}],shuffle:true},20261107);assert.ok(game.questions.length);assert.deepEqual(game.issues,[])
    for(const asset of collectMedia(game.questions,{baseUrl:'https://pool.example/'}))await access('public'+decodeURIComponent(new URL(asset.url).pathname))
   }
  }
  assert.ok(!POOL_TYPES.some(t=>['tpm-consignes','calli-mots'].includes(t.type)))
 })
 await test('pool validation refuses unknown or repeated types, unavailable levels, invalid quantities, ranges and future fields',()=>{
  assert.deepEqual(readPoolConfig(config),config)
  const first=config.entries[0],invalid=[{...config,entries:[]},{...config,entries:[first,first]},{...config,entries:[{...first,id:'unknown'}]},{...config,extra:true},{...config,shuffle:1},{...config,entries:[{...first,count:0}]},{...config,entries:[{...first,count:21}]},{...config,entries:[{...first,difficulty:'expert'}]},{...config,entries:[{...first,range:{min:10,max:1,decimals:false}}]},{...config,entries:[{...first,range:{min:Infinity,max:2,decimals:false}}]},{...config,entries:[{...first,range:{min:1,max:2,decimals:false,answer:3}}]}]
  for(const value of invalid)assert.throws(()=>readPoolConfig(value))
  const fixed=POOL_TYPES.find(t=>t.complete);assert.throws(()=>readPoolConfig({version:1,entries:[{...newPoolEntry(fixed),count:2}],shuffle:true}))
  const limited=POOL_TYPES.find(t=>t.levels.length<3);if(limited){const other=['facile','moyen','avance'].find(level=>!limited.levels.includes(level));assert.throws(()=>readPoolConfig({version:1,entries:[{...newPoolEntry(limited),difficulty:other}],shuffle:true}))}
  const notNumeric=POOL_TYPES.find(t=>!t.numbers);assert.throws(()=>readPoolConfig({version:1,entries:[{...newPoolEntry(notNumeric),range:first.range}],shuffle:true}))
 })
 await test('mixed domains keep their types, quantities, levels and numeric bounds while every new seed changes generated questions',()=>{
  const before=structuredClone(config),draws=new Set()
  for(let seed=1;seed<=20;seed++){const {recipe,game}=checkPoolQuestions(config,seed);assert.deepEqual(recipe.pages.map(p=>p.domain),['algèbre','géométrie','gattegno']);assert.equal(recipe.libreMode,false);assert.ok(recipe.pages.every(p=>!p.libreItems&&!p.extraBlocks));assert.ok(Object.values(recipe.institutional).every(value=>value===''))
   assert.equal(game.questions.filter(q=>q.source.page===0).length,3);assert.equal(game.questions.filter(q=>q.source.page===1).length,3);assert.equal(game.questions.filter(q=>q.source.page===2).length,1)
   for(const q of game.questions.filter(q=>q.source.page===0)){const numbers=q.prompt.match(/\d+/g).slice(0,2).map(Number);assert.ok(numbers.every(n=>n>=1&&n<=10));assert.ok(q.choices.some(c=>c.id===game.corrections[q.id].choiceId))}
   draws.add(JSON.stringify(game.questions.filter(q=>q.source.page<2).map(q=>q.prompt)))
  }
  assert.ok(draws.size>15);assert.deepEqual(config,before)
 })
 await test('mixing is reproducible and crosses domain boundaries, while source order can also be requested',()=>{
  const interleaved=new Set()
  for(let seed=1;seed<=20;seed++){const raw=checkPoolQuestions(config,seed).game,game=prepareGame(applyPlanOptions(raw,options));assert.deepEqual(game,prepareGame(applyPlanOptions(raw,options)));assert.equal(game.questions.length,raw.questions.length);assert.deepEqual(new Set(game.questions.map(q=>q.id)),new Set(raw.questions.map(q=>q.id)));interleaved.add(game.questions.map(q=>q.source.page).join(','));assert.deepEqual(prepareGame(applyPlanOptions(raw,DEFAULT_PLAN_OPTIONS)).questions.map(q=>q.source.page),raw.questions.map(q=>q.source.page))}
  assert.ok(interleaved.size>10)
 })
 await test('local pool references and fresh attempts are independent of saved worksheets, with stable source identity',()=>{
  const recipe=poolRecipe(config,123),source=createGameSource({recipe,name:'Maths et phrases'},'pool',poolId,options);assert.equal(source.recipe.seed,123);assert.equal(source.reference.kind,'pool');assert.match(source.sourceKey,/^pool-\d+$/);assert.equal(source.options.orderMode,'shuffled')
  const renewed=renewGameSource(source,null);assert.notEqual(renewed.recipe.seed,123);assert.deepEqual(renewed.template,recipe);assert.deepEqual(renewed.recipe.pages,recipe.pages);assert.equal(renewed.reference.id,poolId)
  const raw=convertPoolRecipe(source.recipe,source.name),configured=applyPlanOptions(raw,source.options),game=prepareGame(configured),context={reference:source.reference,sourceKey:source.sourceKey,seed:123,replay:0,selectedKeys:configured.questions.map(positionOf),resolvedKeys:game.questions.map(positionOf),timer:{enabled:false,seconds:30,feedbackSeconds:5},options:source.options};assert.deepEqual(readSessionSource(context),context);assert.deepEqual(sourcePlan(source.template,source.name,context,'class'),game)
  assert.throws(()=>sourcePlan({...recipe,seed:124},source.name,context,'class'))
 })
 await test('pool sessions replay and compact through the existing Class and Solo rules without storing configurations or answer keys',async()=>{
  for(const mode of ['class','solo']){const source=createGameSource({recipe:poolRecipe(config,123),name:'Pool'},'pool',poolId,options),raw=applyPlanOptions(convertPoolRecipe(source.recipe,source.name),options),game=prepareGame(raw,undefined,mode),context={reference:source.reference,sourceKey:source.sourceKey,seed:123,replay:0,selectedKeys:raw.questions.map(positionOf),timer:{enabled:false,seconds:30,feedbackSeconds:5},options},actions=mode==='class'?['CARDS_UP','DISCUSS','REVEAL'].map(type=>({type})):[{type:'TIMEOUT'}]
   let state=startSession(game,mode);const events=actions.map((action,index)=>({eventId:String(index),at:1000+index,action}));for(const event of events)state=transition(game,state,event.action,event.at)
   const record={...await newRecord(game,mode,context),updatedAt:1100,events},id=await planIdentity(game),compact=compactSession(record,state);assert.deepEqual(replaySession(game,record,id,1200,mode).state,state);assert.deepEqual(replaySession(game,compact,id,1200,mode).state,state);assert.equal(JSON.stringify(compact).includes('institutional'),false);if(mode==='class')assert.ok(state.history.every(a=>a.correct===undefined));else assert.ok(state.history.every(a=>a.correct===false||a.correct===undefined))
  }
 })
 await test('competition reuses verified questions from every chosen compatible domain, while open activities stay ungraded',()=>{
  const {game:raw}=checkPoolQuestions(config,123),game=prepareGame(applyPlanOptions(raw,options)),quiz=competitionQuiz(game,'https://pool.example');const parsed=parseCompetitionQuiz(quiz,['https://pool.example']);assert.equal(parsed.items.length,quiz.items.length);assert.deepEqual(parsed.items.map(i=>i.question.prompt),quiz.items.map(i=>i.question.prompt));assert.deepEqual(parsed.items.map(i=>i.question.choices.find(c=>c.id===i.correctChoiceId)?.text),quiz.items.map(i=>i.question.choices.find(c=>c.id===i.correctChoiceId)?.text));assert.equal(quiz.items.length,6);assert.equal(game.questions.filter(q=>q.mode!=='choice').length,1);for(const item of quiz.items)assert.ok(item.question.choices.some(c=>c.id===item.correctChoiceId));assert.ok(!JSON.stringify(quiz).includes(poolId))
 })
}finally{await vite.close()}
