import { useState } from 'react'

export function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <p className="ci-media-error" role="status">
      Image indisponible : {alt}
    </p>
  ) : (
    <img src={src} alt={alt} onError={() => setFailed(true)} />
  )
}
export function AudioPlayer({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="ci-audio">
      <span>Écouter le document</span>
      {failed ? (
        <p role="status">
          Audio indisponible. Vous pouvez passer cette question.
        </p>
      ) : (
        <audio
          key={src}
          controls
          preload="none"
          src={src}
          onError={() => setFailed(true)}
        >
          Votre navigateur ne permet pas la lecture audio.
        </audio>
      )}
    </div>
  )
}
