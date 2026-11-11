import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import {
  clearAccessAccount,
  hasAccessCookie,
  writeAccessAccount,
  type AccessAccount,
} from '@/access'
import { clearAccessPassword } from '@/fiches/password'
import { AccessPage } from '@/components/generator/AccessPage'
import { Landing } from '@/components/generator/Landing'
import { navigateTo, resolveRoute } from '@/components/generator/routing'

const InteractiveApp = lazy(() => import('@/interactive/InteractiveApp'))
const GeneratorPage = lazy(() => import('@/components/generator/GeneratorPage').then((module) => ({ default: module.GeneratorPage })))
const SavedFichesPage = lazy(() => import('@/components/generator/SavedFichesPage').then((module) => ({ default: module.SavedFichesPage })))

export default function App() {
  const [route, setRoute] = useState(resolveRoute)
  const [navigationRevision, setNavigationRevision] = useState(0)

  useEffect(() => {
    const sync = () => {
      setRoute(resolveRoute())
      setNavigationRevision(value => value + 1)
    }
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const goAccess = () => {
    if (hasAccessCookie()) {
      navigateTo('/generateur')
      setRoute('generator')
      return
    }
    navigateTo('/acces')
    setRoute('access')
  }

  const openGenerator = (account: AccessAccount) => {
    writeAccessAccount(account)
    navigateTo('/generateur')
    setRoute('generator')
  }

  const showGenerator = () => {
    navigateTo('/generateur')
    setRoute('generator')
  }

  const showFiches = () => {
    navigateTo('/fiches')
    setRoute('fiches')
  }

  const logout = () => {
    clearAccessAccount()
    clearAccessPassword()
    navigateTo('/acces')
    setRoute('access')
  }

  if (route === 'interactive') return <Suspense fallback={<p role="status">Chargement du studio…</p>}><InteractiveApp key={navigationRevision} /></Suspense>
  if (route === 'fiches') {
    return <Suspense fallback={<p role="status">Chargement des fiches…</p>}><SavedFichesPage onOpenGenerator={showGenerator} onLogout={logout} /></Suspense>
  }
  if (route === 'generator') return <Suspense fallback={<p role="status">Chargement des fiches…</p>}><GeneratorPage onLogout={logout} onOpenFiches={showFiches} /></Suspense>
  if (route === 'access') return <AccessPage onSuccess={openGenerator} />
  return <Landing onCreate={goAccess} />
}
