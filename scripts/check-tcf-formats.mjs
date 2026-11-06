import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const server=await createServer({root,server:{middlewareMode:true},appType:'custom'});
try {
 const {ceIllustratedPassages}=await server.ssrLoadModule('/src/tcf/ce-illustrations.ts');
 const {TexteSupport}=await server.ssrLoadModule('/src/components/tcf/TexteSupport.tsx');
 const {tryGenerateTcfBlock,tcfConsignesPage}=await server.ssrLoadModule('/src/tcf/generate.ts');
 const {buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts');
 const {blockFromPage}=await server.ssrLoadModule('/src/math/page-model.ts');
 const {createRng}=await server.ssrLoadModule('/src/math/rng.ts');
 const {createElement:h}=await import('react');
 const {renderToStaticMarkup:render}=await import('react-dom/server');
 const exercises=JSON.parse(readFileSync(`${root}/src/tcf/content/a0-a1/ce.json`));
 const norm=s=>s.replace(/\s+/g,' ').trim();
 for(const ex of exercises) {
  const text=ex.support.texte,parts=ceIllustratedPassages(text,ex.theme);
  assert.equal(norm(parts.map(p=>p.text).join(' ')),norm(text),ex.id);
  assert(parts.some(p=>p.illustration));
  for(const p of parts)if(p.illustration)assert(existsSync(`${root}/public${p.illustration.src}`),p.illustration.src);
  const config={domain:'tcf-csc',topic:'tcf-ce',exerciseType:'tcf-ce-ex-1',difficulty:'facile',count:1,columns:1,tcfExercise:ex};
  const plain=tryGenerateTcfBlock({...config,tcfCeFormat:'texte'},createRng(42));
  const images=tryGenerateTcfBlock({...config,tcfCeFormat:'image'},createRng(42));
  assert.deepEqual(plain.items.filter(x=>x.tcf?.kind!=='support'),images.items.filter(x=>x.tcf?.kind!=='support'));
  assert.equal(images.items[0].tcf.ceFormat,'image');
  assert(!render(h(TexteSupport,{exercise:ex,mode:'student',ceFormat:'texte'})).includes('tcf-ce-illustrated'));
  assert(render(h(TexteSupport,{exercise:ex,mode:'student',ceFormat:'image'})).includes('tcf-ce-illustrated'));
  assert.equal(blockFromPage({...config,tcfCeFormat:'image'}).tcfCeFormat,'image');
 }
 console.log(`${exercises.length} documents CE : texte intégral conservé, illustrations existantes, questions et réponses identiques dans les deux formats.`);
 const ce={id:'test-ce',competence:'CE',niveau:'A0-A1',type_exercice:'sms',support:{expediteur:'Ami',texte:'Bonjour ! Le rendez-vous est à la gare.'},questions:[{type_reponse:'lignes',enonce:'Où ?',points:2.5},{type_reponse:'lignes',enonce:'Quand ?',points:1.25}]};
 const pe={id:'test-pe',competence:'PE',niveau:'A0-A1',type_exercice:'formulaire',points:8,support:{champs:[{label:'Nom',type:'texte',corrige:'Libre'}]},questions:[]};
 const make=(domain,ex,points)=>({domain,topic:`tcf-${ex.competence.toLowerCase()}`,exerciseType:`tcf-${ex.competence.toLowerCase()}-ex-1`,difficulty:domain==='tcf-cfr'?'moyen':'facile',count:1,columns:1,tcfExercise:ex,pointsPerQuestion:points});
 const pages=[tcfConsignesPage('A0-A1','tcf-csc'),{...make('tcf-csc',ce,1),tcfPageBreakAfter:[false,true]},make('tcf-csc',pe,7.5),tcfConsignesPage('A1-A2','tcf-cfr'),make('tcf-cfr',{...ce,id:'test-cfr',niveau:'A1-A2'},2),tcfConsignesPage('A0-A1','tpf')];
 const sheets=buildWorksheets(pages,42);
 const infos=sheets.flatMap(p=>p.items.filter(i=>i.tcf?.kind==='informations').map(i=>({domain:p.domain,...i.tcf})));
 assert.deepEqual(infos.find(x=>x.domain==='tcf-csc').pointsByCompetence,{CE:3.75,CO:0,PE:7.5,PO:0});
 assert.deepEqual(infos.find(x=>x.domain==='tcf-cfr').pointsByCompetence,{CE:3.75,CO:0,PE:0,PO:0});
 assert.equal(infos.find(x=>x.domain==='tpf').pointsByCompetence,undefined);
 const updated=buildWorksheets([...pages,make('tcf-csc',{...ce,id:'extra'},1)],42);
 assert.equal(updated[0].items[0].tcf.pointsByCompetence.CE,7.5);
 console.log('Totaux CSC/CFR exacts, décimales et sauts de page vérifiés ; mise à jour après ajout d’exercice.');
 const {markMotATrouver,resetMotsATrouver}=await server.ssrLoadModule('/src/tcf/texte-images-editing.ts');
 const original='Je vais à l’école. Je prends le bus et je lis un livre.';
 let state={texte:original,mots:Array.from({length:5},()=>({mot:'ancien',image:'/old.webp'}))};
 for(const word of ['livre','école','bus']) {
  const start=state.texte.indexOf(word);const next=markMotATrouver(state.texte,start,start+word.length,state.mots);
  assert(next);state=next;
 }
 assert.equal(state.texte,'Je vais à l’_____ (1). Je prends le _____ (2) et je lis un _____ (3).');
 assert.deepEqual(state.mots.slice(0,3).map(m=>m.mot),['école','bus','livre']);
 const reset=resetMotsATrouver(state.texte,state.mots);
 assert.equal(reset.texte,original);assert(reset.mots.every(m=>m.mot===''&&m.image===''));
 const repeated='école et école';let selection=markMotATrouver(repeated,9,14,reset.mots);selection=markMotATrouver(selection.texte,0,5,selection.mots);
 assert.equal(selection.texte,'_____ (1) et _____ (2)');assert.equal(resetMotsATrouver(selection.texte,selection.mots).texte,repeated);
 console.log('PE : sélection malgré une ancienne liste pleine, numérotation dans le texte, répétitions et réinitialisation réversible vérifiées.');
 const {buildFicheRecipe,parseFicheRecipe}=await server.ssrLoadModule('/src/fiches/recipe.ts');
 const recipe=buildFicheRecipe({pages:[{...pages[0],tcfCeFormat:'image'}],seed:42,institutional:{},evalMode:false,pointsPerQuestion:1,libreMode:true,libreSnapshot:null,imageOverrides:{'/old.webp':'/lib/images/vocabulaire/transports/bus.webp','/local.webp':'data:image/png;base64,AA=='}});
 const parsed=parseFicheRecipe(JSON.parse(JSON.stringify(recipe)));
 assert.equal(parsed.pages[0].tcfCeFormat,'image');assert.deepEqual(parsed.imageOverrides,{'/old.webp':'/lib/images/vocabulaire/transports/bus.webp'});
 console.log('Sauvegarde : format CE et choix de banque conservés ; images temporaires exclues.');
 const {TcfItemView}=await server.ssrLoadModule('/src/components/tcf/TcfItemView.tsx');
 const {tcfExerciseItems}=await server.ssrLoadModule('/src/tcf/generate.ts');
 const audios=Array.from({length:6},(_,i)=>`/lib/audio/tcf/co/mini-${i+1}.mp3`);
 const six={id:'tcf-test-six',niveau:'A0-A1',competence:'CO',type_exercice:'six_courts',support:{audios},questions:audios.map((_,i)=>({type_reponse:'qcm_texte',enonce:'Question',audio:i+1,choix:[{id:'a',texte:'Oui',correct:true},{id:'b',texte:'Non'}],formes:{qcm_image:{choix:[{id:'a',image:'/image1.webp',correct:true},{id:'b',image:'/image2.webp'}]},lignes:{nb_lignes:1,reponse_modele:'Oui'}}}))};
 for(const form of ['qcm_texte','qcm_image','lignes']) {
  const items=tcfExerciseItems(six,createRng(42)).slice(1);
  for(const [i,item] of items.entries()) {
   const answer=render(h(TcfItemView,{item,mode:'answers',tcfFormMode:form}));
   const student=render(h(TcfItemView,{item,mode:'student',tcfFormMode:form}));
   assert(answer.includes(`src="${audios[i]}"`),`Lecteur audio ${i+1} manquant en ${form}`);
   assert(answer.includes('tcf-audio-frame-head has-player'));assert(!student.includes('<audio'));
  }
 }
 console.log('Six mini-audios : les 6 lecteurs restent dans leur bandeau au corrigé en format Texte, Image et Phrase ; absents de la fiche élève.');
 const associations=['a0-a1','a1-a2'].flatMap(level=>JSON.parse(readFileSync(`${root}/src/tcf/content/${level}/co.json`))).filter(ex=>ex.type_exercice==='association_images');
 for(const ex of associations){
  const item=tcfExerciseItems(ex,createRng(42)).find(i=>i.tcf?.kind==='association');
  for(const situation of item.tcf.situations){
   assert.equal(situation.audioSrc,situation.dialogue===null?undefined:ex.support.audios[situation.dialogue-1]);
  }
  const answer=render(h(TcfItemView,{item,mode:'answers'}));
  const student=render(h(TcfItemView,{item,mode:'student'}));
  const expected=ex.situations.filter(s=>s.dialogue!==null).length;
  assert.equal((answer.match(/<audio /g)||[]).length,expected);assert(!student.includes('<audio'));
  for(const situation of item.tcf.situations)assert(answer.includes(`Situation ${situation.lettre}`));
 }
 console.log(`${associations.length} exercices d’association : bandeaux Situation A–F et lecteurs uniquement sur les scènes correspondant aux dialogues.`);



} finally {await server.close()}
