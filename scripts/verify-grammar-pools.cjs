const assert=require('node:assert/strict'),fs=require('node:fs')
const {load,root}=require('./gattegno-loader.cjs')
const {POOL_TYPES}=load(root+'/src/interactive/pools/config.ts')
const {poolRecipe,convertPoolRecipe,assertPoolDraw}=load(root+'/src/interactive/pools/recipe.ts')
const {isRetiredGrammarType}=load(root+'/src/grammaire/curriculum/retirement.ts')
const graded=new Set(require('../src/grammaire/curriculum/graded-activities.json'))
const entries=POOL_TYPES.filter(t=>t.domain==='grammaire'&&isRetiredGrammarType(t.type)),results=[]
assert(entries.length>=22);assert(entries.every(t=>graded.has(t.type)))
for(const type of entries){
 for(const seed of [17,839,2026]){
  const r=poolRecipe({version:1,entries:[{id:type.id,count:1,difficulty:type.difficulty}],shuffle:true},seed)
  assert(r.pages[0].grammarLevel,type.id);r.pages=Array.from({length:16},()=>r.pages[0])
  const game=convertPoolRecipe(r,'Pool de grammaire');assertPoolDraw(r,game)
  assert.equal(game.issues.length,0);assert(game.questions.length>=16)
 }
 results.push({type:type.type,positions:16,seeds:3,status:'passed'})
}
const file=root+'/docs/grammaire/implementation/current-pools-verification.json'
const serialized=JSON.stringify({status:'passed',types:results.length,results},null,2)+'\n'
fs.writeFileSync(file,serialized)
const evidence=process.argv.find(arg=>arg.startsWith('--evidence='))?.slice(11)
if(evidence){if(!evidence.startsWith('docs/grammaire/implementation/')||evidence.includes('..'))throw Error('Invalid evidence path');fs.writeFileSync(root+'/'+evidence,serialized)}
console.log(JSON.stringify({poolTypes:results.length,positions:16,seeds:3,status:'passed'}))
