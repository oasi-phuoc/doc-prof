const assert=require('node:assert/strict')
const fs=require('node:fs'),crypto=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks,defaultGrammarPilot}=load(root+'/src/grammaire/curriculum/registry.ts')
const {validGrammarUnit}=load(root+'/src/grammaire/curriculum/validation.ts')
const {validGrammarImage}=load(root+'/src/grammaire/curriculum/image-support.ts')
const {buildFicheRecipe,parseFicheRecipe}=load(root+'/src/fiches/recipe.ts')
const {convertRecipe}=load(root+'/src/interactive/domain/convert.ts')
const {resolveGramSubthemeAll}=load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const set=banks.filter(b=>['a2','a6'].includes(b.subthemeId)&&b.topic==='gram-se-presenter')
assert.equal(set.length,9);assert.equal(set.reduce((n,b)=>n+b.presentations.length,0),13)
assert.equal(set.reduce((n,b)=>n+b.units.length,0),450)
const sources=new Map(set.flatMap(b=>b.units.map(u=>[u.id,u])))
const recipe=(b,p)=>buildFicheRecipe({pages:[{domain:'grammaire',topic:b.topic,exerciseType:b.activityId,count:50,columns:1,difficulty:'facile',...defaultGrammarPilot(b.activityId),grammarPresentation:p}],seed:1193,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:false,libreSnapshot:null})
for(const b of set) {
 assert.equal(resolveGramSubthemeAll(b.topic,b.activityId).id,b.subthemeId)
 assert.equal(b.review.humanReview,'pending')
 for(const u of b.units) {
  assert(validGrammarUnit(u))
  if(u.kind==='match') {
   assert.equal(u.pairs.length,3)
   assert.equal(new Set(u.pairs.map(p=>p.right.toLowerCase().replace('j’','je'))).size,3)
   for(const p of u.pairs){const original=sources.get(p.sourceId);assert(original);assert(p.left.includes(original.prompt));assert.equal(p.right,original.answers[0])}
  }
  if(b.activityId.endsWith('prov-pays')) {
   assert.equal(u.imageSupports.length,1)
   assert(!u.cue.includes(u.answers[0]),'Country not supplied as a textual hint')
   const full=u.prompt.replace('___',u.answers[0]);assert(!/d’\s/.test(full))
  }
  if(b.activityId.endsWith('prov-prep')) {
   assert(['masculin','féminin','pluriel'].includes(u.countryGender))
   assert(!u.givenVerb,'Country gender is not a verb hint')
   assert(!/d’\s/.test(u.prompt.replace('___',u.answers[0])))
   const bad=structuredClone(u);bad.countryGender='neutre';assert(!validGrammarUnit(bad))
  }
  if(b.activityId.endsWith('prov-phrases')) {
   assert.equal(u.imageSupports.length,2);assert(u.prompt.includes('Nationalité déclarée'))
   assert(u.prompt.includes('Personnage fictif'));assert(u.writeLines>=2)
  }
  if(u.kind==='production'){assert(u.rubric.length>=4);assert(u.answers[0]);assert(u.task)}
 }
 for(const p of b.presentations) {
  const r=recipe(b,p);assert(parseFicheRecipe(JSON.parse(JSON.stringify(r))))
  const game=convertRecipe(r);assert.equal(game.questions.length,p==='match'?150:50)
  if(p!=='choice'&&p!=='match')assert(game.questions.every(q=>q.compatibility==='teacher-led'))
  assert(game.questions.every(q=>!('model' in q)&&!('answer' in q)))
  if(b.activityId.endsWith('prov-prep'))assert(game.questions.every(q=>q.grammarCountryGender&&q.prompt.includes(`(${q.grammarCountryGender})`)))
  if(b.activityId.endsWith('prov-pays')||b.activityId.endsWith('prov-phrases'))assert(game.questions.every(q=>q.grammarImages?.length===(b.activityId.endsWith('prov-pays')?1:2)))
 }
}
const pron=set.find(b=>b.activityId==='gram-ex-a2-qcm-verbe')
const elision=pron.units.find(u=>u.answers[0]==='J’');assert.equal(elision.prompt.replace('___','J’'),'J’arrive à la gare.')
assert(pron.units.filter(u=>u.prompt.startsWith('___')).every(u=>u.answers[0][0]===u.answers[0][0].toUpperCase()))
const manifest=require('../docs/grammaire/implementation/presentation-media.json')
assert.equal(manifest.generatedImages,0);assert.equal(manifest.supports.length,20)
for(const s of manifest.supports) {
 assert(validGrammarImage(s));assert(!s.source.path.endsWith('/japon.webp'))
 const actual=fs.readFileSync(root+'/public'+s.src),original=fs.readFileSync(root+'/public'+s.source.path)
 assert.deepEqual(actual,original);assert.equal(crypto.createHash('sha256').update(actual).digest('hex'),s.sha256)
 assert.equal(s.source.rights,'permitted-reuse')
}
const mediaById=new Map(manifest.supports.map(s=>[s.id,s]))
for(const b of set)for(const u of b.units)for(const s of u.imageSupports??[])assert.deepEqual(s,mediaById.get(s.id))
const r=require('../docs/grammaire/implementation/target-registry.json')
assert.equal(r.offerings.filter(o=>o.themeId==='gram-se-presenter'&&o.availability==='pilot_preview').length,13)
console.log('Se présenter A1 : 13 offres, 450 unités, pronoms non ambigus, élisions, genres, 20 médias immuables, 2 images en PE, oral et recettes vérifiés.')
