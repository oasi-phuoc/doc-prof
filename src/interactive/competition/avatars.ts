export const COMPETITION_AVATARS = [
  { id: 'panda', label: 'Panda' }, { id: 'fox', label: 'Renard' },
  { id: 'tanuki', label: 'Tanuki' }, { id: 'otter', label: 'Loutre' },
  { id: 'koala', label: 'Koala' }, { id: 'turtle', label: 'Tortue' },
  { id: 'axolotl', label: 'Axolotl' }, { id: 'tiger', label: 'Tigre' },
  { id: 'leopard', label: 'Panthère des neiges' }, { id: 'crane', label: 'Grue' },
  { id: 'cat', label: 'Chat porte-bonheur' }, { id: 'koi', label: 'Carpe koï' },
] as const
export type CompetitionAvatar = typeof COMPETITION_AVATARS[number]['id']
export const validAvatar = (value: unknown): value is CompetitionAvatar => COMPETITION_AVATARS.some((avatar) => avatar.id === value)
