/**
 * TCF — Test de connaissances de français.
 * Types des exercices saisis par l’admin et stockés en JSON
 * (`src/content/tcf/{a0-a1,a1-a2,a2-b1}/{ce,co,pe,po}.json`).
 * Unions discriminées sur `competence`, `type_exercice` et `type_reponse`.
 */

export type TcfNiveau = 'A0-A1' | 'A1-A2' | 'A2-B1'
export type TcfCompetence = 'CE' | 'CO' | 'PE' | 'PO'
export type TcfTypeReponse = 'qcm_texte' | 'qcm_image' | 'lignes'

// —— Questions (CE / CO) ——

export type TcfChoixTexte = { id: string; texte: string; correct?: boolean; fixe?: boolean }
export type TcfChoixImage = { id: string; image: string; correct?: boolean; fixe?: boolean }

type TcfQuestionBase = {
  /** Énoncé affiché au-dessus de la réponse. */
  enonce: string
  /** CO six_courts / trois_moyens : n° de l’audio concerné (1-based). */
  audio?: number
}

export type TcfQuestionQcmTexte = TcfQuestionBase & {
  type_reponse: 'qcm_texte'
  /** Défaut true ; false = ordre fixe. */
  melanger?: boolean
  choix: TcfChoixTexte[]
}

export type TcfQuestionQcmImage = TcfQuestionBase & {
  type_reponse: 'qcm_image'
  melanger?: boolean
  choix: TcfChoixImage[]
}

export type TcfQuestionLignes = TcfQuestionBase & {
  type_reponse: 'lignes'
  /** Traits pleine largeur (défaut 2). */
  nb_lignes?: number
  reponse_modele?: string
}

export type TcfQuestion = TcfQuestionQcmTexte | TcfQuestionQcmImage | TcfQuestionLignes

/** Bornes de mots (production écrite). 0 = non précisé. */
export type TcfNbMots = { min?: number; max?: number }

// —— Enveloppe commune ——

type TcfBase<C extends TcfCompetence, T extends string, S> = {
  id: string
  niveau: TcfNiveau
  competence: C
  type_exercice: T
  theme?: string
  /** Consigne affichée sous le titre (sinon consigne du type). */
  consigne?: string
  support: S
  questions: TcfQuestion[]
  /** PE sms / email / question : petit bloc sous le texte. */
  consigne_supplementaire?: string | null
}

// —— CE ——

export type TcfCeSms = TcfBase<'CE', 'sms', { expediteur: string; texte: string }>
export type TcfCeEmail = TcfBase<'CE', 'email', { de: string; a: string; objet: string; texte: string }>
export type TcfCeAnnonce = TcfBase<'CE', 'annonce', { titre: string; texte: string; image: string | null }>
export type TcfCeExercise = TcfCeSms | TcfCeEmail | TcfCeAnnonce

// —— CO ——

export type TcfImageACocher = { id: string; image: string; correct: boolean; fixe?: boolean }

export type TcfCoImages = TcfBase<'CO', 'images_a_reconnaitre', { audio: string }> & {
  melanger?: boolean
  /** par_image : 1 point par image juste ; tout_ou_rien : les 5 justes. */
  score?: 'par_image' | 'tout_ou_rien'
  /** Exactement 5 images. */
  images: TcfImageACocher[]
}
export type TcfCoSixCourts = TcfBase<'CO', 'six_courts', { audios: string[] }>
export type TcfCoTroisMoyens = TcfBase<'CO', 'trois_moyens', { audios: string[] }>
export type TcfCoComplet = TcfBase<'CO', 'complet', { audio: string; transcription: string }>
export type TcfCoExercise = TcfCoImages | TcfCoSixCourts | TcfCoTroisMoyens | TcfCoComplet

// —— PE ——

export type TcfChampType = 'texte' | 'date' | 'choix' | 'case'
export type TcfChampFormulaire = {
  label: string
  type: TcfChampType
  /** Type « choix » : options proposées (cases à cocher). */
  options?: string[]
  /** Réponse attendue (corrigé). */
  corrige: string
}

export type TcfPeFormulaire = TcfBase<'PE', 'formulaire', { titre?: string; champs: TcfChampFormulaire[] }>
export type TcfPeImageQuestion = TcfBase<
  'PE',
  'image_question',
  { image: string; consigne: string; nb_mots: TcfNbMots; reponse_modele?: string }
>
export type TcfPeSmsReponse = TcfBase<
  'PE',
  'sms_reponse',
  { expediteur?: string; sms_recu: string; consigne: string; nb_mots: TcfNbMots; reponse_modele?: string }
>
export type TcfPeEmailReponse = TcfBase<
  'PE',
  'email_reponse',
  {
    email_recu: { de: string; objet: string; texte: string }
    consigne: string
    nb_mots: TcfNbMots
    reponse_modele?: string
  }
>
export type TcfPeQuestionTexte = TcfBase<
  'PE',
  'question_texte',
  { consigne: string; nb_mots: TcfNbMots; reponse_modele?: string }
>
export type TcfPeExercise =
  | TcfPeFormulaire
  | TcfPeImageQuestion
  | TcfPeSmsReponse
  | TcfPeEmailReponse
  | TcfPeQuestionTexte

// —— PO ——

export type TcfRepliqueLocuteur = 'examinateur' | 'eleve'
export type TcfReplique = { locuteur: TcfRepliqueLocuteur; texte: string; variantes?: string[] }

export type TcfPoMotsTheme = TcfBase<
  'PO',
  'mots_theme',
  { theme: string; mots: string[]; exemples_questions: string[] }
>
export type TcfPoSequence = TcfBase<'PO', 'sequence_4_images', { images: string[]; reponse_modele: string }>
export type TcfPoImageUnique = TcfBase<'PO', 'image_unique', { image: string; reponse_modele: string }>
export type TcfPoDialogue = TcfBase<'PO', 'dialogue', { situation: string; repliques: TcfReplique[] }>
export type TcfPoExercise = TcfPoMotsTheme | TcfPoSequence | TcfPoImageUnique | TcfPoDialogue

export type TcfExercise = TcfCeExercise | TcfCoExercise | TcfPeExercise | TcfPoExercise
export type TcfTypeExercice = TcfExercise['type_exercice']

// —— Items rendus sur la fiche A4 (après tirage / mélange) ——

export type TcfChoixRendu = { lettre: string; texte?: string; image?: string; correct: boolean }

export type TcfSheetItem =
  | { kind: 'support'; exercise: TcfExercise }
  | {
      kind: 'qcm'
      numero: number
      enonce: string
      mode: 'texte' | 'image'
      choix: TcfChoixRendu[]
      audioLabel?: string
    }
  | {
      kind: 'lignes'
      numero: number
      enonce: string
      nbLignes: number
      reponseModele?: string
      audioLabel?: string
    }
  | {
      kind: 'images_a_cocher'
      numero: number
      consigne: string
      score: 'par_image' | 'tout_ou_rien'
      images: Array<{ id: string; image: string; correct: boolean }>
    }
  | { kind: 'formulaire'; titre?: string; champs: TcfChampFormulaire[] }
  | {
      kind: 'ecriture'
      consigneSupplementaire?: string
      nbMots: TcfNbMots
      nbLignes: number
      reponseModele?: string
    }
  | { kind: 'dialogue'; situation: string; repliques: TcfReplique[] }
  | { kind: 'vide'; message: string }
  | { kind: 'informations'; niveau: TcfNiveau }
