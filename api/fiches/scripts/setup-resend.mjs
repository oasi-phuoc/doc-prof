import { Resend } from 'resend'
if (!process.env.RESEND_API_KEY) throw Error('Configurez RESEND_API_KEY dans l’environnement sécurisé ; jamais dans le code ou le chat.')
const resend=new Resend(process.env.RESEND_API_KEY)
const check=result=>{if(result.error)throw Error(`Resend : ${result.error.message}`);return result.data}
if(process.argv.includes('--test')){
 const to=process.env.RESEND_TEST_TO||'phuoc.van@outlook.com'
 const data=check(await resend.emails.send({from:'ClairFLE <onboarding@resend.dev>',to,subject:'Hello World',html:'<p>Votre premier e-mail de test ClairFLE a été envoyé.</p>'},{idempotencyKey:process.env.RESEND_TEST_ID||`clairfle-setup-${new Date().toISOString().slice(0,10)}`}))
 console.log('E-mail de test accepté :',data.id)
 console.log('Cet essai ne confirme aucune adresse @admin.vs.ch.')
}else if(process.argv.includes('--template')){
 const alias='clairfle-confirmation-adresse',existing=await resend.templates.get(alias)
 if(!existing.error){if(!existing.data.variables?.some(v=>v.key==='CONFIRMATION_URL'))throw Error('Le modèle existant n’a pas la variable CONFIRMATION_URL.');if(existing.data.status!=='published')check(await resend.templates.publish(existing.data.id));console.log('Modèle existant à utiliser :',existing.data.id)}
 else{
  if(existing.error.statusCode!==404)throw Error(existing.error.message)
  const data=check(await resend.templates.create({name:'ClairFLE — confirmation de l’adresse professionnelle',alias,subject:'Confirmez votre adresse ClairFLE',variables:[{key:'CONFIRMATION_URL',type:'string'}],html:'<h1>Confirmez votre adresse professionnelle</h1><p>Vous avez demandé un compte ClairFLE.</p><p><a href="{{{CONFIRMATION_URL}}}">Confirmer mon adresse</a></p><p>Ce lien expire dans 24 heures. Si vous n’avez pas demandé ce compte, ignorez ce message.</p>'}))
  check(await resend.templates.publish(data.id));console.log('Modèle créé et publié :',data.id)
 }
}else throw Error('Choisissez --test pour un essai ou --template pour préparer le modèle de confirmation.')
