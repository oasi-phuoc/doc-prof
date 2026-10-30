/**
 * Tags des audios CO découpés / typés.
 * `scenario` = petit dialogue d’association (scénario + scène), une piste = une situation.
 */
export const TCF_AUDIO_TAG_SCENARIO = 'scenario' as const

export type TcfAudioTag = typeof TCF_AUDIO_TAG_SCENARIO | (string & {})

export function tcfAudioHasTag(tags: readonly string[] | undefined, tag: string): boolean {
  return (tags ?? []).includes(tag)
}
