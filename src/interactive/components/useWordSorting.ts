import {useCallback,useEffect,useId,useRef,useState,type PointerEvent,type MouseEvent} from 'react'
import type {WordSorting} from '../domain/types'
import type {SequenceDrag} from './useSequenceOrder'

type Gesture=SequenceDrag&{pointerId:number;startX:number;startY:number;active:boolean;capture:HTMLButtonElement}
export function useWordSorting(sorting:WordSorting,placements:(string|null)[]|undefined,onPlacements:((placements:(string|null)[])=>void)|undefined,disabled:boolean){
  const values=placements??sorting.sentence.tokens.map(()=>null),blocked=disabled||!onPlacements
  const root=useRef<HTMLDivElement>(null),gesture=useRef<Gesture|null>(null),ignoreClick=useRef(false),focusSource=useRef<number|null>(null),help=useId()
  const [selected,setSelected]=useState<number|null>(null),[drag,setDrag]=useState<SequenceDrag|null>(null),[previous,setPrevious]=useState<(string|null)[]|null>(null),[announcement,setAnnouncement]=useState('')
  const cancel=useCallback(()=>{const current=gesture.current;gesture.current=null;if(current?.active)ignoreClick.current=true;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId);setDrag(null)},[])
  useEffect(()=>{window.addEventListener('blur',cancel);return()=>{window.removeEventListener('blur',cancel);const current=gesture.current;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)}},[cancel])
  if(blocked&&drag)setDrag(null)
  useEffect(()=>{if(!blocked)return;const current=gesture.current;gesture.current=null;if(current?.capture.hasPointerCapture(current.pointerId))current.capture.releasePointerCapture(current.pointerId)},[blocked])
  useEffect(()=>{if(focusSource.current!==null){root.current?.querySelector<HTMLButtonElement>(`[data-ci-sort-word="${focusSource.current}"]`)?.focus({preventScroll:true});focusSource.current=null}},[placements])
  const choose=(source:number)=>{if(blocked)return;setSelected(selected===source?null:source);setAnnouncement(selected===source?'Choix annulé.':`Élément ${source+1}, ${sorting.sentence.tokens[source]} : choisissez sa catégorie.`)}
  const place=(source:number,target:number)=>{
    if(blocked||source<0||source>=values.length||target< -1||target>=sorting.categories.length)return
    const category=target===-1?null:sorting.categories[target]!.id
    if(values[source]===category){setSelected(null);return}
    const next=[...values];next[source]=category;setPrevious([...values]);onPlacements?.(next);focusSource.current=source;setSelected(null)
    setAnnouncement(`Élément ${source+1}, ${sorting.sentence.tokens[source]} : ${target===-1?'remis dans les mots à classer':sorting.categories[target]!.label}.`)
  }
  const targetAt=(x:number,y:number)=>{const zone=document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-ci-sort-destination]');return zone&&root.current?.contains(zone)?Number(zone.dataset.ciSortDestination):null}
  const pointerDown=(source:number,event:PointerEvent<HTMLButtonElement>)=>{
    if(blocked||event.button!==0||!event.isPrimary||gesture.current)return
    const box=event.currentTarget.getBoundingClientRect(),capture=event.currentTarget;ignoreClick.current=false
    gesture.current={source,target:null,x:event.clientX,y:event.clientY,width:box.width,height:box.height,offsetX:event.clientX-box.left,offsetY:event.clientY-box.top,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,active:false,capture};capture.setPointerCapture(event.pointerId)
  }
  const pointerMove=(event:PointerEvent<HTMLButtonElement>)=>{const current=gesture.current;if(!current||event.pointerId!==current.pointerId)return;if(!current.active&&Math.hypot(event.clientX-current.startX,event.clientY-current.startY)<8)return;event.preventDefault();current.active=true;current.x=event.clientX;current.y=event.clientY;current.target=targetAt(event.clientX,event.clientY);setSelected(null);setDrag({...current})}
  const pointerUp=(event:PointerEvent<HTMLButtonElement>)=>{
    const current=gesture.current;if(!current||event.pointerId!==current.pointerId)return
    if(current.active){event.preventDefault();ignoreClick.current=true;const target=targetAt(event.clientX,event.clientY);if(target!==null)place(current.source,target);else setAnnouncement('Déplacement annulé.')}
    else if(event.pointerType==='touch'){event.preventDefault();ignoreClick.current=true;const word=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-ci-sort-word]');if(Number(word?.dataset.ciSortWord)===current.source)choose(current.source)}
    cancel()
  }
  const clickCapture=(event:MouseEvent<HTMLButtonElement>)=>{if(ignoreClick.current&&event.detail!==0){event.preventDefault();event.stopPropagation()}ignoreClick.current=false}
  return {root,help,values,blocked,selected,drag,announcement,choose,
    placeSelected:(target:number)=>{if(selected!==null)place(selected,target)},
    canUndo:!blocked&&!drag&&!!previous,undo:()=>{if(previous&&!blocked){cancel();onPlacements?.([...previous]);setPrevious(null);setSelected(null);setAnnouncement('Dernier classement annulé.')}},
    escape:()=>{cancel();setSelected(null);setAnnouncement('Déplacement annulé.')},
    pointerProps:(source:number)=>({onPointerDown:(event:PointerEvent<HTMLButtonElement>)=>pointerDown(source,event),onPointerMove:pointerMove,onPointerUp:pointerUp,onPointerCancel:cancel,onLostPointerCapture:cancel,onClickCapture:clickCapture,onDragStart:(event:MouseEvent)=>event.preventDefault()})}
}
