import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'

const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',cacheDir:'/tmp/clairfle-tpm-fractions-unit'})
try{
 const {defaultPage}=await vite.ssrLoadModule('/src/math/catalog.ts'),{buildPage,buildWorksheets}=await vite.ssrLoadModule('/src/math/generate.ts')
 const {demoRecipe}=await vite.ssrLoadModule('/src/interactive/demo.ts'),{convertRecipe}=await vite.ssrLoadModule('/src/interactive/domain/convert.ts')
 const {verifiedFractions}=await vite.ssrLoadModule('/src/interactive/domain/fractions.ts')
 const {POOL_TYPES,newPoolEntry,readPoolConfig}=await vite.ssrLoadModule('/src/interactive/pools/config.ts')
 const {applyPlanOptions,DEFAULT_PLAN_OPTIONS}=await vite.ssrLoadModule('/src/interactive/domain/plan-options.ts'),{prepareGame}=await vite.ssrLoadModule('/src/interactive/domain/plan.ts')
 const {createGameSource,renewGameSource}=await vite.ssrLoadModule('/src/interactive/game-run.ts')
 const {competitionQuiz,parseCompetitionQuiz,createCompetition,competitionView}=await vite.ssrLoadModule('/src/interactive/competition/core.ts')
 const base=demoRecipe(),page=(count=6,difficulty='moyen')=>({...defaultPage('tpm'),topic:'tpm-info',exerciseType:'tpm-fractions-mixte',count,difficulty,libreItems:undefined,extraBlocks:undefined})
 const ratio=text=>{const[n,d='1']=text.replaceAll('−','-').split('/');return[BigInt(n.trim()),BigInt(d.trim())]}
 const equal=(a,b)=>a[0]*b[1]===b[0]*a[1]
 await test('the six-question TPM source series has an honest default and quantity limit, without an unrelated number-range option',()=>{
  const type=POOL_TYPES.find(type=>type.type==='tpm-fractions-mixte'&&type.domain==='tpm');assert.ok(type)
  assert.equal(type.defaultCount,6);assert.equal(type.maxCount,6);assert.equal(type.numbers,false)
  const entry=newPoolEntry(type),config={version:1,entries:[entry],shuffle:true};assert.equal(entry.count,6)
  assert.deepEqual(readPoolConfig(config),config)
  assert.throws(()=>readPoolConfig({...config,entries:[{...entry,count:7}]}))
  assert.throws(()=>readPoolConfig({...config,entries:[{...entry,range:{min:1,max:10,decimals:false}}]}))
 })
 await test('TPM mixed fractions retain all source questions over 900 generated configurations with independently checked arithmetic',()=>{
  const operations=new Set(),signs=new Set(),blanks=new Set(),draws=new Set()
  for(const difficulty of ['facile','moyen','avance'])for(let count=1;count<=6;count++)for(let seed=1;seed<=50;seed++){
   const recipe={...base,pages:[page(count,difficulty)],seed,libreMode:false},before=structuredClone(recipe)
   const source=buildPage(recipe.pages[0],seed).blocks.flatMap(b=>b.items),game=convertRecipe(recipe)
   assert.equal(source.length,count);assert.equal(game.questions.length,count,JSON.stringify(game.issues));assert.deepEqual(game.issues,[])
   for(const[index,q]of game.questions.entries()){
    const item=source[index],correct=q.choices.find(c=>c.id===game.corrections[q.id].choiceId)
    assert.equal(correct.text,item.answer);assert.equal(q.choices.length,6);assert.equal(q.source.item,index)
    const values=q.choices.map(c=>ratio(c.text))
    for(let a=0;a<values.length;a++)for(let b=a+1;b<values.length;b++)assert.ok(!equal(values[a],values[b]))
    if(item.labels[0]==='frac-reduce-partial'){
     const[left,right]=item.prompt.replace('□',item.answer).split(' = ').map(ratio);assert.ok(equal(left,right));blanks.add(item.missing)
    }else if(item.labels[0]==='frac-reduce')assert.ok(equal(ratio(item.prompt.split(' =')[0]),ratio(item.answer)))
    else{
     operations.add(item.op);const parts=item.prompt.replace(/\s*=$/,'').split(` ${item.op} `),[an,ad]=ratio(parts[0]),[bn,bd]=ratio(parts[1])
     const value=item.op==='+'?[an*bd+bn*ad,ad*bd]:item.op==='−'?[an*bd-bn*ad,ad*bd]:item.op==='×'?[an*bn,ad*bd]:[an*bd,ad*bn]
     assert.ok(equal(ratio(item.answer),value),`${item.prompt} → ${item.answer}`)
     if(item.op==='×'||item.op==='÷'){assert.ok(an<0n||bn<0n);signs.add(ratio(item.answer)[0]<0n?'negative':'positive')}
    }
    for(const maxChoices of [2,6]){const configured=applyPlanOptions(game,{...DEFAULT_PLAN_OPTIONS,numericOrder:true,maxChoices});const item=configured.questions[index];assert.ok(item.choices.some(c=>c.id===configured.corrections[item.id].choiceId));assert.equal(item.choices.length,maxChoices)}
   }
   if(count===6&&difficulty==='moyen')draws.add(JSON.stringify(source.map(i=>i.prompt)))
   assert.deepEqual(recipe,before)
  }
  assert.deepEqual(operations,new Set(['+','−','×','÷']));assert.deepEqual(signs,new Set(['positive','negative']));assert.deepEqual(blanks,new Set(['a','b']));assert(draws.size>45)
 })
 await test('unknown TPM labels, incorrect operators and corrupted corrections are rejected rather than guessed',()=>{
  const items=buildPage(page(),42).blocks.flatMap(b=>b.items)
  const invalid=[{...items[0],labels:[]},{...items[0],labels:['frac-reduce-partial','frac-op']},{...items[1],answer:'99/7'},{...items[4],op:'+'},{...items[5],answer:'1/0'},{...items[5],prompt:'1/2 ÷ 0/3 =',answer:'0'}]
  for(const item of invalid){assert.ok(verifiedFractions(item,'tpm-fractions-mixte')?.reason);const game=convertRecipe({...base,pages:[{...page(1),libreItems:[item]}]});assert.equal(game.questions.length,0);assert(game.issues.length>0)}
 })
 await test('new parts change the six generated questions without changing the source recipe or its printable rendering',()=>{
  const recipe={...base,pages:[page()],seed:42},before=structuredClone(recipe),paper=buildWorksheets(recipe.pages,recipe.seed)
  const source=createGameSource({recipe,name:'Fractions TPM'},'saved','tpm-fraction-fixture'),next=renewGameSource(source,null)
  assert.notEqual(next.recipe.seed,source.recipe.seed);assert.deepEqual(next.template,recipe)
  assert.notDeepEqual(convertRecipe(next.recipe).questions.map(q=>q.prompt),convertRecipe(source.recipe).questions.map(q=>q.prompt))
  assert.deepEqual(recipe,before);assert.deepEqual(buildWorksheets(recipe.pages,recipe.seed),paper)
 })
 await test('both play modes and competition preserve all six exact answer keys while public room questions omit corrections',()=>{
  const raw=convertRecipe({...base,pages:[page()],seed:42})
  for(const mode of ['class','solo']){const game=prepareGame(applyPlanOptions(raw,DEFAULT_PLAN_OPTIONS),undefined,mode);assert.equal(game.questions.length,6);assert.equal(game.rounds.length,6)}
  const quiz=competitionQuiz(raw,'https://tpm.example/'),parsed=parseCompetitionQuiz(quiz,['https://tpm.example/'])
  assert.equal(parsed.items.length,6)
  const room=createCompetition(parsed,{enabled:false,seconds:30,feedbackSeconds:1,speedPoints:false},'online','123456',1000)
  const view=competitionView({...room,phase:'question'},1000)
  assert.equal(view.question.choices.length,6)
  assert.ok(!JSON.stringify(view).includes('correctChoiceId'));assert.ok(!JSON.stringify(view).includes('corrections'))
 })
}finally{await vite.close()}
