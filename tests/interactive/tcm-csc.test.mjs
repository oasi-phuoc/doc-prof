import assert from 'node:assert/strict'
import { test } from 'node:test'
import { access } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { buildTcmCscTestPages, TCM_CSC_STEPS, TCM_CSC_MAX_SCORE } = await server.ssrLoadModule('/src/tcm-csc/test.ts')
  const { generateCscExercise, CSC_PLUS_AUDIO, CSC_MINUS_AUDIO } = await server.ssrLoadModule('/src/tcm-csc/items.ts')
  const { CSC_PROBLEM_BANK, CSC_DEFAULT_PROBLEMS, buildCscProblem, rollCscProblem } = await server.ssrLoadModule('/src/tcm-csc/problems.ts')
  const { recalculateCsc } = await server.ssrLoadModule('/src/tcm-csc/recalculate.ts')
  const { createRng } = await server.ssrLoadModule('/src/math/rng.ts')
  const { buildWorksheets } = await server.ssrLoadModule('/src/math/generate.ts')
  const { logiqueBankOptions, logiqueItemById } = await server.ssrLoadModule('/src/logique/generate.ts')
  const { cscAudioGroups, cscAudioPrompts } = await server.ssrLoadModule('/src/tcm-csc/audio.ts')
  const { mathAudioPrompts } = await server.ssrLoadModule('/src/math/audio-prompts.ts')
  const { tryGenerateTcmCfrItems } = await server.ssrLoadModule('/src/tcm-cfr/items.ts')
  const { recalcTpmLibreItem } = await server.ssrLoadModule('/src/tpm/libre-recalc.ts')
  const samples = Array.from({ length: 100 }, (_, seed) => new Map(TCM_CSC_STEPS.map((step) => [step.number, generateCscExercise(`tcm-csc-ex${String(step.number).padStart(2, '0')}`, step.count, seed + 1)])))
  await test('CSC test contains the 23 requested exercises and preserves the reserved number 21', () => {
    const pages = buildTcmCscTestPages(), blocks = pages.flatMap((page) => [page, ...(page.extraBlocks ?? [])])
    assert.equal(blocks[0].exerciseType, 'tcm-csc-consignes')
    assert.deepEqual(blocks.slice(1).map((block) => block.exerciseNo), [...Array.from({ length: 20 }, (_, i) => i + 1), 22, 23, 24])
    assert.equal(blocks.filter((block) => block.exerciseNo === 21).length, 0)
    assert.equal(blocks.slice(1).reduce((sum, block) => sum + block.count * block.pointsPerQuestion, 0), TCM_CSC_MAX_SCORE)
    assert.equal(TCM_CSC_MAX_SCORE,82)
    const sheets=buildWorksheets(pages,77)
    assert.ok(sheets.some(sheet=>[6,7].every(number=>sheet.blocks.some(block=>block.exerciseIndex===number))))
    const problemPage=number=>sheets.findIndex(sheet=>sheet.blocks.some(block=>block.exerciseIndex===number))
    assert.equal(problemPage(22),problemPage(23));assert.equal(problemPage(24),problemPage(23)+1)
    for (const sample of samples) for (const step of TCM_CSC_STEPS) assert.equal(sample.get(step.number).length, step.count)
  })
  await test('five numbers and five spoken calculations stay within CSC bounds across 100 seeds', async () => {
    const assets = new Set()
    for (const sample of samples) {
      const numbers = sample.get(1)
      assert.equal(new Set(numbers.map((item) => item.answer)).size, 5)
      for (const item of numbers) { assert.ok(Number(item.answer) >= 1 && Number(item.answer) <= 100); assert.equal(item.audioParts[0], `/lib/audio/nombre/${item.answer}.mp3`); assets.add(item.audioParts[0]) }
      for (const item of sample.get(2)) {
        const { a, b, operation } = item.cscTask
        assert.equal(Number(item.answer), operation === '+' ? a + b : a - b)
        assert.ok(Number(item.answer) >= 0 && Number(item.answer) <= 100)
        assert.ok(item.audioParts.includes(operation === '+' ? CSC_PLUS_AUDIO : CSC_MINUS_AUDIO))
        assert.deepEqual(item.audioParts,[`/lib/audio/nombre/${a}.mp3`,operation === '+' ? CSC_PLUS_AUDIO : CSC_MINUS_AUDIO,`/lib/audio/nombre/${b}.mp3`])
        item.audioParts.forEach((src) => assets.add(src))
      }
    }
    for (const src of assets) await access(`public${src}`)
  })
  await test('the listening grid keeps thirty-six distinct numbers and five audible targets, including an editable zero', async () => {
    for (const sample of samples) {
      const item = sample.get(3)[0], { numbers, heard } = item.cscTask
      assert.equal(numbers.length, 36); assert.equal(new Set(numbers).size, 36)
      assert.ok(numbers.every((n) => Number.isInteger(n) && n >= 0 && n <= 100))
      assert.equal(new Set(heard).size, 5); assert.ok(heard.every((n) => numbers.includes(n)))
      assert.equal(item.audioParts.filter((src) => src.endsWith('silence-6s.mp3')).length, 4)
    }
    const item = structuredClone(samples[0].get(3)[0]); item.cscTask.numbers = Array.from({ length: 36 }, (_, i) => i); item.cscTask.heard = [0, 1, 2, 3, 4]
    const zero = recalculateCsc(item, 'tcm-csc-ex03')
    assert.equal(zero.libreError, undefined); assert.ok(zero.audioParts.includes('/lib/audio/vocabulaire/objets/zéro.mp3'))
    await access('public/lib/audio/vocabulaire/objets/zéro.mp3')
  })
  await test('both sequence exercises contain five regular integer terms between zero and one hundred', () => {
    for (const sample of samples) for (const exercise of [4, 5]) for (const item of sample.get(exercise)) {
      const values = item.sequence.map(Number), step = values[1] - values[0]
      assert.ok(values.every((n, i) => Number.isInteger(n) && n >= 0 && n <= 100 && (i === 0 || n - values[i - 1] === step)))
      assert.ok(step !== 0); assert.equal(item.blankIndexes.length, 2)
      assert.equal(item.answer, item.blankIndexes.map((i) => item.sequence[i]).join(' ; '))
      assert.equal(Boolean(item.prompt), exercise === 4)
      if (exercise === 4) { assert.doesNotMatch(item.prompt,/aide/i); assert.equal(item.cscTask.kind,'sequence-hint'); assert.equal(item.cscTask.step,step) }
    }
  })
  await test('sorting contains integers only and ten comparisons balance the three signs', () => {
    for (const sample of samples) {
      for (const item of sample.get(6)) {
        assert.equal(new Set(item.sequence).size, 7)
        assert.ok(item.sequence.every((value) => /^\d+$/.test(value) && Number(value) <= 100))
        const sorted = item.sequence.map(Number).sort((a, b) => item.orderOp === '<' ? a - b : b - a)
        assert.equal(item.answer, sorted.join(` ${item.orderOp} `))
      }
      for (const exercise of [7]) {
        const items = sample.get(exercise)
        assert.equal(items.length,10)
        assert.deepEqual(['<', '=', '>'].map(sign=>items.filter(item=>item.answer===sign).length).sort(),[3,3,4])
        for (const item of items) {
          const a = Number(item.left), b = Number(item.right)
          assert.ok([a, b].every((n) => Number.isInteger(n) && n >= 0 && n <= (exercise === 7 ? 100 : 999)))
          assert.equal(item.answer, a === b ? '=' : a < b ? '<' : '>')
        }
      }
      assert.deepEqual(sample.get(9).map((item) => item.prompt).sort(), ['+', '=', '−'].sort())
      assert.deepEqual(sample.get(9).map((item) => item.answer).sort(), ['plus','moins','égal'].sort())
    }
  })
  await test('posed columns group additions before subtractions and preserve the requested digit progression', () => {
    for (const sample of samples) for (const exercise of [10, 11]) sample.get(exercise).forEach((item, i) => {
      const perSign=sample.get(exercise).length/2
      assert.equal(item.op,i<perSign?'+':'−')
      assert.equal(Number(item.answer), item.op === '+' ? item.a + item.b : item.a - item.b)
      assert.ok([item.a, item.b].every((n) => Number.isInteger(n) && n >= 1 && n <= 999))
      const row = i%perSign, expectedDigits = exercise === 10 ? row === 3 ? 3 : 2 : row === 0 ? 2 : 3
      assert.equal(String(item.a).length, expectedDigits)
      assert.equal(String(item.b).length, exercise === 10 && row === 0 ? 1 : expectedDigits)
      assert.equal(Boolean(item.blankOperands), exercise === 11)
      for (const key of ['digitsA','digitsB','digitsResult','carries']) assert.equal(item[key].length,5)
      const edited = recalcTpmLibreItem({...item,a:35,b:12},`tcm-csc-ex${exercise}`)
      assert.equal(edited.digitsA.length,5); assert.equal(edited.digitsResult.length,5)
    })
  })
  await test('geometry retains source figures, four names, a single large counting frame and six coordinates', () => {
    for (const sample of samples) {
      const colors=sample.get(14)[0].cscTask.colors
      assert.equal(colors.length,3);assert.equal(new Set(colors).size,3);assert.ok(colors.every(color=>Number.isInteger(color)&&color>=0&&color<=3))
      assert.equal(sample.get(12)[0].cscTask.scale, 1); assert.equal(sample.get(13)[0].cscTask.scale, 2)
      for (const number of [12, 13]) assert.ok(sample.get(number)[0].symmetryFigure.polylines.length)
      const names = sample.get(17)[0]
      assert.equal(names.cscTask.figures.length, 4); assert.equal(new Set(names.cscTask.figures).size, 4); assert.equal(names.answer.split(' ; ').length, 4)
      assert.deepEqual([...names.cscTask.figures].sort(),['square','rectangle','circle','triangle'].sort())
      const count = sample.get(18)[0]
      assert.equal(count.cscTask.kind, 'large-count'); assert.equal(count.countIcons.tokens.filter((token) => token.kind === count.countIcons.targetKind).length, Number(count.answer))
      for (const number of [19, 20]) {
        const item = sample.get(number)[0]
        assert.equal(item.coordScene.marks.length, 6); assert.equal(item.coordQuestions.length, 6); assert.equal(item.cscTask.kind, 'coordinates-left')
        assert.equal(item.coordTask, number === 19 ? 'read' : 'place')
      }
      const segments = sample.get(14)[0]
      assert.equal(new Set(segments.segments.map((s) => s.mm)).size, 3)
      const values = segments.segments.map((s) => s.mm)
      assert.equal(segments.answer, `${String.fromCharCode(65 + values.indexOf(Math.max(...values)))} ; ${String.fromCharCode(65 + values.indexOf(Math.min(...values)))}`)
    }
  })
  await test('two distinct logic questions can be selected explicitly without altering their source bank', () => {
    for (const sample of samples) assert.equal(new Set(sample.get(16).map((item) => item.logique.id)).size, 2)
    const options = logiqueBankOptions('logique-suite-graphique'), original = structuredClone(options)
    for (const option of options) {
      const item = logiqueItemById('logique-suite-graphique', option.id, createRng(7))
      assert.equal(item.logique.id, option.id); assert.deepEqual(item.logique.stem, option.stem)
      assert.equal(item.answer, item.logique.choiceLabels[item.logique.correctIndex])
    }
    assert.deepEqual(logiqueBankOptions('logique-suite-graphique'), original)
  })
  await test('103 distinct problem templates preserve the original defaults and produce correct variable results', () => {
    assert.equal(CSC_PROBLEM_BANK.length, 103); assert.equal(new Set(CSC_PROBLEM_BANK.map((p) => p.id)).size, 103)
    assert.equal(CSC_PROBLEM_BANK.filter((p) => p.operation === '+').length, 52); assert.equal(CSC_PROBLEM_BANK.filter((p) => p.operation === '−').length, 51)
    assert.deepEqual(CSC_DEFAULT_PROBLEMS.map((id) => { const p = CSC_PROBLEM_BANK.find((p) => p.id === id); return buildCscProblem(id, ...p.defaults).result }), [36, 37, 44])
    for (const template of CSC_PROBLEM_BANK) for (let seed = 0; seed < 20; seed++) {
      const p = rollCscProblem(template.id, createRng(seed + 1))
      assert.equal(p.result, template.operation === '+' ? p.a + p.b : p.a - p.b)
      assert.ok(p.result >= 0 && p.result <= 100); assert.ok(!/[{}]/.test(p.statement))
    }
    assert.throws(() => buildCscProblem('perles-patricia', 10, 11))
    assert.throws(() => buildCscProblem('unknown', 10, 5))
    assert.throws(() => buildCscProblem('perles-patricia', 3.5, 1))
    const singular = buildCscProblem('addition-01', 21, 1)
    assert.match(singular.statement, /21 livres/); assert.match(singular.statement, /1 livre le mardi/)
  })
  await test('free edits recompute answers and audio, while invalid tasks report an error instead of guessing', () => {
    const item = structuredClone(samples[0].get(2)[0]); item.answer = '999'; item.cscTask = { kind: 'calculation-audio', a: 21, b: 7, operation: '−' }
    const fixed = recalculateCsc(item, 'tcm-csc-ex02')
    assert.equal(fixed.answer, '14'); assert.ok(fixed.audioParts.includes(CSC_MINUS_AUDIO))
    const bad = recalculateCsc({ ...item, cscTask: { ...item.cscTask, b: 50 } }, 'tcm-csc-ex02')
    assert.ok(bad.libreError); assert.equal(bad.answer, '')
    const story = recalculateCsc({ layout: 'algebra', answer: 'stale', cscTask: { kind: 'problem', templateId: 'perles-patricia', a: 98, b: 54 } }, 'tcm-csc-ex24')
    assert.equal(story.answer, '44 perles'); assert.match(story.prompt, /98 perles/); assert.match(story.prompt, /54 perles/)
  })
  await test('the complete worksheet is deterministic, renews its numbers and groups three separately named audio exercises', () => {
    const pages = buildTcmCscTestPages(), before = structuredClone(pages)
    const first = buildWorksheets(pages, 21), again = buildWorksheets(pages, 21), next = buildWorksheets(pages, 22)
    assert.deepEqual(first, again); assert.notDeepEqual(first, next); assert.deepEqual(pages, before)
    const blocks = first.flatMap((sheet) => sheet.blocks)
    assert.equal(new Set(blocks.filter(block=>block.exerciseIndex>0).map(block=>block.exerciseIndex)).size,23)
    assert.ok(!blocks.some((block) => block.exerciseIndex === 21))
    assert.deepEqual(cscAudioGroups(first).map((g) => [g.number, g.parts.length]), [[1, 5], [2, 5], [3, 5]])
    assert.equal(new Set(cscAudioGroups(first).map((g) => g.name)).size, 3)
    const altered = structuredClone(first)
    for (const block of altered.flatMap(sheet=>sheet.blocks).filter(block=>block.exerciseType==='tcm-csc-ex02')) for (const item of block.items) item.audioParts.push(`/lib/audio/nombre/${item.answer}.mp3`)
    assert.deepEqual(cscAudioGroups(altered).find(group=>group.number===2).parts,cscAudioGroups(first).find(group=>group.number===2).parts,'The exported calculation never appends its result, including for a stale saved playlist.')
  })

  await test('CSC decomposition has two two-digit and two three-digit values, retaining CFR place-value rendering and legacy edits', () => {
    for (let seed=1;seed<=100;seed++) {
      const items=generateCscExercise('tcm-csc-ex08',4,seed)
      assert.equal(items.length,4)
      items.forEach((item,index)=>{
        const value=Number(item.prompt.replace(/['’\s]/g,''))
        assert.ok(index<2?value>=11&&value<=99:value>=101&&value<=999)
        assert.equal(item.placeParts.length,index<2?2:3)
        assert.equal(item.placeParts.map(Number).reduce((sum,n)=>sum+n,0),value)
      })
    }
    const item = generateCscExercise('tcm-csc-ex08',2,1)[0]
    const edited = recalculateCsc({...item,prompt:'4 070'},'tcm-csc-ex08')
    assert.deepEqual(edited.placeParts,['4000','0','70','0']); assert.equal(edited.answer,'4000 + 0 + 70 + 0')
    const small=recalculateCsc({...item,prompt:'57'},'tcm-csc-ex08')
    assert.deepEqual(small.labels,['dizaines','unités']);assert.deepEqual(small.placeParts,['50','7']);assert.equal(small.libreError,undefined)
    assert.ok(recalculateCsc({...item,prompt:'4,5'},'tcm-csc-ex08').libreError)
  })
  await test('each connecting point can appear in all four quadrants and remains separated from the other labels', () => {
    for (const label of ['A','B','C','D']) {
      const quadrants = new Set()
      for (const sample of samples) {
        const points = sample.get(15)[0].cscTask.points, point = points.find(p=>p.label===label)
        quadrants.add(`${point.x<80}:${point.y<40}`)
        for (const other of points.filter(p=>p!==point)) assert.ok(Math.hypot(point.x-other.x,point.y-other.y)>=16)
      }
      assert.equal(quadrants.size,4,label)
    }
  })
  await test('large CSC column grids split across pages without losing questions, ordering, source offsets or operands', () => {
    const pages = buildTcmCscTestPages(), sheets = buildWorksheets(pages,77)
    const parts = sheets.flatMap(sheet=>sheet.blocks).filter(block=>block.exerciseType==='tcm-csc-ex10')
    assert.equal(parts.length,1)
    assert.deepEqual(parts.flatMap(block=>block.items),generateCscExercise('tcm-csc-ex10',8,77+pages.findIndex(page=>page.exerciseType==='tcm-csc-ex10')*7919))
    assert.equal(parts[0].items.length,8)
    assert.ok(parts[0].items.slice(0,4).every(item=>item.op==='+'));assert.ok(parts[0].items.slice(4).every(item=>item.op==='−'))
    const extended=structuredClone(pages);extended.find(page=>page.exerciseType==='tcm-csc-ex10').count=16
    const extra=buildWorksheets(extended,77).flatMap(sheet=>sheet.blocks).filter(block=>block.exerciseType==='tcm-csc-ex10')
    assert.deepEqual(extra.map(block=>block.itemOffset),[0,8]);assert.ok(extra.every(block=>block.items.length===8))
    for (const page of pages) for (const block of [page,...(page.extraBlocks??[])]) if (/ex(?:22|23|24)$/.test(block.exerciseType)) assert.deepEqual(block.problemDraftGrids,[false])
  })
  await test('screen audio uses five whole prompts per exercise, without a result clip or a silence player',()=>{
    for(const sample of samples){
      const calculations=cscAudioPrompts('tcm-csc-ex02',sample.get(2))
      assert.equal(calculations.length,5)
      calculations.forEach((parts,index)=>assert.deepEqual(parts,sample.get(2)[index].audioParts))
      const numbers=cscAudioPrompts('tcm-csc-ex03',sample.get(3))
      assert.equal(numbers.length,5)
      assert.deepEqual(numbers,sample.get(3)[0].cscTask.heard.map(n=>[`/lib/audio/nombre/${n}.mp3`]))
      assert.ok(numbers.every(parts=>parts.length===1&&!parts[0].includes('silence')))
    }
    const stale=structuredClone(samples[0].get(2));stale.forEach(item=>item.audioParts.push(`/lib/audio/nombre/${item.answer}.mp3`))
    const before=structuredClone(stale),prompts=mathAudioPrompts({exerciseType:'tcm-csc-ex02',items:stale})
    assert.ok(prompts.every(parts=>parts.length===3));assert.deepEqual(stale,before)
    assert.throws(()=>cscAudioPrompts('tcm-csc-ex02',[{layout:'audio-dictation',answer:'7'}]))
    assert.throws(()=>cscAudioPrompts('tcm-csc-ex03',[{layout:'csc-task',answer:'7'}]))
    const cfr=tryGenerateTcmCfrItems('tcm-cfr-ex02',5,createRng(11),11)
    assert.deepEqual(mathAudioPrompts({exerciseType:'tcm-cfr-ex02',items:cfr}),cfr.map(item=>item.audioParts))
    assert.equal(cfr.length,5);assert.ok(cfr.every(item=>item.audioParts.length===3))
    assert.equal(mathAudioPrompts({exerciseType:'addition-ligne',items:[]}),undefined)
  })
} finally { await server.close() }
