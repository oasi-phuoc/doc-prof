#!/usr/bin/env node
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..')
const { chromium }=await import(process.argv[2]||'playwright')
const source=JSON.parse(readFileSync(resolve(root,'src/tcf/content/a0-a1/ce.json'),'utf8'))
const choices=Object.entries(JSON.parse(readFileSync(resolve(root,'src/tcf/content/ce-document-formats.json'),'utf8'))).filter(([,format])=>format.engine==='document-render').map(([id,format])=>({id,...format}))
const catalogPath=resolve(root,'src/tcf/content/ce-art.json')
let catalog=JSON.parse(readFileSync(catalogPath,'utf8'))
const verify=process.argv.includes('--verify')
const only=new Set(process.argv.slice(3).filter(arg=>!arg.startsWith('--')))
const font=readFileSync(resolve(root,'scripts/assets/ce-font/URWGothic-Book.otf'))
const fontHash=createHash('sha256').update(font).digest('hex')
const fontCss=`@font-face{font-family:'TCF CE Gothic';src:url(data:font/otf;base64,${font.toString('base64')}) format('opentype');font-weight:400;font-style:normal}body,.ce-message-export,.ce-message-export *{font-family:'TCF CE Gothic',sans-serif!important}`
const temp=mkdtempSync(resolve(tmpdir(),'ce-messages-'))
const server=await createServer({root,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'})
const css=`*{box-sizing:border-box}body{margin:0;background:#fff;font-family:Arial,sans-serif;color:#222}.ce-message-export{width:1240px;height:1754px;padding:60px;display:flex;align-items:center;justify-content:center;background:#faf7ee}.ce-message-source{white-space:pre-wrap;font-size:28px;line-height:1.65;font-weight:400;text-align:left;overflow-wrap:anywhere}.ce-phone{width:800px;height:1600px;border:22px solid #24282a;border-radius:65px;background:#24282a;box-shadow:0 12px 25px #0002;position:relative;padding:10px 0}.ce-phone-camera{position:absolute;top:-8px;left:40%;width:20%;height:22px;border-radius:0 0 14px 14px;background:#24282a;z-index:1}.ce-phone-screen{height:100%;overflow:hidden;border-radius:34px;display:flex;flex-direction:column;background:#f3f0e7}.ce-phone-contact{padding:42px 34px 30px;background:#346c65;color:#fff;font-size:30px;font-weight:400}.ce-phone-conversation{flex:1;padding:40px 28px}.ce-phone-bubble{background:white;padding:26px 30px;border-radius:0 22px 22px 22px;box-shadow:0 1px 4px #0001}.ce-phone-input{display:flex;align-items:center;gap:20px;padding:20px 25px;background:#e9e9e5;font-size:28px;color:#346c65}.ce-phone-input div{flex:1;height:50px;border-radius:25px;background:white}.ce-email-window{width:1100px;min-height:1500px;max-height:1620px;border:1px solid #b9bdba;background:white;box-shadow:0 9px 22px #0001;border-radius:12px;overflow:hidden}.ce-email-toolbar{font-size:28px;font-weight:400;padding:25px 34px;background:#e8eeec;border-bottom:1px solid #cdd4d2}.ce-email-fields{display:grid;grid-template-columns:95px 1fr;gap:16px;margin:0;padding:30px 40px;border-bottom:1px solid #ddd;font-size:24px;line-height:1.4}.ce-email-fields dd{margin:0;overflow-wrap:anywhere}.ce-email-fields dt{color:#555;font-weight:400}.ce-email-text{padding:45px}.ce-letter-paper{width:1100px;height:1610px;padding:90px 75px;background:#fffef9;border:1px solid #ddd8c9;box-shadow:0 8px 20px #0001}.ce-letter-text{font-family:Georgia,serif;font-size:29px;line-height:1.75}`
let browser
try{
 const {CeMessageImage}=await server.ssrLoadModule('/src/components/tcf/CeMessageImage.tsx')
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
 const page=await browser.newPage({viewport:{width:1240,height:1754},deviceScaleFactor:1})
 mkdirSync(resolve(root,'public/lib/images/tcf/ce-art-generated'),{recursive:true})
 let exported=0,skipped=0
 for(const job of choices){
  if(only.size&&!only.has(job.id))continue
  const ex=source.find(ex=>ex.id===job.id);assert(ex)
  const sourceKey=JSON.stringify({support:ex.support,scene:ex.scene,theme:ex.theme})
  const current=catalog.find(art=>art.id===job.id)
  if(!verify&&current?.engine==='document-render'&&current.sourceKey===sourceKey&&current.genre===job.genre&&current.fontHash===fontHash&&existsSync(resolve(root,'public'+current.src))){skipped++;continue}
  const html=renderToStaticMarkup(createElement(CeMessageImage,{exercise:ex,genre:job.genre||ex.type_exercice}))
  await page.setContent(`<style>${css}${fontCss}</style>${html}`)
  await page.evaluate(()=>document.fonts.ready)
  assert(await page.evaluate(()=>document.fonts.check('28px "TCF CE Gothic"')))
  const body=page.locator('.ce-message-source')
  assert.equal(await body.textContent(),ex.support.texte)
  assert.equal(await page.locator('img').count(),0)
  let fits=false
  for(const size of [28,27,26,25,24]){
   await body.evaluate((el,size)=>{el.style.fontSize=`${size}px`},size)
   fits=await body.evaluate(el=>{
    const box=el.closest('.ce-phone-conversation,.ce-email-window,.ce-letter-paper').getBoundingClientRect()
    const range=document.createRange();range.selectNodeContents(el)
    const text=range.getBoundingClientRect()
    return text.bottom<=box.bottom-25&&text.right<=box.right-25&&el.scrollHeight<=el.clientHeight+1
   })
   if(fits)break
  }
  assert(fits,`Le message ne tient pas sur son support : ${ex.id}`)
  if(verify){assert(current&&current.sourceKey===sourceKey&&current.genre===job.genre&&current.fontHash===fontHash&&existsSync(resolve(root,'public'+current.src)),`Image absente ou périmée : ${ex.id}`);skipped++;continue}
  const png=resolve(temp,'message.png'),out=resolve(root,`public/lib/images/tcf/ce-art-generated/${ex.id}.webp`)
  await page.screenshot({path:png})
  execFileSync('convert',['-limit','thread','1',png,'-quality','92',out])
  catalog=catalog.filter(art=>art.id!==ex.id)
  catalog.push({id:ex.id,label:ex.scene||ex.support.titre||ex.theme||'Message',src:`/lib/images/tcf/ce-art-generated/${ex.id}.webp`,sourceKey,genre:job.genre,engine:'document-render',fontFamily:'URW Gothic',fontHash,width:1240,height:1754})
  writeFileSync(catalogPath,JSON.stringify(catalog,null,2)+'\n')
  exported++
 }
 console.log(`${exported} messages exportés, ${skipped} images conformes conservées ou vérifiées : texte exact, aucun surlignage, aucune illustration supplémentaire.`)
}finally{if(browser)await browser.close();await server.close();rmSync(temp,{recursive:true,force:true})}
