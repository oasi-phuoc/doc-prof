import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
 const {createFrameScheduler}=await vite.ssrLoadModule('/src/interactive/duel/vfx/frame-scheduler.ts')
 function harness(draw){const queue=new Map();let id=0,calls=0,maximum=0;const loop=createFrameScheduler(at=>{calls++;return draw(at,loop)},fn=>{queue.set(++id,fn);maximum=Math.max(maximum,queue.size);return id},key=>queue.delete(key));return{loop,queue,get calls(){return calls},get maximum(){return maximum},frame(at){const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn(at))}}}
 await test('quality and resize requests inside an active frame never create parallel RAF chains',()=>{
  const h=harness((_at,loop)=>{loop.request();loop.request();return true})
  h.loop.request();for(let i=0;i<180;i++){h.loop.request();h.loop.request();h.frame(i*1000/60);assert.equal(h.queue.size,1)}
  assert.equal(h.calls,180);assert.equal(h.maximum,1);h.loop.stop();assert.equal(h.queue.size,0)
 })
 await test('paused and sought frames stay idle until a coalesced resize request',()=>{
  const h=harness(()=>false);h.loop.request();h.frame(0);assert.equal(h.queue.size,0)
  for(let i=0;i<200;i++)h.loop.request()
  assert.equal(h.queue.size,1);h.frame(50);assert.equal(h.calls,2);assert.equal(h.queue.size,0)
 })
 await test('stopping during rendering cancels queued redraws and forbids every later request',()=>{
  const h=harness((_at,loop)=>{loop.request();loop.stop();return true});h.loop.request();h.frame(0)
  assert.equal(h.queue.size,0);h.loop.request();h.frame(30);assert.equal(h.calls,1)
 })
}finally{await vite.close()}
