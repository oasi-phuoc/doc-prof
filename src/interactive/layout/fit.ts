/** Measured layout only; answer keys and results never enter the fitter. */
export type Readability = { level: 0 | 1 | 2 | 3; questionScroll: boolean; answersScroll: boolean; manualScroll: boolean }
export const naturalReadability: Readability = { level: 0, questionScroll: false, answersScroll: false, manualScroll: false }
const overflow = (element: HTMLElement | null): boolean => !!element && (element.scrollHeight > element.clientHeight + 2 || element.scrollWidth > element.clientWidth + 2)
const px = (value: string) => Number.parseFloat(value) || 0

export function questionSpace(root: HTMLElement): number {
  const win = root.ownerDocument.defaultView!
  const competition = root.closest<HTMLElement>('.ci-competition-main')
  if (competition) {
    const style = win.getComputedStyle(competition)
    const siblings = [...competition.children].filter((child) => child !== root && win.getComputedStyle(child).position !== 'absolute' && win.getComputedStyle(child).display !== 'none')
    return Math.max(100, competition.clientHeight - px(style.paddingTop) - px(style.paddingBottom) - siblings.reduce((sum, child) => sum + child.getBoundingClientRect().height, 0) - px(style.rowGap) * siblings.length)
  }
  if (win.innerWidth <= 700) return Math.max(100, root.parentElement?.clientHeight ?? root.clientHeight)
  const session = root.closest<HTMLElement>('.ci-session')
  const footer = session?.querySelector<HTMLElement>('.ci-controls')
  const footerStyle = footer && win.getComputedStyle(footer)
  return Math.max(160, win.innerHeight - root.getBoundingClientRect().top - (footer?.offsetHeight ?? 65) - (footerStyle ? px(footerStyle.marginTop) : 20) - 28)
}

export function fitQuestion(root: HTMLElement, height = questionSpace(root)): Readability {
  const win = root.ownerDocument.defaultView!
  const heading = root.querySelector<HTMLElement>('.ci-question h1')
  const question = root.querySelector<HTMLElement>('.ci-question')
  const body = root.querySelector<HTMLElement>('.ci-question-body')
  const contents = [...root.querySelectorAll<HTMLElement>('.ci-answer-content')]
  const grid = root.querySelector<HTMLElement>('.ci-answer-grid')
  const manual = root.querySelector<HTMLElement>('.ci-manual')
  if (!heading || !question || !body || !root.clientWidth) return naturalReadability
  delete root.dataset.ciFit
  delete root.dataset.ciMoreQuestion
  delete root.dataset.ciMoreAnswers
  root.style.removeProperty('--ci-fit-height')
  root.style.removeProperty('--ci-fit-question-height')
  heading.style.removeProperty('font-size')
  for (const content of contents) content.style.removeProperty('font-size')
  const headingTarget = px(win.getComputedStyle(heading).fontSize)
  const choiceTarget = contents[0] ? px(win.getComputedStyle(contents[0]).fontSize) : 0
  const wide = win.innerWidth >= 1700 && win.innerHeight >= 900
  const headingFloor = Math.min(headingTarget, wide ? 36 : win.innerWidth > 700 ? 32 : 28)
  const choiceFloor = Math.min(choiceTarget, wide ? 30 : win.innerWidth > 700 ? 26 : 22)
  const textOverflows = () => contents.some((content) => overflow(content) || [...content.children].some((child) => {
    const bounds = child.getBoundingClientRect(), box = content.getBoundingClientRect()
    return bounds.top < box.top - 2 || bounds.bottom > box.bottom + 2
  }))
  const flags = () => ({ questionScroll: overflow(body) || overflow(question), answersScroll: textOverflows() || overflow(grid), manualScroll: overflow(manual) })
  const fits = () => { const f = flags(); return root.scrollHeight <= height + 2 && !f.questionScroll && !f.answersScroll && !f.manualScroll }
  if (fits()) { root.dataset.ciReadability = '0'; return naturalReadability }
  root.style.setProperty('--ci-fit-height', `${Math.floor(height)}px`)
  root.style.setProperty('--ci-fit-question-height', `${question.scrollHeight}px`)
  const size = (ratio: number) => {
    heading.style.fontSize = `${headingFloor + (headingTarget - headingFloor) * ratio}px`
    for (const content of contents) content.style.fontSize = `${choiceFloor + (choiceTarget - choiceFloor) * ratio}px`
  }
  for (const [layout, level] of [['grid', 1], ['list', 2]] as const) {
    root.dataset.ciFit = layout
    size(1)
    if (!fits()) {
      size(0)
      if (!fits()) {
        // A long question can need its own reading control while the six
        // short cards still fit. Keep that grid instead of making a list.
        const current = flags()
        if (layout === 'grid' && current.questionScroll && !current.answersScroll && !current.manualScroll && root.scrollHeight <= height + 2) {
          root.dataset.ciMoreQuestion = 'true'
          const result = { level: 3 as const, ...flags() }
          if (!result.answersScroll && !result.manualScroll && root.scrollHeight <= height + 2) {
            root.dataset.ciReadability = '3'
            return result
          }
          delete root.dataset.ciMoreQuestion
        }
        continue
      }
      let low = 0, high = 1
      for (let n = 0; n < 7; n++) { const middle = (low + high) / 2; size(middle); if (fits()) low = middle; else high = middle }
      size(low)
    }
    root.dataset.ciReadability = String(level)
    return { level, questionScroll: false, answersScroll: false, manualScroll: false }
  }
  root.dataset.ciFit = 'scroll'
  size(0)
  if (grid) root.style.setProperty('--ci-fit-card-space', `${contents.length * (textOverflows() ? 76 : 44) + Math.max(0, contents.length - 1) * px(win.getComputedStyle(grid).rowGap) + 8}px`)
  const result = { level: 3 as const, ...flags() }
  if (result.questionScroll) root.dataset.ciMoreQuestion = 'true'
  if (result.answersScroll) root.dataset.ciMoreAnswers = 'true'
  root.dataset.ciReadability = '3'
  return result
}

export function readabilitySignature(root: HTMLElement): string {
  const win = root.ownerDocument.defaultView!
  const body = root.querySelector('.ci-context p') as HTMLElement | null
  return [root.clientWidth, questionSpace(root), win.innerWidth, win.innerHeight, body?.style.fontSize,
    ...[...root.querySelectorAll('img')].map((image) => `${image.currentSrc}:${image.naturalWidth}`)].join(':')
}
