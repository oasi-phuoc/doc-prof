const PAGE_BORDER_KEY = 'clairfle-page-border'

/** Préférence d’affichage, hors recette de fiche. Activée tant qu’elle n’a pas été retirée. */
export function readPageBorder(): boolean {
  try {
    return window.localStorage.getItem(PAGE_BORDER_KEY) !== '0'
  } catch (error) {
    console.warn('Impossible de lire le cadre de page.', error)
    return true
  }
}

export function storePageBorder(on: boolean) {
  try {
    window.localStorage.setItem(PAGE_BORDER_KEY, on ? '1' : '0')
  } catch (error) {
    console.warn('Impossible d’enregistrer le cadre de page.', error)
  }
}
