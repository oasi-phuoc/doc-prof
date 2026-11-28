import { pageAsConfig, pageBlocks, replacePageBlock } from '@/math/page-model'
import type { PageConfig } from '@/math/types'
import { currentLogistiquePublication, logistiquePublication } from './approved-banks'
import { isLogistiqueDomain, validLogistiqueCataloguePages } from './catalog'
import { generateLogistique, logistiqueHasSummary } from './generate'

export function validLogistiquePages(pages: readonly PageConfig[]): boolean {
  return validLogistiqueCataloguePages(pages) && pages.every((page) =>
    !isLogistiqueDomain(page.domain) || pageBlocks(page).every((block) =>
      logistiquePublication(block.logistiqueBankRevision) &&
      (block.logistiqueTheoryView !== 'resume' || logistiqueHasSummary(block.exerciseType, block.logistiqueBankRevision))),
  )
}

export function freezeLogistiquePages(pages: PageConfig[], evaluation = false): PageConfig[] {
  return pages.map((page) => {
    if (!isLogistiqueDomain(page.domain)) return page
    return pageBlocks(page).reduce<PageConfig>((current, block, index) => {
      const freezeStory = evaluation && block.logistiqueEvaluation?.mode === 'histoire' && block.libreItems === undefined
      if (block.logistiqueBankRevision && !freezeStory) return current
      const frozen = { ...block, logistiqueBankRevision: block.logistiqueBankRevision ?? currentLogistiquePublication.revision }
      if (freezeStory) frozen.libreItems = generateLogistique(pageAsConfig(page, frozen), 1).items
      return replacePageBlock(current, index, frozen)
    }, page)
  })
}
