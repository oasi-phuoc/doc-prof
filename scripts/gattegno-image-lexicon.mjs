import {readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const catalog=JSON.parse(await readFile('src/gallery/catalog.generated.json','utf8'))
const norm=text=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/œ/g,'oe').replace(/[’']/g,' ').replace(/[-_]/g,' ').replace(/\s+/g,' ').trim()
const withoutArticle=text=>text.replace(/^(?:un |une |des |du |de la |le |la |les |l['’])/i,'')
const nouns=new Map()
for(const image of catalog){
  if(image.collection!=='TCF'||!image.types.some(type=>['Objet','Animal','Végétal','Fruit','Légume','Plat','Véhicule','Lieu et décor','Forme et symbole','Personnage'].includes(type))||image.types.some(type=>['Scénario','Action','Document'].includes(type)))continue
  const label=norm(withoutArticle(image.label))
  if(label&&!nouns.has(label))nouns.set(label,{label,src:image.src,sourceLabel:image.label})
}
const objects=JSON.parse(await readFile('src/tcf/object-images.json','utf8'))
// A reviewed nominal clue can also be tagged as a scene by the audio catalogue.
const reviewed=JSON.parse(await readFile('docs/gattegno/indices-lexicaux-valides.json','utf8'))
for(const image of reviewed.images){
  if(!/^\/lib\/images\/tcf\/[a-zA-Z0-9_/-]+\.(?:webp|png)$/.test(image.src)||createHash('sha256').update(await readFile('public'+image.src)).digest('hex')!==image.sha256)throw new Error('Indice nominal relu absent ou modifié : '+image.label)
  const label=norm(image.label)
  if(!nouns.has(label))nouns.set(label,{label,src:image.src,sourceLabel:image.sourceLabel})
}
for(const object of objects){
  if(!/^(?:un |une |des |du |de la |le |la |les |l['’])/i.test(object.label))continue
  for(const alias of object.aliases??[]){const label=norm(alias);if(!nouns.has(label))nouns.set(label,{label,src:object.image,sourceLabel:object.label})}
}
const images=[...nouns.values()].sort((a,b)=>a.label.localeCompare(b.label,'fr'))
await writeFile('src/francais/phrase-tcf-pictures.generated.json',JSON.stringify(images,null,2)+'\n')
console.log(`${images.length} indices lexicaux reliés à des illustrations TCF existantes.`)

const manifest=JSON.parse(await readFile('docs/gattegno/illustrations-generation-20261114.json','utf8'))
const actions=[...manifest.images,...manifest.reused,...manifest.aliases].filter(row=>row.category==='verbe').map(row=>({label:row.label,src:row.path})).sort((a,b)=>a.label.localeCompare(b.label,'fr'))
await writeFile('src/francais/phrase-action-pictures.generated.json',JSON.stringify(actions,null,2)+'\n')
