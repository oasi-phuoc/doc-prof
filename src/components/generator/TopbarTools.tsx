import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  THEME_COLORS,
  THEME_TONES,
  contrastOnTheme,
  hexToHue,
  hslToHex,
  hueFromPointer,
} from '@/components/generator/theme'
import { MAX_BASE_FONT_SIZE, MIN_BASE_FONT_SIZE } from '@/components/generator/typography'
import {
  SHEET_FORMAT_LABELS,
  type SheetFormat,
} from '@/components/generator/sheet-format'

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

function ColorSection({
  themeColor,
  onChange,
}: {
  themeColor: string
  onChange: (color: string) => void
}) {
  const [hue, setHue] = useState(() => hexToHue(themeColor))
  const [toneId, setToneId] = useState<(typeof THEME_TONES)[number]['id']>('vif')
  const [customOpen, setCustomOpen] = useState(false)
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
    const move = (event: PointerEvent) => {
      if (!dragging.current) return
      pickFromPointer(event.clientX, event.clientY)
    }
    const stop = () => {
      dragging.current = false
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', stop)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', stop)
    }
  }, [])

  const knobStyle = {
    left: `${50 + 38 * Math.sin((hue * Math.PI) / 180)}%`,
    top: `${50 - 38 * Math.cos((hue * Math.PI) / 180)}%`,
    background: hslToHex(hue, 84, 48),
  } as CSSProperties

  return (
    <div className="settings-section" role="group" aria-label="Couleur du thème">
      <p className="settings-section-title">Couleur du thème</p>
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
  )
}

function FontSizeSection({
  fontSize,
  onChange,
}: {
  fontSize: number
  onChange: (size: number) => void
}) {
  return (
    <div className="settings-section" role="group" aria-label="Taille du texte">
      <label className="settings-font-label" htmlFor="base-font-size">
        <span>Taille du texte de la fiche</span>
        <output htmlFor="base-font-size">{fontSize} px</output>
      </label>
      <input
        id="base-font-size"
        type="range"
        min={MIN_BASE_FONT_SIZE}
        max={MAX_BASE_FONT_SIZE}
        step="1"
        value={fontSize}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
      <div className="font-size-range-labels" aria-hidden="true">
        <span>{MIN_BASE_FONT_SIZE} px</span>
        <span>{MAX_BASE_FONT_SIZE} px</span>
      </div>
    </div>
  )
}

function FormatSection({
  sheetFormat,
  onChange,
}: {
  sheetFormat: SheetFormat
  onChange: (format: SheetFormat) => void
}) {
  const formats: SheetFormat[] = ['a4-portrait', 'a5-double-landscape']
  return (
    <div className="settings-section" role="radiogroup" aria-label="Format de page">
      <p className="settings-section-title">Format de page</p>
      <div className="settings-format-list">
        {formats.map((format) => (
          <button
            key={format}
            type="button"
            role="radio"
            aria-checked={sheetFormat === format}
            className={`settings-format-option${sheetFormat === format ? ' active' : ''}`}
            onClick={() => onChange(format)}
          >
            <span className="settings-format-radio" aria-hidden="true" />
            <span className="settings-format-copy">
              <strong>{SHEET_FORMAT_LABELS[format]}</strong>
              {format === 'a5-double-landscape' ? (
                <span>A4 paysage coupée en deux mini-fiches A5</span>
              ) : (
                <span>Feuille A4 verticale classique</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function SettingsMenu({
  themeColor,
  onThemeColor,
  fontSize,
  onFontSizeChange,
  sheetFormat,
  onSheetFormatChange,
}: {
  themeColor: string
  onThemeColor: (color: string) => void
  fontSize: number
  onFontSizeChange: (size: number) => void
  sheetFormat: SheetFormat
  onSheetFormatChange: (format: SheetFormat) => void
}) {
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="topbar-settings-wrap" ref={boxRef}>
      <button
        type="button"
        className={`topbar-icon-btn${open ? ' active' : ''}`}
        aria-label="Paramètres"
        title="Paramètres"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            fill="currentColor"
            d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 14.58a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.68.22l2.39-.96c.5.4 1.05.71 1.63.94l.36 2.54c.05.24.25.42.49.42h3.8c.24 0 .44-.18.49-.42l.36-2.54c.58-.23 1.12-.54 1.63-.94l2.39.96c.25.12.54.02.68-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
          />
        </svg>
      </button>
      {open ? (
        <div className="topbar-settings-menu" role="dialog" aria-label="Paramètres">
          <FontSizeSection fontSize={fontSize} onChange={onFontSizeChange} />
          <ColorSection themeColor={themeColor} onChange={onThemeColor} />
          <FormatSection sheetFormat={sheetFormat} onChange={onSheetFormatChange} />
        </div>
      ) : null}
    </div>
  )
}

export function TopbarTools({
  themeColor,
  onThemeColor,
  fontSize,
  onFontSizeChange,
  sheetFormat,
  onSheetFormatChange,
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
  fontSize: number
  onFontSizeChange: (size: number) => void
  sheetFormat: SheetFormat
  onSheetFormatChange: (format: SheetFormat) => void
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
      <SettingsMenu
        themeColor={themeColor}
        onThemeColor={onThemeColor}
        fontSize={fontSize}
        onFontSizeChange={onFontSizeChange}
        sheetFormat={sheetFormat}
        onSheetFormatChange={onSheetFormatChange}
      />
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
