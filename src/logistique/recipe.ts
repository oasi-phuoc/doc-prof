import { pageBlocks, replacePageBlock } from '@/math/page-model'
import type { PageConfig } from '@/math/types'
import { currentLogistiquePublication, logistiquePublication } from './approved-banks'
import { isLogistiqueDomain, validLogistiqueCataloguePages } from './catalog'

export function validLogistiquePages(pages: readonly PageConfig[]): boolean {
  return validLogistiqueCataloguePages(pages) && pages.every((page) =>
    !isLogistiqueDomain(page.domain) || pageBlocks(page).every((block) => logistiquePublication(block.logistiqueBankRevision)),
  )
}

export function freezeLogistiquePages(pages: PageConfig[]): PageConfig[] {
  return pages.map((page) => {
    if (!isLogistiqueDomain(page.domain)) return page
    return pageBlocks(page).reduce<PageConfig>((current, block, index) => block.logistiqueBankRevision
      ? current
      : replacePageBlock(current, index, { ...block, logistiqueBankRevision: currentLogistiquePublication.revision }),
    page)
  })
}
