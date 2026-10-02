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

/** Parse a coefficient that may include pi, e.g. "-3", "pi/2", "-2pi", "3*pi/4" */
export function parseCoeff(raw) {
  if (raw == null || String(raw).trim() === '') return 0
  let s = String(raw).trim().replace(/\s+/g, '').replace(/·/g, '*').replace(/π/g, 'pi')

  if (s === 'pi' || s === '+pi') return PI
  if (s === '-pi') return -PI

  let m = s.match(/^([+-]?\d*\.?\d*)\*?pi(?:\/([+-]?\d*\.?\d+))?$/)
  if (m) {
    const num = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : Number(m[1])
    const den = m[2] != null ? Number(m[2]) : 1
    return (num * PI) / den
  }

  m = s.match(/^([+-]?\d*\.?\d+)$/)
  if (m) return Number(m[1])

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
  if (raw == null || raw === '' || raw === '+') return 1
  if (raw === '-') return -1
  return parseCoeff(raw)
}

/**
 * Parse y = A*f(B(x-C))+D or y = A*f(Bx-C')+D
 */
export function parseTrigEquation(rawString) {
  const s = normalizeInput(rawString)
  if (!s) throw new Error('Enter an equation to analyze.')

  const fnAlt = TRIG_FNS.join('|')
  const re = new RegExp(
    `^([+-]?(?:\\d*\\.?\\d+)?(?:\\*?pi(?:\\/\\d+)?)?)?\\*?(${fnAlt})\\((.+)\\)([+-].+)?$`,
    'i'
  )
  const m = s.match(re)
  if (!m) {
    throw new Error('Use a form like 2sin(2x-pi)+1 or -3cos(2(x-pi/4))+1.')
  }

  const A = parseLeadingCoeff(m[1])
  const f = m[2].toLowerCase()
  const arg = m[3]
  const D = m[4] != null && m[4] !== '' ? parseCoeff(m[4]) : 0

  // Form 1: B(x±C)  e.g. 2(x-pi/2)
  let fm = arg.match(
    /^([+-]?(?:\d*\.?\d+)?(?:\*?pi(?:\/\d+)?)?)?\*\(x([+-][^)]+)\)$/i
  )
  if (!fm) {
    fm = arg.match(/^([+-]?(?:\d*\.?\d+)?(?:\*?pi(?:\/\d+)?)?)?\(x([+-][^)]+)\)$/i)
  }
  if (fm) {
    const B = parseLeadingCoeff(fm[1])
    // (x - π/2) => fm[2] = "-pi/2" => inner = -π/2 => C = -inner = +π/2 (shift RIGHT)
    const C = -parseCoeff(fm[2])
    if (Math.abs(B) < EPS) throw new Error('B cannot be zero.')
    return { A, f, B, C, D }
  }

  // (x±C) with implied B=1
  fm = arg.match(/^\(x([+-][^)]+)\)$/i)
  if (fm) {
    return { A, f, B: 1, C: -parseCoeff(fm[1]), D }
  }

  // Form 2: Bx±C'  e.g. 2x-pi, x+pi/2, -2x
  fm = arg.match(/^([+-]?(?:\d*\.?\d+)?(?:\*?pi(?:\/\d+)?)?)?\*?x([+-].+)?$/i)
  if (fm) {
    const B = parseLeadingCoeff(fm[1])
    const constTerm = fm[2] != null && fm[2] !== '' ? parseCoeff(fm[2]) : 0
    // B(x - C) = Bx - B C  =>  constTerm = -B C  =>  C = -constTerm / B
    const C = -constTerm / B
    if (Math.abs(B) < EPS) throw new Error('B cannot be zero.')
    return { A, f, B, C, D }
  }

  if (arg === 'x') {
    return { A, f, B: 1, C: 0, D }
  }

  throw new Error(`Unrecognized argument: ${arg}`)
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
