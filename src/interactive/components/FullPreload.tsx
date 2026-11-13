import type { PreloadProgress } from '../media/full-preload'
import './FullPreload.css'

function preloadSize(bytes: number): string {
  if(bytes<1024)return `${bytes} o`
  const value=bytes<1024*1024?bytes/1024:bytes/(1024*1024)
  return `${value.toFixed(1).replace('.',',')} ${bytes<1024*1024?'ko':'Mo'}`
}
export function FullPreload({phase,progress,error,disabled,onStart,onCancel,onRelease}:{phase:'idle'|'loading'|'ready'|'error';progress:PreloadProgress;error?:string;disabled:boolean;onStart:()=>void;onCancel:()=>void;onRelease:()=>void}) {
  return <section className={`ci-full-preload${phase==='ready'?' ci-full-preload-ready':''}`} aria-label="Précharger la séance" aria-busy={phase==='loading'}>
    <h3>Jouer sans connexion</h3><p>Chargez les images, les audios et les 30 mascottes, puis gardez cette page ouverte.</p>
    {phase==='loading'?<><progress max={progress.total||1} value={progress.completed} aria-label="Avancement du préchargement complet"/><p role="status">{progress.completed} / {progress.total} médias chargés</p><p>Poids téléchargé : <output aria-live="off">{preloadSize(progress.bytes)}</output></p><button onClick={onCancel}>Annuler le préchargement</button></>:phase==='ready'?<><p role="status">Prêt à jouer sans connexion : {progress.total} médias chargés · {preloadSize(progress.bytes)}.</p><button onClick={onRelease}>Libérer les médias chargés</button></>:<>{error&&<p role="alert">{error}</p>}<button disabled={disabled} onClick={onStart}>{phase==='error'?'Réessayer le préchargement':'Précharger toute la séance'}</button></>}
  </section>
}
