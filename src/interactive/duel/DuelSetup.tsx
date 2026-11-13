import { useEffect, useState } from 'react'
import { CompetitionShell } from '../competition/CompetitionShell'
import { CompetitionAvatarPicker, CompetitionPortrait } from '../competition/Avatar'
import { CompetitionArt } from '../competition/artwork'
import { parseCompetitionQuiz, type CompetitionQuiz } from '../competition/core'
import { prepareLocalCompetition } from '../competition/local'
import type { CompetitionAvatar } from '../competition/avatars'
import type { ShapeId } from '../domain/palette'
import { validFeedbackSeconds, validSeconds, type TimerSettings } from '../domain/settings'
import { LoadingScreen } from '@/components/LoadingScreen'
import { duelPairs, type DuelConfig, type DuelMode, type Side } from './core'
import { duelPlanId, hasDuel } from './storage'
import { DuelGame } from './DuelGame'
import './duel.css'
import type { MediaResolver } from '../media/prepared-context'
import { MascotAttackPreview } from './MascotAttackPreview'

type Props = { quiz: CompetitionQuiz; mode: DuelMode; timer: TimerSettings; colors: string[]; shapes: ShapeId[]; onExit: () => void; onNewPart?: () => void }
const randomSeed = () => crypto.getRandomValues(new Uint32Array(1))[0]!
export default function DuelSetup(props: Props) {
  const [seed, setSeed] = useState(randomSeed), [left, setLeft] = useState<CompetitionAvatar[]>(props.mode === 'duel' ? ['panda'] : []), [right, setRight] = useState<CompetitionAvatar[]>(props.mode === 'duel' ? ['fox'] : [])
  const [picked, setPicked] = useState<Record<Side, CompetitionAvatar>>({ left: 'panda', right: 'fox' }), [timer, setTimer] = useState(props.timer)
  const [request, setRequest] = useState<{ config: DuelConfig; timer: TimerSettings; resume: boolean } | null>(null)
  const config: DuelConfig = { mode: props.mode, seed, left, right }, valid = left.length > 0 && left.length === right.length
  const pairs = valid ? duelPairs(config) : []
  const restart = () => { if (props.onNewPart) props.onNewPart(); else { setSeed(randomSeed()); setRequest(null) } }
  if (request) return <PreparedDuel {...props} {...request} onExit={() => { setSeed(randomSeed()); setRequest(null) }} onRestart={restart} />
  const change = (side: Side, values: CompetitionAvatar[]) => side === 'left' ? setLeft(values) : setRight(values)
  return <CompetitionShell title={props.mode === 'duel' ? 'Duel à deux' : 'Duels par équipes'} onExit={props.onExit}><main className="ci-container ci-duel-setup">
    <h1>{props.mode === 'duel' ? 'Préparer le duel' : 'Préparer les équipes'}</h1>
    <p>100 % de vie par mascotte. Le premier clic décide du coup : −10 % pour l’adversaire si c’est juste, −10 % pour soi si c’est faux. Les questions critiques, tirées au hasard environ une fois sur quatre, infligent −20 %.</p>
    <p>À 0 %, le duel est perdu. Les questions continuent jusqu’à la victoire, puis le prochain binôme est appelé. Le temps écoulé sans réponse n’inflige aucun dégât.</p>
    <div className="ci-duel-rosters">{(['left', 'right'] as const).map((side, index) => <section className="ci-panel" aria-label={`Équipe ${index + 1}`} key={side}>
      <h2>{props.mode === 'teams' ? `Équipe ${index + 1}` : `Joueur ${index + 1}`}</h2>
      <CompetitionAvatarPicker selected={props.mode === 'duel' ? config[side][0]! : picked[side]} onSelect={avatar => props.mode === 'duel' ? change(side, [avatar]) : setPicked(previous => ({ ...previous, [side]: avatar }))} />
      {props.mode === 'teams' && <><button disabled={config[side].length >= 30} onClick={() => change(side, [...config[side], picked[side]])}>Ajouter à l’équipe {index + 1}</button><ol className="ci-duel-roster-list">{config[side].map((avatarId, seat) => <li key={seat}><CompetitionPortrait avatarId={avatarId} seat={seat + 1} /><button aria-label={`Retirer le joueur ${seat + 1} de l’équipe ${index + 1}`} onClick={() => change(side, config[side].filter((_, position) => position !== seat))}>Retirer</button></li>)}</ol><p>{config[side].length} joueur(s)</p></>}
    </section>)}</div>
    {props.mode === 'teams' && <section className="ci-panel"><h2>Ordre des duels</h2>{valid ? <ol className="ci-duel-pair-preview">{pairs.map((pair, index) => <li key={index}><b>Duel {index + 1}</b><CompetitionPortrait {...pair.left} /><span>contre</span><CompetitionPortrait {...pair.right} /></li>)}</ol> : <p role="status">Ajoutez le même nombre de mascottes dans les deux équipes pour donner un duel à chaque membre.</p>}</section>}
    <MascotAttackPreview key={`${props.mode==='duel'?left[0]:picked.left}:${props.mode==='duel'?right[0]:picked.right}`} left={props.mode==='duel'?left[0]!:picked.left} right={props.mode==='duel'?right[0]!:picked.right}/>
    <div className="ci-duel-timer"><label><input type="checkbox" checked={timer.enabled} onChange={event => setTimer({ ...timer, enabled: event.target.checked })} />Activer le minuteur du duel</label>
      <label>Temps par question (secondes)<input type="number" min="5" max="600" value={timer.seconds} onChange={event => setTimer({ ...timer, seconds: validSeconds(Number(event.target.value)) })} /></label>
      <label>Temps de correction (secondes)<input type="number" min="1" max="10" value={timer.feedbackSeconds} onChange={event => setTimer({ ...timer, feedbackSeconds: validFeedbackSeconds(Number(event.target.value)) })} /></label>
    </div>
    <div className="ci-toolbar">{hasDuel(props.quiz.id, props.mode) && <button className="ci-primary" onClick={() => setRequest({ config: valid ? config : { ...config, left: ['panda'], right: ['fox'] }, timer, resume: true })}>Reprendre la partie</button>}
      <button className="ci-primary" disabled={!valid} onClick={() => hasDuel(props.quiz.id, props.mode) && props.onNewPart ? restart() : setRequest({ config, timer, resume: false })}>{hasDuel(props.quiz.id, props.mode) ? 'Nouvelle partie' : 'Préparer la partie'}</button>
    </div><p>Deux joueurs utilisent ensemble cet écran. Les médias sont préparés avant de jouer ; la partie peut ensuite continuer sans réseau. Sur clavier : A–F à gauche, 1–6 à droite.</p>
  </main></CompetitionShell>
}
function PreparedDuel(props: Props & { config: DuelConfig; timer: TimerSettings; resume: boolean; onRestart: () => void }) {
  const [prepared, setPrepared] = useState<{ quiz: CompetitionQuiz; artwork: MediaResolver; planId: string } | null>(null), [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController(); let release: (() => void) | undefined
    void (async () => {
      const source = parseCompetitionQuiz({ ...props.quiz, items: props.quiz.items.map(({ question, correctChoiceId }) => ({ question, correctChoiceId })) }, [location.origin])
      const planId = await duelPlanId(source)
      const media = await prepareLocalCompetition(source, controller.signal); release = media.dispose
      if (controller.signal.aborted) media.dispose()
      else setPrepared({ quiz: media.quiz, artwork: media.artwork, planId })
    })().catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Préparation impossible.') })
    return () => { controller.abort(); release?.() }
  }, [props.quiz])
  if (!prepared) return <CompetitionShell title="Préparer le duel" onExit={props.onExit}><main className="ci-container">{error ? <p role="alert">{error}</p> : <LoadingScreen variant="panel" title="Préparation du duel" description="Chargement des questions, des médias et des mascottes…" />}</main></CompetitionShell>
  return <CompetitionArt value={prepared.artwork}><DuelGame {...props} quiz={prepared.quiz} planId={prepared.planId} /></CompetitionArt>
}
