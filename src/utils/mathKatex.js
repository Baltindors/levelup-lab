import katex from 'katex'
import 'katex/dist/katex.min.css'

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderRawLatex(latex, displayMode = false) {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode })
  } catch {
    return escapeHtml(latex)
  }
}

/**
 * Render mixed prose + KaTeX.
 * - No `$` delimiters → plain escaped text (avoids italicizing ordinary words).
 * - `$...$` / `$$...$$` segments → KaTeX; surrounding prose stays text.
 */
export function renderKatex(input, displayMode = false) {
  if (input == null) return ''
  const text = String(input)
  if (!text.includes('$')) {
    // Undelimited strings are prose/plain text, not raw LaTeX.
    return escapeHtml(text)
  }

  const parts = []
  const pattern = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g
  let lastIndex = 0
  let match = pattern.exec(text)

  while (match) {
    if (match.index > lastIndex) {
      parts.push(escapeHtml(text.slice(lastIndex, match.index)))
    }
    if (match[1] != null) {
      parts.push(renderRawLatex(match[1], true))
    } else {
      parts.push(renderRawLatex(match[2], displayMode))
    }
    lastIndex = match.index + match[0].length
    match = pattern.exec(text)
  }

  if (lastIndex < text.length) {
    parts.push(escapeHtml(text.slice(lastIndex)))
  }

  return parts.join('')
}
