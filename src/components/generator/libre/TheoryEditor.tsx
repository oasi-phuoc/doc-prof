import type { GrammarTheoryBlock, TheoryImageCell } from '@/francais/grammar-theory'
import { mathGlossaryBank, type GlossaryFigureId } from '@/math/glossary-banks'
import type { MathItem } from '@/math/types'
import { ImageField } from '@/tcf/fields'
import { SelectBox } from '../SelectBox'

const labels: Record<GrammarTheoryBlock['kind'], string> = {
  section: 'Section', image: 'Image', 'image-row': 'Images', practice: 'Phrases à compléter', heading: 'Titre',
  paragraph: 'Paragraphe', note: 'Note', rule: 'Règle', examples: 'Exemples',
  tab: 'Colonnes de texte', list: 'Liste', table: 'Tableau', attention: 'Attention',
  astuce: 'Astuce', notice: 'Consigne', page: 'Saut de page',
}

function TextField({ label, value, onChange, multiline = false }: {
  label: string
  value: string
  onChange: (text: string) => void
  multiline?: boolean
}) {
  return (
    <label className="libre-field is-line">
      <span>{label}</span>
      {multiline ? (
        <textarea className="libre-line-input is-textarea" rows={3} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="libre-line-input" type="text" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function replaceAt<T>(items: T[], index: number, item: T): T[] {
  return items.map((current, position) => position === index ? item : current)
}

function ImageFields({ image, onChange, description }: {
  image: TheoryImageCell
  onChange: (patch: Partial<TheoryImageCell>) => void
  description?: boolean
}) {
  return (
    <>
      <ImageField durable label="Illustration" value={image.src} onChange={(src) => onChange({ src })} />
      <TextField label="Texte alternatif" value={image.alt} onChange={(alt) => onChange({ alt })} />
      <TextField label="Légende" value={image.caption} onChange={(caption) => onChange({ caption })} />
      {description && <TextField label="Description" value={image.description ?? ''} onChange={(text) => onChange({ description: text })} />}
      {description && <TextField label="Phrase de la scène" value={image.example ?? ''} onChange={(example) => onChange({ example })} />}
    </>
  )
}

function BlockFields({ block, update }: { block: GrammarTheoryBlock; update: (next: GrammarTheoryBlock) => void }) {
  switch (block.kind) {
    case 'section':
      return block.blocks.map((child, index) => (
        <BlockEditor key={index} block={child} index={index} update={(next) => update({ ...block, blocks: replaceAt(block.blocks, index, next) })} />
      ))
    case 'image':
      return <ImageFields image={block} onChange={(patch) => update({ ...block, ...patch })} />
    case 'image-row':
      return (
        <>
          <TextField label="Titre des illustrations" value={block.label} onChange={(label) => update({ ...block, label })} />
          {block.cells.map((cell, index) => (
            <fieldset key={index}>
              <legend>Illustration {index + 1}</legend>
              <ImageFields image={cell} description onChange={(patch) => update({ ...block, cells: replaceAt(block.cells, index, { ...cell, ...patch }) })} />
            </fieldset>
          ))}
        </>
      )
    case 'table':
    case 'tab':
      return (
        <>
          {block.kind === 'table' && block.headers.map((header, index) => (
            <TextField key={index} label={`En-tête ${index + 1}`} value={header} onChange={(text) => update({ ...block, headers: replaceAt(block.headers, index, text) })} />
          ))}
          {block.rows.map((row, index) => (
            <fieldset key={index}>
              <legend>Ligne {index + 1}</legend>
              {row.map((cell, column) => (
                <TextField key={column} label={`Colonne ${column + 1}`} value={cell} onChange={(text) => update({ ...block, rows: replaceAt(block.rows, index, replaceAt(row, column, text)) })} />
              ))}
            </fieldset>
          ))}
        </>
      )
    case 'practice':
      return (
        <>
          <TextField label="Consigne" value={block.instruction} onChange={instruction => update({ ...block, instruction })} />
          {block.items.map((item, index) => {
            const edit = (patch: Partial<typeof item>) => update({ ...block, items: replaceAt(block.items, index, { ...item, ...patch }) })
            return <fieldset key={index}>
              <legend>Phrase {index + 1}</legend>
              <TextField label="Phrase avec ___" value={item.prompt} onChange={prompt => edit({ prompt })} />
              <TextField label="Mot attendu" value={item.answer} onChange={answer => edit({ answer })} />
              <TextField label="Explication du corrigé" value={item.explanation} onChange={explanation => edit({ explanation })} />
            </fieldset>
          })}
        </>
      )
    case 'list':
      return (
        <>
          <TextField label="Titre de la liste" value={block.title ?? ''} onChange={(title) => update({ ...block, title })} />
          {block.items.map((item, index) => (
            <TextField key={index} label={`Élément ${index + 1}`} value={item} onChange={(text) => update({ ...block, items: replaceAt(block.items, index, text) })} />
          ))}
        </>
      )
    case 'examples':
      return block.items.map((item, index) => (
        <TextField key={index} label={`Exemple ${index + 1}`} value={typeof item === 'string' ? item : item.text}
          onChange={(text) => update({ ...block, items: replaceAt(block.items, index, typeof item === 'string' ? text : { ...item, text }) })} />
      ))
    case 'rule':
      return (
        <>
          <TextField label="Règle" value={block.text} onChange={(text) => update({ ...block, text })} multiline />
          {block.examples?.map((example, index) => (
            <TextField key={index} label={`Exemple ${index + 1}`} value={example.correct}
              onChange={(correct) => update({ ...block, examples: replaceAt(block.examples ?? [], index, { ...example, correct }) })} />
          ))}
        </>
      )
    case 'page':
      return null
    default:
      return <TextField label={labels[block.kind]} value={block.text} onChange={(text) => update({ ...block, text })} multiline={block.kind !== 'heading'} />
  }
}

function BlockEditor({ block, index, update }: { block: GrammarTheoryBlock; index: number; update: (next: GrammarTheoryBlock) => void }) {
  return (
    <details className="libre-theory-block" open={index === 0}>
      <summary>{labels[block.kind]} {index + 1}</summary>
      <BlockFields block={block} update={update} />
    </details>
  )
}

type MathLesson = NonNullable<MathItem['mathTheory']>
type MathGlossary = NonNullable<MathItem['glossary']>

function MathTheoryFields({ lesson, update }: { lesson: MathLesson; update: (patch: Partial<MathLesson>) => void }) {
  return (
    <>
      <TextField label="Titre" value={lesson.title} onChange={(title) => update({ title })} />
      <TextField label="Titre de l’explication" value={lesson.heading ?? ''} onChange={(heading) => update({ heading })} />
      <TextField label="Objectif" value={lesson.goal} onChange={(goal) => update({ goal })} multiline />
      <TextField label="Exemple" value={lesson.example} onChange={(example) => update({ example })} multiline />
      <label>
        <input type="checkbox" checked={!lesson.hideVisual} onChange={(event) => update({ hideVisual: !event.target.checked })} />
        Afficher le schéma
      </label>
      {!lesson.hideVisual && (
        <>
          <ImageField durable label="Schéma personnalisé" value={lesson.visualSrc ?? ''} onChange={(visualSrc) => update({ visualSrc })} />
          {lesson.visualSrc && (
            <button type="button" onClick={() => update({ visualSrc: undefined })}>Rétablir le schéma d’origine</button>
          )}
          <TextField label="Texte alternatif du schéma" value={lesson.visualAlt} onChange={(visualAlt) => update({ visualAlt })} />
        </>
      )}
      <fieldset>
        <legend>Les mots</legend>
        {lesson.words.map(([word, definition, role], index) => (
          <div key={index}>
            <TextField label={`Mot ${index + 1}`} value={word} onChange={(text) => update({ words: replaceAt(lesson.words, index, [text, definition, role]) })} />
            <TextField label={`Définition ${index + 1}`} value={definition} onChange={(text) => update({ words: replaceAt(lesson.words, index, [word, text, role]) })} multiline />
          </div>
        ))}
      </fieldset>
      <fieldset>
        <legend>Les étapes</legend>
        {lesson.steps.map((step, index) => (
          <TextField key={index} label={`Étape ${index + 1}`} value={step} onChange={(text) => update({ steps: replaceAt(lesson.steps, index, text) })} multiline />
        ))}
      </fieldset>
    </>
  )
}

export function TheoryEditor({ exerciseType, items, onChange }: {
  exerciseType: string
  items: MathItem[]
  onChange: (items: MathItem[]) => void
}) {
  const glossaryBank = mathGlossaryBank(exerciseType)
  const figures = new Map<GlossaryFigureId, string>()
  for (const { id, figure, term } of glossaryBank ?? []) {
    if (id === figure || !figures.has(figure)) figures.set(figure, term)
  }
  return (
    <div className="quad-libre-block" aria-label="Contenu de la théorie">
      <b>Contenu de la théorie</b>
      {items.map((item, index) => {
        if (item.mathTheory) {
          const lesson = item.mathTheory
          return (
            <details className="libre-theory-block" key={item.libreId ?? index} open={index === 0}>
              <summary>{lesson.title || 'Leçon'}</summary>
              <MathTheoryFields lesson={lesson} update={(patch) => onChange(replaceAt(items, index, { ...item, mathTheory: { ...lesson, ...patch } }))} />
            </details>
          )
        }
        if (item.glossary && glossaryBank) {
          const entry = item.glossary
          const name = entry.term || `Notion ${index + 1}`
          function update(patch: Partial<MathGlossary>) {
            const glossary = { ...entry, ...patch }
            onChange(replaceAt(items, index, { ...item, glossary, prompt: glossary.term, answer: glossary.definition }))
          }
          function move(to: number) {
            onChange(replaceAt(replaceAt(items, index, items[to]!), to, item))
          }
          return (
            <details className="libre-theory-block" key={item.libreId ?? entry.sourceId ?? index} open={index === 0}>
              <summary>{name}</summary>
              <TextField label="Notion" value={entry.term} onChange={(term) => update({ term })} />
              <TextField label="Définition" value={entry.definition} onChange={(definition) => update({ definition })} multiline />
              <TextField label="Exemple" value={entry.example ?? ''} onChange={(example) => update({ example })} multiline />
              <SelectBox label="Schéma" value={entry.figure} onChange={(figure) => update({ figure })}>
                <option value="">Sans schéma</option>
                {[...figures].map(([figure, label]) => <option key={figure} value={figure}>{label}</option>)}
              </SelectBox>
              {items.length > 1 && (
                <div>
                  <button type="button" disabled={index === 0} aria-label={`Monter la notion ${name}`} onClick={() => move(index - 1)}>Monter</button>
                  <button type="button" disabled={index === items.length - 1} aria-label={`Descendre la notion ${name}`} onClick={() => move(index + 1)}>Descendre</button>
                </div>
              )}
            </details>
          )
        }
        const entry = item.logistiqueGlossaryEntry
        if (entry && item.theoryBlock?.kind === 'paragraph') {
          const paragraph = item.theoryBlock
          function update(term: string, definition: string) {
            onChange(replaceAt(items, index, {
              ...item,
              logistiqueGlossaryEntry: { term, definition },
              theoryBlock: { ...paragraph, text: `{g}${term}{/g} — ${definition}` },
            }))
          }
          return (
            <details className="libre-theory-block" key={item.libreId ?? index} open={index === 0}>
              <summary>{entry.term || `Notion ${index + 1}`}</summary>
              <TextField label="Notion" value={entry.term} onChange={(term) => update(term, entry.definition)} />
              <TextField label="Définition" value={entry.definition} onChange={(definition) => update(entry.term, definition)} multiline />
            </details>
          )
        }
        return item.theoryBlock && (
          <BlockEditor key={item.libreId ?? index} block={item.theoryBlock} index={index}
            update={(theoryBlock) => onChange(replaceAt(items, index, { ...item, theoryBlock }))} />
        )
      })}
    </div>
  )
}
