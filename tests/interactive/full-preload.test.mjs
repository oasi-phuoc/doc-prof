import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
try{
  const {preloadSession,preloadIdentity,sessionAssets,mascotMedia}=await vite.ssrLoadModule('/src/interactive/media/full-preload.ts')
  const {MediaManager}=await vite.ssrLoadModule('/src/interactive/media/manager.ts')
  const {loadGrammarImage}=await vite.ssrLoadModule('/src/grammaire/curriculum/image-support.ts')
  const options={baseUrl:'https://class.test/interactif'},signal=()=>new AbortController().signal
  const question=(more={})=>({id:'q1',prompt:'Quel mot ?',images:['/picture.webp'],choices:[{id:'yes',text:'Oui',image:'/yes.webp'},{id:'no',text:'Non',image:'/no.webp'}],...more})
  const plan=(...questions)=>({id:'source-plan',questions})
  const fixture=(overrides={})=>{
    const created=[],revoked=[],fetched=[],decoded=[],blobs=new Map()
    const deps={
      fetch:async(url,request)=>{fetched.push({url,request});return new Response(new Uint8Array(4),{headers:{'content-type':String(url).endsWith('.mp3')?'audio/mpeg':'image/webp'}})},
      createUrl:blob=>{const url=`blob:https://class.test/${created.length}`;created.push(url);blobs.set(url,blob);return url},
      revokeUrl:url=>{revoked.push(url);blobs.delete(url)},
      decodeImage:async url=>{decoded.push(url);return {width:30,height:20}},
      decodeAudio:async url=>{decoded.push(url);return {durationSec:1}},
      ...overrides,
    }
    return {deps,created,revoked,fetched,decoded,blobs}
  }
  const grammarSupport=async bytes=>{
    const digest=await crypto.subtle.digest('SHA-256',bytes),sha256=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('')
    return {id:'source-visual-'+sha256,src:`/lib/images/grammaire/curriculum/sha256/${sha256}.webp`,sha256,alt:'Personne qui travaille',width:30,height:20,source:{path:'/lib/images/source.webp',manifest:'docs/source.json',rights:'permitted-reuse',note:'Source de test'}}
  }
  await test('public selection collects all choices, complete clip sequences, grammar images and every mascot without a private key',async()=>{
    const support=await grammarSupport(new Uint8Array(4)),q=question({audio:'/a.mp3',audioParts:['/a.mp3','/b.mp3','/a.mp3'],grammarImages:[support]})
    q.choices[1].audio='/choice.mp3'
    const source={...plan(q),corrections:{q1:{choiceId:'yes',image:'/private-key.webp'}}},before=structuredClone(source)
    const assets=sessionAssets(source,options),urls=assets.map(asset=>asset.url)
    assert.equal(new Set(urls).size,urls.length);assert.equal(urls.length,7+mascotMedia.length)
    for(const src of ['/picture.webp','/yes.webp','/no.webp','/a.mp3','/b.mp3','/choice.mp3',support.src,...mascotMedia])assert.ok(urls.includes(new URL(src,options.baseUrl).href))
    assert.ok(!JSON.stringify(assets).includes('private-key'));assert.deepEqual(source,before)
  })
  await test('readiness depends on actual resources, not question identifiers, choice order or which answer is correct',()=>{
    const source=plan(question()),same=structuredClone(source)
    same.id='another-seed';same.questions[0].id='q2';same.questions[0].choices.reverse();same.corrections={q2:{choiceId:'no'}}
    assert.equal(preloadIdentity(source,options),preloadIdentity(same,options))
    same.questions[0].images=['/different.webp'];assert.notEqual(preloadIdentity(source,options),preloadIdentity(same,options))
    assert.equal(sessionAssets(plan(question({images:[],choices:[]})),options).length,mascotMedia.length)
  })
  await test('a complete pack decodes every unique blob, reports real bytes and preserves plans and source URLs; disposal is idempotent',async()=>{
    const source=plan(question({audio:'/listen.mp3',audioParts:['/listen.mp3','/end.mp3']})),before=structuredClone(source),f=fixture(),progress=[]
    const pack=await preloadSession(source,options,signal(),value=>progress.push(value),f.deps)
    const total=5+mascotMedia.length
    assert.equal(pack.total,total);assert.equal(pack.completed,total);assert.equal(pack.bytes,total*4)
    assert.equal(f.created.length,total);assert.deepEqual(f.decoded,f.created)
    assert.equal(pack.resolve('/picture.webp#reference'),pack.resolve('https://class.test/picture.webp'))
    assert.ok(pack.resolve('/listen.mp3').startsWith('blob:'));assert.equal(pack.resolve('/not-in-this-plan.webp'),'/not-in-this-plan.webp')
    assert.deepEqual(source,before);assert.deepEqual(progress.at(-1),{completed:total,total,bytes:total*4})
    assert.ok(progress.every((p,i)=>!i||p.bytes>=progress[i-1].bytes&&p.completed>=progress[i-1].completed))
    assert.ok(f.fetched.every(({request})=>request.credentials==='same-origin'&&request.redirect==='error'&&request.cache==='force-cache'))
    pack.dispose();pack.dispose();assert.deepEqual([...f.revoked].sort(),[...f.created].sort());assert.equal(pack.resolve('/picture.webp'),'/picture.webp')
  })
  await test('downloads and decoders use at most four workers and include wrong alternatives equally',async()=>{
    let active=0,maximum=0
    const f=fixture({fetch:async()=>{
      active++;maximum=Math.max(active,maximum);await new Promise(resolve=>setTimeout(resolve,2));active--
      return new Response(new Uint8Array(4),{headers:{'content-type':'image/webp'}})
    }})
    const source=plan(question({images:Array.from({length:10},(_,index)=>`/${index}.webp`)}))
    const pack=await preloadSession(source,options,signal(),undefined,f.deps)
    assert.equal(maximum,4);assert.equal(pack.total,12+mascotMedia.length);assert.equal(f.decoded.length,12+mascotMedia.length);pack.dispose()
  })
  await test('an unreadable resource aborts the batch and revokes all staged URLs instead of publishing a partial pack',async()=>{
    const f=fixture({decodeImage:async()=>{throw new Error('invalid')}})
    await assert.rejects(preloadSession(plan(question()),options,signal(),undefined,f.deps),/invalid/)
    assert.ok(f.created.length>0);assert.deepEqual([...f.revoked].sort(),[...f.created].sort())
  })
  await test('cancelled and timed-out work cannot publish a late resource, even when a network dependency ignores abort',async()=>{
    let finish
    const held=new Promise(resolve=>{finish=resolve}),cancel=new AbortController(),f=fixture({fetch:()=>held})
    const pending=preloadSession(plan(question()),options,cancel.signal,undefined,f.deps)
    cancel.abort();await assert.rejects(pending,{name:'AbortError'})
    finish(new Response('late',{headers:{'content-type':'image/webp'}}));await new Promise(resolve=>setTimeout(resolve,0))
    assert.deepEqual(f.created,[])
    const timeout=fixture({fetch:()=>new Promise(()=>{})})
    await assert.rejects(preloadSession(plan(question()),{...options,timeoutMs:5},signal(),undefined,timeout.deps),{name:'AbortError'})
    assert.deepEqual(timeout.created,[])
  })
  await test('declared, streamed and cumulative size limits stop downloads and release staged resources',async()=>{
    const oversized=fixture({fetch:async()=>new Response('small',{headers:{'content-type':'image/webp','content-length':'100'}})})
    await assert.rejects(preloadSession(plan(question()),{...options,maxFileBytes:8},signal(),undefined,oversized.deps),/taille disponible/)
    let cancelled=0
    const streamed=fixture({fetch:async()=>new Response(new ReadableStream({start(controller){controller.enqueue(new Uint8Array(6));controller.enqueue(new Uint8Array(6))},cancel(){cancelled++}}),{headers:{'content-type':'image/webp'}})})
    await assert.rejects(preloadSession(plan(question()),{...options,maxFileBytes:8},signal(),undefined,streamed.deps),/taille disponible/)
    assert.ok(cancelled>0)
    const total=fixture()
    await assert.rejects(preloadSession(plan(question()),{...options,maxBytes:25},signal(),undefined,total.deps),/Réduisez/)
    assert.deepEqual([...total.revoked].sort(),[...total.created].sort())
  })
  await test('unsafe origins, conflicting types, missing responses, HTML fallbacks and empty files never mark a session ready',async()=>{
    for(const source of [plan(question({images:['javascript:alert(1)']})),plan(question({images:['https://unapproved.test/a.webp']})),plan(question({images:['/both'],audio:'/both'}))]){
      const f=fixture();await assert.rejects(preloadSession(source,options,signal(),undefined,f.deps),/Certains médias/);assert.deepEqual(f.fetched,[])
    }
    for(const response of [()=>new Response('not found',{status:404}),()=>new Response('HTML',{headers:{'content-type':'text/html'}}),()=>new Response('',{headers:{'content-type':'image/webp'}})]){
      const f=fixture({fetch:async()=>response()});await assert.rejects(preloadSession(plan(question()),options,signal(),undefined,f.deps));assert.deepEqual([...f.revoked].sort(),[...f.created].sort())
    }
  })
  await test('grammar images retain their immutable reference and verified bytes when loaded from a prepared blob; a hash mismatch fails',async()=>{
    const bytes=new Uint8Array([1,2,3,4]),support=await grammarSupport(bytes),source=plan(question({grammarImages:[support]})),before=structuredClone(source)
    const f=fixture({fetch:async()=>new Response(bytes,{headers:{'content-type':'image/webp'}})})
    const pack=await preloadSession(source,options,signal(),undefined,f.deps),requests=[]
    const blob=await loadGrammarImage(support,async url=>{const resolved=pack.resolve(url);requests.push(resolved);return new Response(f.blobs.get(resolved))})
    assert.deepEqual(new Uint8Array(await blob.arrayBuffer()),bytes);assert.ok(requests.every(url=>url.startsWith('blob:')));assert.deepEqual(source,before);pack.dispose()
    const mismatch=fixture()
    await assert.rejects(preloadSession(source,options,signal(),undefined,mismatch.deps),/ne correspond plus/)
    assert.deepEqual([...mismatch.revoked].sort(),[...mismatch.created].sort())
  })
  await test('returning to preparation after the probe cache expires uses prepared bytes while reports and next-screen warmup keep source identities',async()=>{
    let now=0
    const f=fixture(),source=plan(question({audio:'/listen.mp3'})),pack=await preloadSession(source,options,signal(),undefined,f.deps),requests=[],warm=[]
    const manager=new MediaManager(options,{now:()=>now,fetch:async url=>{requests.push(url);return new Response(f.blobs.get(url),{headers:{'content-type':f.blobs.get(url)?.type??'image/webp'}})},decodeImage:async url=>{warm.push(url);return {width:30,height:20}},decodeAudio:async url=>{warm.push(url);return {durationSec:1}}})
    manager.usePrepared(pack.resolve)
    const first=await manager.preflight(source,signal());assert.ok(first.every(result=>result.status==='ok'&&result.asset.url.startsWith('https:')))
    now=300001
    const moved=structuredClone(source);moved.questions[0].id='renamed'
    const again=await manager.preflight(moved,signal());assert.ok(again.every(result=>result.asset.questionIds[0]==='renamed'))
    await manager.preload(moved,signal());assert.ok(requests.length&&requests.every(url=>url.startsWith('blob:')));assert.ok(warm.every(url=>url.startsWith('blob:')))
    manager.usePrepared(source=>source);await manager.preflight(moved,signal());assert.ok(requests.at(-1).startsWith('https:'));pack.dispose()
  })
}finally{await vite.close()}
