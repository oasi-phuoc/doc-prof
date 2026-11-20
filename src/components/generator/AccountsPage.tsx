import { useEffect, useState } from 'react'
import { ACCESS_DOMAIN_OPTIONS, readAccessAccount } from '@/access'
import { request } from '@/fiches/api'
import { Header } from './Header'
import { CatalogPageTools } from './CatalogNavigation'
type User = { id: string; givenName: string; familyName: string; email: string; verified: boolean; domains: string[] }
const BASE = ['algèbre','géométrie','alphabetisation']
export function AccountsPage({ onOpenGenerator, onLogout }: { onOpenGenerator: () => void; onLogout: () => void }) {
 const [users,setUsers]=useState<User[]>([]), [error,setError]=useState(''), [message,setMessage]=useState(''),[busy,setBusy]=useState<string | null>('load')
 useEffect(()=>{ if(readAccessAccount()!=='admin')return; let active=true; void request('/users').then(data=>{if(active)setUsers((data as {users:User[]}).users)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setBusy(null)});return()=>{active=false} },[])
 if(readAccessAccount()!=='admin')return <main className="access-main"><p role="alert">Cet accès est réservé à l’administrateur.</p></main>
 const save=async(user:User)=>{setBusy(user.id);setError('');setMessage('');try{await request(`/users/${user.id}`,{method:'PUT',body:JSON.stringify({domains:user.domains})});setMessage(`Accès enregistrés pour ${user.givenName} ${user.familyName}. Ils seront disponibles à sa prochaine connexion.`)}catch(e){setError(e instanceof Error?e.message:'La modification a échoué.')}finally{setBusy(null)}}
 return <div><Header onCreate={onOpenGenerator} rightSlot={<CatalogPageTools onLogout={onLogout}/>}/><main className="fiches-main">
  <h1>Comptes enseignants</h1><p>Choisissez les domaines supplémentaires accessibles à chaque personne. Algèbre, Géométrie et Alphabétisation sont incluses pour tous.</p>
  {error&&<p role="alert" className="access-error">{error}</p>}{message&&<p role="status">{message}</p>}{busy==='load'&&<p role="status">Chargement des comptes…</p>}
  {!users.length&&!busy&&!error&&<p>Aucun compte personnel n’a encore été créé.</p>}
  {users.map(user=><section className="access-card account-domain-card" key={user.id}>
   <h2>{user.givenName} {user.familyName}</h2><p>{user.email} — {user.verified?'Adresse confirmée':'Confirmation en attente'}</p>
   <fieldset disabled={busy!==null}><legend>Domaines autorisés</legend><div className="account-domain-options">{ACCESS_DOMAIN_OPTIONS.map(d=><label key={d.id}><input type="checkbox" checked={BASE.includes(d.id)||user.domains.includes(d.id)} disabled={BASE.includes(d.id)} onChange={e=>setUsers(current=>current.map(u=>u.id!==user.id?u:{...u,domains:e.target.checked?[...u.domains,d.id]:u.domains.filter(x=>x!==d.id)}))}/>{d.label}</label>)}</div></fieldset>
   <button className="button" disabled={busy!==null} onClick={()=>void save(user)}>Enregistrer les accès de {user.givenName}</button>
  </section>)}
 </main></div>
}
