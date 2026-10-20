/**
 * Evergreen mixed-number pool for the Rank B sandbox and trial.
 * Cards use the math drill schema (`correctAnswer`), not science `correctOptionId`.
 */

import { reduceFraction, toKatexFrac } from './fractionGenerator'

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Mixed-number KaTeX. Carries an improper fractional part into the whole
 * and reduces the remainder. A zero fraction is the whole; a zero whole is a fraction.
 */
export function toKatexMixed(whole, num, den) {
  const w = Math.trunc(Number(whole)) || 0
  const reduced = reduceFraction(num, den)
  const denAbs = reduced.den || 1
  const carry = Math.trunc(reduced.num / denAbs)
  const rem = reduced.num - carry * denAbs
  const finalWhole = w + carry
  if (rem === 0) return `${finalWhole}`
  if (finalWhole === 0) return toKatexFrac(rem, denAbs)
  return `${finalWhole}\\frac{${rem}}{${denAbs}}`
}

/** Display a mixed number without carrying, so a missed regroup stays visible. */
function toKatexMixedRaw(whole, num, den) {
  const w = Math.trunc(Number(whole)) || 0
  const n = Math.trunc(Number(num)) || 0
  const d = Math.trunc(Number(den)) || 1
  if (n === 0) return `${w}`
  if (w === 0) return `\\frac{${n}}{${d}}`
  return `${w}\\frac{${n}}{${d}}`
}

function distinctDistractors(correctKatex, distractorSet) {
  const uniqueDistractors = []
  for (const candidate of distractorSet) {
    if (!candidate || candidate === correctKatex || uniqueDistractors.includes(candidate)) continue
    uniqueDistractors.push(candidate)
  }
  return uniqueDistractors
}

function createMcOptions(correctKatex, distractorSet) {
  const uniqueDistractors = distinctDistractors(correctKatex, distractorSet)
  let guard = 0
  while (uniqueDistractors.length < 3 && guard < 40) {
    guard += 1
    const filler = toKatexMixed(randomInt(0, 8), randomInt(1, 5), randomInt(2, 9))
    if (filler === correctKatex || uniqueDistractors.includes(filler)) continue
    uniqueDistractors.push(filler)
  }
  uniqueDistractors.splice(3)

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

function buildConvertQuestion(id) {
  const toImproper = Math.random() > 0.5
  const whole = randomInt(1, 8)
  const den = randomInt(2, 9)
  const num = randomInt(1, den - 1)
  const improper = whole * den + num
  const reduced = reduceFraction(improper, den)
  const mixedRaw = toKatexMixedRaw(whole, num, den)
  const improperRaw = `\\frac{${improper}}{${den}}`
  const mixedKatex = toKatexMixed(whole, num, den)
  const improperKatex = toKatexFrac(reduced.num, reduced.den)
  const correctKatex = toImproper ? improperKatex : mixedKatex

  const distractors = new Set()
  distractors.add(toKatexFrac(whole + num, den))
  distractors.add(toKatexFrac(num, den))
  const offRemainder = num + 1 === den ? num - 1 || 1 : num + 1
  distractors.add(toKatexMixed(whole, offRemainder, den))
  distractors.add(toKatexFrac(Math.max(1, improper - den), den))
  distractors.add(toKatexMixed(whole + 1, num, den))
  if (!toImproper) distractors.add(improperKatex)
  if (toImproper) distractors.add(mixedKatex)

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)
  const question = toImproper
    ? `Convert the mixed number to an improper fraction in lowest terms: $${mixedRaw}$`
    : `Convert the improper fraction to a mixed number: $${improperRaw}$`

  const steps = toImproper
    ? [
        `Multiply the whole number by the denominator and add the numerator: $${whole} \\times ${den} + ${num} = ${improper}$.`,
        `Write the improper fraction: $${improperRaw}$.`,
        `Lowest terms: $${improperKatex}$.`,
      ]
    : [
        `Divide $${improper}$ by $${den}$: $${improper} \\div ${den} = ${whole}$ with remainder $${num}$.`,
        `The quotient is the whole number and the remainder stays over $${den}$: $${mixedRaw}$.`,
        `Lowest terms: $${mixedKatex}$.`,
      ]

  return {
    id: `mixed-convert-${id}`,
    topic: 'convert',
    question,
    options,
    correctAnswer,
    rule: toImproper ? 'Whole Times Denominator, Plus Numerator' : 'Divide and Keep the Remainder',
    steps,
  }
}

function buildAddRegroupQuestion(id) {
  const den = randomInt(2, 8)
  let num1 = randomInt(1, den - 1)
  let num2 = randomInt(1, den - 1)
  if (num1 + num2 < den) {
    num1 = den - 1
    num2 = randomInt(1, den - 1)
    if (num1 + num2 < den) num2 = 1
  }

  const whole1 = randomInt(1, 5)
  const whole2 = randomInt(1, 5)
  const sumNum = num1 + num2
  const carry = Math.floor(sumNum / den)
  const remainder = sumNum % den
  const reduced = reduceFraction(remainder, den)
  const resultWhole = whole1 + whole2 + carry
  const correctKatex = toKatexMixed(resultWhole, reduced.num, reduced.den)

  const distractors = new Set()
  distractors.add(toKatexMixedRaw(whole1 + whole2, sumNum, den))
  distractors.add(toKatexMixed(whole1 + whole2, remainder, den))
  distractors.add(toKatexMixed(resultWhole + 1, reduced.num, reduced.den))
  if (reduced.den !== den && remainder !== 0) {
    distractors.add(toKatexMixedRaw(resultWhole, remainder, den))
  } else {
    distractors.add(toKatexMixed(resultWhole, remainder + 1, den))
  }

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)
  const left = toKatexMixedRaw(whole1, num1, den)
  const right = toKatexMixedRaw(whole2, num2, den)

  return {
    id: `mixed-add-${id}`,
    topic: 'add-regroup',
    question: `Add and regroup: $${left} + ${right}$`,
    options,
    correctAnswer,
    rule: 'Regroup a Sum of 1 or More into the Whole',
    steps: [
      `Add the wholes and the fractions separately: $${whole1} + ${whole2} = ${whole1 + whole2}$ and $\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}} = \\frac{${sumNum}}{${den}}$.`,
      `$\\frac{${sumNum}}{${den}}$ is at least one whole. Carry $${carry}$: $${whole1 + whole2} + ${carry} = ${resultWhole}$, remainder $\\frac{${remainder}}{${den}}$.`,
      `Lowest terms: $${correctKatex}$.`,
    ],
  }
}

function buildSubBorrowQuestion(id) {
  const den = randomInt(2, 8)
  const num2 = randomInt(1, den - 1)
  const num1 = randomInt(0, num2 - 1)
  const whole2 = randomInt(0, 4)
  const whole1 = whole2 + randomInt(1, 4)

  const borrowedNum = num1 + den
  const diffNum = borrowedNum - num2
  const resultWhole = whole1 - 1 - whole2
  const reduced = reduceFraction(diffNum, den)
  const correctKatex = toKatexMixed(resultWhole, reduced.num, reduced.den)

  const distractors = new Set()
  distractors.add(toKatexMixedRaw(whole1 - whole2, num2 - num1, den))
  distractors.add(toKatexMixed(whole1 - whole2, reduced.num, reduced.den))
  distractors.add(toKatexMixed(Math.max(0, resultWhole - 1), reduced.num === 0 ? 1 : reduced.num, reduced.den))
  if (reduced.den !== den) distractors.add(toKatexMixedRaw(resultWhole, diffNum, den))

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)
  const left = toKatexMixedRaw(whole1, num1, den)
  const right = toKatexMixedRaw(whole2, num2, den)

  return {
    id: `mixed-sub-${id}`,
    topic: 'sub-borrow',
    question: `Subtract. Borrow when the fraction is too small: $${left} - ${right}$`,
    options,
    correctAnswer,
    rule: 'Borrow 1 Whole Before Subtracting Fractions',
    steps: [
      `$\\frac{${num1}}{${den}}$ is smaller than $\\frac{${num2}}{${den}}$, so borrow 1 from $${whole1}$.`,
      `That whole becomes $\\frac{${den}}{${den}}$, so the minuend is $${whole1 - 1}\\frac{${borrowedNum}}{${den}}$.`,
      `Subtract: $${whole1 - 1} - ${whole2} = ${resultWhole}$ and $\\frac{${borrowedNum}}{${den}} - \\frac{${num2}}{${den}} = \\frac{${diffNum}}{${den}}$.`,
      `Lowest terms: $${correctKatex}$.`,
    ],
  }
}

function randomFactor() {
  const den = randomInt(2, 6)
  const num = randomInt(1, den - 1)
  const whole = randomInt(1, 3)
  const reduced = reduceFraction(num, den)
  return {
    whole,
    num: reduced.num,
    den: reduced.den,
    imp: whole * reduced.den + reduced.num,
  }
}

function buildMultDivQuestion(id) {
  const multiply = Math.random() > 0.5
  const left = randomFactor()
  const right = randomFactor()
  const leftKatex = toKatexMixed(left.whole, left.num, left.den)
  const rightKatex = toKatexMixed(right.whole, right.num, right.den)

  const rawNum = multiply ? left.imp * right.imp : left.imp * right.den
  const rawDen = multiply ? left.den * right.den : left.den * right.imp
  const reduced = reduceFraction(rawNum, rawDen)
  const correctKatex = toKatexMixed(0, reduced.num, reduced.den)

  const separateNum = left.num * right.num
  const separateDen = left.den * right.den
  const separateWhole = left.whole * right.whole
  const noFlip = reduceFraction(left.imp * right.imp, left.den * right.den)

  const distractors = new Set()
  distractors.add(toKatexMixed(separateWhole, separateNum, separateDen))
  if (multiply) {
    distractors.add(toKatexFrac(rawNum, rawDen))
    distractors.add(toKatexMixed(separateWhole, 0, 1))
  } else {
    distractors.add(toKatexMixed(0, noFlip.num, noFlip.den))
    distractors.add(toKatexFrac(rawNum, rawDen))
  }
  distractors.add(toKatexMixed(0, reduced.num + reduced.den, reduced.den))

  const { options, correctAnswer } = createMcOptions(correctKatex, distractors)

  if (multiply) {
    return {
      id: `mixed-mul-${id}`,
      topic: 'mult-div',
      question: `Multiply. Convert to improper fractions first: $${leftKatex} \\times ${rightKatex}$`,
      options,
      correctAnswer,
      rule: 'Improper Fractions, Then Multiply Straight Across',
      steps: [
        `Convert: $${leftKatex} = \\frac{${left.imp}}{${left.den}}$ and $${rightKatex} = \\frac{${right.imp}}{${right.den}}$.`,
        `Multiply straight across: $\\frac{${left.imp}}{${left.den}} \\times \\frac{${right.imp}}{${right.den}} = \\frac{${rawNum}}{${rawDen}}$.`,
        `Lowest terms as a mixed number: $${correctKatex}$.`,
      ],
    }
  }

  return {
    id: `mixed-div-${id}`,
    topic: 'mult-div',
    question: `Divide. Convert to improper fractions, then flip: $${leftKatex} \\div ${rightKatex}$`,
    options,
    correctAnswer,
    rule: 'Improper Fractions, Then Keep-Change-Flip',
    steps: [
      `Convert: $${leftKatex} = \\frac{${left.imp}}{${left.den}}$ and $${rightKatex} = \\frac{${right.imp}}{${right.den}}$.`,
      `Keep the first, change to multiplication, and flip the second: $\\frac{${left.imp}}{${left.den}} \\times \\frac{${right.den}}{${right.imp}}$.`,
      `Multiply: $\\frac{${rawNum}}{${rawDen}}$. Lowest terms: $${correctKatex}$.`,
    ],
  }
}

export function generateMixedNumberDrillPool(countPerTopic = 5) {
  const builders = {
    convert: buildConvertQuestion,
    'add-regroup': buildAddRegroupQuestion,
    'sub-borrow': buildSubBorrowQuestion,
    'mult-div': buildMultDivQuestion,
  }
  const pool = []
  let idCounter = 1

  Object.entries(builders).forEach(([topic, build]) => {
    for (let i = 0; i < countPerTopic; i += 1) {
      let card = null
      for (let attempt = 0; attempt < 8 && !card; attempt += 1) {
        const draft = build(idCounter)
        const labels = new Set((draft?.options ?? []).map((option) => option.label))
        if (draft && labels.size === 4) card = draft
      }
      if (!card) card = build(idCounter)
      card.topic = topic
      pool.push(card)
      idCounter += 1
    }
  })

  return pool
}
