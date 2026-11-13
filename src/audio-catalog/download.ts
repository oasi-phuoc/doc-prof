import { crc32 } from '@/lib/zip-store'
import { saveBlob } from '@/gallery/download'
import { loadAudioDetail, publicUrl } from './catalog'
import { audioWordDocument } from './docx'
import type { CatalogAudio } from './types'

const filename=(audio:CatalogAudio)=>audio.id.split('/').at(-1)!
export const audioWordFilename=(audio:CatalogAudio)=>filename(audio).replace(/\.[^.]+$/,'.docx')
async function audioBlob(audio:CatalogAudio,signal:AbortSignal){
 const response=await fetch(publicUrl(audio.src),{signal}),blob=await response.blob()
 if(!response.ok||!blob.size||blob.type.includes('text/html'))throw new Error(`L’audio « ${audio.label} » est indisponible. Réessayez.`)
 return blob
}
export async function downloadAudio(audio:CatalogAudio,signal:AbortSignal){saveBlob(await audioBlob(audio,signal),filename(audio))}
export async function downloadAudioWord(audio:CatalogAudio,signal:AbortSignal){saveBlob(await audioWordDocument(audio,await loadAudioDetail(audio,signal),signal),audioWordFilename(audio))}
type Sink={write:(data:Blob|Uint8Array<ArrayBuffer>)=>Promise<void>;close:()=>Promise<void>;abort:()=>Promise<void>}
type Picker=(options:{suggestedName:string;types:{description:string;accept:Record<string,string[]>}[]})=>Promise<{createWritable:()=>Promise<Sink>}>
const word=(n:number,size:2|4)=>{const bytes=new Uint8Array(new ArrayBuffer(size)),view=new DataView(bytes.buffer);if(size===2)view.setUint16(0,n,true);else view.setUint32(0,n,true);return bytes}
const join=(parts:Uint8Array<ArrayBuffer>[])=>{const data=new Uint8Array(new ArrayBuffer(parts.reduce((n,p)=>n+p.length,0)));let at=0;for(const part of parts){data.set(part,at);at+=part.length}return data}
/** Each recording and its Word are prepared sequentially. A disk writer avoids
 * retaining a large selection in RAM; Blob fallback has an explicit bound. */
export async function downloadAudioZip(audios:CatalogAudio[],includeWord:boolean,signal:AbortSignal,onProgress:(done:number)=>void){
 const picker=(window as Window&{showSaveFilePicker?:Picker}).showSaveFilePicker
 const name=includeWord?'clairfle-audios-et-questions.zip':'clairfle-audios.zip'
 let sink:Sink|undefined,offset=0,count=0
 const chunks:BlobPart[]=[],centrals:Uint8Array<ArrayBuffer>[]=[]
 const write=async(part:Blob|Uint8Array<ArrayBuffer>)=>{signal.throwIfAborted();if(sink)await sink.write(part);else chunks.push(part)}
 const add=async(name:string,blob:Blob)=>{
  signal.throwIfAborted()
  const data=new Uint8Array(await blob.arrayBuffer()),crc=crc32(data),file=new TextEncoder().encode(name)
  const header=join([word(0x04034b50,4),word(20,2),word(0x800,2),word(0,2),word(0,2),word(33,2),word(crc,4),word(data.length,4),word(data.length,4),word(file.length,2),word(0,2),file])
  if(offset+header.length+data.length>=0xffffffff||!sink&&offset+header.length+data.length>512*1024*1024)throw new Error('Cette sélection est trop volumineuse pour un seul téléchargement sur cet appareil. Téléchargez-la par thème ou par groupes plus petits.')
  await write(header);await write(blob)
  centrals.push(join([word(0x02014b50,4),word(20,2),word(20,2),word(0x800,2),word(0,2),word(0,2),word(33,2),word(crc,4),word(data.length,4),word(data.length,4),word(file.length,2),word(0,2),word(0,2),word(0,2),word(0,2),word(0,4),word(offset,4),file]))
  offset+=header.length+data.length;count++
 }
 try{
  if(audios.length*(includeWord?2:1)>65535)throw new Error('Choisissez une sélection plus petite.')
  if(picker){
   try{const handle=await picker.call(window,{suggestedName:name,types:[{description:'Archive ZIP',accept:{'application/zip':['.zip']}}]});signal.throwIfAborted();sink=await handle.createWritable()}
   catch(error){if(!(error instanceof DOMException)||!['SecurityError','NotSupportedError'].includes(error.name))throw error}
  }
  for(const [i,audio] of audios.entries()){
   const base=audio.id.replace(/^\//,'').replace(/\.[^.]+$/,'')
   await add(audio.id.replace(/^\//,''),await audioBlob(audio,signal))
   if(includeWord)await add(base+'.docx',await audioWordDocument(audio,await loadAudioDetail(audio,signal),signal))
   onProgress(i+1)
  }
  const centralSize=centrals.reduce((n,c)=>n+c.length,0)
  for(const central of centrals)await write(central)
  await write(join([word(0x06054b50,4),word(0,2),word(0,2),word(count,2),word(count,2),word(centralSize,4),word(offset,4),word(0,2)]))
  signal.throwIfAborted();if(sink)await sink.close();else saveBlob(new Blob(chunks,{type:'application/zip'}),name)
 }catch(error){await sink?.abort().catch(()=>undefined);throw error}
}
