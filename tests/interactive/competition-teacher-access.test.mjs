import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createServer} from 'vite'
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'})
const originalStorage=Object.getOwnPropertyDescriptor(globalThis,'localStorage')
try{
 const {resolveCompetitionApiBase,DEFAULT_COMPETITION_API_URL}=await vite.ssrLoadModule('/src/interactive/competition/config.ts')
 const {issueTeacherAccess,verifyTeacherAccess}=await vite.ssrLoadModule('/api/fiches/src/competition-teacher-access.ts')
 const {TEACHER_ACCESS_LIFETIME,TEACHER_STORAGE_NAME,saveTeacherAccess,readTeacherAccess,forgetTeacherAccess}=await vite.ssrLoadModule('/src/interactive/competition/teacher-access.ts')
 const origin='https://class.example',base='https://api.example/competition',root=`fixture-only-${crypto.randomUUID()}`
 await test('public competition endpoint works without a Vercel variable and explicit local/custom configuration retains priority',()=>{
  assert.equal(resolveCompetitionApiBase(),DEFAULT_COMPETITION_API_URL)
  assert.equal(resolveCompetitionApiBase('  ',' '),DEFAULT_COMPETITION_API_URL)
  assert.equal(resolveCompetitionApiBase(' https://other.example/competition/// ','https://fiches.example/'),'https://other.example/competition')
  assert.equal(resolveCompetitionApiBase('', ' http://127.0.0.1:5193/// '),'http://127.0.0.1:5193/competition')
 })
 await test('reusable teacher grants bind origin, scope, signature, lifetime and key rotation without including the root secret',async()=>{
  const now=2_000_000,access=await issueTeacherAccess(root,origin,now)
  assert.equal(access.expiresAt,now+TEACHER_ACCESS_LIFETIME);assert.ok(!access.token.includes(root))
  assert.deepEqual(await verifyTeacherAccess(access.token,root,origin,now),access)
  assert.equal(await verifyTeacherAccess(access.token,root,'https://other.example',now),null)
  assert.equal(await verifyTeacherAccess(access.token,root+'-rotated',origin,now),null)
  assert.equal(await verifyTeacherAccess(access.token,root,origin,access.expiresAt),null)
  assert.equal(await verifyTeacherAccess(access.token,root,origin,now-1),null)
  const tampered=access.token.slice(0,-1)+(access.token.endsWith('a')?'b':'a')
  assert.equal(await verifyTeacherAccess(tampered,root,origin,now),null)
  assert.equal(await verifyTeacherAccess(crypto.randomUUID(),root,origin,now),null)
  // Even a correctly signed payload with an overlong life is refused.
  const payload=`teacher-v1.${now}.${access.expiresAt+1}.${'a'.repeat(32)}`,enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(root),{name:'HMAC',hash:'SHA-256'},false,['sign'])
  const signature=Buffer.from(await crypto.subtle.sign('HMAC',key,enc.encode(`clairfle:create-competition-room\n${origin}\n${payload}`))).toString('hex')
  assert.equal(await verifyTeacherAccess(`${payload}.${signature}`,root,origin,now),null)
 })
 await test('device storage retains only a signed grant, binds it to its API and supports explicit forgetting or unavailable storage',async()=>{
  const values=new Map();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}})
  saveTeacherAccess(base,{token:root,expiresAt:Date.now()+1000});assert.equal(values.size,0)
  const access=await issueTeacherAccess(root,origin);saveTeacherAccess(base,access)
  assert.deepEqual(readTeacherAccess(base),access);assert.equal(readTeacherAccess('https://other.example/competition'),null)
  assert.ok(!values.get(TEACHER_STORAGE_NAME).includes(root));forgetTeacherAccess();assert.equal(readTeacherAccess(base),null)
  const serverAhead=await issueTeacherAccess(root,origin,Date.now()+60_000);saveTeacherAccess(base,serverAhead);assert.deepEqual(readTeacherAccess(base),serverAhead)
  forgetTeacherAccess();const farAhead=await issueTeacherAccess(root,origin,Date.now()+10*60_000);saveTeacherAccess(base,farAhead);assert.equal(values.size,0)
  const expired=await issueTeacherAccess(root,origin,Date.now()-TEACHER_ACCESS_LIFETIME);values.set(TEACHER_STORAGE_NAME,JSON.stringify({...expired,apiBase:base}));assert.equal(readTeacherAccess(base),null)
  values.set(TEACHER_STORAGE_NAME,'not JSON');assert.equal(readTeacherAccess(base),null)
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new Error('Unavailable')}})
  assert.doesNotThrow(()=>saveTeacherAccess(base,access));assert.equal(readTeacherAccess(base),null);assert.doesNotThrow(forgetTeacherAccess)
 })
}finally{if(originalStorage)Object.defineProperty(globalThis,'localStorage',originalStorage);else delete globalThis.localStorage;await vite.close()}
