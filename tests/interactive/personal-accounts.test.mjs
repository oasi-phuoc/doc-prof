import assert from 'node:assert/strict'
import { timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { DatabaseSync } from 'node:sqlite'
import test from 'node:test'
import { createServer } from 'vite'
const schema=(await readFile('api/fiches/migrations/0001_fiches.sql','utf8'))+(await readFile('api/fiches/migrations/0002_personal_accounts.sql','utf8'))+(await readFile('api/fiches/migrations/0003_admin_accounts.sql','utf8'))
const recipe=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8'))
const descriptor=Object.getOwnPropertyDescriptor(crypto.subtle,'timingSafeEqual');Object.defineProperty(crypto.subtle,'timingSafeEqual',{value:timingSafeEqual,configurable:true})
const originalFetch=globalThis.fetch
// La gestion des comptes ne doit appeler aucun service d’e-mail.
globalThis.fetch=async()=>{throw Error('Appel réseau inattendu pendant la gestion des comptes')}
const vite=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
try{
 const worker=(await vite.ssrLoadModule('/api/fiches/src/index.ts')).default
 const db=new DatabaseSync(':memory:');db.exec(schema)
 const env={ACCESS_ADMIN:'fixture-admin',ACCESS_FULL:'fixture-full',ACCESS_PARTIAL:'fixture-partial',DB:{prepare(sql){const stmt=db.prepare(sql);let values=[];return{bind(...v){values=v;return this},async run(){return stmt.run(...values)},async all(){return{results:stmt.all(...values)}},async first(){return stmt.get(...values)??null}}}}}
 const request=async(method,path,body,token)=>{const res=await worker.fetch(new Request('https://api.example.test'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})}),env);return{status:res.status,body:await res.json()}}
 const person=(n)=>({email:`person.${n}@admin.vs.ch`,password:'Valide!88',givenName:'Prénom '+n,familyName:'Nom '+n})
 const register=async n=>request('POST','/users',person(n),'fixture-admin')
 const login=async n=>request('POST','/auth/login',person(n))
 const worksheet=domain=>({name:'Fiche personnelle',recipe:{...recipe,savedBy:'Nom falsifié',pages:[{...recipe.pages[0],domain}],libreSnapshot:null}})
 await test('only the administrator can create accounts; public registration and mail endpoints are gone',async()=>{
  assert.equal((await request('POST','/users',person('blocked'))).status,401)
  for(const token of ['fixture-full','fixture-partial'])assert.equal((await request('POST','/users',person('blocked'),token)).status,403)
  for(const action of ['register','verify','resend'])assert.equal((await request('POST','/auth/'+action,person('blocked'))).status,404)
  assert.equal((await request('POST','/auth/login/extra',person('blocked'))).status,404)
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n,0)
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE name='email_verifications'").get().n,0)
 })
 await test('admin creation validates identity, password and domains before storing an account',async()=>{
  for(const patch of[{email:'person@outlook.com'},{email:'x@admin.vs.ch.attacker.test'},{email:'x..y@admin.vs.ch'},{password:'Court!1'},{password:'minuscule!1'},{password:'MAJUSCULE!1'},{password:'SansChiffre!'},{password:'SansSpecial1'},{givenName:' '},{familyName:' '.repeat(2)},{domains:['not-a-domain']},{domains:'grammaire'}])assert.equal((await request('POST','/users',{...person('invalid'),...patch},'fixture-admin')).status,400)
  assert.equal((await request('POST','/users',{...person('invalid'),givenName:'a'.repeat(4097)},'fixture-admin')).status,413)
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n,0)
 })
 await test('admin-created accounts are immediately active, hashed and cannot gain an admin role',async()=>{
  const created=await request('POST','/users',{...person('a'),email:'  PERSON.A@ADMIN.VS.CH ',account:'admin'},'fixture-admin')
  assert.equal(created.status,201);assert(created.body.user.active);assert.equal(created.body.user.account,'partial');assert.equal(created.body.user.email,person('a').email)
  assert(!JSON.stringify(created.body).includes('password'))
  const row=db.prepare('SELECT * FROM users').get();assert(row.verified_at);assert.notEqual(row.password_hash,person('a').password);assert.equal(row.password_hash.length,64);assert.equal(row.password_salt.length,64)
  assert.equal((await register('a')).status,409);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users').get().n,1)
 })
 const a=await login('a');assert.equal(a.status,200)
 await register('b');const b=await login('b');assert.equal(b.status,200)
 assert.notEqual(db.prepare('SELECT password_salt FROM users WHERE email=?').get(person('a').email).password_salt,db.prepare('SELECT password_salt FROM users WHERE email=?').get(person('b').email).password_salt)
 await test('sessions grant the three minimum domains without allowing self-promotion',async()=>{
  assert.deepEqual(new Set(a.body.user.domains),new Set(['algèbre','géométrie','alphabetisation']));assert.equal(a.body.user.account,'partial')
  assert.equal((await request('POST','/fiches',worksheet('grammaire'),a.body.token)).status,403)
  assert.equal((await request('POST','/fiches',worksheet('alphabetisation'),a.body.token)).status,201)
  assert.equal((await request('GET','/users',null,a.body.token)).status,403)
  assert.equal((await request('POST','/users',person('self-create'),a.body.token)).status,403)
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
 await test('chosen access is applied at creation and minimum access cannot be removed',async()=>{
  const created=await request('POST','/users',{...person('extra'),domains:['grammaire','grammaire']},'fixture-admin');assert.equal(created.status,201)
  assert.deepEqual(created.body.user.domains,['algèbre','géométrie','alphabetisation','grammaire'])
  const extra=await login('extra');assert.equal(extra.status,200);assert.equal((await request('POST','/fiches',worksheet('grammaire'),extra.body.token)).status,201)
  await request('PUT','/users/'+extra.body.user.id,{domains:[]},'fixture-admin')
  assert.equal((await request('POST','/fiches',worksheet('grammaire'),extra.body.token)).status,403)
  assert.equal((await request('POST','/fiches',worksheet('alphabetisation'),extra.body.token)).status,201)
 })
 await test('login throttles incorrect passwords and does not activate old pending accounts',async()=>{
  for(let i=0;i<5;i++)assert.equal((await request('POST','/auth/login',{...person('b'),password:'Incorrect!9'})).status,401)
  assert.equal((await login('b')).status,429)
  db.prepare('UPDATE users SET failed_logins=0,locked_until=0,verified_at=NULL WHERE email=?').run(person('b').email)
  assert.equal((await login('b')).status,403)
  assert.equal((await request('GET','/fiches',null,b.body.token)).status,401)
  db.prepare('UPDATE users SET verified_at=? WHERE email=?').run(new Date().toISOString(),person('b').email)
 })
 await test('logout revokes the session and expired sessions cannot access worksheets',async()=>{
  assert.equal((await request('POST','/auth/logout',{},a.body.token)).status,200);assert.equal((await request('GET','/fiches',null,a.body.token)).status,401)
  db.prepare('UPDATE user_sessions SET expires_at=0').run();assert.equal((await request('GET','/fiches',null,b.body.token)).status,401)
 })
 db.close()
}finally{globalThis.fetch=originalFetch;await vite.close();if(descriptor)Object.defineProperty(crypto.subtle,'timingSafeEqual',descriptor);else delete crypto.subtle.timingSafeEqual}
