const AUTHOR_KEY = 'clairfle-fiche-saved-by'

export function normalizeFicheAuthor(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 160) : ''
}

/** Le navigateur n’expose pas le nom de session du système d’exploitation. */
export function readFicheAuthor(): string {
  try { return normalizeFicheAuthor(window.localStorage.getItem(AUTHOR_KEY)) } catch { return '' }
}

export function rememberFicheAuthor(name: string) {
  try { window.localStorage.setItem(AUTHOR_KEY, normalizeFicheAuthor(name)) } catch { /* Stockage privé ou désactivé. */ }
}
