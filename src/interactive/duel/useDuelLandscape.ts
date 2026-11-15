import {useCallback,useEffect,useRef,useState} from 'react'
import type {DuelAction} from './core'
import {isLandscapeViewport,isPhoneViewport,requestDuelLandscape} from './landscape'

/** Keep start/resume suspended until the requested phone orientation is ready. */
export function useDuelLandscape(dispatch:(action:DuelAction)=>void) {
  const [pending,setPending]=useState(false),request=useRef<{action:DuelAction;ready:boolean}|null>(null)
  const complete=useCallback(()=>{const value=request.current;if(!value)return;request.current=null;setPending(false);dispatch(value.action)},[dispatch])
  const cancel=useCallback(()=>{request.current=null;setPending(false)},[])
  const launch=(action:DuelAction)=>{
    if(!isPhoneViewport()){dispatch(action);return}
    const value={action,ready:false};request.current=value;setPending(true)
    void requestDuelLandscape().then(()=>{if(request.current!==value)return;value.ready=true;if(isLandscapeViewport())complete()})
  }
  useEffect(()=>{if(!pending)return;document.querySelector<HTMLButtonElement>('.ci-duel-rotate button')?.focus();const rotated=()=>{if(request.current?.ready&&isLandscapeViewport())complete()};window.addEventListener('resize',rotated);return()=>window.removeEventListener('resize',rotated)},[pending,complete])
  useEffect(()=>()=>{request.current=null},[])
  return {pending,launch,complete,cancel}
}

