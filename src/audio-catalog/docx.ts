import { zipStoreBlob, type ZipStoreEntry } from '@/lib/zip-store'
import { publicUrl } from './catalog'
import type { AudioDetail, AudioFormat, AudioImage, CatalogAudio } from './types'

const xml=(text:unknown)=>Array.from(String(text??'')).filter(char=>{const code=char.codePointAt(0)!;return [9,10,13].includes(code)||code>=32&&code!==65534&&code!==65535}).join('').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
const paragraph=(text:string,bold=false)=>`<w:p><w:r>${bold?'<w:rPr><w:b/></w:rPr>':''}${text.split('\n').map((line,i)=>`${i?'<w:br/>':''}<w:t xml:space="preserve">${xml(line)}</w:t>`).join('')}</w:r></w:p>`
const table=(cells:string[][])=>`<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>${['top','left','bottom','right','insideH','insideV'].map(side=>`<w:${side} w:val="single" w:sz="6" w:color="888888"/>`).join('')}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="100" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${Array.from({length:cells[0]?.length??1},()=>`<w:gridCol w:w="${Math.floor(9300/(cells[0]?.length??1))}"/>`).join('')}</w:tblGrid>${cells.map(row=>`<w:tr><w:trPr><w:cantSplit/></w:trPr>${row.map(cell=>`<w:tc><w:tcPr><w:tcW w:w="${Math.floor(9300/row.length)}" w:type="dxa"/></w:tcPr>${cell||paragraph(' ')}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`
type Picture={data:Uint8Array<ArrayBuffer>;width:number;height:number;type:'png'|'jpeg'}
export async function fetchWordPicture(src:string,signal:AbortSignal):Promise<Picture>{
 const response=await fetch(publicUrl(src),{signal})
 if(!response.ok)throw new Error('Une image du document Word ne peut pas être téléchargée. Réessayez.')
 const blob=await response.blob()
 if(!blob.size||blob.type.includes('text/html'))throw new Error('Une image du document Word est indisponible.')
 const bitmap=await createImageBitmap(blob)
 try{
  signal.throwIfAborted()
  const ratio=Math.min(1,960/Math.max(bitmap.width,bitmap.height)),width=Math.max(1,Math.round(bitmap.width*ratio)),height=Math.max(1,Math.round(bitmap.height*ratio))
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height
  const context=canvas.getContext('2d');if(!context)throw new Error('Impossible de préparer les images Word sur cet appareil.')
  context.drawImage(bitmap,0,0,width,height)
  const png=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Conversion d’image Word impossible.')),'image/png'))
  signal.throwIfAborted();return {data:new Uint8Array(await png.arrayBuffer()),width,height,type:'png'}
 }finally{bitmap.close()}
}

/** A real OOXML document. Pictures are embedded as PNG/JPEG, never external
 * links or unsupported WebP files; every stored response form is retained. */
export async function audioWordDocument(audio:CatalogAudio,detail:AudioDetail,signal:AbortSignal,loadPicture=fetchWordPicture):Promise<Blob>{
 const files:ZipStoreEntry[]=[],relationships:string[]=[],pictures=new Map<string,{id:string;name:string;picture:Picture}>(),answers:string[]=[]
 let drawingId=0,totalBytes=0
 const image=async(ref:AudioImage,maxWidth=5000000,maxHeight=2600000)=>{
  signal.throwIfAborted()
  if(!ref.available)return paragraph('Image à compléter dans la banque.')
  let saved=pictures.get(ref.src)
  if(!saved){
   const picture=await loadPicture(ref.src,signal),n=pictures.size+1,name=`image-${n}.${picture.type}`,id=`rIdImage${n}`
   totalBytes+=picture.data.byteLength
   if(totalBytes>256*1024*1024)throw new Error('Ce document contient trop d’images pour cet appareil.')
   saved={id,name,picture};pictures.set(ref.src,saved);files.push({name:`word/media/${name}`,data:picture.data})
   relationships.push(`<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/>`)
  }
  const scale=Math.min(maxWidth/saved.picture.width,maxHeight/saved.picture.height),cx=Math.round(saved.picture.width*scale),cy=Math.round(saved.picture.height*scale),id=++drawingId
  return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Illustration ${id}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="${saved.name}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${saved.id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`
 }
 const renderFormat=async(format:AudioFormat,reference:string)=>{
  let output=paragraph(format.label,true)
  if(format.choices?.length){
   if(format.kind==='text')output+=table(format.choices.map(choice=>[paragraph(`☐ ${choice.letter}. ${choice.text??''}`)]))
   else{
    const cells=[]
    for(const choice of format.choices){
     let content=paragraph(`${choice.letter}.`,true)
     if(choice.image)content+=await image(choice.image,1720000,1500000)
     if(choice.text)content+=paragraph(choice.text)
     content+=paragraph(format.kind==='yes-no'?'☐ Oui     ☐ Non':format.kind==='association'?'Dialogue : ______':`☐ ${choice.letter}`)
     cells.push(content)
    }
    const rows:string[][]=[];for(let i=0;i<cells.length;i+=3){const row=cells.slice(i,i+3);while(row.length<3)row.push(paragraph(' '));rows.push(row)}
    output+=table(rows)
   }
   const correction=format.kind==='yes-no'?format.choices.map(c=>`${c.letter} : ${c.correct?'Oui':'Non'}`).join(' ; '):format.kind==='association'?format.choices.map(c=>`${c.letter} : ${c.answer??'Non renseigné'}`).join(' ; '):format.choices.filter(c=>c.correct).map(c=>`${c.letter}${c.text?'. '+c.text:''}`).join(' ; ')||'Corrigé non renseigné dans la banque.'
   answers.push(`${reference} — ${format.label} : ${correction}`)
  }else{
   if(format.rows?.length){output+=table(format.rows.map(row=>[paragraph(row.label),paragraph('________________________')]));answers.push(`${reference} : ${format.rows.map(row=>row.label+' : '+row.answer).join(' ; ')}`)}
   else for(let i=0;i<Math.max(0,Math.min(format.lines??2,100));i++)output+=paragraph('________________________________________________________________')
   if(format.model)answers.push(`${reference} : ${format.model}`)
  }
  return output
 }
 let body=paragraph(audio.label,true)+paragraph(`Audio : ${audio.id.split('/').at(-1)}\n${[audio.collection,...audio.levels,...audio.themes].join(' · ')}`)+paragraph('Transcription',true)
 body+=detail.transcripts.length?detail.transcripts.map((transcript,i)=>paragraph(detail.transcripts.length>1?`Version de banque ${i+1}`:'',true)+paragraph(transcript.text)).join(''):paragraph('Aucune transcription n’est renseignée dans les banques pour ce fichier.')
 for(const ref of detail.images)body+=await image(ref)
 for(const note of detail.notes)body+=paragraph(note)
 body+=paragraph('Questions et formes de réponse disponibles',true)
 if(!detail.blocks.some(block=>block.questions.length))body+=paragraph('Aucune question préparée n’est rattachée à cet audio dans les banques.')
 for(const block of detail.blocks){
  body+=paragraph(`${block.title}${block.level?' · '+block.level:''}`,true)+paragraph(`Référence : ${block.id.split(' · ').at(-1)}`)
  if(block.instruction)body+=paragraph(block.instruction)
  for(const ref of block.images)body+=await image(ref)
  for(const [i,question] of block.questions.entries()){
   body+=paragraph(`${i+1}. ${question.prompt}`,true)
   for(const ref of question.images)body+=await image(ref)
   for(const format of question.formats)body+=await renderFormat(format,`${block.title} · question ${i+1}`)
  }
 }
 if(answers.length)body+=paragraph('Corrigés et réponses modèles',true)+answers.map(answer=>paragraph(answer)).join('')
 const encode=(text:string)=>new TextEncoder().encode(text)
 files.push({name:'[Content_Types].xml',data:encode(`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`)})
 files.push({name:'_rels/.rels',data:encode('<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdDocument" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')})
 files.push({name:'word/_rels/document.xml.rels',data:encode(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships.join('')}</Relationships>`)})
 files.push({name:'word/document.xml',data:encode(`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="900" w:right="900" w:bottom="900" w:left="900"/></w:sectPr></w:body></w:document>`)})
 signal.throwIfAborted()
 return new Blob([await zipStoreBlob(files)],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
}
