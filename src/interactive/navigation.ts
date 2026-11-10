import type { FicheRecipe } from '@/fiches/recipe'
import { INTERACTIVE_DRAFT_KEY as KEY, draftNavigationData, parseInteractiveDraft } from './draft-data'
import { createLocalDraft } from './drafts'
export { parseInteractiveDraft } from './draft-data'

export async function openInteractive(
  recipe: FicheRecipe,
  name: string,
  id?: string,
) {
  const data = draftNavigationData(recipe, name)
  let path = id ? `/interactif/${encodeURIComponent(id)}` : '/interactif'
  let warning = ''
  if (!id) {
    try { path = `/interactif?d=${await createLocalDraft(data.recipe, data.name)}` }
    catch { warning = 'Ce brouillon reste dans cet onglet : son enregistrement local est indisponible. Le jeu peut continuer.' }
  }
  window.history.pushState(
    {
      [KEY]: { ...data, warning },
    },
    '',
    path,
  )
  window.dispatchEvent(new PopStateEvent('popstate'))
}
export function readInteractiveDraft(): {
  recipe: FicheRecipe
  name: string
} | null {
  return parseInteractiveDraft(window.history.state?.[KEY])
}

export function readDraftWarning(): string {
  const value: unknown = window.history.state?.[KEY]?.warning
  return typeof value === 'string' ? value : ''
}
