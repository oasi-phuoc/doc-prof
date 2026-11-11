import { lazy, Suspense, useEffect, useState } from 'react'
import { readClassroomPreferences, type ClassroomPreferences } from './preferences'
import { loadLegacyPreferences } from './legacy-preferences'
import './interactive.css'
import './projection.css'
import './teacher-controls.css'

const DiagnosticPage = lazy(() => import('./DiagnosticPage'))
const CardsPage = lazy(() => import('./CardsPage'))
const GameApp = lazy(() => import('./GameApp'))
const CompetitionPage = lazy(() => import('./competition/CompetitionPage'))
export default function InteractiveApp() {
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
  if (/^\/interactif\/rejoindre(?:\/\d{6})?$/.test(path)) return <Suspense fallback={<p role="status">Chargement de la compétition…</p>}><CompetitionPage /></Suspense>
  if (/^\/interactif\/salle\/\d{6}$/.test(path)) return <Suspense fallback={<p role="status">Chargement de la salle…</p>}><CompetitionPage host /></Suspense>
  if (!loaded) return <p role="status">Chargement des réglages…</p>
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/cartes') return <Suspense fallback={<p role="status">Chargement des cartes…</p>}><CardsPage initial={loaded.preferences} initialWarning={loaded.warning} /></Suspense>
  if (window.location.pathname.replace(/\/+$/, '') === '/interactif/diagnostic') return <Suspense fallback={<p role="status">Chargement du diagnostic…</p>}><DiagnosticPage colors={loaded.preferences.colors} shapes={loaded.preferences.shapes} /></Suspense>
  return <Suspense fallback={<p role="status">Chargement de la séance…</p>}><GameApp initialPreferences={loaded.preferences} initialWarning={loaded.warning} /></Suspense>
}
