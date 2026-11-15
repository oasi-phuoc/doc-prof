type LockableOrientation = {lock?:(orientation:'landscape')=>Promise<void>;unlock?:()=>void}
let ownsFullscreen=false,ownsOrientation=false,generation=0
export const isPhoneViewport=()=>window.matchMedia('(pointer: coarse)').matches&&Math.min(innerWidth,innerHeight)<=700
export const isLandscapeViewport=()=>innerWidth>innerHeight
/** Android generally requires a user-initiated fullscreen request before lock.
 * Unsupported browsers retain a manual-rotation/portrait path. */
export async function requestDuelLandscape() {
  const request=++generation,orientation=screen.orientation as LockableOrientation|undefined
  if(!document.fullscreenElement&&document.documentElement.requestFullscreen){
    try{
      await document.documentElement.requestFullscreen()
      if(request!==generation){if(!ownsFullscreen&&document.fullscreenElement===document.documentElement)await document.exitFullscreen().catch(()=>{});return}
      ownsFullscreen=true
    }catch{/* Native fullscreen is optional. */}
  }
  if(request!==generation)return
  try{if(orientation?.lock){await orientation.lock('landscape');if(request===generation)ownsOrientation=true;else orientation.unlock?.()}}catch{/* Safari and embedded browsers need manual rotation. */}
}
export function releaseDuelLandscape(exitFullscreen=true) {
  generation++
  if(ownsOrientation){(screen.orientation as LockableOrientation|undefined)?.unlock?.();ownsOrientation=false}
  const leave=ownsFullscreen;ownsFullscreen=false
  if(exitFullscreen&&leave&&document.fullscreenElement)void document.exitFullscreen().catch(()=>{})
}
