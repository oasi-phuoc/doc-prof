import {useEffect,useMemo,useRef,useState} from 'react'
import {ACCESS_DOMAIN_OPTIONS,domainsForAccount,readAccessAccount} from '@/access'
import {LoadingScreen} from '@/components/LoadingScreen'
import {ClassroomHeader} from '../components/ClassroomHeader'
import {SetupAction,SetupDialog,SessionSettings} from '../components/SetupHub'
import {patchClassroomPreferences,type ClassroomPreferences} from '../preferences'
import {mascotStyle} from '../domain/mascot'
import type {PlayMode} from '../domain/types'
import {MODE_KEY} from '../legacy-preferences'
import {POOL_TYPES,POOL_TYPE_BY_ID,newPoolEntry,readPoolConfig,type PoolEntry,type PoolType} from './config'
import {createPool,listPools,loadPool,type LocalPool} from './storage'
import './pool.css'

const go=(path:string)=>{window.history.pushState({},'',path);window.dispatchEvent(new PopStateEvent('popstate'))}
const fold=(text:string)=>text.normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase('fr')
const label=(type:PoolType)=>fold(type.label).includes(fold(type.context))?type.label:`${type.label} · ${type.context}`
const levels={facile:'Facile',moyen:'Moyen',avance:'Avancé'}
export default function PoolPage({initialPreferences,initialWarning}:{initialPreferences:ClassroomPreferences;initialWarning:string}){
 const [preferences,setPreferences]=useState(initialPreferences),[warning,setWarning]=useState(initialWarning),[mode,setMode]=useState<PlayMode>(()=>{try{return sessionStorage.getItem(MODE_KEY)==='solo'?'solo':'class'}catch{return'class'}})
 const [fullscreen,setFullscreen]=useState(false),[domain,setDomain]=useState('all'),[search,setSearch]=useState(''),[entries,setEntries]=useState<PoolEntry[]>([]),[shuffle,setShuffle]=useState(true),[name,setName]=useState('Pool d’exercices'),[recent,setRecent]=useState<LocalPool[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState('')
 const active=useRef(true),editId=new URLSearchParams(window.location.search).get('edit')
 const [panel,setPanel]=useState<'content'|'settings'|'history'|null>(()=>editId?'content':null)
 const changeMode=(next:PlayMode)=>{setMode(next);try{sessionStorage.setItem(MODE_KEY,next)}catch{/* Optional cache. */}}
 const allowed=useMemo(()=>new Set(domainsForAccount(readAccessAccount())),[])
 const available=useMemo(()=>POOL_TYPES.filter(type=>allowed.has(type.domain)),[allowed])
 const domains=ACCESS_DOMAIN_OPTIONS.filter(option=>available.some(type=>type.domain===option.id))
 const visible=available.filter(type=>(domain==='all'||type.domain===domain)&&fold(`${type.label} ${type.context}`).includes(fold(search)))
 const patch=(value:Partial<ClassroomPreferences>)=>{setPreferences(current=>({...current,...value}));void patchClassroomPreferences(value,initialPreferences).then(next=>{if(active.current)setPreferences(current=>({...current,paletteVersion:next.paletteVersion}))},reason=>{if(active.current)setWarning(reason instanceof Error?reason.message:'Réglages non enregistrés.')})}
 useEffect(()=>{active.current=true;return()=>{active.current=false}},[])
 useEffect(()=>{let current=true;void listPools().then(pools=>{if(current)setRecent(pools.filter(pool=>pool.config.entries.every(entry=>allowed.has(POOL_TYPE_BY_ID.get(entry.id)!.domain))))},reason=>{if(current)setWarning(reason instanceof Error?reason.message:'Pools indisponibles.')});if(editId)void loadPool(editId).then(pool=>{if(!pool.config.entries.every(entry=>allowed.has(POOL_TYPE_BY_ID.get(entry.id)!.domain)))throw new Error('Ce pool contient un domaine auquel votre compte n’a pas accès.');if(current){setEntries(pool.config.entries);setShuffle(pool.config.shuffle);setName(pool.name)}}).catch(reason=>{if(current)setError(reason instanceof Error?reason.message:'Pool indisponible.')});return()=>{current=false}},[editId,allowed])
 useEffect(()=>{const changed=()=>setFullscreen(!!document.fullscreenElement);document.addEventListener('fullscreenchange',changed);return()=>document.removeEventListener('fullscreenchange',changed)},[])
 const toggle=(type:PoolType,checked:boolean)=>{setError('');setEntries(current=>checked?current.length<16?[...current,newPoolEntry(type)]:current:current.filter(entry=>entry.id!==type.id))}
 const update=(id:string,value:Partial<PoolEntry>)=>setEntries(current=>current.map(entry=>entry.id===id?{...entry,...value}:entry))
 const launch=async()=>{setError('');setBusy(true);try{const config=readPoolConfig({version:1,entries,shuffle}),seed=crypto.getRandomValues(new Uint32Array(1))[0]!,{checkPoolQuestions}=await import('../GameApp');if(!active.current)return;checkPoolQuestions(config,seed);const pool=await createPool(config,name||'Pool d’exercices',seed);if(active.current)go(`/interactif?pool=${pool.poolId}`)}catch(reason){if(active.current)setError(reason instanceof Error?reason.message:'Le pool ne peut pas être préparé.')}finally{if(active.current)setBusy(false)}}
 return <div className={`ci-app ci-pool-page${preferences.contrast?' ci-high-contrast':''}${fullscreen?' ci-immersive':''}`} data-mascot={preferences.mascot} style={mascotStyle(preferences.mascot)}>
  <ClassroomHeader compact homeHref="/interactif" playing={false} mode={mode} onMode={next=>{setMode(next);try{sessionStorage.setItem(MODE_KEY,next)}catch{/* Optional cache. */}}} mascot={preferences.mascot} onMascot={mascot=>patch({mascot})} contrast={preferences.contrast} onContrast={()=>patch({contrast:!preferences.contrast})} timer={preferences.timer} onTimer={timer=>patch({timer})} fullscreen={fullscreen} onFullscreen={()=>{if(fullscreen){setFullscreen(false);void document.exitFullscreen?.().catch(()=>{})}else{setFullscreen(true);void document.documentElement.requestFullscreen?.().catch(()=>{})}}} onFiches={()=>go('/fiches')}/>
  <main className="ci-container ci-setup-home">
   <div className="ci-setup-welcome"><p className="ci-eyebrow">En classe ou en solo</p><h1>On joue ?</h1><p>Choisissez vos exercices, puis préparez votre partie.</p></div>
   {warning&&<p className="ci-notice" role="status">{warning}</p>}
   <div className="ci-setup-actions">
    <SetupAction icon="folder" title="Exercices ou fiche" detail={entries.length?`${entries.length} types sélectionnés`:'Composer un pool ou ouvrir une fiche'} onClick={()=>setPanel('content')}/>
    <SetupAction icon="timer" title="Préparer la séance" detail="Mode, chrono, mascotte et options" onClick={()=>setPanel('settings')}/>
    <SetupAction icon="console" title="Parties et bilans" detail="Retrouver vos pools et leurs séances" onClick={()=>setPanel('history')}/>
   </div>
   {panel==='content'&&<SetupDialog title="Exercices ou fiche" onClose={()=>setPanel(null)} wide>
    <div className="ci-setup-links"><a href="/fiches">Ouvrir une fiche enregistrée</a></div>
    <h3>Composer un pool d’exercices</h3>
   <div className="ci-pool-layout"><section className="ci-panel ci-pool-catalog" aria-label="Types d’exercices disponibles"><h2>Choisir les exercices</h2><div className="ci-pool-filters"><label>Domaine<select aria-label="Domaine des exercices" disabled={busy} value={domain} onChange={event=>{setDomain(event.target.value);setSearch('')}}><option value="all">Tous les domaines</option>{domains.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}</select></label><label>Rechercher<input type="search" aria-label="Rechercher un type d’exercice" disabled={busy} value={search} onChange={event=>setSearch(event.target.value)} placeholder="Addition, formes, vocabulaire…"/></label></div>
    <p className="ci-pool-count">{visible.length} types disponibles</p><div className="ci-pool-types">{visible.map(type=>{const checked=entries.some(entry=>entry.id===type.id);return<label className={checked?'ci-pool-type ci-pool-selected':'ci-pool-type'} key={type.id}><input type="checkbox" data-pool-type={type.type} data-pool-domain={type.domain} disabled={busy||!checked&&entries.length>=16} checked={checked} onChange={event=>toggle(type,event.target.checked)}/><span><b>{label(type)}</b><small>{domains.find(option=>option.id===type.domain)?.label}{type.guided?' · Activité guidée':''}</small></span></label>})}</div>{!visible.length&&<p role="status">Aucun type disponible pour cette recherche.</p>}</section>
    <section className="ci-panel ci-pool-selection" aria-label="Votre pool"><h2>Votre pool</h2><p>{entries.length} type(s) · {new Set(entries.map(entry=>POOL_TYPE_BY_ID.get(entry.id)!.domain)).size} domaine(s)</p>{!entries.length&&<p>Choisissez un ou plusieurs types. Vous pouvez mélanger les domaines.</p>}
     <div className="ci-pool-picked">{entries.map(entry=>{const type=POOL_TYPE_BY_ID.get(entry.id)!;return<div className="ci-pool-entry" data-selected-pool-type={type.type} key={entry.id}><details><summary><b>{label(type)}</b><span>{domains.find(option=>option.id===type.domain)?.label} · {type.complete?'Série complète':`${entry.count} éléments`}</span></summary><div className="ci-pool-entry-settings"><label>Niveau<select disabled={busy} aria-label={`Niveau · ${label(type)}`} value={entry.difficulty} onChange={event=>update(entry.id,{difficulty:event.target.value as PoolEntry['difficulty']})}>{(type.levels??[type.difficulty]).map(level=><option key={level} value={level}>{type.domain.startsWith('tcf')||type.domain==='tpf'?{facile:'A0–A1',moyen:'A1–A2',avance:'A2–B1'}[level]:levels[level]}</option>)}</select></label>{!type.complete&&<label>Nombre d’éléments<input type="number" min="1" max="20" disabled={busy} aria-label={`Nombre d’éléments · ${label(type)}`} value={entry.count} onChange={event=>update(entry.id,{count:Math.max(1,Math.min(20,Number(event.target.value)||1))})}/></label>}
      {type.numbers&&<><label className="ci-pool-range-toggle"><input type="checkbox" disabled={busy} checked={!!entry.range} onChange={event=>update(entry.id,{range:event.target.checked?{min:1,max:10,decimals:false}:undefined})}/>Choisir la plage de nombres</label>{entry.range&&<div className="ci-pool-range"><label>Minimum<input type="number" min="-100000" max="100000" step={entry.range.decimals?'any':'1'} disabled={busy} value={entry.range.min} onChange={event=>update(entry.id,{range:{...entry.range!,min:Number(event.target.value)}})}/></label><label>Maximum<input type="number" min="-100000" max="100000" step={entry.range.decimals?'any':'1'} disabled={busy} value={entry.range.max} onChange={event=>update(entry.id,{range:{...entry.range!,max:Number(event.target.value)}})}/></label><label><input type="checkbox" disabled={busy} checked={entry.range.decimals} onChange={event=>update(entry.id,{range:{...entry.range!,decimals:event.target.checked}})}/>Nombres décimaux</label></div>}</>}
     </div></details><button className="ci-pool-remove" type="button" disabled={busy} aria-label={`Retirer ${label(type)}`} onClick={()=>toggle(type,false)}>×</button></div>})}</div>
     <label className="ci-pool-shuffle"><input type="checkbox" disabled={busy} checked={shuffle} onChange={event=>setShuffle(event.target.checked)}/>Mélanger les questions des différents types</label><label className="ci-pool-name">Nom du pool<input disabled={busy} maxLength={160} value={name} onChange={event=>setName(event.target.value)}/></label>
     <p className="ci-pool-help">Les séries composées gardent leurs questions. Chaque nouvelle partie renouvelle les tirages.</p>
    </section></div>

    {busy&&<LoadingScreen variant="inline" title="Préparation du pool…"/>}
   {error&&<p className="ci-notice" role="alert">{error}</p>}
   <div className="ci-pool-launch"><b>{entries.length} type(s) sélectionné(s)</b><button type="button" className="ci-primary" disabled={busy||!entries.length} onClick={()=>void launch()}>Préparer la partie</button></div>
   </SetupDialog>}
   {panel==='settings'&&<SetupDialog title="Préparer la séance" onClose={()=>setPanel(null)}>
    <SessionSettings mode={mode} onMode={changeMode} mascot={preferences.mascot} onMascot={mascot=>patch({mascot})} timer={preferences.timer} onTimer={timer=>patch({timer})} contrast={preferences.contrast} onContrast={()=>patch({contrast:!preferences.contrast})}>
     <button type="button" aria-pressed={fullscreen} onClick={()=>{if(fullscreen){setFullscreen(false);void document.exitFullscreen?.().catch(()=>{})}else{setFullscreen(true);void document.documentElement.requestFullscreen?.().catch(()=>{})}}}>{fullscreen?'Quitter le plein écran':'Plein écran'}</button>
    </SessionSettings>
   </SetupDialog>}
   {panel==='history'&&<SetupDialog title="Parties et bilans" onClose={()=>setPanel(null)}>
   {<section className="ci-panel ci-pool-recent"><h2>Pools sur cet appareil</h2>{recent.map(pool=><div key={pool.poolId}><b>{pool.name}</b><span>{pool.config.entries.length} type(s)</span><a href={`/interactif?pool=${pool.poolId}`} onClick={event=>{if(!event.ctrlKey&&!event.metaKey){event.preventDefault();go(`/interactif?pool=${pool.poolId}`)}}}>Ouvrir</a><a href={`/interactif?pool=${pool.poolId}&panel=history`}>Bilans</a><a href={`/interactif?edit=${pool.poolId}`} onClick={event=>{if(!event.ctrlKey&&!event.metaKey){event.preventDefault();go(`/interactif?edit=${pool.poolId}`)}}}>Modifier</a></div>)}</section>}

    {!recent.length&&<p>Vos pools et leurs bilans apparaîtront ici après la préparation d’une première partie.</p>}
   </SetupDialog>}
  </main>
 </div>
}
