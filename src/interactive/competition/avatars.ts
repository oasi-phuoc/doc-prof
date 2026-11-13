import { MASCOTS, type MascotKind } from '../domain/mascot'
export const COMPETITION_AVATARS = MASCOTS.map(({id,label}) => ({id,label}))
export type CompetitionAvatar = MascotKind
export const validAvatar = (value: unknown): value is CompetitionAvatar => COMPETITION_AVATARS.some((avatar) => avatar.id === value)
