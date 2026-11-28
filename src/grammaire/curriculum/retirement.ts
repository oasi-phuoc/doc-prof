import subthemes from './retired-subthemes.json'
import {isGrammarOralVisualType} from '../exercises/communication'
import {isWordVocabType} from '../exercises/word-vocab'
import {isProtectedGrammarCo} from './types'

/** Historical written banks replaced by the graded base, per owner instruction. */
export function isRetiredGrammarType(typeId:string):boolean {
  if (typeId==='gram-ex-a3-nat-co') return true
  if (isProtectedGrammarCo(typeId)||isWordVocabType(typeId)||isGrammarOralVisualType(typeId)) return false
  return subthemes.some(sub=>typeId.startsWith(`gram-ex-${sub}-`))
}
export function hasRetiredGrammarRecipe(value:unknown):boolean {
  if(!value||typeof value!=='object')return false
  const recipe=value as {pages?:unknown;libreSnapshot?:unknown}
  return [recipe.pages,recipe.libreSnapshot].some(pages=>Array.isArray(pages)&&pages.some(page=>{
    if(!page||page.domain!=='grammaire')return false
    return [page,...(Array.isArray(page.extraBlocks)?page.extraBlocks:[])].some(block=>typeof block?.exerciseType==='string'&&isRetiredGrammarType(block.exerciseType)&&!block.grammarLevel)
  }))
}
