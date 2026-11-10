import { buildPage } from '@/math/generate'
import { createRng, shuffle } from '@/math/rng'
import type { FicheRecipe } from '@/fiches/recipe'
import type { MathItem } from '@/math/types'
import type { TcfCadreQuestion, TcfSheetItem } from '@/tcf/types'
import type { Choice, Game, Question } from './types'
import { canonicalJson, deriveSeed, hash } from './seeds'
export { hash } from './seeds'
const normalized = (s: string) =>
  s
    .normalize('NFKC')
    .replace(/[\s\u202f]/g, '')
    .toLowerCase()
const numeric = (s: string) =>
  Number(s.replace(/[\s\u202f]/g, '').replace(',', '.'))

/** Integer distractors only: deterministic, unique, bounded and verified. */
export function numberChoices(
  value: number,
  seed: number,
  unit = '',
  distractors?: number[],
): { choices: Choice[]; correctId: string } {
  if (!Number.isSafeInteger(value))
    throw new Error('Réponse numérique non entière')
  const candidates = [
    value,
    ...(distractors ?? [
      value + 1,
      value - 1,
      value + 10,
      value - 10,
      value + 100,
    ]),
  ]
  const distinct = [...new Set(candidates)].filter(
    (n) => Number.isSafeInteger(n) && (value < 0 || n >= 0),
  )
  const rng = createRng(seed)
  const ordered = shuffle(rng, [value, ...shuffle(rng, distinct.filter((n) => n !== value)).slice(0, 5)])
  return {
    choices: ordered.map((n) => ({
      id: `n${n}`,
      text: `${n.toLocaleString('fr-CH')}${unit ? ` ${unit}` : ''}`,
    })),
    correctId: `n${value}`,
  }
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {}
}
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : []

export function convertRecipe(
  recipe: FicheRecipe,
  title = 'Séance collective',
): Game {
  const game: Game = {
    id: `g${hash(canonicalJson(recipe))}`,
    seed: recipe.seed,
    title,
    questions: [],
    corrections: {},
    issues: [],
  }
  if (recipe.bookKind) {
    game.issues.push({
      source: 'Dossier complet',
      reason:
        'Les livres complets ne sont pas encore convertis. Ouvrez une fiche individuelle pour jouer.',
    })
    return game
  }
  let exerciseNo = 1
  recipe.pages.forEach((config, pageIndex) => {
    try {
      // Same source seed as buildWorksheets; convert before its print pagination.
      const page = buildPage(
        config,
        recipe.seed + pageIndex * 7919,
        exerciseNo,
        recipe.seed,
      )
      exerciseNo += page.blocks.length
      page.blocks.forEach((block, blockIndex) => {
        const support = block.items.find((i) => i.tcf?.kind === 'support')?.tcf
        const exercise =
          support?.kind === 'support' ? support.exercise : undefined
        const media = record(exercise?.support)
        const context =
          typeof media.texte === 'string' ? media.texte : block.document?.text
        const sharedAudio =
          typeof media.audio === 'string'
            ? media.audio
            : block.document?.audioSrc
        block.items.forEach((item, itemIndex) => {
          const base = (part = 0): Question => ({
            id: `p${pageIndex}b${blockIndex}i${itemIndex}s${part}-${hash(`${recipe.seed}:${block.exerciseType}:${canonicalJson(item)}`)}`,
            source: {
              page: pageIndex,
              block: blockIndex,
              item: itemIndex,
              part,
              exerciseType: block.exerciseType,
            },
            title: block.title,
            instruction: block.instruction,
            prompt: item.prompt ?? '',
            context,
            audio: item.audioSrc ?? sharedAudio,
            images: [],
            choices: [],
            mode: 'choice',
            compatibility: 'auto',
          })
          const reject = (reason: string) =>
            game.issues.push({
              source: `${pageIndex + 1}/${blockIndex + 1}/${itemIndex + 1} ${block.exerciseType}`,
              reason,
            })
          const add = (q: Question, text: string, choiceId?: string) => {
            if (!q.prompt.trim()) {
              reject('Énoncé absent : adaptation nécessaire.')
              return
            }
            if (
              q.mode === 'choice' &&
              (q.choices.length < 2 ||
                q.choices.length > 6 ||
                q.choices.some((c) => !c.text.trim() && !c.image) ||
                new Set(
                  q.choices.map(
                    (c) => `${normalized(c.text)}|${c.image ?? ''}`,
                  ),
                ).size !== q.choices.length ||
                !choiceId ||
                !q.choices.some((c) => c.id === choiceId))
            ) {
              reject('Il faut 2 à 6 choix et une seule réponse vérifiée.')
              return
            }
            const image = (src: string) => recipe.imageOverrides?.[src] ?? src
            q.images = q.images.map(image)
            q.choices = q.choices.map((c) => ({
              ...c,
              image: c.image ? image(c.image) : undefined,
            }))
            game.questions.push(q)
            game.corrections[q.id] = { text, choiceId }
          }
          const tcfQuestion = (
            t:
              | Extract<TcfSheetItem, { kind: 'qcm' | 'lignes' }>
              | TcfCadreQuestion,
            part = 0,
            audio?: string,
          ) => {
            const q = base(part)
            q.prompt = t.enonce
            q.audio =
              audio ?? ('audioSrc' in t ? t.audioSrc : undefined) ?? q.audio
            q.images = [...(t.image ? [t.image] : []), ...(t.images ?? [])]
            // The paper form can be "write" while the bank still supplies a real
            // image QCM. Preserve those images instead of turning them into text.
            const variant =
              t.formSelect?.variants.qcm_image ??
              (t.kind === 'lignes'
                ? t.formSelect?.variants.qcm_texte
                : undefined)
            const options =
              variant?.choix ?? (t.kind === 'qcm' ? t.choix : undefined)
            if (options) {
              if (options.filter((c) => c.correct).length !== 1) {
                reject('QCM sans réponse unique.')
                return
              }
              q.choices = options.map((c, i) => ({
                id: `c${i}`,
                text: c.texte ?? '',
                image: c.image,
              }))
              const index = options.findIndex((c) => c.correct)
              add(q, options[index]?.texte ?? '', `c${index}`)
            } else {
              q.mode = 'oral'
              q.compatibility = 'teacher-led'
              add(
                q,
                ('reponseModele' in t ? t.reponseModele : undefined) ??
                  item.answer ??
                  'Évaluation orale par l’enseignant.',
              )
            }
          }
          if (item.libreError) {
            reject(item.libreError)
            return
          }
          const t = item.tcf
          if (t) {
            if (t.kind === 'support') {
              if (exercise?.competence === 'PO') {
                const q = base()
                q.mode =
                  exercise.type_exercice === 'sequence_4_images'
                    ? 'sequence'
                    : 'oral'
                q.compatibility = 'teacher-led'
                q.hints = strings(media.questions).length
                  ? strings(media.questions)
                  : strings(media.exemples_questions)
                q.prompt = block.instruction
                q.images = strings(media.images)
                if (q.images.length === 4) q.mode = 'sequence'
                if (typeof media.image === 'string') q.images.push(media.image)
                if (q.mode === 'sequence')
                  q.prompt =
                    'Regardez les quatre images et racontez l’histoire.'
                if (q.images.length)
                  add(
                    q,
                    typeof media.reponse_modele === 'string'
                      ? media.reponse_modele
                      : typeof media.description_modele === 'string'
                        ? media.description_modele
                        : 'Décrire la scène et échanger avec l’enseignant.',
                  )
                else reject('Support oral à adapter pour la projection.')
              }
              return
            }
            if (t.kind === 'qcm' || t.kind === 'lignes') {
              tcfQuestion(t)
              return
            }
            if (t.kind === 'audio_cadre') {
              t.questions.forEach((question, i) =>
                tcfQuestion(question, i, t.audioSrc),
              )
              return
            }
            if (t.kind === 'ecriture') {
              const q = base()
              q.mode = 'oral'
              q.compatibility = 'teacher-led'
              q.prompt = block.instruction
              add(q, t.reponseModele ?? 'Production évaluée par l’enseignant.')
              return
            }
            reject(`Format TCF « ${t.kind} » à adapter.`)
            return
          }
          if (
            item.options &&
            ['select', 'listen-check'].includes(item.layout)
          ) {
            const q = base()
            if (item.optionAudioSrcs?.some(Boolean)) {
              reject('Choix audio individuels à adapter.')
              return
            }
            if (
              new Set(item.options.map(normalized)).size !== item.options.length
            ) {
              reject('Choix dupliqués.')
              return
            }
            const matches = item.options
              .map((c, i) =>
                normalized(c) === normalized(item.answer) ? i : -1,
              )
              .filter((i) => i >= 0)
            if (matches.length !== 1) {
              reject('Réponse du QCM non vérifiable.')
              return
            }
            q.choices = item.options.map((text, i) => ({
              id: `c${i}`,
              text,
              image: item.optionImages?.[i],
              audio: item.optionAudioSrcs?.[i],
            }))
            add(q, item.answer, `c${matches[0]}`)
            return
          }
          const result = verifiedArithmetic(item)
          if (result !== undefined) {
            const q = base()
            q.prompt = `${item.a} ${item.op} ${item.b} = ?`
            q.compatibility = 'assisted'
            const choices = numberChoices(result, deriveSeed({ originalSeed: recipe.seed, sourceKey: q.id, purpose: 'distractors' }))
            q.choices = choices.choices
            add(
              q,
              `${item.a} ${item.op} ${item.b} = ${result.toLocaleString('fr-CH')}`,
              choices.correctId,
            )
            return
          }
          if (
            item.layout === 'geo' &&
            item.figure === 'square' &&
            /aire/i.test(block.instruction + ' ' + item.prompt) &&
            item.dims?.side &&
            item.dims.side > 0
          ) {
            const area = item.dims.side ** 2
            const sourceUnit = item.answer.match(
              /(cm|mm|dm|km|m)(?:²|2)\s*$/,
            )?.[1]
            if (
              (!sourceUnit || sourceUnit === (item.dims.unit ?? 'cm')) &&
              Number.isSafeInteger(area) &&
              numeric(
                item.answer.replace(/\s*(?:cm|mm|dm|m|km)(?:²|2)\s*$/, ''),
              ) === area
            ) {
              const q = base()
              q.prompt = `Quelle est l’aire de ce carré ?`
              q.figure = { type: 'square', dims: item.dims }
              q.compatibility = 'assisted'
              const side = item.dims.side
              const choices = numberChoices(
                area,
                deriveSeed({ originalSeed: recipe.seed, sourceKey: q.id, purpose: 'distractors' }),
                `${item.dims.unit ?? 'cm'}²`,
                [
                  side,
                  side * 2,
                  side * 4,
                  side * (side - 1),
                  side * (side + 1),
                ],
              )
              q.choices = choices.choices
              add(
                q,
                `${item.dims.side} × ${item.dims.side} = ${area.toLocaleString('fr-CH')} ${item.dims.unit ?? 'cm'}²`,
                choices.correctId,
              )
              return
            }
          }
          reject(
            `Rendu « ${item.layout} » non pris en charge dans ce premier prototype.`,
          )
        })
      })
    } catch (error) {
      game.issues.push({
        source: `Page ${pageIndex + 1}`,
        reason:
          error instanceof Error ? error.message : 'Génération impossible.',
      })
    }
  })
  return game
}

function verifiedArithmetic(item: MathItem): number | undefined {
  if (
    !['inline', 'column', 'column-empty'].includes(item.layout) ||
    item.a === undefined ||
    item.b === undefined ||
    item.blankOperands ||
    (item.missing && item.missing !== 'result')
  )
    return
  const result =
    item.op === '+'
      ? item.a + item.b
      : item.op === '−'
        ? item.a - item.b
        : item.op === '×'
          ? item.a * item.b
          : NaN
  return Number.isSafeInteger(result) && numeric(item.answer) === result
    ? result
    : undefined
}
