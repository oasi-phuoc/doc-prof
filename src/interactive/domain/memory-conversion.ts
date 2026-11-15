import {createRng,shuffle} from '@/math/rng'
import {deriveSeed,hash} from './seeds'
import {positionOf} from './source-position'
import {matchingTextKey} from './matching'
import type {Game,Question,MemoryCard} from './types'

const family=(q:Question)=>['jeux-memory','jeux-vocabulaire'].includes(q.source.exerciseType)
const groupKey=(q:Question)=>[q.source.page,q.source.block,q.source.item,q.source.exerciseType].join(':')
/** Balanced groups keep four to six A–F positions, without dropping a pair. */
export function memoryGame(game:Game):Game {
 const groups=new Map<string,Question[]>()
 for(const q of game.questions)if(family(q)&&!q.memoryBoard)groups.set(groupKey(q),[...groups.get(groupKey(q))??[],q])
 const replacements=new Map<string,Question>(),removed=new Set<string>(),corrections={...game.corrections},issues=[...game.issues]
 for(const [key,source]of groups){
  const sorted=[...source].sort((a,b)=>a.source.part-b.source.part),words=sorted.map(q=>q.choices.find(c=>c.id===game.corrections[q.id]?.choiceId)?.text)
  const valid=sorted.length>=2&&sorted.length<=64&&sorted.every((q,index)=>q.mode==='choice'&&q.images.length===1&&!!q.matchingGroup&&typeof words[index]==='string'&&!!words[index]!.trim()&&words[index]!.length<=120)&&new Set(sorted.map(q=>q.images[0])).size===sorted.length&&new Set(words.map(word=>typeof word==='string'?matchingTextKey(word):'')).size===sorted.length
  if(!valid){issues.push({source:sorted[0]!.title,reason:'Mémory : il faut au moins deux associations image–mot distinctes et vérifiées, avec des mots courts. Les questions source sont conservées.'});continue}
  const total=Math.ceil(sorted.length/3),base=Math.floor(sorted.length/total),extra=sorted.length%total;let from=0
  for(let group=0;group<total;group++){
   const size=base+(group<extra?1:0),members=sorted.slice(from,from+size),seed=deriveSeed({originalSeed:game.seed??hash(game.id),sourceKey:`memory:${key}:${group}`,purpose:'order'})
   const shuffled=shuffle(createRng(seed),members.flatMap((q,index)=>[{pair:index,image:q.images[0]!},{pair:index,text:words[from+index]!}]))
   const cards:MemoryCard[]=shuffled.map((card,index)=>({id:`m-${hash(`${key}:${seed}`)}-${index}`,...('image'in card?{image:card.image}:{text:card.text})}))
   const pairs=members.map((_,index)=>shuffled.flatMap((card,slot)=>card.pair===index?[cards[slot]!.id]:[]) as [string,string])
   const first=members[0]!,q:Question={...first,id:first.id+'-memory',mode:'memory',prompt:'Retrouvez les paires.',instruction:'Retournez deux cartes pour associer une image et son mot.',images:members.map(member=>member.images[0]!),choices:[],compatibility:'assisted',memoryBoard:{cards,sourceKeys:members.map(positionOf),group:group+1,total}}
   delete q.matchingGroup;delete q.choiceOrderPolicy
   replacements.set(first.id,q);for(const old of members){removed.add(old.id);delete corrections[old.id]}
   corrections[q.id]={text:`Paires à retrouver : ${words.slice(from,from+size).join(' ; ')}.`,memoryPairs:pairs};from+=size
  }
 }
 if(!replacements.size)return issues.length===game.issues.length?game:{...game,issues}
 return{...game,questions:game.questions.flatMap(q=>replacements.has(q.id)?[replacements.get(q.id)!]:removed.has(q.id)?[]:[q]),corrections,issues,...(game.rounds?{rounds:undefined}:{})}
}
export function memorySelection(keys:string[],game:Game,enabled:boolean):string[] {
 const boards=(enabled?memoryGame(game):game).questions.filter(q=>q.memoryBoard),result=new Set<string>()
 for(const key of keys){const board=boards.find(q=>enabled?q.memoryBoard!.sourceKeys.includes(key):positionOf(q)===key);if(board){if(enabled)result.add(positionOf(board));else board.memoryBoard!.sourceKeys.forEach(source=>result.add(source))}else result.add(key)}
 return [...result]
}
export function memoryAttempt(q:Question,seed:number,attempt:number):Question {
 if(!q.memoryBoard||attempt===0)return q
 const cards=shuffle(createRng(deriveSeed({originalSeed:seed,sourceKey:q.id,purpose:'replay',attempt})),q.memoryBoard.cards)
 if(cards.every((card,index)=>card.id===q.memoryBoard!.cards[index]!.id))cards.push(cards.shift()!)
 return{...q,memoryBoard:{...q.memoryBoard,cards}}
}
