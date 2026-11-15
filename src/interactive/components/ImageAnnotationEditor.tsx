import {useCallback,useEffect,useId,useRef,useState,type KeyboardEvent,type PointerEvent} from 'react'
import {ANNOTATION_COLORS,ANNOTATION_TOOLS,MAX_IMAGE_STROKES,extendImageStroke,validImageStroke,type AnnotationPoint,type ImageStroke} from '../domain/image-annotations'
import {AnnotationShapes} from './AnnotationArtwork'
import './image-annotations.css'

export type ImageAnnotationControls={strokes:readonly ImageStroke[];disabled:boolean;onAdd:(stroke:ImageStroke)=>void;onUndo:()=>void;onClear:()=>void;onOpenChange?:(open:boolean)=>void}
type Tool='pan'|ImageStroke['tool']
type Gesture={pointer:number|null;target?:SVGSVGElement;stroke:ImageStroke}
const tools:Record<Tool,string>={pan:'Déplacer l’image',pen:'Stylo',highlighter:'Surligneur',rectangle:'Cadre',ellipse:'Ovale'}
const colors={red:'rouge',blue:'bleue',green:'verte',yellow:'jaune'}
function ToolIcon({tool}:{tool:Tool}) {
 return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {tool==='rectangle'?<rect x="3" y="5" width="18" height="14" rx="1"/>:tool==='ellipse'?<ellipse cx="12" cy="12" rx="9" ry="7"/>:tool==='pen'?<path d="m4 20 1-5L17 3l4 4L9 19l-5 1Zm11-15 4 4"/>:tool==='highlighter'?<path d="m5 15 10-11 5 5L9 19l-4-4Zm0 0-3 5h7m-7 3h19"/>:<path d="M8 11V5a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v8c0 5-2 7-6 7h-2c-3 0-4-2-6-4l-3-4c-1-2 1-4 3-2l2 2"/>}
 </svg>
}

/** Coordinates stay relative to the source image, independent of viewport and zoom. */
export default function ImageAnnotationEditor({src,alt,scale,annotations,size,onImageError}:{src:string;alt:string;scale:number;annotations:ImageAnnotationControls;size:{width:number;height:number};onImageError:()=>void}) {
 const [tool,setTool]=useState<Tool>('pan'),[color,setColor]=useState<ImageStroke['color']>('red'),[draft,setDraft]=useState<ImageStroke|null>(null),[cursor,setCursor]=useState<AnnotationPoint>([500,500]),[announcement,setAnnouncement]=useState(''),[bounds,setBounds]=useState({width:0,height:0}),[loaded,setLoaded]=useState(false)
 const pan=useRef<HTMLDivElement>(null),surface=useRef<SVGSVGElement>(null),gesture=useRef<Gesture|null>(null),help=useId()
 const panning=useRef<{pointer:number;target:SVGSVGElement;x:number;y:number;left:number;top:number}|null>(null)
 const canDraw=!annotations.disabled&&annotations.strokes.length<MAX_IMAGE_STROKES&&loaded&&tool!=='pan'
 const cancel=useCallback(()=>{
  const current=gesture.current;gesture.current=null
  if(current?.target&&current.pointer!==null&&current.target.hasPointerCapture(current.pointer))current.target.releasePointerCapture(current.pointer)
  const moving=panning.current;panning.current=null
  if(moving?.target.hasPointerCapture(moving.pointer))moving.target.releasePointerCapture(moving.pointer)
  setDraft(null)
 },[])
 useEffect(()=>{
  const node=pan.current;if(!node)return
  let previous={width:0,height:0}
  const observer=new ResizeObserver(()=>{const next={width:node.clientWidth,height:node.clientHeight};if(next.width===previous.width&&next.height===previous.height)return;if(previous.width)cancel();previous=next;setBounds(next)})
  observer.observe(node);window.addEventListener('blur',cancel)
  return()=>{observer.disconnect();window.removeEventListener('blur',cancel);const current=gesture.current;gesture.current=null;if(current?.target&&current.pointer!==null&&current.target.hasPointerCapture(current.pointer))current.target.releasePointerCapture(current.pointer);const moving=panning.current;panning.current=null;if(moving?.target.hasPointerCapture(moving.pointer))moving.target.releasePointerCapture(moving.pointer)}
 },[cancel])
 useEffect(()=>{let active=true;queueMicrotask(()=>{if(active)cancel()});return()=>{active=false}},[scale,annotations.disabled,cancel])
 const commit=()=>{
  const current=gesture.current
  if(current&&canDraw&&validImageStroke(current.stroke)){annotations.onAdd(current.stroke);const count=annotations.strokes.length+1;setAnnouncement(`${tools[current.stroke.tool]} ajouté. ${count} ${count===1?'tracé':'tracés'}.`)}
  cancel()
 }
 const locate=(event:PointerEvent<SVGSVGElement>):AnnotationPoint=>{
  const rect=event.currentTarget.getBoundingClientRect()
  return [Math.max(0,Math.min(1000,Math.round((event.clientX-rect.left)/rect.width*1000))),Math.max(0,Math.min(1000,Math.round((event.clientY-rect.top)/rect.height*1000)))]
 }
 const extend=(point:AnnotationPoint)=>{const current=gesture.current;if(!current)return;current.stroke=extendImageStroke(current.stroke,point);setDraft(current.stroke)}
 const down=(event:PointerEvent<SVGSVGElement>)=>{
  if(!event.isPrimary){cancel();return}
  if(tool==='pan'&&event.pointerType==='mouse'&&event.button===0&&pan.current){
   cancel();event.preventDefault();event.currentTarget.focus({preventScroll:true});panning.current={pointer:event.pointerId,target:event.currentTarget,x:event.clientX,y:event.clientY,left:pan.current.scrollLeft,top:pan.current.scrollTop};event.currentTarget.setPointerCapture(event.pointerId);return
  }
  if(!canDraw||event.button!==0)return
  cancel();event.preventDefault();event.currentTarget.focus({preventScroll:true})
  const stroke:ImageStroke={tool:tool as ImageStroke['tool'],color,points:[locate(event)]}
  gesture.current={pointer:event.pointerId,target:event.currentTarget,stroke};setDraft(stroke)
  try{event.currentTarget.setPointerCapture(event.pointerId)}catch{/* Synthetic events have no native pointer capture. */}
 }
 const key=(event:KeyboardEvent<SVGSVGElement>)=>{
  if(event.key==='Escape'&&gesture.current){event.preventDefault();event.stopPropagation();cancel();setAnnouncement('Tracé annulé.');return}
  if(!canDraw||event.ctrlKey||event.metaKey||event.altKey)return
  const delta=event.shiftKey?50:10,moves:Record<string,AnnotationPoint>={ArrowLeft:[-delta,0],ArrowRight:[delta,0],ArrowUp:[0,-delta],ArrowDown:[0,delta]}
  if(moves[event.key]){
   event.preventDefault();const move=moves[event.key]!,point:AnnotationPoint=[Math.max(0,Math.min(1000,cursor[0]+move[0])),Math.max(0,Math.min(1000,cursor[1]+move[1]))];setCursor(point)
   if(gesture.current?.pointer===null)extend(point)
   setAnnouncement(`Repère : ${Math.round(point[0]/10)} %, ${Math.round(point[1]/10)} %.`)
  }else if((event.key==='Enter'||event.key===' ')&&!event.repeat){
   event.preventDefault();if(gesture.current?.pointer===null)commit();else{cancel();const stroke:ImageStroke={tool:tool as ImageStroke['tool'],color,points:[[...cursor]]};gesture.current={pointer:null,stroke};setDraft(stroke);setAnnouncement('Début du tracé. Déplacez le repère, puis validez.')}
  }
 }
 const fit=Math.min(bounds.width||size.width,(bounds.height||size.height)*size.width/size.height)
 return <div className="ci-annotation-editor">
  <div className="ci-annotation-tools">
   <div role="group" aria-label="Outils d’annotation">{(['pan',...ANNOTATION_TOOLS] as Tool[]).map(value=><button type="button" key={value} aria-label={tools[value]} title={tools[value]} aria-pressed={tool===value} disabled={annotations.disabled&&value!=='pan'} onClick={()=>{cancel();setTool(value)}}><ToolIcon tool={value}/></button>)}</div>
   <div role="group" aria-label="Couleur des annotations">{Object.entries(ANNOTATION_COLORS).map(([value,css])=><button type="button" key={value} aria-label={`Couleur ${colors[value as keyof typeof colors]}`} title={`Couleur ${colors[value as keyof typeof colors]}`} aria-pressed={color===value} disabled={annotations.disabled} onClick={()=>{cancel();setColor(value as ImageStroke['color'])}}><span style={{background:css}}/>{color===value&&<b aria-hidden="true">✓</b>}</button>)}</div>
   <div role="group" aria-label="Annuler et effacer les annotations"><button type="button" disabled={annotations.disabled||!annotations.strokes.length} onClick={()=>{cancel();annotations.onUndo();setAnnouncement('Dernier tracé annulé.')}}>Annuler</button><button type="button" disabled={annotations.disabled||!annotations.strokes.length} onClick={()=>{cancel();annotations.onClear();setAnnouncement('Tracés effacés.')}}>Tout effacer</button></div>
  </div>
  <p id={help} className="ci-annotation-help">{annotations.strokes.length>=MAX_IMAGE_STROKES?'Limite de tracés atteinte : annulez ou effacez un tracé.':tool==='pan'?'Choisissez un outil pour annoter. La main permet de déplacer l’image.':'Dessinez au doigt ou à la souris. Au clavier : flèches, Entrée pour commencer et terminer, Échap pour annuler.'}</p>
  <div ref={pan} className="ci-image-pan ci-annotation-pan" tabIndex={0} role="region" aria-label="Image et annotations à parcourir">
   <div className="ci-annotation-sheet" style={{width:fit*scale}}>
    <img src={src} alt={alt} draggable={false} style={{width:'100%',height:'auto',maxHeight:'none',maxWidth:'none'}} onLoad={()=>setLoaded(true)} onError={onImageError}/>
    <svg ref={surface} className="ci-annotation-surface" data-tool={tool} data-ready={loaded||undefined} data-drawing={!!draft||undefined} data-annotation-count={annotations.strokes.length} viewBox={`0 0 ${size.width} ${size.height}`} tabIndex={tool==='pan'?-1:0} role="group" aria-label="Zone de dessin" aria-describedby={help} style={{touchAction:tool==='pan'?'auto':'none',cursor:tool==='pan'?'grab':'crosshair'}} onKeyDown={key} onPointerDown={down} onPointerMove={event=>{const moving=panning.current;if(moving?.pointer===event.pointerId&&pan.current){event.preventDefault();pan.current.scrollLeft=moving.left+moving.x-event.clientX;pan.current.scrollTop=moving.top+moving.y-event.clientY}else if(gesture.current?.pointer===event.pointerId&&canDraw){event.preventDefault();extend(locate(event))}}} onPointerUp={event=>{if(panning.current?.pointer===event.pointerId)cancel();else if(gesture.current?.pointer===event.pointerId){extend(locate(event));commit()}}} onPointerCancel={cancel} onLostPointerCapture={cancel}>
     <g aria-hidden="true" pointerEvents="none"><AnnotationShapes strokes={annotations.strokes} width={size.width} height={size.height}/>{draft&&<g data-annotation-draft><AnnotationShapes strokes={[draft]} width={size.width} height={size.height}/></g>}<g className="ci-annotation-cursor" transform={`translate(${cursor[0]*size.width/1000} ${cursor[1]*size.height/1000})`}><circle r={Math.max(size.width,size.height)/80} fill="white" fillOpacity=".75" stroke="#182238"/><path d={`M-${size.width/40},0H${size.width/40}M0,-${size.height/40}V${size.height/40}`} stroke="#182238"/></g></g>
    </svg>
   </div>
  </div>
  <span className="ci-sr-only" role="status">{announcement}</span>
 </div>
}
