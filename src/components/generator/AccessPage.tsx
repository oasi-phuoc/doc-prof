import { useState, type FormEvent } from 'react'
import { resolveAccountFromPassword, writeAccessAccount, type AccessAccount } from '@/access'
import { rememberAccessPassword } from '@/fiches/password'
import { clearSessionUser } from '@/fiches/session'
import { Header } from '@/components/generator/Header'

export function AccessPage({ onSuccess }: { onSuccess: (account: AccessAccount) => void }) {
 const [password, setPassword] = useState('')
 const [error, setError] = useState<string | null>(null)
 const submit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault(); setError(null)
  try {
   const account = resolveAccountFromPassword(password)
   if (!account) throw Error('Mot de passe incorrect. Vérifiez et réessayez.')
   clearSessionUser(); writeAccessAccount(account); rememberAccessPassword(password); onSuccess(account)
  } catch (caught) { setError(caught instanceof Error ? caught.message : 'La connexion n’a pas abouti.') }
 }
 return <div className="access-page"><Header onCreate={() => undefined} showCreate={false}/><main className="access-main">
  <form className="access-card" onSubmit={submit} autoComplete="on">
   <p className="eyebrow">Espace enseignant</p><h1>Se connecter</h1>
   <p className="access-lead">Utilisez le mot de passe d’accès communiqué par l’administration.</p>
   <label className="access-field"><span>Mot de passe</span><input name="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required maxLength={128}/></label>
   {error && <p className="access-error" role="alert">{error}</p>}
   <button className="button full" type="submit">Continuer vers les fiches</button>
   <a className="text-link access-back" href="/">← Retour à l’accueil</a>
  </form></main></div>
}
