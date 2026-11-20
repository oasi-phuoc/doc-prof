import { useEffect, useState, type FormEvent } from 'react'
import { resolveAccountFromPassword, writeAccessAccount, type AccessAccount } from '@/access'
import { rememberAccessPassword } from '@/fiches/password'
import { accountRequest, clearSessionUser, loginPersonal } from '@/fiches/session'
import { Header } from '@/components/generator/Header'

export function AccessPage({ onSuccess }: { onSuccess: (account: AccessAccount) => void }) {
 const [tab, setTab] = useState<'login'|'register'|'legacy'>('login')
 const [email, setEmail] = useState(''), [password, setPassword] = useState('')
 const [givenName, setGiven] = useState(''), [familyName, setFamily] = useState(''), [confirmation, setConfirmation] = useState('')
 const [error, setError] = useState<string | null>(null), [message, setMessage] = useState<string | null>(null), [busy, setBusy] = useState(false)
 useEffect(() => {
  const token = new URLSearchParams(location.search).get('verification')
  if (!token) return
  history.replaceState(history.state, '', '/acces')
  setBusy(true)
  void accountRequest('verify', { token }).then(data => setMessage(String(data.message))).catch(e => setError(e.message)).finally(() => setBusy(false))
 }, [])
 const submit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); setError(null); setMessage(null); setBusy(true)
  try {
   if (tab === 'legacy') {
    const account = resolveAccountFromPassword(password)
    if (!account) throw Error('Mot de passe incorrect. Vérifiez et réessayez.')
    clearSessionUser(); writeAccessAccount(account); rememberAccessPassword(password); onSuccess(account)
   } else if (tab === 'register') {
    if (password !== confirmation) throw Error('Les deux mots de passe doivent être identiques.')
    const data = await accountRequest('register', { email, password, givenName, familyName }); setMessage(String(data.message)); setPassword(''); setConfirmation(''); setTab('login')
   } else { const user = await loginPersonal(email, password); writeAccessAccount(user.account); onSuccess(user.account) }
  } catch (caught) { setError(caught instanceof Error ? caught.message : 'La connexion n’a pas abouti.') }
  finally { setBusy(false) }
 }
 const changeTab = (next: typeof tab) => { setTab(next); setPassword(''); setConfirmation(''); setError(null); setMessage(null) }
 return <div className="access-page"><Header onCreate={() => undefined} showCreate={false}/><main className="access-main">
  <form className="access-card" onSubmit={submit} autoComplete="on">
   <p className="eyebrow">Espace enseignant</p><h1>{tab === 'register' ? 'Créer mon compte' : 'Se connecter'}</h1>
   <div className="mode-toggle" aria-label="Type de connexion">
    <button type="button" disabled={busy} className={tab === 'login' ? 'active' : ''} onClick={() => changeTab('login')}>Mon compte</button>
    <button type="button" disabled={busy} className={tab === 'register' ? 'active' : ''} onClick={() => changeTab('register')}>Créer un compte</button>
    <button type="button" disabled={busy} className={tab === 'legacy' ? 'active' : ''} onClick={() => changeTab('legacy')}>Admin / accès existant</button>
   </div>
   {tab === 'register' && <><p className="access-lead">Confirmez votre adresse professionnelle pour accéder à vos fiches personnelles. Algèbre, Géométrie et Alphabétisation sont incluses.</p>
    <label className="access-field"><span>Prénom</span><input name="given-name" autoComplete="given-name" value={givenName} onChange={e => setGiven(e.target.value)} required maxLength={60}/></label>
    <label className="access-field"><span>Nom</span><input name="family-name" autoComplete="family-name" value={familyName} onChange={e => setFamily(e.target.value)} required maxLength={60}/></label></>}
   {tab !== 'legacy' && <label className="access-field"><span>Adresse e-mail professionnelle</span><input name="email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} pattern=".+@[Aa][Dd][Mm][Ii][Nn]\.[Vv][Ss]\.[Cc][Hh]" placeholder="prenom.nom@admin.vs.ch"/></label>}
   <label className="access-field"><span>Mot de passe</span><input name="password" type="password" autoComplete={tab === 'register' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} required maxLength={128} minLength={tab === 'register' ? 8 : undefined} aria-describedby={tab === 'register' ? 'password-rules' : undefined}/></label>
   {tab === 'register' && <><p id="password-rules">Au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.</p><label className="access-field"><span>Confirmer le mot de passe</span><input type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} required/></label></>}
   {error && <p className="access-error" role="alert">{error}</p>}{message && <p role="status">{message}</p>}
   <button className="button full" type="submit" disabled={busy}>{busy ? 'Veuillez patienter…' : tab === 'register' ? 'Créer mon compte' : 'Continuer vers les fiches'}</button>
   {tab === 'login' && <button type="button" className="text-link" disabled={busy} onClick={async () => { setBusy(true); setError(null); setMessage(null); try { const data = await accountRequest('resend', { email, password }); setMessage(String(data.message)) } catch (e) { setError(e instanceof Error ? e.message : 'L’envoi a échoué.') } finally { setBusy(false) } }}>Renvoyer le lien de confirmation</button>}
   <a className="text-link access-back" href="/">← Retour à l’accueil</a>
  </form></main></div>
}
