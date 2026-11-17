import type { PhraseToken } from '@/math/types'
import { pick, type Rng } from '@/math/rng'
import { NOMS, NOMS_PROPRES } from './phrase-banks'
import { FEMALE, MALE, TRANSITIVE } from './phrase-passive-data'
import { FEMALE_PROPER_NAMES, PROPER_NAMES } from './phrase-proper-names'
import { startsWithVowelSound } from './phrase-phonetics'
import { phraseSyntaxRoles } from './phrase-forms'
import type { PhraseCategories } from './phrase-themes'

export type PhraseQuestionForm = 'est-ce-que' | 'inversion' | 'qui' | 'a-qui' | 'que' | 'quoi' | 'quel' | 'lequel' | 'où' | 'quand' | 'comment' | 'combien' | 'pourquoi' | 'intonation'
export type InterrogativePhrase = { tokens: PhraseToken[]; form: PhraseQuestionForm }
const PLURAL = new Set('les des ces mes tes ses nos vos leurs quelques plusieurs'.split(' '))
const FEMALE_NAMES = new Set([...FEMALE_PROPER_NAMES, 'Fanny', 'Sophie', 'Déborah', 'Iryna', 'Léa', 'Maya', 'Amira', 'Nina', 'Clara', 'Inès', 'Lina', 'Marie', 'Julie', 'Alice', 'Emma'])
const NAMES = new Set([...PROPER_NAMES, ...NOMS_PROPRES, ...FEMALE_NAMES, 'Jean', 'Paul', 'Pierre', 'Luc', 'Louis', 'Marc'])
const HUMAN = new Set('ami amie voisin voisine frère sœur papa maman garçon fille homme femme enfant élève maître maîtresse professeur professeure enseignant enseignante docteur médecin collègue cousin cousine comédien comédienne bébé parent grand-mère grand-père père mère mamie papy mari fils famille'.split(' '))
const PLACES = new Set('maison école parc jardin cuisine chambre salon bibliothèque restaurant café ville village plage forêt montagne rivière lac gare arrêt magasin boulangerie marché bureau atelier salle classe piscine musée cinéma théâtre port île route rue avenue cour terrain toit balcon terrasse bateau train avion'.split(' '))
const DYNAMIC = new Set(('accompagner accrocher agrandir aider allumer appeler apporter apprendre arroser assouplir atteindre attraper attendre baisser battre bricoler cacher calculer camper caresser changer chanter choisir circuler coller colorier commencer compter conduire construire continuer contourner corriger coudre couper couvrir cueillir cuisiner danser descendre dessiner dire donner débarquer déchirer décoller décorer découvrir déjeuner dîner embarquer embrasser emporter enfiler entrer envelopper essayer essuyer faire fermer finir fêter gagner glisser goûter grandir griller grimper inviter jeter joindre jouer lancer laver lire longer manger marcher marquer mesurer mettre mélanger naviguer nettoyer observer offrir ouvrir parler partir passer patiner payer peindre penser photographier pique-niquer planter plier porter poser pousser prendre préparer présenter protéger pédaler quitter raconter rafraîchir ramasser ramer ranger recevoir recopier remercier remplir repasser retourner réparer répéter résoudre réunir réussir réviser rêver salir sauter sauver semer sentir servir signer skier soigner sortir souligner stationner suivre surveiller sécher traduire travailler traverser trouver utiliser vendre venir visiter voyager écouter écrire éteindre étudier se baigner se baisser se brosser se cacher se changer se coiffer se coucher se dépêcher se diriger se doucher se laver se lever se promener se préparer se raser se rendre se reposer se réveiller s’asseoir s’entraîner s’habiller').split(/ (?=se |s’)/).flatMap(part => part.startsWith('se ') || part.startsWith('s’') ? [part] : part.split(' ')))
const TEMPORAL = new Set(['aujourd’hui', 'demain', 'hier', 'maintenant', 'tôt', 'tard', 'bientôt', 'souvent', 'toujours', 'parfois', 'rarement', 'quelquefois', 'habituellement'])
const DAYS = new Set('matin soir midi lundi mardi mercredi jeudi vendredi samedi dimanche weekend week-end après-midi'.split(' '))
const LOCATION_VERBS = new Set(['être', 'aller', 'venir', 'habiter', 'vivre', 'travailler', 'étudier', 'jouer', 'dormir', 'rester', 'entrer', 'sortir', 'passer', 'monter', 'descendre', 'voyager', 'se rendre', 'se promener'])
const MANNER = new Set(['bien', 'mal', 'vite', 'lentement', 'rapidement', 'doucement', 'fort', 'calmement', 'facilement', 'soigneusement'])
const DEGREE = new Set(['très', 'trop', 'assez', 'si', 'plutôt', 'vraiment'])
const normalize = (text: string) => text.toLocaleLowerCase('fr').replace(/'/g, '’')
const nounKey = (text: string) => normalize(text).replace(/s$/, '')
const lower = (tokens: readonly PhraseToken[]) => tokens.map((token, index) => index === 0 && token.category !== 'nom' ? { ...token, text: normalize(token.text) === 'je' && startsWithVowelSound(tokens[1]?.text ?? '') ? 'j’' : token.text[0]!.toLocaleLowerCase('fr') + token.text.slice(1) } : { ...token })
const cap = (tokens: PhraseToken[]) => tokens.map((token, index) => index === 0 ? { ...token, text: token.text[0]!.toLocaleUpperCase('fr') + token.text.slice(1) } : token)
const word = (text: string, category: PhraseToken['category'], syntaxRole: PhraseToken['syntaxRole'] = null): PhraseToken => ({ text, category, syntaxRole })

function traits(tokens: readonly PhraseToken[]) {
  const article = normalize(tokens.find(token => token.category === 'determinant')?.text ?? '')
  const noun = tokens.find(token => token.category === 'nom')?.text
  const entry = NOMS.find(entry => normalize(entry.text) === normalize(noun ?? ''))
  const key = nounKey(noun ?? '')
  const gender = /^(?:la|une|cette|ma|ta|sa|de la)$/.test(article) ? 'f' : /^(?:le|un|ce|cet|du)$/.test(article) ? 'm' : entry?.gender ?? (FEMALE.has(key) ? 'f' : MALE.has(key) ? 'm' : /^(?:mon|ton|son)$/.test(article) && !startsWithVowelSound(tokens[tokens.findIndex(token => token.category === 'determinant')+1]?.text ?? '') ? 'm' : undefined)
  return { gender, plural: PLURAL.has(article) || entry?.number === 'plur', human: !!noun && (HUMAN.has(key) || NAMES.has(noun)), noun }
}
function nominalEnd(tokens: readonly PhraseToken[], start: number) {
  let end = start
  if (tokens[end]?.category === 'determinant') end++
  while (tokens[end] && ['nom', 'adjectif'].includes(tokens[end]!.category)) end++
  return tokens.slice(start, end).filter(token => token.category === 'nom').length === 1 ? end : start
}
function inverse(tokens: readonly PhraseToken[]): PhraseToken[] | undefined {
  if (tokens.some(token => token.category === 'conjonction')) return
  const verb = tokens.findIndex(token => token.category === 'verbe')
  const subjectEnd = tokens.findIndex(token => token.syntaxRole !== 'sujet')
  if (verb < 0 || subjectEnd <= 0 || subjectEnd > verb) return
  const subject = tokens.slice(0, subjectEnd), head = normalize(subject[0]!.text)
  let pronoun: string, body: PhraseToken[], role: PhraseToken['syntaxRole']
  if (subject.length === 1 && subject[0]!.category === 'pronom') {
    if (!['tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'].includes(head)) return
    pronoun = head; body = tokens.slice(subjectEnd).map(token => ({ ...token })); role = 'sujet'
  } else {
    const name = subject.length === 1 && NAMES.has(subject[0]!.text) ? subject[0]!.text : undefined
    const noun = traits(subject), gender = name ? FEMALE_NAMES.has(name) ? 'f' : 'm' : noun.gender
    if (!gender) return
    pronoun = gender === 'f' ? noun.plural ? 'elles' : 'elle' : noun.plural ? 'ils' : 'il'
    body = tokens.map(token => ({ ...token })); role = null // The nominal subject is already circled; this is its reprise.
  }
  const finite = body.findIndex(token => token.category === 'verbe')
  const joinBefore = /^(?:il|elle|on)$/.test(pronoun) && !/[td]$/i.test(body[finite]!.text) ? '-t-' : '-'
  body.splice(finite + 1, 0, { ...word(pronoun, 'pronom', role), joinBefore })
  return body
}
function withoutAdverbs(tokens: PhraseToken[], removed: Set<string>) {
  const dropped = new Set<number>()
  tokens.forEach((token, index) => {
    if (token.category !== 'adverbe' || !removed.has(normalize(token.text))) return
    dropped.add(index)
    for (let before = index - 1; before >= 0 && tokens[before]!.category === 'adverbe' && DEGREE.has(normalize(tokens[before]!.text)); before--) dropped.add(before)
  })
  return tokens.filter((_, index) => !dropped.has(index))
}

/** Reviewed transformations of a complete source clause, with explicit word classes and roles. */
export function interrogativeCandidates(source: readonly PhraseToken[], infinitives: readonly string[], categories?: PhraseCategories, picturedChoice=false): InterrogativePhrase[] {
  const roles = phraseSyntaxRoles(source), base = lower(source.map((token, index) => ({ ...token, syntaxRole: roles[index] ?? null })))
  const result: InterrogativePhrase[] = [], adverbs = categories?.adverbe !== false
  const add = (form: PhraseQuestionForm, tokens: PhraseToken[]) => result.push({ form, tokens: cap(tokens) })
  const particle = (tokens: readonly PhraseToken[]) => [word(startsWithVowelSound(tokens[0]?.text ?? '') ? 'est-ce qu’' : 'est-ce que', 'adverbe'), ...lower(tokens)]
  const front = (form: PhraseQuestionForm, prefix: PhraseToken[], body: PhraseToken[]) => {
    let inverted = inverse(body)
    // Object « que » prefers simple nominal inversion: « Que mange Marie ? ».
    const subjectEnd = body.findIndex(token => token.syntaxRole !== 'sujet'), finite = body.findIndex(token => token.category === 'verbe')
    if (form === 'que' && subjectEnd > 0 && body[0]?.category !== 'pronom') inverted = body.some(token => token.category === 'adverbe' && /^(?:ne|n’|pas)$/.test(normalize(token.text))) ? undefined : [...body.slice(subjectEnd, finite + 1), ...body.slice(0, subjectEnd), ...body.slice(finite + 1)]
    const rest = inverted ?? (adverbs ? particle(body) : undefined)
    if (!rest) return
    const lead = prefix.map(token => ({ ...token }))
    if (normalize(lead.at(-1)?.text ?? '') === 'que' && startsWithVowelSound(rest[0]?.text ?? '')) lead.at(-1)!.text = 'qu’'
    add(form, [...lead, ...rest])
  }
  if (adverbs) add('est-ce-que', particle(base))
  const inverted = inverse(base)
  if (inverted) add('inversion', inverted)
  if (adverbs) front('pourquoi', [word('pourquoi', 'adverbe')], base)
  if (source.some(token => token.category === 'conjonction')) return result.length ? result : [{ form: 'intonation', tokens: cap(base) }]
  const verb = base.findIndex(token => token.category === 'verbe'), infinitive = infinitives[0] ?? ''
  if (verb < 0) return result
  const subjectEnd = base.findIndex(token => token.syntaxRole !== 'sujet'), subject = base.slice(0, subjectEnd)
  const subjectTraits = traits(subject), subjectWord = normalize(subject[0]?.text ?? '')
  const singularHuman = subject.length === 1 && /^(?:il|elle|on)$/.test(subjectWord) || subjectTraits.human && !subjectTraits.plural
  const passive = base.some(token => token.verbPart === 'auxiliary')
  if (singularHuman && subjectEnd > 0 && !passive) add('qui', [word('qui', 'pronom', 'sujet'), ...base.slice(subjectEnd)])
  let objectStart = verb + 1
  while (base[objectStart]?.category === 'adverbe') objectStart++
  const objectEnd = nominalEnd(base, objectStart)
  if ((TRANSITIVE.has(infinitive)||['aimer','vouloir','savoir'].includes(infinitive)) && !passive && base[objectStart]?.category === 'determinant' && objectEnd > objectStart) {
    const object = base.slice(objectStart, objectEnd), info = traits(object), remainder = [...base.slice(0, objectStart), ...base.slice(objectEnd)]
    front(info.human ? 'qui' : 'que', [word(info.human ? 'qui' : 'que', 'pronom', 'complement')], remainder)
    if (info.gender) {
      const quel = info.gender === 'f' ? info.plural ? 'quelles' : 'quelle' : info.plural ? 'quels' : 'quel'
      front('quel', [word(quel, 'determinant', 'complement'), ...object.slice(1)], remainder)
    }
    if (picturedChoice && infinitive === 'choisir' && nounKey(info.noun ?? '') === 'sac' && !info.plural) {
      front('lequel', [word('lequel', 'pronom', 'complement')], remainder)
    }
    if (info.plural && adverbs && categories?.preposition !== false) {
      const tail = object.slice(1)
      front('combien', [word('combien', 'adverbe', 'complement'), word(startsWithVowelSound(tail[0]?.text ?? '') ? 'd’' : 'de', 'preposition', 'complement'), ...tail], remainder)
    }
  }
  for (let index = verb + 1; index < base.length; index++) {
    const prep = base[index]!, end = nominalEnd(base, index + 1)
    if (prep.category !== 'preposition' || end <= index + 1) continue
    const complement = base.slice(index + 1, end), noun = complement.find(token => token.category === 'nom'), key = nounKey(noun?.text ?? '')
    const remainder = [...base.slice(0, index), ...base.slice(end)], preposition = normalize(prep.text)
    const spatial = /^(?:dans|sur|sous|devant|derrière|près de|loin de|à côté de|chez)$/.test(preposition) || LOCATION_VERBS.has(infinitive) && /^(?:à|au|aux|en|vers)$/.test(preposition)
    if (adverbs && spatial && !(preposition === 'en' && ['train', 'avion', 'bateau'].includes(key)) && (PLACES.has(key) || preposition === 'chez' && traits(complement).human)) front('où', [word('où', 'adverbe', 'complement')], remainder)
    if (adverbs && categories?.preposition!==false && ['venir','sortir','rentrer','descendre'].includes(infinitive) && /^(?:de|du|des|d’)$/.test(preposition) && PLACES.has(key)) front('où',[word('d’','preposition','complement'),word('où','adverbe','complement')],remainder)
    if (categories?.preposition!==false&&traits(complement).human&&/^(?:à|au|aux)$/.test(preposition)) front('a-qui',[word('à','preposition','complement'),word('qui','pronom','complement')],remainder)
    if (categories?.preposition !== false && !traits(complement).human && !PLACES.has(key) && /^(?:à|au|aux|de|du|des|d’)$/.test(preposition)) front('quoi', [word(/^(?:à|au|aux)$/.test(preposition) ? 'à' : 'de', 'preposition', 'complement'), word('quoi', 'pronom', 'complement')], remainder)
  }
  if (adverbs && DYNAMIC.has(infinitive)) {
    let timed = withoutAdverbs(base, TEMPORAL)
    for (let index = verb + 1; index < timed.length; index++) {
      if (timed[index]?.category === 'determinant' && DAYS.has(nounKey(timed[index + 1]?.text ?? ''))) { timed = [...timed.slice(0, index), ...timed.slice(index + 2)]; break }
    }
    front('quand', [word('quand', 'adverbe', 'complement')], timed)
    front('comment', [word('comment', 'adverbe', 'complement')], withoutAdverbs(base, MANNER))
  }
  return result.length ? result : [{ form: 'intonation', tokens: cap(base) }]
}

export function interrogativePhrase(tokens: readonly PhraseToken[], infinitives: readonly string[], rng: Rng, used: Set<PhraseQuestionForm>, categories?: PhraseCategories, picturedChoice=false): InterrogativePhrase {
  const candidates = interrogativeCandidates(tokens, infinitives, categories, picturedChoice)
  const fresh = candidates.filter(candidate => !used.has(candidate.form))
  const selected = pick(rng, fresh.length ? fresh : candidates)
  used.add(selected.form)
  return selected
}
