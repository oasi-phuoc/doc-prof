import { useEffect, useState } from 'react'
import type { GrammarImageSupport } from '@/grammaire/curriculum/types'
import { acquireGrammarImageUrl } from './verified-image-url'
import { SafeImage } from '@/interactive/components/Media'
import { usePreparedMedia } from '@/interactive/media/prepared-context'

function VerifiedImage({support,zoom}:{support:GrammarImageSupport;zoom:boolean}) {
  const resolve=usePreparedMedia()
  const resolvedSource=resolve(support.src)
  const key=JSON.stringify([support.src,support.sha256,resolvedSource])
  const [state,setState]=useState<{key:string;url?:string;error?:string}>({key:''})
  useEffect(()=>{
    let active=true
    const image=acquireGrammarImageUrl(support,resolvedSource)
    void image.ready.then(url=>{
      if(!active)return
      setState({key,url})
    }).catch((error:unknown)=>{if(active)setState({key,error:error instanceof Error?error.message:'Image indisponible.'})})
    return ()=>{active=false;image.release()}
  },[key,resolvedSource])
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
