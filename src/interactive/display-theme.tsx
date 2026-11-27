import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { patchClassroomPreferences, type ClassroomPreferences, type DisplayTheme } from './preferences'
import { IconButton } from './components/Icons'

const DisplayThemeContext = createContext({ theme: 'light' as DisplayTheme, setTheme: (_theme: DisplayTheme) => {}, warning: '' })

export function DisplayThemeProvider({ preferences, children }: { preferences: ClassroomPreferences; children: ReactNode }) {
  const [theme, selectTheme] = useState<DisplayTheme>(() => preferences.theme ?? (preferences.contrast ? 'high-contrast' : 'light'))
  const [warning, setWarning] = useState('')
  const lastChange = useRef(0)
  function setTheme(next: DisplayTheme) {
    selectTheme(next)
    setWarning('')
    const change = ++lastChange.current
    void patchClassroomPreferences({ theme: next, contrast: next === 'high-contrast' }, preferences).catch(() => {
      if (change === lastChange.current) setWarning('Le thème est appliqué pour cette visite. Le navigateur n’a pas pu l’enregistrer.')
    })
  }
  return <DisplayThemeContext.Provider value={{ theme, setTheme, warning }}>{children}</DisplayThemeContext.Provider>
}

export const useDisplayTheme = () => useContext(DisplayThemeContext)
export const displayThemeClass = (theme: DisplayTheme) => theme === 'light' ? '' : theme === 'dark' ? ' ci-dark' : ' ci-high-contrast'

export function DisplayThemeButtons({ disabled }: { disabled?: boolean }) {
  const { theme, setTheme, warning } = useDisplayTheme()
  return <>
    <IconButton icon="contrast" label="Contraste" disabled={disabled} aria-pressed={theme === 'high-contrast'} onClick={() => setTheme(theme === 'high-contrast' ? 'light' : 'high-contrast')} />
    <IconButton icon="moon" label="Thème sombre" disabled={disabled} aria-pressed={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
    {warning && <span role="status">{warning}</span>}
  </>
}
