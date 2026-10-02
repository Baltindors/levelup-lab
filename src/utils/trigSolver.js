const TRIG_FNS = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc']
const PI = Math.PI
const EPS = 1e-9

function gcd(a, b) {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function stripOuterParens(s) {
  let t = s
  while (t.startsWith('(') && t.endsWith(')')) {
    let depth = 0
    let wraps = true
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '(') depth++
      else if (t[i] === ')') {
        depth--
        if (depth === 0 && i < t.length - 1) {
          wraps = false
          break
        }
      }
    }
    if (!wraps) break
    t = t.slice(1, -1)
  }
  return t
}

function parseNumberToken(raw) {
  if (raw === '' || raw === '+') return 1
  if (raw === '-') return -1
  const n = Number(raw)
  if (!Number.isFinite(n)) throw new Error(`Cannot parse number: ${raw}`)
  return n
}

/**
 * Parse a coefficient: decimals, a/b fractions, pi forms, optional outer parens.
 * Examples: 2, -1.25, 1/2, (1/2), -3/2, pi/2, (3pi/2), -(1/2)
 */
export function parseCoeff(raw) {
  if (raw == null || String(raw).trim() === '') return 0
  let s = String(raw).trim().replace(/\s+/g, '').replace(/·/g, '*').replace(/π/g, 'pi')

  // Unary sign before a parenthesized group: -(1/2)
  let sign = 1
  if (s.startsWith('+-') || s.startsWith('-+')) {
    throw new Error(`Cannot parse coefficient: ${raw}`)
  }
  if (s.startsWith('+')) s = s.slice(1)
  else if (s.startsWith('-') && s[1] === '(') {
    sign = -1
    s = s.slice(1)
  }

  s = stripOuterParens(s)

  if (s === 'pi' || s === '+pi') return sign * PI
  if (s === '-pi') return sign * -PI

  // (±n)?pi(/d)?  or  (±n)*pi(/d)?
  let m = s.match(/^([+-]?\d*\.?\d*)\*?pi(?:\/([+-]?\d*\.?\d+))?$/)
  if (m) {
    const num = parseNumberToken(m[1] ?? '')
    const den = m[2] != null ? Number(m[2]) : 1
    if (!Number.isFinite(den) || den === 0) throw new Error(`Cannot parse coefficient: ${raw}`)
    return (sign * num * PI) / den
  }

  // (±a)/(±b) plain fraction (no pi)
  m = s.match(/^([+-]?\d*\.?\d+)\/([+-]?\d*\.?\d+)$/)
  if (m) {
    const num = Number(m[1])
    const den = Number(m[2])
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
      throw new Error(`Cannot parse coefficient: ${raw}`)
    }
    return (sign * num) / den
  }

  // plain decimal / integer
  m = s.match(/^([+-]?\d*\.?\d+)$/)
  if (m && m[1] !== '' && m[1] !== '+' && m[1] !== '-' && m[1] !== '.') {
    return sign * Number(m[1])
  }

  throw new Error(`Cannot parse coefficient: ${raw}`)
}

/**
 * Format a real value as a reduced multiple of π for KaTeX.
 */
export function formatPiLatex(value, maxDen = 24) {
  if (!Number.isFinite(value)) return String(value)
  if (Math.abs(value) < EPS) return '0'

  let bestK = 0
  let bestN = 1
  let bestErr = Infinity

  for (let n = 1; n <= maxDen; n++) {
    const k = Math.round((value * n) / PI)
    const err = Math.abs(value - (k * PI) / n)
    if (err < bestErr - 1e-12 || (Math.abs(err - bestErr) < 1e-12 && n < bestN)) {
      bestErr = err
      bestK = k
      bestN = n
    }
  }

  if (bestErr > 1e-6) {
    return String(Math.round(value * 1000) / 1000)
  }

  if (bestK === 0) return '0'

  const sign = bestK < 0 ? '-' : ''
  let k = Math.abs(bestK)
  let n = bestN
  const g = gcd(k, n)
  k /= g
  n /= g

  if (n === 1) {
    if (k === 1) return `${sign}\\pi`
    return `${sign}${k}\\pi`
  }
  if (k === 1) return `${sign}\\frac{\\pi}{${n}}`
  return `${sign}\\frac{${k}\\pi}{${n}}`
}

export function formatNumberLatex(value) {
  if (!Number.isFinite(value)) return '\\text{undefined}'
  if (Math.abs(value) < EPS) return '0'
  const asPi = formatPiLatex(value)
  if (asPi.includes('\\pi') || asPi === '0') return asPi
  return String(Math.round(value * 1000) / 1000)
}

function normalizeInput(raw) {
  return String(raw)
    .trim()
    .replace(/\s+/g, '')
    .replace(/·/g, '*')
    .replace(/π/g, 'pi')
    .replace(/^y=/i, '')
}

function parseLeadingCoeff(raw) {
  if (raw == null) return 1
  let s = String(raw).trim().replace(/\s+/g, '')
  // Ignore trailing optional multiply before the function name
  if (s.endsWith('*')) s = s.slice(0, -1)
  if (s === '' || s === '+') return 1
  if (s === '-') return -1
  return parseCoeff(s)
}

function extractBalanced(s, openIndex) {
  if (s[openIndex] !== '(') throw new Error('Expected opening parenthesis.')
  let depth = 0
  for (let i = openIndex; i < s.length; i++) {
    if (s[i] === '(') depth++
    else if (s[i] === ')') {
      depth--
      if (depth === 0) {
        return {
          inner: s.slice(openIndex + 1, i),
          end: i,
        }
      }
    }
  }
  throw new Error('Unbalanced parentheses in equation.')
}

/**
 * Parse the trig argument into B and C for B(x - C).
 */
export function parseArgument(argRaw) {
  let arg = String(argRaw).trim().replace(/\s+/g, '')
  if (!arg) throw new Error('Missing function argument.')

  // Unwrap a single full wrap only when it is purely "(x)" or "(x/k)" etc. handled below
  // Forms: x, (x)
  if (arg === 'x' || arg === '(x)') {
    return { B: 1, C: 0 }
  }

  // (B)(x±C) or B(x±C) or (1/2)(x-pi)
  let fm = arg.match(/^(.+)\(x([+-].+)\)$/i)
  if (fm && fm[1] !== '' && !fm[1].endsWith('/')) {
    // Avoid matching x(something) — require coeff part not ending mid-token oddly
    const coeffPart = fm[1].endsWith('*') ? fm[1].slice(0, -1) : fm[1]
    // Exclude case where coeffPart is just something that is actually "x/2" style handled later
    if (!coeffPart.includes('x')) {
      const B = parseLeadingCoeff(coeffPart)
      const C = -parseCoeff(fm[2])
      if (Math.abs(B) < EPS) throw new Error('B cannot be zero.')
      return { B, C }
    }
  }

  // (x±C) with implied B=1
  fm = arg.match(/^\(x([+-].+)\)$/i)
  if (fm) {
    return { B: 1, C: -parseCoeff(fm[1]) }
  }

  // x/k ± C'  or  (x/k) ± C'  or  x/k
  fm = arg.match(/^\(x\/([^)]+)\)([+-].+)?$/i)
  if (fm) {
    const k = parseCoeff(fm[1])
    if (Math.abs(k) < EPS) throw new Error('B cannot be zero.')
    const B = 1 / k
    const constTerm = fm[2] ? parseCoeff(fm[2]) : 0
    return { B, C: -constTerm / B }
  }

  fm = arg.match(/^x\/([^+\-]+)([+-].+)?$/i)
  if (fm) {
    const k = parseCoeff(fm[1])
    if (Math.abs(k) < EPS) throw new Error('B cannot be zero.')
    const B = 1 / k
    const constTerm = fm[2] ? parseCoeff(fm[2]) : 0
    return { B, C: -constTerm / B }
  }

  // Also handle x/2-pi/4 via split (in case den has no +-)
  // Already covered by x\/([^+\-]+)([+-].+)?

  // (B)x ± C'  or Bx ± C'
  fm = arg.match(/^(.+)\*?x([+-].+)?$/i)
  if (fm) {
    const coeffPart = fm[1]
    // Must not be empty-only weirdness; empty coeff => B=1
    if (coeffPart === '' || !coeffPart.includes('x')) {
      const B = parseLeadingCoeff(coeffPart)
      const constTerm = fm[2] ? parseCoeff(fm[2]) : 0
      if (Math.abs(B) < EPS) throw new Error('B cannot be zero.')
      return { B, C: -constTerm / B }
    }
  }

  throw new Error(`Unrecognized argument: ${argRaw}`)
}

/**
 * Parse y = A*f(B(x-C))+D or y = A*f(Bx-C')+D
 * Supports fractional A/D and args like x/2, (1/2)csc(x), -csc(x).
 */
export function parseTrigEquation(rawString) {
  const s = normalizeInput(rawString)
  if (!s) throw new Error('Enter an equation to analyze.')

  const fnAlt = TRIG_FNS.join('|')
  const fnRe = new RegExp(`(${fnAlt})`, 'i')
  const fnMatch = fnRe.exec(s)
  if (!fnMatch) {
    throw new Error('Use a form like (1/2)sin(x), 2sin(2x-pi)+1, or cos(x/2)+1/2.')
  }

  const f = fnMatch[1].toLowerCase()
  const fnIndex = fnMatch.index
  const prefix = s.slice(0, fnIndex)
  const afterFn = s.slice(fnIndex + f.length)

  if (!afterFn.startsWith('(')) {
    throw new Error(`Expected "(" after ${f}. Try ${f}(x).`)
  }

  const { inner: arg, end } = extractBalanced(afterFn, 0)
  const suffix = afterFn.slice(end + 1) // may be +1/2, -3/4, etc.

  const A = parseLeadingCoeff(prefix)
  const D = suffix === '' ? 0 : parseCoeff(suffix)
  const { B, C } = parseArgument(arg)

  return { A, f, B, C, D }
}

function periodFor(f, B) {
  const absB = Math.abs(B)
  if (f === 'tan' || f === 'cot') return PI / absB
  return (2 * PI) / absB
}

function evaluateTrig(f, theta) {
  switch (f) {
    case 'sin':
      return Math.sin(theta)
    case 'cos':
      return Math.cos(theta)
    case 'tan':
      return Math.tan(theta)
    case 'cot':
      return 1 / Math.tan(theta)
    case 'sec':
      return 1 / Math.cos(theta)
    case 'csc':
      return 1 / Math.sin(theta)
    default:
      return NaN
  }
}

function isNearAsymptote(f, theta) {
  if (f === 'sin' || f === 'cos') return false
  if (f === 'tan' || f === 'sec') {
    // cos(theta) ≈ 0
    return Math.abs(Math.cos(theta)) < 0.02
  }
  if (f === 'cot' || f === 'csc') {
    return Math.abs(Math.sin(theta)) < 0.02
  }
  return false
}

export function sample(analysis, x) {
  const { A, f, B, C, D } = analysis
  const theta = B * (x - C)
  if (isNearAsymptote(f, theta)) return Infinity
  const y = A * evaluateTrig(f, theta) + D
  if (!Number.isFinite(y)) return Infinity
  return y
}

export function asymptotesInRange(analysis, xMin, xMax) {
  const { f, B, C } = analysis
  const list = []
  if (f === 'sin' || f === 'cos') return list

  const absB = Math.abs(B)
  const kStart = Math.floor(((xMin - C) * absB) / PI - 3)
  const kEnd = Math.ceil(((xMax - C) * absB) / PI + 3)

  for (let k = kStart; k <= kEnd; k++) {
    let x
    if (f === 'tan' || f === 'sec') {
      // B(x-C) = π/2 + kπ
      x = C + (PI / 2 + k * PI) / B
    } else {
      // cot/csc: B(x-C) = kπ
      x = C + (k * PI) / B
    }
    if (x >= xMin - EPS && x <= xMax + EPS) list.push(x)
  }

  return list
    .sort((a, b) => a - b)
    .filter((x, i, arr) => i === 0 || Math.abs(x - arr[i - 1]) > 1e-8)
}

export function buildPlotSegments(analysis, xMin, xMax, yClamp = 12, steps = 900) {
  const breaks = asymptotesInRange(analysis, xMin, xMax)
  const dx = (xMax - xMin) / steps
  const segments = []
  let current = []

  const flush = () => {
    if (current.length >= 2) segments.push(current)
    current = []
  }

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx
    if (breaks.some((a) => Math.abs(x - a) < dx * 1.5)) {
      flush()
      continue
    }
    const y = sample(analysis, x)
    if (!Number.isFinite(y) || Math.abs(y) > yClamp) {
      flush()
      continue
    }
    if (current.length) {
      const prev = current[current.length - 1]
      if (Math.abs(y - prev.y) > yClamp * 0.85) {
        flush()
      }
    }
    current.push({ x, y })
  }
  flush()
  return segments
}

function sinCosKeyPoints(analysis) {
  const { A, f, C, D, deltaX } = analysis
  const amp = Math.abs(A)
  const mid = D
  const max = D + amp
  const min = D - amp
  const reflected = A < 0

  let ys
  if (f === 'sin') {
    ys = reflected ? [mid, min, mid, max, mid] : [mid, max, mid, min, mid]
  } else {
    ys = reflected ? [min, mid, max, mid, min] : [max, mid, min, mid, max]
  }

  return ys.map((y, i) => {
    const x = C + i * deltaX
    return {
      x,
      y,
      kind: 'point',
      label: `(${formatPiLatex(x)}, ${formatNumberLatex(y)})`,
    }
  })
}

function buildKeyPoints(analysis) {
  const { A, f, C, D, period, deltaX } = analysis
  const points = []
  const asymptoteMarks = []

  if (f === 'sin' || f === 'cos') {
    return { points: sinCosKeyPoints(analysis), asymptoteMarks }
  }

  if (f === 'tan') {
    const leftAsym = C - period / 2
    const rightAsym = C + period / 2
    asymptoteMarks.push(leftAsym, rightAsym)
    points.push(
      {
        x: leftAsym,
        y: null,
        kind: 'asymptote',
        label: `x=${formatPiLatex(leftAsym)}\\ (\\text{VA})`,
      },
      {
        x: C - period / 4,
        y: D - A,
        kind: 'point',
        label: `(${formatPiLatex(C - period / 4)}, ${formatNumberLatex(D - A)})`,
      },
      {
        x: C,
        y: D,
        kind: 'point',
        label: `(${formatPiLatex(C)}, ${formatNumberLatex(D)})`,
      },
      {
        x: C + period / 4,
        y: D + A,
        kind: 'point',
        label: `(${formatPiLatex(C + period / 4)}, ${formatNumberLatex(D + A)})`,
      },
      {
        x: rightAsym,
        y: null,
        kind: 'asymptote',
        label: `x=${formatPiLatex(rightAsym)}\\ (\\text{VA})`,
      }
    )
    return { points, asymptoteMarks }
  }

  // cot, sec, csc: five quarter steps from C, mark VA where undefined
  for (let i = 0; i <= 4; i++) {
    const x = C + i * deltaX
    const theta = analysis.B * (x - C)
    if (isNearAsymptote(f, theta)) {
      asymptoteMarks.push(x)
      points.push({
        x,
        y: null,
        kind: 'asymptote',
        label: `x=${formatPiLatex(x)}\\ (\\text{VA})`,
      })
    } else {
      const y = A * evaluateTrig(f, theta) + D
      points.push({
        x,
        y,
        kind: 'point',
        label: `(${formatPiLatex(x)}, ${formatNumberLatex(y)})`,
      })
    }
  }

  // ensure period-end asymptote for cot/csc when C itself is VA
  if (f === 'cot' || f === 'csc') {
    const end = C + period
    if (!asymptoteMarks.some((a) => Math.abs(a - end) < 1e-8)) {
      asymptoteMarks.push(end)
    }
  }

  return { points, asymptoteMarks }
}

function buildSteps(analysis) {
  const { A, f, B, C, D, period, deltaX, amplitudeDefined, reflected, max, min } = analysis
  const absA = Math.abs(A)
  const absB = Math.abs(B)

  const aLatex = formatNumberLatex(A)
  const bLatex = formatNumberLatex(B)
  const cLatex = formatPiLatex(C)
  const dLatex = formatNumberLatex(D)

  const factoredLatex = `y = ${aLatex}\\,${f}\\!\\left(${bLatex}\\left(x - \\left(${cLatex}\\right)\\right)\\right) + ${dLatex}`

  const phaseDir = analysis.phaseShift.direction
  const phasePlain = formatPiLatex(Math.abs(C))
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
    .replace(/\\pi/g, 'π')
  const phaseText =
    phaseDir === 'none'
      ? 'No phase shift.'
      : `Phase shift ${phasePlain} to the ${phaseDir}.`

  const ampText = amplitudeDefined
    ? `Amplitude = ${absA}.${reflected ? ' Vertical reflection across the midline (A < 0).' : ''}`
    : `Amplitude is undefined for ${f}. Vertical stretch factor |A| = ${absA}.${reflected ? ' Vertical reflection across the midline (A < 0).' : ''}`

  const periodLatex =
    f === 'tan' || f === 'cot'
      ? `T = \\dfrac{\\pi}{|B|} = \\dfrac{\\pi}{${formatNumberLatex(absB)}} = ${formatPiLatex(period)}`
      : `T = \\dfrac{2\\pi}{|B|} = \\dfrac{2\\pi}{${formatNumberLatex(absB)}} = ${formatPiLatex(period)}`

  return [
    {
      title: 'Step 1 — Factored form',
      latex: factoredLatex,
      note: 'Rewrite the inside as B(x - C) so the phase shift is clear.',
    },
    {
      title: 'Step 2 — Midline & amplitude / stretch',
      latex: `\\text{Midline: } y = ${dLatex}`,
      note: ampText,
      extraLatex:
        max != null
          ? `\\text{Max } = ${formatNumberLatex(max)},\\quad \\text{Min } = ${formatNumberLatex(min)}`
          : null,
    },
    {
      title: 'Step 3 — Period',
      latex: periodLatex,
      note: null,
    },
    {
      title: 'Step 4 — Phase shift & quarter step',
      latex: `C = ${cLatex},\\quad \\Delta x = \\dfrac{T}{4} = ${formatPiLatex(deltaX)}`,
      note: phaseText,
    },
    {
      title: 'Step 5 — Key points & asymptotes',
      latex: null,
      note: 'Use the table below. Vertical asymptotes are marked VA.',
      table: true,
    },
  ]
}

export function analyzeTrigEquation(rawString) {
  try {
    const { A, f, B, C, D } = parseTrigEquation(rawString)
    const absA = Math.abs(A)
    const amplitudeDefined = f === 'sin' || f === 'cos'
    const reflected = A < 0
    const period = periodFor(f, B)
    const deltaX = period / 4
    const max = amplitudeDefined ? D + absA : null
    const min = amplitudeDefined ? D - absA : null

    const analysis = {
      ok: true,
      input: rawString,
      A,
      f,
      B,
      C,
      D,
      amplitude: absA,
      amplitudeDefined,
      reflected,
      midline: D,
      max,
      min,
      period,
      deltaX,
      phaseShift: {
        C,
        magnitude: Math.abs(C),
        // C > 0 in (x - C) => shift RIGHT; C < 0 => LEFT
        direction: Math.abs(C) < EPS ? 'none' : C > 0 ? 'right' : 'left',
      },
    }

    const { points, asymptoteMarks } = buildKeyPoints(analysis)
    analysis.keyPoints = points
    analysis.asymptotes = asymptoteMarks
    analysis.steps = buildSteps(analysis)
    analysis.factoredLatex = analysis.steps[0].latex

    return analysis
  } catch (err) {
    return { ok: false, error: err.message || String(err) }
  }
}
