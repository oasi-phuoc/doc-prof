import { useEffect, useState } from 'react'
import type { GrammarImageSupport } from '@/grammaire/curriculum/types'
import { loadGrammarImage } from '@/grammaire/curriculum/image-support'
import { SafeImage } from '@/interactive/components/Media'

function VerifiedImage({support,zoom}:{support:GrammarImageSupport;zoom:boolean}) {
  const key=support.src+':'+support.sha256
  const [state,setState]=useState<{key:string;url?:string;error?:string}>({key:''})
  useEffect(()=>{
    let active=true,url:string|undefined
    void loadGrammarImage(support).then(blob=>{
      if(!active)return
      url=URL.createObjectURL(blob);setState({key,url})
    }).catch((error:unknown)=>{if(active)setState({key,error:error instanceof Error?error.message:'Image indisponible.'})})
    return ()=>{active=false;if(url)URL.revokeObjectURL(url)}
  },[key])
  if(state.key!==key||!state.url&&!state.error)return <span className="grammar-media-status" role="status">Chargement de l’image…</span>
  if(state.error)return <span className="grammar-media-error" role="alert">{state.error} {support.alt}</span>
  return <SafeImage src={state.url!} alt={support.alt} zoom={zoom} retryable={false}/>
}

export function GrammarImageSupports({supports,zoom=false}:{supports?:GrammarImageSupport[];zoom?:boolean}) {
  if(!supports?.length)return null
  return <div className="grammar-support-images" style={{gridTemplateColumns:`repeat(${supports.length}, minmax(0, 1fr))`}}>
    {supports.map(s=><figure className="grammar-support-image" data-support-id={s.id} key={s.id+':'+s.sha256}><VerifiedImage support={s} zoom={zoom}/></figure>)}
  </div>
}
