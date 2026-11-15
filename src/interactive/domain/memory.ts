import type {Game,Question,PlayMode,MemoryRuntime} from './types'

export const MAX_MEMORY_TURNS=1000
export const emptyMemory=():MemoryRuntime=>({open:[],found:[],turns:0,misses:0,checked:false})
export const copyMemory=(value:MemoryRuntime):MemoryRuntime=>({...value,open:[...value.open],found:[...value.found]})
export const copyMemoryBoards=(value:Record<string,MemoryRuntime>)=>Object.fromEntries(Object.entries(value).map(([id,board])=>[id,copyMemory(board)]))
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value)

/** The verified pair key is private. Card IDs carry positions, never pair IDs. */
export function validMemoryQuestion(game:Game,q:Question):boolean {
 const board=q.memoryBoard,pairs=game.corrections[q.id]?.memoryPairs
 if(q.mode!=='memory'||!board||q.choices.length||!Array.isArray(board.cards)||![4,6].includes(board.cards.length)||!Array.isArray(pairs)||pairs.length*2!==board.cards.length||!Array.isArray(board.sourceKeys)||board.sourceKeys.length!==pairs.length||new Set(board.sourceKeys).size!==pairs.length||!board.sourceKeys.every(key=>/^\d+:\d+:\d+:\d+$/.test(key))||!Number.isInteger(board.group)||!Number.isInteger(board.total)||board.group<1||board.group>board.total||board.total>64)return false
 if(board.cards.some(card=>!object(card)||typeof card.id!=='string'||!card.id||card.id.length>120||Object.keys(card).length!==2||!Object.keys(card).every(key=>['id','text','image'].includes(key))||(typeof card.image==='string'?card.text!==undefined||!q.images.includes(card.image):typeof card.text!=='string'||!card.text.trim()||card.text.length>120)))return false
 const ids=new Set(board.cards.map(card=>card.id))
 if(ids.size!==board.cards.length)return false
 const covered=new Set<string>()
 for(const pair of pairs){if(!Array.isArray(pair)||pair.length!==2||pair.some(id=>!ids.has(id)||covered.has(id))||pair[0]===pair[1])return false;const a=board.cards.find(card=>card.id===pair[0])!,b=board.cards.find(card=>card.id===pair[1])!;if(!!a.image===!!b.image)return false;pair.forEach(id=>covered.add(id))}
 return covered.size===board.cards.length&&q.images.length===pairs.length&&new Set(q.images).size===pairs.length
}
export function validMemoryRuntime(game:Game,q:Question,value:unknown,mode:PlayMode):value is MemoryRuntime {
 if(!validMemoryQuestion(game,q)||!object(value)||Object.keys(value).length!==5||!Object.keys(value).every(key=>['open','found','turns','misses','checked'].includes(key))||!Array.isArray(value.open)||!Array.isArray(value.found)||value.open.length>2||value.found.length>q.memoryBoard!.cards.length||typeof value.checked!=='boolean'||!Number.isInteger(value.turns)||Number(value.turns)<0||Number(value.turns)>MAX_MEMORY_TURNS||!Number.isInteger(value.misses)||Number(value.misses)<0||Number(value.misses)>Number(value.turns))return false
 const open=value.open as string[],found=value.found as string[],ids=q.memoryBoard!.cards.map(card=>card.id),all=[...open,...found]
 if(new Set(all).size!==all.length||!all.every(id=>typeof id==='string'&&ids.includes(id))||found.length%2||Number(value.turns)!==found.length/2+Number(value.misses))return false
 const pairs=game.corrections[q.id]!.memoryPairs!
 if(pairs.some(([a,b])=>found.includes(a)!==found.includes(b)))return false
 if(value.checked)return open.length===2&&Number(value.misses)>0&&!pairs.some(([a,b])=>open.includes(a)&&open.includes(b))
 return open.length<2||mode==='class'
}
export const memoryComplete=(q:Question,board:MemoryRuntime|undefined)=>q.mode==='memory'&&!!q.memoryBoard&&board?.found.length===q.memoryBoard.cards.length
export function checkMemoryPair(game:Game,q:Question,board:MemoryRuntime):MemoryRuntime {
 if(board.open.length!==2||board.checked||board.turns>=MAX_MEMORY_TURNS)return board
 const matched=game.corrections[q.id]?.memoryPairs?.some(([a,b])=>board.open.includes(a)&&board.open.includes(b))
 return matched?{...board,open:[],found:[...board.found,...board.open],turns:board.turns+1,checked:false}:{...board,turns:board.turns+1,misses:board.misses+1,checked:true}
}
export function flipMemoryCard(game:Game,q:Question,board:MemoryRuntime,cardId:string,mode:PlayMode):MemoryRuntime {
 if(!validMemoryQuestion(game,q)||!q.memoryBoard!.cards.some(card=>card.id===cardId)||board.found.includes(cardId)||board.turns>=MAX_MEMORY_TURNS||board.open.length===2&&!board.checked)return board
 const open=board.open.length===2?[]:board.open
 if(open.includes(cardId))return board
 const next={...board,open:[...open,cardId],checked:false}
 return mode==='solo'&&next.open.length===2?checkMemoryPair(game,q,next):next
}
