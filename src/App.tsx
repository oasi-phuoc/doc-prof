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
import { LoadingScreen } from '@/components/LoadingScreen'

const InteractiveApp = lazy(() => import('@/interactive/InteractiveApp'))
const GeneratorPage = lazy(() => import('@/components/generator/GeneratorPage').then((module) => ({ default: module.GeneratorPage })))
const SavedFichesPage = lazy(() => import('@/components/generator/SavedFichesPage').then((module) => ({ default: module.SavedFichesPage })))
const ImageGalleryPage = lazy(() => import('@/gallery/ImageGalleryPage').then(module => ({ default: module.ImageGalleryPage })))
const AudioCatalogPage = lazy(() => import('@/audio-catalog/AudioCatalogPage').then(module => ({ default: module.AudioCatalogPage })))

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

  const path = window.location.pathname.replace(/\/+$/, '')
  const interactiveTitle = path === '/interactif/cartes' ? 'Préparation des cartes' : path === '/interactif/diagnostic' ? 'Ouverture du diagnostic' : path.startsWith('/interactif/rejoindre') ? 'Ouverture de la compétition' : path.startsWith('/interactif/salle/') ? 'Ouverture de la salle' : 'Préparation du jeu'
  if (route === 'interactive') return <Suspense fallback={<LoadingScreen title={interactiveTitle} description="Votre séance arrive…" />}><InteractiveApp key={navigationRevision} /></Suspense>
  if (route === 'fiches') {
    return <Suspense fallback={<LoadingScreen title="Ouverture des fiches" description="Votre bibliothèque se prépare." />}><SavedFichesPage onOpenGenerator={showGenerator} onLogout={logout} /></Suspense>
  }
  if (route === 'images') return <Suspense fallback={<LoadingScreen title="Ouverture de la galerie" description="Les images se préparent…" />}><ImageGalleryPage onOpenGenerator={showGenerator} onLogout={logout} /></Suspense>
  if (route === 'audios') return <Suspense fallback={<LoadingScreen title="Ouverture du catalogue audio" description="Les pistes et leurs documents se préparent…" />}><AudioCatalogPage onOpenGenerator={showGenerator} onLogout={logout}/></Suspense>
  if (route === 'generator') return <Suspense fallback={<LoadingScreen title="Ouverture du créateur de fiches" description="Votre espace de création arrive…" />}><GeneratorPage onLogout={logout} onOpenFiches={showFiches} /></Suspense>
  if (route === 'access') return <AccessPage onSuccess={openGenerator} />
  return <Landing onCreate={goAccess} />
}
