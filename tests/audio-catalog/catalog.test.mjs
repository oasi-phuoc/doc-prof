import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {createServer} from 'vite'
import {buildAudioCatalog} from '../../scripts/audio-catalog.mjs'

const root=process.cwd(),read=async file=>JSON.parse(await readFile(file,'utf8'))
const index=await read('src/audio-catalog/catalog.generated.json')
const allDetails=Object.assign({},...await Promise.all(Object.values(index.details).map(ref=>read('public/'+ref.file))))
await test('the committed catalogue reproduces all available audio files and every detail count without changing the banks',()=>{
 const fresh=buildAudioCatalog(root)
 assert.deepEqual(fresh.entries,index.entries);assert.ok(index.entries.length>8000);assert.equal(new Set(index.entries.map(a=>a.id)).size,index.entries.length)
 for(const audio of index.entries){const detail=allDetails[audio.id];assert.ok(detail);assert.equal(audio.transcriptCount,detail.transcripts.length);assert.equal(audio.questionCount,detail.blocks.flatMap(b=>b.questions).length);assert.equal(audio.variantCount,detail.blocks.flatMap(b=>b.questions).reduce((n,q)=>n+q.formats.length,0))}
})
await test('every prepared TCF question, all its response forms and the exact per-track transcript are retained',async()=>{
 const aliases=await read('src/tcf/content/audio-replacements.json')
 let questions=0,illustrated=0
 for(const level of ['a0-a1','a1-a2','a2-b1'])for(const ex of await read(`src/tcf/content/${level}/co.json`)){
  const refs=ex.support.audios?.length?ex.support.audios:[ex.support.audio]
  for(const [i,ref] of refs.entries()){
   const detail=allDetails[aliases[ref]??ref];assert.ok(detail,ref)
   const text=Array.isArray(ex.support.transcription)?ex.support.transcription[i]:refs.length===1?ex.support.transcription:undefined
   if(text?.trim())assert.ok(detail.transcripts.some(t=>t.text===text.trim()),ex.id)
  }
  for(const [i,q] of ex.questions.entries()){
   const track=q.audio??(refs.length===1?1:ex.questions.length===refs.length?i+1:undefined)
   assert.ok(track,'Every current source question has an exact track assignment')
   const detail=allDetails[aliases[refs[track-1]]??refs[track-1]],id=`${ex.id}:question-${i+1}`
   const result=detail.blocks.flatMap(b=>b.questions).find(q=>q.id===id);assert.ok(result,id)
   assert.equal(result.prompt,q.enonce);assert.ok(result.formats.some(f=>f.kind==='text'));assert.ok(result.formats.some(f=>f.kind==='lines'))
   if(q.formes?.qcm_image){assert.deepEqual(result.formats.find(f=>f.kind==='image').choices.map(c=>c.image.src),q.formes.qcm_image.choix.map(c=>c.image));illustrated++}
   questions++
  }
 }
 assert.ok(questions>4900);assert.ok(illustrated>1300)
})
await test('multi-track audio and replacement aliases cannot receive another dialogue’s text or questions',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'audio-index-'))
 const put=async(name,value)=>{await mkdir(path.dirname(path.join(temp,name)),{recursive:true});await writeFile(path.join(temp,name),typeof value==='string'?value:JSON.stringify(value))}
 try{
  for(const id of ['one','two','old'])await put(`public/lib/audio/tcf/${id}.mp3`,'ID3'+'.'.repeat(512))
  await put('src/tcf/content/audio-replacements.json',{'/lib/audio/tcf/old.mp3':'/lib/audio/tcf/two.mp3'})
  await put('src/tcf/content/a0-a1/co.json',[{id:'paired',niveau:'A0-A1',competence:'CO',type_exercice:'complet',support:{audios:['/lib/audio/tcf/one.mp3','/lib/audio/tcf/old.mp3'],transcription:['Premier texte exact.','Deuxième texte exact.']},questions:[{audio:1,enonce:'Question du premier.',type_reponse:'lignes',reponse_modele:'Un'},{audio:2,enonce:'Question du deuxième.',type_reponse:'lignes',reponse_modele:'Deux'}]}])
  const {details}=buildAudioCatalog(temp),one=details.tcf['/lib/audio/tcf/one.mp3'],two=details.tcf['/lib/audio/tcf/two.mp3'],old=details.tcf['/lib/audio/tcf/old.mp3']
  assert.deepEqual(one.transcripts.map(t=>t.text),['Premier texte exact.']);assert.deepEqual(two.transcripts.map(t=>t.text),['Deuxième texte exact.']);assert.equal(one.blocks[0].questions[0].prompt,'Question du premier.');assert.equal(two.blocks[0].questions[0].prompt,'Question du deuxième.');assert.deepEqual(old.transcripts,[]);assert.ok(old.notes.length)
 }finally{await rm(temp,{recursive:true,force:true})}
})
const server=await createServer({cacheDir:'/tmp/clairfle-audio-unit-vite',server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {filterAudios}=await server.ssrLoadModule('/src/audio-catalog/catalog.ts')
 const {audioWordDocument}=await server.ssrLoadModule('/src/audio-catalog/docx.ts')
 await test('accent-insensitive searches combine with every filter, including exact levels and prepared content',()=>{
  const found=filterAudios(index.entries,'aeroport','','','TCF','','questions');assert.ok(found.length)
  assert.deepEqual(filterAudios(index.entries,'AÉROPORT','','','TCF','','questions'),found)
  const audio=found.find(a=>a.levels.length);assert.ok(filterAudios(found,'',audio.themes[0],audio.types[0],audio.collection,audio.levels[0],'transcript').some(a=>a.id===audio.id))
  assert.deepEqual(filterAudios(index.entries,'introuvable-xx98324','','','','',''),[])
 })
 await test('Word contains real tables, letters, unchecked boxes, every response form, answer keys and embedded images',async()=>{
  const audio=index.entries[0],picture={src:'/image.webp',available:true},controller=new AbortController(),temp=await mkdtemp(path.join(tmpdir(),'audio-word-'))
  const detail={transcripts:[{text:'Bonjour <ami> & « amie ».\nDeuxième ligne.',sources:['banque']}],images:[],notes:[],blocks:[{id:'exact-bank',title:'Une banque',images:[],questions:[{id:'q1',prompt:'Question complète ?',images:[],formats:[{kind:'text',label:'Choix en texte',choices:[{letter:'A',text:'Une réponse',correct:true},{letter:'B',text:'Une autre',correct:false}]},{kind:'image',label:'Choix en images',choices:[{letter:'A',image:picture,correct:false},{letter:'B',image:picture,correct:true},{letter:'C',image:{src:'/missing.webp',available:false},correct:false}]},{kind:'lines',label:'Réponse écrite',model:'La réponse modèle exacte.',lines:2}]}]}]}
  let loaded=0
  try{
   const blob=await audioWordDocument(audio,detail,controller.signal,async()=>{loaded++;return {data:new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=','base64')),width:1,height:1,type:'png'}})
   assert.equal(loaded,1,'Repeated images are embedded once')
   const file=path.join(temp,'document.docx');await writeFile(file,new Uint8Array(await blob.arrayBuffer()))
   const report=JSON.parse(execFileSync('python3',['-c',`import zipfile,xml.etree.ElementTree as E,json,sys
z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None
for name in z.namelist():
 if name.endswith('.xml') or name.endswith('.rels'): E.fromstring(z.read(name))
d=E.fromstring(z.read('word/document.xml'));ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
text=' '.join(t.text or '' for t in d.findall('.//w:t',ns))
assert 'Bonjour <ami> & « amie ».' in text
assert 'Choix en texte' in text and 'Choix en images' in text and 'Réponse écrite' in text
assert 'La réponse modèle exacte.' in text and '☐ A' in text and '☐ B' in text and '☐ C' in text
assert 'Image à compléter' in text
assert len(d.findall('.//w:tbl',ns))==2
assert not any(n.endswith('.webp') for n in z.namelist())
print(json.dumps({'tables':2,'images':len([n for n in z.namelist() if n.startswith('word/media/')])}))`,file],{encoding:'utf8'}))
   assert.equal(report.images,1)
  }finally{await rm(temp,{recursive:true,force:true})}
 })
 await test('Word never silently drops an available image after a fetch failure and respects cancellation',async()=>{
  const audio=index.entries[0],detail={transcripts:[],blocks:[],notes:[],images:[{src:'/image.webp',available:true}]}
  await assert.rejects(()=>audioWordDocument(audio,detail,new AbortController().signal,async()=>{throw new Error('Image indisponible')}),/Image indisponible/)
  const aborted=new AbortController();aborted.abort();await assert.rejects(()=>audioWordDocument(audio,detail,aborted.signal),{name:'AbortError'})
 })
}finally{await server.close()}
