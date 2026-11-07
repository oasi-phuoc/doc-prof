import ARTWORKS from './content/ce-art.json'
import FORMATS from './content/ce-document-formats.json'
import type { TcfCeExercise } from './types'

export type CeArtwork = { id: string; label: string; src: string; sourceKey: string; genre: string; engine: 'imagegen' | 'document-render'; fontFamily?: string; fontHash?: string; width: number; height: number }
export const CE_ARTWORKS: CeArtwork[] = ARTWORKS as CeArtwork[]
const formats: Record<string, { genre: string }> = FORMATS
export function ceArtKey(ex: TcfCeExercise): string {
  return JSON.stringify({ support: ex.support, scene: ex.scene, theme: ex.theme })
}
/** Une modification du texte ne doit jamais afficher une ancienne image contenant d’autres informations. */
export function ceArtFor(ex: TcfCeExercise): CeArtwork | undefined {
  return CE_ARTWORKS.find((art) => art.id === ex.id && art.sourceKey === ceArtKey(ex) && art.genre === formats[ex.id]?.genre)
}
