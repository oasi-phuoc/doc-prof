import {readFile,writeFile,access,mkdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const path='docs/interactive/inventory.json',bytes=await readFile(path),inventory=JSON.parse(bytes)
if(process.argv.includes('--check')){const current=JSON.parse(await readFile('src/interactive/pools/catalog.generated.json','utf8'));if(current.inventorySha256!==createHash('sha256').update(bytes).digest('hex')||!current.verifiedSeeds?.length||!current.items.length)throw new Error('Le catalogue des pools doit être vérifié : npm run pool:catalog');console.log(`${current.items.length} types de jeu vérifiés, catalogue à jour.`);process.exit(0)}
const complete=new Set(['jeux','grammaire','tpf','tcf-csc','tcf-cfr','tcm-csc','tcm-cfr'])
const informational=JSON.parse(await readFile('src/interactive/pools/informational-issues.json','utf8'))
const harmless=reason=>informational.includes(reason)||/^Audio \d+ : activité guidée, car la piste ne permet pas de garantir une seule réponse parmi les propositions\.$/.test(reason)
const media=value=>typeof value==='string'&&/^\/lib\/.*\.(?:png|webp|jpe?g|svg|mp3|wav|ogg)$/i.test(value)?[value]:Array.isArray(value)?value.flatMap(media):value&&typeof value==='object'?Object.values(value).flatMap(media):[]
const items=[]
for(const row of inventory.rows){
 if(!row.domain||!row.topic||!row.label||!row.playableQuestions||row.issues?.some(issue=>!harmless(issue.reason))||row.error)continue
 const refs=[...new Set(media(row.sourceFixture))]
 if((await Promise.allSettled(refs.map(ref=>access('public'+ref)))).some(result=>result.status==='rejected'))continue
 const topic=row.domain==='jeux'?'jeux-fruits':row.topic
 items.push({id:`${row.domain}:${topic}:${row.id}`,domain:row.domain,topic,type:row.id,label:row.label,context:row.domain==='jeux'?'Fruits':row.topic.replace(/^(?:gram|phrase|alpha|soutien|tcf)-/,'').replaceAll('-',' '),complete:complete.has(row.domain),difficulty:row.config.difficulty,numbers:['algèbre','géométrie','tpm'].includes(row.domain)})
}
await mkdir('src/interactive/pools',{recursive:true})
await writeFile('src/interactive/pools/catalog.generated.json',JSON.stringify({version:1,inventorySha256:createHash('sha256').update(bytes).digest('hex'),scope:'Only fully converted inventory samples without issues, with their local fixture media present. Generated questions are checked again before a pool is stored.',items})+'\n')
console.log(`${items.length} types jouables dans le catalogue des pools.`)
