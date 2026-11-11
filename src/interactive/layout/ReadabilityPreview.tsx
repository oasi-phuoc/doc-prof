import type { Question } from '../domain/types'
import type { ShapeId } from '../domain/palette'
import type { ReadabilityOptions } from './preflight'
import { ClassroomHeader } from '../components/ClassroomHeader'
import { QuestionStage } from '../components/QuestionStage'
import { PhaseBanner } from '../components/PhaseBanner'
const noop = () => {}

export function ReadabilityPreview({ questions, options, total }: { questions: Question[]; options: ReadabilityOptions; total: number }) {
  return <div className={`ci-app ci-playing${options.contrast ? ' ci-high-contrast' : ''}`} data-mascot={options.mascot}>
    <ClassroomHeader {...options} playing fullscreen={false} onContrast={noop} onMode={noop} onMascot={noop} onTimer={noop} onFullscreen={noop} onFiches={noop}
      session={{ progress: `Question 1 / ${total}`, paused: false, canSkip: true, onSkip: noop, onPause: noop, onExit: noop,
        audio: questions.some((q) => q.audio) ? <div className="ci-audio"><audio controls preload="none" aria-label="Extrait audio" /><small>Écoute 1 / 2</small></div> : undefined }} />
    <main className={`ci-session${options.mode === 'solo' ? ' ci-solo-session' : ''}${questions.length === 2 ? ' ci-dual-session' : ''}${questions[0]?.mode === 'sequence' ? ' ci-sequence-session' : ''}${questions[0]?.words ? ' ci-word-session' : ''}`}>
      <div><div className="ci-play-layout">
        <aside className="ci-phase-margin ci-margin-left"><PhaseBanner phase="thinking" choice={questions[0]?.mode === 'choice'} side="left" />{options.timer.enabled && <div className="ci-timer"><span className="ci-timer-value">{options.timer.seconds} s</span><button>Pause</button></div>}</aside>
        <div className="ci-round-questions">{questions.map((q, i) => <article className="ci-round-question" data-ci-question-id={q.id} key={q.id}>
          <QuestionStage q={q} phase="thinking" colors={options.colors} shapes={options.shapes as ShapeId[]} number={questions.length === 2 ? i + 1 : undefined} slotOffset={i * 3} onSelect={noop} />
        </article>)}</div><aside className="ci-phase-margin ci-margin-right" />
      </div><footer className="ci-controls"><button className="ci-primary">{options.mode === 'solo' ? 'Question suivante' : 'Signal : levez vos cartes'}</button></footer></div>
    </main>
  </div>
}
