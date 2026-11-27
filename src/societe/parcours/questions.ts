import type { SocieteQuestion } from '../types'

export function choix(prompt: string, options: [string, string, string], correct: 0 | 1 | 2): SocieteQuestion {
  return { prompt, options, answer: options[correct] }
}

export function vraiFaux(prompt: string, vrai: boolean): SocieteQuestion {
  return { prompt, options: ['Vrai', 'Faux'], answer: vrai ? 'Vrai' : 'Faux' }
}

export function reponse(prompt: string, answer: string): SocieteQuestion {
  return { prompt, answer }
}
