export function isLessonEnter(
  event: KeyboardEvent,
  allowChosenAnswer = false,
): boolean {
  if (
    event.key !== 'Enter' ||
    event.repeat ||
    event.defaultPrevented ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.shiftKey ||
    event.isComposing
  )
    return false
  if (document.querySelector('dialog[open], [role="dialog"], [role="menu"]'))
    return false
  if (
    allowChosenAnswer &&
    event.target instanceof Element &&
    event.target.closest('.ci-answer[aria-pressed="true"]')
  )
    return true
  return !(
    event.target instanceof Element &&
    event.target.closest(
      'input, textarea, select, button, a, audio, video, summary, [contenteditable], [role="button"], [data-ci-toolbar]',
    )
  )
}
