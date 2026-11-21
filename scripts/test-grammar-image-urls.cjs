const assert=require('node:assert/strict')
const {createHash}=require('node:crypto')
const {load,root}=require('./gattegno-loader.cjs')
const {acquireGrammarImageUrl}=load(root+'/src/components/grammar/verified-image-url.ts')

const bytes=Buffer.from('verified-grammar-image-url-fixture')
const sha256=createHash('sha256').update(bytes).digest('hex')
const support={id:'url-fixture',src:`/lib/images/grammaire/curriculum/sha256/${sha256}.webp`,sha256,alt:'Image de test',width:1,height:1,source:{path:'/lib/images/test.webp',manifest:'docs/test.json',rights:'permitted-reuse',note:'Technical fixture, never published.'}}
;(async()=>{
 let calls=0
 const fetchMedia=async source=>{calls++;assert.equal(source,'blob:prepared-fixture');return new Response(bytes)}
 const first=acquireGrammarImageUrl(support,'blob:prepared-fixture',fetchMedia)
 const second=acquireGrammarImageUrl(support,'blob:prepared-fixture',fetchMedia)
 const [url,other]=await Promise.all([first.ready,second.ready])
 assert.equal(url,other)
 assert.equal(calls,1)
 first.release();first.release()
 assert.deepEqual(Buffer.from(await (await fetch(url)).arrayBuffer()),bytes)
 second.release()
 await assert.rejects(fetch(url))
 const fresh=acquireGrammarImageUrl(support,'blob:prepared-fixture',fetchMedia)
 assert.notEqual(await fresh.ready,url)
 fresh.release()

 // An unmounted request must not retain its eventual URL or remove a new lease.
 const abandoned=acquireGrammarImageUrl(support,'blob:prepared-fixture',fetchMedia)
 abandoned.release()
 const active=acquireGrammarImageUrl(support,'blob:prepared-fixture',fetchMedia)
 const abandonedUrl=await abandoned.ready
 await assert.rejects(fetch(abandonedUrl))
 const activeUrl=await active.ready
 assert.equal((await fetch(activeUrl)).status,200)
 active.release()

 for(const [label,response] of [['changed',new Response('changed bytes')],['missing',new Response('',{status:404})]]) {
  const broken={...support,id:label,sha256:'0'.repeat(64),src:`/lib/images/grammaire/curriculum/sha256/${'0'.repeat(64)}.webp`}
  const lease=acquireGrammarImageUrl(broken,'blob:'+label,async()=>response)
  await assert.rejects(lease.ready,/image|Image/)
  lease.release()
 }
 console.log('Grammar image URLs: concurrent sharing, last-release cleanup, unmounted requests, changed and missing bytes verified.')
})().catch(error=>{console.error(error);process.exitCode=1})
