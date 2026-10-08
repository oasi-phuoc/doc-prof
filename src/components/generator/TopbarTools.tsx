import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  THEME_COLORS,
  THEME_TONES,
  contrastOnTheme,
  hexToHue,
  hslToHex,
  hueFromPointer,
} from '@/components/generator/theme'

function IconBtn({
  label,
  active,
  onClick,
  children,
  className = '',
}: {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      className={`topbar-icon-btn${active ? ' active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function ColorMenu({
  themeColor,
  onChange,
}: {
  themeColor: string
  onChange: (color: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hue, setHue] = useState(() => hexToHue(themeColor))
  const [toneId, setToneId] = useState<(typeof THEME_TONES)[number]['id']>('vif')
  const [customOpen, setCustomOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLButtonElement>(null)
  const dragging = useRef(false)
  const toneRef = useRef(toneId)
  const onChangeRef = useRef(onChange)
  const isPreset = THEME_COLORS.some((swatch) => swatch.color === themeColor)

  useEffect(() => {
    toneRef.current = toneId
  }, [toneId])
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const applyHueTone = (nextHue: number, nextTone: (typeof THEME_TONES)[number]['id']) => {
    const tone = THEME_TONES.find((item) => item.id === nextTone) ?? THEME_TONES[2]
    onChangeRef.current(hslToHex(nextHue, tone.s, tone.l))
  }

  const pickFromPointer = (clientX: number, clientY: number) => {
    const wheel = wheelRef.current
    if (!wheel) return
    const nextHue = hueFromPointer(wheel, clientX, clientY)
    setHue(nextHue)
    applyHueTone(nextHue, toneRef.current)
  }

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setCustomOpen(false)
      }
    }
    const move = (event: PointerEvent) => {
      if (!dragging.current) return
      pickFromPointer(event.clientX, event.clientY)
    }
    const stop = () => {
      dragging.current = false
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', stop)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', stop)
    }
  }, [open])

  const knobStyle = {
    left: `${50 + 38 * Math.sin((hue * Math.PI) / 180)}%`,
    top: `${50 - 38 * Math.cos((hue * Math.PI) / 180)}%`,
    background: hslToHex(hue, 84, 48),
  } as CSSProperties

  return (
    <div className="topbar-color-wrap" ref={boxRef}>
      <button
        type="button"
        className={`topbar-icon-btn topbar-color-btn${open ? ' active' : ''}`}
        aria-label="Couleur du thème"
        title="Couleur du thème"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          setHue(hexToHue(themeColor))
          setOpen((v) => !v)
          setCustomOpen(false)
        }}
      >
        <span className="topbar-color-swatch" style={{ background: themeColor }} />
      </button>
      {open ? (
        <div className="topbar-color-menu" role="listbox" aria-label="Couleurs du thème">
          <div className="theme-color-choices is-compact">
            {THEME_COLORS.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                role="option"
                aria-selected={themeColor === swatch.color}
                aria-label={swatch.label}
                title={swatch.label}
                className={`theme-color-swatch${themeColor === swatch.color ? ' active' : ''}`}
                style={{ background: swatch.color }}
                onClick={() => {
                  onChange(swatch.color)
                  setCustomOpen(false)
                  setOpen(false)
                }}
              />
            ))}
            <button
              type="button"
              role="option"
              aria-selected={!isPreset}
              aria-expanded={customOpen}
              aria-label="Autre couleur"
              title="Autre couleur"
              className={`theme-color-swatch theme-color-other${!isPreset ? ' active' : ''}`}
              style={!isPreset ? { background: themeColor } : undefined}
              onClick={() => {
                setHue(hexToHue(themeColor))
                setCustomOpen((v) => !v)
              }}
            />
          </div>
          {customOpen ? (
            <div className="theme-color-picker" role="dialog" aria-label="Cercle chromatique">
              <button
                ref={wheelRef}
                type="button"
                className="theme-hue-wheel"
                aria-label="Choisir une teinte"
                onPointerDown={(event) => {
                  dragging.current = true
                  event.currentTarget.setPointerCapture(event.pointerId)
                  pickFromPointer(event.clientX, event.clientY)
                }}
              >
                <span className="theme-hue-knob" style={knobStyle} />
              </button>
              <div className="theme-tone-row" role="group" aria-label="Ton de la couleur">
                {THEME_TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    className={`theme-tone-chip${toneId === tone.id ? ' active' : ''}`}
                    style={{
                      background: hslToHex(hue, tone.s, tone.l),
                      color: contrastOnTheme(hslToHex(hue, tone.s, tone.l)),
                    }}
                    onClick={() => {
                      setToneId(tone.id)
                      applyHueTone(hue, tone.id)
                    }}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function TopbarTools({
  themeColor,
  onThemeColor,
  footerOpen,
  onToggleFooter,
  libreOpen,
  onToggleLibre,
  previewMode,
  onTogglePreviewMode,
  showPreviewToggle = true,
  onLogout,
}: {
  themeColor: string
  onThemeColor: (color: string) => void
  footerOpen: boolean
  onToggleFooter: () => void
  libreOpen: boolean
  onToggleLibre: () => void
  /** Mode d’aperçu : fiche élève (student) ou corrigé (answers). */
  previewMode: 'student' | 'answers'
  onTogglePreviewMode: () => void
  /** Masqué pour calligraphie / jeux (pas de corrigé). */
  showPreviewToggle?: boolean
  onLogout: () => void
}) {
  const isCorrige = previewMode === 'answers'
  return (
    <div className="topbar-tools">
      <ColorMenu themeColor={themeColor} onChange={onThemeColor} />
      {showPreviewToggle ? (
        <IconBtn
          label={isCorrige ? 'Corrigé (cliquer pour fiche élève)' : 'Fiche élève (cliquer pour corrigé)'}
          active={isCorrige}
          onClick={onTogglePreviewMode}
        >
          {isCorrige ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path
                fill="currentColor"
                d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path
                fill="currentColor"
                d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2zm0-8h4v2H8V8z"
              />
            </svg>
          )}
        </IconBtn>
      ) : null}
      <IconBtn label="En-tête et pied de page" active={footerOpen} onClick={onToggleFooter}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            fill="currentColor"
            d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v3h14V5H5zm0 5v9h14v-9H5zm2 6h6v2H7v-2z"
          />
        </svg>
      </IconBtn>
      <IconBtn label="Mode libre" active={libreOpen} onClick={onToggleLibre}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            fill="currentColor"
            d="M4 19.5V21h1.5L16.1 10.4l-1.5-1.5L4 19.5zM19.7 7.2c.4-.4.4-1 0-1.4l-1.5-1.5a1 1 0 0 0-1.4 0l-1.2 1.2 2.9 2.9 1.2-1.2z"
          />
        </svg>
      </IconBtn>
      <IconBtn label="Se déconnecter" onClick={onLogout} className="is-logout">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            fill="currentColor"
            d="M10 4v2H6v12h4v2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4zm7.6 5.4L15 7l-1.4 1.4 2.6 2.6H10v2h6.2l-2.6 2.6L15 17l2.6-2.6L20.2 12l-2.6-2.6z"
          />
        </svg>
      </IconBtn>
    </div>
  )
}
