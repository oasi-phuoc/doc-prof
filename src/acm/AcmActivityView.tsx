import type { AcmActivity } from './types'
import './activity.css'

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
      <ol className={illustrations ? 'acm-steps has-photos' : 'acm-steps'} aria-label="Étapes" start={stepOffset + 1}>
        {activity.steps.map((step, index) => {
          const photo = illustrations?.[index]
          return (
            <li key={step}>
              <span>{step}</span>
              {photo && <img className="acm-step-photo" src={photo.src} alt={photo.alt} />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
