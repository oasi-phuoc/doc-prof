import {createRng,shuffle} from '@/math/rng'
import {canonicalJson,deriveSeed,hash} from './seeds'
import {positionOf} from './source-position'
import {matchingTextKey} from './matching'
import type {Game,Question,Session,LotoBoardData,LotoGoal} from './types'

/** Same source cells and letters throughout a board; the caller order has its own seed. */
export function lotoGame(game:Game,goal:LotoGoal):Game {
 const groups=new Map<string,Question[]>()
 for(const q of game.questions)if(q.source.exerciseType==='jeux-loto'&&q.matchingGroup)groups.set(q.matchingGroup.groupId,[...groups.get(q.matchingGroup.groupId)??[],q])
 const replacements=new Map<string,Question>(),queues=new Map<string,Question[]>(),issues=[...game.issues]
 for(const [groupId,source]of groups){
  const ordered=[...source].sort((a,b)=>a.source.part-b.source.part),first=ordered[0]!,cells=first.choices.map(({id,text})=>({id,text})),key=(q:Question)=>canonicalJson(q.choices.map(({id,text})=>({id,text})).sort((a,b)=>a.id.localeCompare(b.id)))
  const valid=source.length>=2&&source.length<=6&&cells.length===source.length&&new Set(cells.map(c=>c.id)).size===cells.length&&new Set(cells.map(c=>matchingTextKey(c.text))).size===cells.length&&cells.every(c=>c.text.trim()&&c.text.length<=24)&&new Set(source.map(q=>q.images[0])).size===source.length&&new Set(source.map(q=>game.corrections[q.id]?.choiceId)).size===source.length&&source.every(q=>q.mode==='choice'&&!q.audio&&q.images.length===1&&q.choices.every(c=>!c.image&&!c.audio)&&key(q)===key(first)&&cells.some(c=>c.id===game.corrections[q.id]?.choiceId))
  if(!valid){issues.push({source:first.title,reason:'Loto : la grille exige deux à six associations image–mot distinctes, vérifiées et à libellés courts. Les questions source sont conservées.'});continue}
  const board:LotoBoardData={groupId,number:first.matchingGroup!.number,total:first.matchingGroup!.total,columns:[2,4].includes(cells.length)?2:3,goal,sourceKeys:ordered.map(positionOf),cells}
  const converted=ordered.map(q=>({...q,prompt:'Retrouvez le mot.',instruction:'Retrouvez le mot de l’image. Une bonne réponse permet de cocher sa case.',choices:cells.map(c=>({...c})),choiceOrderPolicy:'fixed' as const,lotoBoard:board}))
  const draw=shuffle(createRng(deriveSeed({originalSeed:game.seed??hash(game.id),sourceKey:`loto:${groupId}`,purpose:'order'})),converted)
  for(const q of source)replacements.set(q.id,q)
  queues.set(groupId,draw)
 }
 if(!queues.size)return issues.length===game.issues.length?game:{...game,issues}
 const offsets=new Map<string,number>()
 return{...game,questions:game.questions.map(q=>{if(!replacements.has(q.id))return q;const id=q.matchingGroup!.groupId,index=offsets.get(id)??0;offsets.set(id,index+1);return queues.get(id)![index]!}),issues,...(game.rounds?{rounds:undefined}:{})}
}
export function lotoSelection(keys:string[],game:Game):string[] {
 const result=new Set(keys)
 for(const q of game.questions)if(q.lotoBoard&&q.lotoBoard.sourceKeys.some(key=>result.has(key)))q.lotoBoard.sourceKeys.forEach(key=>result.add(key))
 return [...result]
}
/** Keep all draws of a board together, including after custom ordering. */
export function lotoClusters(questions:Question[]):Question[][] {
 const units:Question[][]=[],groups=new Map<string,Question[]>()
 for(const q of questions){if(!q.lotoBoard){units.push([q]);continue}let group=groups.get(q.lotoBoard.groupId);if(!group){group=[];groups.set(q.lotoBoard.groupId,group);units.push(group)}group.push(q)}
 return units
}
export const lotoGoalLabel=(goal:LotoGoal)=>goal==='line'?'Une ligne':'Grille complète'
export function lotoGoalMet(board:LotoBoardData,marked:ReadonlySet<string>):boolean {
 if(board.goal==='board')return board.cells.every(cell=>marked.has(cell.id))
 for(let start=0;start<board.cells.length;start+=board.columns)if(board.cells.slice(start,start+board.columns).every(cell=>marked.has(cell.id)))return true
 return false
}
/** Only revealed answers and explicit teacher judgements can contribute. */
export function lotoProgress(game:Game,state:Session,q:Question){
 const marked=new Set<string>(),called=new Set<string>(),board=q.lotoBoard!
 for(const member of game.questions.filter(other=>other.lotoBoard?.groupId===board.groupId)){
  const attempt=state.history.find(a=>a.questionId===member.id),id=game.corrections[member.id]?.choiceId
  if(!id||!attempt||attempt.skipped)continue
  called.add(id)
  if(state.mode==='solo'?attempt.correct===true:state.teacherMarks[member.id]==='success')marked.add(id)
 }
 return{marked:[...marked],called:[...called],met:lotoGoalMet(board,marked)}
}
export function lotoSummary(game:Game,state:Session){
 const seen=new Set<string>()
 return game.questions.flatMap(q=>{if(!q.lotoBoard||seen.has(q.lotoBoard.groupId))return[];seen.add(q.lotoBoard.groupId);return[{...lotoProgress(game,state,q),groupId:q.lotoBoard.groupId,number:q.lotoBoard.number,total:q.lotoBoard.total,size:q.lotoBoard.cells.length,goal:q.lotoBoard.goal}]})
}
