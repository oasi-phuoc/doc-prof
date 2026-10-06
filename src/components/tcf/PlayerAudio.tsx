import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { soutienAudioAbsoluteUrl } from '@/francais/soutien/audio'
import { tcfAudioSrc } from '@/tcf/media'

/**
 * Audio TCF : QR code imprimé (écoute au téléphone) + lecteur à l’écran.
 * Le lecteur est masqué à l’impression.
 */
export function PlayerAudio({ src, label }: { src: string; label?: string }) {
  const path = tcfAudioSrc(src)
  const [qr, setQr] = useState('')
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

  return (
    <div className="tcf-audio">
      {qr && path ? (
        <img className="tcf-audio-qr" src={qr} alt={`QR code ${label ?? 'audio'}`} />
      ) : (
        <span className="tcf-audio-qr is-empty" aria-hidden />
      )}
      <div className="tcf-audio-side">
        {label ? <b className="tcf-audio-label">{label}</b> : null}
        {path ? (
          <audio className="no-print tcf-audio-player" controls preload="none" src={path}>
            Écoutez l’enregistrement.
          </audio>
        ) : (
          <small className="muted">Audio non renseigné.</small>
        )}
      </div>
    </div>
  )
}
