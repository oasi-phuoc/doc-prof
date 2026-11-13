import { createServer as httpServer } from 'node:http'

/** Local adapter around the real Worker router and room objects, not API stubs. */
export async function serveCompetition(vite, { port = 5193, origin, teacherKey }) {
  const { handleCompetitionRequest, ClassroomCompetitionRoom } = await vite.ssrLoadModule('/api/fiches/src/competition.ts')
  const records = new Map(), instances = new Map(), alarms = new Map()
  const context = (code) => {
    if (!records.has(code)) records.set(code, new Map())
    const data = records.get(code)
    return { storage: {
      get: async (key) => structuredClone(data.get(key)),
      put: async (key, value) => { if (typeof key === 'string') data.set(key, structuredClone(value)); else for (const [name, item] of Object.entries(key)) data.set(name, structuredClone(item)) },
      deleteAll: async () => data.clear(),
      setAlarm: async (at) => { clearTimeout(alarms.get(code)); alarms.set(code, setTimeout(() => { void instances.get(code)?.alarm() }, Math.max(0, at - Date.now()))) },
    }, blockConcurrencyWhile: (work) => work() }
  }
  const namespace = { idFromName: (code) => code, get: (code) => ({ fetch: (request) => { if (!instances.has(code)) instances.set(code, new ClassroomCompetitionRoom(context(code))); return instances.get(code).fetch(request) } }) }
  const env = { COMPETITION_HOST_KEY: teacherKey, COMPETITION_ORIGINS: origin, COMPETITION_ROOMS: namespace }
  const server = httpServer(async (incoming, outgoing) => {
    try {
      const chunks = []; for await (const chunk of incoming) chunks.push(chunk)
      const request = new Request(`http://127.0.0.1:${port}${incoming.url}`, { method: incoming.method, headers: incoming.headers, ...(!['GET', 'HEAD'].includes(incoming.method) ? { body: Buffer.concat(chunks) } : {}) })
      const response = await handleCompetitionRequest(request, env)
      outgoing.writeHead(response.status, Object.fromEntries(response.headers)); outgoing.end(Buffer.from(await response.arrayBuffer()))
    } catch { outgoing.writeHead(500, { 'Content-Type': 'application/json' }); outgoing.end(JSON.stringify({ error: 'Local room adapter failed.' })) }
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve) })
  return {
    snapshot(code) { const data = records.get(code); const parts = data?.get('room-parts')?.parts; return parts ? JSON.parse(Array.from({ length: parts }, (_, i) => data.get(`room-${i}`)).join('')) : undefined },
    restart(code) { instances.set(code, new ClassroomCompetitionRoom(context(code))) },
    async close() { for (const timer of alarms.values()) clearTimeout(timer); await new Promise((resolve) => { server.close(resolve); server.closeAllConnections() }) },
  }
}
