/** Capture/verify G0 without changing sources, including CO aliases and audio. */
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const assert = require('node:assert/strict')
const { load, root } = require('./gattegno-loader.cjs')
const digest = value => crypto.createHash('sha256').update(value).digest('hex')
const jsonHash = value => digest(JSON.stringify(value))
const generate = load(root+'/src/grammaire/generate.ts').tryGenerateGrammaireBlock
const catalog = load(root+'/src/grammaire/exercises/catalog-exercises.ts')
const { grammarCoThemeForType } = load(root+'/src/grammaire/exercises/co-themes.ts')
const { grammarCoEntries } = load(root+'/src/grammaire/exercises/co-bank.ts')
const co = id => /-(?:co-theme|co-audio|fam-co|nat-co)$/.test(id)
const target = path.join(root, 'docs/grammaire/implementation/baseline-g0.json')
function output(config, seed) {
  try { return { hash: jsonHash(generate(config,seed)) } }
  catch (error) { return { error: String(error.message) } }
}
function files(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? files(path.join(dir,entry.name)) : [path.join(dir,entry.name)])
}
if (process.argv.includes('--capture')) {
  assert(!fs.existsSync(target),'Baseline already captured; do not overwrite the reference')
  const types=catalog.buildGrammairePracticeTypes()
  const aliases=[['gram-ex-a1-co-audio','gram-se-presenter'],['gram-ex-famille-fam-co','gram-se-presenter']]
  const fixtures=[]
  for (const type of [...types,...aliases.map(([id,topic])=>({id,topic}))]) {
    const theme=grammarCoThemeForType(type.id)
    const levels=theme ? ['A1','A2'].filter(level=>grammarCoEntries(theme.id,level).length) : [undefined]
    for (const level of levels) for (const seed of [17,839,2026]) {
      const config={domain:'grammaire',topic:type.topic,exerciseType:type.id,difficulty:'facile',count:3,columns:1,...(level?{grammarCoLevel:level}:{})}
      fixtures.push({config,seed,protectedCo:co(type.id),...output(config,seed)})
    }
  }
  const dedicated=files(root+'/src/grammaire/exercises').filter(p=>/\/co-[^/]+\.(?:ts|json)$/.test(p))
  const media=files(root+'/public/lib/audio/grammaire')
  const protectedFiles=[...dedicated,...media].map(p=>({path:path.relative(root,p),sha256:digest(fs.readFileSync(p))}))
  fs.mkdirSync(path.dirname(target),{recursive:true})
  fs.writeFileSync(target,JSON.stringify({schemaVersion:1,commit:process.env.GRAMMAR_BASELINE_COMMIT,practiceTypeIds:types.map(t=>t.id),fixtures,protectedFiles},null,2)+'\n')
  console.log(JSON.stringify({types:types.length,fixtures:fixtures.length,coFixtures:fixtures.filter(f=>f.protectedCo).length,protectedFiles:protectedFiles.length,existingErrors:fixtures.filter(f=>f.error).length}))
} else {
  const baseline=JSON.parse(fs.readFileSync(target,'utf8'))
  for (const f of baseline.fixtures) assert.deepEqual(output(f.config,f.seed),f.hash?{hash:f.hash}:{error:f.error},`${f.config.exerciseType} / ${f.config.grammarCoLevel??'legacy'} / ${f.seed}`)
  for (const f of baseline.protectedFiles) assert.equal(digest(fs.readFileSync(path.join(root,f.path))),f.sha256,f.path)
  const ids=new Set(catalog.buildGrammairePracticeTypes().map(t=>t.id))
  for (const id of baseline.practiceTypeIds) assert(ids.has(id),`Existing type removed: ${id}`)
  console.log(`G0 verified: ${baseline.fixtures.length} legacy/CO outputs and ${baseline.protectedFiles.length} protected files unchanged.`)
}
