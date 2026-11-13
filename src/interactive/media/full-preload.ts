import { validGrammarImage } from '@/grammaire/curriculum/image-support'
import { MASCOT_IMAGES } from '../domain/mascot'
import { collectMedia } from './assets'
import { aborted, decodeAudio, decodeImage } from './decode'
import { acceptableMime, mediaUrl } from './policy'
import type { MediaAsset, MediaPolicy, MediaProbeDependencies, PublicMediaPlan } from './types'
import type { MediaResolver } from './prepared-context'

export class PreloadError extends Error {}
export const MAX_PRELOAD_BYTES = 128 * 1024 * 1024
export const MAX_PRELOAD_FILE_BYTES = 32 * 1024 * 1024
export const mascotMedia = MASCOT_IMAGES
export type PreloadProgress = { completed: number; total: number; bytes: number }
export type PreparedMedia = PreloadProgress & { resolve: MediaResolver; dispose: () => void }
type Dependencies = Pick<MediaProbeDependencies, 'fetch' | 'decodeImage' | 'decodeAudio'> & { createUrl: (blob: Blob) => string; revokeUrl: (url: string) => void }
type Options = MediaPolicy & { timeoutMs?: number; maxBytes?: number; maxFileBytes?: number }

export function sessionAssets(plan: PublicMediaPlan, policy: MediaPolicy): MediaAsset[] {
  const assets = collectMedia(plan.questions, policy)
  for (const src of mascotMedia) {
    const url = mediaUrl(src, policy)!
    if (!assets.some(asset => asset.url === url)) assets.push({id:url,url,kind:'image',questionIds:[]})
  }
  return assets
}
/** Only public resources determine readiness, irrespective of answer keys or order. */
export function preloadIdentity(plan: PublicMediaPlan, policy: MediaPolicy): string {
  return JSON.stringify([
    sessionAssets(plan,policy).map(({url,kind,conflictingKinds}) => [url,kind,!!conflictingKinds]).sort((a,b) => String(a[0]).localeCompare(String(b[0]))),
    [...new Set(plan.questions.flatMap(q => q.grammarImages?.map(image => JSON.stringify(image)) ?? []))].sort(),
  ])
}
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) { void promise.catch(() => {}); return Promise.reject(aborted()) }
  return new Promise((resolve,reject) => {
    const stop=()=>reject(aborted()); signal.addEventListener('abort',stop,{once:true})
    promise.then(resolve,reject).finally(()=>signal.removeEventListener('abort',stop))
  })
}
async function readBlob(response: Response, maximum: number, signal: AbortSignal, received: (size: number) => void): Promise<Blob> {
  if (Number(response.headers.get('content-length')) > maximum) throw new PreloadError('Un fichier dépasse la taille disponible. Réduisez la sélection.')
  const reader=response.body?.getReader(), chunks: Uint8Array<ArrayBuffer>[]=[]
  let size=0
  if (!reader) {
    const data=await abortable(response.arrayBuffer(),signal)
    if (data.byteLength>maximum) throw new PreloadError('Un fichier dépasse la taille disponible. Réduisez la sélection.')
    size=data.byteLength;received(size);chunks.push(new Uint8Array(data))
  } else {
    try {
      while (true) {
        const chunk=await abortable(reader.read(),signal)
        if (chunk.done) break
        size+=chunk.value.byteLength
        if (size>maximum) throw new PreloadError('Un fichier dépasse la taille disponible. Réduisez la sélection.')
        received(chunk.value.byteLength);chunks.push(chunk.value as Uint8Array<ArrayBuffer>)
      }
    } catch(error) { void reader.cancel().catch(()=>{});throw error }
    finally { reader.releaseLock() }
  }
  if (!size) throw new PreloadError('Un média est vide. Réessayez son chargement.')
  return new Blob(chunks,{type:response.headers.get('content-type')?.split(';')[0]||'application/octet-stream'})
}

/** Publish an all-or-nothing, memory-only pack. No plan or correction is rewritten. */
export async function preloadSession(plan: PublicMediaPlan, options: Options, signal: AbortSignal, onProgress?: (progress: PreloadProgress) => void, dependencies?: Dependencies): Promise<PreparedMedia> {
  const assets=sessionAssets(plan,options), grammar=plan.questions.flatMap(q=>q.grammarImages??[])
  if (assets.length>1024 || assets.some(asset=>asset.conflictingKinds||!mediaUrl(asset.url,options)) || grammar.some(image=>!validGrammarImage(image))) throw new PreloadError('Certains médias ne peuvent pas être préparés. Vérifiez la sélection et les références des images.')
  if (signal.aborted) throw aborted()
  const deps=dependencies??{fetch:globalThis.fetch.bind(globalThis),decodeImage,decodeAudio,createUrl:URL.createObjectURL.bind(URL),revokeUrl:URL.revokeObjectURL.bind(URL)}
  const controller=new AbortController(), stop=()=>controller.abort(), urls=new Map<string,string>()
  const dispose=()=>{for(const url of urls.values())deps.revokeUrl(url);urls.clear()}
  signal.addEventListener('abort',stop,{once:true})
  let next=0,completed=0,totalBytes=0
  const report=()=>onProgress?.({completed,total:assets.length,bytes:totalBytes})
  const received=(size:number)=>{totalBytes+=size;if(totalBytes>(options.maxBytes??MAX_PRELOAD_BYTES))throw new PreloadError('La sélection dépasse 128 Mo. Réduisez le nombre de questions ou de médias.');report()}
  const worker=async()=>{
    while(next<assets.length){
      if(controller.signal.aborted)throw aborted()
      const asset=assets[next++]!, download=new AbortController(), cancel=()=>download.abort()
      controller.signal.addEventListener('abort',cancel,{once:true})
      const timeout=setTimeout(cancel,options.timeoutMs??8000)
      try{
        const response=await abortable(deps.fetch(asset.url,{signal:download.signal,credentials:'same-origin',redirect:'error',cache:'force-cache'}),download.signal)
        if(!response.ok||!acceptableMime(asset.kind,response.headers.get('content-type')))throw new PreloadError('Un média est absent ou illisible. Réessayez le chargement avec une connexion.')
        const blob=await readBlob(response,options.maxFileBytes??MAX_PRELOAD_FILE_BYTES,download.signal,received)
        for(const image of grammar.filter(image=>mediaUrl(image.src,options)===asset.url)){
          if(blob.size>8*1024*1024||!globalThis.crypto?.subtle)throw new PreloadError('La vérification d’une image est indisponible.')
          const digest=await abortable(crypto.subtle.digest('SHA-256',await blob.arrayBuffer()),download.signal)
          if(Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('')!==image.sha256)throw new PreloadError('Une image ne correspond plus à la fiche sauvegardée.')
        }
        if(download.signal.aborted)throw aborted()
        const url=deps.createUrl(blob);urls.set(asset.url,url)
        await abortable(asset.kind==='image'?deps.decodeImage(url,download.signal):deps.decodeAudio(url,download.signal),download.signal)
        if(download.signal.aborted)throw aborted()
        completed++;report()
      }finally{clearTimeout(timeout);controller.signal.removeEventListener('abort',cancel)}
    }
  }
  const tasks=Array.from({length:Math.min(4,assets.length)},worker)
  try{
    await Promise.all(tasks)
    if(signal.aborted)throw aborted()
    return {completed,total:assets.length,bytes:totalBytes,resolve:source=>urls.get(mediaUrl(source,options)??'')??source,dispose}
  }catch(error){controller.abort();await Promise.allSettled(tasks);dispose();throw error}
  finally{signal.removeEventListener('abort',stop)}
}
