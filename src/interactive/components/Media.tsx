import { useEffect, useRef, useState } from 'react'
import { IconButton } from './Icons'
import { browserMediaUrl } from '../media/policy'
import { canListen, ListeningPass } from '../domain/listening'

export function SafeImage({
  src,
  alt,
  zoom = false,
  retryable = true,
}: {
  src: string
  alt: string
  zoom?: boolean
  retryable?: boolean
}) {
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const dialog = useRef<HTMLDialogElement>(null)
  const allowedSrc = browserMediaUrl(src)
  useEffect(() => {
    if (open) dialog.current?.showModal()
    else dialog.current?.close()
  }, [open])
  if (failed || !allowedSrc)
    return (
      <span className="ci-media-error" role="status">
        <span>Image indisponible : {alt}</span>
        {retryable && (
          <button
            onClick={() => {
              setFailed(false)
              setAttempt((n) => n + 1)
            }}
          >
            Réessayer
          </button>
        )}
      </span>
    )
  const img = (
    <img
      key={`${src}:${attempt}`}
      src={allowedSrc}
      alt={alt}
      onError={() => setFailed(true)}
    />
  )
  return (
    <>
      {zoom ? (
        <button
          className="ci-image-zoom"
          aria-label={`Agrandir : ${alt}`}
          onClick={() => {
            setScale(1)
            setOpen(true)
          }}
        >
          {img}
        </button>
      ) : (
        img
      )}
      {zoom && (
        <dialog
          ref={dialog}
          className="ci-image-dialog"
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
        >
          <div className="ci-toolbar">
            <span>{alt}</span>
            <IconButton
              icon="minus"
              label="Réduire l’image"
              disabled={scale <= 1}
              onClick={() => setScale((s) => Math.max(1, s - 0.5))}
            />
            <IconButton
              icon="plus"
              label="Agrandir l’image"
              disabled={scale >= 3}
              onClick={() => setScale((s) => Math.min(3, s + 0.5))}
            />
            <IconButton
              icon="close"
              label="Fermer l’image"
              onClick={() => setOpen(false)}
            />
          </div>
          <div
            className="ci-image-pan"
            tabIndex={0}
            aria-label="Image agrandie, utilisez les flèches pour vous déplacer"
          >
            <img
              src={allowedSrc}
              alt={alt}
              style={{ width: `${scale * 100}%` }}
            />
          </div>
        </dialog>
      )}
    </>
  )
}

export type AudioStatus = 'waiting' | 'playing' | 'ended' | 'error'
export function AudioPlayer({
  src,
  paused = false,
  onStatus,
  listens = 0,
  extraListens = 0,
  maxListens,
  onListenStarted,
  onExtraListen,
}: {
  src: string
  paused?: boolean
  onStatus?: (status: AudioStatus) => void
  listens?: number
  extraListens?: number
  maxListens?: number
  onListenStarted?: () => void
  onExtraListen?: () => void
}) {
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const audio = useRef<HTMLAudioElement>(null)
  const pass = useRef(new ListeningPass())
  const stall = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [activePass, setActivePass] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const allowedSrc = browserMediaUrl(src)
  const available = canListen(listens, extraListens, maxListens)
  const clearStall = () => { clearTimeout(stall.current); stall.current = undefined }
  const fail = () => {
    clearStall(); audio.current?.pause(); pass.current.end(); setActivePass(false)
    setFailed(true); onStatus?.('error')
  }
  const wait = () => {
    clearStall()
    if (!audio.current?.paused) stall.current = setTimeout(fail, 8000)
  }
  useEffect(() => {
    if (paused) audio.current?.pause()
  }, [paused])
  useEffect(() => {
    const player = audio.current
    pass.current = new ListeningPass()
    return () => { player?.pause(); clearTimeout(stall.current) }
  }, [src, attempt])
  useEffect(() => {
    if (!allowedSrc) onStatus?.('error')
  }, [allowedSrc, onStatus])
  return (
    <div className="ci-audio">
      {failed || !allowedSrc ? (
        <div className="ci-media-error" role="status">
          <p>
            Piste audio indisponible. Vous pouvez réessayer ou passer cette
            question.
          </p>
          <button
            onClick={() => {
              setFailed(false)
              setAttempt((n) => n + 1)
              setActivePass(false)
              setPosition(0)
              onStatus?.('waiting')
            }}
          >
            Réessayer l’audio
          </button>
        </div>
      ) : (
        <audio
          ref={audio}
          key={`${src}:${attempt}`}
          controls
          preload="metadata"
          aria-label="Document audio"
          aria-disabled={paused || !available && !activePass}
          inert={paused || !available && !activePass}
          src={allowedSrc}
          onPlay={(event) => {
            const player = event.currentTarget
            if (paused || !pass.current.active && !available) { player.pause(); return }
            if (!pass.current.active && player.currentTime >= 0.5) player.currentTime = 0
          }}
          onPlaying={(event) => {
            const player = event.currentTarget
            clearStall()
            if (paused || !pass.current.active && !available) { player.pause(); return }
            if (pass.current.begin(player.currentTime)) { setActivePass(true); onListenStarted?.() }
            onStatus?.('playing')
          }}
          onSeeking={(event) => {
            pass.current.seek(event.currentTarget.currentTime)
            if (!pass.current.active) {
              setActivePass(false)
              if (!available) event.currentTarget.pause()
            }
          }}
          onTimeUpdate={(event) => { clearStall(); pass.current.lastTime = event.currentTarget.currentTime; setPosition(event.currentTarget.currentTime) }}
          onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
          onEnded={() => { clearStall(); pass.current.end(); setActivePass(false); onStatus?.('ended') }}
          onPause={clearStall}
          onWaiting={wait}
          onStalled={wait}
          onError={fail}
        >
          Votre navigateur ne permet pas la lecture audio.
        </audio>
      )}
      <div className="ci-audio-caption"><span role="status">Écoute {listens}{maxListens !== undefined ? ` / ${maxListens + extraListens}` : ' · libre'}</span><span aria-hidden="true">{audioTime(position)} / {audioTime(duration)}</span></div>
      {!available && !activePass && <div className="ci-audio-quota"><span role="status">Nombre d’écoutes atteint.</span>{onExtraListen && <button type="button" disabled={paused || extraListens >= 1000} onClick={onExtraListen}>Accorder une écoute de plus</button>}</div>}
    </div>
  )
}

function audioTime(value: number) { const seconds = Math.max(0, Math.floor(value)); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` }
