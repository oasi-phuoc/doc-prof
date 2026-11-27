import { lazy, Suspense, useEffect, useState } from 'react'
import { readClassroomPreferences, type ClassroomPreferences } from './preferences'
import { loadLegacyPreferences } from './legacy-preferences'
import { DisplayThemeProvider } from './display-theme'
import './interactive.css'
import './projection.css'
import './teacher-controls.css'
import { LoadingScreen } from '@/components/LoadingScreen'
import {INTERACTIVE_DRAFT_KEY} from './draft-key'

const DiagnosticPage = lazy(() => import('./DiagnosticPage'))
const CardsPage = lazy(() => import('./CardsPage'))
const PoolPage=lazy(()=>import('./pools/PoolPage'))
const GameApp = lazy(() => import('./GameApp'))
const CompetitionPage = lazy(() => import('./competition/CompetitionPage'))
const TeacherConsolePage = lazy(() => import('./teacher-console/TeacherConsolePage'))
export default function InteractiveApp() {
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/console') return <Suspense fallback={<LoadingScreen title="Ouverture de la console enseignant" />}><TeacherConsolePage /></Suspense>
  return <InteractiveRoutes />
}
function InteractiveRoutes() {
  const [loaded, setLoaded] = useState<{ preferences: ClassroomPreferences; warning: string } | null>(null)
  useEffect(() => {
    let active = true
    const legacy = loadLegacyPreferences()
    void readClassroomPreferences(legacy).then(
      (preferences) => { if (active) setLoaded({ preferences, warning: '' }) },
      (error: unknown) => { if (active) setLoaded({ preferences: legacy, warning: error instanceof Error ? error.message : 'Réglages locaux indisponibles.' }) },
    )
    return () => { active = false }
  }, [])
  if (!loaded) return <LoadingScreen title="Préparation du jeu" description="Votre séance arrive…" />
  const path = window.location.pathname.replace(/\/+$/, '')
  return <DisplayThemeProvider preferences={loaded.preferences}><InteractiveRoute path={path} loaded={loaded} /></DisplayThemeProvider>
}

function InteractiveRoute({ path, loaded }: { path: string; loaded: { preferences: ClassroomPreferences; warning: string } }) {
  if (/^\/interactif\/rejoindre(?:\/\d{6})?$/.test(path)) return <Suspense fallback={<LoadingScreen title="Ouverture de la compétition" />}><CompetitionPage /></Suspense>
  if (/^\/interactif\/salle\/\d{6}$/.test(path)) return <Suspense fallback={<LoadingScreen title="Ouverture de la salle" />}><CompetitionPage host /></Suspense>
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/cartes') return <Suspense fallback={<LoadingScreen title="Préparation des cartes" />}><CardsPage initial={loaded.preferences} initialWarning={loaded.warning} /></Suspense>
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/diagnostic') return <Suspense fallback={<LoadingScreen title="Ouverture du diagnostic" />}><DiagnosticPage colors={loaded.preferences.colors} shapes={loaded.preferences.shapes} /></Suspense>
  if(path==='/interactif'&&!new URLSearchParams(window.location.search).has('pool')&&!new URLSearchParams(window.location.search).has('d')&&!window.history.state?.[INTERACTIVE_DRAFT_KEY])return <Suspense fallback={<LoadingScreen title="Choix des exercices" />}><PoolPage initialPreferences={loaded.preferences} initialWarning={loaded.warning}/></Suspense>
  return <Suspense fallback={<LoadingScreen title="Préparation de la séance" />}><GameApp initialPreferences={loaded.preferences} initialWarning={loaded.warning} /></Suspense>
}
