import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const norm=text=>String(text).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim()
const slug=text=>norm(text).replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,96)
const pretty=text=>text.replace(/[-_]+/g,' ').replace(/^./,c=>c.toUpperCase())
const read=(root,file,fallback=[])=>existsSync(path.join(root,file))?JSON.parse(readFileSync(path.join(root,file),'utf8')):fallback
const walk=(root,dir)=>existsSync(path.join(root,dir))?readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(root,path.posix.join(dir,entry.name)):[path.posix.join(dir,entry.name)]):[]
const unique=values=>[...new Set(values.filter(Boolean))]

/** Index files that can actually be served. Never expose ASR work files or infer
 * a recording's transcript from its filename. Bank texts are copied verbatim. */
export function buildAudioCatalog(root) {
 const durations=read(root,'src/tcf/content/audio-durations.json',{}),aliases=read(root,'src/tcf/content/audio-replacements.json',{})
 const records=new Map()
 for(const file of walk(root,'public/lib/audio').filter(file=>/\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i.test(file))){
  const bytes=statSync(path.join(root,file)).size
  if(!bytes||bytes<256&&readFileSync(path.join(root,file),'utf8').startsWith('version https://git-lfs.github.com/'))continue
  const src='/'+file.slice('public/'.length),folder=src.split('/')[3],stem=path.posix.basename(src).replace(/\.[^.]+$/,'')
  const collection=({tcf:'TCF',grammaire:'Grammaire',soutien:'Soutien français',vocabulaire:'Vocabulaire',syllabes:'Syllabes',nombre:'Nombres'})[folder]??'Autres audios'
  const type=folder==='syllabes'?'Syllabe':folder==='nombre'?'Nombre':folder==='vocabulaire'?'Mot':src.includes('/phrases/')?'Phrase':/consigne|intro|lisez|audio-numero|bip|silence/.test(stem)?'Consigne et signal':'Enregistrement'
  records.set(src,{entry:{id:src,src,label:pretty(stem),themes:new Set(),types:new Set([type]),collection,levels:new Set(),bytes,...(durations[src]?{duration:durations[src]}:{})},detail:{transcripts:[],blocks:[],images:[],notes:[]}})
 }
 const image=src=>({src,available:typeof src==='string'&&src.startsWith('/')&&!src.includes('..')&&existsSync(path.join(root,'public',src))})
 const addTranscript=(record,text,source)=>{
  if(typeof text!=='string'||!text.trim())return
  const existing=record.detail.transcripts.find(t=>t.text===text.trim())
  if(existing)existing.sources=unique([...existing.sources,source]);else record.detail.transcripts.push({text:text.trim(),sources:[source]})
 }
 const format=(kind,data)=>{
  if(!data)return undefined
  if(kind==='lignes')return {kind:'lines',label:'Réponse écrite',model:data.reponse_modele,lines:data.nb_lignes??2,rows:data.tableau?.map(row=>({label:row.label,answer:row.reponse}))}
  if(!Array.isArray(data.choix)||!data.choix.length)return undefined
  return {kind:kind==='qcm_image'?'image':'text',label:kind==='qcm_image'?'Choix en images':'Choix en texte',choices:data.choix.map((choice,i)=>({letter:/^[a-z]$/i.test(choice.id)?choice.id.toUpperCase():String.fromCharCode(65+i),...(choice.texte!==undefined?{text:choice.texte}:{}),...(choice.image?{image:image(choice.image)}:{}),...(typeof choice.correct==='boolean'?{correct:choice.correct}:{})}))}
 }
 const question=(q,id)=>{
  const formats=[]
  for(const kind of ['qcm_texte','qcm_image','lignes']){
   const sources=[...(q.type_reponse===kind?[q]:[]),...(q.formes?.[kind]?[q.formes[kind]]:[])]
   for(const source of sources){const value=format(kind,source);if(value&&!formats.some(f=>JSON.stringify(f)===JSON.stringify(value)))formats.push(value)}
  }
  return {id,prompt:q.enonce??'',images:unique([q.image,...(q.images??[])]).map(image),formats}
 }
 const addExercise=(ex,bank)=>{
  if(!ex?.support)return
  const refs=ex.support.audios?.length?ex.support.audios:ex.support.audio?[ex.support.audio]:[]
  refs.forEach((raw,index)=>{
   const src=aliases[raw]??raw,record=records.get(src);if(!record)return
   const {entry,detail}=record,source=`${bank} · ${ex.id}`
   entry.label=ex.scene?.trim()||ex.theme?.trim()||entry.label
   if(refs.length>1)entry.label+=` · piste ${index+1}`
   entry.themes.add(ex.theme||ex.scenario||pretty(src.split('/').at(-2)??''));if(ex.niveau)entry.levels.add(ex.niveau)
   entry.types.add(ex.type_exercice==='association_images'?'Dialogue et situations':ex.type_exercice==='images_a_reconnaitre'?'Objets à reconnaître':'Compréhension orale')
   for(const tag of ex.tags??[])entry.types.add(({scenario:'Scénario',court:'Court',moyen:'Moyen',long:'Long',objet:'Objets à reconnaître'})[tag]??pretty(tag))
   const tr=ex.support.transcription
   if(Array.isArray(tr))addTranscript(record,tr[index],source)
   else if(refs.length===1)addTranscript(record,tr,source)
   else if(typeof tr==='string'&&tr.trim())detail.notes.push('Une transcription commune à plusieurs pistes existe dans la banque ; son découpage n’est pas renseigné.')
   const all=ex.questions??[]
   const linked=refs.length===1?all:all.filter((q,i)=>q.audio!==undefined?q.audio===index+1:all.length===refs.length&&i===index)
   if(refs.length>1&&all.some(q=>q.audio===undefined)&&all.length!==refs.length)detail.notes.push('Des questions communes à plusieurs pistes ne sont pas attribuées à un dialogue précis dans la banque.')
   const block={id:source,title:ex.scene||ex.theme||ex.id,level:ex.niveau,instruction:ex.consigne,images:unique([...(refs.length===1&&ex.support.image?[ex.support.image]:[]),...(ex.support.images?.[index]?[ex.support.images[index]]:[])]).map(image),questions:linked.map((q,i)=>question(q,`${ex.id}:question-${all.indexOf(q)+1||i+1}`))}
   if(ex.type_exercice==='images_a_reconnaitre'&&ex.images?.length)block.questions.push({id:ex.id+':objets',prompt:ex.consigne||'Quels objets sont entendus ? Cochez oui ou non.',images:[],formats:[{kind:'yes-no',label:'Images — Oui / Non',choices:ex.images.map((c,i)=>({letter:String.fromCharCode(65+i),image:image(c.image),correct:c.correct}))}]})
   if(ex.type_exercice==='association_images'&&ex.situations?.length)block.questions.push({id:ex.id+':situations-'+index,prompt:refs.length>1?'Quelle image correspond à ce dialogue ?':'Associez chaque image au numéro du dialogue entendu.',images:[],formats:[{kind:refs.length>1?'image':'association',label:'Situations en images',choices:ex.situations.map((s,i)=>({letter:/^[a-z]$/i.test(s.id)?s.id.toUpperCase():String.fromCharCode(65+i),image:image(s.image),...(refs.length>1?{correct:s.dialogue===index+1}:{answer:s.dialogue==null?'Aucun dialogue':String(s.dialogue)})}))}]})
   if(ex.support.exemples_questions?.length)block.questions.push(...ex.support.exemples_questions.map((text,i)=>({id:ex.id+':oral-'+i,prompt:text,images:[],formats:[{kind:'lines',label:'Question orale',lines:2}]})))
   if(block.questions.length||block.images.length)detail.blocks.push(block)
  })
 }
 for(const file of walk(root,'src/tcf/content').filter(file=>/\/(a0-a1|a1-a2|a2-b1)\/(ce|co|pe|po)\.json$/.test(file)))for(const ex of read(root,file))addExercise(ex,file)
 for(const row of read(root,'src/grammaire/exercises/co-bank.json'))addExercise(row.exercise,'src/grammaire/exercises/co-bank.json')
 // The canonical image bank supplies the exact word spelling (including accents).
 const vocab=path.join(root,'src/jeux/vocab-images.ts')
 if(existsSync(vocab)){
  const text=readFileSync(vocab,'utf8').split('export const VOCAB_IMAGE_THEMES')[1]
  const themes=text?JSON.parse(text.slice(text.indexOf('['),text.lastIndexOf(']')+1).replace(/^\[\]\s*=\s*/,'')):[]
  const stems=read(root,'src/francais/soutien/audio-stem-index.json',{})
  for(const theme of themes)for(const word of theme.words){
   const candidate=word.src.replace('/images/','/audio/').replace(/\.[^.]+$/,'.mp3')
   for(const src of unique([candidate,stems[slug(word.label)]])){
    const record=records.get(src);if(!record)continue
    record.entry.label=word.label;record.entry.themes.add(theme.label);addTranscript(record,word.label,'Banque de vocabulaire')
    if(!record.detail.images.some(i=>i.src===word.src))record.detail.images.push(image(word.src))
   }
  }
 }
 for(const file of walk(root,'src/francais/soutien/phrases').filter(file=>file.endsWith('.json'))){
  const bank=read(root,file,{})
  for(const word of bank.phrases??[])for(const variant of word.variants??[])for(const sentence of variant.sentences??[]){
   const record=records.get(`/lib/audio/soutien/phrases/${slug(sentence)}.mp3`);if(!record)continue
   record.entry.label=sentence;record.entry.themes.add(`Son ${bank.son}`);record.entry.levels.add(variant.level.toUpperCase());addTranscript(record,sentence,file)
  }
 }
 // The word-audio generator uses these exact label/image pairs and lecture
 // labels. Resolve only files that exist, keeping the original spelling.
 for(const file of walk(root,'src/francais/vocab-banks').filter(file=>file.endsWith('.ts'))){
  const text=readFileSync(path.join(root,file),'utf8')
  for(const match of text.matchAll(/"label"\s*:\s*"([^"\n]+)"[\s\S]*?"imageSrc"\s*:\s*"(\/lib\/images\/vocabulaire\/[^"\n]+)"/g)){
   const label=match[1],img=match[2],record=records.get(img.replace('/images/','/audio/').replace(/\.[^.]+$/,'.mp3'))
   if(record){record.entry.label=label;addTranscript(record,label,file);if(!record.detail.images.some(i=>i.src===img))record.detail.images.push(image(img))}
  }
 }
 for(const file of ['src/francais/soutien/lecture-word-items.ts','src/francais/soutien/lecture-word-items-extra.ts','src/francais/soutien/grapheme-word-pools.ts']){
  if(!existsSync(path.join(root,file)))continue
  const text=readFileSync(path.join(root,file),'utf8')
  for(const match of text.matchAll(/"([a-zàâäéèêëïîôöùûüçœæA-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜÇŒÆ][a-zàâäéèêëïîôöùûüçœæ-]{1,})"/g)){
   const label=match[1],record=records.get(`/lib/audio/vocabulaire/lecture/${norm(label).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}.mp3`)
   if(record){record.entry.label=label;addTranscript(record,label,file)}
  }
 }
 for(const [src,values] of Object.entries(read(root,'src/audio-catalog/spoken-texts.generated.json',{}))){
  const record=records.get(src);if(record){for(const text of values)addTranscript(record,text,'Texte de synthèse enregistré — banque Soutien');record.entry.label=values[0]??record.entry.label}
 }
 for(const [src,prompt] of Object.entries(read(root,'src/audio-catalog/prompts.json',{}))){const record=records.get(src);if(record){addTranscript(record,prompt,'Texte de consigne enregistré');record.entry.label=prompt.length>90?prompt.slice(0,87)+'…':prompt}}
 const details={},entries=[]
 for(const [src,{entry,detail}] of records){
  detail.notes=unique(detail.notes)
  if(aliases[src]){entry.types.add('Ancienne piste');detail.notes.push('La banque utilise désormais la piste corrigée : '+aliases[src])}
  if(!entry.themes.size)entry.themes.add(pretty(src.split('/').at(-2)??'Autres audios'))
  const questions=detail.blocks.flatMap(b=>b.questions),key=src.split('/')[3]
  ;(details[key]??={})[src]=detail
  entries.push({...entry,themes:[...entry.themes].sort(),types:[...entry.types].sort(),levels:[...entry.levels].sort(),transcriptCount:detail.transcripts.length,questionCount:questions.length,variantCount:questions.reduce((n,q)=>n+q.formats.length,0),keywords:unique(norm([entry.label,src,...detail.transcripts.map(t=>t.text),...questions.map(q=>q.prompt)].join(' ')).split(/\s+/)).join(' ')})
 }
 entries.sort((a,b)=>Number(b.questionCount>0)-Number(a.questionCount>0)||a.label.localeCompare(b.label,'fr',{numeric:true})||a.id.localeCompare(b.id))
 return {entries,details}
}
export function generateAudioCatalog(root) {
 const {entries,details}=buildAudioCatalog(root),out=path.join(root,'public/audio-catalog'),files={}
 mkdirSync(out,{recursive:true});mkdirSync(path.join(root,'src/audio-catalog'),{recursive:true})
 const write=(file,value)=>{if(!existsSync(file)||readFileSync(file,'utf8')!==value)writeFileSync(file,value)}
 for(const [key,value] of Object.entries(details)){
  const text=JSON.stringify(value)+'\n',file=`audio-catalog/${key}.json`,version=createHash('sha256').update(text).digest('hex').slice(0,16)
  write(path.join(root,'public',file),text);files[key]={file,version}
 }
 write(path.join(root,'src/audio-catalog/catalog.generated.json'),JSON.stringify({schemaVersion:1,entries,details:files})+'\n')
 return {audios:entries.length,withTranscript:entries.filter(a=>a.transcriptCount).length,withQuestions:entries.filter(a=>a.questionCount).length,questions:entries.reduce((n,a)=>n+a.questionCount,0),variants:entries.reduce((n,a)=>n+a.variantCount,0)}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(generateAudioCatalog(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')),null,2))
