import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ACCESS_DOMAIN_OPTIONS, readAccessAccount } from '@/access'
import { FichesApiError, request, storeSyncPassword } from '@/fiches/api'
import { readAccessPassword } from '@/fiches/password'
import { Header } from './Header'
import { CatalogPageTools } from './CatalogNavigation'
type User = { id: string; givenName: string; familyName: string; email: string; active: boolean; domains: string[] }
const BASE = ['algèbre', 'géométrie', 'alphabetisation']
export function AccountsPage({ onOpenGenerator, onLogout }: { onOpenGenerator: () => void; onLogout: () => void }) {
 const account = readAccessAccount()
 const [users, setUsers] = useState<User[]>([]), [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState<string | null>(null)
 const [needsPassword, setNeedsPassword] = useState(() => !readAccessPassword())
 const [syncPassword, setSyncPassword] = useState('')
 const [givenName, setGiven] = useState(''), [familyName, setFamily] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirmation, setConfirmation] = useState(''), [domains, setDomains] = useState<string[]>(BASE)
 const handleRequestError = useCallback((caught: unknown, fallback: string) => {
  if (caught instanceof FichesApiError && (caught.code === 'password' || caught.code === 'unauthorized')) {
   setBusy(null)
   setNeedsPassword(true)
   setSyncPassword('')
   setUsers([])
  }
  setError(caught instanceof Error ? caught.message : fallback)
 }, [])
 useEffect(() => {
  if (account !== 'admin' || needsPassword) return
  let active = true
  setBusy('load')
  void request('/users')
   .then(data => { if (active) setUsers((data as { users: User[] }).users) })
   .catch(e => { if (active) handleRequestError(e, 'La liste des comptes n’a pas pu être chargée.') })
   .finally(() => { if (active) setBusy(null) })
  return () => { active = false }
 }, [account, needsPassword, handleRequestError])
 if (account !== 'admin') return <main className="access-main"><p role="alert">Cet accès est réservé à l’administrateur.</p></main>
 const unlock = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  if (!syncPassword.trim()) { setError('Saisissez votre mot de passe administrateur.'); return }
  storeSyncPassword(syncPassword)
  setSyncPassword('')
  setError('')
  setMessage('')
  setBusy('load')
  setNeedsPassword(false)
 }
 const save = async (user: User) => { setBusy(user.id); setError(''); setMessage(''); try { await request(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify({ domains: user.domains }) }); setMessage(`Accès enregistrés pour ${user.givenName} ${user.familyName}. Ils seront disponibles à sa prochaine connexion.`) } catch (e) { handleRequestError(e, 'La modification a échoué.') } finally { setBusy(null) } }
 const create = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); setError(''); setMessage('')
  if (password !== confirmation) { setError('Les deux mots de passe doivent être identiques.'); return }
  setBusy('create')
  try {
   const data = await request('/users', { method: 'POST', body: JSON.stringify({ givenName, familyName, email, password, domains }) }) as { user: User }
   setUsers(current => [...current, data.user]); setMessage(`Compte créé pour ${data.user.givenName} ${data.user.familyName}. Communiquez-lui son adresse de connexion et le mot de passe choisi. Aucun e-mail n’est envoyé.`)
   setGiven(''); setFamily(''); setEmail(''); setPassword(''); setConfirmation(''); setDomains(BASE)
  } catch (e) { handleRequestError(e, 'La création a échoué.') }
  finally { setBusy(null) }
 }
 const options = (selected: string[], change: (next: string[]) => void) => ACCESS_DOMAIN_OPTIONS.map(d => <label key={d.id}><input type="checkbox" checked={BASE.includes(d.id) || selected.includes(d.id)} disabled={BASE.includes(d.id)} onChange={e => change(e.target.checked ? [...selected, d.id] : selected.filter(x => x !== d.id))}/>{d.label}</label>)
 return <div><Header onCreate={onOpenGenerator} rightSlot={<CatalogPageTools onLogout={onLogout}/>}/><main className="fiches-main">
  <h1>Comptes enseignants</h1><p>Créez les comptes et choisissez les accès de chaque personne. Algèbre, Géométrie et Alphabétisation sont incluses pour tous. Chaque personne retrouve ses propres fiches.</p>
  {error && <p role="alert" className="access-error">{error}</p>}{message && <p role="status">{message}</p>}{busy === 'load' && <p role="status">Chargement des comptes…</p>}
  {needsPassword ? <form className="access-card account-domain-card" aria-label="Accéder aux comptes enseignants" onSubmit={unlock}>
   <h2>Confirmer l’accès administrateur</h2>
   <p id="accounts-sync-description">Saisissez votre mot de passe administrateur pour accéder aux comptes enseignants.</p>
   <label className="access-field"><span>Mot de passe administrateur</span><input name="admin-password" type="password" autoComplete="current-password" value={syncPassword} onChange={e => setSyncPassword(e.target.value)} aria-describedby="accounts-sync-description" required autoFocus/></label>
   <button className="button" type="submit" disabled={busy !== null}>Accéder aux comptes</button>
  </form> : <>
  <form className="access-card account-domain-card" aria-label="Créer un compte enseignant" onSubmit={create}>
   <h2>Créer un compte</h2><p>Le compte est actif dès sa création. Aucune confirmation par e-mail n’est demandée.</p>
   <fieldset disabled={busy !== null} className="account-create-fields"><legend>Identité et connexion</legend>
    <label className="access-field"><span>Prénom</span><input name="given-name" autoComplete="given-name" value={givenName} onChange={e => setGiven(e.target.value)} required maxLength={60}/></label>
    <label className="access-field"><span>Nom</span><input name="family-name" autoComplete="family-name" value={familyName} onChange={e => setFamily(e.target.value)} required maxLength={60}/></label>
    <label className="access-field"><span>Adresse e-mail professionnelle</span><input name="email" type="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} pattern=".+@[Aa][Dd][Mm][Ii][Nn]\.[Vv][Ss]\.[Cc][Hh]" placeholder="prenom.nom@admin.vs.ch"/></label>
    <label className="access-field"><span>Mot de passe du compte</span><input name="new-password" type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} maxLength={128} aria-describedby="new-account-password-rules"/></label>
    <p id="new-account-password-rules">Au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial.</p>
    <label className="access-field"><span>Confirmer le mot de passe</span><input type="password" autoComplete="new-password" value={confirmation} onChange={e => setConfirmation(e.target.value)} required minLength={8} maxLength={128}/></label>
   </fieldset>
   <fieldset disabled={busy !== null}><legend>Accès du nouveau compte</legend><div className="account-domain-options">{options(domains, setDomains)}</div></fieldset>
   <button className="button" disabled={busy !== null} type="submit">{busy === 'create' ? 'Création…' : 'Créer le compte'}</button>
  </form>
  {!users.length && !busy && !error && <p>Aucun compte personnel n’a encore été créé.</p>}
  {users.map(user => <section className="access-card account-domain-card" key={user.id} aria-label={`Compte de ${user.givenName} ${user.familyName}`}>
   <h2>{user.givenName} {user.familyName}</h2><p>{user.email} — {user.active ? 'Compte actif' : 'Compte inactif'}</p>
   <fieldset disabled={busy !== null}><legend>Domaines autorisés</legend><div className="account-domain-options">{options(user.domains, next => setUsers(current => current.map(u => u.id === user.id ? { ...u, domains: next } : u)))}</div></fieldset>
   <button className="button" disabled={busy !== null} onClick={() => void save(user)}>Enregistrer les accès de {user.givenName}</button>
  </section>)}
  </>}
 </main></div>
}
