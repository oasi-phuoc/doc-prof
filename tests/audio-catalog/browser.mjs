import assert from 'node:assert/strict'
import {readFile,mkdir,writeFile} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {createServer} from 'vite'
import {chromium} from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base='http://127.0.0.1:5197',output='/tmp/clairfle-audio-catalog-browser'
await mkdir(output,{recursive:true});await mkdir('docs/audio-catalog/screenshots',{recursive:true})
const server=await createServer({cacheDir:'/tmp/clairfle-audio-browser-vite',server:{host:'127.0.0.1',port:5197,strictPort:true}});await server.listen()
const index=JSON.parse(await readFile('src/audio-catalog/catalog.generated.json','utf8'))
const details=JSON.parse(await readFile('public/audio-catalog/tcf.json','utf8'))
const candidates=index.entries.filter(a=>a.collection==='TCF'&&a.questionCount>=1&&a.questionCount<=3&&details[a.id]?.blocks.some(b=>b.questions.some(q=>q.formats.some(f=>f.kind==='image'))))
const selected=candidates.slice(0,2);assert.equal(selected.length,2)
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']})
const results=[],errors=[]
const button=(page,name)=>page.getByRole('button',{name,exact:true})
const validateWord=(file,audio)=>JSON.parse(execFileSync('python3',['-c',`import zipfile,sys,json,xml.etree.ElementTree as E
z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
d=E.fromstring(z.read('word/document.xml')); text=' '.join(n.text or '' for n in d.findall('.//w:t',ns))
expected=json.loads(sys.argv[2]);assert expected['label'] in text
assert 'Transcription' in text and 'Corrigés et réponses modèles' in text and '☐ A' in text
for block in expected['detail']['blocks']:
 for q in block['questions']:
  assert q['prompt'] in text
  for form in q['formats']: assert form['label'] in text
for transcript in expected['detail']['transcripts']:
 for line in transcript['text'].splitlines(): assert line in text
rels=E.fromstring(z.read('word/_rels/document.xml.rels'));targets={r.attrib['Id']:r.attrib['Target'] for r in rels}
for image in d.findall('.//a:blip',ns): assert 'word/'+targets[image.attrib['{'+ns['r']+'}embed']] in z.namelist()
assert len(d.findall('.//w:tbl',ns))>0 and len(d.findall('.//a:blip',ns))>0
try:
 from docx import Document
 document=Document(sys.argv[1]);assert len(document.tables)>0 and len(document.inline_shapes)>0
except ImportError: pass
print(json.dumps({'tables':len(d.findall('.//w:tbl',ns)),'embeddedImages':len([n for n in z.namelist() if n.startswith('word/media/')]),'allQuestions':True}))`,file,JSON.stringify({label:audio.label,detail:details[audio.id]})],{encoding:'utf8'}))
try{
 const anonymous=await browser.newPage();await anonymous.goto(base+'/audios');await anonymous.waitForURL('**/acces');await anonymous.close()
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});await context.addCookies([{name:'clairfle-fiche-access',value:'admin',url:base}]);await context.addInitScript(()=>{window.showSaveFilePicker=undefined})
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));let mediaRequests=0;page.on('request',r=>{if(r.url().includes('/lib/audio/'))mediaRequests++})
 await page.goto(base+'/audios');await page.getByRole('heading',{name:'Catalogue des audios',exact:true}).waitFor({timeout:120000})
 assert.equal(await page.locator('.audio-card').count(),24);assert.equal(mediaRequests,0,'The list does not preload recordings')
 const audioLink=page.getByRole('link',{name:'Catalogue des audios',exact:true}),imageLink=page.getByRole('link',{name:'Galerie d’images',exact:true})
 assert.ok((await audioLink.boundingBox()).x<(await imageLink.boundingBox()).x)
 await page.getByLabel('Rechercher un audio',{exact:true}).fill(selected[0].id);assert.equal(await page.locator('.audio-card').count(),1)
 const player=page.locator('.audio-card audio');await player.evaluate(node=>node.play());await page.waitForFunction(()=>document.querySelector('.audio-card audio').currentTime>.1);await player.evaluate(node=>node.pause())
 const [single]=await Promise.all([page.waitForEvent('download'),button(page,'Télécharger l’audio').click()]);const singlePath=output+'/'+single.suggestedFilename();await single.saveAs(singlePath);assert.deepEqual(await readFile(singlePath),await readFile('public'+selected[0].src))
 await player.evaluate(node=>node.play());await button(page,'Voir la transcription et les questions').click();const dialog=page.getByRole('dialog');await dialog.waitFor();await dialog.getByRole('heading',{name:'Transcription',exact:true}).waitFor();assert.ok((await dialog.innerText()).includes(details[selected[0].id].transcripts[0].text))
 await dialog.locator('audio').evaluate(node=>node.play());assert.equal(await player.evaluate(node=>node.paused),true)
 assert.ok(await dialog.locator('table img').count()>0)
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'})
 const [word]=await Promise.all([page.waitForEvent('download',{timeout:120000}),button(page,'Télécharger le Word').click()]);const wordPath=output+'/audio.docx';await word.saveAs(wordPath)
 results.push({word:validateWord(wordPath,selected[0])});await writeFile('docs/audio-catalog/exemple-audio-questions.docx',await readFile(wordPath))
 for(const audio of selected){await page.getByLabel('Rechercher un audio',{exact:true}).fill(audio.id);await page.locator('.audio-card input[type=checkbox]').check()}
 const [zip]=await Promise.all([page.waitForEvent('download',{timeout:120000}),button(page,'Télécharger la sélection (ZIP)').click()]);await zip.saveAs(output+'/selection.zip')
 const names=JSON.parse(execFileSync('python3',['-c',`import zipfile,sys,json,pathlib,io,xml.etree.ElementTree as E
z=zipfile.ZipFile(sys.argv[1]);assert z.testzip() is None; assert len(z.namelist())==4
for name in z.namelist():
 if name.endswith('.mp3'): assert z.read(name)==pathlib.Path('public',name).read_bytes()
 else:
  d=zipfile.ZipFile(io.BytesIO(z.read(name)));assert d.testzip() is None;E.fromstring(d.read('word/document.xml'))
print(json.dumps(z.namelist()))`,output+'/selection.zip'],{encoding:'utf8'}));results.push({groupZip:names})
 await page.getByRole('checkbox',{name:'Inclure un fichier Word par audio',exact:true}).uncheck()
 await page.evaluate(()=>{window.audioZipParts=[];window.showSaveFilePicker=async()=>({createWritable:async()=>({write:async chunk=>window.audioZipParts.push(Array.from(new Uint8Array(await new Blob([chunk]).arrayBuffer()))),close:async()=>{window.audioZipClosed=true},abort:async()=>{window.audioZipAborted=true}})})})
 await button(page,'Télécharger la sélection (ZIP)').click();await page.waitForFunction(()=>window.audioZipClosed===true)
 await writeFile(output+'/stream.zip',Buffer.from(await page.evaluate(()=>window.audioZipParts.flat())))
 execFileSync('python3',['-c','import zipfile,sys,pathlib;z=zipfile.ZipFile(sys.argv[1]);assert len(z.namelist())==2 and z.testzip() is None;assert all(z.read(n)==pathlib.Path("public",n).read_bytes() for n in z.namelist())',output+'/stream.zip'])
 await page.evaluate(()=>{window.showSaveFilePicker=async()=>{throw new DOMException('Unsupported in this frame','SecurityError')}})
 const [fallback]=await Promise.all([page.waitForEvent('download'),button(page,'Télécharger la sélection (ZIP)').click()]);await fallback.saveAs(output+'/fallback.zip')
 await page.evaluate(()=>{window.showSaveFilePicker=undefined});await page.getByRole('checkbox',{name:'Inclure un fichier Word par audio',exact:true}).check()
 results.push({stream:'sequential disk writer preserves two originals and valid CRCs',fallback:'ordinary download works when the file picker is unavailable in an embedded frame'})
 await button(page,'Effacer les filtres').click();await page.getByLabel('Collection',{exact:true}).selectOption('TCF');await page.getByLabel('Contenu associé',{exact:true}).selectOption('questions');await page.getByLabel('Niveau',{exact:true}).selectOption(selected[0].levels[0]);assert.ok(await page.locator('.audio-card').count()>0)
 await button(page,'Effacer les filtres').click();await page.getByLabel('Rechercher un audio',{exact:true}).fill('aucune-piste-xx89832');await page.getByRole('heading',{name:'Aucun audio trouvé'}).waitFor();assert.equal(await button(page,'Télécharger la sélection (ZIP)').isEnabled(),true)
 await button(page,'Effacer les filtres').click();await page.getByLabel('Rechercher un audio',{exact:true}).fill(selected[0].id)
 const firstImage=details[selected[0].id].blocks.flatMap(b=>b.questions).flatMap(q=>q.formats.flatMap(f=>(f.choices??[]).flatMap(c=>c.image?[c.image.src]:[])))[0];assert.ok(firstImage)
 await page.route('**'+firstImage,r=>r.fulfill({status:200,contentType:'text/html',body:'missing asset'}));await button(page,'Télécharger le Word').click();await page.getByRole('alert').waitFor();assert.match(await page.getByRole('alert').innerText(),/image/i);await page.unroute('**'+firstImage)
 let release;const pending=new Promise(resolve=>{release=resolve});await page.route('**'+firstImage,async route=>{await pending;await route.abort().catch(()=>undefined)})
 await button(page,'Télécharger le Word').click();await button(page,'Annuler').click();await page.getByRole('status').filter({hasText:'Téléchargement annulé.'}).waitFor();release();await page.unroute('**'+firstImage)
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:950});await page.evaluate(()=>scrollTo(0,0));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  assert.ok((await audioLink.boundingBox()).x<(await imageLink.boundingBox()).x)
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])
  await page.screenshot({path:`docs/audio-catalog/screenshots/catalogue-${width}.png`})
 }
 await imageLink.click();await page.waitForURL('**/images');await page.getByRole('heading',{name:'Galerie d’images',exact:true}).waitFor();assert.equal(await page.locator('.gallery-card').count(),48)
 await page.getByRole('link',{name:'Catalogue des audios',exact:true}).click();await page.waitForURL('**/audios');await page.getByRole('heading',{name:'Catalogue des audios',exact:true}).waitFor()
 assert.deepEqual(errors,[]);await context.close()
 results.push({auth:'anonymous route protected',navigation:'audio button left of image button; both catalogues accessible',playback:'real recording decoded and played',singleAudio:'original bytes retained',word:'all prepared questions and response forms, transcripts, tables, letters, checkboxes and embedded pictures',filters:'combined collection, level and prepared-content filters; persistent selection and empty state',failures:'HTML image fallback rejected, cancellation preserved selection',viewports:['1440x1000','390x950'],axe:'passed',errors})
 await writeFile('docs/audio-catalog/browser-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2))
}finally{await browser.close();await server.close()}
