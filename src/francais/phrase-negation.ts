import type { PhraseToken } from '@/math/types'
import { startsWithVowelSound } from './phrase-phonetics'

const CLITICS = new Set(['me', 'm’', 'te', 't’', 'se', 's’', 'nous', 'vous', 'le', 'la', 'les', 'l’', 'lui', 'leur', 'y', 'en'])
const ETRE = new Set(['suis', 'es', 'est', 'sommes', 'êtes', 'sont'])
const INDEFINITE = new Set(['un', 'une', 'des', 'du', 'de la', 'de l’'])

function negateClause(clause: PhraseToken[], infinitive?: string): PhraseToken[] {
  const tokens = clause.map(token => ({ ...token }))
  const verb = tokens.findIndex(token => token.category === 'verbe')
  if (verb < 0 || tokens.some(token => /^(?:ne|n’)$/.test(token.text.toLowerCase()))) return tokens
  let start = verb
  while (start > 1 && tokens[start - 1]!.category === 'pronom' && CLITICS.has(tokens[start - 1]!.text.toLowerCase())) start--
  const subject = tokens[0]
  if (subject?.category === 'pronom' && /^[jJ][’']$/.test(subject.text)) {
    subject.text = subject.text[0] === 'J' ? 'Je' : 'je'
  }
  const after = tokens.slice(verb + 1)
  // Pas encore is the natural negative counterpart of déjà/enfin in these contexts.
  for (const token of after) {
    if (token.category === 'adverbe' && ['déjà', 'enfin'].includes(token.text)) token.text = 'encore'
  }
  const isEtre = infinitive ? infinitive === 'être' : ETRE.has(tokens[verb]!.text)
  if (!isEtre) {
    const object = after.findIndex(token => token.category !== 'adverbe')
    const article = after[object]
    if (article?.category === 'determinant' && INDEFINITE.has(article.text.toLowerCase()) && after[object + 1]) {
      article.text = startsWithVowelSound(after[object + 1]!.text) ? 'd’' : 'de'
    }
  }
  return [
    ...tokens.slice(0, start),
    { text: startsWithVowelSound(tokens[start]!.text) ? 'n’' : 'ne', category: 'adverbe' },
    ...tokens.slice(start, verb + 1),
    { text: 'pas', category: 'adverbe' },
    ...after,
  ]
}

/** Negates the finite verb of each coordinated clause, including reflexive clitics. */
export function withNegation(tokens: PhraseToken[], infinitives: readonly string[] = []): PhraseToken[] {
  const out: PhraseToken[] = []
  let clause: PhraseToken[] = []
  let clauseIndex = 0
  for (const token of tokens) {
    if (token.category === 'conjonction') {
      out.push(...negateClause(clause, infinitives[clauseIndex++]), { ...token })
      clause = []
    } else clause.push(token)
  }
  return [...out, ...negateClause(clause, infinitives[clauseIndex])]
}
