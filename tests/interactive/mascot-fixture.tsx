import { createRoot } from 'react-dom/client'
import { Mascot, type MascotPose } from '../../src/interactive/components/Mascot'
import { MASCOTS } from '../../src/interactive/domain/mascot'
import { ResultFeedback } from '../../src/interactive/components/ResultFeedback'

const poses: MascotPose[] = ['thinking', 'cards-up', 'discussion', 'correct', 'incorrect', 'pause']
export function mountMascots() {
  const container = document.createElement('div')
  container.id = 'mascot-test-root'
  document.body.append(container)
  createRoot(container).render(<>
    {MASCOTS.map((mascot) => <section key={mascot.id} className="ci-app" data-mascot={mascot.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 120px)', gap: 16, padding: 24 }}>
      <h2 style={{ gridColumn: '1 / -1' }}>{mascot.label}</h2>
      {poses.map((pose) => <div key={pose} data-test-mascot={mascot.id} data-test-pose={pose} style={{ width: 110 }}>
        <Mascot kind={mascot.id} pose={pose} label={`${mascot.label} ${pose}`} className="ci-phase-art" />
        <p>{pose}</p>
      </div>)}
    </section>)}
    <section className="ci-app" data-mascot="dragon" data-test-effects style={{ display: 'flex', gap: 32, padding: 40 }}>
      <ResultFeedback correct /><ResultFeedback correct={false} />
    </section>
  </>)
}
