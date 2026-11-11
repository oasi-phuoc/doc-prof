import { hasAccessCookie } from '@/access'

export type AppRoute = 'landing' | 'access' | 'generator' | 'fiches' | 'interactive'

export function pathFromLocation(): AppRoute {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/interactif' || path.startsWith('/interactif/')) return 'interactive'
  if (path === '/generateur') return 'generator'
  if (path === '/fiches') return 'fiches'
  if (path === '/acces') return 'access'
  return 'landing'
}

export function navigateTo(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
}

export function resolveRoute(): AppRoute {
  const initial = pathFromLocation()
  const publicCompetition = /^\/interactif\/rejoindre(?:\/\d{6})?\/?$/.test(window.location.pathname)
  if ((initial === 'generator' || initial === 'fiches' || initial === 'interactive' && !publicCompetition) && !hasAccessCookie()) {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/acces')
    }
    return 'access'
  }
  if (initial === 'access' && hasAccessCookie()) {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/generateur')
    }
    return 'generator'
  }
  return initial
}
