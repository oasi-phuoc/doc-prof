const ANSWER_OPEN = /^:::(reponse|réponse|solution)(?:\s+(.*))?$/i
const FIGURE_OPEN = /^:::figure\s+(\w+)/i
const NOTE_OPEN = /^:::eleve-note(?:\s+([\w-]+))?\s*$/i
const BLOCK_CLOSE = /^:::\s*$/

function parseBlock(lines, start, kind, directive) {
  let close = start + 1
  while (close < lines.length && !BLOCK_CLOSE.test(lines[close].trim())) close += 1
  const isClosed = close < lines.length
  const bodyEnd = isClosed ? close : lines.length
  const rawEnd = isClosed ? close + 1 : lines.length
  return {
    kind,
    directive,
    startLine: start + 1,
    endLine: rawEnd,
    body: lines.slice(start + 1, bodyEnd).join('\n'),
    rawMarkdown: lines.slice(start, rawEnd).join('\n'),
    closed: isClosed,
    nextLine: rawEnd,
  }
}

export function parseMarkdownDirectives(markdown) {
  const lines = markdown.split(/\r?\n/)
  const blocks = []
  const issues = []

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim()
    const answer = line.match(ANSWER_OPEN)
    const figure = line.match(FIGURE_OPEN)
    const note = line.match(NOTE_OPEN)

    if (answer || figure || note) {
      const block = parseBlock(
        lines,
        index,
        answer ? 'answer' : figure ? 'figure' : 'student-note',
        answer ? answer[1].toLowerCase() : figure ? figure[1].toLowerCase() : note[1] ?? 'note',
      )
      blocks.push(block)
      if (!block.closed) issues.push({ code: 'unclosed-block', line: block.startLine, directive: block.directive })
      index = block.nextLine
      continue
    }

    if (BLOCK_CLOSE.test(line)) {
      issues.push({ code: 'orphan-close', line: index + 1, rawMarkdown: lines[index] })
    } else if (line.startsWith(':::')) {
      issues.push({ code: 'unsupported-directive', line: index + 1, rawMarkdown: lines[index] })
    }
    index += 1
  }

  return { lines, blocks, issues }
}

function markdownHeadings(lines) {
  const headings = []
  lines.forEach((line, index) => {
    const match = line.trim().match(/^(#{1,6})\s+(.+)$/)
    if (match) headings.push({ level: match[1].length, title: match[2].trim(), line: index + 1 })
  })
  return headings
}

function questionHeading(type, title) {
  if (type === 'maths') return /^(?:exercice|probl[eè]me|calcul)\s+\d+(?:[.-]\d+)?(?:\/\d+)?\b/i.test(title)
  if (type === 'verification') return /^question\s*(?:n[°o]\s*)?\d+\b/i.test(title)
  if (type === 'situation') return /^(?:mission|exercice|question|cas|activit[eé])\s+[A-Z]?\s*\d+(?:(?:\.\d+)|(?:\s*[–-]\s*\d+)|(?:\s*\/\s*\d+))*\b/i.test(title)
  return false
}

function sectionEndLine(headings, heading, lineCount) {
  return headings.find(candidate => candidate.line > heading.line && candidate.level <= heading.level)?.line ?? lineCount + 1
}

function controlInstruction(line) {
  return /r[eé]ponds? d'abord sans regarder|bouton solution|r[eé]v[eè]le(?:r)? les? solutions?|afficher ou masquer les solutions/i.test(line)
}

function parsePageContext(lines, beforeLine) {
  return lines.slice(0, Math.max(0, beforeLine - 1))
    .filter(line => !controlInstruction(line))
    .join('\n')
    .trim()
}

export function parseSourceExercisePage(type, markdown) {
  if (!['maths', 'verification', 'situation'].includes(type)) {
    throw new Error(`Type non pris en charge par le parseur d’exercices : ${type}`)
  }

  const parsed = parseMarkdownDirectives(markdown)
  const headings = markdownHeadings(parsed.lines)
  const sections = headings.filter(heading => questionHeading(type, heading.title))
  const items = []
  const usedAnswers = new Set()
  const pageContext = sections.length ? parsePageContext(parsed.lines, sections[0].line) : ''
  const answerBlocks = parsed.blocks.filter(block => block.kind === 'answer')
  const nonAnswerBlocks = parsed.blocks.filter(block => block.kind !== 'answer')

  sections.forEach((heading, sectionIndex) => {
    const nextQuestionLine = sections[sectionIndex + 1]?.line ?? parsed.lines.length + 1
    const endLine = Math.min(nextQuestionLine, sectionEndLine(headings, heading, parsed.lines.length))
    const blocks = answerBlocks.filter(block => block.startLine >= heading.line && block.startLine < endLine)
    blocks.forEach(block => usedAnswers.add(block))
    const excludedBlocks = parsed.blocks.filter(block => block.startLine >= heading.line && block.startLine < endLine)
    const excludedLine = new Map()
    for (const block of excludedBlocks) {
      for (let line = block.startLine; line <= block.endLine; line += 1) excludedLine.set(line, block)
    }

    const promptLines = []
    const footerLines = []
    for (let lineNumber = heading.line + 1; lineNumber < endLine; lineNumber += 1) {
      const line = parsed.lines[lineNumber - 1] ?? ''
      const block = excludedLine.get(lineNumber)
      if (block) continue
      if (/footer corrig[eé]/i.test(line)) {
        footerLines.push({ line: lineNumber, markdown: line })
        continue
      }
      if (!controlInstruction(line)) promptLines.push(line)
    }

    const issues = parsed.issues.filter(issue => issue.line >= heading.line && issue.line < endLine)
    const mediaBlocks = nonAnswerBlocks.filter(block => block.startLine >= heading.line && block.startLine < endLine)
    const headingPrompt = heading.title.replace(/^(?:mission|exercice|question|cas|activit[eé])\s+[A-Z]?\s*\d+(?:(?:\.\d+)|(?:\s*[–-]\s*\d+)|(?:\s*\/\s*\d+))*\s*(?:[—–:-]\s*)?/i, '').trim()
    if (promptLines.join('\n').trim().length === 0 && headingPrompt.length < 3) issues.push({ code: 'empty-prompt', line: heading.line })
    if (mediaBlocks.length) issues.push({ code: 'unsupported-media-block', line: mediaBlocks[0].startLine })
    if (footerLines.length) issues.push({ code: 'answer-footer-removed', line: footerLines[0].line })

    const parentMission = type === 'situation'
      ? heading.title.match(/^(?:mission|exercice|question|cas|activit[eé])\s+[^—–]+/i)?.[0].trim()
      : undefined

    items.push({
      type,
      title: heading.title,
      parentMission,
      sourcePosition: { startLine: heading.line, endLine: Math.max(heading.line, endLine - 1) },
      pageContext: type === 'situation' ? pageContext : undefined,
      promptMarkdown: promptLines.join('\n').trim(),
      answerBlocks: blocks.map(({ directive, startLine, endLine: blockEndLine, body, rawMarkdown, closed }) => ({
        directive,
        startLine,
        endLine: blockEndLine,
        markdown: body,
        rawMarkdown,
        closed,
      })),
      unsupportedBlocks: mediaBlocks.map(({ kind, directive, startLine, endLine: blockEndLine, rawMarkdown }) => ({
        kind,
        directive,
        startLine,
        endLine: blockEndLine,
        rawMarkdown,
      })),
      footerLines,
      issues,
    })
  })

  const unassignedBlocks = answerBlocks.filter(block => !usedAnswers.has(block))
  return {
    items,
    issues: parsed.issues,
    unassignedBlocks: unassignedBlocks.map(({ directive, startLine, endLine, body, rawMarkdown, closed }) => ({
      directive,
      startLine,
      endLine,
      markdown: body,
      rawMarkdown,
      closed,
    })),
    headings: headings.map(({ level, title, line }) => ({ level, title, line })),
    answerBlockCount: answerBlocks.length,
  }
}

function splitPipeRow(line) {
  const cells = []
  let cell = ''
  let escaped = false
  let codeSpan = false
  const source = line.trim().replace(/^\|/, '').replace(/\|$/, '')

  for (const char of source) {
    if (escaped) {
      cell += char
      escaped = false
    } else if (char === '\\') {
      cell += char
      escaped = true
    } else if (char === '`') {
      codeSpan = !codeSpan
      cell += char
    } else if (char === '|' && !codeSpan) {
      cells.push(cell.trim())
      cell = ''
    } else {
      cell += char
    }
  }
  cells.push(cell.trim())
  return cells
}

function normalizeHeadingCell(cell) {
  return cell.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every(cell => /^:?-+:?$/.test(cell.replace(/\s/g, '')))
}

export function parseGlossaryTables(markdown) {
  const lines = markdown.split(/\r?\n/)
  const entries = []
  const issues = []
  const tableLines = new Set()

  for (let index = 0; index < lines.length;) {
    if (!lines[index].trim().startsWith('|')) {
      index += 1
      continue
    }

    const start = index
    const rows = []
    while (index < lines.length && lines[index].trim().startsWith('|')) {
      rows.push({ line: index + 1, cells: splitPipeRow(lines[index]) })
      tableLines.add(index + 1)
      index += 1
    }

    const header = rows[0]
    const headerCells = header.cells.map(normalizeHeadingCell)
    const termIndex = headerCells.findIndex(cell => /\bterme\b|terme technique/.test(cell))
    const definitionIndex = headerCells.findIndex(cell => /definition/.test(cell))
    const linkIndex = headerCells.findIndex(cell => /\blien\b/.test(cell))
    const exampleIndex = headerCells.findIndex(cell => /exemple/.test(cell))
    const synonymIndex = headerCells.findIndex(cell => /synonyme/.test(cell))

    if (termIndex < 0 || definitionIndex < 0) {
      issues.push({ code: 'unrecognized-glossary-table', line: header.line, rawMarkdown: lines.slice(start, index).join('\n') })
      continue
    }

    for (const row of rows.slice(1)) {
      if (isSeparatorRow(row.cells)) continue
      const term = row.cells[termIndex] ?? ''
      const definition = row.cells[definitionIndex] ?? ''
      if (!term.trim() || !definition.trim()) {
        issues.push({ code: 'incomplete-glossary-row', line: row.line, rawMarkdown: lines[row.line - 1] })
        continue
      }
      const synonyms = row.cells[synonymIndex]?.split(/[,;]\s*/).map(value => value.trim()).filter(Boolean)
      entries.push({
        term,
        definition,
        sourceLink: linkIndex < 0 ? undefined : row.cells[linkIndex] || undefined,
        example: exampleIndex < 0 ? undefined : row.cells[exampleIndex] || undefined,
        synonyms: synonyms?.length ? synonyms : undefined,
        sourcePosition: { startLine: row.line, endLine: row.line },
        rawMarkdown: lines[row.line - 1],
      })
    }
  }

  return { entries, issues, tableLineNumbers: [...tableLines] }
}

export function normalizeSourceText(text) {
  return text
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
}
