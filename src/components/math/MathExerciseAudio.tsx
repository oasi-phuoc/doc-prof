import {useEffect,useRef,useState} from 'react'
import type {WorksheetBlock} from '@/math/types'
import {mathAudioPrompts} from '@/math/audio-prompts'
import {concatMp3,spokenJunctionSeconds} from '@/tcm-cfr/audio-nombres'
import {cscConsigneSrc, cscRatedSrc, type DeniseRate, type ListeningKind} from '@/tcm-csc/denise-audio'

function PromptAudio({parts,label}:{parts:string[];label:string}) {
  const ref=useRef<HTMLAudioElement>(null)
  const key=JSON.stringify(parts)
  const [prepared,setPrepared]=useState<{key:string;url:string}>()
  const [failed,setFailed]=useState('')
  const [retry,setRetry]=useState(0)
  useEffect(()=>{
    if (parts.length<2) return
    const node=ref.current
    if (!node) return
    let disposed=false,started=false,url:string|undefined
    const prepare=()=>{
      if(started)return
      started=true
      const parsed=JSON.parse(key) as string[]
      void concatMp3(parsed, { trimJunctionSeconds: spokenJunctionSeconds(parsed) }).then(blob=>{
        url=URL.createObjectURL(blob)
        if(disposed){URL.revokeObjectURL(url);return}
        setPrepared({key,url})
      }).catch(()=>{if(!disposed)setFailed(key)})
    }
    const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting))prepare()}):undefined
    if(observer)observer.observe(node)
    else if(node.getClientRects().length)prepare()
    return()=>{disposed=true;observer?.disconnect();if(url)URL.revokeObjectURL(url)}
  },[key,retry,parts.length])
  const src=parts.length===1?parts[0]:prepared?.key===key?prepared.url:undefined
  return <div className="math-prompt-audio"><span>{label}</span><audio ref={ref} aria-label={label} data-audio-parts={key} controls preload={parts.length===1?'none':src?'metadata':'none'} src={src}/>{failed===key&&<button type="button" onClick={()=>{setFailed('');setRetry(value=>value+1)}}>Réessayer {label.toLowerCase()}</button>}</div>
}

const LISTENED = /^tcm-(?:csc-ex0[12]|cfr-ex0[12])$/
const CONSIGNE_KIND: Record<string, ListeningKind> = { 'tcm-csc-ex01': 'nombres', 'tcm-csc-ex02': 'calculs', 'tcm-csc-ex03': 'entourer' }

function lettered(type: string, parts: string[], index: number) {
  if (!LISTENED.test(type) || index > 11) return parts
  return [`/lib/audio/tcm-csc/denise/lettre-${String.fromCharCode(97 + index)}.mp3`, ...parts]
}

export function MathExerciseAudio({block}:{block:WorksheetBlock}) {
  let prompts:string[][]|undefined
  try{prompts=mathAudioPrompts(block)}catch{return <p className="no-print" role="alert">Validez les données de l’exercice pour préparer ses audios.</p>}
  const calculation=block.exerciseType.endsWith('02')
  const marked=LISTENED.test(block.exerciseType)
  const kind=CONSIGNE_KIND[block.exerciseType]
  const rate: DeniseRate = block.deniseRate === '-35%' || block.deniseRate === '-50%' ? block.deniseRate : '-25%'
  return <div className="math-exercise-audios no-print" role="group" aria-label={`Audios de l’exercice ${block.exerciseIndex}`}>{kind&&<div className="math-prompt-audio"><span>Consigne</span><audio aria-label={`Consigne ${rate}`} controls preload="none" src={cscConsigneSrc(kind, rate)}/></div>}{prompts?.map((parts,index)=><PromptAudio key={index} parts={lettered(block.exerciseType, parts.map(src => cscRatedSrc(src, rate)), index)} label={`${calculation?'Calcul':'Nombre'} ${marked?String.fromCharCode(65+index):index+1}`}/>)}</div>
}
