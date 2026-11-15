import {useCallback,useEffect,useRef,useState,type PointerEvent,type MouseEvent} from 'react'
import {isWordDropQuestion} from '../domain/word-drop'
import type {Question} from '../domain/types'
import type {SequenceDrag} from './useSequenceOrder'

type Gesture=SequenceDrag&{pointerId:number;startX:number;startY:number;active:boolean;capture:HTMLButtonElement}
export function useWordDrop({question,canSelect,disabled,onSelect,onPropose}:{question:Question;canSelect:boolean;disabled:boolean;onSelect:(id:string)=>void;onPropose?:((id:string|null)=>void)}){
  const available=isWordDropQuestion(question),blocked=!available||disabled||!canSelect&&!onPropose
  const target=useRef<HTMLButtonElement>(null),gesture=useRef<Gesture|null>(null),ignoreClick=useRef(false)
  const [pending,setPending]=useState<string|null>(null),[drag,setDrag]=useState<SequenceDrag|null>(null),[announcement,setAnnouncement]=useState('')
  const cancel=useCallback(()=>{const current=gesture.current;gesture.current=null;if(current?.active)ignoreClick.current=true;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId);setDrag(null)},[])
  if(blocked&&pending!==null)setPending(null)
  if(blocked&&drag)setDrag(null)
  useEffect(()=>{if(!blocked)return;const current=gesture.current;gesture.current=null;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)},[blocked])
  useEffect(()=>{
    if(!available)return
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&gesture.current){event.preventDefault();cancel();setPending(null);setAnnouncement('Déplacement annulé.')}}
    window.addEventListener('blur',cancel);window.addEventListener('keydown',escape)
    return()=>{window.removeEventListener('blur',cancel);window.removeEventListener('keydown',escape);const current=gesture.current;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)}
  },[available,cancel])
  const choose=(id:string)=>{
    if(blocked)return
    if(canSelect){onSelect(id);return}
    setPending(pending===id?null:id);setAnnouncement(pending===id?'Choix annulé.':`${question.choices.find(choice=>choice.id===id)?.text} : touchez le blanc pour proposer ce mot.`)
  }
  const submit=(id:string)=>{if(blocked)return;setPending(null);if(canSelect)onSelect(id);else{onPropose?.(id);setAnnouncement(`Proposition : ${question.choices.find(choice=>choice.id===id)?.text}.`)}}
  const hit=(x:number,y:number)=>{const element=document.elementFromPoint(x,y);return !!element&&!!target.current?.contains(element)}
  const pointerDown=(source:number,event:PointerEvent<HTMLButtonElement>)=>{
    if(blocked||event.button!==0||!event.isPrimary||gesture.current)return
    const box=event.currentTarget.getBoundingClientRect(),capture=event.currentTarget;ignoreClick.current=false
    gesture.current={source,target:null,x:event.clientX,y:event.clientY,width:box.width,height:box.height,offsetX:event.clientX-box.left,offsetY:event.clientY-box.top,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,active:false,capture};capture.setPointerCapture(event.pointerId)
  }
  const pointerMove=(event:PointerEvent<HTMLButtonElement>)=>{const current=gesture.current;if(!current||current.pointerId!==event.pointerId)return;if(!current.active&&Math.hypot(event.clientX-current.startX,event.clientY-current.startY)<8)return;event.preventDefault();current.active=true;current.x=event.clientX;current.y=event.clientY;current.target=hit(event.clientX,event.clientY)?0:null;setPending(null);setDrag({...current})}
  const pointerUp=(event:PointerEvent<HTMLButtonElement>)=>{
    const current=gesture.current;if(!current||current.pointerId!==event.pointerId)return
    const active=current.active,inside=hit(event.clientX,event.clientY),id=question.choices[current.source]?.id
    if(active||event.pointerType==='touch'){event.preventDefault();ignoreClick.current=true}
    cancel()
    if(!id)return
    if(active){if(inside)submit(id);else setAnnouncement('Déplacement annulé.')}
    else if(event.pointerType==='touch'&&current.capture.contains(document.elementFromPoint(event.clientX,event.clientY)))choose(id)
  }
  const clickCapture=(event:MouseEvent<HTMLButtonElement>)=>{if(ignoreClick.current&&event.detail!==0){event.preventDefault();event.stopPropagation()}ignoreClick.current=false}
  return {available,blocked,target,pending,drag,announcement,choose,
    deposit:()=>{if(pending)submit(pending);else if(!blocked&&!canSelect){onPropose?.(null);setAnnouncement('Proposition retirée.')}},
    escape:()=>{cancel();setPending(null);setAnnouncement('Déplacement annulé.')},
    pointerProps:(source:number)=>({onPointerDown:(event:PointerEvent<HTMLButtonElement>)=>pointerDown(source,event),onPointerMove:pointerMove,onPointerUp:pointerUp,onPointerCancel:cancel,onLostPointerCapture:cancel,onClickCapture:clickCapture,onDragStart:(event:MouseEvent)=>event.preventDefault()})}
}
