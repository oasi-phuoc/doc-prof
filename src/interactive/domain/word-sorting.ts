import {PHRASE_CATEGORY_LABELS} from '@/francais/phrase-banks'
import {canonicalJson} from './seeds'
import {positionOf} from './source-position'
import type {Game,Question,WordSorting} from './types'

const groupKey=(q:Question)=>[q.source.page,q.source.block,q.source.item,q.source.exerciseType].join(':')
/** Only word-by-word grammar classification has an alternate column format.
 * Whole association problems already use their complete source unit. */
export const canSwitchWordSorting=(q:Question)=>!!q.wordClassification||!!q.wordSorting?.categories.length&&q.wordSorting.categories.every(category=>category.id.startsWith('category-'))
export function sortingSentence(sentence:WordSorting['sentence']):string {
  return (sentence.prefix??'')+sentence.tokens.map((word,index)=>(sentence.joins?.[index]||(index>0&&!/[’']$/.test(sentence.tokens[index-1]!)?' ':''))+word).join('')+(sentence.ending??'.')
}

export function validWordPlacements(question:Question,raw:unknown):raw is (string|null)[] {
  return question.mode==='sorting'&&!!question.wordSorting&&Array.isArray(raw)&&raw.length===question.wordSorting.sentence.tokens.length&&Array.from(raw).every(category=>category===null||typeof category==='string'&&question.wordSorting!.categories.some(entry=>entry.id===category))
}

/** A presentation change keeps the selected phrases and their source positions. */
export function sortingSelection(keys:string[],questions:Question[],enabled:boolean):string[] {
  const result:string[]=[]
  for(const key of keys){
    const q=questions.find(q=>positionOf(q)===key)
    if(enabled&&q?.wordClassification)result.push([q.source.page,q.source.block,q.source.item,0].join(':'))
    else if(!enabled&&q?.wordSorting&&canSwitchWordSorting(q))for(let part=0;part<q.wordSorting.sentence.tokens.length;part++)result.push([q.source.page,q.source.block,q.source.item,part].join(':'))
    else result.push(key)
  }
  return [...new Set(result)]
}

/** Consolidate a complete verified source phrase, never infer tags from words. */
export function wordSortingGame(game:Game):Game {
  const groups=new Map<string,Question[]>()
  for(const q of game.questions)if(q.wordClassification)groups.set(groupKey(q),[...groups.get(groupKey(q))??[],q])
  if(!groups.size)return game
  const replacements=new Map<string,Question>(),removed=new Set<string>(),corrections={...game.corrections},issues=[...game.issues]
  for(const group of groups.values()){
    const sorted=[...group].sort((a,b)=>a.wordClassification!.target-b.wordClassification!.target),first=sorted[0]!,{target:_,...sentence}=first.wordClassification!
    const categories=sorted.map(q=>game.corrections[q.id]?.classificationCategory)
    const valid=sorted.length===sentence.tokens.length&&sorted.every((q,index)=>{
      const c=categories[index],{target,...other}=q.wordClassification!
      const label=c&&PHRASE_CATEGORY_LABELS[c.id.replace(/^category-/,'') as keyof typeof PHRASE_CATEGORY_LABELS]
      return target===index&&q.source.part===index&&canonicalJson(sentence)===canonicalJson(other)&&!!c&&label===c.label&&game.corrections[q.id]!.text.includes(` → ${c.label}\nPhrase : `)&&(!game.corrections[q.id]!.choiceId||game.corrections[q.id]!.choiceId===c.id&&q.choices.some(choice=>choice.id===c.id&&choice.text===c.label))
    })
    if(!valid){issues.push({source:first.title,reason:'Tri en colonnes : la phrase doit conserver tous ses éléments et leurs catégories vérifiées. Les questions mot par mot sont conservées.'});continue}
    const unique=new Map(categories.map(c=>[c!.id,c!]))
    const ordered=Object.keys(PHRASE_CATEGORY_LABELS).flatMap(category=>{const c=unique.get(`category-${category}`);return c?[{...c}]:[]})
    const q:Question={...first,prompt:'Trie les mots.',instruction:'Glissez chaque élément dans sa catégorie, ou choisissez un mot puis une catégorie. Les numéros renvoient à sa place dans la phrase.',mode:'sorting',compatibility:'teacher-led',choices:[],wordSorting:{sentence:{...sentence,tokens:[...sentence.tokens],...(sentence.joins?{joins:[...sentence.joins]}:{})},categories:ordered}}
    delete q.wordClassification;delete q.choiceOrderPolicy
    replacements.set(first.id,q)
    for(const old of sorted){removed.add(old.id);delete corrections[old.id]}
    corrections[q.id]={text:`Phrase : ${sortingSentence(sentence)}\n\n`+sentence.tokens.map((word,index)=>`${index+1}. ${word} → ${categories[index]!.label}`).join('\n'),sortingTargets:categories.map(category=>category!.id)}
  }
  return {...game,questions:game.questions.flatMap(q=>replacements.has(q.id)?[replacements.get(q.id)!]:removed.has(q.id)?[]:[q]),corrections,issues,...(game.rounds?{rounds:undefined}:{})}
}
