<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const presets = [
  { label: 'Large Distance', value: 420000 },
  { label: 'Hydrogen Radius', value: 0.000000000025 },
  { label: 'Custom', value: null },
]

const activePreset = ref(0)
const customValue = ref('2500000')
const shift = ref(0)

const original = computed(() => {
  if (presets[activePreset.value].value != null) return presets[activePreset.value].value
  const parsed = Number(customValue.value)
  return Number.isFinite(parsed) ? parsed : 0
})

/**
 * Format a number as a fixed decimal digit string with no e-notation and no ×10^n.
 * Uses exponential parts only to recover digits, then places the decimal explicitly
 * (critical for values like 2.5e-11 → 0.000000000025).
 */
function formatPlain(value) {
  if (!Number.isFinite(value)) return '0'
  if (value === 0) return '0'

  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const expStr = abs.toExponential(15)
  const [coeffPart, expPart] = expStr.split('e')
  const exp = Number(expPart)
  const [whole, frac = ''] = coeffPart.split('.')
  let digits = `${whole}${frac}`.replace(/0+$/, '')
  if (!digits) digits = '0'

  const pointPos = whole.length + exp

  let body
  if (pointPos <= 0) {
    body = `0.${'0'.repeat(-pointPos)}${digits}`
  } else if (pointPos >= digits.length) {
    body = `${digits}${'0'.repeat(pointPos - digits.length)}`
  } else {
    body = `${digits.slice(0, pointPos)}.${digits.slice(pointPos)}`
  }

  if (body.includes('.')) {
    body = body.replace(/\.?0+$/, '')
  }

  return sign + (body || '0')
}

function normalizeScientific(n) {
  const sign = n < 0 ? -1 : 1
  let abs = Math.abs(n)
  let naturalExp = 0

  while (abs >= 10) {
    abs /= 10
    naturalExp += 1
  }
  while (abs > 0 && abs < 1) {
    abs *= 10
    naturalExp -= 1
  }

  // Clean float noise on the scientific mantissa itself.
  abs = Number(abs.toPrecision(8))
  return { sign, sciMantissa: abs, naturalExp }
}

const analysis = computed(() => {
  const n = original.value
  if (!Number.isFinite(n) || n === 0) {
    return {
      mantissa: 0,
      mantissaPlain: '0',
      exponent: 0,
      latex: '0 = 0 \\times 10^{0}',
      inScientific: false,
    }
  }

  const { sign, sciMantissa, naturalExp } = normalizeScientific(n)
  const exponent = naturalExp + shift.value

  // Shift decimal opposite to power change; round before render + badge.
  let mantissa = sciMantissa * 10 ** -shift.value
  mantissa = Number(mantissa.toPrecision(8))
  const signedMantissa = sign * mantissa
  const absMantissa = Math.abs(mantissa)
  const inScientific = absMantissa >= 1 && absMantissa < 10

  const latex = `${formatPlain(n)} = ${formatPlain(signedMantissa)} \\times 10^{${exponent}}`

  return {
    mantissa: signedMantissa,
    mantissaPlain: formatPlain(signedMantissa),
    exponent,
    naturalExp,
    latex,
    inScientific,
  }
})

function selectPreset(index) {
  activePreset.value = index
  shift.value = 0
}

// ---------------------------------------------------------------------------
// Lesson 2-4 — Operations solver
// ---------------------------------------------------------------------------

const a1 = ref(1.5)
const n1 = ref(4)
const a2 = ref(4)
const n2 = ref(-6)
const op = ref('mul') // 'mul' | 'div' | 'add' | 'sub'
const activeOpPreset = ref('mul-drill')

const operators = [
  { id: 'mul', symbol: '×', label: 'Multiply' },
  { id: 'div', symbol: '÷', label: 'Divide' },
  { id: 'add', symbol: '+', label: 'Add' },
  { id: 'sub', symbol: '−', label: 'Subtract' },
]

const operatorOptions = operators.map((item) => ({
  id: item.id,
  label: item.symbol,
  title: item.label,
}))

const opPresets = [
  {
    id: 'mul-drill',
    label: 'Multiply (Drill)',
    a1: 1.5,
    n1: 4,
    a2: 4,
    n2: -6,
    op: 'mul',
  },
  {
    id: 'divide',
    label: 'Divide',
    a1: 6,
    n1: 9,
    a2: 2.4,
    n2: 3,
    op: 'div',
  },
  {
    id: 'add-unequal',
    label: 'Add (Unequal)',
    a1: 4.1,
    n1: 4,
    a2: 5.6,
    n2: 6,
    op: 'add',
  },
  {
    id: 'sub-equator',
    label: 'Subtract (Equator)',
    a1: 4,
    n1: 4,
    a2: 6.8,
    n2: 3,
    op: 'sub',
  },
]

function cleanMantissa(value) {
  if (!Number.isFinite(value)) return 0
  if (value === 0) return 0
  return Number(Number(value).toPrecision(8))
}

function sciLatex(a, n) {
  if (!Number.isFinite(a)) return '?'
  if (a === 0) return '0'
  return `${formatPlain(cleanMantissa(a))} \\times 10^{${n}}`
}

function parenSciLatex(a, n) {
  return `\\left(${sciLatex(a, n)}\\right)`
}

/**
 * Two-way normalization into 1 ≤ |a| < 10 (or zero).
 * Returns rounded mantissa/exponent plus a prose+KaTeX note for the breakdown.
 */
function normalizeResult(rawA, rawN) {
  let a = cleanMantissa(rawA)
  let n = Math.trunc(Number(rawN) || 0)

  if (!Number.isFinite(a) || a === 0) {
    return {
      a: 0,
      n: 0,
      inScientific: false,
      isZero: true,
      latex: '0',
      note: 'The combined coefficient is $0$, so the result is simply $0$.',
    }
  }

  const beforeA = a
  const beforeN = n
  const sign = a < 0 ? -1 : 1
  let abs = Math.abs(a)

  while (abs >= 10) {
    abs /= 10
    n += 1
  }
  while (abs > 0 && abs < 1) {
    abs *= 10
    n -= 1
  }

  abs = cleanMantissa(abs)
  a = sign * abs
  const inScientific = abs >= 1 && abs < 10

  let note
  if (cleanMantissa(beforeA) === a && beforeN === n && inScientific) {
    note = `Already in standard scientific notation: $${sciLatex(a, n)}$ with $1 \\le |a| < 10$.`
  } else if (Math.abs(beforeA) >= 10) {
    note = `Normalize: $|${formatPlain(cleanMantissa(beforeA))}| \\ge 10$, so shift the decimal left and raise the power — $${sciLatex(beforeA, beforeN)} = ${sciLatex(a, n)}$.`
  } else if (Math.abs(beforeA) > 0 && Math.abs(beforeA) < 1) {
    note = `Normalize: $0 < |${formatPlain(cleanMantissa(beforeA))}| < 1$, so shift the decimal right and lower the power — $${sciLatex(beforeA, beforeN)} = ${sciLatex(a, n)}$.`
  } else {
    note = `Normalized form: $${sciLatex(a, n)}$.`
  }

  return {
    a,
    n,
    inScientific,
    isZero: false,
    latex: sciLatex(a, n),
    note,
  }
}

function loadOpPreset(preset) {
  activeOpPreset.value = preset.id
  a1.value = preset.a1
  n1.value = preset.n1
  a2.value = preset.a2
  n2.value = preset.n2
  op.value = preset.op
}

function setOperator(next) {
  op.value = next
  activeOpPreset.value = null
}

const opsModel = computed(() => {
  const coeff1 = cleanMantissa(Number(a1.value))
  const exp1 = Math.trunc(Number(n1.value) || 0)
  const coeff2 = cleanMantissa(Number(a2.value))
  const exp2 = Math.trunc(Number(n2.value) || 0)
  const operator = op.value

  const opSymbol =
    operator === 'mul' ? '\\times' : operator === 'div' ? '\\div' : operator === 'add' ? '+' : '-'

  const leftLatex = parenSciLatex(coeff1, exp1)
  const rightLatex = parenSciLatex(coeff2, exp2)
  const expressionLatex = `${leftLatex} ${opSymbol} ${rightLatex}`

  if (operator === 'div' && coeff2 === 0) {
    return {
      invalid: true,
      message: 'Cannot divide by zero — enter a nonzero mantissa for Number 2.',
      steps: [],
      resultLatex: null,
      equationLatex: null,
      inScientific: false,
    }
  }

  if (operator === 'mul' || operator === 'div') {
    const rawCoeff =
      operator === 'mul' ? cleanMantissa(coeff1 * coeff2) : cleanMantissa(coeff1 / coeff2)
    const rawExp = operator === 'mul' ? exp1 + exp2 : exp1 - exp2
    const normalized = normalizeResult(rawCoeff, rawExp)

    const steps =
      operator === 'mul'
        ? [
            `Regroup coefficients and powers of $10$: $${leftLatex} \\times ${rightLatex} = \\left(${formatPlain(coeff1)} \\times ${formatPlain(coeff2)}\\right) \\times \\left(10^{${exp1}} \\times 10^{${exp2}}\\right)$.`,
            `Multiply coefficients and add exponents (product rule): $${formatPlain(coeff1)} \\times ${formatPlain(coeff2)} = ${formatPlain(rawCoeff)}$, and $10^{${exp1}} \\times 10^{${exp2}} = 10^{${rawExp}}$, so $${sciLatex(rawCoeff, rawExp)}$.`,
            normalized.note,
          ]
        : [
            `Regroup as a quotient of coefficients and a quotient of powers of $10$: $\\dfrac{${sciLatex(coeff1, exp1)}}{${sciLatex(coeff2, exp2)}} = \\left(\\dfrac{${formatPlain(coeff1)}}{${formatPlain(coeff2)}}\\right) \\times \\left(\\dfrac{10^{${exp1}}}{10^{${exp2}}}\\right)$.`,
            `Divide coefficients and subtract exponents (quotient rule): $${formatPlain(coeff1)} \\div ${formatPlain(coeff2)} = ${formatPlain(rawCoeff)}$, and $10^{${exp1}} \\div 10^{${exp2}} = 10^{${rawExp}}$, so $${sciLatex(rawCoeff, rawExp)}$.`,
            normalized.note,
          ]

    const resultLatex = normalized.isZero ? '0' : normalized.latex
    return {
      invalid: false,
      message: null,
      steps,
      resultLatex,
      equationLatex: `${expressionLatex} = ${resultLatex}`,
      inScientific: normalized.isZero ? false : normalized.inScientific,
    }
  }

  // Add / subtract — align to the larger power; never swap subtraction operands.
  const powersMatch = exp1 === exp2
  let a1Aligned = coeff1
  let a2Aligned = coeff2
  let commonExp = exp1
  const rewriteSteps = []

  if (powersMatch) {
    rewriteSteps.push(
      `Powers already match: both use $10^{${exp1}}$, so no rewrite is needed.`
    )
  } else if (exp1 > exp2) {
    commonExp = exp1
    a2Aligned = cleanMantissa(coeff2 * 10 ** (exp2 - exp1))
    rewriteSteps.push(
      `Powers do not match ($10^{${exp1}}$ vs $10^{${exp2}}$). Rewrite Number 2 to the larger power: $${sciLatex(coeff2, exp2)} = ${sciLatex(a2Aligned, commonExp)}$ (decimal shifts left by $${exp1 - exp2}$).`
    )
  } else {
    commonExp = exp2
    a1Aligned = cleanMantissa(coeff1 * 10 ** (exp1 - exp2))
    rewriteSteps.push(
      `Powers do not match ($10^{${exp1}}$ vs $10^{${exp2}}$). Rewrite Number 1 to the larger power: $${sciLatex(coeff1, exp1)} = ${sciLatex(a1Aligned, commonExp)}$ (decimal shifts left by $${exp2 - exp1}$).`
    )
  }

  const combined =
    operator === 'add'
      ? cleanMantissa(a1Aligned + a2Aligned)
      : cleanMantissa(a1Aligned - a2Aligned)

  const combineOp = operator === 'add' ? '+' : '-'
  const combineWord = operator === 'add' ? 'Add' : 'Subtract'
  const normalized = normalizeResult(combined, commonExp)

  const steps = [
    powersMatch
      ? `Compare powers of $10$: both exponents are $${exp1}$, so the coefficients can be combined directly.`
      : `Compare powers of $10$: $${exp1} \\neq ${exp2}$. Powers must match before you ${operator === 'add' ? 'add' : 'subtract'} coefficients.`,
    ...rewriteSteps,
    `${combineWord} the aligned coefficients and factor out the common power: $\\left(${formatPlain(a1Aligned)} ${combineOp} ${formatPlain(a2Aligned)}\\right) \\times 10^{${commonExp}} = ${sciLatex(combined, commonExp)}$.`,
    normalized.note,
  ]

  const resultLatex = normalized.isZero ? '0' : normalized.latex
  return {
    invalid: false,
    message: null,
    steps,
    resultLatex,
    equationLatex: `${expressionLatex} = ${resultLatex}`,
    inScientific: normalized.isZero ? false : normalized.inScientific,
  }
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Convert &amp; shift decimals, then multiply, divide, add, and subtract in scientific notation —
      including microscopic values like the hydrogen radius
      <span v-html="renderKatex('$2.5\\times 10^{-11}$')" />.
    </p>

    <!-- Section 1: Convert & Decimal Shift -->
    <section class="space-y-4">
      <h3 class="display text-lg tracking-wide text-[var(--color-text)]">
        📜 Lesson 2-3: Convert &amp; Decimal Shift
      </h3>

      <div class="flex flex-wrap gap-1.5">
        <MathPresetChip
          v-for="(preset, index) in presets"
          :key="preset.label"
          :selected="activePreset === index"
          @click="selectPreset(index)"
        >
          {{ preset.label }}
        </MathPresetChip>
      </div>

      <label v-if="activePreset === 2" class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Custom number</span>
        <input
          v-model="customValue"
          type="text"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>

      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">
          Exponent shift: {{ shift }}
        </span>
        <input
          v-model.number="shift"
          type="range"
          min="-12"
          max="12"
          step="1"
          class="mt-2 w-full"
        />
        <div class="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
          <span>More negative 10ⁿ</span>
          <span>Scientific sweet spot</span>
          <span>Larger 10ⁿ</span>
        </div>
      </label>

      <div class="rounded-[var(--radius-card)] border border-slate-800 bg-slate-900/60 p-4 text-slate-100 [&_.katex]:text-inherit">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Live equality
        </p>
        <div
          class="mt-2 max-w-full overflow-x-auto py-1 text-lg"
          v-html="renderKatex('$' + analysis.latex + '$', true)"
        />
        <p class="mt-3 text-sm text-[var(--color-muted)]">
          Mantissa:
          <span class="font-mono text-[var(--color-text)]">{{ analysis.mantissaPlain }}</span>
          · Power:
          <span class="font-mono text-[var(--color-text)]">10^{{ analysis.exponent }}</span>
        </p>
        <p
          v-if="analysis.inScientific"
          class="mt-2 inline-flex rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300"
        >
          Valid Scientific Notation (1 ≤ a &lt; 10)
        </p>
        <p
          v-else
          class="mt-2 inline-flex rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-200"
        >
          Equivalent Form (Non-Standard)
        </p>
      </div>
    </section>

    <div class="my-8 border-t border-slate-800" />

    <!-- Section 2: Scientific Operations -->
    <section class="space-y-4">
      <h3 class="display text-lg tracking-wide text-[var(--color-text)]">
        ⚡ Lesson 2-4: Operations (+, −, ×, ÷)
      </h3>

      <div class="flex flex-wrap gap-1.5">
        <MathPresetChip
          v-for="preset in opPresets"
          :key="preset.id"
          :selected="activeOpPreset === preset.id"
          @click="loadOpPreset(preset)"
        >
          {{ preset.label }}
        </MathPresetChip>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Number 1 mantissa (a₁)</span>
          <input
            v-model.number="a1"
            type="number"
            step="0.1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
            @input="activeOpPreset = null"
          />
        </label>
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Number 1 exponent (n₁)</span>
          <input
            v-model.number="n1"
            type="number"
            step="1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
            @input="activeOpPreset = null"
          />
        </label>

        <div class="block text-sm sm:col-span-2 lg:col-span-1">
          <span class="font-semibold text-[var(--color-muted)]">Operator</span>
          <div class="mt-1">
            <MathSegmentedControl
              :model-value="op"
              :options="operatorOptions"
              aria-label="Operation"
              @update:model-value="setOperator"
            />
          </div>
        </div>

        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Number 2 mantissa (a₂)</span>
          <input
            v-model.number="a2"
            type="number"
            step="0.1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
            @input="activeOpPreset = null"
          />
        </label>
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Number 2 exponent (n₂)</span>
          <input
            v-model.number="n2"
            type="number"
            step="1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
            @input="activeOpPreset = null"
          />
        </label>
      </div>

      <p
        v-if="opsModel.invalid"
        class="rounded-[var(--radius-card)] border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-sm font-semibold text-amber-200"
      >
        {{ opsModel.message }}
      </p>

      <template v-else>
        <div class="rounded-[var(--radius-card)] border border-slate-800 bg-slate-900/60 p-4 text-slate-100 [&_.katex]:text-inherit">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Live result
          </p>
          <div
            class="mt-2 max-w-full overflow-x-auto py-1 text-lg"
            v-html="renderKatex('$' + opsModel.equationLatex + '$', true)"
          />
          <p
            v-if="opsModel.inScientific"
            class="mt-2 inline-flex rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300"
          >
            Valid Scientific Notation (1 ≤ a &lt; 10)
          </p>
          <p
            v-else
            class="mt-2 inline-flex rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-200"
          >
            Equivalent Form (Non-Standard)
          </p>
        </div>

        <div class="space-y-3 rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4">
          <p class="display text-lg tracking-wide text-amber-200">
            Scroll Master's Breakdown
          </p>
          <ol class="space-y-3">
            <li
              v-for="(step, index) in opsModel.steps"
              :key="index"
              class="flex gap-3"
            >
              <span
                class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-200"
              >
                {{ index + 1 }}
              </span>
              <div
                class="min-w-0 max-w-full flex-1 overflow-x-auto py-1 text-sm leading-relaxed text-slate-100 [&_.katex]:text-inherit"
                v-html="renderKatex(step)"
              />
            </li>
          </ol>
        </div>
      </template>
    </section>
  </div>
</template>
