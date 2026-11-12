import { crc32 } from '@/lib/zip-store'
import type { GalleryImage } from './catalog'

type FileSink = { write: (data: Blob | Uint8Array<ArrayBuffer>) => Promise<void>; close: () => Promise<void>; abort: () => Promise<void> }
type SavePicker = (options: { suggestedName: string; types: { description: string; accept: Record<string, string[]> }[] }) => Promise<{ createWritable: () => Promise<FileSink> }>
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = name
  document.body.append(link); link.click(); link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
export function imageFilename(image: GalleryImage) { return image.id.split('/').at(-1) ?? 'image' }
async function fetchImage(image: GalleryImage, signal: AbortSignal) {
  const response = await fetch(image.src, { signal })
  if (!response.ok) throw new Error(`Impossible de télécharger « ${image.label} ». Réessayez.`)
  const blob = await response.blob()
  // A missing asset can be rewritten to the SPA HTML with status 200.
  if (blob.type.includes('text/html') || !blob.size) throw new Error(`L’image « ${image.label} » est indisponible.`)
  return blob
}
export async function downloadImage(image: GalleryImage, signal: AbortSignal) {
  saveBlob(await fetchImage(image, signal), imageFilename(image))
}
const word = (n: number, size: 2 | 4) => {
  const bytes = new Uint8Array(new ArrayBuffer(size)), view = new DataView(bytes.buffer)
  if (size === 2) view.setUint16(0, n, true); else view.setUint32(0, n, true)
  return bytes
}
const join = (parts: Uint8Array<ArrayBuffer>[]) => {
  const bytes = new Uint8Array(new ArrayBuffer(parts.reduce((n, p) => n + p.length, 0)))
  let i = 0; for (const part of parts) { bytes.set(part, i); i += part.length }
  return bytes
}
/** One fetch at a time; stream ZIP entries to disk when the browser offers a file picker. */
export async function downloadImageZip(images: GalleryImage[], name: string, signal: AbortSignal, onProgress: (done: number) => void) {
  const picker = (window as Window & { showSaveFilePicker?: SavePicker }).showSaveFilePicker
  let sink: FileSink | undefined
  const blobs: BlobPart[] = [], centrals: Uint8Array<ArrayBuffer>[] = []
  let offset = 0
  const write = async (part: Uint8Array<ArrayBuffer> | Blob) => {
    signal.throwIfAborted()
    if (sink) await sink.write(part); else blobs.push(part)
  }
  try {
    if (picker) {
      const handle = await picker.call(window, { suggestedName: name, types: [{ description: 'Archive ZIP', accept: { 'application/zip': ['.zip'] } }] })
      signal.throwIfAborted(); sink = await handle.createWritable()
    }
    if (images.length > 65535) throw new Error('Sélectionnez un thème ou un groupe plus petit.')
    for (let i = 0; i < images.length; i++) {
      signal.throwIfAborted()
      const image = images[i]!, blob = await fetchImage(image, signal)
      const data = new Uint8Array(await blob.arrayBuffer()), crc = crc32(data)
      // Preserve repository folders: identically named files never overwrite one another.
      const filename = new TextEncoder().encode(image.id.replace(/^public\//, ''))
      const header = join([word(0x04034b50, 4), word(20, 2), word(0x800, 2), word(0, 2), word(0, 2), word(33, 2), word(crc, 4), word(data.length, 4), word(data.length, 4), word(filename.length, 2), word(0, 2), filename])
      if (offset + header.length + data.length >= 0xffffffff) throw new Error('Ce groupe dépasse la taille d’un ZIP. Téléchargez-le par thème ou par sélection.')
      await write(header); await write(blob)
      centrals.push(join([word(0x02014b50, 4), word(20, 2), word(20, 2), word(0x800, 2), word(0, 2), word(0, 2), word(33, 2), word(crc, 4), word(data.length, 4), word(data.length, 4), word(filename.length, 2), word(0, 2), word(0, 2), word(0, 2), word(0, 2), word(0, 4), word(offset, 4), filename]))
      offset += header.length + data.length; onProgress(i + 1)
    }
    const centralSize = centrals.reduce((n, c) => n + c.length, 0)
    for (const central of centrals) await write(central)
    await write(join([word(0x06054b50, 4), word(0, 2), word(0, 2), word(images.length, 2), word(images.length, 2), word(centralSize, 4), word(offset, 4), word(0, 2)]))
    signal.throwIfAborted()
    if (sink) await sink.close(); else saveBlob(new Blob(blobs, { type: 'application/zip' }), name)
  } catch (error) {
    await sink?.abort().catch(() => undefined)
    throw error
  }
}
