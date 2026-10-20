<script setup>
import { computed, ref } from 'vue'
import { lcm, reduceFraction } from '../../../utils/fractionGenerator'
import { toKatexMixed } from '../../../utils/mixedNumberGenerator'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('convert')
const operator = ref('mul')
const activePreset = ref('convert')

const rawW1 = ref(3)
const rawN1 = ref(2)
const rawD1 = ref(5)
const rawW2 = ref(1)
const rawN2 = ref(1)
const rawD2 = ref(2)

const fields = {
  w1: rawW1,
  n1: rawN1,
  d1: rawD1,
  w2: rawW2,
  n2: rawN2,
  d2: rawD2,
}

const modes = [
  { id: 'convert', label: 'Convert' },
  { id: 'add-regroup', label: 'Add (Regroup)' },
  { id: 'sub-borrow', label: 'Subtract (Borrow)' },
  { id: 'mult-div', label: 'Multiply & Divide' },
]

const operators = [
  { id: 'mul', label: 'Multiply (×)' },
  { id: 'div', label: 'Divide (÷)' },
]

const presets = [
  { id: 'convert', label: 'Convert: 3 2/5', mode: 'convert', w1: 3, n1: 2, d1: 5, w2: 1, n2: 1, d2: 2 },
  { id: 'regroup', label: 'Regrouping: 2 3/4 + 1 3/4', mode: 'add-regroup', w1: 2, n1: 3, d1: 4, w2: 1, n2: 3, d2: 4 },
  { id: 'borrow', label: 'Borrowing: 4 1/5 − 1 3/5', mode: 'sub-borrow', w1: 4, n1: 1, d1: 5, w2: 1, n2: 3, d2: 5 },
  { id: 'product', label: 'Mixed Product: 1 1/2 × 2 2/3', mode: 'mult-div', op: 'mul', w1: 1, n1: 1, d1: 2, w2: 2, n2: 2, d2: 3 },
  { id: 'divide', label: 'Mixed Quotient: 3 1/2 ÷ 1 1/4', mode: 'mult-div', op: 'div', w1: 3, n1: 1, d1: 2, w2: 1, n2: 1, d2: 4 },
]

const fieldLabels = {
  w1: 'Whole 1',
  n1: 'Num 1',
  d1: 'Den 1',
  w2: 'Whole 2',
  n2: 'Num 2',
  d2: 'Den 2',
}

function isDen(key) {
  return key === 'd1' || key === 'd2'
}

function fallback(key, value) {
  const n = Math.trunc(Number(value))
  if (!Number.isFinite(n)) return isDen(key) ? 1 : 0
  if (isDen(key)) return Math.min(12, Math.max(1, n))
  return Math.min(12, Math.max(0, n))
}

const w1 = computed(() => fallback('w1', rawW1.value))
const d1 = computed(() => fallback('d1', rawD1.value))
const w2 = computed(() => fallback('w2', rawW2.value))
const d2 = computed(() => fallback('d2', rawD2.value))
const n1 = computed(() => Math.min(fallback('n1', rawN1.value), Math.max(0, d1.value - 1)))
const n2 = computed(() => Math.min(fallback('n2', rawN2.value), Math.max(0, d2.value - 1)))

function limits(key) {
  if (key === 'n1') return { min: 0, max: Math.max(0, d1.value - 1) }
  if (key === 'n2') return { min: 0, max: Math.max(0, d2.value - 1) }
  if (isDen(key)) return { min: 1, max: 12 }
  return { min: 0, max: 12 }
}

function clampKey(key, value) {
  const { min, max } = limits(key)
  const n = Math.trunc(Number(value))
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

function syncNumerators() {
  rawN1.value = clampKey('n1', rawN1.value === '' ? 0 : rawN1.value)
  rawN2.value = clampKey('n2', rawN2.value === '' ? 0 : rawN2.value)
}

function onRawInput(key, event) {
  activePreset.value = null
  const next = event.target.value
  fields[key].value = next === '' ? '' : Number(next)
}

function commitPart(key) {
  fields[key].value = clampKey(key, fields[key].value)
  if (isDen(key)) syncNumerators()
}

function bump(key, delta) {
  activePreset.value = null
  const current = clampKey(key, fields[key].value === '' ? limits(key).min : fields[key].value)
  fields[key].value = clampKey(key, current + delta)
  if (isDen(key)) syncNumerators()
}

function loadPreset(preset) {
  activePreset.value = preset.id
  mode.value = preset.mode
  if (preset.op) operator.value = preset.op
  rawW1.value = preset.w1
  rawN1.value = preset.n1
  rawD1.value = preset.d1
  rawW2.value = preset.w2
  rawN2.value = preset.n2
  rawD2.value = preset.d2
}

function setMode(next) {
  mode.value = next
  const match = presets.find(
    (preset) =>
      preset.mode === next &&
      preset.w1 === w1.value &&
      preset.n1 === n1.value &&
      preset.d1 === d1.value &&
      preset.w2 === w2.value &&
      preset.n2 === n2.value &&
      preset.d2 === d2.value &&
      (preset.op == null || preset.op === operator.value),
  )
  activePreset.value = match ? match.id : null
}

function setOperator(next) {
  operator.value = next
  setMode(mode.value)
}

function mixedLatex(whole, num, den) {
  if (num === 0) return `${whole}`
  if (whole === 0) return `\\dfrac{${num}}{${den}}`
  return `${whole}\\dfrac{${num}}{${den}}`
}

function fracLatex(num, den) {
  return `\\dfrac{${num}}{${den}}`
}

function signedAnswer(num, den) {
  const reduced = reduceFraction(num, den)
  if (reduced.num < 0) {
    return `-${toKatexMixed(0, Math.abs(reduced.num), reduced.den).replace(/\\frac/g, '\\dfrac')}`
  }
  return toKatexMixed(0, reduced.num, reduced.den).replace(/\\frac/g, '\\dfrac')
}

function formula(latex, display = false) {
  return renderKatex(`$${latex}$`, display)
}

const model = computed(() => {
  const a = w1.value
  const b = n1.value
  const c = d1.value
  const d = w2.value
  const e = n2.value
  const f = d2.value
  const imp1 = a * c + b
  const imp2 = d * f + e
  const mixed1 = mixedLatex(a, b, c)
  const mixed2 = mixedLatex(d, e, f)
  const improper1 = fracLatex(imp1, c)
  const improper2 = fracLatex(imp2, f)

  const lcd = lcm(c, f)
  const n1Scaled = b * (lcd / c)
  const n2Scaled = e * (lcd / f)
  const sumNum = n1Scaled + n2Scaled
  const carry = Math.floor(sumNum / lcd)
  const addRemainder = sumNum % lcd
  const addAnswer = signedAnswer((a + d) * lcd + sumNum, lcd)

  const needBorrow = n1Scaled < n2Scaled
  const canBorrow = needBorrow && a >= 1
  const borrowedNum = canBorrow ? n1Scaled + lcd : n1Scaled
  const wholeAfterBorrow = canBorrow ? a - 1 : a
  const subDiffNum = borrowedNum - n2Scaled
  const subWhole = wholeAfterBorrow - d
  const leftValue = imp1 * (lcd / c)
  const rightValue = imp2 * (lcd / f)
  const subAnswer = signedAnswer(leftValue - rightValue, lcd)
  const borrowShort = needBorrow && a < 1

  const multiply = operator.value === 'mul'
  const divideByZero = !multiply && imp2 === 0
  const rawNum = multiply ? imp1 * imp2 : imp1 * f
  const rawDen = multiply ? c * f : c * imp2
  const productAnswer = divideByZero ? null : signedAnswer(rawNum, rawDen || 1)

  const addSteps = [
    `Write the problem: $${mixed1} + ${mixed2}$.`,
    c === f
      ? `The denominators already match ($${c}$). Add the fractions: $${fracLatex(b, c)} + ${fracLatex(e, f)} = ${fracLatex(sumNum, lcd)}$.`
      : `The LCD of $${c}$ and $${f}$ is $${lcd}$. Rewrite the fractions as $${fracLatex(n1Scaled, lcd)} + ${fracLatex(n2Scaled, lcd)} = ${fracLatex(sumNum, lcd)}$.`,
    carry > 0
      ? `$\\dfrac{${sumNum}}{${lcd}}$ makes ${carry === 1 ? '1 new whole' : `${carry} new wholes`}. Carry into $${a} + ${d}$: the whole becomes $${a + d + carry}$, remainder $${fracLatex(addRemainder, lcd)}$.`
      : `The fraction sum is smaller than 1 whole, so the wholes stay $${a + d}$.`,
    `Reduced mixed number: $${addAnswer}$.`,
  ]

  const subSteps = [
    `Write the problem: $${mixed1} - ${mixed2}$.`,
    c === f
      ? `Compare the fractions over $${c}$.`
      : `The LCD of $${c}$ and $${f}$ is $${lcd}$. Compare $${fracLatex(n1Scaled, lcd)}$ and $${fracLatex(n2Scaled, lcd)}$.`,
    borrowShort
      ? `The first fraction is smaller, and there is no whole number to break into $${lcd}$ slices.`
      : canBorrow
        ? `Borrow 1 from $${a}$. That whole becomes $${fracLatex(lcd, lcd)}$, so the minuend is $${mixedLatex(wholeAfterBorrow, borrowedNum, lcd)}$.`
        : `The first fraction is large enough, so no whole needs to be broken apart.`,
    borrowShort
      ? `The difference is $${subAnswer}$.`
      : subWhole < 0
        ? `The second mixed number is larger, so the difference is negative: $${subAnswer}$.`
        : `Subtract: $${wholeAfterBorrow} - ${d} = ${subWhole}$ and $${fracLatex(borrowedNum, lcd)} - ${fracLatex(n2Scaled, lcd)} = ${fracLatex(subDiffNum, lcd)}$. Reduced: $${subAnswer}$.`,
  ]

  const opSteps = divideByZero
    ? [
        `Write the problem: $${mixed1} \\div ${mixed2}$.`,
        'The divisor is 0. Step Whole 2 or Num 2 off zero before dividing.',
      ]
    : multiply
      ? [
          `Write the problem: $${mixed1} \\times ${mixed2}$.`,
          `Convert to improper fractions: $${mixed1} = ${improper1}$ and $${mixed2} = ${improper2}$.`,
          `Multiply straight across: $${improper1} \\times ${improper2} = ${fracLatex(rawNum, rawDen)}$.`,
          `Reduced mixed number: $${productAnswer}$.`,
        ]
      : [
          `Write the problem: $${mixed1} \\div ${mixed2}$.`,
          `Convert to improper fractions: $${mixed1} = ${improper1}$ and $${mixed2} = ${improper2}$.`,
          `Keep, change, and flip: $${improper1} \\times ${fracLatex(f, imp2)} = ${fracLatex(rawNum, rawDen)}$.`,
          `Reduced mixed number: $${productAnswer}$.`,
        ]

  let steps = addSteps
  let finalLatex = addAnswer
  let problem = `${mixed1} + ${mixed2}`
  if (mode.value === 'convert') {
    problem = `${mixed1} = ${improper1}`
    finalLatex = improper1
    steps = [
      `Number 1: $${mixed1} = ${a} \\times ${c} + ${b} = ${improper1}$.`,
      `Number 2: $${mixed2} = ${d} \\times ${f} + ${e} = ${improper2}$.`,
      `The slice count is the improper numerator. Grouping those slices back by the denominator returns the mixed number.`,
    ]
  } else if (mode.value === 'sub-borrow') {
    steps = subSteps
    finalLatex = subAnswer
    problem = `${mixed1} - ${mixed2}`
  } else if (mode.value === 'mult-div') {
    steps = opSteps
    finalLatex = divideByZero ? '\\text{undefined}' : productAnswer
    problem = multiply ? `${mixed1} \\times ${mixed2}` : `${mixed1} \\div ${mixed2}`
  }

  return {
    a,
    b,
    c,
    d,
    e,
    f,
    imp1,
    imp2,
    mixed1,
    mixed2,
    improper1,
    improper2,
    lcd,
    n1Scaled,
    n2Scaled,
    sumNum,
    carry,
    addRemainder,
    needBorrow,
    canBorrow,
    borrowShort,
    borrowedNum,
    wholeAfterBorrow,
    subDiffNum,
    subWhole,
    multiply,
    divideByZero,
    rawNum,
    rawDen,
    problem,
    steps,
    finalLatex,
  }
})

function toneClass(tone) {
  if (tone === 'a') return 'bg-[var(--color-primary)]'
  if (tone === 'b') return 'bg-[var(--color-accent)]'
  if (tone === 'keep') return 'bg-emerald-400'
  if (tone === 'drop') return 'bg-rose-500/70'
  return 'bg-slate-800'
}

const overflowBars = computed(() => {
  const { n1Scaled, n2Scaled, lcd, sumNum } = model.value
  const total = Math.max(sumNum, 1)
  const bars = []
  for (let start = 0; start < total; start += lcd) {
    const cells = []
    for (let i = 0; i < lcd; i += 1) {
      const index = start + i
      if (index < n1Scaled) cells.push('a')
      else if (index < n1Scaled + n2Scaled) cells.push('b')
      else cells.push('empty')
    }
    bars.push({ cells, full: cells.every((cell) => cell !== 'empty') })
  }
  return bars
})

const borrowBar = computed(() => {
  const { canBorrow, borrowedNum, subDiffNum, n1Scaled, n2Scaled, lcd, borrowShort } = model.value
  if (borrowShort) {
    return Array.from({ length: lcd }, (_, index) => (index < n1Scaled ? 'a' : 'empty'))
  }
  const total = canBorrow ? borrowedNum : lcd
  const kept = canBorrow ? subDiffNum : n1Scaled - n2Scaled
  const filled = canBorrow ? borrowedNum : n1Scaled
  return Array.from({ length: Math.max(total, 1) }, (_, index) => {
    if (index < kept) return 'keep'
    if (index < filled) return 'drop'
    return 'empty'
  })
})
</script>

<template>
  <div class="min-w-0 max-w-full space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Convert mixed numbers, regroup a fraction sum into a new whole, borrow a whole as slices, or multiply and divide by converting to improper fractions first.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Mixed number tool"
      @update:model-value="setMode"
    />

    <MathSegmentedControl
      v-if="mode === 'mult-div'"
      :model-value="operator"
      :options="operators"
      aria-label="Multiply or divide"
      @update:model-value="setOperator"
    />

    <div class="flex flex-wrap gap-1.5">
      <MathPresetChip
        v-for="preset in presets"
        :key="preset.id"
        :selected="activePreset === preset.id"
        @click="loadPreset(preset)"
      >
        {{ preset.label }}
      </MathPresetChip>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label v-for="key in ['w1', 'n1', 'd1', 'w2', 'n2', 'd2']" :key="key" class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">{{ fieldLabels[key] }}</span>
        <div class="mt-1 flex items-center gap-1">
          <button
            type="button"
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-slate-600 bg-slate-900/40 text-lg font-semibold text-slate-100 disabled:opacity-40"
            :disabled="clampKey(key, fields[key].value === '' ? limits(key).min : fields[key].value) <= limits(key).min"
            :aria-label="`Decrease ${fieldLabels[key]}`"
            @click="bump(key, -1)"
          >
            −
          </button>
          <input
            :value="fields[key].value"
            type="number"
            :min="limits(key).min"
            :max="limits(key).max"
            step="1"
            inputmode="numeric"
            class="w-full min-w-0 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-center font-mono text-[var(--color-text)]"
            :aria-label="fieldLabels[key]"
            @input="onRawInput(key, $event)"
            @blur="commitPart(key)"
          />
          <button
            type="button"
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-slate-600 bg-slate-900/40 text-lg font-semibold text-slate-100 disabled:opacity-40"
            :disabled="clampKey(key, fields[key].value === '' ? limits(key).min : fields[key].value) >= limits(key).max"
            :aria-label="`Increase ${fieldLabels[key]}`"
            @click="bump(key, 1)"
          >
            +
          </button>
        </div>
      </label>
    </div>

    <section v-if="mode === 'convert'" class="grid gap-4 lg:grid-cols-2">
      <article
        v-for="item in [
          { title: 'Number 1', whole: model.a, num: model.b, den: model.c, imp: model.imp1, mixed: model.mixed1, improper: model.improper1 },
          { title: 'Number 2', whole: model.d, num: model.e, den: model.f, imp: model.imp2, mixed: model.mixed2, improper: model.improper2 },
        ]"
        :key="item.title"
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4"
      >
        <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          {{ item.title }}
        </h3>
        <div class="overflow-x-auto max-w-full py-1" v-html="formula(item.mixed + ' = ' + item.improper, true)" />
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Wholes and fractional pieces</p>
        <div class="mt-2 flex items-center gap-2 overflow-x-auto max-w-full py-1" :aria-label="`${item.whole} wholes and ${item.num} of ${item.den}`">
          <div
            v-for="tile in item.whole"
            :key="`${item.title}-whole-${tile}`"
            class="h-10 w-10 shrink-0 rounded-[var(--radius-card)] bg-[var(--color-primary)]"
          />
          <div
            v-if="item.whole === 0"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-slate-600 text-xs text-[var(--color-muted)]"
          >
            0
          </div>
          <div class="flex h-10 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-slate-600">
            <div
              v-for="segment in item.den"
              :key="`${item.title}-part-${segment}`"
              class="h-full flex-1"
              :class="segment <= item.num ? 'bg-[var(--color-accent)]' : 'bg-slate-800'"
            />
          </div>
        </div>
        <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Improper slices ({{ item.imp }})
        </p>
        <div class="mt-2 flex gap-0.5 overflow-x-auto max-w-full py-1" :aria-label="`${item.imp} slices`">
          <div
            v-for="slice in item.imp"
            :key="`${item.title}-slice-${slice}`"
            class="h-6 w-3 shrink-0 rounded-sm bg-[var(--color-primary)]"
          />
          <div
            v-if="item.imp === 0"
            class="h-6 w-10 shrink-0 rounded-sm border border-dashed border-slate-600"
          />
        </div>
      </article>
    </section>

    <section v-else-if="mode === 'add-regroup'" class="space-y-4">
      <div class="grid gap-4 lg:grid-cols-2">
        <article
          v-for="item in [
            { title: 'Addend 1', whole: model.a, num: model.b, den: model.c, tone: 'bg-[var(--color-primary)]' },
            { title: 'Addend 2', whole: model.d, num: model.e, den: model.f, tone: 'bg-[var(--color-accent)]' },
          ]"
          :key="item.title"
          class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4"
        >
          <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">{{ item.title }}</h3>
          <div class="mt-2 flex items-center gap-2 overflow-x-auto max-w-full py-1">
            <div
              v-for="tile in item.whole"
              :key="`${item.title}-${tile}`"
              class="h-10 w-10 shrink-0 rounded-[var(--radius-card)]"
              :class="item.tone"
            />
            <div class="flex h-10 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-slate-600">
              <div
                v-for="segment in item.den"
                :key="segment"
                class="h-full flex-1"
                :class="segment <= item.num ? item.tone : 'bg-slate-800'"
              />
            </div>
          </div>
        </article>
      </div>

      <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Fractional overflow
        </h3>
        <p class="mt-2 text-sm text-[var(--color-muted)]">
          A filled bar is a new whole that carries into the whole-number sum.
        </p>
        <div class="mt-3 space-y-2">
          <div v-for="(bar, index) in overflowBars" :key="`overflow-${index}`" class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {{ bar.full ? `New whole ${index + 1}` : 'Remainder' }}
            </p>
            <div class="flex h-10 max-w-full overflow-hidden rounded-[var(--radius-card)] border border-slate-600">
              <div
                v-for="(cell, cellIndex) in bar.cells"
                :key="cellIndex"
                class="h-full flex-1"
                :class="toneClass(cell)"
              />
            </div>
          </div>
        </div>
      </article>
    </section>

    <section v-else-if="mode === 'sub-borrow'" class="space-y-4">
      <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Minuend
        </h3>
        <div class="mt-2 flex items-center gap-2 overflow-x-auto max-w-full py-1">
          <div
            v-for="tile in model.a"
            :key="`minuend-${tile}`"
            class="h-10 w-10 shrink-0 rounded-[var(--radius-card)] bg-[var(--color-primary)]"
            :class="model.canBorrow && tile === model.a ? 'ring-2 ring-amber-300' : ''"
          />
          <div
            v-if="model.a === 0"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-dashed border-slate-600 text-xs text-[var(--color-muted)]"
          >
            0
          </div>
          <div class="flex h-10 w-28 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-slate-600">
            <div
              v-for="segment in model.c"
              :key="`minuend-part-${segment}`"
              class="h-full flex-1"
              :class="segment <= model.b ? 'bg-[var(--color-primary)]' : 'bg-slate-800'"
            />
          </div>
        </div>
      </article>

      <article class="rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-amber-200">
          Break one whole into slices
        </h3>
        <p v-if="model.borrowShort" class="mt-2 text-sm text-amber-100">
          The first fraction is smaller than the second, and Whole 1 is 0, so there is no unit to split.
        </p>
        <p v-else-if="model.canBorrow" class="mt-2 text-sm text-[var(--color-text)]">
          One whole becomes {{ model.lcd }} slices. Rose slices are the amount taken away. Green slices stay.
        </p>
        <p v-else class="mt-2 text-sm text-[var(--color-text)]">
          The first fraction is already large enough. No whole is broken apart.
        </p>
        <div
          v-if="model.canBorrow"
          class="overflow-x-auto max-w-full py-1"
          v-html="formula('1 = ' + fracLatex(model.lcd, model.lcd), true)"
        />
        <div class="mt-2 flex h-10 max-w-full overflow-hidden rounded-[var(--radius-card)] border border-slate-600">
          <div
            v-for="(cell, index) in borrowBar"
            :key="`borrow-${index}`"
            class="h-full flex-1"
            :class="toneClass(cell)"
          />
        </div>
      </article>
    </section>

    <section v-else class="grid gap-3 sm:grid-cols-2">
      <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">1 · Mixed</p>
        <div class="overflow-x-auto max-w-full py-1" v-html="formula(model.mixed1 + ' , ' + model.mixed2, true)" />
      </article>
      <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">2 · Improper</p>
        <div class="overflow-x-auto max-w-full py-1" v-html="formula(model.improper1 + ' , ' + model.improper2, true)" />
      </article>
      <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">3 · Operation</p>
        <div
          v-if="model.divideByZero"
          class="overflow-x-auto max-w-full py-1 text-sm text-amber-200"
        >
          The divisor is 0. Step the second number off zero.
        </div>
        <div
          v-else
          class="overflow-x-auto max-w-full py-1"
          v-html="formula(model.multiply
            ? model.improper1 + ' \\times ' + model.improper2 + ' = ' + fracLatex(model.rawNum, model.rawDen)
            : model.improper1 + ' \\times ' + fracLatex(model.f, model.imp2) + ' = ' + fracLatex(model.rawNum, model.rawDen), true)"
        />
      </article>
      <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">4 · Reduced mixed</p>
        <div class="overflow-x-auto max-w-full py-1" v-html="formula(model.finalLatex, true)" />
      </article>
    </section>

    <section class="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Live Equality
      </h3>
      <div class="overflow-x-auto max-w-full py-1 text-lg" v-html="formula(model.problem, true)" />
      <ol class="mt-2 space-y-2">
        <li v-for="(step, index) in model.steps" :key="`eq-${index}`" class="flex gap-2 text-sm text-[var(--color-text)]">
          <span class="font-semibold text-[var(--color-muted)]">{{ index + 1 }}.</span>
          <div class="min-w-0 flex-1 overflow-x-auto max-w-full py-1" v-html="renderKatex(step)" />
        </li>
      </ol>
      <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Reduced mixed number
      </p>
      <div class="overflow-x-auto max-w-full py-1 text-lg" v-html="formula(model.finalLatex, true)" />
    </section>
  </div>
</template>
