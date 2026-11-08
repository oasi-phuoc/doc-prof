import { parseFicheRecipe, type FicheRecipe } from '@/fiches/recipe'

const KEY = 'clairfleInteractive'
export function openInteractive(
  recipe: FicheRecipe,
  name: string,
  id?: string,
) {
  window.history.pushState(
    {
      [KEY]: {
        recipe,
        name,
        temporaryImages: Object.fromEntries(
          Object.entries(recipe.imageOverrides ?? {}).filter(
            ([, src]) =>
              src.startsWith('blob:') || src.startsWith('data:image/'),
          ),
        ),
      },
    },
    '',
    id ? `/interactif/${encodeURIComponent(id)}` : '/interactif',
  )
  window.dispatchEvent(new PopStateEvent('popstate'))
}
export function readInteractiveDraft(): {
  recipe: FicheRecipe
  name: string
} | null {
  return parseInteractiveDraft(window.history.state?.[KEY])
}

export function parseInteractiveDraft(
  value: unknown,
): { recipe: FicheRecipe; name: string } | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Record<string, unknown>
  const recipe = parseFicheRecipe(source.recipe)
  if (!recipe) return null
  // Uploaded images remain transient navigation data, outside the saved v1 recipe contract.
  if (source.temporaryImages && typeof source.temporaryImages === 'object') {
    const temporary = Object.fromEntries(
      Object.entries(source.temporaryImages).filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === 'string' &&
          (entry[1].startsWith('blob:') || entry[1].startsWith('data:image/')),
      ),
    )
    if (Object.keys(temporary).length)
      recipe.imageOverrides = { ...recipe.imageOverrides, ...temporary }
  }
  return {
    recipe,
    name: typeof source.name === 'string' ? source.name : 'Ma fiche',
  }
}
