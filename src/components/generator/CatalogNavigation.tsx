import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { navigateTo } from './routing'
import { SheetFontSelect } from './SheetFontSelect'
import { applyBaseFontSize, MAX_BASE_FONT_SIZE, MIN_BASE_FONT_SIZE, readBaseFontSize } from './typography'
import { applySheetFont, readSheetFont } from './sheet-font'

export function SettingsIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 3-.6 2.2-2 .9-2-.6-2 3.5 1.5 1.6v2.8L2.4 15l2 3.5 2-.6 2 .9.6 2.2h4l.6-2.2 2-.9 2 .6 2-3.5-1.5-1.6v-2.8L19.6 9l-2-3.5-2 .6-2-.9L13 3Z"/><circle cx="11" cy="12" r="3"/></svg>
}

function ToolbarPopover({ label, icon, menu = false, children }: { label: string; icon: ReactNode; menu?: boolean; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 12, width: 276 })
  const box = useRef<HTMLDivElement>(null), button = useRef<HTMLButtonElement>(null)
  const id = useId()
  const close = () => setOpen(false)
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const anchor = button.current?.getBoundingClientRect()
      if (!anchor) return
      const width = Math.min(menu ? 276 : 320, window.innerWidth - 24)
      setPosition({ top: anchor.bottom + 8, left: Math.min(Math.max(12, anchor.right - width), window.innerWidth - width - 12), width })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open, menu])
  useEffect(() => {
    if (!open) return
    if (menu) box.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus() }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open, menu])
  return <div className="catalog-navigation-wrap" ref={box} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close() }}>
    <button ref={button} type="button" className={`topbar-icon-btn${open ? ' active' : ''}`} aria-label={label} title={label} aria-expanded={open} aria-haspopup={menu ? 'menu' : 'dialog'} aria-controls={open ? id : undefined} onClick={() => setOpen(value => !value)} onKeyDown={event => { if (menu && event.key === 'ArrowDown') { event.preventDefault(); setOpen(true) } }}>{icon}</button>
    {open && <div id={id} className="catalog-navigation-popover" role={menu ? 'menu' : 'dialog'} aria-label={label} style={position} onKeyDown={event => {
      if (!menu || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')]
      const current = items.indexOf(document.activeElement as HTMLElement)
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length
      items[next]?.focus()
    }}>{children(close)}</div>}
  </div>
}

const catalogues = [
  { href: '/fiches', label: 'Catalogue des fiches', icon: <><path d="M4 3h10l5 5v13H4Z"/><path d="M14 3v6h5M7 13h9M7 17h7"/></> },
  { href: '/images', label: 'Catalogue des images', icon: <><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 3-3 6 6"/></> },
  { href: '/audios', label: 'Catalogue des audios', icon: <><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/></> },
]

export function CatalogMenu() {
  return <ToolbarPopover label="Catalogue" menu icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>}>
    {close => catalogues.map(item => <a key={item.href} href={item.href} className="catalog-navigation-item" role="menuitem" aria-current={window.location.pathname === item.href ? 'page' : undefined} onClick={event => {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      event.preventDefault(); close(); navigateTo(item.href); window.dispatchEvent(new PopStateEvent('popstate'))
    }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{item.icon}</svg><span>{item.label}</span></a>)}
  </ToolbarPopover>
}

export function CatalogPageTools({ onLogout }: { onLogout?: () => void }) {
  const [fontSize, setFontSize] = useState(readBaseFontSize)
  const [sheetFont, setSheetFont] = useState(readSheetFont)
  const sizeId = useId()
  return <div className="catalog-page-tools">
    <CatalogMenu />
    <ToolbarPopover label="Paramètres" icon={<SettingsIcon />}>
      {close => <><p className="settings-menu-heading">Paramètres des fiches</p><SheetFontSelect value={sheetFont} onChange={font => setSheetFont(applySheetFont(font))} /><label className="settings-font-label" htmlFor={sizeId}><span>Taille du texte des fiches</span><output htmlFor={sizeId}>{fontSize} px</output></label><input id={sizeId} type="range" min={MIN_BASE_FONT_SIZE} max={MAX_BASE_FONT_SIZE} value={fontSize} onChange={event => setFontSize(applyBaseFontSize(Number(event.target.value)))} />{onLogout && <button type="button" className="settings-logout-btn" onClick={() => { close(); onLogout() }}>Se déconnecter</button>}</>}
    </ToolbarPopover>
  </div>
}
