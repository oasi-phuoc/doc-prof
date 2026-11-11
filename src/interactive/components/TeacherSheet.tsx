import { useState } from 'react'
import type { Game } from '../domain/types'
import type { ShapeId } from '../domain/palette'
import { teacherSheetData, teacherSheetHtml, teacherSheetSignature } from '../domain/teacher-sheet'
import { browserMediaUrl } from '../media/policy'

async function embedImage(source: string, budget: { bytes: number }): Promise<string | undefined> {
  const url = browserMediaUrl(source)
  if (!url) return undefined
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  const max = 2 * 1024 * 1024
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'error', credentials: 'same-origin' })
    const mime = response.headers.get('content-type')?.split(';')[0]?.toLowerCase()
    if (!response.ok || !mime || !/^image\/(png|jpeg|webp|gif|avif|svg\+xml)$/.test(mime) || Number(response.headers.get('content-length')) > max) return undefined
    const reader = response.body?.getReader()
    if (!reader) return undefined
    const chunks: Uint8Array<ArrayBuffer>[] = []
    let size = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > max) { await reader.cancel(); return undefined }
      chunks.push(value as Uint8Array<ArrayBuffer>)
    }
    if (!size || budget.bytes + size > 20 * 1024 * 1024) return undefined
    budget.bytes += size
    const blob = new Blob(chunks, { type: mime })
    return await new Promise<string>((resolve, reject) => {
      const file = new FileReader()
      file.onload = () => resolve(String(file.result))
      file.onerror = reject
      file.readAsDataURL(blob)
    })
  } catch { return undefined }
  finally { clearTimeout(timeout) }
}

export function TeacherSheet({ game, colors, shapes, disabled, lastSignature, onExport }: { game: Game; colors: string[]; shapes: ShapeId[]; disabled: boolean; lastSignature: string; onExport: (signature: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const signature = teacherSheetSignature(game, colors, shapes)
  const outdated = !!lastSignature && signature !== lastSignature
  const download = async () => {
    setBusy(true)
    setMessage('')
    try {
      const data = await teacherSheetData(game, colors, shapes)
      const urls = [...new Set(data.rows.flatMap((row) => row.image ? [row.image] : []))]
      const images = new Map<string, string>()
      const budget = { bytes: 0 }
      let index = 0
      await Promise.all(Array.from({ length: Math.min(4, urls.length) }, async () => {
        while (index < urls.length) {
          const source = urls[index++]!
          const value = await embedImage(source, budget)
          if (value) images.set(source, value)
        }
      }))
      const html = teacherSheetHtml(game.title, data.planId, data.rows, images)
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'clairfle-enseignant.html'
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      onExport(data.signature)
      setMessage(images.size < urls.length ? 'Feuille créée. Certaines images n’ont pas pu être incorporées ; leurs repères restent indiqués.' : 'Feuille enseignant créée. Ouvrez le fichier téléchargé puis imprimez-le au format A4.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'La feuille n’a pas pu être créée. Réessayez.') }
    finally { setBusy(false) }
  }
  return <section className="ci-panel ci-no-print ci-teacher-sheet">
    <h2>Feuille de séance enseignant</h2>
    <p>ENSEIGNANT — NE PAS PROJETER. Ce document contient les bonnes réponses et les modèles de la préparation actuelle.</p>
    <button disabled={disabled || busy || !game.questions.length} onClick={() => { void download() }}>{busy ? 'Création de la feuille…' : 'Télécharger la feuille enseignant'}</button>
    <p role="status">{outdated ? 'Le plan ou les cartes ont changé : la feuille précédente est obsolète. Téléchargez une nouvelle feuille.' : message}</p>
  </section>
}
