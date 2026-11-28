export type AcmTheme =
  | 'origami'
  | 'peinture'
  | 'collage'
  | 'dessin'
  | 'quilling'
  | 'paper-layering'
  | 'cartes-pop-up'
  | 'pate-a-sel'
  | 'creations-saisonnieres'
  | 'perspective-espace'
  | 'ombrage-volume-lumiere'
  | 'paysage-papier-dechire'

export type AcmFoldArrow = {
  from: readonly [x: number, y: number]
  to: readonly [x: number, y: number]
  ratio: number
}

export type AcmStepImage =
  | { src: string; alt: string; nextFold?: AcmFoldArrow }
  | { src?: never; brief: string }

export type AcmActivity = {
  id: string
  theme: AcmTheme
  title: string
  description: string
  minutes: number
  materials: string[]
  steps: string[]
  stepImages?: AcmStepImage[]
}

export function isAcmType(typeId: string): boolean {
  return typeId.startsWith('acm-')
}
