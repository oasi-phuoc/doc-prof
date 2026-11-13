import type { MascotKind } from '../domain/mascot'
import type { AttackEffect } from './effects'

type Signature = { label: string; color: string; accent: string; motion: AttackEffect; duration: number; bend: number; scale: number; criticalHits: number }
/** A mascot's attack is fixed. These values never enter a score or a journal. */
export const SIGNATURE_ATTACKS = {
  leaf: { label: 'Feuilles dansantes', color: '#4a9857', accent: '#b5d575', motion: 'leaves', duration: 820, bend: .9, scale: .96, criticalHits: 3 },
  owl: { label: 'Plumes lunaires', color: '#9a82c9', accent: '#f0d78b', motion: 'crescent', duration: 860, bend: .85, scale: 1.02, criticalHits: 4 },
  octopus: { label: 'Nuage d’encre', color: '#6551a3', accent: '#bd8fda', motion: 'spiral', duration: 790, bend: .8, scale: 1.08, criticalHits: 5 },
  hedgehog: { label: 'Pluie de piquants', color: '#9c714f', accent: '#edcf9d', motion: 'twin', duration: 680, bend: .65, scale: .91, criticalHits: 3 },
  rabbit: { label: 'Bond lunaire', color: '#c68abb', accent: '#fff1bf', motion: 'petals', duration: 810, bend: .8, scale: 1.07, criticalHits: 4 },
  dragon: { label: 'Souffle de dragon', color: '#e27436', accent: '#ffe08b', motion: 'wave', duration: 760, bend: .7, scale: 1.12, criticalHits: 5 },
  rat: { label: 'Fromages rebondissants', color: '#e8b94d', accent: '#fff0a9', motion: 'gust', duration: 700, bend: .7, scale: .88, criticalHits: 3 },
  ox: { label: 'Charge de terre', color: '#ad7953', accent: '#ebc594', motion: 'shockwave', duration: 740, bend: .6, scale: 1.1, criticalHits: 4 },
  tiger: { label: 'Griffes de tigre', color: '#d27a33', accent: '#ffcc7d', motion: 'claws', duration: 630, bend: .7, scale: 1, criticalHits: 5 },
  snake: { label: 'Onde serpentine', color: '#6e9c54', accent: '#d0eaaa', motion: 'spiral', duration: 880, bend: .95, scale: .92, criticalHits: 3 },
  horse: { label: 'Galop d’étoiles', color: '#b77d56', accent: '#f7d787', motion: 'twin', duration: 720, bend: .8, scale: 1.04, criticalHits: 4 },
  goat: { label: 'Rafale de nuages', color: '#95acbf', accent: '#f8edd6', motion: 'vortex', duration: 910, bend: .9, scale: 1.08, criticalHits: 5 },
  monkey: { label: 'Salto de bananes', color: '#e5b949', accent: '#fff0ad', motion: 'petals', duration: 730, bend: .65, scale: .93, criticalHits: 3 },
  rooster: { label: 'Éclat de l’aube', color: '#dd7c54', accent: '#ffde7f', motion: 'shockwave', duration: 690, bend: .8, scale: .95, criticalHits: 4 },
  dog: { label: 'Patte bondissante', color: '#c79264', accent: '#fff0d0', motion: 'crescent', duration: 710, bend: .7, scale: .92, criticalHits: 5 },
  boar: { label: 'Bourrasque de terre', color: '#a88167', accent: '#e6c9a6', motion: 'gust', duration: 750, bend: .8, scale: 1.06, criticalHits: 3 },
  panda: { label: 'Choc de bambou', color: '#62976d', accent: '#c8df8a', motion: 'wave', duration: 930, bend: .9, scale: .98, criticalHits: 4 },
  fox: { label: 'Étincelles rousses', color: '#da8e54', accent: '#ffe4a1', motion: 'petals', duration: 770, bend: .9, scale: 1.01, criticalHits: 5 },
  tanuki: { label: 'Roulade de feuilles', color: '#799665', accent: '#c7ad79', motion: 'vortex', duration: 890, bend: .8, scale: .95, criticalHits: 3 },
  otter: { label: 'Ricochet de bulles', color: '#69b4c1', accent: '#d5f3ed', motion: 'gust', duration: 840, bend: .95, scale: .99, criticalHits: 4 },
  koala: { label: 'Onde d’eucalyptus', color: '#80a996', accent: '#dbe9c3', motion: 'twin', duration: 920, bend: .95, scale: .97, criticalHits: 5 },
  turtle: { label: 'Vague protectrice', color: '#62a4a3', accent: '#c2e8c6', motion: 'wave', duration: 970, bend: .95, scale: 1.06, criticalHits: 3 },
  axolotl: { label: 'Étoiles aquatiques', color: '#b997d6', accent: '#eac8ef', motion: 'petals', duration: 900, bend: .75, scale: .87, criticalHits: 4 },
  leopard: { label: 'Griffes de givre', color: '#7fb5cc', accent: '#e7f7ff', motion: 'claws', duration: 670, bend: .8, scale: 1.14, criticalHits: 5 },
  crane: { label: 'Plumes de vent', color: '#91b5c7', accent: '#f6f0dd', motion: 'crescent', duration: 870, bend: .95, scale: 1.11, criticalHits: 3 },
  cat: { label: 'Patte porte-bonheur', color: '#d9ac55', accent: '#f8df9d', motion: 'shockwave', duration: 800, bend: .8, scale: 1.03, criticalHits: 4 },
  koi: { label: 'Jet d’eau', color: '#429dc6', accent: '#c8f1ff', motion: 'wave', duration: 830, bend: .8, scale: 1.02, criticalHits: 4 },
  'red-panda': { label: 'Tourbillon d’automne', color: '#c57f4c', accent: '#e7c170', motion: 'vortex', duration: 850, bend: .95, scale: 1.03, criticalHits: 3 },
  penguin: { label: 'Glissade glacée', color: '#81bcd1', accent: '#e1f5ff', motion: 'twin', duration: 780, bend: .75, scale: 1.1, criticalHits: 4 },
  kitsune: { label: 'Tourbillon de flammes', color: '#e66f3c', accent: '#ffdb7e', motion: 'vortex', duration: 880, bend: .7, scale: 1.16, criticalHits: 5 },
} as const satisfies Record<MascotKind, Signature>

export const signatureAttack = (mascot: MascotKind): Signature => SIGNATURE_ATTACKS[mascot]

/** All visible hits fit the shortest correction; grading remains a single hit. */
export function attackSequence(mascot: MascotKind, critical: boolean) {
  const signature=signatureAttack(mascot),count=critical?signature.criticalHits:1
  const gap=critical?80:0,duration=critical?Math.min(signature.duration,900-(count-1)*gap):signature.duration
  return Array.from({length:count},(_,index)=>({index,delay:index*gap,duration,impactDelay:index*gap+Math.round(duration*.58)}))
}
