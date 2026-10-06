import { TCF_TYPES } from './catalog'
import { tcfAudioSrc, tcfImageSrc } from './media'
import { TCF_IMAGES_A_COCHER, TCF_QCM_MAX, TCF_QCM_MIN } from './templates'
import type { TcfExercise, TcfQuestion } from './types'

export type TcfValidation = { errors: string[]; warnings: string[] }

const NIVEAUX = new Set(['A0-A1', 'A1-A2', 'A2-B1'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Contrôle structurel d’un objet JSON brut (chargement des banques).
 * Vérifie l’enveloppe ; le détail est contrôlé par `validateTcfExercise`.
 */
export function isTcfExerciseShape(raw: unknown): raw is TcfExercise {
  if (!isRecord(raw)) return false
  if (typeof raw.id !== 'string' || !NIVEAUX.has(String(raw.niveau))) return false
  const known = TCF_TYPES.some(
    (meta) => meta.competence === raw.competence && meta.typeExercice === raw.type_exercice,
  )
  if (!known || !isRecord(raw.support) || !Array.isArray(raw.questions)) return false
  if (raw.type_exercice === 'images_a_reconnaitre' && !Array.isArray(raw.images)) return false
  return true
}

const blank = (value: string | null | undefined) => !value || !value.trim()

function validateQuestion(q: TcfQuestion, label: string, errors: string[]) {
  if (blank(q.enonce)) errors.push(`${label} : l’énoncé est vide.`)
  if (q.type_reponse === 'lignes') {
    const n = q.nb_lignes ?? 2
    if (!Number.isInteger(n) || n < 1 || n > 12) errors.push(`${label} : nombre de lignes entre 1 et 12.`)
    return
  }
  const choix = q.choix
  if (choix.length < TCF_QCM_MIN || choix.length > TCF_QCM_MAX) {
    errors.push(`${label} : un QCM a ${TCF_QCM_MIN} ou ${TCF_QCM_MAX} choix (actuellement ${choix.length}).`)
  }
  const ids = choix.map((c) => c.id)
  if (new Set(ids).size !== ids.length) errors.push(`${label} : identifiants de choix en double.`)
  const nbCorrect = choix.filter((c) => c.correct === true).length
  if (nbCorrect !== 1) errors.push(`${label} : exactement une bonne réponse (actuellement ${nbCorrect}).`)
  const contents = q.type_reponse === 'qcm_texte' ? q.choix.map((c) => c.texte) : q.choix.map((c) => c.image)
  contents.forEach((content, i) => {
    const empty = blank(content)
    if (empty) {
      errors.push(`${label}, choix ${i + 1} : ${q.type_reponse === 'qcm_texte' ? 'texte' : 'image'} manquant(e).`)
    }
  })
}

/** Validation complète (bloquante = errors ; non bloquante = warnings). */
export function validateTcfExercise(ex: TcfExercise): TcfValidation {
  const errors: string[] = []
  const warnings: string[] = []
  if (blank(ex.id)) errors.push('Identifiant manquant.')

  const usesQuestions =
    ex.competence === 'CE' || (ex.competence === 'CO' && ex.type_exercice !== 'images_a_reconnaitre')
  if (usesQuestions) {
    if (ex.questions.length === 0) errors.push('Ajoutez au moins une question.')
    ex.questions.forEach((q, i) => validateQuestion(q, `Question ${i + 1}`, errors))
  }

  switch (ex.type_exercice) {
    case 'sms':
      if (blank(ex.support.texte)) errors.push('Le texte du SMS est vide.')
      break
    case 'email':
      if (blank(ex.support.objet)) errors.push('L’objet de l’e-mail est vide.')
      if (blank(ex.support.texte)) errors.push('Le texte de l’e-mail est vide.')
      break
    case 'annonce':
      if (blank(ex.support.titre) && blank(ex.support.texte)) errors.push('Titre ou texte de l’annonce requis.')
      break
    case 'images_a_reconnaitre': {
      if (blank(ex.support.audio)) errors.push('Audio manquant.')
      if (ex.images.length !== TCF_IMAGES_A_COCHER) {
        errors.push(`Exactement ${TCF_IMAGES_A_COCHER} images (actuellement ${ex.images.length}).`)
      }
      const ids = ex.images.map((img) => img.id)
      if (new Set(ids).size !== ids.length) errors.push('Identifiants d’images en double.')
      ex.images.forEach((img, i) => {
        if (typeof img.correct !== 'boolean') errors.push(`Image ${i + 1} : « correct » doit être vrai ou faux.`)
        if (blank(img.image)) errors.push(`Image ${i + 1} manquante.`)
      })
      const coches = ex.images.filter((img) => img.correct).length
      if (coches === 0 || coches === ex.images.length) {
        warnings.push(`${coches} image(s) à cocher sur ${ex.images.length} : vérifiez que c’est voulu.`)
      }
      break
    }
    case 'six_courts':
    case 'trois_moyens': {
      const attendu = ex.type_exercice === 'six_courts' ? 6 : 3
      if (ex.support.audios.length !== attendu) errors.push(`${attendu} audios attendus.`)
      ex.support.audios.forEach((a, i) => {
        if (blank(a)) errors.push(`Audio ${i + 1} manquant.`)
      })
      ex.questions.forEach((q, i) => {
        if (q.audio != null && (q.audio < 1 || q.audio > attendu)) {
          errors.push(`Question ${i + 1} : n° d’audio entre 1 et ${attendu}.`)
        }
      })
      break
    }
    case 'complet':
      if (blank(ex.support.audio)) errors.push('Audio manquant.')
      break
    case 'formulaire':
      if (ex.support.champs.length === 0) errors.push('Ajoutez au moins un champ.')
      ex.support.champs.forEach((c, i) => {
        if (blank(c.label)) errors.push(`Champ ${i + 1} : libellé vide.`)
        if (c.type === 'choix' && (c.options ?? []).filter((o) => o.trim()).length < 2) {
          errors.push(`Champ ${i + 1} : au moins 2 options pour un choix.`)
        }
      })
      break
    case 'image_question':
      if (blank(ex.support.image)) errors.push('Image manquante.')
      if (blank(ex.support.consigne)) errors.push('Question / consigne vide.')
      break
    case 'sms_reponse':
      if (blank(ex.support.sms_recu)) errors.push('Le SMS reçu est vide.')
      if (blank(ex.support.consigne)) errors.push('La consigne est vide.')
      break
    case 'email_reponse':
      if (blank(ex.support.email_recu.texte)) errors.push('L’e-mail reçu est vide.')
      if (blank(ex.support.consigne)) errors.push('La consigne est vide.')
      break
    case 'question_texte':
      if (blank(ex.support.consigne)) errors.push('La question est vide.')
      break
    case 'mots_theme':
      if (blank(ex.support.theme) && ex.support.mots.every((m) => blank(m))) {
        errors.push('Thème ou mots requis.')
      }
      break
    case 'sequence_4_images':
      if (ex.support.images.length !== 4) errors.push('Exactement 4 images.')
      ex.support.images.forEach((img, i) => {
        if (blank(img)) errors.push(`Image ${i + 1} manquante.`)
      })
      break
    case 'image_unique':
      if (blank(ex.support.image)) errors.push('Image manquante.')
      break
    case 'dialogue':
      if (blank(ex.support.situation)) errors.push('La situation est vide.')
      if (!ex.support.repliques.some((r) => r.locuteur === 'eleve')) {
        errors.push('Au moins une réplique de l’élève.')
      }
      ex.support.repliques.forEach((r, i) => {
        if (blank(r.texte)) errors.push(`Réplique ${i + 1} vide.`)
      })
      break
  }

  if ('nb_mots' in ex.support) {
    const { min = 0, max = 0 } = ex.support.nb_mots
    if (min < 0 || max < 0 || (max > 0 && min > max)) errors.push('Nombre de mots : min ≤ max.')
  }
  return { errors, warnings }
}

/** Tous les médias référencés (images et audios), chemins résolus. */
export function tcfMediaPaths(ex: TcfExercise): string[] {
  const images: string[] = []
  const audios: string[] = []
  ex.questions.forEach((q) => {
    if (q.type_reponse === 'qcm_image') q.choix.forEach((c) => images.push(c.image))
  })
  switch (ex.type_exercice) {
    case 'annonce':
      if (ex.support.image) images.push(ex.support.image)
      break
    case 'images_a_reconnaitre':
      audios.push(ex.support.audio)
      ex.images.forEach((img) => images.push(img.image))
      break
    case 'six_courts':
    case 'trois_moyens':
      audios.push(...ex.support.audios)
      break
    case 'complet':
      audios.push(ex.support.audio)
      break
    case 'image_question':
    case 'image_unique':
      images.push(ex.support.image)
      break
    case 'sequence_4_images':
      images.push(...ex.support.images)
      break
    default:
      break
  }
  return [...images.map(tcfImageSrc), ...audios.map(tcfAudioSrc)].filter(
    (src) => src && !src.startsWith('data:'),
  )
}

/** Vérifie que les fichiers référencés existent (requête HEAD). */
export async function checkTcfMedia(ex: TcfExercise): Promise<string[]> {
  const paths = [...new Set(tcfMediaPaths(ex))]
  const missing = await Promise.all(
    paths.map(async (path) => {
      try {
        const res = await fetch(path, { method: 'HEAD' })
        const type = res.headers.get('content-type') ?? ''
        // Le serveur de dev renvoie index.html pour un fichier absent.
        return res.ok && !type.includes('text/html') ? null : path
      } catch {
        return path
      }
    }),
  )
  return missing.filter((p): p is string => p != null).map((p) => `Fichier introuvable : ${p}`)
}
