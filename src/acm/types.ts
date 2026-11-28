export type AcmActivity = {
  id: string
  theme: 'origami' | 'peinture' | 'collage' | 'dessin'
  title: string
  description: string
  minutes: number
  materials: string[]
  steps: string[]
  stepImages?: Array<{ src: string; alt: string }>
}

export function isAcmType(typeId: string): boolean {
  return typeId.startsWith('acm-')
}
