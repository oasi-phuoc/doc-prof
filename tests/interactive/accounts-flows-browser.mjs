import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createServer} from 'vite'
import {chromium} from 'playwright'
const base='http://127.0.0.1:5194',server=await createServer({cacheDir:'/tmp/accounts-layout-vite',server:{host:'127.0.0.1',port:5194,strictPort:true},define:{'import.meta.env.VITE_FICHES_API_URL':JSON.stringify('/__test_api')}});await server.listen();let browser
try{
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:1440,height:1100}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>localStorage.setItem('clairfle-fiche-sync','fixture-admin'))
 const user={id:'11111111-1111-4111-8111-111111111111',givenName:'Camille',familyName:'Exemple',email:'camille.exemple@admin.vs.ch',active:true,account:'partial',domains:['algèbre','géométrie','alphabetisation']};let assigned,creation,created,creationCalls=0
 await page.route('**/__test_api/users',async r=>{
  if(r.request().method()==='POST'){
   creationCalls++;creation=r.request().postDataJSON()
   created={...user,id:'22222222-2222-4222-8222-222222222222',givenName:creation.givenName,familyName:creation.familyName,email:creation.email,domains:creation.domains}
   await r.fulfill({status:201,json:{user:created}})
  }else await r.fulfill({json:{users:[user]}})
 })
 await page.route('**/__test_api/users/*',async r=>{assigned=r.request().postDataJSON();await r.fulfill({json:{domains:assigned.domains}})})
 await page.goto(base+'/comptes');await page.getByRole('heading',{name:'Comptes enseignants'}).waitFor({timeout:120000})
 const card=page.getByRole('region',{name:'Compte de Camille Exemple'})
 await card.getByLabel('Grammaire',{exact:true}).check();await card.getByRole('button',{name:'Enregistrer les accès de Camille'}).click();await page.getByRole('status').filter({hasText:'Accès enregistrés'}).waitFor();assert(assigned.domains.includes('grammaire'))
 for(const d of ['Algèbre','Géométrie','Alphabétisation'])assert(await card.getByLabel(d,{exact:true}).isDisabled())
 const form=page.getByRole('form',{name:'Créer un compte enseignant'})
 await form.getByLabel('Prénom',{exact:true}).fill('Noémie');await form.getByLabel('Nom',{exact:true}).fill('Exemple');await form.getByLabel('Adresse e-mail professionnelle').fill('noemie.exemple@admin.vs.ch')
 await form.getByLabel('Mot de passe du compte',{exact:true}).fill('Valide!88');await form.getByLabel('Confirmer le mot de passe').fill('Autre!999');await form.getByRole('button',{name:'Créer le compte',exact:true}).click();await page.getByRole('alert').filter({hasText:'identiques'}).waitFor();assert.equal(creationCalls,0)
 await form.getByLabel('Confirmer le mot de passe').fill('Valide!88');await form.getByLabel('Vocabulaire',{exact:true}).check();await form.getByRole('button',{name:'Créer le compte',exact:true}).click()
 await page.getByRole('status').filter({hasText:'Compte créé pour Noémie'}).waitFor();assert.equal(creationCalls,1);assert.equal(creation.givenName,'Noémie');assert(creation.domains.includes('vocabulaire'));assert.equal(creation.password,'Valide!88')
 await page.getByRole('region',{name:'Compte de Noémie Exemple'}).getByText('Compte actif',{exact:false}).waitFor()
 assert.equal(await form.getByLabel('Mot de passe du compte',{exact:true}).inputValue(),'');assert.equal(await form.getByLabel('Confirmer le mot de passe').inputValue(),'');assert.equal(await page.evaluate(()=>Object.values(localStorage).some(s=>s.includes('Valide!88'))),false)
 await page.screenshot({path:'/tmp/accounts-admin-create.png',fullPage:true})
 const member=await browser.newContext({viewport:{width:1440,height:1100}}),p=await member.newPage();p.on('pageerror',e=>errors.push(e.message));let login,logout=false
 await p.route('**/__test_api/auth/login',async r=>{login=r.request().postDataJSON();await r.fulfill({json:{token:'cfu_'+'a'.repeat(64),user:created,expiresAt:Date.now()+3600000}})})
 await p.route('**/__test_api/auth/logout',async r=>{logout=true;await r.fulfill({json:{ok:true}})})
 await p.goto(base+'/acces');assert.equal(await p.getByRole('button',{name:'Créer un compte',exact:true}).count(),0);assert.equal(await p.getByRole('button',{name:'Renvoyer le lien de confirmation'}).count(),0)
 await p.getByText('Votre compte est créé par l’administrateur.',{exact:false}).waitFor();await p.getByLabel('Adresse e-mail professionnelle').fill(created.email)
 await p.getByLabel('Mot de passe',{exact:true}).fill('Valide!88');await p.getByRole('button',{name:'Continuer vers les fiches',exact:true}).click();await p.waitForURL('**/generateur');await p.locator('.sheet-stage:not(.print-only-sheets) .exercise-block').first().waitFor({timeout:120000});assert.equal(login.email,created.email);assert((await p.evaluate(()=>localStorage.getItem('clairfle-fiche-sync'))).startsWith('cfu_'))
 await p.getByLabel('Domaine',{exact:true}).click();const domains=await p.getByRole('option').allTextContents();assert.deepEqual(new Set(domains),new Set(['Algèbre','Géométrie','Alphabétisation','Vocabulaire']));await p.keyboard.press('Escape');await p.getByRole('button',{name:'Enregistrer',exact:true}).click();const dialog=p.getByRole('dialog',{name:'Enregistrer la fiche'});assert.equal(await dialog.getByLabel('Enregistré par').inputValue(),'Noémie Exemple');assert(await dialog.getByLabel('Enregistré par').getAttribute('readonly')!==null);await dialog.getByRole('button',{name:'Fermer',exact:true}).click()
 const restricted=await member.newPage();await restricted.goto(base+'/comptes');await restricted.getByRole('alert').filter({hasText:'réservé à l’administrateur'}).waitFor();assert.equal(await restricted.getByRole('form',{name:'Créer un compte enseignant'}).count(),0);await restricted.close()
 await p.getByRole('button',{name:'Paramètres',exact:true}).click();await p.getByRole('menuitem',{name:'Se déconnecter'}).click();await p.waitForURL('**/acces');assert.equal(await p.evaluate(()=>localStorage.getItem('clairfle-personal-session')),null);assert(logout)
 const {buildTcfRandomTestPages}=await server.ssrLoadModule('/src/tcf/generate.ts'),template=JSON.parse(await readFile('docs/interactive/demo-source-recipe.json','utf8')),cfg=buildTcfRandomTestPages('A0-A1',42).find(p=>p.exerciseType==='tcf-co-ex-3'&&p.difficulty==='facile'),tcfContext=await browser.newContext();await tcfContext.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await tcfContext.addInitScript(f=>history.replaceState({clairfleFiche:f},'',location.href),{id:'tcf-points',name:'TCF',recipe:{...template,pages:[cfg],evalMode:true,libreMode:false,libreSnapshot:null}});const tcf=await tcfContext.newPage();await tcf.goto(base+'/generateur');await tcf.locator('.tcf-question-points').waitFor({timeout:120000});assert.equal(await tcf.locator('.mode-toggle-block input[type="number"]').count(),0);await tcf.screenshot({path:'/tmp/accounts-tcf-points.png',fullPage:true})
 assert.deepEqual(errors,[]);await writeFile('docs/comptes/creation-admin-20261120-browser.json',JSON.stringify({adminAccessManagement:true,minimumDomainsFixed:true,adminCreation:true,passwordClearedAfterCreation:true,publicRegistrationRemoved:true,personalLogin:true,profileNameOnSave:true,logout:true,minimumDomains:domains,tcfDuplicatePointsRemoved:true,errors},null,2)+'\n');console.log('Création par l’admin, session personnelle, accès par personne et réglage unique TCF : vérifiés.')
}finally{await browser?.close();await server.close()}
