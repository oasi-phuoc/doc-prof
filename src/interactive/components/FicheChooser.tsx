import {useEffect,useMemo,useState} from 'react'
import {listFiches} from '@/fiches/api'
import type {SavedFiche} from '@/fiches/recipe'
import {ACCESS_DOMAIN_OPTIONS,domainsForAccount,readAccessAccount} from '@/access'
import {LoadingScreen} from '@/components/LoadingScreen'

const fold=(value:string)=>value.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('fr')
export default function FicheChooser({onChoose}:{onChoose:(id:string)=>void}) {
  const [fiches,setFiches]=useState<SavedFiche[]>([]),[search,setSearch]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[attempt,setAttempt]=useState(0),[limit,setLimit]=useState(20)
  const allowed=useMemo(()=>new Set(domainsForAccount(readAccessAccount())),[])
  useEffect(()=>{
    let active=true
    void listFiches().then(rows=>{if(active){setFiches(rows.filter(fiche=>fiche.recipe.pages.length>0&&fiche.recipe.pages.every(page=>allowed.has(page.domain))));setError('')}},reason=>{if(active)setError(reason instanceof Error?reason.message:'Les fiches ne sont pas disponibles.')}).finally(()=>{if(active)setLoading(false)})
    return()=>{active=false}
  },[attempt,allowed])
  const domains=(fiche:SavedFiche)=>[...new Set(fiche.recipe.pages.map(page=>page.domain))].map(domain=>ACCESS_DOMAIN_OPTIONS.find(option=>option.id===domain)?.label??domain).join(' · ')
  const visible=fiches.filter(fiche=>fold(`${fiche.name} ${domains(fiche)}`).includes(fold(search))).sort((a,b)=>a.name.localeCompare(b.name,'fr'))
  return <section className="ci-fiche-chooser" aria-label="Fiches enregistrées disponibles">
    <label>Rechercher une fiche<input type="search" value={search} placeholder="Nom de la fiche ou domaine…" onChange={event=>{setSearch(event.target.value);setLimit(20)}}/></label>
    {loading?<LoadingScreen variant="inline" title="Chargement des fiches…"/>:error?<><p role="alert">{error}</p><button type="button" onClick={()=>{setLoading(true);setAttempt(value=>value+1)}}>Réessayer le chargement des fiches</button></>:<>
      <p role="status">{visible.length?`${visible.length} fiche(s) disponible(s)`:fiches.length?'Aucune fiche ne correspond à cette recherche.':'Aucune fiche enregistrée. Créez puis enregistrez une fiche pour la retrouver ici.'}</p>
      <ul>{visible.slice(0,limit).map(fiche=><li key={fiche.id}><div><h3>{fiche.name}</h3><p>{domains(fiche)}</p></div><button type="button" onClick={()=>onChoose(fiche.id)} aria-label={`Préparer la fiche : ${fiche.name}`}>Choisir cette fiche</button></li>)}</ul>
      {visible.length>limit&&<button type="button" onClick={()=>setLimit(value=>value+20)}>Afficher les fiches suivantes</button>}
    </>}
    <div className="ci-setup-links"><a href="/fiches">Gérer mes fiches</a><a href="/generateur">Créer une fiche</a></div>
  </section>
}
