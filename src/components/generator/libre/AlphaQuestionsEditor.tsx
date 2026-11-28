import { useEffect, useRef } from 'react'
import { isAlphaEditableQuestionKind, parseAlphaType, type AlphaEditableQuestionKind } from '@/alphabetisation/kinds'
import { toolWordsForCategory } from '@/alphabetisation/data/tool-words'
import { ALPHABET, WORDS_BY_INITIAL } from '@/francais/lecture-banks'
import { syllabifyFr } from '@/francais/soutien/syllabify-fr'
import type { MathItem } from '@/math/types'

const categories = ['article / déterminant', 'pronom']
const articles = new Set(toolWordsForCategory('articles'))
const pronouns = new Set(toolWordsForCategory('pronoms-sujets'))
const wordPattern = /^\p{L}[\p{L}\p{M}’'-]*$/u

function editLetter(kind: 'alphabet-suivant' | 'alphabet-initiale', letter: string, item: MathItem): Partial<MathItem> {
  if (kind === 'alphabet-initiale') {
    const answer = initialOf(item.answer) === letter ? item.answer : WORDS_BY_INITIAL[letter]?.[0] ?? ''
    return { prompt: `Écrivez un mot qui commence par la lettre ${letter}.`, answer }
  }
  const answer = ALPHABET[ALPHABET.indexOf(letter) + 1]!
  const old = item.options?.length ? item.options : [item.answer, '', '', '']
  const position = Math.max(0, old.findIndex((option) => option === item.answer))
  const used = new Set([letter, answer])
  const options = old.map((option, index) => {
    if (index === position) return answer
    const candidate = ALPHABET.includes(option) && !used.has(option)
      ? option : ALPHABET.find((alternative) => !used.has(alternative)) ?? option
    used.add(candidate)
    return candidate
  })
  return { prompt: `Quelle lettre vient juste après ${letter} ?`, answer, options }
}

function initialOf(word: string) {
  return word.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase()[0]
}

function readLetters(input: string) {
  const letters = input.split(',').map((part) => part.trim())
  return letters.every((letter) => /^[A-Za-z]$/.test(letter)) &&
    new Set(letters.map((letter) => letter.toUpperCase())).size === letters.length ? letters : null
}

function QuestionFields({ kind, bankId, item, fields, writeField, onChange }: {
  kind: AlphaEditableQuestionKind
  bankId: string
  item: MathItem
  fields: Record<string, string>
  writeField: (key: string, value: string | null) => void
  onChange: (item: MathItem) => void
}) {
  const update = (patch: Partial<MathItem>) => onChange({
    ...item, ...patch,
    ...(patch.answer !== undefined && item.responseAnswer !== undefined ? { responseAnswer: patch.answer } : {}),
  })
  const fieldKey = (name: string) => `${item.libreId}:alpha:${name}`
  function textField(name: string, label: string, applied: string, error: string, parse: (input: string) => Partial<MathItem> | null) {
    const key = fieldKey(name)
    const invalid = fields[key] !== undefined
    return (
      <label className="libre-field is-line">
        <span id={`${key}-label`}>{label}</span>
        <input className="libre-line-input" value={fields[key] ?? applied} aria-invalid={invalid}
          aria-labelledby={`${key}-label`} aria-describedby={invalid ? `${key}-error` : undefined} data-applied-value={applied}
          onChange={(event) => {
            const draft = event.target.value
            const patch = parse(draft.trim().normalize('NFC'))
            writeField(key, patch ? null : draft)
            if (patch) update(patch)
          }} />
        {invalid && <span id={`${key}-error`} role="alert" className="libre-field-error">{error}</span>}
      </label>
    )
  }

  if (kind === 'alphabet-ordre') {
    return textField('ordre', 'Lettres proposées (séparées par une virgule)', (item.sequence ?? []).join(', '),
      'Saisissez de deux à six lettres différentes, séparées par une virgule.', (value) => {
        const sequence = readLetters(value)
        if (!sequence || sequence.length < 2 || sequence.length > 6) return null
        const placeParts = [...sequence].sort((a, b) => a.localeCompare(b, 'fr'))
        return { sequence, placeParts, answer: placeParts.join(' '), orderOp: '<' }
      })
  }

  if (kind === 'alphabet-suivant' || kind === 'alphabet-initiale') {
    const nextLetter = kind === 'alphabet-suivant'
    const letter = (nextLetter ? item.prompt?.match(/après ([A-Z])\s*\?$/) : item.prompt?.match(/lettre ([A-Z])\.$/))?.[1] ?? ''
    const choices = nextLetter ? ALPHABET.slice(0, -1) : ALPHABET
    return (
      <>
        {!letter && item.prompt && <p className="muted">{item.prompt}</p>}
        <label className="libre-field is-line">
          <span>Lettre donnée</span>
          <select className="libre-line-input" value={letter} onChange={(event) => {
            writeField(fieldKey(nextLetter ? 'choix' : 'exemple'), null)
            update(editLetter(kind, event.target.value, item))
          }}>
            <option value="" disabled>Choisir une lettre</option>
            {choices.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        {letter && nextLetter && textField('choix', 'Choix proposés (séparés par une virgule)', (item.options ?? []).join(', '),
          'Saisissez deux à quatre lettres distinctes, dont la lettre suivante, sans la lettre donnée.', (value) => {
            const options = readLetters(value.toUpperCase())
            if (!options || options.length < 2 || options.length > 4 || options.includes(letter) || !options.includes(item.answer)) return null
            return { options }
          })}
        {letter && !nextLetter && textField('exemple', 'Exemple de réponse', item.answer,
          `Saisissez un mot qui commence par la lettre ${letter}.`, (value) =>
            wordPattern.test(value) && initialOf(value) === letter ? { answer: value } : null)}
      </>
    )
  }

  if (kind === 'former') {
    const [, first = '', second = ''] = item.prompt?.match(/^Associez\s*:\s*(.+?)\s*\+\s*(.+?)\s*→$/u) ?? []
    function withParts(a: string, b: string, otherField: string) {
      if (!wordPattern.test(a) || !wordPattern.test(b)) return null
      writeField(fieldKey(otherField), null)
      return { prompt: `Associez : ${a} + ${b} →`, answer: a + b }
    }
    const error = 'Renseignez les deux parties du mot.'
    return (
      <>
        {!first && item.prompt && <p className="muted">{item.prompt}</p>}
        <div className="libre-pair">
          {textField('debut', 'Première partie', first, error, (value) => withParts(value, fields[fieldKey('fin')]?.trim() ?? second, 'fin'))}
          {textField('fin', 'Deuxième partie', second, error, (value) => withParts(fields[fieldKey('debut')]?.trim() ?? first, value, 'debut'))}
        </div>
      </>
    )
  }

  const tools = bankId === 'mots-outils'
  const word = item.prompt?.match(/«\s*(.*?)\s*»/u)?.[1] ?? ''
  const category = categories.includes(item.answer) ? item.answer : categories[0]!
  return (
    <div className="libre-pair">
      {!word && item.prompt && <p className="muted">{item.prompt}</p>}
      {textField('mot', 'Mot à classer', word, tools ? 'Saisissez un mot.' : 'Saisissez un mot de deux ou trois syllabes.', (value) => {
        if (!wordPattern.test(value)) return null
        if (tools) {
          const key = value.toLocaleLowerCase('fr')
          const answer = articles.has(key) ? categories[0]! : pronouns.has(key) ? categories[1]! : category
          return { prompt: `Classez « ${value} » : article ou pronom ?`, options: categories, answer }
        }
        const count = syllabifyFr(value).length
        return count === 2 || count === 3
          ? { prompt: `Combien de syllabes dans « ${value} » ?`, options: ['2', '3'], answer: String(count) } : null
      })}
      {tools && <label className="libre-field is-line">
        <span>Catégorie correcte</span>
        <select className="libre-line-input" value={category} onChange={(event) => update({ answer: event.target.value, options: categories })}>
          {categories.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>}
    </div>
  )
}

export function AlphaQuestionsEditor({ type, items, instruction, fields, writeField, onChange, onRegenerate }: {
  type: string
  items: MathItem[]
  instruction: string
  fields: Record<string, string>
  writeField: (key: string, value: string | null) => void
  onChange: (items: MathItem[], instruction: string) => void
  onRegenerate: (id?: string) => void
}) {
  const previousIds = useRef(new Set<string>())
  useEffect(() => {
    const ids = new Set(items.flatMap(({ libreId }) => libreId ? [libreId] : []))
    for (const id of previousIds.current) {
      if (ids.has(id)) continue
      for (const key of Object.keys(fields)) {
        if (key.startsWith(`${id}:alpha:`)) writeField(key, null)
      }
    }
    previousIds.current = ids
  }, [items, fields, writeField])
  const parsed = parseAlphaType(type)
  if (!parsed || !isAlphaEditableQuestionKind(parsed.kind)) return null
  const { bankId, kind } = parsed
  return (
    <div className="quad-libre-block">
      <label className="libre-field is-line">
        <span>Consigne</span>
        <textarea className="libre-line-input is-textarea" rows={2} value={instruction}
          onChange={(event) => onChange(items, event.target.value)} />
      </label>
      {items.some((item) => !item.libreLocked) && <div className="libre-unit-actions">
        <button type="button" className="button small secondary" onClick={() => onRegenerate()}>
          Régénérer les questions déverrouillées
        </button>
      </div>}
      <ul className="libre-item-list" aria-label="Questions d’alphabétisation">
        {items.map((item, index) => {
          const update = (next: MathItem) => onChange(items.map((current, position) => position === index ? next : current), instruction)
          return (
            <li key={item.libreId} className="libre-item-card is-libre-row">
              <span className="libre-item-num is-accent">{index + 1}.</span>
              <div className="libre-item-body" role="group" aria-label={`Question ${index + 1}`}>
                <QuestionFields kind={kind} bankId={bankId} item={item} fields={fields} writeField={writeField} onChange={update} />
                {kind !== 'alphabet-initiale' && !(kind === 'classer' && bankId === 'mots-outils') &&
                  <p className="muted">Corrigé <strong>{item.answer}</strong></p>}
                <div className="libre-unit-actions">
                  <button type="button" className="button small secondary" aria-pressed={Boolean(item.libreLocked)}
                    aria-label={`Verrou de la question ${index + 1}`} onClick={() => update({ ...item, libreLocked: !item.libreLocked })}>
                    {item.libreLocked ? 'Verrouillée' : 'Verrouiller'}
                  </button>
                  {!item.libreLocked && <button type="button" className="button small secondary" onClick={() => onRegenerate(item.libreId)}>Autre question</button>}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
