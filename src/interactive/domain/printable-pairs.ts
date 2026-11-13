import type { MathItem } from '@/math/types'
import { createRng, shuffle } from '@/math/rng'
import type { Choice } from './types'
import { hash } from './seeds'

type Card = NonNullable<MathItem['gameBoard']>['cards'][number]
type Entry = {part:number; image:string; choices:Choice[]; correctId?:string; model:string; teacherLed:boolean}
type Result = {items:Entry[]; issues:string[]}
type Pair = {part:number; image:string; text:string}
const key=(value:string)=>value.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('fr')
const emptyWord=(value:unknown)=>value===undefined||typeof value==='string'&&(!value.trim()||/^…\d*$/.test(value.trim()))
const numbered=(card:Card)=>typeof card.badge==='string'&&/^[1-9]\d?$/.test(card.badge)

/** Read explicit printed pair numbers, never infer a word from an image filename. */
export function adaptPrintablePairs(
  items:MathItem[], exerciseType:string, seedFor:(item:number,part:number)=>number,
  displayedImage:(src:string)=>string=(src)=>src,
):Map<number,Result>|undefined {
  if(!['jeux-vocabulaire','jeux-memory'].includes(exerciseType))return undefined
  const indices=items.flatMap((item,index)=>item.layout==='card-grid'?[index]:[])
  if(!indices.length)return undefined
  const result=new Map(indices.map(index=>[index,{items:[],issues:[]} as Result]))
  const fail=(reason:string)=>{result.get(indices[0]!)!.issues.push(reason);return result}
  const kind=exerciseType==='jeux-memory'?'memory':'cards'
  if(indices.some(index=>{
    const item=items[index]!,board=item.gameBoard
    return item.libreError||item.answer?.trim()||item.prompt?.trim()||!board||board.kind!==kind||!['recto','verso'].includes(board.side??'')||
      !Number.isInteger(board.cols)||!Number.isInteger(board.rows)||board.cols<1||board.rows<1||board.cols*board.rows>400||
      !Array.isArray(board.cards)||board.cards.length<1||board.cards.length>64||board.cards.length>board.cols*board.rows||
      board.cards.some(card=>!card||typeof card.id!=='string'||!card.id.trim())||new Set(board.cards.map(card=>card.id)).size!==board.cards.length
  }))return fail('Les planches de paires sont absentes, non validées ou incohérentes. Vérifiez la fiche source.')
  const fronts=indices.filter(index=>items[index]!.gameBoard!.side==='recto')
  const backs=indices.filter(index=>items[index]!.gameBoard!.side==='verso')
  if(fronts.length!==1||backs.length>1||kind==='cards'&&backs.length!==1)return fail('Il faut un seul recto et son verso pour retrouver les paires image/mot.')
  const frontIndex=fronts[0]!,front=items[frontIndex]!.gameBoard!,output=result.get(frontIndex)!
  const images=front.cards.flatMap((card,part)=>card.variant==='image'?[{card,part}]:[])
  const words=kind==='cards'?items[backs[0]!]!.gameBoard!.cards:front.cards.filter(card=>card.variant==='word')
  if(kind==='cards'&&(images.length!==front.cards.length||words.some(card=>card.variant!=='word'))||
    kind==='memory'&&front.cards.some(card=>!['word','image'].includes(card.variant??'')))return fail('Cette planche contient des cartes qui ne sont pas des paires image/mot.')
  const activeWords=words.filter(card=>!(kind==='memory'&&card.badge===undefined&&emptyWord(card.text)))
  if(images.some(({card})=>!numbered(card))||activeWords.some(card=>!numbered(card))||
    new Set(images.map(({card})=>card.badge)).size!==images.length||new Set(activeWords.map(card=>card.badge)).size!==activeWords.length)
    return fail('Les numéros de paires sont absents ou répétés. Aucune association ne peut être choisie arbitrairement.')
  const imageNumbers=new Set(images.map(({card})=>card.badge))
  if(activeWords.some(card=>!imageNumbers.has(card.badge)))return fail('Un mot n’a pas de carte image portant le même numéro de paire.')
  const pairs:Pair[]=[]
  for(const {card,part} of images){
    const word=activeWords.find(word=>word.badge===card.badge)
    if(!word){output.issues.push(`Paire ${card.badge} : mot correspondant absent.`);continue}
    if(emptyWord(word.text)&&!card.imageSrc)continue // Empty padding added by the printable template.
    if(typeof word.text!=='string'||emptyWord(word.text)){output.issues.push(`Paire ${card.badge} : mot absent ou provisoire.`);continue}
    if(typeof card.imageSrc!=='string'||!card.imageSrc.trim()){output.issues.push(`Paire ${card.badge} : image absente.`);continue}
    const image=displayedImage(card.imageSrc)
    if(typeof image!=='string'||!image.trim()){output.issues.push(`Paire ${card.badge} : image remplacée absente.`);continue}
    pairs.push({part,image,text:word.text.trim()})
  }
  const pool=[...new Map(pairs.map(pair=>[key(pair.text),pair.text])).entries()].map(([identity,text])=>({identity,id:`pair-word-${hash(identity)}`,text}))
  if(new Set(pool.map(choice=>choice.id)).size!==pool.length)return fail('Les références des mots ne permettent pas de distinguer ces propositions.')
  if(!pairs.length&&!output.issues.length)output.issues.push('Aucune paire image/mot exploitable dans ces planches.')
  for(const pair of pairs){
    const models=[...new Map(pairs.filter(other=>other.image===pair.image).map(other=>[key(other.text),other.text])).values()]
    const teacherLed=models.length>1||pool.length<2
    const correct=pool.find(choice=>choice.identity===key(pair.text))!
    const rng=createRng(seedFor(frontIndex,pair.part))
    const choices=teacherLed?[]:shuffle(rng,[correct,...shuffle(rng,pool.filter(choice=>choice.id!==correct.id)).slice(0,5)]).map(({id,text})=>({id,text}))
    // Keep original paths here: convertRecipe applies image replacements exactly once.
    const original=images.find(({part})=>part===pair.part)!.card
    output.items.push({part:pair.part,image:original.imageSrc!,choices,...(teacherLed?{}:{correctId:correct.id}),model:models.join(' / '),teacherLed})
    if(teacherLed)output.issues.push(`Paire ${original.badge} : association à guider, car l’image admet plusieurs mots source ou qu’il manque une alternative.`)
  }
  if(pool.length>6)output.issues.push('Six mots source au maximum sont conservés par image, avec la réponse prévue par la paire.')
  return result
}
