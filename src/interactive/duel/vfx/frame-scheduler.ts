type FrameRequest = (callback:FrameRequestCallback)=>number
type FrameCancel = (id:number)=>void

/** Coalesces animation, resize and quality requests, including requests made inside a draw. */
export function createFrameScheduler(draw:(stamp:number)=>boolean|void,request:FrameRequest=requestAnimationFrame,cancel:FrameCancel=cancelAnimationFrame){
  let pending:number|undefined,stopped=false
  const run=(stamp:number)=>{
    pending=undefined
    if(stopped)return
    if(draw(stamp)&&!stopped)schedule()
  }
  function schedule(){if(!stopped&&pending===undefined)pending=request(run)}
  return{request:schedule,stop(){stopped=true;if(pending!==undefined)cancel(pending);pending=undefined}}
}
