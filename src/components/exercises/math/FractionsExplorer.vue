<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import { gcd, lcm, reduceFraction } from '../../../utils/fractionGenerator'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const operation = ref('add')
const rawN1 = ref(1)
const rawD1 = ref(4)
const rawN2 = ref(2)
const rawD2 = ref(4)
const activePreset = ref('like')

const fields = {
  n1: rawN1,
  d1: rawD1,
  n2: rawN2,
  d2: rawD2,
}

const operations = [
  { id: 'add', label: 'Addition (+)' },
  { id: 'sub', label: 'Subtraction (−)' },
  { id: 'mul', label: 'Multiplication (×)' },
  { id: 'div', label: 'Division (÷)' },
]

const presets = [
  { id: 'like', label: 'Like Denominators: 1/4 + 2/4', op: 'add', n1: 1, d1: 4, n2: 2, d2: 4 },
  { id: 'unlike', label: 'Unlike Denominators: 1/3 + 1/6', op: 'add', n1: 1, d1: 3, n2: 1, d2: 6 },
  { id: 'butterfly', label: 'Butterfly Subtraction: 3/4 − 1/3', op: 'sub', n1: 3, d1: 4, n2: 1, d2: 3 },
  { id: 'area', label: 'Area Model: 2/3 × 3/5', op: 'mul', n1: 2, d1: 3, n2: 3, d2: 5 },
  { id: 'kcf', label: 'Keep-Change-Flip: 3/4 ÷ 1/2', op: 'div', n1: 3, d1: 4, n2: 1, d2: 2 },
]

const fieldLabels = {
  n1: 'Numerator 1',
  d1: 'Denominator 1',
  n2: 'Numerator 2',
  d2: 'Denominator 2',
}

function clampPart(value) {
  const n = Math.trunc(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(12, n)
}

const n1 = computed(() => clampPart(rawN1.value))
const d1 = computed(() => clampPart(rawD1.value))
const n2 = computed(() => clampPart(rawN2.value))
const d2 = computed(() => clampPart(rawD2.value))

function fracLatex(num, den) {
  return `\\dfrac{${num}}{${den}}`
}

function signedFracLatex(num, den) {
  const sign = num < 0 ? '-' : ''
  return `${sign}\\dfrac{${Math.abs(num)}}{${Math.abs(den)}}`
}

function resultLatex(reduced) {
  const signed = signedFracLatex(reduced.num, reduced.den)
  if (reduced.den === 1) return `${signed} = ${reduced.num}`
  return signed
}

function lowestTermsStep(rawNum, rawDen, reduced) {
  const divisor = gcd(rawNum, rawDen)
  const final = resultLatex(reduced)
  if (divisor <= 1) return `Already in lowest terms: $${final}$.`
  return `Divide the numerator and the denominator by $${divisor}$: $${signedFracLatex(rawNum, rawDen)} = ${final}$.`
}

function barsFor(numerator, denominator) {
  const n = Math.max(0, Math.trunc(numerator))
  const d = Math.max(1, Math.trunc(denominator))
  const full = Math.floor(n / d)
  const remainder = n % d
  const bars = []
  for (let index = 0; index < full; index += 1) {
    bars.push({ segments: d, filled: d })
  }
  if (remainder !== 0 || full === 0) {
    bars.push({ segments: d, filled: remainder })
  }
  return bars
}

function wholeCount(numerator, denominator) {
  return numerator > denominator ? Math.floor(numerator / denominator) : 0
}

function shadeCount(numerator, denominator) {
  if (numerator > denominator) return numerator % denominator
  return numerator
}

function decomposeLatex(numerator, denominator) {
  const wholes = Math.floor(numerator / denominator)
  const remainder = numerator % denominator
  if (remainder === 0) return `${fracLatex(numerator, denominator)} = ${wholes}`
  return `${fracLatex(numerator, denominator)} = ${wholes} + ${fracLatex(remainder, denominator)}`
}

function onRawInput(key, event) {
  activePreset.value = null
  const next = event.target.value
  fields[key].value = next === '' ? '' : Number(next)
}

function commitPart(key) {
  fields[key].value = clampPart(fields[key].value)
}

function bump(key, delta) {
  activePreset.value = null
  fields[key].value = clampPart(clampPart(fields[key].value) + delta)
}

function loadPreset(preset) {
  activePreset.value = preset.id
  operation.value = preset.op
  rawN1.value = preset.n1
  rawD1.value = preset.d1
  rawN2.value = preset.n2
  rawD2.value = preset.d2
}

function setOperation(next) {
  operation.value = next
  const match = presets.find(
    (preset) =>
      preset.op === next &&
      preset.n1 === n1.value &&
      preset.d1 === d1.value &&
      preset.n2 === n2.value &&
      preset.d2 === d2.value,
  )
  activePreset.value = match ? match.id : null
}

const model = computed(() => {
  const a = n1.value
  const b = d1.value
  const c = n2.value
  const d = d2.value
  const op = operation.value
  const lcd = lcm(b, d)
  const n1Scaled = a * (lcd / b)
  const n2Scaled = c * (lcd / d)
  const sign = op === 'sub' ? -1 : 1
  const combinedNum = n1Scaled + sign * n2Scaled
  const cross1 = a * d
  const cross2 = b * c
  const butterflyNum = cross1 + sign * cross2
  const butterflyDen = b * d
  const reducedAdd = reduceFraction(combinedNum, lcd)
  const reducedButterfly = reduceFraction(butterflyNum, butterflyDen)
  const reducedMul = reduceFraction(a * c, b * d)
  const reducedDiv = reduceFraction(a * d, b * c)

  const symbol = { add: '+', sub: '-', mul: '\\times', div: '\\div' }[op]
  const problem = `${fracLatex(a, b)} ${symbol} ${fracLatex(c, d)}`
  const sameDenominators = b === d

  let reduced = reducedAdd
  let steps = []

  if (op === 'add' || op === 'sub') {
    const word = op === 'add' ? 'Add' : 'Subtract'
    const joiner = op === 'add' ? '+' : '-'
    reduced = reducedAdd
    steps = [
      `Write the problem: $${problem}$.`,
      sameDenominators
        ? `The denominators already match, so the common grid is the original strips. The LCD is $${lcd}$.`
        : `The LCD of $${b}$ and $${d}$ is $${lcd}$. Rewrite $${fracLatex(a, b)} = ${fracLatex(n1Scaled, lcd)}$ and $${fracLatex(c, d)} = ${fracLatex(n2Scaled, lcd)}$.`,
      `${word} the numerators: $${fracLatex(`${n1Scaled} ${joiner} ${n2Scaled}`, lcd)} = ${signedFracLatex(combinedNum, lcd)}$.`,
      lowestTermsStep(combinedNum, lcd, reduced),
    ]
  } else if (op === 'mul') {
    reduced = reducedMul
    steps = [
      `Write the problem: $${problem}$.`,
      `Multiply across: $${fracLatex(`${a} \\times ${c}`, `${b} \\times ${d}`)} = ${fracLatex(a * c, b * d)}$.`,
      lowestTermsStep(a * c, b * d, reduced),
    ]
  } else {
    reduced = reducedDiv
    steps = [
      `Write the problem: $${problem}$.`,
      `Keep the first fraction, change $\\div$ to $\\times$, and flip the second: $${fracLatex(a, b)} \\times ${fracLatex(d, c)}$.`,
      `Multiply by the reciprocal: $${fracLatex(`${a} \\times ${d}`, `${b} \\times ${c}`)} = ${fracLatex(a * d, b * c)}$.`,
      lowestTermsStep(a * d, b * c, reduced),
    ]
  }

  const joiner = op === 'sub' ? '-' : '+'
  const inputStrips = [
    {
      id: 'fraction-1',
      title: 'Fraction 1',
      latex: fracLatex(a, b),
      bars: barsFor(a, b),
      groupSize: 1,
      wholes: Math.floor(a / b),
      remainder: a % b,
      unit: b,
    },
    {
      id: 'fraction-2',
      title: 'Fraction 2',
      latex: fracLatex(c, d),
      bars: barsFor(c, d),
      groupSize: 1,
      wholes: Math.floor(c / d),
      remainder: c % d,
      unit: d,
    },
  ]

  const lcdStrips = [
    {
      id: 'lcd-1',
      title: 'Fraction 1 on the common grid',
      latex: fracLatex(n1Scaled, lcd),
      bars: barsFor(n1Scaled, lcd),
      groupSize: lcd / b,
    },
    {
      id: 'lcd-2',
      title: 'Fraction 2 on the common grid',
      latex: fracLatex(n2Scaled, lcd),
      bars: barsFor(n2Scaled, lcd),
      groupSize: lcd / d,
    },
  ]

  const shadeCols = shadeCount(a, b)
  const shadeRows = shadeCount(c, d)
  const cells = []
  for (let row = 0; row < d; row += 1) {
    for (let col = 0; col < b; col += 1) {
      const vertical = col < shadeCols
      const horizontal = row < shadeRows
      let tone = 'empty'
      if (vertical && horizontal) tone = 'both'
      else if (vertical) tone = 'vertical'
      else if (horizontal) tone = 'horizontal'
      cells.push({ key: `${row}-${col}`, tone })
    }
  }

  return {
    a,
    b,
    c,
    d,
    lcd,
    sameDenominators,
    n1Scaled,
    n2Scaled,
    cross1,
    cross2,
    butterflyDen,
    problem,
    steps,
    reduced,
    finalLatex: resultLatex(reduced),
    equationLatex: `${problem} = ${resultLatex(reduced)}`,
    negative: op === 'sub' && reduced.num < 0,
    inputStrips,
    lcdStrips,
    butterflyLatex: `\\dfrac{(${cross1}) ${joiner} (${cross2})}{${butterflyDen}} = ${resultLatex(reducedButterfly)}`,
    directLatex: `${fracLatex(a, b)} \\times ${fracLatex(c, d)} = ${fracLatex(`${a} \\times ${c}`, `${b} \\times ${d}`)}`,
    cells,
    shadeCols,
    shadeRows,
    wholes1: wholeCount(a, b),
    wholes2: wholeCount(c, d),
    improper1: a > b,
    improper2: c > d,
    decompose1: decomposeLatex(a, b),
    decompose2: decomposeLatex(c, d),
    areaLabel: `Unit area model with ${b} columns and ${d} rows. ${shadeCols} vertical slices and ${shadeRows} horizontal slices overlap in the double-shaded cells.`,
  }
})

function stripCaption(strip) {
  if (strip.wholes > 0 && strip.remainder > 0) {
    const noun = strip.wholes === 1 ? 'full bar' : 'full bars'
    return `${strip.wholes} ${noun} and ${strip.remainder} of ${strip.unit}`
  }
  if (strip.wholes > 0) {
    return strip.wholes === 1 ? '1 full bar' : `${strip.wholes} full bars`
  }
  return `${strip.remainder} of ${strip.unit} segments`
}

function segmentClass(segment, bar, groupSize) {
  const filled = segment <= bar.filled
  const grouped = groupSize > 1 && (segment - 1) % groupSize === 0 && segment !== 1
  return [
    filled ? 'bg-[var(--color-primary)]' : 'bg-slate-800',
    grouped ? 'border-l-2 border-slate-200' : 'border-l border-slate-700',
  ]
}
</script>

<template>
  <div class="min-w-0 max-w-full space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Add, subtract, multiply, and divide two fractions on one page. Change the operation, load a preset, or step the numerators and denominators from 1 to 12.
    </p>

    <MathSegmentedControl
      :model-value="operation"
      :options="operations"
      aria-label="Fraction operation"
      @update:model-value="setOperation"
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

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label v-for="key in ['n1', 'd1', 'n2', 'd2']" :key="key" class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">{{ fieldLabels[key] }}</span>
        <div class="mt-1 flex items-center gap-1">
          <button
            type="button"
            class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-card)] border border-slate-600 bg-slate-900/40 text-lg font-semibold text-slate-100 disabled:opacity-40"
            :disabled="clampPart(fields[key].value) <= 1"
            :aria-label="`Decrease ${fieldLabels[key]}`"
            @click="bump(key, -1)"
          >
            −
          </button>
          <input
            :value="fields[key].value"
            type="number"
            min="1"
            max="12"
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
            :disabled="clampPart(fields[key].value) >= 12"
            :aria-label="`Increase ${fieldLabels[key]}`"
            @click="bump(key, 1)"
          >
            +
          </button>
        </div>
      </label>
    </div>

    <section v-if="operation === 'add' || operation === 'sub'" class="space-y-4">
      <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Dual fraction strips
        </h3>
        <div class="mt-3 space-y-4">
          <div v-for="strip in model.inputStrips" :key="strip.id">
            <p class="text-sm font-semibold text-[var(--color-text)]">{{ strip.title }}</p>
            <div
              class="mt-1 max-w-full overflow-x-auto py-1"
              v-html="renderKatex('$' + strip.latex + '$')"
            />
            <div class="overflow-x-auto" :aria-label="`${strip.title}: ${strip.bars.length} bars`">
              <div class="flex w-max min-w-full gap-2">
                <div
                  v-for="(bar, barIndex) in strip.bars"
                  :key="`${strip.id}-${barIndex}`"
                  class="flex h-10 overflow-hidden rounded-[var(--radius-card)] border border-slate-600"
                  :style="{ minWidth: `${Math.max(bar.segments * 14, 112)}px` }"
                >
                  <div
                    v-for="segment in bar.segments"
                    :key="segment"
                    class="h-full flex-1"
                    :class="segmentClass(segment, bar, strip.groupSize)"
                  />
                </div>
              </div>
            </div>
            <p class="mt-1 text-xs text-[var(--color-muted)]">{{ stripCaption(strip) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Common denominator
        </h3>
        <p
          class="mt-2 max-w-full overflow-x-auto py-1 text-sm text-[var(--color-text)]"
          v-html="renderKatex(model.sameDenominators
            ? 'Denominators already match, so the common grid is the original strips.'
            : `Rewrite $${fracLatex(model.a, model.b)} = ${fracLatex(model.n1Scaled, model.lcd)}$ and $${fracLatex(model.c, model.d)} = ${fracLatex(model.n2Scaled, model.lcd)}$.`)"
        />
        <div class="mt-3 space-y-4">
          <div v-for="strip in model.lcdStrips" :key="strip.id">
            <p class="text-sm font-semibold text-[var(--color-text)]">{{ strip.title }}</p>
            <div
              class="mt-1 max-w-full overflow-x-auto py-1"
              v-html="renderKatex('$' + strip.latex + '$')"
            />
            <div class="overflow-x-auto">
              <div class="flex w-max min-w-full gap-2">
                <div
                  v-for="(bar, barIndex) in strip.bars"
                  :key="`${strip.id}-${barIndex}`"
                  class="flex h-10 overflow-hidden rounded-[var(--radius-card)] border border-slate-600"
                  :style="{ minWidth: `${Math.max(bar.segments * 12, 112)}px` }"
                >
                  <div
                    v-for="segment in bar.segments"
                    :key="segment"
                    class="h-full flex-1"
                    :class="segmentClass(segment, bar, strip.groupSize)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-amber-200">
          Butterfly method
        </h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <p class="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span v-html="renderKatex(`$(${model.a} \\cdot ${model.d}) = ${model.cross1}$`)" />
          </p>
          <p class="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-200">
            <span v-html="renderKatex(`$(${model.b} \\cdot ${model.c}) = ${model.cross2}$`)" />
          </p>
          <p class="inline-flex items-center rounded-full border border-slate-500/50 bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-200">
            <span v-html="renderKatex(`Common base $(${model.b} \\cdot ${model.d}) = ${model.butterflyDen}$`)" />
          </p>
        </div>
        <div
          class="mt-3 max-w-full overflow-x-auto py-1 text-[var(--color-text)]"
          v-html="renderKatex('$' + model.butterflyLatex + '$', true)"
        />
        <p class="mt-2 text-sm text-[var(--color-muted)]">
          The cross-multiply fraction reduces to the same answer as the common-denominator path.
        </p>
      </div>
    </section>

    <section v-else-if="operation === 'mul'" class="space-y-4">
      <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Area model
        </h3>
        <p class="mt-2 text-sm text-[var(--color-muted)]">
          Fraction 1 slices the unit vertically. Fraction 2 slices it horizontally. Double-shaded cells are the overlap inside one unit.
        </p>

        <div v-if="model.improper1 || model.improper2" class="mt-3 space-y-3">
          <p class="text-sm text-[var(--color-text)]">
            The grid shows the fractional part. The tiles count the wholes.
          </p>
          <div v-if="model.improper1">
            <div
              class="max-w-full overflow-x-auto py-1 text-sm"
              v-html="renderKatex('$' + model.decompose1 + '$')"
            />
            <div class="mt-1 flex gap-1 overflow-x-auto">
              <div
                v-for="tile in model.wholes1"
                :key="`whole-1-${tile}`"
                class="h-10 w-10 shrink-0 rounded-[var(--radius-card)] bg-[var(--color-primary)]"
                :aria-label="`Fraction 1 whole tile ${tile}`"
              />
            </div>
          </div>
          <div v-if="model.improper2">
            <div
              class="max-w-full overflow-x-auto py-1 text-sm"
              v-html="renderKatex('$' + model.decompose2 + '$')"
            />
            <div class="mt-1 flex gap-1 overflow-x-auto">
              <div
                v-for="tile in model.wholes2"
                :key="`whole-2-${tile}`"
                class="h-10 w-10 shrink-0 rounded-[var(--radius-card)] bg-[var(--color-accent)]"
                :aria-label="`Fraction 2 whole tile ${tile}`"
              />
            </div>
          </div>
        </div>

        <div
          class="mx-auto mt-4 grid w-full max-w-xs gap-px bg-slate-700 p-px"
          :style="{
            gridTemplateColumns: `repeat(${model.b}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${model.d}, minmax(0, 1fr))`,
            aspectRatio: '1 / 1',
          }"
          role="img"
          :aria-label="model.areaLabel"
        >
          <div
            v-for="cell in model.cells"
            :key="cell.key"
            :class="{
              'bg-slate-800': cell.tone === 'empty',
              'bg-[var(--color-primary)]': cell.tone === 'vertical',
              'bg-[var(--color-accent)]': cell.tone === 'horizontal',
              'bg-emerald-400': cell.tone === 'both',
            }"
          />
        </div>
        <ul class="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
          <li class="inline-flex items-center gap-1">
            <span class="inline-block h-3 w-3 rounded-sm bg-[var(--color-primary)]" />
            Fraction 1 vertical slices
          </li>
          <li class="inline-flex items-center gap-1">
            <span class="inline-block h-3 w-3 rounded-sm bg-[var(--color-accent)]" />
            Fraction 2 horizontal slices
          </li>
          <li class="inline-flex items-center gap-1">
            <span class="inline-block h-3 w-3 rounded-sm bg-emerald-400" />
            Double-shaded product
          </li>
        </ul>
        <div
          class="mt-3 max-w-full overflow-x-auto py-1"
          v-html="renderKatex('$' + model.directLatex + '$', true)"
        />
      </div>
    </section>

    <section v-else class="space-y-4">
      <div class="grid gap-3 sm:grid-cols-3">
        <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Card 1 · Keep</p>
          <p class="mt-2 text-sm text-[var(--color-text)]">Keep the first fraction.</p>
          <div
            class="mt-2 max-w-full overflow-x-auto py-1"
            v-html="renderKatex('$' + fracLatex(model.a, model.b) + '$', true)"
          />
        </article>
        <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Card 2 · Change</p>
          <p class="mt-2 text-sm text-[var(--color-text)]">Change division to multiplication.</p>
          <div
            class="mt-2 max-w-full overflow-x-auto py-1"
            v-html="renderKatex('$\\div \\rightarrow \\times$', true)"
          />
        </article>
        <article class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Card 3 · Flip</p>
          <p class="mt-2 text-sm text-[var(--color-text)]">Flip the second fraction to its reciprocal.</p>
          <div
            class="mt-2 max-w-full overflow-x-auto py-1 text-[var(--color-muted)] line-through decoration-slate-500"
            v-html="renderKatex('$' + fracLatex(model.c, model.d) + '$')"
          />
          <div
            :key="`${model.d}-${model.c}`"
            class="flip-recip max-w-full overflow-x-auto py-1"
            v-html="renderKatex('$' + fracLatex(model.d, model.c) + '$', true)"
          />
        </article>
      </div>
      <p class="inline-flex max-w-full items-center rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300">
        <span
          class="max-w-full overflow-x-auto py-1"
          v-html="renderKatex(`Dividing by $${fracLatex(model.c, model.d)}$ is the same as multiplying by the reciprocal $${fracLatex(model.d, model.c)}$.`)"
        />
      </p>
    </section>

    <div class="rounded-[var(--radius-card)] border border-slate-800 bg-slate-900/60 p-4 text-slate-100 [&_.katex]:text-inherit">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Live equality
      </p>
      <div
        class="mt-2 max-w-full overflow-x-auto py-1 text-lg"
        v-html="renderKatex('$' + model.equationLatex + '$', true)"
      />
      <ol class="mt-3 space-y-3">
        <li v-for="(step, index) in model.steps" :key="index" class="flex gap-3">
          <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-xs font-bold text-slate-100">
            {{ index + 1 }}
          </span>
          <div
            class="min-w-0 max-w-full flex-1 overflow-x-auto py-1 text-sm leading-relaxed text-slate-100"
            v-html="renderKatex(step)"
          />
        </li>
      </ol>
      <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Reduced fraction
      </p>
      <div
        class="mt-1 max-w-full overflow-x-auto py-1 text-lg"
        v-html="renderKatex('$' + model.finalLatex + '$', true)"
      />
      <p
        v-if="model.negative"
        class="mt-3 inline-flex max-w-full items-center rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-200"
      >
        <span
          class="max-w-full overflow-x-auto py-1"
          v-html="renderKatex(`This difference is negative: $${model.finalLatex}$.`)"
        />
      </p>
    </div>
  </div>
</template>

<style scoped>
.flip-recip {
  animation: fraction-flip 0.45s ease;
  transform-origin: center;
}

@keyframes fraction-flip {
  from {
    transform: rotateX(75deg);
    opacity: 0.35;
  }
  to {
    transform: rotateX(0deg);
    opacity: 1;
  }
}
</style>
