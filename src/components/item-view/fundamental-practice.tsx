import { DECIMAL_LINE_PRACTICE, LENGTH_PRACTICE, PLACE_VALUE_PRACTICE, SHAPE_PRACTICE } from '@/math/fundamental-practice'
import type { MathItem } from '@/math/types'
import zeroExample from '@/math/media/theory/falc/numeration-zero.png'
import decimalExample from '@/math/media/theory/falc/decimaux-droite.png'
import shapeExample from '@/math/media/theory/falc/figures-classer.png'
import lengthExample from '@/math/media/theory/falc/mesures-melangees.png'

const examples: Readonly<Record<string, { image: string; alt: string; steps: string[] } | undefined>> = {
  [PLACE_VALUE_PRACTICE]: { image: zeroExample, alt: '4 centaines, 0 dizaine et 6 unités', steps: ['La colonne des dizaines est vide.', 'J’écris 0. Je lis 406.'] },
  [DECIMAL_LINE_PRACTICE]: { image: decimalExample, alt: 'De 2 à 3, avec une flèche au quatrième trait après 2', steps: ['Un pas vaut 0,1.', 'Je compte 4 pas après 2. Je lis 2,4.'] },
  [SHAPE_PRACTICE]: { image: shapeExample, alt: 'Un triangle, un rectangle et un carré tourné', steps: ['Je compte les côtés.', 'Un carré tourné garde ses 4 côtés égaux.'] },
  [LENGTH_PRACTICE]: { image: lengthExample, alt: 'Une bande de 3 cm suivie d’une petite bande de 4 mm', steps: ['3 cm valent 30 mm.', '30 mm + 4 mm = 34 mm.'] },
}

export function FundamentalExample({ exerciseType }: { exerciseType: string }) {
  const example = examples[exerciseType]
  if (!example) return null
  return (
    <figure className="math-worked-example math-fundamental-example">
      <img src={example.image} alt={example.alt} />
      <figcaption>
        <strong>Exemple</strong>
        {example.steps.map((step) => <p key={step}>{step}</p>)}
      </figcaption>
    </figure>
  )
}

export function FundamentalShape({ shape }: { shape: NonNullable<MathItem['shapePractice']> }) {
  const outlines = {
    triangle: { points: '18,88 63,18 111,88', label: '3 côtés' },
    carre: { points: '31,25 97,25 97,91 31,91', label: '4 côtés égaux et 4 angles droits' },
    rectangle: { points: '16,36 112,36 112,80 16,80', label: 'deux côtés longs, deux courts et 4 angles droits' },
  }
  const { points, label } = outlines[shape.kind]
  return (
    <svg className="math-fundamental-shape" viewBox="0 0 128 116" role="img" aria-label={`Figure avec ${label}.`}>
      <polygon points={points} transform={`rotate(${shape.angle} 64 58)`} />
    </svg>
  )
}

export function FundamentalLength({ length }: { length: NonNullable<MathItem['lengthPractice']> }) {
  return (
    <div className="math-fundamental-length" role="img" aria-label={`Deux longueurs, ${length.cm} cm puis ${length.mm} mm.`}>
      <span style={{ flexGrow: length.cm * 10 }}>{length.cm} cm</span>
      <span style={{ flexGrow: length.mm }}>{length.mm} mm</span>
    </div>
  )
}
