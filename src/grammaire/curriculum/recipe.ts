import { pageAsConfig, pageBlocks, setPageBlock } from '@/math/page-model'
import type { PageConfig } from '@/math/types'
import { generateGrammarSelection, grammarRequestKey, grammarSelectionCount, hasGrammarSettings } from './generate'
import { GRAMMAR_PRESENTATIONS, isProtectedGrammarCo } from './types'
import { isGrammarSnapshot } from './validation'

/** Freeze only explicitly graded blocks; leave legacy/CO/edited overlays intact. */
export function freezeGrammarPages(pages: PageConfig[], seed: number): PageConfig[] {
  return pages.map((page,pageIndex)=>{
    if (page.domain!=='grammaire') return page
    return pageBlocks(page).reduce<PageConfig>((result,block,blockIndex)=>{
      if (isProtectedGrammarCo(block.exerciseType) || !hasGrammarSettings(block)) return result
      const selection=generateGrammarSelection(pageAsConfig(page,block),seed+pageIndex*7919+blockIndex*10007+(block.contentSeed??0))
      return setPageBlock(result,blockIndex,{grammarSnapshot:selection})
    },page)
  })
}

export function validGrammarRecipePages(pages: PageConfig[], seed: number): boolean {
  return pages.every((page,pageIndex)=>page.domain!=='grammaire' || pageBlocks(page).every((block,blockIndex)=>{
    if (isProtectedGrammarCo(block.exerciseType)) return true
    if (!hasGrammarSettings(block) && !block.exerciseType.includes('-curriculum-')) return true
    if (!['A1','A2','B1'].includes(block.grammarLevel??'') || !block.grammarActivityId ||
      !(GRAMMAR_PRESENTATIONS as string[]).includes(block.grammarPresentation??'') || !block.grammarBankRevision ||
      typeof block.grammarBankRevision!=='string' || block.grammarActivityId!==block.exerciseType ||
      !Number.isSafeInteger(block.count) || block.count<1 || block.count>50 ||
      (block.grammarPreview!==undefined && typeof block.grammarPreview!=='boolean')) return false
    const count=grammarSelectionCount(block)
    if (!Number.isSafeInteger(count) || count<1 || count>(block.grammarPresentation==='document-set'?20:50)) return false
    const breaks=block.grammarPageBreakAfterQuestionIds
    if (breaks!==undefined && (!Array.isArray(breaks)||breaks.some(id=>typeof id!=='string'||!id.trim())||new Set(breaks).size!==breaks.length)) return false
    if (block.grammarSnapshot===undefined) return true
    return isGrammarSnapshot(block.grammarSnapshot) && block.grammarSnapshot.activityId===block.grammarActivityId &&
      block.grammarSnapshot.level===block.grammarLevel && block.grammarSnapshot.presentation===block.grammarPresentation &&
      block.grammarSnapshot.bankRevision===block.grammarBankRevision && block.grammarSnapshot.questions.length===count &&
      block.grammarSnapshot.requestKey===grammarRequestKey(block) &&
      block.grammarSnapshot.seed===seed+pageIndex*7919+blockIndex*10007+(block.contentSeed??0)
  }))
}
