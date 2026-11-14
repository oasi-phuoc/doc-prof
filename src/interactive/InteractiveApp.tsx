import { lazy, Suspense, useEffect, useState } from 'react'
import { readClassroomPreferences, type ClassroomPreferences } from './preferences'
import { loadLegacyPreferences } from './legacy-preferences'
import './interactive.css'
import './projection.css'
import './teacher-controls.css'
import { LoadingScreen } from '@/components/LoadingScreen'

const DiagnosticPage = lazy(() => import('./DiagnosticPage'))
const CardsPage = lazy(() => import('./CardsPage'))
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
  const path = window.location.pathname.replace(/\/+$/, '')
  if (/^\/interactif\/rejoindre(?:\/\d{6})?$/.test(path)) return <Suspense fallback={<LoadingScreen title="Ouverture de la compétition" />}><CompetitionPage /></Suspense>
  if (/^\/interactif\/salle\/\d{6}$/.test(path)) return <Suspense fallback={<LoadingScreen title="Ouverture de la salle" />}><CompetitionPage host /></Suspense>
  if (!loaded) return <LoadingScreen title="Préparation du jeu" description="Votre séance arrive…" />
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/cartes') return <Suspense fallback={<LoadingScreen title="Préparation des cartes" />}><CardsPage initial={loaded.preferences} initialWarning={loaded.warning} /></Suspense>
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/diagnostic') return <Suspense fallback={<LoadingScreen title="Ouverture du diagnostic" />}><DiagnosticPage colors={loaded.preferences.colors} shapes={loaded.preferences.shapes} /></Suspense>
  return <Suspense fallback={<LoadingScreen title="Préparation de la séance" />}><GameApp initialPreferences={loaded.preferences} initialWarning={loaded.warning} /></Suspense>
}
