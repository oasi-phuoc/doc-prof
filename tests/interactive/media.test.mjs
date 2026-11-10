import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'vite'
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})
try {
  const { collectMedia, unavailableQuestionIds } = await server.ssrLoadModule(
    '/src/interactive/media/assets.ts',
  )
  const { mediaUrl, MAX_INLINE_BYTES } = await server.ssrLoadModule(
    '/src/interactive/media/policy.ts',
  )
  const { probeMedia, responseBytes } = await server.ssrLoadModule(
    '/src/interactive/media/probe.ts',
  )
  const { MediaManager } = await server.ssrLoadModule(
    '/src/interactive/media/manager.ts',
  )
  const options = { baseUrl: 'https://classroom.test/interactif' }
  const controller = () => new AbortController()
  const asset = (url = '/image.webp', kind = 'image', ids = ['q1']) => ({
    id: url,
    url,
    kind,
    questionIds: ids,
  })
  const question = (id, images = [], audio) => ({
    id,
    images,
    audio,
    choices: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
  })
  const defaults = (overrides = {}) => ({
    fetch: async () =>
      new Response('x', {
        status: 200,
        headers: { 'content-type': 'image/webp', 'content-length': '100' },
      }),
    decodeImage: async () => ({ width: 300, height: 200 }),
    decodeAudio: async () => ({ durationSec: 10 }),
    now: () => performance.now(),
    ...overrides,
  })
  const aborted = () => new DOMException('Stopped', 'AbortError')
  const waitAbort = (signal) =>
    new Promise((_, reject) => {
      if (signal.aborted) reject(aborted())
      else
        signal.addEventListener('abort', () => reject(aborted()), {
          once: true,
        })
    })

  await test('public media collection deduplicates shared URLs and keeps every choice equally', () => {
    const first = question('q1', ['/image.webp#first'], '/audio.mp3')
    first.choices = [
      { id: 'wrong', text: '', image: '/image.webp' },
      { id: 'right', text: '', image: '/other.webp' },
    ]
    const second = question('q2', ['/other.webp'], '/audio.mp3')
    const result = collectMedia([first, second], options)
    assert.equal(result.length, 3)
    assert.deepEqual(result.find((a) => a.kind === 'audio').questionIds, [
      'q1',
      'q2',
    ])
    assert.deepEqual(
      result
        .filter((a) => a.kind === 'image')
        .map((a) => new URL(a.url).pathname),
      ['/image.webp', '/other.webp'],
    )
    assert.ok(result.every((a) => !('correct' in a) && !('answer' in a)))
  })
  await test('media policy admits local assets and explicit origins; rejects other schemes and oversized inline bytes', () => {
    assert.equal(
      mediaUrl('/image.webp', options),
      'https://classroom.test/image.webp',
    )
    for (const url of [
      'javascript:alert(1)',
      'file:///etc/passwd',
      'https://foreign.test/a.webp',
      'https://name:password@classroom.test/a.webp',
      'blob:https://foreign.test/id',
    ])
      assert.equal(mediaUrl(url, options), null)
    assert.equal(
      mediaUrl('https://foreign.test/a.webp', {
        ...options,
        allowedOrigins: ['https://foreign.test'],
      }),
      'https://foreign.test/a.webp',
    )
    assert.equal(
      mediaUrl('blob:https://classroom.test/id', options),
      'blob:https://classroom.test/id',
    )
    assert.ok(mediaUrl('data:image/svg+xml,%3Csvg%3E%3C/svg%3E', options))
    assert.equal(
      mediaUrl(
        `data:image/svg+xml,${'é'.repeat(MAX_INLINE_BYTES / 2 + 1)}`,
        options,
      ),
      null,
    )
    const exact = `data:image/png;base64,${Buffer.alloc(MAX_INLINE_BYTES).toString('base64')}`
    assert.ok(mediaUrl(exact, options))
    assert.equal(
      mediaUrl(
        `data:image/png;base64,${Buffer.alloc(MAX_INLINE_BYTES + 1).toString('base64')}`,
        options,
      ),
      null,
    )
    assert.equal(mediaUrl('data:text/html,hello', options), null)
  })
  await test('GET range probe uses total resource bytes and actual image decoding', async () => {
    let decoded = 0
    const result = await probeMedia(
      asset(),
      options,
      controller().signal,
      defaults({
        fetch: async (url, request) => {
          assert.equal(request.method, 'GET')
          assert.equal(request.headers.Range, 'bytes=0-0')
          assert.equal(request.credentials, 'same-origin')
          assert.equal(request.redirect, 'manual')
          return new Response('x', {
            status: 206,
            headers: {
              'content-type': 'image/webp',
              'content-length': '1',
              'content-range': 'bytes 0-0/4000',
            },
          })
        },
        decodeImage: async () => {
          decoded++
          return { width: 80, height: 60 }
        },
      }),
    )
    assert.equal(result.status, 'ok')
    assert.equal(result.bytes, 4000)
    assert.equal(result.width, 80)
    assert.equal(decoded, 1)
    assert.equal(
      responseBytes(new Headers({ 'content-length': '-1' })),
      undefined,
    )
  })
  await test('HTTP missing and access failures do not try to decode', async () => {
    for (const [status, expected] of [
      [404, 'missing'],
      [410, 'missing'],
      [401, 'blocked'],
      [403, 'blocked'],
      [302, 'blocked'],
    ]) {
      const result = await probeMedia(
        asset(),
        options,
        controller().signal,
        defaults({
          fetch: async () => new Response(null, { status }),
          decodeImage: async () => {
            assert.fail('Decoder should not be called')
          },
        }),
      )
      assert.equal(result.status, expected)
    }
  })
  await test('unsupported range retries normal GET without suppressing its final status', async () => {
    for (const status of [400, 405, 416, 501]) {
      const headers = []
      const result = await probeMedia(
        asset(),
        options,
        controller().signal,
        defaults({
          fetch: async (_, request) => {
            headers.push(request.headers)
            return new Response(null, {
              status: headers.length === 1 ? status : 410,
            })
          },
        }),
      )
      assert.equal(result.status, 'missing')
      assert.equal(headers.length, 2)
      assert.equal(headers[1], undefined)
    }
  })
  await test('HTML fallback, empty and excessive files are invalid before decoding; large valid files warn', async () => {
    for (const headers of [
      { 'content-type': 'text/html' },
      { 'content-length': '0' },
      { 'content-length': String(33 * 1024 * 1024) },
    ]) {
      const result = await probeMedia(
        asset(),
        options,
        controller().signal,
        defaults({
          fetch: async () => new Response('x', { headers }),
          decodeImage: async () => {
            assert.fail('Invalid resource decoded')
          },
        }),
      )
      assert.equal(result.status, 'invalid')
    }
    const result = await probeMedia(
      asset(),
      options,
      controller().signal,
      defaults({
        fetch: async () =>
          new Response('x', {
            headers: {
              'content-type': 'image/webp',
              'content-length': String(3 * 1024 * 1024),
            },
          }),
      }),
    )
    assert.equal(result.status, 'ok')
    assert.equal(result.large, true)
  })
  await test('audio metadata, slow resources and decoder/network errors produce distinct honest statuses', async () => {
    let now = 0
    const slow = await probeMedia(
      asset('/audio.mp3', 'audio'),
      options,
      controller().signal,
      defaults({
        now: () => now,
        fetch: async () =>
          new Response('x', { headers: { 'content-type': 'audio/mpeg' } }),
        decodeAudio: async () => {
          now = 3500
          return { durationSec: 12 }
        },
      }),
    )
    assert.equal(slow.status, 'slow')
    assert.equal(slow.durationSec, 12)
    const invalid = await probeMedia(
      asset(),
      options,
      controller().signal,
      defaults({
        decodeImage: async () => {
          throw new Error('decode failed')
        },
      }),
    )
    assert.equal(invalid.status, 'invalid')
    const blocked = await probeMedia(
      asset(),
      options,
      controller().signal,
      defaults({
        fetch: async () => {
          throw new TypeError('private network diagnostic must not appear')
        },
      }),
    )
    assert.equal(blocked.status, 'blocked')
    assert.ok(!JSON.stringify(blocked).includes('private network'))
  })
  await test('deadline covers fetch and decoding; external cancellation reports no stale failure', async () => {
    const timeout = await probeMedia(
      asset(),
      { ...options, timeoutMs: 8 },
      controller().signal,
      defaults({ fetch: (_, request) => waitAbort(request.signal) }),
    )
    assert.equal(timeout.status, 'timeout')
    const decodeTimeout = await probeMedia(
      asset(),
      { ...options, timeoutMs: 8 },
      controller().signal,
      defaults({ decodeImage: (_, signal) => waitAbort(signal) }),
    )
    assert.equal(decodeTimeout.status, 'timeout')
    const cancel = controller()
    const promise = probeMedia(
      asset(),
      options,
      cancel.signal,
      defaults({ fetch: (_, request) => waitAbort(request.signal) }),
    )
    cancel.abort()
    await assert.rejects(promise, { name: 'AbortError' })
  })
  await test('manager caps concurrency at four and returns results in source order', async () => {
    let active = 0,
      maximum = 0
    const manager = new MediaManager(
      options,
      defaults({
        fetch: async (url) => {
          active++
          maximum = Math.max(maximum, active)
          await new Promise((resolve) =>
            setTimeout(resolve, url.includes('0.webp') ? 15 : 2),
          )
          active--
          return new Response('x', {
            headers: { 'content-type': 'image/webp' },
          })
        },
      }),
    )
    const plan = {
      id: 'plan',
      questions: [
        question(
          'q1',
          Array.from({ length: 9 }, (_, i) => `/${i}.webp`),
        ),
      ],
    }
    const results = await manager.preflight(plan, controller().signal)
    assert.equal(maximum, 4)
    assert.deepEqual(
      results.map((r) => new URL(r.asset.url).pathname),
      plan.questions[0].images,
    )
  })
  await test('URL cache rebinds question IDs and explicit retry recovers a cached missing file', async () => {
    let calls = 0,
      missing = true,
      now = 0
    const manager = new MediaManager(
      options,
      defaults({
        now: () => now,
        fetch: async () => {
          calls++
          return new Response('x', {
            status: missing ? 404 : 200,
            headers: { 'content-type': 'image/webp' },
          })
        },
      }),
    )
    await manager.preflight(
      { id: 'first', questions: [question('q1', ['/shared.webp'])] },
      controller().signal,
    )
    missing = false
    const cached = await manager.preflight(
      { id: 'second', questions: [question('q2', ['/shared.webp'])] },
      controller().signal,
    )
    assert.equal(calls, 1)
    assert.deepEqual([...unavailableQuestionIds(cached)], ['q2'])
    const retried = await manager.preflight(
      { id: 'second', questions: [question('q2', ['/shared.webp'])] },
      controller().signal,
      undefined,
      true,
    )
    assert.equal(calls, 2)
    assert.equal(retried[0].status, 'ok')
    now = 300001
    await manager.preflight(
      { id: 'second', questions: [question('q2', ['/shared.webp'])] },
      controller().signal,
    )
    assert.equal(calls, 3)
  })
  await test('aborted manager emits no late results; preloading warms all and only the supplied screen', async () => {
    const cancel = controller(),
      observed = []
    const manager = new MediaManager(
      { ...options, timeoutMs: 8 },
      defaults({
        fetch: (_, request) => waitAbort(request.signal),
        decodeImage: async (url) => {
          observed.push(url)
          return { width: 100, height: 100 }
        },
      }),
    )
    const pending = manager.preflight(
      { id: 'old', questions: [question('old', ['/old.webp'])] },
      cancel.signal,
      () => assert.fail('Stale result'),
    )
    cancel.abort()
    await assert.rejects(pending, { name: 'AbortError' })
    const next = question('next', ['/next.webp'])
    next.choices[0].image = '/choice-a.webp'
    next.choices[1].image = '/choice-b.webp'
    await manager.preload(
      { id: 'next-screen', questions: [next] },
      controller().signal,
    )
    assert.deepEqual(
      observed.map((url) => new URL(url).pathname),
      ['/next.webp', '/choice-a.webp', '/choice-b.webp'],
    )
  })
  await test('a URL used for incompatible media types is invalid; timeouts and slow assets are not silently excluded', async () => {
    const plan = {
      id: 'conflict',
      questions: [question('q1', ['/both'], '/both')],
    }
    const [shared] = collectMedia(plan.questions, options)
    assert.equal(shared.conflictingKinds, true)
    assert.equal(
      (await probeMedia(shared, options, controller().signal, defaults()))
        .status,
      'invalid',
    )
    assert.deepEqual(
      [
        ...unavailableQuestionIds([
          { asset: asset('/slow', 'image', ['slow']), status: 'slow' },
          { asset: asset('/timeout', 'image', ['late']), status: 'timeout' },
          { asset: asset('/missing', 'image', ['absent']), status: 'missing' },
        ]),
      ],
      ['absent'],
    )
  })
} finally {
  await server.close()
}
