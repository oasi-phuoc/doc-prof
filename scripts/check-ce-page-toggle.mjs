import { createServer } from 'vite'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const {chromium}=await import(process.argv[2]||'playwright')
const bank=JSON.parse(readFileSync(resolve(root,'src/tcf/content/a0-a1/ce.json')))
const art=JSON.parse(readFileSync(resolve(root,'src/tcf/content/ce-art.json')))[0]
const ex=bank.find(ex=>ex.id===art.id)
const config={domain:'tcf-csc',topic:'tcf-ce',exerciseType:'tcf-ce-ex-1',difficulty:'facile',count:1,columns:1,tcfExercise:ex,tcfCeFormat:'image'}
const harness=`import React,{useState} from 'react';import{createRoot}from'react-dom/client';
import{buildWorksheets}from'/src/math/generate.ts';import{blockFromPage}from'/src/math/page-model.ts';
import{usePageConfig}from'/src/components/generator/usePageConfig.ts';import{WorksheetSheet}from'/src/components/generator/WorksheetSheet.tsx';import{DEFAULT_INSTITUTIONAL}from'/src/components/math/PrintDocumentChrome.tsx';
function App(){const[pages,setPages]=useState([${JSON.stringify(config)}]);const sheets=buildWorksheets(pages,42);const active=sheets.length>1?1:0;
const{toggleTcfPageBreak}=usePageConfig({pageIndex:0,safeBlockIndex:0,safeSheetIndex:active,setPages,activeBlock:blockFromPage(pages[0]),activeSheet:sheets[active],worksheets:sheets,seed:42,libreMode:false,isPhraseDomain:false,isCalliDomain:false,isJeuxDomain:false,isTcf:true});
return <main data-page-count={sheets.length}>{sheets.map((sheet,index)=><WorksheetSheet key={index} page={sheet} mode="student" institutional={DEFAULT_INSTITUTIONAL} evalMode={false} pageNumber={index+1} total={sheets.length} sheetIndex={index+1} documentTotalPoints={10} interactiveTcfPageBreaks onToggleTcfPageBreak={(itemIndex,block)=>toggleTcfPageBreak(itemIndex,block,index)}/>)}</main>}
createRoot(document.getElementById('root')).render(<App/>);`
const vite=await createServer({root,appType:'custom',server:{host:'127.0.0.1',port:0,hmr:false,ws:false},plugins:[{name:'ce-page-toggle-fixture',resolveId(id){if(id==='/__ce_toggle.tsx')return id},load(id){if(id==='/__ce_toggle.tsx')return harness}}]})
vite.middlewares.use((req,res,next)=>{if(req.url==='/__ce_toggle'){res.setHeader('Content-Type','text/html');res.end('<div id="root"></div><script type="module" src="/__ce_toggle.tsx"></script>')}else next()})
let browser
try{
 await vite.listen()
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
 const page=await browser.newPage()
 const errors=[];page.on('pageerror',error=>errors.push(error.message))
 await page.goto(`http://127.0.0.1:${vite.httpServer.address().port}/__ce_toggle`)
 await page.locator('main[data-page-count="2"]').waitFor()
 await page.getByLabel('Remettre cette question et les suivantes sur la page précédente').first().click()
 await page.locator('main[data-page-count="1"]').waitFor()
 await page.getByLabel('Passer cette question et les suivantes sur une nouvelle page').first().click()
 await page.locator('main[data-page-count="2"]').waitFor()
 assert.deepEqual(errors,[])
 console.log('Bouton Page testé dans Chromium : 2 pages par défaut → annulation en 1 page → réactivation en 2 pages.')
}finally{if(browser)await browser.close();await vite.close()}
