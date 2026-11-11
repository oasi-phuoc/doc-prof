export type ProbeState = 'non testé' | 'disponible' | 'indisponible' | 'refusé'
export type StorageProbe = { state: ProbeState; quota?: number; usage?: number }
export type RuntimeInfo = {
  capturedAt: string
  userAgent: string
  screen: string
  viewport: string
  pixels: number
  touchPoints: number
  pointer: string
  hover: boolean
  online: boolean
  secure: boolean
  reducedMotion: boolean
  contrast: string
  features: Record<string, boolean>
}
export type DiagnosticReport = {
  runtime: RuntimeInfo
  storage: StorageProbe
  audio: string
  fullscreen: string
  wakeLock: string
  fonts: string
  latencies: number[]
  pointers: string[]
  maxContacts: number
  colors: string[]
}
export function collectRuntime(): RuntimeInfo {
  return {
    capturedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: `${screen.width} × ${screen.height}`,
    viewport: `${innerWidth} × ${innerHeight}`,
    pixels: devicePixelRatio,
    touchPoints: navigator.maxTouchPoints ?? 0,
    pointer: matchMedia('(pointer: coarse)').matches ? 'grossier / tactile' : matchMedia('(pointer: fine)').matches ? 'fin / souris' : 'aucun',
    hover: matchMedia('(hover: hover)').matches,
    online: navigator.onLine,
    secure: isSecureContext,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    contrast: matchMedia('(prefers-contrast: more)').matches ? 'élevé' : matchMedia('(prefers-contrast: less)').matches ? 'réduit' : 'standard',
    features: {
      'Plein écran': !!document.documentElement.requestFullscreen && document.fullscreenEnabled,
      'Maintien éveillé': 'wakeLock' in navigator,
      'BroadcastChannel': typeof BroadcastChannel !== 'undefined',
      'Verrou entre onglets': 'locks' in navigator,
      'IndexedDB': typeof indexedDB !== 'undefined',
      'Container queries': typeof CSS !== 'undefined' && CSS.supports('container-type', 'inline-size'),
      'Identifiants UUID': typeof crypto?.randomUUID === 'function',
    },
  }
}
export function summarizeLatencies(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value) && value >= 0)
  if (!valid.length) return null
  const sorted = [...valid].sort((a, b) => a - b)
  return { count: valid.length, mean: valid.reduce((sum, value) => sum + value, 0) / valid.length, max: sorted[sorted.length - 1]!, p95: sorted[Math.ceil(sorted.length * .95) - 1]! }
}
export function formatDiagnostic(report: DiagnosticReport): string {
  const yes = (value: boolean) => value ? 'oui' : 'non'
  const timing = summarizeLatencies(report.latencies)
  return [
    '# Diagnostic ClairFLE — navigateur et écran',
    '',
    'Ce rapport décrit cet appareil. Il ne prouve pas une validation sur un ENI physique.',
    `Date UTC : ${report.runtime.capturedAt}`,
    `Navigateur : ${report.runtime.userAgent}`,
    `Écran : ${report.runtime.screen} ; fenêtre : ${report.runtime.viewport} ; pixels : ${report.runtime.pixels}`,
    `Contexte sécurisé : ${yes(report.runtime.secure)}`,
    `Connexion déclarée par le navigateur : ${report.runtime.online ? 'en ligne' : 'hors ligne'}`,
    `Points tactiles déclarés : ${report.runtime.touchPoints}`,
    `Pointeur principal : ${report.runtime.pointer} ; survol : ${yes(report.runtime.hover)}`,
    `Pointeurs observés : ${report.pointers.join(', ') || 'non testé'}`,
    `Contacts simultanés observés : ${report.maxContacts || 'non testé'}`,
    `Préférence réduction du mouvement : ${yes(report.runtime.reducedMotion)} ; contraste : ${report.runtime.contrast}`,
    '',
    '## Fonctionnalités déclarées',
    ...Object.entries(report.runtime.features).map(([name, supported]) => `- ${name} : ${supported ? 'API présente' : 'API absente'}`),
    '',
    '## Vérifications effectuées',
    `Stockage local (écriture et lecture) : ${report.storage.state}`,
    `Quota estimé : ${report.storage.quota ?? 'indisponible'} octets ; utilisation estimée : ${report.storage.usage ?? 'indisponible'} octets`,
    `Son après un geste : ${report.audio}`,
    `Plein écran : ${report.fullscreen}`,
    `Maintien éveillé : ${report.wakeLock}`,
    `Polices : ${report.fonts} ; espaces U+202F / U+00A0 et chiffres : contrôle visuel à effectuer`,
    `Délai pointeur → prochaine image (indicatif) : ${timing ? `${timing.count}/10 mesures ; moyenne ${timing.mean.toFixed(1)} ms ; maximum ${timing.max.toFixed(1)} ms ; p95 ${timing.p95.toFixed(1)} ms` : 'non testé'}`,
    `Mesures brutes (ms) : ${report.latencies.map((value) => value.toFixed(1)).join(', ') || 'aucune'}`,
    `Aplats A–F utilisés : ${report.colors.join(', ')}`,
    '',
    'Les capacités déclarées ne prouvent pas que les gestes, les couleurs ou le son conviennent à la classe. Vérifier sur le matériel réel.',
  ].join('\n')
}

/** A temporary isolated database; never read or clear the teacher's sessions. */
export async function probeStorage(): Promise<StorageProbe> {
  const name = `clairfle-diagnostic-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const state = await new Promise<ProbeState>((resolve) => {
    let db: IDBDatabase | undefined
    let settled = false
    const finish = (value: ProbeState) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      db?.close()
      try { indexedDB.deleteDatabase(name) } catch { /* Nothing else is stored here. */ }
      resolve(value)
    }
    const timeout = setTimeout(() => finish('indisponible'), 2500)
    try {
      const opening = indexedDB.open(name, 1)
      opening.onupgradeneeded = () => opening.result.createObjectStore('probe')
      opening.onerror = () => finish('refusé')
      opening.onblocked = () => finish('indisponible')
      opening.onsuccess = () => {
        db = opening.result
        if (settled) { db.close(); indexedDB.deleteDatabase(name); return }
        try {
          const write = db.transaction('probe', 'readwrite')
          write.objectStore('probe').put('clairfle-ok', 'probe')
          write.onerror = () => finish('indisponible')
          write.onabort = () => finish('indisponible')
          write.oncomplete = () => {
            if (settled || !db) return
            const read = db.transaction('probe')
            const value = read.objectStore('probe').get('probe')
            read.oncomplete = () => finish(value.result === 'clairfle-ok' ? 'disponible' : 'indisponible')
            read.onerror = () => finish('indisponible')
            read.onabort = () => finish('indisponible')
          }
        } catch { finish('indisponible') }
      }
    } catch { finish('refusé') }
  })
  try {
    const estimate = await navigator.storage?.estimate?.()
    return { state, quota: estimate?.quota, usage: estimate?.usage }
  } catch { return { state } }
}
