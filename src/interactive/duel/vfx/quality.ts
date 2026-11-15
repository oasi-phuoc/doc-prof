/** Resolution affects only VFX rasterization; DOM mascots and text retain native DPI. */
export const renderScale=(width:number,height:number,deviceDpr:number)=>Math.min(Math.max(1,deviceDpr),Math.min(width,height)<=700?1.5:2)
export function adaptQuality(current:{dpr:number;density:number},drawP95:number,frameP95:number){
  return{dpr:frameP95>32?Math.max(1,current.dpr-.5):current.dpr,density:drawP95>15||frameP95>32&&current.dpr<=1?Math.max(.45,current.density-.15):current.density}
}
