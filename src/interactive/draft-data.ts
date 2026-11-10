import { parseFicheRecipe, type FicheRecipe } from '@/fiches/recipe'
export const INTERACTIVE_DRAFT_KEY = 'clairfleInteractive'
export type DraftData = { recipe: FicheRecipe; name: string }

export function parseInteractiveDraft(value: unknown): DraftData | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Record<string, unknown>
  const recipe = parseFicheRecipe(source.recipe)
  if (!recipe) return null
  if (source.temporaryImages && typeof source.temporaryImages === 'object') {
    const temporary = Object.fromEntries(Object.entries(source.temporaryImages).filter((entry): entry is [string, string] => typeof entry[1] === 'string' && (entry[1].startsWith('blob:') || entry[1].startsWith('data:image/'))))
    if (Object.keys(temporary).length) recipe.imageOverrides = { ...recipe.imageOverrides, ...temporary }
  }
  return { recipe, name: typeof source.name === 'string' ? source.name : 'Ma fiche' }
}

export function draftNavigationData(recipe: FicheRecipe, name: string) {
  const snapshot = structuredClone(recipe)
  return { recipe: snapshot, name, temporaryImages: Object.fromEntries(Object.entries(snapshot.imageOverrides ?? {}).filter(([, src]) => src.startsWith('blob:') || src.startsWith('data:image/'))) }
}
