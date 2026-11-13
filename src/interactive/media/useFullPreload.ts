import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PreloadError, preloadIdentity, preloadSession, sessionAssets, type PreparedMedia, type PreloadProgress } from './full-preload'
import { originalMedia } from './prepared-context'
import type { PublicMediaPlan } from './types'
import type { MediaManager } from './manager'

type Run = { key: string; phase: 'idle' | 'loading' | 'ready' | 'error'; progress: PreloadProgress; pack?: PreparedMedia; error?: string }
const policy = () => ({baseUrl:window.location.href})
export function useFullPreload(plan: PublicMediaPlan | null, manager: MediaManager) {
  const {key,total}=useMemo(()=>({key:plan?preloadIdentity(plan,policy()):'',total:plan?sessionAssets(plan,policy()).length:0}),[plan])
  const empty={completed:0,total,bytes:0}
  const [run,setRun]=useState<Run>({key,phase:'idle',progress:empty})
  // Forget the disposed pack even if a later selection returns to an earlier key.
  if(run.key!==key)setRun({key,phase:'idle',progress:empty})
  const current=useRef<{key:string;controller?:AbortController;pack?:PreparedMedia}|undefined>(undefined)
  const clearKey=useCallback((key:string)=>{
    if(current.current?.key===key){manager.usePrepared(originalMedia);current.current.controller?.abort();current.current.pack?.dispose();current.current=undefined}
  },[manager])
  useEffect(()=>()=>clearKey(key),[key,clearKey])
  const release=()=>{
    manager.usePrepared(originalMedia)
    current.current?.controller?.abort();current.current?.pack?.dispose();current.current=undefined
    setRun({key,phase:'idle',progress:empty})
  }
  const start=()=>{
    if(!plan?.questions.length||current.current?.key===key&&current.current.controller)return
    manager.usePrepared(originalMedia)
    current.current?.controller?.abort();current.current?.pack?.dispose()
    const controller=new AbortController();current.current={key,controller}
    setRun({key,phase:'loading',progress:empty})
    void preloadSession(plan,policy(),controller.signal,progress=>{
      if(!controller.signal.aborted&&current.current?.controller===controller)setRun({key,phase:'loading',progress})
    }).then(pack=>{
      if(controller.signal.aborted||current.current?.controller!==controller){pack.dispose();return}
      current.current={key,pack};manager.usePrepared(pack.resolve);setRun({key,phase:'ready',progress:pack,pack})
    }).catch((error:unknown)=>{
      if(controller.signal.aborted||current.current?.controller!==controller)return
      current.current=undefined
      setRun({key,phase:'error',progress:empty,error:error instanceof PreloadError?error.message:error instanceof Error&&error.name==='AbortError'?'Un média a mis trop de temps à charger. Vérifiez la connexion puis réessayez.':'Un média n’a pas pu être chargé. Vérifiez la connexion puis réessayez.'})
    })
  }
  const active=run.key===key?run:{key,phase:'idle' as const,progress:empty}
  return {...active,start,release,resolve:active.phase==='ready'&&active.pack?active.pack.resolve:originalMedia}
}
