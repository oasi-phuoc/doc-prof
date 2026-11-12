import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'node:fs'

const base = process.env.CSC_DENISE_TEST_URL ?? 'http://127.0.0.1:5189'
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] })
const rate = 24000
// Synthetic fixture only: padded audible pulse, not a voice recording.
const fixture = Buffer.alloc(44 + Math.round(0.55 * rate) * 2)
fixture.write('RIFF'); fixture.writeUInt32LE(fixture.length - 8, 4); fixture.write('WAVEfmt ', 8); fixture.writeUInt32LE(16, 16); fixture.writeUInt16LE(1, 20); fixture.writeUInt16LE(1, 22); fixture.writeUInt32LE(rate, 24); fixture.writeUInt32LE(rate * 2, 28); fixture.writeUInt16LE(2, 32); fixture.writeUInt16LE(16, 34); fixture.write('data', 36); fixture.writeUInt32LE(fixture.length - 44, 40)
for (let i = Math.round(0.15 * rate); i < Math.round(0.30 * rate); i++) fixture.writeInt16LE(6553, 44 + i * 2)
try {
  const page = await browser.newPage()
  await page.route('**/lib/audio/**', route => route.fulfill({ contentType: 'audio/wav', body: fixture }))
  await page.goto(base, { waitUntil: 'domcontentloaded' })
  const results = await page.evaluate(async () => {
    const { planCscDeniseAudio, renderCscDeniseAudio } = await import('/src/tcm-csc/denise-audio.ts')
    const results = []
    for (const exercise of [1, 2, 3]) {
      const questions = [11, 22, 33, 44, 55].map(n => exercise === 2 ? [`/lib/audio/nombre/${n}.mp3`, '/lib/audio/nombre/plus.mp3', '/lib/audio/nombre/1.mp3'] : [`/lib/audio/nombre/${n}.mp3`])
      const plan = planCscDeniseAudio(exercise, questions), blob = await renderCscDeniseAudio(plan), bytes = await blob.arrayBuffer(), view = new DataView(bytes)
      if (view.getUint32(24, true) !== 24000 || view.getUint16(22, true) !== 1) throw new Error('Bad WAV format')
      const silenceRuns = []
      let run = 0
      for (let pos = 44; pos < bytes.byteLength; pos += 2) {
        if (view.getInt16(pos, true) === 0) run++
        else if (run) { silenceRuns.push(run); run = 0 }
      }
      if (run) silenceRuns.push(run)
      results.push({ exercise, sampleRate: 24000, channels: 1, fiveSecondGaps: silenceRuns.filter(n => n === 120000).length, sevenSecondGaps: silenceRuns.filter(n => n === 168000).length, letters: plan.filter(s => s.kind === 'clip' && s.src.includes('/lettre-')).length, bips: plan.filter(s => s.kind === 'clip' && s.src.endsWith('/bip-d-annonce.mp3')).length, totalSamples: (bytes.byteLength - 44) / 2, fixtureOnly: true })
    }
    return results
  })
  for (const row of results) {
    assert.equal(row.fiveSecondGaps, 1)
    assert.equal(row.sevenSecondGaps, 9)
    assert.equal(row.letters, 10)
    assert.equal(row.bips, 2)
    assert.equal(row.totalSamples, Math.round((row.exercise === 2 ? 78.65 : 73.25) * rate))
  }
  mkdirSync('/tmp/csc-denise-qa', { recursive: true })
  writeFileSync('/tmp/csc-denise-qa/results.json', JSON.stringify({ passed: true, syntheticFixturesOnly: true, recordingsGenerated: false, results }, null, 2) + '\n')
  console.log(JSON.stringify({ passed: true, syntheticFixturesOnly: true, results }))
} finally { await browser.close() }
