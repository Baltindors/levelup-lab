/**
 * Shared fraction arithmetic for the Rank C sandbox and the later trial pool.
 */

export function gcd(a, b) {
  let x = Math.abs(Math.trunc(Number(a)) || 0)
  let y = Math.abs(Math.trunc(Number(b)) || 0)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

export function lcm(a, b) {
  const x = Math.abs(Math.trunc(Number(a)) || 0)
  const y = Math.abs(Math.trunc(Number(b)) || 0)
  if (!x || !y) return 1
  return (x / gcd(x, y)) * y
}

/**
 * Reduce a fraction to lowest terms. The sign lives on the numerator.
 * A zero or non-finite denominator returns 0/1 so callers cannot divide by zero.
 */
export function reduceFraction(num, den) {
  const n = Math.trunc(Number(num))
  const d = Math.trunc(Number(den))
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) {
    return { num: 0, den: 1 }
  }
  if (n === 0) return { num: 0, den: 1 }
  const sign = n < 0 !== d < 0 ? -1 : 1
  const g = gcd(n, d)
  return { num: (sign * Math.abs(n)) / g, den: Math.abs(d) / g }
}

/** KaTeX body for a reduced fraction. Whole numbers stay plain. */
export function toKatexFrac(n, d) {
  if (d === 1) return `${n}`
  if (n === 0) return '0'
  return `\\frac{${n}}{${d}}`
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function createMcOptions(correctKatex, distractorSet) {
  const uniqueDistractors = []
  for (const candidate of distractorSet) {
    if (uniqueDistractors.length >= 3) break
    if (!candidate || candidate === correctKatex || uniqueDistractors.includes(candidate)) continue
    uniqueDistractors.push(candidate)
  }

  let guard = 0
  while (uniqueDistractors.length < 3 && guard < 40) {
    guard += 1
    const filler = toKatexFrac(randomInt(1, 9), randomInt(2, 9))
    if (filler === correctKatex || uniqueDistractors.includes(filler)) continue
    uniqueDistractors.push(filler)
  }

  const rawOptions = [
    { label: `$${correctKatex}$`, correct: true },
    { label: `$${uniqueDistractors[0]}$`, correct: false },
    { label: `$${uniqueDistractors[1]}$`, correct: false },
    { label: `$${uniqueDistractors[2]}$`, correct: false },
  ]

  const shuffled = shuffle(rawOptions)
  const optionKeys = ['a', 'b', 'c', 'd']
  const options = shuffled.map((item, idx) => ({ id: optionKeys[idx], label: item.label }))
  const correctAnswer = options[shuffled.findIndex((item) => item.correct)].id

  return { options, correctAnswer }
}

function buildAddQuestion(id) {
  const d1 = randomInt(2, 8)
  const d2 = Math.random() > 0.4 ? d1 : randomInt(2, 8)
  const n1 = randomInt(1, d1 - 1)
  const n2 = randomInt(1, d2 - 1)

  const commonDenom = lcm(d1, d2)
  const mult1 = commonDenom / d1
  const mult2 = commonDenom / d2
  const finalNum = n1 * mult1 + n2 * mult2
  const reduced = reduceFraction(finalNum, commonDenom)
  const correctKatex = toKatexFrac(reduced.num, reduced.den)

  const distractors = new Set()
  const d1Red = reduceFraction(n1 + n2, d1 + d2)
  distractors.add(toKatexFrac(d1Red.num, d1Red.den))
  const d2Red = reduceFraction(n1 + n2, commonDenom)
  distractors.add(toKatexFrac(d2Red.num, d2Red.den))
  distractors.add(toKatexFrac(reduced.num + 1, reduced.den))

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)
  const isLike = d1 === d2

  return {
    id: `frac-add-${id}`,
    topic: 'add',
    question: `Evaluate: $\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}}$`,
    options,
    correctAnswer,
    rule: isLike ? 'Direct Numerator Addition' : 'Least Common Denominator (LCD)',
    steps: isLike
      ? [
          `Denominators match ($${d1}$). Add numerators directly: $${n1} + ${n2} = ${finalNum}$.`,
          `Unreduced fraction: $\\frac{${finalNum}}{${commonDenom}}$.`,
          `Simplest form: $${correctKatex}$.`,
        ]
      : [
          `Find the LCD of $${d1}$ and $${d2}$: $\\text{LCD} = ${commonDenom}$.`,
          `Scale fractions: $\\frac{${n1 * mult1}}{${commonDenom}} + \\frac{${n2 * mult2}}{${commonDenom}}$.`,
          `Add numerators: $${n1 * mult1} + ${n2 * mult2} = ${finalNum}$, giving $\\frac{${finalNum}}{${commonDenom}}$.`,
          `Simplest form: $${correctKatex}$.`,
        ],
  }
}

function buildSubtractQuestion(id) {
  let d1 = randomInt(2, 8)
  let d2 = Math.random() > 0.4 ? d1 : randomInt(2, 8)
  let n1 = randomInt(1, d1 - 1)
  let n2 = randomInt(1, d2 - 1)

  if (n1 / d1 < n2 / d2) {
    const tempN = n1
    const tempD = d1
    n1 = n2
    d1 = d2
    n2 = tempN
    d2 = tempD
  }

  const commonDenom = lcm(d1, d2)
  const mult1 = commonDenom / d1
  const mult2 = commonDenom / d2
  const finalNum = n1 * mult1 - n2 * mult2
  const reduced = reduceFraction(finalNum, commonDenom)
  const correctKatex = toKatexFrac(reduced.num, reduced.den)

  const distractors = new Set()
  const d1Red = reduceFraction(Math.abs(n1 - n2), Math.abs(d1 - d2) || 1)
  distractors.add(toKatexFrac(d1Red.num, d1Red.den))
  distractors.add(toKatexFrac(reduced.num + 1, reduced.den))
  distractors.add(toKatexFrac(Math.max(1, reduced.num - 1), reduced.den))

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)
  const isLike = d1 === d2

  return {
    id: `frac-sub-${id}`,
    topic: 'subtract',
    question: `Evaluate: $\\frac{${n1}}{${d1}} - \\frac{${n2}}{${d2}}$`,
    options,
    correctAnswer,
    rule: isLike ? 'Direct Numerator Subtraction' : 'LCD Alignment Before Subtraction',
    steps: isLike
      ? [
          `Denominators match ($${d1}$). Subtract numerators directly: $${n1} - ${n2} = ${finalNum}$.`,
          `Unreduced fraction: $\\frac{${finalNum}}{${commonDenom}}$.`,
          `Simplest form: $${correctKatex}$.`,
        ]
      : [
          `Find the LCD of $${d1}$ and $${d2}$: $\\text{LCD} = ${commonDenom}$.`,
          `Scale fractions: $\\frac{${n1 * mult1}}{${commonDenom}} - \\frac{${n2 * mult2}}{${commonDenom}}$.`,
          `Subtract numerators: $${n1 * mult1} - ${n2 * mult2} = ${finalNum}$, giving $\\frac{${finalNum}}{${commonDenom}}$.`,
          `Simplest form: $${correctKatex}$.`,
        ],
  }
}

function buildMultiplyQuestion(id) {
  const d1 = randomInt(2, 6)
  const d2 = randomInt(2, 6)
  const n1 = randomInt(1, d1)
  const n2 = randomInt(1, d2)

  const rawNum = n1 * n2
  const rawDen = d1 * d2
  const reduced = reduceFraction(rawNum, rawDen)
  const correctKatex = toKatexFrac(reduced.num, reduced.den)

  const distractors = new Set()
  const cross = reduceFraction(n1 * d2, n2 * d1)
  distractors.add(toKatexFrac(cross.num, cross.den))
  distractors.add(toKatexFrac(rawNum, Math.max(2, rawDen - 1)))
  distractors.add(toKatexFrac(reduced.num + 1, reduced.den))

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)

  return {
    id: `frac-mul-${id}`,
    topic: 'multiply',
    question: `Calculate: $\\frac{${n1}}{${d1}} \\times \\frac{${n2}}{${d2}}$`,
    options,
    correctAnswer,
    rule: 'Multiply Straight Across',
    steps: [
      `Multiply numerators straight across: $${n1} \\times ${n2} = ${rawNum}$.`,
      `Multiply denominators straight across: $${d1} \\times ${d2} = ${rawDen}$.`,
      `Combine: $\\frac{${rawNum}}{${rawDen}}$.`,
      `Simplest form: $${correctKatex}$.`,
    ],
  }
}

function buildDivideQuestion(id) {
  const d1 = randomInt(2, 6)
  const d2 = randomInt(2, 6)
  const n1 = randomInt(1, d1)
  const n2 = randomInt(1, d2)

  const rawNum = n1 * d2
  const rawDen = d1 * n2
  const reduced = reduceFraction(rawNum, rawDen)
  const correctKatex = toKatexFrac(reduced.num, reduced.den)

  const distractors = new Set()
  const noFlip = reduceFraction(n1 * n2, d1 * d2)
  distractors.add(toKatexFrac(noFlip.num, noFlip.den))
  const invertedFirst = reduceFraction(d1 * n2, n1 * d2)
  distractors.add(toKatexFrac(invertedFirst.num, invertedFirst.den))
  distractors.add(toKatexFrac(reduced.num + 1, reduced.den))

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)

  return {
    id: `frac-div-${id}`,
    topic: 'divide',
    question: `Calculate: $\\frac{${n1}}{${d1}} \\div \\frac{${n2}}{${d2}}$`,
    options,
    correctAnswer,
    rule: 'Keep, Change, Flip',
    steps: [
      `Keep the first fraction: $\\frac{${n1}}{${d1}}$.`,
      `Change the division sign to multiplication: $\\div \\rightarrow \\times$.`,
      `Flip the second fraction to its reciprocal: $\\frac{${n2}}{${d2}} \\rightarrow \\frac{${d2}}{${n2}}$.`,
      `Multiply straight across: $\\frac{${n1}}{${d1}} \\times \\frac{${d2}}{${n2}} = \\frac{${rawNum}}{${rawDen}}$.`,
      `Simplest form: $${correctKatex}$.`,
    ],
  }
}

export function generateFractionDrillPool(countPerTopic = 5) {
  const topics = ['add', 'subtract', 'multiply', 'divide']
  const pool = []
  let idCounter = 1

  topics.forEach((topic) => {
    for (let i = 0; i < countPerTopic; i += 1) {
      if (topic === 'add') pool.push(buildAddQuestion(idCounter++))
      if (topic === 'subtract') pool.push(buildSubtractQuestion(idCounter++))
      if (topic === 'multiply') pool.push(buildMultiplyQuestion(idCounter++))
      if (topic === 'divide') pool.push(buildDivideQuestion(idCounter++))
    }
  })

  return pool
}
