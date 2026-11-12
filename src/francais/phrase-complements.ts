/** Nominal durations are adverbial complements, not indefinite direct objects. */
const DURATION_NOUNS = new Set([
  'moment','moments','instant','instants','seconde','secondes','minute','minutes',
  'heure','heures','jour','jours','semaine','semaines','mois','année','années','nuit','nuits','temps',
])
const DURATION_VERBS = new Set([
  'taire','asseoir','reposer','détendre','dormir','rester','marcher','courir','travailler',
  'attendre','jouer','nager','danser','chanter','parler','voyager','promener','amuser','entraîner',
])

export function isDurationComplement(infinitive: string | undefined, noun: string): boolean {
  const base = infinitive?.replace(/^(?:se |s[’'])/, '')
  return Boolean(base && DURATION_VERBS.has(base) && DURATION_NOUNS.has(noun.toLowerCase()))
}
