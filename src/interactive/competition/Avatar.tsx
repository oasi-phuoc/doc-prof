import { useContext, type CSSProperties } from 'react'
import { COMPETITION_AVATARS, type CompetitionAvatar } from './avatars'
import { CompetitionArt } from './artwork'
export function CompetitionPortrait({ avatarId, seat, outcome }: { avatarId: CompetitionAvatar; seat?: number; outcome?: boolean }) {
  const source = useContext(CompetitionArt), index = COMPETITION_AVATARS.findIndex((avatar) => avatar.id === avatarId)
  const label = COMPETITION_AVATARS[index]?.label ?? 'Mascotte'
  return <span data-ci-motion className={`ci-competition-portrait${outcome === true ? ' ci-competition-win' : outcome === false ? ' ci-competition-miss' : ''}`}>
    <span role="img" aria-label={`${label}${seat ? ` · joueur ${seat}` : ''}`} data-ci-motion className="ci-competition-avatar" style={{ backgroundImage: `url("${source}")`, backgroundPosition: `${(index % 4) * 100 / 3}% ${Math.floor(index / 4) * 50}%` } as CSSProperties} />
    {seat !== undefined && <b className="ci-competition-seat" aria-hidden="true">{seat}</b>}
    {outcome === false && <span className="ci-competition-tears" aria-hidden="true" data-ci-motion />}
  </span>
}
export function CompetitionAvatarPicker({ selected, onSelect }: { selected: CompetitionAvatar; onSelect: (id: CompetitionAvatar) => void }) {
  return <div className="ci-competition-avatars" role="group" aria-label="Choisir ta mascotte">{COMPETITION_AVATARS.map((avatar) => <button type="button" key={avatar.id} aria-label={avatar.label} aria-pressed={selected === avatar.id} onClick={() => onSelect(avatar.id)}><CompetitionPortrait avatarId={avatar.id} /></button>)}</div>
}
