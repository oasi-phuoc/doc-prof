import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
try {
  const { summarizeLatencies, formatDiagnostic } = await server.ssrLoadModule('/src/interactive/diagnostic/report.ts')
  await test('latency summary ignores invalid values without mutating the samples', () => {
    const values = [10, 1, Infinity, -3, NaN, 30]
    assert.deepEqual(summarizeLatencies(values), { count: 3, mean: 41 / 3, max: 30, p95: 30 })
    assert.equal(summarizeLatencies([]), null)
    assert.equal(values[0], 10)
  })
  await test('diagnostic report distinguishes declared capabilities and tests actually performed', () => {
    const text = formatDiagnostic({
      runtime: { capturedAt: '2026-11-10T10:00:00Z', userAgent: 'Test browser', screen: '1920 × 1080', viewport: '1366 × 768', pixels: 1, touchPoints: 10, pointer: 'grossier / tactile', hover: false, online: true, secure: true, reducedMotion: false, contrast: 'standard', features: { IndexedDB: true, 'Maintien éveillé': false } },
      storage: { state: 'refusé' }, audio: 'non testé', fullscreen: 'non testé', wakeLock: 'non testé', fonts: 'polices chargées', latencies: [3, 5], pointers: ['touch'], maxContacts: 2, colors: ['#F6E5A2'],
    })
    assert.match(text, /IndexedDB : API présente/)
    assert.match(text, /écriture et lecture\) : refusé/)
    assert.match(text, /Son après un geste : non testé/)
    assert.match(text, /2\/10 mesures/)
    assert.match(text, /Contacts simultanés observés : 2/)
    assert.match(text, /ne prouve pas une validation sur un ENI physique/)
    assert.match(text, /U\+202F \/ U\+00A0/)
  })
} finally { await server.close() }
