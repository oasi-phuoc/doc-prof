const emphasis = (text) => text.replace(/\*\*([^*]+)\*\*/g, '{g}$1{/g}')
const plain = (text) => text.replace(/\*\*/g, '').trim()
export const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())

export function theoryBlocks(markdown) {
  return markdown.replace(/^#{1,6} .+$/gm, '\n$&\n').trim().split(/\n\s*\n/).flatMap((chunk) => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean)
    if (lines.every((line) => line.startsWith('|')) && lines.length >= 3) {
      return [{
        kind: 'table',
        headers: cells(lines[0]).map(emphasis),
        rows: lines.slice(2).map((line) => cells(line).map(emphasis)),
      }]
    }
    if (lines.every((line) => /^[-*] |^\d+\. /.test(line))) {
      return [{ kind: 'list', items: lines.map((line) => emphasis(line.replace(/^[-*] /, ''))) }]
    }
    if (lines.every((line) => /^#{1,6} /.test(line))) {
      return lines.map((line) => ({ kind: 'heading', text: plain(line.replace(/^#+ /, '')), sub: line.startsWith('###') }))
    }
    if (/^---+$/.test(chunk)) return []
    return [{ kind: 'paragraph', text: emphasis(lines.join(' ')) }]
  })
}
