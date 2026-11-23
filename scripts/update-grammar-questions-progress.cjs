/** Finish one whole theme without rewriting the previous dated evidence. */
const fs=require('node:fs'),path=require('node:path')
const {load,root}=require('./gattegno-loader.cjs')
const {GRAMMAR_PILOT_BANKS:banks}=load(root+'/src/grammaire/curriculum/registry.ts')
const file=path.join(root,'docs/grammaire/implementation/target-registry.json'),r=JSON.parse(fs.readFileSync(file))
const scope=banks.filter(b=>b.topic==='gram-questions')
const ready=process.argv.includes('--verified')
for(const b of scope){
 const source='src/grammaire/curriculum/data/'+b.subthemeId+'.json'
 const a=r.activities.find(a=>a.activityId===b.activityId)
 if(!a)throw Error('Unplanned activity '+b.activityId)
 Object.assign(a,{editorialStatus:'reviewed',approvedDistinctCount:0,a4Ready:ready,boardReady:ready,targetEditorialSourcePath:source,
  instructionsByPresentation:b.instructions,...(b.subthemeId!=='c1'&&b.presentations.includes('document-set')?{uiContract:b.activityId.endsWith('-write')?'Lire et écrire des questions '+(b.subthemeId==='c2'?'ouvertes':'avec quel')+' sur cinq cibles explicites ; modèles et grille au corrigé.':'Lire et répondre aux questions '+(b.subthemeId==='c2'?'ouvertes':'avec quel')+' ; preuves littérales et réponses complètes.'}:{}),pilotPreview:{sourcePath:source,levels:[b.level],reviewedActivityUnits:b.units.length,teacherApprovedUnits:0,humanReview:'pending'}})
 for(const p of b.presentations){
  const o=r.offerings.find(o=>o.activityId===b.activityId&&o.level===b.level&&o.presentation===p)
  if(!o)throw Error('Unplanned offering '+b.activityId+'/'+p)
  Object.assign(o,{editorialStatus:'reviewed',a4Ready:ready,boardReady:ready,approvedDistinctCount:0,reviewedDistinctCount:b.units.length,
   availability:'pilot_preview',humanReview:'pending',bankRevision:b.revision,editorialSourcePath:source})
 }
}
const units=banks.flatMap(b=>b.units),docs=units.filter(u=>u.kind==='reading'),activityIds=new Set(banks.map(b=>b.activityId))
const activities=r.activities.filter(a=>activityIds.has(a.activityId)),notion=b=>r.activities.find(a=>a.activityId===b.activityId).pedagogicalNotionId
Object.assign(r.implementation,{lastUpdated:'2026-11-22',reviewedVariants:banks.reduce((n,b)=>n+b.presentations.reduce((s,p)=>s+(p==='document-set'?b.units.reduce((q,u)=>q+u.questions.length,0):b.units.length),0),0),
 reviewedActivityUnits:units.length,reviewedSelectableUnits:units.length,reviewedActivities:activityIds.size,reviewedDocuments:docs.length,
 reviewedDocumentQuestions:docs.reduce((n,u)=>n+u.questions.length,0),reviewedOfferings:banks.reduce((n,b)=>n+b.presentations.length,0),
 reviewedNotions:new Set(activities.map(a=>a.pedagogicalNotionId)).size,reviewedNotionLevelPairs:new Set(banks.map(b=>notion(b)+'@'+b.level)).size,
 remaining:'Les questions : 24/24 offres A1 en pilote. Se présenter, Entrer en contact et Conjuguer au présent complets en pilote. Prochain thème : L’exclamation. Approbation enseignante, obligations I, révisions et recette finale en attente.'})
r.implementation.deliveredSlices=[...new Set([...r.implementation.deliveredSlices,'c1/c2/c3 A1 — thème Les questions terminé (G3)'])]
fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n')
const quote=v=>/[;"\r\n]/.test(String(v??''))?'"'+String(v??'').replaceAll('"','""')+'"':String(v??'')
const labels={'choice':'QCM','gap':'Lacune','correct':'Correction','order':'Ordre','match':'Association','transform':'Transformation','document-set':'Lecture','scenario-set':'Situation','open-written':'Écrit','open-oral':'Oral'}
const heading=['Thème','Notion','Niveau','Activité','Présentation','État','Unités relues','Reste à faire','Identifiant offre','Source éditoriale']
const lines=r.offerings.map(o=>{const n=r.notionLevels.find(n=>n.pedagogicalNotionId===o.pedagogicalNotionId&&n.level===o.level);return[n.themeLabel,n.label,o.level,o.label,labels[o.presentation],o.availability==='pilot_preview'?'Pilote — validation enseignante en attente':'À préparer',o.reviewedDistinctCount??0,o.availability==='pilot_preview'?'Faire relire et approuver':'Rédiger ou réemployer, vérifier et faire relire',o.offeringId,o.editorialSourcePath??''].map(quote).join(';')})
fs.writeFileSync(path.join(root,'docs/grammaire/implementation/reste-a-faire-20261122.csv'),'\uFEFF'+heading.join(';')+'\n'+lines.join('\n')+'\n')
console.log(JSON.stringify({activities:r.implementation.reviewedActivities,offerings:r.implementation.reviewedOfferings,units:units.length,variants:r.implementation.reviewedVariants,verified:ready}))

fs.writeFileSync(path.join(root,'src/grammaire/curriculum/graded-activities.json'),JSON.stringify([...new Set(banks.map(b=>b.activityId))],null,2)+'\n')
