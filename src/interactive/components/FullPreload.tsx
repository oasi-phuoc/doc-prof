import type { PreloadProgress } from '../media/full-preload'
import './FullPreload.css'

function preloadSize(bytes: number): string {
  if(bytes<1024)return `${bytes} o`
  const value=bytes<1024*1024?bytes/1024:bytes/(1024*1024)
  return `${value.toFixed(1).replace('.',',')} ${bytes<1024*1024?'ko':'Mo'}`
}
export function FullPreload({phase,progress,error,disabled,onStart,onCancel,onRelease,local}:{
  phase:'idle'|'loading'|'ready'|'error';progress:PreloadProgress;error?:string;disabled:boolean;onStart:()=>void;onCancel:()=>void;onRelease:()=>void
  local: { stored: boolean; pending: boolean; message: string; using: boolean; onKeep?: () => void; onUse: () => void; onForget: () => void }
}) {
  return <section className={`ci-full-preload${phase==='ready'?' ci-full-preload-ready':''}`} aria-label="Précharger la séance" aria-busy={phase==='loading'}>
    <h3>Jouer sans connexion</h3><p>Préchargez les médias pour jouer après une coupure de connexion dans cette page.</p>
    {phase==='loading'?<><progress max={progress.total||1} value={progress.completed} aria-label="Avancement du préchargement complet"/><p role="status">{progress.completed} / {progress.total} médias chargés</p><p>Poids téléchargé : <output aria-live="off">{preloadSize(progress.bytes)}</output></p><button onClick={onCancel}>Annuler le préchargement</button></>:phase==='ready'?<><p role="status">Prêt à jouer sans connexion : {progress.total} médias chargés · {preloadSize(progress.bytes)}.</p><button onClick={onRelease}>Libérer les médias chargés</button></>:<>{error&&<p role="alert">{error}</p>}<button disabled={disabled} onClick={onStart}>{phase==='error'?'Réessayer le préchargement':'Précharger toute la séance'}</button></>}
    {phase === 'ready' && local.onKeep && <div>
      <p>Conservez les médias publics pendant sept jours. Ce lot remplace le lot précédent. L’ouverture du jeu peut nécessiter une connexion.</p>
      <button type="button" disabled={local.pending} onClick={local.onKeep}>Conserver les médias sur cet appareil</button>
    </div>}
    {phase === 'ready' && !local.onKeep && <p>La conservation sur cet appareil s’applique aux médias publics. Votre lot préchargé est disponible pour cette visite.</p>}
    {local.stored && <div className="ci-toolbar">
      {!local.using && <button type="button" disabled={local.pending} onClick={local.onUse}>Utiliser les médias conservés</button>}
      <button type="button" disabled={local.pending} onClick={local.onForget}>Supprimer les médias conservés</button>
    </div>}
    {(local.pending || local.message) && <p role="status">{local.pending ? 'Mise à jour du stockage local…' : local.message}</p>}
  </section>
}
