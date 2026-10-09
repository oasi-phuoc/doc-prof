import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { soutienAudioAbsoluteUrl } from '@/francais/soutien/audio'
import { tcfAudioSequence, tcfAudioSrc } from '@/tcf/media'

/**
 * Audio TCF : QR code imprimé (écoute au téléphone) + lecteur à l’écran.
 * Le lecteur est masqué à l’impression. Une combinaison de nombres (`nombre/100-12`)
 * enchaîne les fichiers ; elle n’a pas de QR (pas de fichier unique à ouvrir).
 */
export function PlayerAudio({ src, label }: { src: string; label?: string }) {
  const sequence = tcfAudioSequence(src)
  const path = sequence ? '' : tcfAudioSrc(src)
  const [qr, setQr] = useState('')
  const seqKey = sequence?.join('|') ?? ''
  const [step, setStep] = useState({ key: seqKey, part: 0 })
  const part = step.key === seqKey ? step.part : 0
  const setPart = (next: number) => setStep({ key: seqKey, part: next })
  const playNext = useRef(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let cancelled = false
    if (!path) return
    QRCode.toDataURL(soutienAudioAbsoluteUrl(path), {
      margin: 0,
      width: 84,
      errorCorrectionLevel: 'M',
      color: { dark: '#111111', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setQr(url)
      })
      .catch(() => {
        if (!cancelled) setQr('')
      })
    return () => {
      cancelled = true
    }
  }, [path])

  useEffect(() => {
    if (playNext.current) {
      playNext.current = false
      void audioRef.current?.play()
    }
  }, [part])

  const current = sequence ? sequence[Math.min(part, sequence.length - 1)] : path
  const onEnded = sequence
    ? () => {
        if (part < sequence.length - 1) {
          playNext.current = true
          setPart(part + 1)
        } else setPart(0)
      }
    : undefined

  return (
    <div className="tcf-audio">
      {qr && path ? (
        <img className="tcf-audio-qr" src={qr} alt={`QR code ${label ?? 'audio'}`} />
      ) : (
        <span className="tcf-audio-qr is-empty" aria-hidden />
      )}
      <div className="tcf-audio-side">
        {label ? <b className="tcf-audio-label">{label}</b> : null}
        {current ? (
          <audio
            ref={audioRef}
            className="no-print tcf-audio-player"
            controls
            preload={sequence ? 'auto' : 'none'}
            src={current}
            onEnded={onEnded}
          >
            Écoutez l’enregistrement.
          </audio>
        ) : (
          <small className="muted">Audio non renseigné.</small>
        )}
      </div>
    </div>
  )
}
