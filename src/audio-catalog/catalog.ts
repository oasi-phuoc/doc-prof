import generated from './catalog.generated.json'
import type { AudioDetail, AudioIndex, CatalogAudio } from './types'
export const audioIndex=generated as AudioIndex
export const catalogAudios=audioIndex.entries
export const normalizeSearch=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim()
export const publicUrl=(src:string)=>`${import.meta.env.BASE_URL}${src.replace(/^\//,'')}`
export function filterAudios(audios:CatalogAudio[],query:string,theme:string,type:string,collection:string,level:string,content:string){
 const terms=normalizeSearch(query).split(/\s+/).filter(Boolean)
 return audios.filter(audio=>(!theme||audio.themes.includes(theme))&&(!type||audio.types.includes(type))&&(!collection||audio.collection===collection)&&(!level||audio.levels.includes(level))&&(!content||content==='questions'&&audio.questionCount>0||content==='transcript'&&audio.transcriptCount>0||content==='unlinked'&&!audio.questionCount)&&terms.every(term=>normalizeSearch([audio.label,audio.id,audio.keywords,...audio.themes,...audio.types,...audio.levels].join(' ')).includes(term)))
}
export const formatAudioBytes=(bytes:number)=>bytes>=1024*1024?`${(bytes/1024/1024).toLocaleString('fr',{maximumFractionDigits:1})} Mo`:`${Math.max(1,Math.round(bytes/1024))} Ko`
const detailCache=new Map<string,Record<string,AudioDetail>>()
export async function loadAudioDetail(audio:CatalogAudio,signal:AbortSignal):Promise<AudioDetail>{
 const key=audio.id.split('/')[3]!,ref=audioIndex.details[key]
 if(!ref)throw new Error('La fiche de cet audio est indisponible.')
 let data=detailCache.get(ref.version)
 if(!data){
  const response=await fetch(publicUrl(ref.file)+'?v='+ref.version,{signal})
  if(!response.ok||response.headers.get('content-type')?.includes('text/html'))throw new Error('Impossible de charger les transcriptions et questions. Réessayez.')
  data=await response.json() as Record<string,AudioDetail>;signal.throwIfAborted();detailCache.set(ref.version,data)
 }
 const detail=data[audio.id]
 if(!detail||!Array.isArray(detail.transcripts)||!Array.isArray(detail.blocks))throw new Error('Les données de cet audio sont incomplètes. Rechargez le catalogue.')
 return detail
}
