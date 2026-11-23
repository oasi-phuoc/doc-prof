/** Owner-authorized cleanup. Dry run by default; never prints fiche content/token. */
const {load,root}=require('./gattegno-loader.cjs')
const {hasRetiredGrammarRecipe}=load(root+'/src/grammaire/curriculum/retirement.ts')
async function prune({request,apply=false}) {
 const body=await request('/fiches'),all=body.fiches??[]
 const retired=all.filter(f=>hasRetiredGrammarRecipe(f.recipe));let deleted=0
 if(apply)for(const f of retired){await request('/fiches/'+encodeURIComponent(f.id),'DELETE');deleted++}
 return {inspected:all.length,retired:retired.length,deleted,apply}
}
module.exports={prune}
if(require.main===module)(async()=>{
 const fs=require('node:fs'),cp=require('node:child_process')
 const base=process.env.FICHES_API_URL??fs.readFileSync(root+'/.env','utf8').match(/^VITE_FICHES_API_URL\s*=\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g,'')
 const token=process.env.FICHES_API_TOKEN
 if(!base||!token)throw Error('Définissez FICHES_API_URL et FICHES_API_TOKEN (accès administrateur serveur). Le jeton ne doit pas être ajouté au dépôt.')
 const request=async(path,method='GET')=>{
  let raw
  try{raw=cp.execFileSync('curl',['--silent','--show-error','--fail-with-body','--max-time','30','--config','-'],{input:`url = ${JSON.stringify(base.replace(/\/$/,'')+path)}\nrequest = ${JSON.stringify(method)}\nheader = ${JSON.stringify('Authorization: Bearer '+token)}\n`,encoding:'utf8',stdio:['pipe','pipe','pipe']})}
  catch{throw Error('Serveur inaccessible ou accès refusé ; nettoyage interrompu sans annoncer de suppression non confirmée.')}
  return JSON.parse(raw)
 }
 console.log(JSON.stringify(await prune({request,apply:process.argv.includes('--apply')})))
})().catch(e=>{console.error(e.message);process.exitCode=1})
