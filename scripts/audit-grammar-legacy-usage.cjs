/** Compare legacy generation to the pulled commit, then justify bank retention. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict')
const current=require('./gattegno-loader.cjs'),root=current.root
const requested=process.argv.find(a=>a.startsWith('--base='))?.slice(7)??'HEAD'
assert(/^(?:HEAD|[a-f0-9]{7,40})$/i.test(requested),'Use HEAD or a commit hash for --base.')
const base=cp.execFileSync('git',['rev-parse','--verify',requested+'^{commit}'],{cwd:root,encoding:'utf8'}).trim()
const reference=fs.mkdtempSync('/tmp/clairfle-grammar-audit-')
const archive=reference+'/source.tar'
cp.execFileSync('git',['archive','--format=tar','--output',archive,base,'src','scripts/gattegno-loader.cjs'],{cwd:root})
cp.execFileSync('tar',['-xf',archive,'-C',reference])
fs.symlinkSync(root+'/node_modules',reference+'/node_modules');fs.symlinkSync(root+'/public',reference+'/public')
const previous=require(reference+'/scripts/gattegno-loader.cjs')
const get=(loader,base,file)=>loader.load(base+'/src/grammaire/'+file)
const oldTypes=get(previous,reference,'exercises/catalog-exercises.ts').buildGrammairePracticeTypes()
const types=get(current,root,'exercises/catalog-exercises.ts').buildGrammairePracticeTypes(),ids=new Set(types.map(t=>t.id))
const generateOld=get(previous,reference,'generate.ts').tryGenerateGrammaireBlock,generate=get(current,root,'generate.ts').tryGenerateGrammaireBlock
const co=get(previous,reference,'exercises/co-themes.ts'),entries=get(previous,reference,'exercises/co-bank.ts').grammarCoEntries
let checked=0,listening=0
const encoded=(value,base)=>JSON.stringify(value).replaceAll(base,'<project>')
const output=(fn,config,seed,base)=>{try{return encoded(fn(config,seed),base)}catch(e){return JSON.stringify({error:e.message})}}
for(const type of oldTypes){
 assert(ids.has(type.id),'Historical type removed: '+type.id)
 const theme=co.grammarCoThemeForType(type.id),levels=theme?['A1','A2'].filter(l=>entries(theme.id,l).length):[undefined]
 for(const level of levels)for(const seed of [17,839,2026]){
  const config={domain:'grammaire',topic:type.topic,exerciseType:type.id,difficulty:'facile',count:3,columns:1,...(level?{grammarCoLevel:level}:{})}
  assert.equal(output(generate,config,seed,root),output(generateOld,config,seed,reference),type.id+'/'+seed)
  checked++;if(/-(?:co-theme|co-audio|fam-co|nat-co)$/.test(type.id))listening++
 }
}
const protectedFiles=cp.execFileSync('git',['ls-files','src/grammaire/theory','public/lib/audio/grammaire','src/grammaire/exercises'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(p=>p.includes('/theory/')||p.includes('/audio/grammaire/')||/\/co-[^/]+\.(?:ts|json)$/.test(p))
assert.equal(cp.execFileSync('git',['diff','--name-only','HEAD','--',...protectedFiles],{cwd:root,encoding:'utf8'}).trim(),'','Protected theory or listening resource changed')
const {GRAM_EXERCISE_BANKS}=get(current,root,'exercises/bank/index.ts'),{GRAMMAR_PILOT_BANKS}=get(current,root,'curriculum/registry.ts')
const bankUsage=Object.keys(GRAM_EXERCISE_BANKS).map(type=>({type,entries:GRAM_EXERCISE_BANKS[type].length,pilotLevels:[...new Set(GRAMMAR_PILOT_BANKS.filter(b=>b.activityId===type).map(b=>b.level))],loadedByHistoricalRegistry:true,safeToDelete:false}))
const report={date:'2026-11-22',baseCommit:base,legacyOutputs:checked,listeningOutputs:listening,protectedFiles:protectedFiles.length,oldTypesRetained:oldTypes.length,
 decision:'Aucune suppression n’est validée par cet audit : les recettes sans niveau et les contenus non repris conservent des dépendances historiques. La présence d’un pilote ou une fusion de menu ne prouve pas l’absence d’usage des anciennes données. Les nouvelles fiches Se présenter utilisent A1 directement, sans réécrire les archives.',
 safeDeletionCandidates:[],runtimeEntryPoint:'src/grammaire/exercises/bank/index.ts',additionalDependencies:['scripts/build-grammar-family-a1.py réemploie 20 des 29 lectures/messages historiques.','Les CO sont protégées et distinctes des banques écrites A1/A2/B1.'],bankUsage,
 protectedSha256:Object.fromEntries(protectedFiles.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex')]))}
fs.writeFileSync(root+'/docs/grammaire/implementation/audit-banques-historiques-20261122.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({legacyOutputs:checked,listeningOutputs:listening,protectedFiles:protectedFiles.length,activeLegacyBanks:bankUsage.length,safeDeletions:0}))
