import { hasAccessCookie } from '@/access'

export function pathFromLocation(): 'landing' | 'access' | 'generator' {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/generateur') return 'generator'
  if (path === '/acces') return 'access'
  return 'landing'
}

export function navigateTo(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
  }
}

export function resolveRoute(): 'landing' | 'access' | 'generator' {
  const initial = pathFromLocation()
  if (initial === 'generator' && !hasAccessCookie()) {
    if (typeof window !== 'undefined' && pathFromLocation() === 'generator') {
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
