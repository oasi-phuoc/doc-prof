import { useState, type FormEvent } from 'react'
import { resolveAccountFromPassword, writeAccessAccount, type AccessAccount } from '@/access'
import { rememberAccessPassword } from '@/fiches/password'
import { clearSessionUser, loginPersonal } from '@/fiches/session'
import { Header } from '@/components/generator/Header'

export function AccessPage({ onSuccess }: { onSuccess: (account: AccessAccount) => void }) {
 const [tab, setTab] = useState<'login' | 'legacy'>('login')
 const [email, setEmail] = useState(''), [password, setPassword] = useState('')
 const [error, setError] = useState<string | null>(null), [busy, setBusy] = useState(false)
 const submit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); setError(null); setBusy(true)
  try {
   if (tab === 'legacy') {
    const account = resolveAccountFromPassword(password)
    if (!account) throw Error('Mot de passe incorrect. Vérifiez et réessayez.')
    clearSessionUser(); writeAccessAccount(account); rememberAccessPassword(password); onSuccess(account)
   } else { const user = await loginPersonal(email, password); writeAccessAccount(user.account); onSuccess(user.account) }
  } catch (caught) { setError(caught instanceof Error ? caught.message : 'La connexion n’a pas abouti.') }
  finally { setBusy(false) }
 }
 const changeTab = (next: typeof tab) => { setTab(next); setPassword(''); setError(null) }
 return <div className="access-page"><Header onCreate={() => undefined} showCreate={false}/><main className="access-main">
  <form className="access-card" onSubmit={submit} autoComplete="on">
   <p className="eyebrow">Espace enseignant</p><h1>Se connecter</h1>
   <div className="mode-toggle" aria-label="Type de connexion">
    <button type="button" disabled={busy} className={tab === 'login' ? 'active' : ''} onClick={() => changeTab('login')}>Mon compte</button>
    <button type="button" disabled={busy} className={tab === 'legacy' ? 'active' : ''} onClick={() => changeTab('legacy')}>Admin / accès existant</button>
   </div>
   {tab === 'login' && <><p className="access-lead">Votre compte est créé par l’administrateur. Utilisez l’adresse et le mot de passe qu’il vous a communiqués.</p><label className="access-field"><span>Adresse e-mail professionnelle</span><input name="email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} pattern=".+@[Aa][Dd][Mm][Ii][Nn]\.[Vv][Ss]\.[Cc][Hh]" placeholder="prenom.nom@admin.vs.ch"/></label></>}
   <label className="access-field"><span>Mot de passe</span><input name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required maxLength={128}/></label>
   {error && <p className="access-error" role="alert">{error}</p>}
   <button className="button full" type="submit" disabled={busy}>{busy ? 'Veuillez patienter…' : 'Continuer vers les fiches'}</button>
   <a className="text-link access-back" href="/">← Retour à l’accueil</a>
  </form></main></div>
}
