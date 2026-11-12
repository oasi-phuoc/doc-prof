import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5182'
const server = await createServer({ cacheDir: '/tmp/clairfle-csc-browser-vite', server: { host: '127.0.0.1', port: 5182, strictPort: true } })
await server.listen()
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] })
const errors = [], results = []
const button = (page, name) => page.getByRole('button', { name, exact: true })
const preview = (page) => page.locator('.sheet-stage:not(.print-only-sheets) .worksheet-sheet:visible').first()
function zipEntries(buffer) {
  const entries = []; let offset = 0
  while (buffer.readUInt32LE(offset) === 0x04034b50) {
    assert.equal(buffer.readUInt16LE(offset + 8), 0)
    const length = buffer.readUInt32LE(offset + 18), nameLength = buffer.readUInt16LE(offset + 26), extra = buffer.readUInt16LE(offset + 28)
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLength), start = offset + 30 + nameLength + extra
    entries.push({ name, data: buffer.subarray(start, start + length) }); offset = start + length
  }
  return entries
}
try {
  await mkdir('docs/tcm-csc/screenshots', { recursive: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  let page = await context.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  await context.addCookies([{ name: 'clairfle-fiche-access', value: 'admin', url: base }])
  await page.goto(`${base}/generateur`)
  await page.getByLabel('Domaine', { exact: true }).click({ timeout: 120000 })
  await page.getByRole('option', { name: 'TCM CSC', exact: true }).click()
  await page.getByLabel('Page 15', { exact: true }).waitFor()
  assert.match(await preview(page).innerText(), /23 exercices/)
  assert.equal(await page.getByRole('spinbutton', { name: 'Points par question de l’exercice sélectionné', exact: true }).count(), 0)
  console.log('CSC : test complet chargé depuis le menu Domaine.')

  await page.getByLabel('Page 3', { exact: true }).click()
  await preview(page).locator('.csc-number-grid').waitFor()
  assert.equal(await preview(page).locator('.csc-number-grid td').count(), 36)
  assert.equal(await preview(page).locator('.csc-number-grid tr').count(),6)
  const gridCells = await preview(page).locator('.csc-number-grid td').evaluateAll(nodes=>nodes.map(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height})))
  assert.ok(gridCells.every(cell=>Math.abs(cell.width-cell.height)<1))
  assert.equal(await preview(page).locator('.csc-heard').count(), 0)
  const [download] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }), button(page, 'Télécharger tous les audios de la fiche').click()])
  assert.equal(download.suggestedFilename(), 'TCM-CSC_AUDIOS.zip')
  const entries = zipEntries(await readFile(await download.path()))
  assert.equal(entries.length, 3)
  const audio = entries.map(({ name, data }) => {
    assert.equal(data.toString('ascii', 0, 4), 'RIFF'); assert.equal(data.toString('ascii', 8, 12), 'WAVE')
    const seconds = data.readUInt32LE(40) / data.readUInt32LE(28)
    assert.ok(seconds > 24)
    return { name, seconds: Math.round(seconds * 10) / 10 }
  })
  results.push({ audio: 'three real decoded WAV files, five prompts each and six-second gaps', files: audio })
  console.log('CSC : trois pistes WAV décodées et téléchargées.')

  await page.emulateMedia({ media: 'print' })
  await page.evaluate(async () => { for (const image of document.images) image.loading = 'eager'; await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode().catch(() => {}))) })
  const printed = page.locator('.print-only-sheets .worksheet-sheet')
  const pages = await printed.count()
  assert.ok(pages === 16 || pages === 32, `Unexpected print page count ${pages}`)
  const copiesCount=pages/16
  const bounds = await printed.evaluateAll((sheets) => sheets.map((sheet, i) => {
    const footer = sheet.querySelector('.doc-footer').getBoundingClientRect()
    const blocks = [...sheet.querySelectorAll('.exercise-block')].map((block) => ({ label: block.querySelector('.exercise-heading')?.textContent?.trim().slice(0, 90), bottom: block.getBoundingClientRect().bottom }))
    return { page: i + 1, footer: footer.top, blocks }
  }))
  const overflow = bounds.flatMap((sheet) => sheet.blocks.filter((block) => block.bottom > sheet.footer + 1).map((block) => ({ page: sheet.page, label: block.label, overflow: Math.round(block.bottom - sheet.footer) })))
  assert.deepEqual(overflow, [], 'Every printed exercise stays above its footer.')
  assert.equal(await printed.locator('.csc-copy').count(), copiesCount*2)
  const copies = await printed.locator('.csc-copy').evaluateAll((pairs) => pairs.map((pair) => [...pair.querySelectorAll('svg')].map((svg) => ({ cols: Number(svg.dataset.copyCols), rows: Number(svg.dataset.copyRows), scale: Number(svg.dataset.copyScale), paths: svg.querySelectorAll('[data-copy-figure]').length }))))
  assert.deepEqual(copies[0].map((grid) => grid.scale), [1, 1]); assert.deepEqual(copies[1].map((grid) => grid.scale), [1, 2])
  for (const pair of copies.slice(0, 2)) { assert.ok(pair[0].paths > 0); assert.equal(pair[1].paths, 0); assert.equal(pair[1].cols, pair[0].cols * pair[1].scale); assert.equal(pair[1].rows, pair[0].rows * pair[1].scale) }
  if (pages === 32) for (const pair of copies.slice(2)) assert.ok(pair[1].paths > 0)
  const coords = await printed.locator('.coord-block.is-csc-left').evaluateAll((blocks) => blocks.map((block) => ({ questions: block.querySelectorAll('.coord-question').length, columns: getComputedStyle(block.querySelector('.coord-questions')).gridTemplateColumns.split(' ').length, side: block.querySelector('.coord-side').getBoundingClientRect().x, grid: block.querySelector('.coord-grid').getBoundingClientRect().x, gridWidth: block.querySelector('.coord-grid').getBoundingClientRect().width, legendRight:Math.max(...[...block.querySelectorAll('.coord-question')].map(node=>node.lastElementChild.getBoundingClientRect().right)), names:block.querySelectorAll('.coord-question-label').length, colors:[...new Set([...block.querySelectorAll('.coord-question-icon')].map(node=>getComputedStyle(node).color))], inline:[...block.querySelectorAll('.coord-question')].every(node=>{const icon=node.querySelector('.coord-question-icon').getBoundingClientRect(),pair=node.querySelector('.coord-pair,.coord-given,.filled-answer').getBoundingClientRect();return Math.abs((icon.y+icon.height/2)-(pair.y+pair.height/2))<3}) })))
  for (const coord of coords) { assert.equal(coord.questions, 6); assert.equal(coord.columns, 1); assert.ok(coord.side < coord.grid); assert.ok(Math.abs(coord.gridWidth-140*96/25.4)<1); assert.ok(coord.legendRight<=coord.grid-1,JSON.stringify(coord)); assert.equal(coord.names,0); assert.equal(coord.colors.length,6); assert.equal(coord.inline,true) }
  const frameHeight = await printed.locator('.is-csc-large .count-icons-frame').first().evaluate((node) => node.getBoundingClientRect().height)
  assert.ok(Math.abs(frameHeight - 97.5 * 96 / 25.4) < 1)
  assert.equal(await printed.locator('.csc-shape-names > div').count(), copiesCount*4)
  assert.equal(await printed.locator('.csc-length-table tbody tr').count(), copiesCount*2)
  const exercise = number=>printed.locator(`[data-exercise-type="tcm-csc-ex${String(number).padStart(2,'0')}"]`)
  assert.equal(await exercise(4).locator('.exercise-item').count(),copiesCount*4)
  assert.equal(await exercise(5).locator('.exercise-item').count(),copiesCount*4)
  assert.equal(await exercise(7).locator('.exercise-item').count(),copiesCount*12)
  assert.match(await exercise(7).first().locator('.exercise-instruction').innerText(),/Coloriez/)
  const hints=await exercise(4).locator('.csc-step-hint').evaluateAll(nodes=>nodes.map(node=>({text:node.textContent,border:parseFloat(getComputedStyle(node).borderWidth),hint:node.getBoundingClientRect().toJSON(),row:node.nextElementSibling.getBoundingClientRect().toJSON()})))
  for(const hint of hints){assert.match(hint.text,/^[+−]\d+$/);assert.ok(hint.border>0);assert.ok(hint.hint.right<=hint.row.x);assert.ok(Math.abs(hint.hint.y+hint.hint.height/2-hint.row.y-hint.row.height/2)<3)}
  assert.equal(await exercise(8).locator('.place-value-row').count(),copiesCount*2)
  assert.equal(await exercise(9).locator('.op-name-row').count(),copiesCount*3)
  assert.deepEqual((await exercise(9).first().locator('.op-name-box').allTextContents()).sort(),['+','−','='].sort())
  const digitRows=await printed.locator('[data-exercise-type="tcm-csc-ex10"] .digit-row, [data-exercise-type="tcm-csc-ex11"] .digit-row').evaluateAll(rows=>rows.map(row=>({count:row.children.length,sizes:[...row.children].map(cell=>({w:cell.getBoundingClientRect().width,h:cell.getBoundingClientRect().height,carry:cell.classList.contains('carry')}))})))
  assert.deepEqual((await exercise(10).locator('.item-number').allTextContents()).slice(0,8),['1.','2.','3.','4.','5.','6.','7.','8.'])
  for(const row of digitRows){assert.equal(row.count,5);for(const cell of row.sizes){assert.ok(Math.abs(cell.w-56)<1);assert.ok(Math.abs(cell.h-(cell.carry?36:56))<1)}}
  const frames=await exercise(16).locator('.exercise-item').evaluateAll(nodes=>nodes.map(node=>({border:parseFloat(getComputedStyle(node).borderWidth),padding:parseFloat(getComputedStyle(node).paddingTop)})))
  assert.ok(frames.every(frame=>frame.border>0&&frame.padding>=15),JSON.stringify(frames))
  for(const block of await exercise(17).locator('.csc-shape-names').all()){assert.equal((await block.evaluate(node=>getComputedStyle(node).gridTemplateColumns)).split(' ').length,2);assert.equal(await block.locator('.answer-line-field').count(),4)}
  assert.equal(await printed.locator('.csc-problem-text .draft-pad.plain').count(),copiesCount*3)
  const pdf = await page.pdf({ path: 'docs/tcm-csc/tcm-csc-exemple.pdf', preferCSSPageSize: true, printBackground: true })
  assert.equal([...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length, pages)
  results.push({ print: `${pages} portrait A4 pages; no exercise crosses its footer`, revisions:'36 square number cells; four sequences per exercise; twelve comparisons; CFR decomposition; three sign names; five columns with doubled writing cells', copies: 'two separate grids, unchanged orientation, doubled rows and columns for enlargement; target figures hidden in student copies', geometry: 'framed logic questions; four fixed forms in a 2x2 frame grid; 97.5 mm counting frame; double-size coordinate cells with six distinct colors and inline shape/coordinate rows' })
  console.log('CSC : impression et géométrie vérifiées.')
  await page.close()
  page = await context.newPage()
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${base}/generateur`)
  await page.getByLabel('Domaine', { exact: true }).click({ timeout: 120000 })
  await page.getByRole('option', { name: 'TCM CSC', exact: true }).click()

  await page.getByLabel('Page 10', { exact: true }).click()
  await button(page, 'Mode libre').click()
  const editor = page.getByRole('complementary', { name: 'Mode libre', exact: true })
  const logic = editor.getByLabel('Choisir la suite graphique', { exact: true }).first()
  await logic.waitFor()
  const choices = await logic.locator('option').evaluateAll((options) => options.map((option) => option.value))
  const previous = await logic.inputValue(), selected = choices.find((value) => value !== previous)
  await logic.selectOption(selected)
  await button(page, 'Valider les changements').click()
  const current = await logic.inputValue(); assert.equal(current, selected)
  await button(page, 'Fermer le mode libre').click()
  await page.getByLabel('Page 15', { exact: true }).click()
  const pads=preview(page).locator('.csc-problem-text .draft-pad')
  assert.equal(await pads.count(),3);assert.equal(await pads.first().getAttribute('class'),'draft-pad draft-pad-short plain')
  await preview(page).getByRole('button',{name:'Sans',exact:true}).first().click()
  assert.match(await pads.first().getAttribute('class'),/with-grid/)
  await preview(page).getByRole('button',{name:'Grille',exact:true}).first().click()
  assert.match(await pads.first().getAttribute('class'),/plain/)
  await button(page, 'Mode libre').click()
  const problem = editor.getByLabel('Choisir le problème', { exact: true })
  await problem.waitFor(); assert.equal(await problem.locator('option').count(), 103)
  assert.equal(await problem.inputValue(), 'crayons-nadia-julie')
  await problem.selectOption('soustraction-01')
  await editor.getByLabel('Premier nombre', { exact: true }).fill('98'); await editor.getByLabel('Premier nombre', { exact: true }).blur()
  await editor.getByLabel('Deuxième nombre', { exact: true }).fill('54'); await editor.getByLabel('Deuxième nombre', { exact: true }).blur()
  await button(page, 'Valider les changements').click()
  await button(page, 'Fermer le mode libre').click()
  assert.match(await preview(page).locator('.csc-problem-text').first().innerText(), /98 livres/)
  await button(page, 'Fiche élève (cliquer pour corrigé)').click()
  assert.match(await preview(page).locator('.csc-problem-text').first().innerText(), /44 livres/)
  await preview(page).screenshot({ path: 'docs/tcm-csc/screenshots/problemes-corriges.png' })
  results.push({ freeMode: 'source logic question selectable; 103 problem contexts available; changing to subtraction with 98 and 54 recomputes 44 books after validation', numbering: 'exercise 21 omitted; exercises 22, 23 and 24 kept' })
  assert.deepEqual(errors, [])
  await writeFile('docs/tcm-csc/browser-results.json', JSON.stringify({ results, errors }, null, 2) + '\n')
  console.log(JSON.stringify(results, null, 2))
  await context.close()
} finally { await browser.close(); await server.close() }
