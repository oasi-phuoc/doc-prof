import { useEffect, useRef, useState } from 'react'
import { PALETTE, inkForColor, type ShapeId } from './domain/palette'
import { CardBadge } from './components/CardBadge'
import { collectRuntime, formatDiagnostic, probeStorage, summarizeLatencies, type StorageProbe } from './diagnostic/report'
import './diagnostic/diagnostic.css'

export default function DiagnosticPage({ colors, shapes }: { colors: string[]; shapes: ShapeId[] }) {
  const [runtime, setRuntime] = useState(collectRuntime)
  const [storage, setStorage] = useState<StorageProbe>({ state: 'non testé' })
  const [checkingStorage, setCheckingStorage] = useState(false)
  const [audio, setAudio] = useState('non testé')
  const [fullscreen, setFullscreen] = useState('non testé')
  const [wakeLock, setWakeLock] = useState('non testé')
  const [fonts, setFonts] = useState('chargement en cours')
  const [latencies, setLatencies] = useState<number[]>([])
  const [pointers, setPointers] = useState<string[]>([])
  const [contacts, setContacts] = useState(0)
  const [maxContacts, setMaxContacts] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [copyStatus, setCopyStatus] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const activeContacts = useRef(new Set<number>())
  const frame = useRef<number | null>(null)
  const latencyCount = useRef(0)
  const swatch = useRef<HTMLElement>(null)
  const audioContext = useRef<AudioContext | null>(null)
  const lock = useRef<WakeLockSentinel | null>(null)
  const reportField = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const update = () => setRuntime(collectRuntime())
    const changed = () => {
      setIsFullscreen(!!document.fullscreenElement)
      if (document.fullscreenElement === swatch.current) setFullscreen('test réussi')
      update()
    }
    window.addEventListener('resize', update)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    document.addEventListener('fullscreenchange', changed)
    let active = true
    if (document.fonts) void document.fonts.ready.then(() => { if (active) setFonts('polices chargées') })
    else void Promise.resolve().then(() => { if (active) setFonts('état indisponible') })
    return () => {
      active = false
      window.removeEventListener('resize', update)
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      document.removeEventListener('fullscreenchange', changed)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      void audioContext.current?.close().catch(() => {})
      void lock.current?.release().catch(() => {})
    }
  }, [])
  const report = formatDiagnostic({ runtime, storage, audio, fullscreen, wakeLock, fonts, latencies, pointers, maxContacts, colors })
  const timing = summarizeLatencies(latencies)
  const notePointer = (type: string) => setPointers((current) => current.includes(type) ? current : [...current, type])
  const measure = (type: string) => {
    notePointer(type)
    if (frame.current !== null || latencyCount.current >= 10) return
    const started = performance.now()
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      latencyCount.current += 1
      setLatencies((current) => [...current, performance.now() - started])
    })
  }
  const testAudio = async () => {
    try {
      const Context = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Context) { setAudio('API audio indisponible'); return }
      if (!audioContext.current || audioContext.current.state === 'closed') audioContext.current = new Context()
      const context = audioContext.current
      await context.resume()
      if (context.state !== 'running') { setAudio('lecture refusée'); return }
      const tone = context.createOscillator()
      const gain = context.createGain()
      tone.frequency.value = 440
      gain.gain.setValueAtTime(.06, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .25)
      tone.connect(gain).connect(context.destination)
      tone.start()
      tone.stop(context.currentTime + .25)
      tone.onended = () => { tone.disconnect(); gain.disconnect() }
      setAudio('lecture démarrée après un geste ; écoute à confirmer')
    } catch { setAudio('lecture refusée ou indisponible') }
  }
  const testWakeLock = async () => {
    if (!('wakeLock' in navigator)) { setWakeLock('API absente'); return }
    try {
      if (lock.current && !lock.current.released) { await lock.current.release(); lock.current = null; setWakeLock('verrou relâché'); return }
      const sentinel = await navigator.wakeLock.request('screen')
      lock.current = sentinel
      sentinel.addEventListener('release', () => { setWakeLock('verrou relâché') })
      setWakeLock('verrou acquis')
    } catch { setWakeLock('demande refusée ou indisponible') }
  }
  const testFullscreen = async () => {
    if (!swatch.current?.requestFullscreen) { setFullscreen('API absente'); return }
    try { await swatch.current.requestFullscreen(); setFullscreen('test réussi') }
    catch { setFullscreen('demande refusée ou indisponible') }
  }
  return (
    <div className="ci-app ci-diagnostic-app">
      <header className="ci-header ci-no-print">
        <a className="brand" href="/generateur" aria-label="ClairFLE">Clair<span className="brand-accent">FLE</span></a>
        <a href="/interactif/demo">Retour au jeu</a>
      </header>
      <main className="ci-container ci-diagnostic">
        <h1>Diagnostic de l’écran</h1>
        <p>À ouvrir sur l’écran utilisé en classe. Les informations et tests restent sur cet appareil ; vous choisissez si vous partagez le rapport.</p>
        <section className="ci-panel">
          <h2>Navigateur et capacités</h2>
          <dl className="ci-diagnostic-facts">
            <dt>Navigateur</dt><dd>{runtime.userAgent}</dd>
            <dt>Écran / fenêtre</dt><dd>{runtime.screen} / {runtime.viewport} · rapport de pixels {runtime.pixels}</dd>
            <dt>Tactile et pointeur</dt><dd>{runtime.touchPoints} point(s) déclaré(s) · {runtime.pointer}</dd>
            <dt>Connexion déclarée</dt><dd>{runtime.online ? 'En ligne' : 'Hors ligne'}</dd>
            <dt>Préférences de l’appareil</dt><dd>Mouvement réduit : {runtime.reducedMotion ? 'oui' : 'non'} · contraste {runtime.contrast}</dd>
            {Object.entries(runtime.features).map(([name, supported]) => <div className="ci-diagnostic-fact" key={name}><dt>{name}</dt><dd>{supported ? 'API présente' : 'API absente'}</dd></div>)}
          </dl>
          <div className="ci-toolbar"><button onClick={() => setRuntime(collectRuntime())}>Actualiser les informations</button></div>
          <p>Une API présente indique une possibilité ; les tests ci-dessous vérifient son utilisation.</p>
        </section>
        <section className="ci-panel">
          <h2>Stockage, son et veille</h2>
          <div className="ci-toolbar">
            <button disabled={checkingStorage} onClick={() => { setCheckingStorage(true); void probeStorage().then(setStorage).finally(() => setCheckingStorage(false)) }}>{checkingStorage ? 'Vérification du stockage…' : 'Tester le stockage'}</button>
            <button onClick={() => { void testAudio() }}>Tester le son</button>
            <button onClick={() => { void testWakeLock() }}>Tester le maintien éveillé</button>
          </div>
          <p role="status" data-diagnostic-storage>Stockage : {storage.state}{storage.quota !== undefined ? ` · quota estimé ${Math.round(storage.quota / 1024 / 1024)} Mio` : ''}</p>
          <p role="status" data-diagnostic-audio>Son : {audio}</p>
          <p role="status" data-diagnostic-wake>Maintien éveillé : {wakeLock}</p>
          <p>Le test du son émet un bref signal à faible volume. La lecture après un geste ne garantit pas l’autolecture sans geste.</p>
        </section>
        <section className="ci-panel">
          <h2>Réactivité et contacts tactiles</h2>
          <p>Touchez dix fois la cible. Le délai jusqu’à la prochaine image est indicatif et ne mesure pas toute la chaîne matérielle de l’écran.</p>
          <button className={`ci-diagnostic-target ci-target-${latencies.length % 2}`} onPointerDown={(event) => measure(event.pointerType || 'inconnu')} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); measure('clavier') } }}>Cible · {latencies.length}/10</button>
          <p role="status" data-diagnostic-latency>{timing ? `${timing.count}/10 · moyenne ${timing.mean.toFixed(1)} ms · maximum ${timing.max.toFixed(1)} ms` : 'Aucune mesure'}</p>
          <button onClick={() => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; latencyCount.current = 0; setLatencies([]) }}>Recommencer les mesures</button>
          <p>Posez plusieurs doigts ou la paume dans cette zone. Les contacts effectivement rapportés par le navigateur seront comptés.</p>
          <div className="ci-diagnostic-contact" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); activeContacts.current.add(event.pointerId); setContacts(activeContacts.current.size); setMaxContacts((current) => Math.max(current, activeContacts.current.size)); notePointer(event.pointerType || 'inconnu') }} onPointerUp={(event) => { activeContacts.current.delete(event.pointerId); setContacts(activeContacts.current.size) }} onPointerCancel={(event) => { activeContacts.current.delete(event.pointerId); setContacts(activeContacts.current.size) }} onLostPointerCapture={(event) => { activeContacts.current.delete(event.pointerId); setContacts(activeContacts.current.size) }}>
            Zone de contacts : {contacts} · maximum observé {maxContacts}
          </div>
        </section>
        <section className="ci-panel">
          <h2>Six aplats de couleur</h2>
          <p>Comparez les couleurs avec vos cartes physiques. Flèches gauche et droite pour changer d’aplat.</p>
          <div className="ci-toolbar ci-diagnostic-color-buttons">{PALETTE.map((entry, index) => <button key={entry.letter} aria-label={`Aplat ${entry.letter}`} aria-pressed={selectedColor === index} onClick={() => setSelectedColor(index)} style={{ background: colors[index], color: inkForColor(colors[index]!) }}><CardBadge letter={entry.letter} shape={shapes[index]!} /></button>)}</div>
          <section ref={swatch} className="ci-diagnostic-swatch" tabIndex={0} aria-label="Aplat de contrôle" onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); setSelectedColor((current) => (current + (event.key === 'ArrowRight' ? 1 : 5)) % 6) } }} style={{ background: colors[selectedColor], color: inkForColor(colors[selectedColor]!) }}>
            <CardBadge letter={PALETTE[selectedColor]!.letter} shape={shapes[selectedColor]!} />
            <div className="ci-toolbar"><button onClick={() => setSelectedColor((current) => (current + 1) % 6)}>Couleur suivante</button>{isFullscreen ? <button onClick={() => { void document.exitFullscreen?.() }}>Quitter le plein écran</button> : <button onClick={() => { void testFullscreen() }}>Tester le plein écran</button>}</div>
          </section>
          <p role="status" data-diagnostic-fullscreen>Plein écran : {fullscreen}</p>
        </section>
        <section className="ci-panel">
          <h2>Polices et nombres</h2>
          <p>{fonts} · vérifiez l’alignement et les espaces à distance.</p>
          <p className="ci-diagnostic-numbers">1 234,56 · 1 234,56 · 349 cm · 121 801 cm²</p>
          <div className="ci-diagnostic-digits" aria-label="Chiffres tabulaires">{['111111', '888888', '000000'].map((value) => <div key={value}>{value}</div>)}</div>
        </section>
        <section className="ci-panel">
          <h2>Rapport à conserver</h2>
          <p>Ce rapport décrit le navigateur actuel. La validation en classe demande un essai sur le matériel réel.</p>
          <div className="ci-toolbar">
            <button onClick={() => { void navigator.clipboard?.writeText(report).then(() => setCopyStatus('Rapport copié.')).catch(() => { reportField.current?.focus(); reportField.current?.select(); setCopyStatus('Copie indisponible. Le rapport est sélectionné pour une copie manuelle.') }); if (!navigator.clipboard) { reportField.current?.focus(); reportField.current?.select(); setCopyStatus('Sélectionnez et copiez le rapport ci-dessous.') } }}>Copier le rapport</button>
            <button onClick={() => { const url = URL.createObjectURL(new Blob([report], { type: 'text/markdown;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'diagnostic-eni.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) }}>Télécharger le rapport</button>
          </div>
          <p role="status">{copyStatus}</p>
          <textarea ref={reportField} aria-label="Rapport de diagnostic" value={report} readOnly rows={22} />
        </section>
      </main>
    </div>
  )
}
