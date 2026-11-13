import type { MascotKind } from '../domain/mascot'
import { signatureAttack } from './signature-attacks'

type TokenKind = 'leaf'|'feather'|'star'|'bubble'|'snow'|'drop'|'paw'|'banana'|'quill'|'cheese'|'maple'|'eucalyptus'
type Placement = readonly [number,number,number,number]
const trail:readonly Placement[]=[[-42,14,-30,.6],[-18,-16,20,.8],[9,12,-15,1],[36,-9,25,.85]]
const orbit:readonly Placement[]=[[-33,-22,-25,.75],[18,-30,20,.9],[37,14,55,.8],[-10,29,-30,1]]

/** Original SVG motifs, fixed to the mascot rather than a configurable preset. */
export function SignatureAttackArt({mascot}:{mascot:MascotKind}) {
  const {color,accent}=signatureAttack(mascot)
  const particles=(kind:TokenKind,points=trail)=><Particles kind={kind} points={points} color={color} accent={accent}/>
  return <g className="ci-signature-art" data-signature={mascot}>{(()=>{
    switch(mascot){
      case 'leaf':return <>{particles('leaf')}<path d="M-48 34Q1 46 47 12" fill="none" stroke={accent} strokeWidth="3"/></>
      case 'owl':return <><path d="M5-40Q-31-8 8 26Q-48 14-31-25Q-17-43 5-40Z" fill={accent}/>{particles('feather',[[0,-8,30,.95],[33,15,-20,.8]])}</>
      case 'octopus':return <><path d="M-42 17Q-60-7-36-16Q-47-44-18-34Q-5-58 13-33Q43-45 40-18Q62-2 41 17Q35 47 9 34Q-13 55-26 30Q-49 44-42 17Z" fill={color}/><path d="M-25-9Q-5-24 14-7" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round"/><circle cx="-43" cy="-39" r="6" fill={accent}/><circle cx="48" cy="34" r="7" fill={color}/></>
      case 'hedgehog':return particles('quill',[[-37,-25,-45,.8],[-20,0,-20,1],[-35,28,10,.8],[14,-22,-20,1],[20,20,5,1.1]])
      case 'rabbit':return <><path d="M15-43Q-24-10 10 33Q-39 22-34-10Q-30-43 15-43Z" fill={accent}/><path d="M-44 35Q-9 19 28 34" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"/>{particles('star',[[31,-16,15,.65],[32,28,-15,.5]])}</>
      case 'dragon':return <><path d="M-54 20Q-18 5-25-32Q-8-21-1-34Q1-3 21-45Q23-17 42-15Q17-4 55 12Q27 40-5 25Q-31 38-54 20Z" fill={color}/><path d="M-28 20Q-2 1 0-15Q12 7 33 14Q6 33-28 20Z" fill={accent}/></>
      case 'rat':return particles('cheese',[[-34,13,-20,.7],[0,-15,20,.95],[32,16,-10,.8]])
      case 'ox':return <><path d="M-46 20-33-17-12-27 2-13 23-33 46-6 38 31 7 40-19 24Z" fill={color}/><path d="M-33-17-10 8 2-13M-10 8 7 40M-10 8 38 31" fill="none" stroke={accent} strokeWidth="5"/><path d="M-56 31Q-35 48-17 39M31-42 44-32" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"/></>
      case 'tiger':return <>{[-23,0,23].map((y,i)=><path key={y} d="M-48 22Q-10-24 45-30Q5-6-48 22Z" transform={`translate(${i*5} ${y})`} fill={color}/>)}<path d="M-36 17 37-24" stroke={accent} strokeWidth="3"/></>
      case 'snake':return <><path d="M-55 25Q-41-21-14-10Q9 7 24-24Q36-51 54-28Q35-34 30-12Q14 26-12 7Q-32-7-55 25Z" fill={color}/><path d="M-39 11Q-22-7-12 0Q8 17 23-10" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"/><circle cx="48" cy="-30" r="3" fill="#fff"/></>
      case 'horse':return <><path d="M-39-22Q-12-50 8-18L-3-8Q-15-29-28-9Q-37 7-15 22L-26 33Q-61 10-39-22Z" fill={color}/>{particles('star',[[19,-30,15,.7],[34,-2,-15,.9],[11,30,30,.7]])}</>
      case 'goat':return <><Cloud color={accent}/><path d="M-37 11Q-46-19-19-26Q8-31 5-9Q2 8-12-2M8 21Q-3 3 17-11Q40-22 46-2Q51 13 34 13" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/></>
      case 'monkey':return particles('banana',orbit)
      case 'rooster':return <><g fill={accent}>{Array.from({length:8},(_,i)=><path key={i} d="M-5-26 0-50 5-26Z" transform={`rotate(${i*45})`}/>)}</g><circle r="23" fill={color}/><circle r="13" fill={accent}/><path d="M-48 35Q-27 18-15 29M21-35 42-40" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"/></>
      case 'dog':return particles('paw',[[-34,18,-25,.7],[0,-14,20,1],[34,22,-10,.85]])
      case 'boar':return <><path d="M-52 20Q-42 3-29 10Q-35-14-14-12Q-8-38 13-20Q35-32 36-9Q59-7 51 20Q27 41 4 27Q-23 45-34 27Z" fill={color}/><path d="M-29 17Q-11 0 8 14M14-8Q27-19 37-2" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round"/><circle cx="-46" cy="-17" r="6" fill={color}/></>
      case 'panda':return <><g stroke={color} strokeWidth="10" strokeLinecap="round"><path d="M-28 31-17-32M-4 37 9-27M23 29 35-35"/></g><g stroke={accent} strokeWidth="4"><path d="M-28 13-17 15M-21-13-10-11M0 9 12 11M29-2 40 0"/></g>{particles('leaf',[[-35,-20,-45,.6],[29,20,35,.7]])}</>
      case 'fox':return <>{particles('star',orbit)}<path d="M-46 12Q-13-11 9 4Q24 14 49-10" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"/></>
      case 'tanuki':return <><path d="M-42 29Q-48-29-1-39Q43-47 46-10Q42 20 16 21Q-10 21-7 0Q-4-15 10-10Q22-6 14 4Q7-4 4 5Q18 15 27 2Q33-23 6-25Q-22-24-42 29Z" fill={accent}/>{particles('leaf',[[-33,17,-30,.85],[28,-20,30,.8],[23,30,-10,.6]])}</>
      case 'otter':return particles('bubble',[[-38,20,0,.65],[-12,-18,0,1],[22,17,0,.95],[43,-25,0,.5]])
      case 'koala':return <>{particles('eucalyptus')}<path d="M-47-25Q-12-33 26-12" fill="none" stroke={accent} strokeWidth="4"/></>
      case 'turtle':return <><path d="M-54 26Q-25-23 15-28Q44-30 53 5Q39 41 8 27Q-26 37-54 26Z" fill={color}/><path d="m8-18 18 5 7 17-15 13-20-8-3-16Z" fill={accent}/><path d="M-2-7-20-10M-2 9-22 18M26-13 37-21M33 4 48 6" fill="none" stroke={accent} strokeWidth="4"/></>
      case 'axolotl':return <>{particles('star',[[-35,-13,-15,.75],[0,18,20,1],[31,-19,0,.8]])}{particles('bubble',[[-18,-35,0,.3],[38,27,0,.3]])}</>
      case 'leopard':return <>{[-21,0,21].map((y,i)=><path key={y} d="M-48 17Q-4-18 43-23L34-11Q-3-5-48 17Z" transform={`translate(${i*4} ${y})`} fill={color}/>)}{particles('snow',[[-21,20,0,.55],[30,-30,0,.5]])}</>
      case 'crane':return <>{particles('feather',[[-28,21,-45,1],[4,-9,-20,.95],[33,-22,10,.7]])}<path d="M-48-16Q-10-36 24-15M-12 38Q19 34 44 8" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"/></>
      case 'cat':return <><circle r="34" fill={color}/><circle r="27" fill={accent}/><path d="M0-27V27M-27 0H27" stroke={color} strokeWidth="3" opacity=".5"/><Token kind="paw" color={color} accent={accent}/>{particles('star',[[-44,-27,15,.4],[44,25,0,.4]])}</>
      case 'koi':return <><path className="ci-signature-water" data-ci-motion d="M-52 15Q-24-18 7-2Q26 6 51-13M-47 30Q-14 6 12 17Q29 24 49 5" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"/><path d="M-41 15Q-15-6 9 3" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"/>{particles('drop',[[-25,-27,50,.6],[28,-30,60,.8],[41,31,80,.65]])}</>
      case 'red-panda':return <>{particles('maple',orbit)}<path d="M-40 27Q3 53 43 9" fill="none" stroke={accent} strokeWidth="4"/></>
      case 'penguin':return <><path d="M-49 27Q-8 7 46 13L54 28Q6 36-49 27Z" fill={accent}/>{particles('snow',[[-32,-13,0,.7],[5,-25,25,.9],[35,-2,-15,.6]])}</>
      case 'kitsune':return <><g className="ci-signature-fire" data-ci-motion><path d="M-34 30Q-5 36 24 22Q-22 21-41 3Q-9 11 38-5Q5-5-34-20Q4-14 30-38Q27-20 50-17Q35 2 22 10Q40 12 34 23Q16 41-6 48Z" fill={color}/><path d="M-17 27Q6 27 25 17Q-3 13-17 3Q9 5 31-8Q4-6-13-15Q8-15 18-29Q21-15 34-14Q19-1 10 5Q24 11 17 20Q5 29-17 27Z" fill={accent}/></g><path d="M-32 43Q-13 27-31 14Q-34 37-44 39Z" fill={color}/><path d="M44 33Q30 14 46 3Q38 20 54 23Z" fill={accent}/></>
    }
  })()}</g>
}
function Particles({kind,points,color,accent}:{kind:TokenKind;points:readonly Placement[];color:string;accent:string}){
  return <>{points.map(([x,y,angle,size],index)=><g key={index} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}><Token kind={kind} color={color} accent={accent}/></g>)}</>
}
function Token({kind,color,accent}:{kind:TokenKind;color:string;accent:string}){
  switch(kind){
    case 'leaf':return <><path d="M-14 12Q-24-16 13-22Q27 9-14 12Z" fill={color}/><path d="M-11 9 11-18" stroke={accent} strokeWidth="3"/></>
    case 'eucalyptus':return <><path d="M-20 19Q-12-26 17-25Q12 9-20 19Z" fill={color}/><path d="M-16 14 14-21" stroke={accent} strokeWidth="2"/></>
    case 'feather':return <><path d="M-6 24Q-26 7-14-18Q3-37 17-17Q29 4-6 24Z" fill={accent}/><path d="M7-24-10 30M-7-9 3-4 15-10M-13 5-2 9 9 4" fill="none" stroke={color} strokeWidth="3"/></>
    case 'star':return <path d="m0-23 7 15 17 2-13 12 3 18-14-9-15 9 3-18-13-12 18-2Z" fill={color} stroke={accent} strokeWidth="3"/>
    case 'bubble':return <><circle r="21" fill={accent} fillOpacity=".8" stroke={color} strokeWidth="3"/><path d="M-13-4Q-10-15 1-14" stroke="#fff" fill="none" strokeWidth="4" strokeLinecap="round"/></>
    case 'snow':return <g stroke={color} strokeWidth="3" strokeLinecap="round">{[0,60,120].map(a=><path key={a} d="M0-23V23M-6-16 0-9 6-16M-6 16 0 9 6 16" fill="none" transform={`rotate(${a})`}/>)}<circle r="4" fill={accent}/></g>
    case 'drop':return <g className="ci-signature-drop" data-ci-motion><path d="M0-25Q-28 3-16 17Q0 34 17 16Q28 3 0-25Z" fill={color}/><path d="M-10 1Q-17 15-3 18" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round"/></g>
    case 'paw':return <g fill={color}><path d="M-16 9Q-11-10 0-7Q12-10 17 9Q20 24 0 19Q-20 25-16 9Z"/>{[[-17,-10,-25],[-6,-21,-5],[8,-20,10],[19,-8,30]].map(([x,y,a],i)=><ellipse key={i} cx={x} cy={y} rx="5" ry="8" transform={`rotate(${a} ${x} ${y})`}/>)}</g>
    case 'banana':return <><path d="M-21-18Q-22 18 20 12Q8 34-15 19Q-29 6-21-18Z" fill={color} stroke={accent} strokeWidth="3"/><path d="M-17-13Q-13 12 15 15" stroke={accent} strokeWidth="3" fill="none"/></>
    case 'quill':return <><path d="M-8 23-2-29 8 23 0 16Z" fill={color}/><path d="M-2-22 0 13" stroke={accent} strokeWidth="3"/></>
    case 'cheese':return <><path d="M-22 14 7-23 23-8 21 20Z" fill={color} stroke={accent} strokeWidth="3"/><g fill={accent}><circle cx="3" cy="0" r="4"/><circle cx="12" cy="11" r="4"/><circle cx="-8" cy="11" r="3"/></g></>
    case 'maple':return <><path d="M0-27 7-13 17-18 16-4 28-1 13 11 17 20 3 16 0 28-3 16-17 20-13 11-28-1-16-4-17-18-7-13Z" fill={color}/><path d="M0-20V23M0 8-13-3M0 8 13-3" stroke={accent} strokeWidth="2" fill="none"/></>
  }
}
function Cloud({color}:{color:string}){return <path d="M-44 9Q-52-15-29-19Q-19-47 7-31Q36-40 39-14Q63-5 47 20Q16 39-3 26Q-27 39-44 9Z" fill={color}/>}
