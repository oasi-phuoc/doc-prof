/**
 * ZIP « store » (sans compression) — un seul fichier à télécharger
 * quand le navigateur bloque le 2ᵉ `<a download>` après un `await`.
 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ data[i]!) & 0xff]! ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function concatBytes(chunks: readonly Uint8Array[]): Uint8Array<ArrayBuffer> {
  const total = chunks.reduce((n, c) => n + c.length, 0)
  const out = new Uint8Array(new ArrayBuffer(total))
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

function u16(n: number): Uint8Array<ArrayBuffer> {
  const b = new Uint8Array(new ArrayBuffer(2))
  new DataView(b.buffer).setUint16(0, n, true)
  return b
}

function u32(n: number): Uint8Array<ArrayBuffer> {
  const b = new Uint8Array(new ArrayBuffer(4))
  new DataView(b.buffer).setUint32(0, n, true)
  return b
}

function dosDateTime(date = new Date()): { time: number; date: number } {
  const year = Math.max(0, date.getFullYear() - 1980)
  return {
    time:
      (date.getHours() << 11) |
      (date.getMinutes() << 5) |
      Math.floor(date.getSeconds() / 2),
    date: (year << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  }
}

export type ZipStoreEntry = {
  name: string
  data: Uint8Array | ArrayBuffer | Blob
}

async function toBytes(data: ZipStoreEntry['data']): Promise<Uint8Array<ArrayBuffer>> {
  if (data instanceof Uint8Array) {
    const copy = new Uint8Array(new ArrayBuffer(data.byteLength))
    copy.set(data)
    return copy
  }
  if (data instanceof ArrayBuffer) return new Uint8Array(data)
  return new Uint8Array(await data.arrayBuffer())
}

/** Assemble un ZIP non compressé. */
export async function zipStoreBlob(
  entries: readonly ZipStoreEntry[],
  date = new Date(),
): Promise<Blob> {
  const { time, date: dosDate } = dosDateTime(date)
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0
  let count = 0

  for (const entry of entries) {
    const name = entry.name.replace(/\\/g, '/').replace(/^\/+/, '')
    if (!name) continue
    const data = await toBytes(entry.data)
    const nameBytes = new TextEncoder().encode(name)
    const crc = crc32(data)
    const local = concatBytes([
      u32(0x04034b50),
      u16(20),
      u16(0x0800),
      u16(0),
      u16(time),
      u16(dosDate),
      u32(crc),
      u32(data.length),
      u32(data.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
      data,
    ])
    locals.push(local)
    centrals.push(
      concatBytes([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0x0800),
        u16(0),
        u16(time),
        u16(dosDate),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(nameBytes.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        nameBytes,
      ]),
    )
    offset += local.length
    count += 1
  }

  const centralDir = concatBytes(centrals)
  const eocd = concatBytes([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(count),
    u16(count),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  ])
  const zip = concatBytes([...locals, centralDir, eocd])
  return new Blob([zip], { type: 'application/zip' })
}
