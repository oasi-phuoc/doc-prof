import { useEffect, useState } from 'react'
import './App.css'
import {
  clearAccessAccount,
  hasAccessCookie,
  writeAccessAccount,
  type AccessAccount,
} from '@/access'
import { AccessPage } from '@/components/generator/AccessPage'
import { GeneratorPage } from '@/components/generator/GeneratorPage'
import { Landing } from '@/components/generator/Landing'
import { navigateTo, resolveRoute } from '@/components/generator/routing'

export default function App() {
  const [route, setRoute] = useState<'landing' | 'access' | 'generator'>(resolveRoute)

  useEffect(() => {
    const sync = () => setRoute(resolveRoute())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const goAccess = () => {
    if (hasAccessCookie()) {
      navigateTo('/generateur')
      setRoute('generator')
      return
    }
    navigateTo('/acces')
    setRoute('access')
  }

  const openGenerator = (account: AccessAccount) => {
    writeAccessAccount(account)
    navigateTo('/generateur')
    setRoute('generator')
  }

  const logout = () => {
    clearAccessAccount()
    navigateTo('/acces')
    setRoute('access')
  }

  if (route === 'generator') return <GeneratorPage onLogout={logout} />
  if (route === 'access') return <AccessPage onSuccess={openGenerator} />
  return <Landing onCreate={goAccess} />
}
