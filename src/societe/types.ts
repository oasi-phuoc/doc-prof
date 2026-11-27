export type SocieteNiveau = 'A1' | 'A2' | 'B1'

export type SocieteImage = {
  src: string
  alt: string
  caption: string
}

export type SocieteQuestion = {
  prompt: string
  answer: string
  options?: readonly [string, string] | readonly [string, string, string]
}

export type SocieteProduction = {
  consigne: string
  actions: readonly string[]
  exemple: string
}

export type SocieteSupport =
  | { kind: 'document'; titre: string; lignes: readonly string[]; image?: SocieteImage }
  | { kind: 'ecoute'; transcription: string; audioSrc: string }
  | { kind: 'production'; production: SocieteProduction; lignes: number }

export type SocieteUnite = {
  id: string
  niveau: SocieteNiveau
  titre: string
  objectif: string
  situation: string
  explication: readonly string[]
  lexique: readonly (readonly [string, string])[]
  image?: SocieteImage
  tableau?: { entetes: string[]; lignes: string[][] }
  document: { titre: string; lignes: readonly string[]; image?: SocieteImage; questions: readonly SocieteQuestion[] }
  ecoute: { transcription: string; questions: readonly SocieteQuestion[] }
  oral: SocieteProduction
  ecrit: SocieteProduction
}

export function isSocieteType(typeId: string): boolean {
  return typeId.startsWith('societe-')
}

export function isSocieteTheoryType(typeId: string): boolean {
  return isSocieteType(typeId) && (typeId.endsWith('-theorie') || typeId.startsWith('societe-suisse-theorie-'))
}
