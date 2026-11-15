import assert from 'node:assert/strict'
import test from 'node:test'
import {createServer} from 'vite'
import {createElement} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {CompetitionPortrait}=await vite.ssrLoadModule('/src/interactive/competition/Avatar.tsx')
  const {MASCOTS}=await vite.ssrLoadModule('/src/interactive/domain/mascot.ts')
  const {playPrompt}=await vite.ssrLoadModule('/src/interactive/domain/presentation.ts')
  const {isPhoneViewport,isLandscapeViewport,requestDuelLandscape,releaseDuelLandscape}=await vite.ssrLoadModule('/src/interactive/duel/landscape.ts')
  await test('all thirty mascots gain an actual angry sprite and larger distinct aura in triple mode; normal portraits remain neutral',()=>{
    for(const mascot of MASCOTS){
      const render=powerLevel=>renderToStaticMarkup(createElement(CompetitionPortrait,{avatarId:mascot.id,powerLevel}))
      const normal=render(1),double=render(2),triple=render(3)
      assert.ok(!normal.includes('data-power-aura='));assert.ok(double.includes('data-power-aura="2"'));assert.ok(!double.includes('class="ci-mascot-sprite ci-mascot-angry"'))
      assert.ok(triple.includes('data-power-aura="3"'));assert.ok(triple.includes('class="ci-mascot-sprite ci-mascot-angry"'));assert.ok(triple.includes('ci-power-lightning'))
      const hurt=renderToStaticMarkup(createElement(CompetitionPortrait,{avatarId:mascot.id,powerLevel:3,outcome:false}));assert.ok(hurt.includes('ci-mascot-incorrect'));assert.ok(hurt.includes('ci-competition-tears'))
    }
  })
  await test('calculation presentation omits only the redundant result question while source text and other question forms remain intact',()=>{
    for(const [source,shown]of [['2 + 2 = ?','2 + 2'],['12 × 3 = ?','12 × 3'],['2,5 ÷ 0,5 = ?','2,5 ÷ 0,5'],['−8 − 2 = ?','−8 − 2']])assert.equal(playPrompt(source),shown)
    for(const source of ['Qui est-ce ?','2 + ? = 5','A = ?','Le nombre est ___','Un résultat = ?','2 + 2 = 4'])assert.equal(playPrompt(source),source)
  })
  const original=new Map(['window','screen','document','innerWidth','innerHeight'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]))
  const set=(key,value)=>Object.defineProperty(globalThis,key,{configurable:true,writable:true,value})
  const calls=[]
  const install=({lock=true,fullscreen=true,alreadyFullscreen=false}={})=>{
    calls.length=0;set('innerWidth',390);set('innerHeight',844);set('window',{matchMedia:()=>({matches:true})})
    const doc={fullscreenElement:alreadyFullscreen?{}:null,documentElement:{},exitFullscreen:async()=>{calls.push('exit');doc.fullscreenElement=null}}
    if(fullscreen)doc.documentElement.requestFullscreen=async()=>{calls.push('fullscreen');doc.fullscreenElement=doc.documentElement}
    set('document',doc);set('screen',{orientation:{...(lock?{lock:async value=>{calls.push(value)}}:{}),unlock:()=>calls.push('unlock')}})
  }
  try{
    await test('a phone asks for fullscreen before landscape and releases only the capabilities it acquired',async()=>{
      install();assert.equal(isPhoneViewport(),true);assert.equal(isLandscapeViewport(),false)
      await requestDuelLandscape();assert.deepEqual(calls,['fullscreen','landscape']);releaseDuelLandscape();assert.deepEqual(calls,['fullscreen','landscape','unlock','exit'])
      releaseDuelLandscape();assert.equal(calls.filter(value=>value==='unlock').length,1)
    })
    await test('missing and rejected browser APIs retain manual rotation without throwing or inventing a lock',async()=>{
      install({lock:false,fullscreen:false});await requestDuelLandscape();releaseDuelLandscape();assert.deepEqual(calls,[])
      install();screen.orientation.lock=async()=>{throw new Error('Not supported')};document.documentElement.requestFullscreen=async()=>{throw new Error('Denied')}
      await requestDuelLandscape();releaseDuelLandscape();assert.deepEqual(calls,[])
    })
    await test('a lock resolving after leaving the duel is immediately released; unrelated fullscreen remains intact',async()=>{
      install({alreadyFullscreen:true});let resolve
      screen.orientation.lock=()=>new Promise(done=>{resolve=done})
      const pending=requestDuelLandscape();releaseDuelLandscape();resolve();await pending
      assert.deepEqual(calls,['unlock']);assert.ok(document.fullscreenElement)
    })
    await test('fullscreen resolving after leaving does not leave the old duel fullscreen or acquire a landscape lock',async()=>{
      install();let resolve
      document.documentElement.requestFullscreen=()=>new Promise(done=>{resolve=()=>{document.fullscreenElement=document.documentElement;done()}})
      const pending=requestDuelLandscape();releaseDuelLandscape();resolve();await pending
      assert.deepEqual(calls,['exit']);assert.equal(document.fullscreenElement,null)
    })
  }finally{releaseDuelLandscape();for(const [key,descriptor]of original)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key]}
}finally{await vite.close()}
