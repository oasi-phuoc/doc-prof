import { useEffect, useState } from 'react'
import { CompetitionShell } from '../competition/CompetitionShell'
import { CompetitionAvatarPicker, CompetitionPortrait } from '../competition/Avatar'
import { CompetitionArt } from '../competition/artwork'
import { parseCompetitionQuiz, type CompetitionQuiz } from '../competition/core'
import { prepareLocalCompetition } from '../competition/local'
import {COMPETITION_AVATARS,type CompetitionAvatar} from '../competition/avatars'
import type { ShapeId } from '../domain/palette'
import { validFeedbackSeconds, validSeconds, type TimerSettings } from '../domain/settings'
import { LoadingScreen } from '@/components/LoadingScreen'
import { duelPairs, nextDuelSeed, otherSide, type DuelConfig, type DuelMode, type Side } from './core'
import { duelPlanId, hasDuel } from './storage'
import { DuelGame } from './DuelGame'
import './duel.css'
import type { MediaResolver } from '../media/prepared-context'
import { MascotAttackPreview } from './MascotAttackPreview'

type Props = { quiz: CompetitionQuiz; mode: DuelMode; timer: TimerSettings; colors: string[]; shapes: ShapeId[]; onExit: () => void; onNewPart?: () => void }
const randomSeed = () => crypto.getRandomValues(new Uint32Array(1))[0]!
export default function DuelSetup(props: Props) {
  const [seed, setSeed] = useState(randomSeed), [rosters,setRosters]=useState<Record<Side,CompetitionAvatar[]>>({left:props.mode==='duel'?['panda']:[],right:props.mode==='duel'?['fox']:[]})
  const {left,right}=rosters
  const [picked, setPicked] = useState<Record<Side, CompetitionAvatar>>({ left: 'panda', right: 'fox' }), [timer, setTimer] = useState(props.timer)
  const [request, setRequest] = useState<{ config: DuelConfig; timer: TimerSettings; resume: boolean } | null>(null)
  const config: DuelConfig = { mode: props.mode, seed, left, right }, valid = left.length > 0 && left.length === right.length&&new Set([...left,...right]).size===left.length+right.length
  const available=COMPETITION_AVATARS.filter(avatar=>!left.includes(avatar.id)&&!right.includes(avatar.id)).map(avatar=>avatar.id)
  const selectedFor=(side:Side)=>available.includes(picked[side])?picked[side]:available[0]
  const pairs = valid ? duelPairs(config) : []
  const restart = () => { if (props.onNewPart) props.onNewPart(); else { setSeed(randomSeed()); setRequest(null) } }
  if (request) return <PreparedDuel {...props} {...request} onExit={() => { setSeed(randomSeed()); setRequest(null) }} onRestart={restart} />
  const change = (side: Side, values: CompetitionAvatar[]) => setRosters(previous=>values.length>15||new Set([...values,...previous[otherSide(side)]]).size!==values.length+previous[otherSide(side)].length?previous:{...previous,[side]:values})
  return <CompetitionShell title={props.mode === 'duel' ? 'Duel à deux' : 'Duels par équipes'} onExit={props.onExit}><main className="ci-container ci-duel-setup">
    <h1>{props.mode === 'duel' ? 'Préparer le duel' : 'Préparer les équipes'}</h1>
    <p>100 % de vie par mascotte. Le premier clic décide du coup : −10 % pour l’adversaire si c’est juste, −10 % pour soi si c’est faux. Critique ×2 : −20 %, avec 25 % de chances. Super critique ×3 : −30 %, avec 10 % de chances.</p>
    <p>À 0 %, le duel est perdu. Si personne ne répond à temps, les deux joueurs perdent 10 %. Un double KO donne un match nul. Chaque joueur choisit une mascotte différente.</p>
    <div className="ci-duel-rosters">{(['left', 'right'] as const).map((side, index) => <section className="ci-panel" aria-label={`Équipe ${index + 1}`} key={side}>
      <h2>{props.mode === 'teams' ? `Équipe ${index + 1}` : `Joueur ${index + 1}`}</h2>
      <CompetitionAvatarPicker selected={props.mode === 'duel' ? config[side][0]! : selectedFor(side)} excluded={props.mode==='duel'?config[otherSide(side)]:[...left,...right]} onSelect={avatar => props.mode === 'duel' ? change(side, [avatar]) : setPicked(previous => ({ ...previous, [side]: avatar }))} />
      {props.mode === 'teams' && <><button disabled={config[side].length >= 15||!selectedFor(side)} onClick={() => {const avatar=selectedFor(side);if(avatar)change(side, [...config[side], avatar])}}>Ajouter à l’équipe {index + 1}</button><ol className="ci-duel-roster-list">{config[side].map((avatarId, seat) => <li key={seat}><CompetitionPortrait avatarId={avatarId} seat={seat + 1} /><button aria-label={`Retirer le joueur ${seat + 1} de l’équipe ${index + 1}`} onClick={() => change(side, config[side].filter((_, position) => position !== seat))}>Retirer</button></li>)}</ol><p>{config[side].length} / 15 joueurs</p></>}
    </section>)}</div>
    {props.mode === 'teams' && <section className="ci-panel"><h2>Ordre des duels</h2>{valid ? <><button disabled={pairs.length<2} onClick={()=>setSeed(nextDuelSeed(config,randomSeed()))}>Randomiser les matchs</button><ol className="ci-duel-pair-preview">{pairs.map((pair, index) => <li key={`${seed}:${index}`}><b>Duel {index + 1}</b><CompetitionPortrait {...pair.left} /><span>contre</span><CompetitionPortrait {...pair.right} /></li>)}</ol></> : <p role="status">Ajoutez le même nombre de mascottes dans les deux équipes pour donner un duel à chaque membre.</p>}</section>}
    <MascotAttackPreview key={`${props.mode==='duel'?left[0]:selectedFor('left')}:${props.mode==='duel'?right[0]:selectedFor('right')}`} left={props.mode==='duel'?left[0]!:selectedFor('left')??left.at(-1)??'panda'} right={props.mode==='duel'?right[0]!:selectedFor('right')??right.at(-1)??'fox'}/>
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
