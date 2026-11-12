import { useEffect, useRef } from 'react'
import { SafeImage } from './Media'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import type { Question } from '../domain/types'
import { NumberSequenceView } from './NumberSequenceView'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'

export function TextReadingDialog({ title, text, images = [], grammarImages, figure, numberSequence, onClose }: { title: string; text: string; images?: string[]; grammarImages?: Question['grammarImages']; figure?: Question['figure']; numberSequence?: Question['numberSequence']; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement, element = dialog.current
    element?.showModal()
    return () => { element?.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [])
  return <dialog ref={dialog} className="ci-text-dialog" aria-label={title} onCancel={(event) => { event.preventDefault(); onClose() }}>
    <div className="ci-text-dialog-head"><h2>{title}</h2><button onClick={onClose}>Fermer la lecture</button></div>
    <div className="ci-text-dialog-body" tabIndex={0} role="region" aria-label="Texte complet, défilement avec les flèches">
      <GrammarImageSupports supports={grammarImages}/>
      <p>{text}</p>{numberSequence && <NumberSequenceView sequence={numberSequence} />}{figure && <div className="ci-reading-figure"><GeometryFigure type={figure.type} dims={figure.dims} /></div>}{images.map((src, i) => <SafeImage key={`${src}:${i}`} src={src} alt={`Document ${i + 1}`} retryable={false} />)}
    </div>
  </dialog>
}
