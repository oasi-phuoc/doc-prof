import type { MathTheoryLesson } from './theory-lessons'
import algebra from './theory-algebra.json'
import geometry from './theory-geometry.json'

type IllustratedTopicPage = {
  id: string
  title: string
  question: string
  goal: string
  word: string[]
  steps: string[]
  answer: string
  diagram: string[][]
}

const courses: Readonly<Record<string, IllustratedTopicPage[] | undefined>> = { ...algebra, ...geometry }

export function curriculumTheory(topic: string): MathTheoryLesson[] {
  return (courses[topic] ?? []).map(({ id, title, question, goal, word, steps, answer, diagram }) => ({
    title, heading: question, goal,
    words: [[word[0]!, word[1]!, 'step']],
    steps, example: answer, illustration: id,
    visualAlt: diagram.map(([label, value]) => `${label}. ${value}.`).join(' '),
  }))
}
