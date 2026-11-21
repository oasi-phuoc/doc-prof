/** Register only this extension; keep the initial G0 and dated reports intact. */
const fs=require('node:fs'),path=require('node:path')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks}=load(root+'/src/grammaire/curriculum/registry.ts')
const target=path.join(root,'docs/grammaire/implementation/target-registry.json'),r=JSON.parse(fs.readFileSync(target))
const sourceFor=b=>`src/grammaire/curriculum/data/${b.subthemeId}.json`
const scope=banks.filter(b=>b.topic==='gram-se-presenter'&&['a1','a3','famille'].includes(b.subthemeId))
const ready=process.argv.includes('--verified')
for(const b of scope) {
 const a=r.activities.find(a=>a.activityId===b.activityId)
 if(!a)throw Error('Unplanned activity '+b.activityId)
 Object.assign(a,{editorialStatus:'reviewed',approvedDistinctCount:0,a4Ready:ready,boardReady:ready,
  targetEditorialSourcePath:sourceFor(b),instructionsByPresentation:b.instructions,
  pilotPreview:{sourcePath:sourceFor(b),levels:[b.level],reviewedActivityUnits:b.units.length,teacherApprovedUnits:0,humanReview:'pending'}})
 for(const p of b.presentations) {
  const o=r.offerings.find(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p)
  if(!o)throw Error('Unplanned offering '+b.activityId+'/'+p)
  Object.assign(o,{editorialStatus:'reviewed',a4Ready:ready,boardReady:ready,approvedDistinctCount:0,
   reviewedDistinctCount:p==='document-set'?b.units.reduce((n,u)=>n+u.questions.length,0):b.units.length,
   availability:'pilot_preview',humanReview:'pending',bankRevision:b.revision,editorialSourcePath:sourceFor(b)})
  if(p==='document-set')o.reviewedDocumentCount=b.units.length
 }
}
const units=banks.flatMap(b=>b.units),docs=units.filter(u=>u.kind==='reading')
const activityIds=new Set(banks.map(b=>b.activityId)),activities=r.activities.filter(a=>activityIds.has(a.activityId))
const variants=banks.reduce((n,b)=>n+b.presentations.reduce((s,p)=>s+(p==='document-set'?b.units.reduce((q,u)=>q+u.questions.length,0):b.units.length),0),0)
const notion=b=>r.activities.find(a=>a.activityId===b.activityId).pedagogicalNotionId
Object.assign(r.implementation,{lastUpdated:'2026-11-21',reviewedVariants:variants,reviewedActivityUnits:units.length,
 reviewedSelectableUnits:units.length,reviewedActivities:activityIds.size,reviewedDocuments:docs.length,
 reviewedDocumentQuestions:docs.reduce((n,u)=>n+u.questions.length,0),reviewedOfferings:banks.reduce((n,b)=>n+b.presentations.length,0),
 reviewedNotions:new Set(activities.map(a=>a.pedagogicalNotionId)).size,
 reviewedNotionLevelPairs:new Set(banks.map(b=>notion(b)+'@'+b.level)).size,
 remaining:'Se présenter : 37 offres sur 40 en pilote ; restent l’association, l’oral et la PE de famille. Entrer en contact et Conjuguer au présent complets en pilote. Approbation enseignante, autres thèmes, obligations I, révisions et recette finale en attente.'})
r.implementation.deliveredSlices=[...new Set([...r.implementation.deliveredSlices,'a1 identité A1 (G3)','a3 nationalités A1 (G3)','famille A1 — premiers types (G3)'])]
r.implementation.technicalContracts.images='20 supports de présentation réemployés et un bébé historique restauré sous empreinte immuable. Aucun média généré. Les onze obligations I des autres notions restent à préparer.'
fs.writeFileSync(target,JSON.stringify(r,null,2)+'\n')
const quote=v=>/[;"\r\n]/.test(String(v??''))?'"'+String(v??'').replaceAll('"','""')+'"':String(v??'')
const headings=['Thème','Notion','Niveau','Activité','Présentation','État','Unité de sélection','Unités relues','Minimum questions/situations','Minimum documents','Reste à faire','Identifiant offre','Source éditoriale']
const labels={'choice':'QCM','gap':'Lacune','correct':'Correction','order':'Ordre','match':'Association','transform':'Transformation','document-set':'Lecture','scenario-set':'Situation','open-written':'Écrit','open-oral':'Oral'}
const lines=r.offerings.map(o=>{
 const a=r.activities.find(a=>a.activityId===o.activityId),n=r.notionLevels.find(n=>n.pedagogicalNotionId===o.pedagogicalNotionId&&n.level===o.level)
 return [n.themeLabel,n.label,o.level,o.label,labels[o.presentation],o.availability==='pilot_preview'?'Pilote — validation enseignante en attente':'À préparer',o.selectionUnit==='document'?'textes':o.selectionUnit==='situation'?'situations':'questions',o.reviewedDistinctCount??0,o.targetMinimum,o.targetMinimumDocuments??'',o.availability==='pilot_preview'?'Faire relire et approuver ; conserver le statut pilote jusque-là':'Auditer, réemployer ou rédiger, contrôler A4/tableau/sauvegarde, faire relire et approuver',o.offeringId,o.editorialSourcePath??a.targetEditorialSourcePath??''].map(quote).join(';')
})
fs.writeFileSync(path.join(root,'docs/grammaire/implementation/reste-a-faire-20261121.csv'),'\uFEFF'+headings.join(';')+'\n'+lines.join('\n')+'\n')
console.log(JSON.stringify({activities:activityIds.size,offerings:r.implementation.reviewedOfferings,units:units.length,variants,documents:docs.length,children:r.implementation.reviewedDocumentQuestions,ready}))
