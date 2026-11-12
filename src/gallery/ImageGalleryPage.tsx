import { useEffect, useMemo, useRef, useState } from 'react'
import { Header } from '@/components/generator/Header'
import { galleryImages, filterGallery, formatBytes, normalizeSearch, type GalleryImage } from './catalog'
import { downloadImage, downloadImageZip } from './download'
import './gallery.css'

const PAGE_SIZE = 48
export function ImageGalleryPage({ onOpenGenerator, onLogout }: { onOpenGenerator: () => void; onLogout: () => void }) {
  const [query, setQuery] = useState(''), [theme, setTheme] = useState(''), [type, setType] = useState(''), [collection, setCollection] = useState('')
  const [page, setPage] = useState(1), [selected, setSelected] = useState<Set<string>>(new Set()), [preview, setPreview] = useState<GalleryImage>()
  const [progress, setProgress] = useState<{ done: number; total: number }>(), [message, setMessage] = useState(''), [error, setError] = useState('')
  const controller = useRef<AbortController | null>(null), dialog = useRef<HTMLDialogElement>(null)
  const filters = useMemo(() => ({ themes: [...new Set(galleryImages.flatMap(i => i.themes))].sort((a, b) => a.localeCompare(b, 'fr')), types: [...new Set(galleryImages.flatMap(i => i.types))].sort(), collections: [...new Set(galleryImages.map(i => i.collection))].sort() }), [])
  const filtered = useMemo(() => filterGallery(galleryImages, query, theme, type, collection), [query, theme, type, collection])
  const chosen = useMemo(() => galleryImages.filter(i => selected.has(i.id)), [selected])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), safePage = Math.min(page, pages)
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const allSelected = filtered.length > 0 && filtered.every(i => selected.has(i.id))
  const size = (images: GalleryImage[]) => formatBytes(images.reduce((n, i) => n + i.bytes, 0))
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => { if (preview) dialog.current?.showModal(); else dialog.current?.close() }, [preview])
  const changeFilter = (update: () => void) => { update(); setPage(1); setError(''); setMessage('') }
  const toggle = (id: string) => setSelected(previous => { const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const runDownload = async (images: GalleryImage[], zip: boolean) => {
    if (!images.length || controller.current) return
    const abort = new AbortController(); controller.current = abort
    setError(''); setMessage(''); setProgress({ done: 0, total: images.length })
    try {
      if (zip) {
        const suffix = normalizeSearch(theme || (images === chosen ? 'selection' : 'images')).replace(/[^a-z0-9]+/g, '-')
        await downloadImageZip(images, `clairfle-${suffix}.zip`, abort.signal, done => setProgress({ done, total: images.length }))
      } else await downloadImage(images[0]!, abort.signal)
      setMessage(`${images.length} image${images.length > 1 ? 's' : ''} téléchargée${images.length > 1 ? 's' : ''}.`)
    } catch (cause) {
      if (abort.signal.aborted || (cause instanceof DOMException && cause.name === 'AbortError')) setMessage('Téléchargement annulé.')
      else setError(cause instanceof Error ? cause.message : 'Le téléchargement a échoué. Réessayez.')
    } finally { controller.current = null; setProgress(undefined) }
  }
  return <div className="app-shell gallery-page">
    <Header generator showCreate onCreate={onOpenGenerator} endSlot={<button type="button" className="topbar-text-btn" onClick={onLogout}>Se déconnecter</button>} />
    <main className="gallery-main" id="gallery-main">
      <header className="gallery-intro"><p className="eyebrow">Banque d’images</p><h1>Galerie d’images</h1><p>Recherchez une image, explorez les thèmes et téléchargez vos choix, seuls ou en groupe.</p><span>{galleryImages.length.toLocaleString('fr')} images · fichiers d’origine</span></header>
      <section className="gallery-filters" aria-label="Rechercher et filtrer les images">
        <label className="gallery-search">Rechercher une image<input type="search" placeholder="Ex. vélo, pharmacie, repas en famille…" value={query} onChange={e => changeFilter(() => setQuery(e.target.value))} /></label>
        <label>Thème<select aria-label="Thème" value={theme} onChange={e => changeFilter(() => setTheme(e.target.value))}><option value="">Tous les thèmes</option>{filters.themes.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Type d’image<select aria-label="Type d’image" value={type} onChange={e => changeFilter(() => setType(e.target.value))}><option value="">Tous les types</option>{filters.types.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Collection<select aria-label="Collection" value={collection} onChange={e => changeFilter(() => setCollection(e.target.value))}><option value="">Toutes les collections</option>{filters.collections.map(t => <option key={t}>{t}</option>)}</select></label>
        {(query || theme || type || collection) && <button className="gallery-text-button" type="button" onClick={() => changeFilter(() => { setQuery(''); setTheme(''); setType(''); setCollection('') })}>Effacer les filtres</button>}
      </section>
      <section className="gallery-actions" aria-label="Sélection et téléchargements">
        <div><strong aria-live="polite">{filtered.length.toLocaleString('fr')} résultat{filtered.length > 1 ? 's' : ''}</strong><span>{selected.size} image{selected.size > 1 ? 's' : ''} sélectionnée{selected.size > 1 ? 's' : ''}{chosen.length ? ` · ${size(chosen)}` : ''}</span></div>
        <button type="button" className="button small secondary" disabled={!filtered.length || !!progress} onClick={() => setSelected(previous => { const next = new Set(previous); for (const image of filtered) { if (allSelected) next.delete(image.id); else next.add(image.id) } return next })}>{allSelected ? 'Désélectionner les résultats' : 'Sélectionner les résultats'}</button>
        <button type="button" className="button small secondary" disabled={!selected.size || !!progress} onClick={() => setSelected(new Set())}>Vider la sélection</button>
        <button type="button" className="button small" disabled={!selected.size || !!progress} onClick={() => void runDownload(chosen, true)}>Télécharger la sélection (ZIP)</button>
        <button type="button" className="button small secondary" disabled={!filtered.length || !!progress} onClick={() => void runDownload(filtered, true)}>Télécharger {theme ? 'ce thème' : 'les résultats'} (ZIP) · {size(filtered)}</button>
      </section>
      {progress && <div className="gallery-progress" role="status"><label>Téléchargement : {progress.done} / {progress.total}<progress max={progress.total} value={progress.done} /></label><button type="button" className="gallery-text-button" onClick={() => controller.current?.abort()}>Annuler</button></div>}
      {message && <p role="status">{message}</p>}{error && <p className="gallery-error" role="alert">{error}</p>}
      {filtered.length ? <><ul className="gallery-grid">{visible.map(image => <li key={image.id} className={`gallery-card${selected.has(image.id) ? ' is-selected' : ''}`}>
        <div className="gallery-thumbnail"><button type="button" className="gallery-preview-button" aria-label={`Agrandir : ${image.label}`} onClick={() => setPreview(image)}><img src={image.src} alt={image.label} loading="lazy" decoding="async" /></button><label className="gallery-select"><input type="checkbox" aria-label={`Sélectionner : ${image.label}`} checked={selected.has(image.id)} onChange={() => toggle(image.id)} /><span>Sélectionner</span></label></div>
        <div className="gallery-card-body"><h2>{image.label}</h2><p>{image.types.join(' · ')} · {image.collection}</p><div className="gallery-tags">{image.themes.slice(0, 2).map(t => <button key={t} type="button" onClick={() => changeFilter(() => setTheme(t))}>{t}</button>)}</div><button type="button" className="gallery-download" disabled={!!progress} onClick={() => void runDownload([image], false)}>Télécharger <span>{formatBytes(image.bytes)}</span></button></div>
      </li>)}</ul><nav className="gallery-pagination" aria-label="Pages de la galerie"><button type="button" className="button small secondary" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Précédent</button><span>Page {safePage} sur {pages}</span><button type="button" className="button small secondary" disabled={safePage === pages} onClick={() => setPage(safePage + 1)}>Suivant</button></nav></> : <div className="gallery-empty"><h2>Aucune image trouvée</h2><p>Essayez un autre mot ou retirez un filtre.</p></div>}
      <dialog ref={dialog} className="gallery-dialog" onCancel={() => setPreview(undefined)} onClick={e => { if (e.target === dialog.current) setPreview(undefined) }} aria-labelledby="gallery-preview-title">
        {preview && <><header><h2 id="gallery-preview-title">{preview.label}</h2><button type="button" className="topbar-text-btn" onClick={() => setPreview(undefined)}>Fermer</button></header><img src={preview.src} alt={preview.label} /><p>{preview.themes.join(' · ')}</p><div><button type="button" className="button small secondary" aria-pressed={selected.has(preview.id)} onClick={() => toggle(preview.id)}>{selected.has(preview.id) ? 'Retirer de la sélection' : 'Ajouter à la sélection'}</button><button type="button" className="button small" disabled={!!progress} onClick={() => void runDownload([preview], false)}>Télécharger l’image</button></div></>}
      </dialog>
    </main>
  </div>
}
