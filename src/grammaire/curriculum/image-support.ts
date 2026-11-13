import type { GrammarImageSupport } from './types'

/** Immutable, local, content-addressed files only; never an overwritable legacy URL. */
export function validGrammarImage(value: unknown): value is GrammarImageSupport {
  if (!value || typeof value!=='object' || Array.isArray(value)) return false
  const v=value as Record<string,unknown>,source=v.source as Record<string,unknown>|undefined
  const text=(s:unknown):s is string=>typeof s==='string'&&s.trim().length>0
  return text(v.id) && text(v.alt) && typeof v.sha256==='string' && /^[a-f0-9]{64}$/.test(v.sha256) &&
    typeof v.src==='string' && new RegExp(`^/lib/images/grammaire/curriculum/sha256/${v.sha256}\\.(webp|png|jpg)$`).test(v.src) &&
    Number.isInteger(v.width)&&Number(v.width)>0&&Number.isInteger(v.height)&&Number(v.height)>0 &&
    !!source && typeof source==='object' && !Array.isArray(source) && text(source.path)&&
    /^\/lib\/images\/[a-z0-9/_-]+\.(webp|png|jpg)$/.test(source.path) &&
    text(source.manifest)&&/^(docs|public)\/[a-zA-Z0-9/_.-]+\.json$/.test(source.manifest)&&!source.manifest.includes('..') &&
    ['project-generated','permitted-reuse'].includes(String(source.rights))&&text(source.note)
}

const verified=new Map<string,Promise<Blob>>()
export function consistentGrammarImages(units:Array<{imageSupports?:GrammarImageSupport[]}>):boolean {
  const seen=new Map<string,string>()
  for(const u of units)for(const s of u.imageSupports??[]) {
    const identity=JSON.stringify([s.src,s.sha256,s.alt,s.width,s.height,s.source.path,s.source.manifest,s.source.rights,s.source.note])
    if(seen.has(s.id)&&seen.get(s.id)!==identity)return false
    seen.set(s.id,identity)
  }
  return true
}
/** Verify bytes before exposing a blob URL. A changed file never replaces a saved visual. */
export function loadGrammarImage(support: GrammarImageSupport, fetchMedia: typeof fetch = globalThis.fetch.bind(globalThis)): Promise<Blob> {
  if (!validGrammarImage(support)) return Promise.reject(new Error('Référence d’image invalide.'))
  const key=support.src+':'+support.sha256,cached=verified.get(key)
  if (cached) return cached
  const request=(async()=>{
    let response:Response
    try {response=await fetchMedia(support.src,{redirect:'error',credentials:'same-origin'})}
    catch {throw new Error('Image indisponible. Réessayez son chargement.')}
    if (!response.ok) throw new Error('Image indisponible.')
    const blob=await response.blob()
    if (!blob.size || blob.size>8*1024*1024) throw new Error('Fichier image invalide.')
    if(!globalThis.crypto?.subtle)throw new Error('La vérification de cette image est indisponible dans ce navigateur.')
    const digest=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())
    const actual=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')
    if (actual!==support.sha256) throw new Error('L’image ne correspond plus à la fiche sauvegardée.')
    return blob
  })()
  verified.set(key,request)
  if (verified.size>32) verified.delete(verified.keys().next().value!)
  void request.catch(()=>{if(verified.get(key)===request)verified.delete(key)})
  return request
}
