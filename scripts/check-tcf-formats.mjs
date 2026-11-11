import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const server=await createServer({root,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
 const {CE_ARTWORKS,ceArtKey,ceArtFor}=await server.ssrLoadModule('/src/tcf/ce-art.ts');
 const {tcfCeTagsOf}=await server.ssrLoadModule('/src/tcf/content-tags.ts');
 const {TexteSupport}=await server.ssrLoadModule('/src/components/tcf/TexteSupport.tsx');
 const {tryGenerateTcfBlock,tcfConsignesPage}=await server.ssrLoadModule('/src/tcf/generate.ts');
 const {buildWorksheets}=await server.ssrLoadModule('/src/math/generate.ts');
 const {blockFromPage}=await server.ssrLoadModule('/src/math/page-model.ts');
 const {createRng}=await server.ssrLoadModule('/src/math/rng.ts');
 const {createElement:h}=await import('react');
 const {renderToStaticMarkup:render}=await import('react-dom/server');
 const exercises=JSON.parse(readFileSync(`${root}/src/tcf/content/a0-a1/ce.json`));
 const formats=JSON.parse(readFileSync(`${root}/src/tcf/content/ce-document-formats.json`));
 for (const artwork of CE_ARTWORKS) {
  const exercise=exercises.find(ex=>ex.id===artwork.id);
  assert(exercise,`${artwork.id}: exercice absent de la banque CE`);
  assert(ceArtFor(exercise),`${artwork.id}: image active périmée ou format incompatible`);
 }
 const plan=JSON.parse(readFileSync(`${root}/docs/tcf/ce-art-prompts.json`));
 const {WorksheetSheet}=await server.ssrLoadModule('/src/components/generator/WorksheetSheet.tsx');
 const {DEFAULT_INSTITUTIONAL}=await server.ssrLoadModule('/src/components/math/PrintDocumentChrome.tsx');
 const {isAssociationAnnonce}=await server.ssrLoadModule('/src/tcf/association-documents.ts');
 const {blockPointsTotal}=await server.ssrLoadModule('/src/tpm/test.ts');
 assert.equal(new Set(CE_ARTWORKS.map(p=>p.id)).size,CE_ARTWORKS.length);
 assert.equal(new Set(CE_ARTWORKS.map(p=>p.src)).size,CE_ARTWORKS.length);
 assert.equal(Object.keys(formats).length,exercises.length);
 assert.equal(plan.documents.length,exercises.length);
 assert(!/€|\beuros?\b|\bfrancs?(?: suisses?)?\b/i.test(JSON.stringify(exercises)));
 for(const ex of exercises)for(const q of ex.questions){
  const choices=q.choix||q.formes?.qcm_texte?.choix;
  if(!choices||!choices.every(c=>typeof c.texte==='string'))continue;
  assert.equal(choices.filter(c=>c.correct).length,1,ex.id+': '+q.enonce);
  const labels=choices.map(c=>c.texte.toLocaleLowerCase().replaceAll('’',"'").trim());
  assert.equal(new Set(labels).size,labels.length,ex.id+': choix identiques');
 }
 const swiss=exercises.find(ex=>ex.id==='tcf-a1j-s3-ce-4');
 assert(swiss.support.texte.includes('Kunsthaus de Zurich'));assert(swiss.support.texte.includes('Kybourg'));
 assert(!JSON.stringify(exercises.map(ex=>({support:ex.support,questions:ex.questions}))).match(/Paris|Lille|Bretagne|Bruxelles|Carnavalet|Louvre|Versailles|Eiffel|\bFrance\b/));
 for(const ex of exercises) {
  assert(formats[ex.id]);
  if(tcfCeTagsOf(ex).includes('informations'))assert.equal(formats[ex.id].genre,'informative',ex.id);
  const job=plan.documents.find(j=>j.id===ex.id);assert.deepEqual(job.source.texte,ex.support.texte);
  assert.equal(job.genre,formats[ex.id].genre);
  const config={domain:'tcf-csc',topic:'tcf-ce',exerciseType:'tcf-ce-ex-1',difficulty:'facile',count:1,columns:1,pointsPerQuestion:1,tcfExercise:ex};
  const plain=tryGenerateTcfBlock({...config,tcfCeFormat:'texte'},createRng(42));
  const images=tryGenerateTcfBlock({...config,tcfCeFormat:'image'},createRng(42));
  assert.deepEqual(plain.items.filter(x=>x.tcf?.kind!=='support'),images.items.filter(x=>x.tcf?.kind!=='support'));
  assert.equal(images.items[0].tcf.ceFormat,'image');
  const textMarkup=render(h(TexteSupport,{exercise:ex,mode:'student',ceFormat:'texte'}));
  const imageMarkup=render(h(TexteSupport,{exercise:ex,mode:'student',ceFormat:'image'}));
  assert(!textMarkup.includes('tcf-ce-art'));
  assert.equal(imageMarkup.includes('class="tcf-ce-art"'),Boolean(ceArtFor(ex)),ex.id);
  assert.equal(blockFromPage({...config,tcfCeFormat:'image'}).tcfCeFormat,'image');
  const worksheets=buildWorksheets([{...config,tcfCeFormat:'image'}],42);
  if(ceArtFor(ex)) {
   const art=ceArtFor(ex);assert.equal(art.sourceKey,ceArtKey(ex));assert(existsSync(`${root}/public${art.src}`));
   assert(art.width>=1000&&art.height>=1000);
   if(art.engine==='document-render')assert.equal(art.fontFamily,'URW Gothic');
   assert.equal(worksheets.filter(sheet=>sheet.cePosterSheet).length,1,ex.id);
   const poster=worksheets.find(sheet=>sheet.cePosterSheet);
   assert.equal(poster.items.length,1);
   for(const mode of ['student','answers']) {
    const markup=render(h(WorksheetSheet,{page:poster,mode,institutional:DEFAULT_INSTITUTIONAL,evalMode:true,pageNumber:1,total:worksheets.length,sheetIndex:1,documentTotalPoints:20}));
    assert(!markup.includes('doc-header'));assert(!markup.includes('doc-student-block'));assert(!markup.includes('sheet-instruction'));
    assert(markup.includes('exercise-heading'));assert(markup.includes('exercise-instruction'));
    assert(markup.includes('sheet-footer doc-footer'));assert(markup.includes(`src="${art.src}"`));
   }
   const changed={...ex,support:{...ex.support,texte:ex.support.texte+' Nouveau message.'}};
   assert.equal(ceArtFor(changed),undefined);
   const plainQuestions=plain.items.filter(item=>item.tcf?.kind!=='support');
   const imageQuestions=worksheets.flatMap(sheet=>sheet.items).filter(item=>item.tcf?.kind!=='support');
   assert.deepEqual(imageQuestions,plainQuestions,ex.id);
   assert.equal(worksheets.length,2,ex.id);
   assert.equal(worksheets[1].blocks[0].tcfPageBreakAfter[0],true);
   const questionsMarkup=render(h(WorksheetSheet,{page:worksheets[1],mode:'student',institutional:DEFAULT_INSTITUTIONAL,evalMode:false,pageNumber:2,total:2,sheetIndex:2,documentTotalPoints:10,interactiveTcfPageBreaks:true,onToggleTcfPageBreak:()=>{}}));
   assert(questionsMarkup.includes('Remettre cette question et les suivantes sur la page précédente'));
   const joined=buildWorksheets([{...config,tcfCeFormat:'image',tcfPageBreakAfter:[false]}],42);
   assert.equal(joined.length,1);assert(!joined[0].cePosterSheet);
   assert.deepEqual(joined[0].items,images.items,ex.id);
   const manual=buildWorksheets([{...config,tcfCeFormat:'image',tcfPageBreakAfter:[true,false,false,true]}],42);
   assert.equal(manual.length,3);assert.equal(manual[1].blocks[0].itemOffset,1);assert.equal(manual[2].blocks[0].itemOffset,4);
   assert.deepEqual(manual.flatMap(sheet=>sheet.items),images.items,ex.id);
  } else {
   assert.equal(imageMarkup,textMarkup,ex.id);
   const fallbackQuestions=sheets=>sheets.flatMap(sheet=>sheet.items).map(item=>item.tcf?.kind==='support'?{...item,tcf:{...item.tcf,ceFormat:'texte'}}:item);
   assert.deepEqual(fallbackQuestions(worksheets),fallbackQuestions(buildWorksheets([{...config,tcfCeFormat:'texte'}],42)),ex.id);
   assert(!worksheets.some(sheet=>sheet.cePosterSheet),ex.id);
  }
 }
 // Les personnes et leur barème restent disponibles après une affiche d’association.
 const association={...exercises[0],type_exercice:'annonce',points:3.5,support:{titre:'Petites annonces',texte:'Document 1 — Théâtre\nAtelier du mercredi.\n\nDocument 2 — Vélo\nSortie du samedi.\n\nLes personnes :\nA. Amine aime le vélo.\nB. Myriam aime le théâtre.'},questions:[{type_reponse:'lignes',enonce:'Associez les personnes aux documents.',tableau:[{label:'Document 1',reponse:'B. Myriam'},{label:'Document 2',reponse:'A. Amine'}]}]};
 assert(isAssociationAnnonce(association));
 CE_ARTWORKS.push({id:association.id,sourceKey:ceArtKey(association),genre:formats[association.id].genre,src:CE_ARTWORKS[0].src});
 try {
  const sheets=buildWorksheets([{domain:'tcf-csc',topic:'tcf-ce',exerciseType:'tcf-ce-ex-3',difficulty:'facile',count:1,columns:1,tcfExercise:association,tcfCeFormat:'image'}],42);
  assert.equal(sheets.length,2);
  assert(sheets[0].cePosterSheet);assert.equal(sheets[1].items[0].tcf.kind,'ce_association_answers');
  assert.equal(sheets.reduce((n,s)=>n+s.blocks.reduce((sum,b)=>sum+blockPointsTotal(b.items,1),0),0),3.5);
  const markup=render(h(WorksheetSheet,{page:sheets[1],mode:'answers',institutional:DEFAULT_INSTITUTIONAL,evalMode:true,pageNumber:2,total:2,sheetIndex:2,documentTotalPoints:3.5}));
  assert(markup.includes('Document n°'));assert(markup.includes('tcf-assoc-people'));
 } finally {CE_ARTWORKS.pop()}
 console.log(`${exercises.length} textes suisses et questions vérifiés (CHF), ${CE_ARTWORKS.length} images disponibles : titre, consigne, image puis questions ; coupure Page annulable et pied conservé ; texte original pour les images manquantes ou périmées.`);

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
