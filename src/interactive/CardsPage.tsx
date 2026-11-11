import { useState, type CSSProperties } from 'react'
import { PALETTE, SHAPES, defaultShapes, inkForColor, type ShapeId } from './domain/palette'
import { calibrationMatches, paletteFingerprint, paletteContrast } from './domain/calibration'
import { patchClassroomPreferences, readClassroomPreferences, type ClassroomPreferences } from './preferences'
import { CardBadge } from './components/CardBadge'
import { PrintCards } from './components/PrintCards'
import './cards.css'

export default function CardsPage({ initial, initialWarning }: { initial: ClassroomPreferences; initialWarning: string }) {
  const [settings, setSettings] = useState(initial)
  const [selected, setSelected] = useState(0)
  const [compared, setCompared] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(initialWarning)
  const version = settings.paletteVersion ?? 1
  const calibrated = calibrationMatches(settings.colors, settings.shapes, version, settings.calibration)
  const ratios = paletteContrast(settings.colors)
  const readable = ratios.every((ratio) => ratio.text >= 4.5 && ratio.outer >= 3 && ratio.selection >= 3)
  const update = (patch: Partial<ClassroomPreferences>) => {
    const previous = settings
    if (patch.colors || patch.shapes) setSettings({ ...settings, ...patch })
    setBusy(true); setMessage('')
    void patchClassroomPreferences(patch, initial).then((next) => { setSettings(next); if (patch.colors || patch.shapes) setCompared(false); if (patch.calibration) setMessage('Comparaison des six cartes enregistrée pour cet écran.') }, (error: unknown) => { setSettings(previous); setMessage(error instanceof Error ? error.message : 'Enregistrement impossible.') }).finally(() => setBusy(false))
  }
  const shape = (value: ShapeId) => { const next = [...settings.shapes], other = next.indexOf(value); if (other >= 0) next[other] = next[selected]!; next[selected] = value; update({ shapes: next }) }
  return <div className="ci-app ci-cards-page">
    <header className="ci-card-page-header ci-no-print"><a href="/generateur" className="brand" aria-label="ClairFLE">Clair<span className="brand-accent">FLE</span></a><a href="/interactif/demo">Jouer</a><a href="/generateur">Créer des fiches</a></header>
    <main className="ci-container">
      <section className="ci-panel ci-no-print"><h1>Cartes de la classe</h1><p>Comparez les six cartes de votre classe avec cet écran. Choisissez une carte, puis ajustez sa couleur et sa forme. Refaites la comparaison lorsque vous changez d’écran.</p>
        <div className="ci-calibration-grid">
          <div><div className="ci-calibration-picks" role="group" aria-label="Choisir une carte à comparer">{PALETTE.map((card, index) => <button key={card.letter} type="button" disabled={busy} aria-pressed={selected === index} aria-label={`Comparer la carte ${card.letter}`} onClick={() => setSelected(index)} style={{ '--card-color': settings.colors[index], '--card-ink': inkForColor(settings.colors[index]!) } as CSSProperties}><CardBadge letter={card.letter} shape={settings.shapes[index]!} /></button>)}</div>
            <div className="ci-calibration-swatch" role="img" aria-label={`Carte ${PALETTE[selected]!.letter} à comparer avec votre carte physique`} style={{ '--card-color': settings.colors[selected], '--card-ink': inkForColor(settings.colors[selected]!) } as CSSProperties}><CardBadge letter={PALETTE[selected]!.letter} shape={settings.shapes[selected]!} /></div>
          </div>
          <div className="ci-calibration-controls"><h2>Carte {PALETTE[selected]!.letter}</h2><label>Couleur de la carte {PALETTE[selected]!.letter}<input type="color" disabled={busy} value={settings.colors[selected]} onChange={(event) => update({ colors: settings.colors.map((color, index) => index === selected ? event.target.value : color) })} /></label><label>Forme de la carte {PALETTE[selected]!.letter}<select aria-label={`Forme de la carte ${PALETTE[selected]!.letter}`} disabled={busy} value={settings.shapes[selected]} onChange={(event) => shape(event.target.value as ShapeId)}>{SHAPES.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
            <p>La couleur du texte s’adapte automatiquement. Les lettres et les formes permettent de distinguer les cartes même lorsque les couleurs se ressemblent.</p>
            <p role="status">{readable ? 'Contrastes du texte et des contours vérifiés.' : 'Contraste insuffisant : ajustez la palette avant de confirmer.'}</p>
            <details><summary>Mesures de contraste</summary><table><caption>Texte : minimum 4,5 · contours : minimum 3</caption><thead><tr><th>Carte</th><th>Texte</th><th>Contour</th><th>Anneau</th></tr></thead><tbody>{ratios.map((ratio, index) => <tr key={index}><th>{PALETTE[index]!.letter}</th><td>{ratio.text.toFixed(2)}</td><td>{ratio.outer.toFixed(2)}</td><td>{ratio.selection.toFixed(2)}</td></tr>)}</tbody></table></details>
            <div className="ci-toolbar"><button type="button" disabled={busy} onClick={() => update({ colors: PALETTE.map((card) => card.color), shapes: [...defaultShapes] })}>Rétablir la palette</button><button type="button" disabled={busy} onClick={() => { setBusy(true); void readClassroomPreferences(initial).then((next) => { setSettings(next); setCompared(false) }, (error: unknown) => setMessage(error instanceof Error ? error.message : 'Réglages indisponibles.')).finally(() => setBusy(false)) }}>Recharger la palette</button></div>
            <div className="ci-calibration-confirm"><h2>Vérifier avec les cartes papier</h2><label><input type="checkbox" checked={compared} disabled={busy} onChange={(event) => setCompared(event.target.checked)} />J’ai comparé les six cartes avec cet écran.</label><button type="button" disabled={!compared || !readable || busy} onClick={() => update({ calibration: { paletteVersion: version, paletteHash: paletteFingerprint(settings.colors, settings.shapes), confirmedAt: Date.now() } })}>Enregistrer la comparaison</button>
              <p>{calibrated ? `Comparaison confirmée le ${new Date(settings.calibration!.confirmedAt).toLocaleString('fr-CH')}.` : settings.calibration ? 'La palette a changé : comparez à nouveau vos cartes.' : 'La comparaison visuelle reste à faire sur cet écran.'}</p><p>Palette n° {version}. La planche imprimée ci-dessous utilise ces mêmes couleurs et formes.</p>
            </div>
          </div>
        </div>{message && <p role="status">{message}</p>}
      </section>
      <PrintCards colors={settings.colors} shapes={settings.shapes} />
    </main>
  </div>
}
