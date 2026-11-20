import assert from 'node:assert/strict'
import { timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { createServer } from 'vite'
const schema=(await readFile('api/fiches/migrations/0001_fiches.sql','utf8'))+(await readFile('api/fiches/migrations/0002_personal_accounts.sql','utf8'))
const recipe=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
const descriptor=Object.getOwnPropertyDescriptor(crypto.subtle,'timingSafeEqual');Object.defineProperty(crypto.subtle,'timingSafeEqual',{value:timingSafeEqual,configurable:true})
const originalFetch=globalThis.fetch,emails=[];let failMail=false
// Aucun e-mail réel n’est envoyé : seul le contrat du SDK Resend est testé.
globalThis.fetch=async(url,init)=>{assert.equal(String(url),'https://api.resend.com/emails');emails.push({body:JSON.parse(init.body),key:new Headers(init.headers).get('idempotency-key')});return new Response(JSON.stringify(failMail?{name:'validation_error',message:'fixture',statusCode:400}:{id:'test-email-id'}),{status:failMail?400:200,headers:{'Content-Type':'application/json'}})}
const vite=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
try{
 const worker=(await vite.ssrLoadModule('/api/fiches/src/index.ts')).default
 const db=new DatabaseSync(':memory:');db.exec(schema)
 const env={ACCESS_ADMIN:'fixture-admin',ACCESS_FULL:'fixture-full',ACCESS_PARTIAL:'fixture-partial',RESEND_API_KEY:'fixture-resend',RESEND_FROM:'ClairFLE <noreply@example.test>',RESEND_VERIFY_TEMPLATE_ID:'fixture-template',APP_ORIGIN:'https://app.example.test',DB:{prepare(sql){const stmt=db.prepare(sql);let values=[];return{bind(...v){values=v;return this},async run(){return stmt.run(...values)},async all(){return{results:stmt.all(...values)}},async first(){return stmt.get(...values)??null}}}}}
 const request=async(method,path,body,token)=>{const res=await worker.fetch(new Request('https://api.example.test'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);return{status:res.status,body:await res.json()}}
 const person=(n)=>({email:`person.${n}@admin.vs.ch`,password:'Valide!88',givenName:'Prénom '+n,familyName:'Nom '+n})
 const register=async n=>request('POST','/auth/register',person(n))
 const verification=()=>new URL(emails.at(-1).body.template.variables.CONFIRMATION_URL).searchParams.get('verification')
 const login=async n=>request('POST','/auth/login',person(n))
 const worksheet=domain=>({name:'Fiche personnelle',recipe:{...recipe,savedBy:'Nom falsifié',pages:[{...recipe.pages[0],domain}],libreSnapshot:null}})
 await test('registration validates address, password and names on the server',async()=>{
  for(const patch of[{email:'person@outlook.com'},{email:'x@admin.vs.ch.attacker.test'},{email:'x..y@admin.vs.ch'},{password:'Court!1'},{password:'minuscule!1'},{password:'MAJUSCULE!1'},{password:'SansChiffre!'},{password:'SansSpecial1'},{givenName:' '},{familyName:' '.repeat(2)}])assert.equal((await request('POST','/auth/register',{...person('invalid'),...patch})).status,400)
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n,0)
 })
 await test('an unconfigured sender never creates an apparently usable account',async()=>{
  const from=env.RESEND_FROM;env.RESEND_FROM='onboarding@resend.dev';assert.equal((await register('test-sender')).status,503);env.RESEND_FROM=from
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n,0)
  failMail=true;assert.equal((await register('failed-send')).status,503);failMail=false;assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n,0)
 })
 await test('confirmation is mandatory, expiring, one use and stores only token hashes',async()=>{
  assert.equal((await register('a')).status,201);const token=verification();const row=db.prepare('SELECT * FROM users').get();assert.notEqual(row.password_hash,person('a').password);assert.equal(row.password_hash.length,64);assert.equal(row.account,'partial')
  assert(!db.prepare('SELECT token_hash FROM email_verifications').get().token_hash.includes(token));assert.equal((await login('a')).status,403)
  assert.equal(emails.at(-1).body.template.id,'fixture-template');assert(emails.at(-1).key.startsWith('verification/'))
  assert.equal((await request('POST','/auth/resend',person('a'))).status,429)
  db.prepare('UPDATE email_verifications SET expires_at=0').run();assert.equal((await request('POST','/auth/verify',{token})).status,400)
  assert.equal((await request('POST','/auth/resend',person('a'))).status,200);const fresh=verification();assert.notEqual(fresh,token)
  assert.equal((await request('POST','/auth/verify',{token:fresh})).status,200);assert.equal((await request('POST','/auth/verify',{token:fresh})).status,400)
 })
 const a=await login('a');assert.equal(a.status,200)
 await register('b');await request('POST','/auth/verify',{token:verification()});const b=await login('b');assert.equal(b.status,200)
 await test('sessions grant the three minimum domains without allowing self-promotion',async()=>{
  assert.deepEqual(new Set(a.body.user.domains),new Set(['algèbre','géométrie','alphabetisation']));assert.equal(a.body.user.account,'partial')
  assert.equal((await request('POST','/fiches',worksheet('grammaire'),a.body.token)).status,403)
  assert.equal((await request('POST','/fiches',worksheet('alphabetisation'),a.body.token)).status,201)
  assert.equal((await request('GET','/users',null,a.body.token)).status,403)
 })
 let saved
 await test('each user can save and reopen their own worksheets; names come from the authenticated profile',async()=>{
  saved=await request('POST','/fiches',worksheet('algèbre'),a.body.token);assert.equal(saved.status,201);assert.equal(saved.body.fiche.recipe.savedBy,'Prénom a Nom a')
  const own=await request('GET','/fiches',null,a.body.token);assert.equal(own.body.fiches.length,2)
  assert.equal((await request('GET','/fiches',null,b.body.token)).body.fiches.length,0)
  assert.equal((await request('PUT','/fiches/'+saved.body.fiche.id,worksheet('algèbre'),b.body.token)).status,404)
  assert.equal((await request('DELETE','/fiches/'+saved.body.fiche.id,null,b.body.token)).status,404)
  assert.equal((await request('PUT','/fiches/'+saved.body.fiche.id,worksheet('géométrie'),a.body.token)).status,200)
  assert.equal((await request('GET','/fiches',null,'fixture-full')).body.fiches.length,0)
 })
 await test('admin access is preserved and only admin can assign extra domains per account',async()=>{
  const list=await request('GET','/users',null,'fixture-admin');assert.equal(list.status,200);assert.equal(list.body.users.length,2);assert(!JSON.stringify(list.body).includes('password_hash'))
  const id=a.body.user.id
  assert.equal((await request('PUT','/users/'+id,{domains:['grammaire']},b.body.token)).status,403)
  assert.equal((await request('PUT','/users/'+id,{domains:['not-a-domain']},'fixture-admin')).status,400)
  assert.equal((await request('PUT','/users/'+id,{domains:['grammaire']},'fixture-admin')).status,200)
  assert.equal((await request('POST','/fiches',worksheet('grammaire'),a.body.token)).status,201)
  assert.equal((await request('POST','/fiches',worksheet('grammaire'),b.body.token)).status,403)
  const me=await request('GET','/auth/me',null,a.body.token);assert(me.body.user.domains.includes('grammaire'));assert(me.body.user.domains.includes('alphabetisation'))
  assert.equal((await request('GET','/fiches',null,'fixture-admin')).body.fiches.length,3)
 })
 await test('logout revokes the session and expired sessions cannot access worksheets',async()=>{
  assert.equal((await request('POST','/auth/logout',{},a.body.token)).status,200);assert.equal((await request('GET','/fiches',null,a.body.token)).status,401)
  db.prepare('UPDATE user_sessions SET expires_at=0').run();assert.equal((await request('GET','/fiches',null,b.body.token)).status,401)
 })
 db.close()
}finally{globalThis.fetch=originalFetch;await vite.close();if(descriptor)Object.defineProperty(crypto.subtle,'timingSafeEqual',descriptor);else delete crypto.subtle.timingSafeEqual}
