import { COMPETITION_AVATARS, type CompetitionAvatar } from './avatars'
import { Mascot } from '../components/Mascot'
import {PowerAura} from '../duel/PowerAura'
import type {DamageMultiplier} from '../duel/core'
export function CompetitionPortrait({ avatarId, seat, outcome, powerLevel=1 }: { avatarId: CompetitionAvatar; seat?: number; outcome?: boolean; powerLevel?:DamageMultiplier }) {
  const index = COMPETITION_AVATARS.findIndex((avatar) => avatar.id === avatarId)
  const label = COMPETITION_AVATARS[index]?.label ?? 'Mascotte'
  return <span data-ci-motion data-power={powerLevel} className={`ci-competition-portrait${powerLevel>1?` ci-powered-portrait ci-power-${powerLevel}`:''}${outcome === true ? ' ci-competition-win' : outcome === false ? ' ci-competition-miss' : ''}`}>
    <PowerAura level={powerLevel}/>
    <span role="img" aria-label={`${label}${seat ? ` · joueur ${seat}` : ''}`} data-ci-motion className="ci-competition-avatar"><Mascot kind={avatarId} pose={outcome===false?'incorrect':powerLevel===3?'angry':outcome===true?'correct':'thinking'} label={label} decorative /></span>
    {seat !== undefined && <b className="ci-competition-seat" aria-hidden="true">{seat}</b>}
    {outcome === false && <span className="ci-competition-tears" aria-hidden="true" data-ci-motion />}
  </span>
}
export function CompetitionAvatarPicker({ selected, onSelect, excluded=[] }: { selected?: CompetitionAvatar; onSelect: (id: CompetitionAvatar) => void; excluded?:readonly CompetitionAvatar[] }) {
  const available=COMPETITION_AVATARS.filter(avatar=>!excluded.includes(avatar.id))
  return <div className="ci-competition-avatars" role="group" aria-label="Choisir ta mascotte">{available.map((avatar) => <button type="button" key={avatar.id} aria-label={avatar.label} aria-pressed={selected === avatar.id} onClick={() => onSelect(avatar.id)}><CompetitionPortrait avatarId={avatar.id} /></button>)}{!available.length&&<p role="status">Toutes les mascottes sont déjà choisies.</p>}</div>
}
