/** Publish measured pilot coverage for the selected Décrire notions; human approval stays pending. */
const fs=require('node:fs'),path=require('node:path')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks}=load(root+'/src/grammaire/curriculum/registry.ts')
const arg=(name,fallback)=>process.argv.find(v=>v.startsWith('--'+name+'='))?.slice(name.length+3)??fallback
const theme=arg('theme','gram-decrire'),date=arg('date','2026-11-23'),ready=process.argv.includes('--verified')
const file=path.join(root,'docs/grammaire/implementation/target-registry.json'),r=JSON.parse(fs.readFileSync(file))
const requested=arg('subthemes','f4,f5,f6,f7,f8').split(',')
const themeBanks=banks.filter(b=>b.topic===theme)
const scope=themeBanks.filter(b=>requested.includes(b.subthemeId))
if(!scope.length)throw Error('No banks for '+theme)
const planned=r.offerings.filter(o=>o.themeId===theme)
const covered=o=>themeBanks.some(b=>b.activityId===o.activityId&&b.level===o.level&&b.presentations.includes(o.presentation))
const remainingNotions=[...new Set(planned.filter(o=>!covered(o)).map(o=>r.notionLevels.find(n=>n.pedagogicalNotionId===o.pedagogicalNotionId&&n.level===o.level).label))]
for(const id of new Set(scope.map(b=>b.activityId))){
 const versions=scope.filter(b=>b.activityId===id),a=r.activities.find(a=>a.activityId===id)
 if(!a)throw Error('Unplanned activity '+id)
 const source='src/grammaire/curriculum/data/'+versions[0].subthemeId+'.json'
 Object.assign(a,{editorialStatus:'reviewed',approvedDistinctCount:0,a4Ready:ready,boardReady:ready,targetEditorialSourcePath:source,
  pilotPreview:{sourcePath:source,levels:versions.map(b=>b.level),reviewedActivityUnits:versions.reduce((n,b)=>n+b.units.length,0),teacherApprovedUnits:0,humanReview:'pending',byLevel:versions.map(b=>({level:b.level,presentations:b.presentations,units:b.units.length}))}})
 for(const b of versions)for(const p of b.presentations){
  const o=r.offerings.find(o=>o.activityId===id&&o.level===b.level&&o.presentation===p)
  if(!o)throw Error('Unplanned offering '+id+'/'+b.level+'/'+p)
  Object.assign(o,{editorialStatus:'reviewed',a4Ready:ready,boardReady:ready,approvedDistinctCount:0,reviewedDistinctCount:b.units.length,availability:'pilot_preview',humanReview:'pending',bankRevision:b.revision,editorialSourcePath:source})
 }
}
const units=banks.flatMap(b=>b.units),docs=units.filter(u=>u.kind==='reading'),ids=new Set(banks.map(b=>b.activityId)),notion=b=>r.activities.find(a=>a.activityId===b.activityId).pedagogicalNotionId
Object.assign(r.implementation,{lastUpdated:date,reviewedVariants:banks.reduce((n,b)=>n+b.presentations.reduce((s,p)=>s+(p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):b.units.length),0),0),reviewedActivityUnits:units.length,reviewedSelectableUnits:units.length,reviewedActivities:ids.size,reviewedDocuments:docs.length,reviewedDocumentQuestions:docs.reduce((n,u)=>n+u.questions.length,0),reviewedOfferings:banks.reduce((n,b)=>n+b.presentations.length,0),reviewedNotions:new Set(banks.map(notion)).size,reviewedNotionLevelPairs:new Set(banks.map(b=>notion(b)+'@'+b.level)).size,remaining:`Décrire : ${planned.filter(covered).length}/${planned.length} offres en pilote. À poursuivre : ${remainingNotions.join(", ")||"validation du thème"}. Approbation enseignante, révisions et recette finale restent en attente.`})
r.implementation.deliveredSlices=[...new Set([...r.implementation.deliveredSlices,requested.length===1&&requested[0]==='f9'?'f9 A1/A2 — comparaisons (10 offres)':'f4/f5/f6/f7/f8 A1 — Décrire, première tranche (21/63 offres)'])]
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/grammaire/implementation/decrire-media-manifest.json')))
for(const evidence of manifest.obligations){
 const image=r.imageObligations.find(i=>i.obligationId===evidence.obligationId)
 Object.assign(image,{reviewedIllustratedSituations:evidence.reviewedIllustratedSituations,approvedIllustratedSituations:0,distinctImages:evidence.distinctImages,mediaStatus:'réemploi vérifié ; validation enseignante en attente',manifest:'docs/grammaire/implementation/decrire-media-manifest.json',humanReview:'pending'})
}
fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n')
const quote=v=>/[;"\r\n]/.test(String(v??''))?'"'+String(v??'').replaceAll('"','""')+'"':String(v??'')
const labels={'choice':'QCM','gap':'Lacune','correct':'Correction','order':'Ordre','match':'Association','transform':'Transformation','document-set':'Lecture','scenario-set':'Situation','open-written':'Écrit','open-oral':'Oral'}
const heading=['Thème','Notion','Niveau','Activité','Présentation','État','Unités relues','Reste à faire','Identifiant offre','Source éditoriale']
const lines=r.offerings.map(o=>{const n=r.notionLevels.find(n=>n.pedagogicalNotionId===o.pedagogicalNotionId&&n.level===o.level);return[n.themeLabel,n.label,o.level,o.label,labels[o.presentation],o.availability==='pilot_preview'?'Pilote — validation enseignante en attente':'À préparer',o.reviewedDistinctCount??0,o.availability==='pilot_preview'?'Faire relire et approuver':'Rédiger ou réemployer, vérifier et faire relire',o.offeringId,o.editorialSourcePath??''].map(quote).join(';')})
fs.writeFileSync(path.join(root,'docs/grammaire/implementation/reste-a-faire-'+date.replaceAll('-','')+'.csv'),'\uFEFF'+heading.join(';')+'\n'+lines.join('\n')+'\n')
fs.writeFileSync(path.join(root,'src/grammaire/curriculum/graded-activities.json'),JSON.stringify([...ids],null,2)+'\n')
console.log(JSON.stringify({activities:ids.size,offerings:r.implementation.reviewedOfferings,units:units.length,variants:r.implementation.reviewedVariants,verified:ready}))
