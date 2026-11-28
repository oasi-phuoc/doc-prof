import type { AcmActivity, AcmFoldArrow } from './types'
import './activity.css'

function StepPhoto({ src, alt, nextFold }: { src: string; alt: string; nextFold?: AcmFoldArrow }) {
  const photo = <img className="acm-step-photo" src={src} alt={alt} />
  if (!nextFold) return photo

  const { from, to, ratio } = nextFold
  // The coordinates are percentages of the photo, so angle and length use its aspect ratio.
  const dx = to[0] - from[0]
  const dy = (to[1] - from[1]) / ratio
  return (
    <div className="acm-fold-photo" style={{ maxWidth: `calc(var(--acm-photo-height) * ${ratio})` }}>
      {photo}
      <span className="acm-fold-label" aria-hidden="true">Pli suivant</span>
      <span
        aria-hidden="true"
        className="acm-fold-arrow"
        style={{
          left: `${from[0]}%`,
          top: `${from[1]}%`,
          width: `${Math.hypot(dx, dy)}%`,
          transform: `rotate(${Math.atan2(dy, dx)}rad)`,
        }}
      />
    </div>
  )
}

export function AcmActivityView({ activity, stepOffset = 0 }: { activity: AcmActivity; stepOffset?: number }) {
  const illustrations = activity.stepImages?.length === activity.steps.length ? activity.stepImages : undefined

  return (
    <div className={`acm-activity acm-${activity.theme}`}>
      {stepOffset === 0 && (
        <div className="acm-materials">
          <div>
            <h3>Matériel</h3>
            <ul>
              {activity.materials.map((material) => <li key={material}>{material}</li>)}
            </ul>
          </div>
          <span className="acm-duration">Environ {activity.minutes} min</span>
        </div>
      )}
      <ol className={illustrations ? 'acm-steps has-visuals' : 'acm-steps'} aria-label="Étapes" start={stepOffset + 1}>
        {activity.steps.map((step, index) => {
          const visual = illustrations?.[index]
          return (
            <li key={step}>
              <span>{step}</span>
              {visual?.src !== undefined && <StepPhoto {...visual} />}
              {visual && 'brief' in visual && (
                <div className="acm-photo-placeholder">
                  <strong>Photo à générer</strong>
                  <span>{visual.brief}</span>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
