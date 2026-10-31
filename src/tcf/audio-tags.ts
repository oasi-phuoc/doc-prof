/**
 * Tags des audios CO découpés / typés — **plusieurs tags possibles** sur une même piste
 * (ex. `scenario` + `court` si le dialogue a 1 question → sélectionnable en ex. 1 et ex. 4).
 *
 * `scenario` = petit dialogue d’association (scénario + scène), une piste = une situation.
 * `court` = mini-extrait pour « 6 audios courts » (1 question tirée du pool de la piste).
 * `moyen` = extrait moyen pour « 3 audios moyens » (2 questions tirées du pool de la piste).
 * `long` = document long pour « audio complet » (N questions, défaut 5).
 * `objet` = message « objets à reconnaître » (ex. 5, images Oui / Non).
 *
 * `court` / `moyen` / `long` sont mutuellement exclusifs (selon la taille du pool) ;
 * `scenario` / `objet` se cumulent avec les tags de longueur.
 */
export const TCF_AUDIO_TAG_SCENARIO = 'scenario' as const
export const TCF_AUDIO_TAG_COURT = 'court' as const
export const TCF_AUDIO_TAG_MOYEN = 'moyen' as const
export const TCF_AUDIO_TAG_LONG = 'long' as const
export const TCF_AUDIO_TAG_OBJET = 'objet' as const

export type TcfAudioTag =
  | typeof TCF_AUDIO_TAG_SCENARIO
  | typeof TCF_AUDIO_TAG_COURT
  | typeof TCF_AUDIO_TAG_MOYEN
  | typeof TCF_AUDIO_TAG_LONG
  | typeof TCF_AUDIO_TAG_OBJET
  | (string & {})

const LENGTH_TAGS = [
  TCF_AUDIO_TAG_COURT,
  TCF_AUDIO_TAG_MOYEN,
  TCF_AUDIO_TAG_LONG,
] as const

/** Tag court / moyen / long selon la taille du pool de questions. */
export function tcfTagForQuestionPoolSize(
  n: number,
): typeof TCF_AUDIO_TAG_COURT | typeof TCF_AUDIO_TAG_MOYEN | typeof TCF_AUDIO_TAG_LONG | null {
  if (n <= 0) return null
  if (n === 1) return TCF_AUDIO_TAG_COURT
  if (n <= 4) return TCF_AUDIO_TAG_MOYEN
  return TCF_AUDIO_TAG_LONG
}

export function tcfAudioHasTag(tags: readonly string[] | undefined, tag: string): boolean {
  return (tags ?? []).includes(tag)
}

/** Union de tags ; un seul tag de longueur (court/moyen/long) — le dernier gagne. */
export function tcfMergeAudioTags(
  ...lists: Array<readonly string[] | undefined>
): TcfAudioTag[] {
  const out: TcfAudioTag[] = []
  let length: TcfAudioTag | null = null
  for (const list of lists) {
    for (const raw of list ?? []) {
      const t = raw.trim() as TcfAudioTag
      if (!t) continue
      if ((LENGTH_TAGS as readonly string[]).includes(t)) {
        length = t
        continue
      }
      if (!out.includes(t)) out.push(t)
    }
  }
  if (length) out.push(length)
  return out
}
