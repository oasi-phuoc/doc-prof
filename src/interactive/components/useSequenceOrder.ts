import {useCallback,useEffect,useId,useRef,useState,type KeyboardEvent,type MouseEvent,type PointerEvent} from 'react'

export type SequenceDrag = {source:number;target:number|null;x:number;y:number;width:number;height:number;offsetX:number;offsetY:number}
type Gesture = SequenceDrag & {pointerId:number;startX:number;startY:number;active:boolean;capture:HTMLElement}

/** A gesture commits one existing ordering action, only when released in a zone. */
export function useSequenceOrder({length,order,onOrder,disabled,label}:{length:number;order?:number[];onOrder?:(order:number[])=>void;disabled:boolean;label:(source:number)=>string}) {
  const positions=order??Array.from({length},(_,index)=>index)
  const blocked=disabled||!onOrder,group=useRef<HTMLDivElement>(null),help=useId()
  const gesture=useRef<Gesture|null>(null),ignoreClick=useRef(false)
  const [drag,setDrag]=useState<SequenceDrag|null>(null),[selected,setSelected]=useState<number|null>(null)
  const [previous,setPrevious]=useState<number[]|null>(null),[announcement,setAnnouncement]=useState('')
  const cancel=useCallback(()=>{
    const current=gesture.current;gesture.current=null
    if(current?.active)ignoreClick.current=true
    if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)
    setDrag(null)
  },[])
  if(blocked&&drag)setDrag(null)
  useEffect(()=>{
    if(!blocked)return
    const current=gesture.current;gesture.current=null
    if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)
  },[blocked])
  useEffect(()=>{
    window.addEventListener('blur',cancel)
    return ()=>{window.removeEventListener('blur',cancel);const current=gesture.current;gesture.current=null;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)}
  },[cancel])
  const place=(source:number,target:number)=>{
    const from=positions.indexOf(source)
    if(blocked||from<0||target<0||target>=positions.length||from===target)return
    const next=[...positions];next.splice(from,1);next.splice(target,0,source)
    setPrevious([...positions]);onOrder?.(next);setSelected(null);setAnnouncement(`${label(source)} est maintenant à la place ${target+1}.`)
  }
  const choose=(source:number)=>{
    if(blocked)return
    if(selected===source){setSelected(null);setAnnouncement('Choix annulé.');return}
    if(selected===null){setSelected(source);setAnnouncement(`${label(source)} : choisissez sa nouvelle place.`);return}
    place(selected,positions.indexOf(source))
  }
  const keyDown=(source:number,event:KeyboardEvent<HTMLElement>)=>{
    if(event.target instanceof Element&&event.target.closest('dialog'))return
    if(event.key==='Escape'&&(gesture.current||selected!==null)){cancel();setSelected(null);setAnnouncement('Déplacement annulé.');event.preventDefault()}
    else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();place(source,positions.indexOf(source)+(event.key==='ArrowLeft'?-1:1))}
  }
  const targetAt=(x:number,y:number)=>{
    const zone=document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-ci-order-zone]')
    return zone&&group.current?.contains(zone)?Number(zone.dataset.ciOrderZone):null
  }
  const pointerDown=(source:number,event:PointerEvent<HTMLElement>)=>{
    if(blocked||event.button!==0||!event.isPrimary||gesture.current)return
    const capture=event.target instanceof Element?event.target.closest<HTMLElement>('button')??event.currentTarget:event.currentTarget
    const box=event.currentTarget.getBoundingClientRect()
    ignoreClick.current=false
    gesture.current={source,target:positions.indexOf(source),x:event.clientX,y:event.clientY,width:box.width,height:box.height,offsetX:event.clientX-box.left,offsetY:event.clientY-box.top,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,active:false,capture}
    capture.setPointerCapture(event.pointerId)
  }
  const pointerMove=(event:PointerEvent<HTMLElement>)=>{
    const current=gesture.current
    if(!current||event.pointerId!==current.pointerId)return
    if(!current.active&&Math.hypot(event.clientX-current.startX,event.clientY-current.startY)<8)return
    event.preventDefault();current.active=true;current.x=event.clientX;current.y=event.clientY;current.target=targetAt(event.clientX,event.clientY)
    setSelected(null);setDrag({...current})
  }
  const pointerUp=(event:PointerEvent<HTMLElement>)=>{
    const current=gesture.current
    if(!current||event.pointerId!==current.pointerId)return
    if(current.active){event.preventDefault();ignoreClick.current=true;const target=targetAt(event.clientX,event.clientY);if(target!==null)place(current.source,target);else setAnnouncement('Déplacement annulé.')}
    cancel()
  }
  const clickCapture=(event:MouseEvent<HTMLElement>)=>{if(ignoreClick.current&&event.detail!==0){event.preventDefault();event.stopPropagation()}ignoreClick.current=false}
  return {positions,group,help,blocked,drag,selected,announcement,choose,keyDown,
    pointerProps:(source:number)=>({onPointerDown:(event:PointerEvent<HTMLElement>)=>pointerDown(source,event),onPointerMove:pointerMove,onPointerUp:pointerUp,onPointerCancel:cancel,onLostPointerCapture:cancel,onClickCapture:clickCapture,onDragStart:(event:MouseEvent<HTMLElement>)=>event.preventDefault()}),
    zoneClass:(source:number,position:number)=>`ci-order-zone ci-order-item${blocked?' ci-order-disabled':''}${selected===source?' ci-order-selected':''}${drag?.source===source?' ci-order-dragging':''}${drag?.target===position?' ci-order-target':''}`,
    canUndo:!blocked&&!drag&&!!previous,
    undo:()=>{if(previous&&!blocked){cancel();onOrder?.(previous);setPrevious(null);setSelected(null);setAnnouncement('Dernier déplacement annulé.')}}}
}
