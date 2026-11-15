const assert = require('node:assert/strict')
const { load } = require('./gattegno-loader.cjs')
const { concatMp3 } = load('src/tcm-cfr/audio-nombres.ts')
const { downloadTcfAudios } = load('src/tcf/download-audios.ts')
let closed = 0, downloads = 0
function buffer(channels, length, sampleRate) {
  const data = Array.from({ length: channels }, () => new Float32Array(length).fill(0.25))
  return { numberOfChannels: channels, length, sampleRate, getChannelData: c => data[c] }
}
global.window = { AudioContext: class {
  async decodeAudioData() { return buffer(1, 150000, 24000) }
  createBuffer(c, n, rate) { return buffer(c, n, rate) }
  async close() { closed++ }
} }
global.document = { body: { appendChild() {} }, createElement: () => ({ click() { downloads++ }, remove() {} }) }
async function main() {
  const aborted = new AbortController(); aborted.abort()
  global.fetch = () => { throw new Error('Fetch must not run after cancellation') }
  await assert.rejects(concatMp3(['/a'], { signal: aborted.signal }), { name: 'AbortError' })
  const pending = new AbortController()
  global.fetch = (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
    setTimeout(() => pending.abort(), 0)
  })
  await assert.rejects(concatMp3(['/a'], { signal: pending.signal }), { name: 'AbortError' })
  assert.equal(closed, 0)
  global.fetch = async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(1), blob: async () => new Blob(['audio']) })
  const encoding = new AbortController()
  await assert.rejects(concatMp3(['/a'], { signal: encoding.signal, onProgress() { setTimeout(() => encoding.abort(), 0) } }), { name: 'AbortError' })
  assert.equal(closed, 1)
  const progress = []
  const wav = await concatMp3(['/a', '/b'], { onProgress: done => progress.push(done) })
  assert.deepEqual(progress, [1, 2])
  assert.equal(wav.size, 44 + 300000 * 2)
  assert.equal(closed, 2)
  const opts = { niveau: 'A1', competence: 'CO', exerciseNo: 1, audioRefs: ['/lib/audio/test.mp3'] }
  await assert.rejects(downloadTcfAudios(opts, { signal: aborted.signal }), { name: 'AbortError' })
  assert.equal(downloads, 0)
  global.fetch = async () => ({ ok: false })
  await assert.rejects(downloadTcfAudios(opts), /Impossible de compiler/)
  assert.equal(downloads, 0)
  const { zipStoreBlob } = load('src/lib/zip-store.ts')
  const files = [{ name: 'audio.wav', data: wav }]
  const date = new Date('2026-11-15T12:00:00')
  const normal = await zipStoreBlob(files, date)
  const cancellable = await zipStoreBlob(files, date, new AbortController().signal)
  assert.deepEqual(Buffer.from(await normal.arrayBuffer()), Buffer.from(await cancellable.arrayBuffer()))
  const zipAbort = new AbortController()
  const archive = zipStoreBlob(files, date, zipAbort.signal)
  setTimeout(() => zipAbort.abort(), 0)
  await assert.rejects(archive, { name: 'AbortError' })
  console.log('Audio : annulation avant chargement, pendant fetch et encodage, fermeture du contexte, WAV et absence de téléchargement partiel vérifiés.')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
