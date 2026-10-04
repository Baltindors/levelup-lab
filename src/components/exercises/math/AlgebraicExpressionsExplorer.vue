<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'

const mode = ref('distribute')

// Distribute inputs
const mono = ref(-4.7)
const termA = ref(2)
const termB = ref(3.1)
const varName = ref('x')

// Factor inputs (coeff + power per cell)
const cell1Coeff = ref(-16)
const cell1Power = ref(1)
const cell2Coeff = ref(-52)
const cell2Power = ref(2)
const gcfSign = ref(-1)
const activeFactorPreset = ref('neg16')

const distributePresets = [
  {
    id: 'd-47',
    label: '$-4.7x(2x+3.1)$',
    mono: -4.7,
    termA: 2,
    termB: 3.1,
    varName: 'x',
  },
  {
    id: 'd-63',
    label: '$6.3g(4g-7)$',
    mono: 6.3,
    termA: 4,
    termB: -7,
    varName: 'g',
  },
]

const factorPresets = [
  {
    id: 'neg16',
    label: '$-16a-52a^{2}$',
    c1: -16,
    p1: 1,
    c2: -52,
    p2: 2,
    varName: 'a',
    sign: -1,
  },
  {
    id: 'z15',
    label: '$15z^{2}-25z^{5}$',
    c1: 15,
    p1: 2,
    c2: -25,
    p2: 5,
    varName: 'z',
    sign: 1,
  },
  {
    id: 'x81',
    label: '$81x-27x^{3}$',
    c1: 81,
    p1: 1,
    c2: -27,
    p2: 3,
    varName: 'x',
    sign: 1,
  },
]

function roundNice(n) {
  return parseFloat(Number(n).toFixed(4))
}

function fmt(n) {
  if (!Number.isFinite(n)) return '0'
  const rounded = roundNice(n)
  if (Number.isInteger(rounded)) return String(rounded)
  return String(rounded)
}

/** Single algebraic term with strict KaTeX rules. */
function termLatex(coeff, power, v, { withPlus = false } = {}) {
  const c = roundNice(coeff)
  if (c === 0) return withPlus ? '+0' : '0'

  const abs = Math.abs(c)
  const signPrefix = c < 0 ? '-' : withPlus ? '+' : ''
  const absStr = fmt(abs)
  const name = (v || 'x').trim() || 'x'
  const p = Math.max(0, Math.floor(Number(power) || 0))

  if (p === 0) return `${signPrefix}${absStr}`

  const varPart = p === 1 ? name : `${name}^{${p}}`
  if (abs === 1) return `${signPrefix}${varPart}`
  return `${signPrefix}${absStr}${varPart}`
}

/** Join terms with clean signs (never +−). */
function sumLatex(terms) {
  const parts = []
  for (let i = 0; i < terms.length; i += 1) {
    const { coeff, power, v } = terms[i]
    const c = roundNice(coeff)
    if (c === 0) continue
    if (!parts.length) {
      parts.push(termLatex(c, power, v))
    } else {
      parts.push(termLatex(c, power, v, { withPlus: true }))
    }
  }
  return parts.length ? parts.join('') : '0'
}

function tileClass(coeff) {
  return Number(coeff) < 0
    ? 'border-rose-500/50 bg-rose-950/40 text-rose-200'
    : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
}

function gcdInt(a, b) {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function setMode(next) {
  mode.value = next
  if (next === 'factor') {
    loadFactorPreset(factorPresets[0])
  } else {
    loadDistributePreset(distributePresets[0])
  }
}

function loadDistributePreset(preset) {
  mono.value = preset.mono
  termA.value = preset.termA
  termB.value = preset.termB
  varName.value = preset.varName
}

function loadFactorPreset(preset) {
  activeFactorPreset.value = preset.id
  cell1Coeff.value = preset.c1
  cell1Power.value = preset.p1
  cell2Coeff.value = preset.c2
  cell2Power.value = preset.p2
  varName.value = preset.varName
  gcfSign.value = preset.sign
}

const model = computed(() => {
  const v = (varName.value || 'x').trim() || 'x'

  if (mode.value === 'factor') {
    const c1 = roundNice(Number(cell1Coeff.value))
    const c2 = roundNice(Number(cell2Coeff.value))
    const p1 = Math.max(0, Math.floor(Number(cell1Power.value) || 0))
    const p2 = Math.max(0, Math.floor(Number(cell2Power.value) || 0))
    const invalid = c1 === 0 || c2 === 0

    const numericGcf = invalid ? 0 : gcdInt(c1, c2)
    const varPower = Math.min(p1, p2)
    const heightCoeff = gcfSign.value * numericGcf

    const w1Coeff = invalid || heightCoeff === 0 ? NaN : roundNice(c1 / heightCoeff)
    const w2Coeff = invalid || heightCoeff === 0 ? NaN : roundNice(c2 / heightCoeff)
    const w1Power = p1 - varPower
    const w2Power = p2 - varPower

    const heightLatex = termLatex(heightCoeff, varPower, v)
    const cell1Latex = termLatex(c1, p1, v)
    const cell2Latex = termLatex(c2, p2, v)
    const cellsSum = sumLatex([
      { coeff: c1, power: p1, v },
      { coeff: c2, power: p2, v },
    ])

    const width1Latex = invalid
      ? '?'
      : termLatex(w1Coeff, w1Power, v, { withPlus: w1Coeff >= 0 })
    const width2Latex = invalid
      ? '?'
      : termLatex(w2Coeff, w2Power, v, { withPlus: w2Coeff >= 0 })

    const width1InParen = invalid ? '?' : termLatex(w1Coeff, w1Power, v)
    const width2InParen = invalid
      ? '?'
      : termLatex(w2Coeff, w2Power, v, { withPlus: true })

    const factoredInner = `${width1InParen}${width2InParen}`
    const equationLatex = invalid
      ? `${cellsSum}=\\text{(enter nonzero cell coefficients)}`
      : `${cellsSum}=${heightLatex}\\left(${factoredInner}\\right)`

    const varGcfLatex =
      varPower === 0
        ? '\\text{none (constant GCF)}'
        : termLatex(1, varPower, v)

    const is81Preset =
      activeFactorPreset.value === 'x81' ||
      (c1 === 81 && p1 === 1 && c2 === -27 && p2 === 3 && v === 'x')
    const steps = invalid
      ? [
          'Enter two nonzero cell coefficients to factor.',
        ]
      : [
          is81Preset
            ? `Number GCF: $\\gcd(${fmt(Math.abs(c1))},${fmt(Math.abs(c2))})=${fmt(numericGcf)}$. Use the sign toggle for $\\pm$. Celebrate the complete factor $${fmt(numericGcf)}$ — stopping at $9$ leaves a common $3$ inside (incomplete on an exam).`
            : `Number GCF: greatest whole-number factor of $|${fmt(c1)}|$ and $|${fmt(c2)}|$ is $${fmt(numericGcf)}$. Use $[+\\ \\mathrm{GCF}]$ / $[-\\ \\mathrm{GCF}]$ for the sign.`,
          varPower === 0
            ? `Variable GCF: no shared positive power — height is the constant $${termLatex(heightCoeff, 0, v)}$.`
            : `Variable GCF: lowest shared power is $${varGcfLatex}$, so height is $${heightLatex}$.`,
          `Division: $\\dfrac{${cell1Latex}}{${heightLatex}}=${width1Latex}$ and $\\dfrac{${cell2Latex}}{${heightLatex}}=${width2Latex}$.`,
          is81Preset
            ? `Factored form (complete): $${heightLatex}\\left(${factoredInner}\\right)$. Contrast incomplete $9x(9-3x^{2})$, which still shares a factor of $3$.`
            : `Factored form: $${heightLatex}\\left(${factoredInner}\\right)$.`,
        ]

    return {
      mode: 'factor',
      invalid,
      heightLatex,
      width1Latex,
      width2Latex,
      cell1Latex,
      cell2Latex,
      equationLatex,
      heightCoeff,
      width1Coeff: invalid ? 0 : w1Coeff,
      width2Coeff: invalid ? 0 : w2Coeff,
      cell1Coeff: c1,
      cell2Coeff: c2,
      steps,
      teachCallout: is81Preset
        ? 'True GCF is $27x$, giving $27x(3-x^{2})$. The review sheet’s $9x(9-3x^{2})$ is incomplete factorization.'
        : null,
    }
  }

  // Distribute
  const m = roundNice(Number(mono.value))
  const a = roundNice(Number(termA.value))
  const b = roundNice(Number(termB.value))
  const cell1 = roundNice(m * a)
  const cell2 = roundNice(m * b)

  const heightLatex = termLatex(m, 1, v)
  const width1Latex = termLatex(a, 1, v, { withPlus: a >= 0 })
  const width2Latex = termLatex(b, 0, v, { withPlus: b >= 0 })
  const width1InParen = termLatex(a, 1, v)
  const width2InParen = termLatex(b, 0, v, { withPlus: true })
  const cell1Latex = termLatex(cell1, 2, v)
  const cell2Latex = termLatex(cell2, 1, v)
  const expanded = sumLatex([
    { coeff: cell1, power: 2, v },
    { coeff: cell2, power: 1, v },
  ])

  const equationLatex = `${heightLatex}\\left(${width1InParen}${width2InParen}\\right)=${expanded}`

  const steps = [
    `Multiply coefficients and add exponents for the first term: $(${fmt(m)})(${fmt(a)})$ and $${v}^{1}\\cdot ${v}^{1}=${v}^{2}$ → $${cell1Latex}$.`,
    `Multiply coefficients for the second term: $(${fmt(m)})(${fmt(b)})$ → $${cell2Latex}$.`,
    `Combine into expanded form: $${expanded}$.`,
  ]

  return {
    mode: 'distribute',
    invalid: false,
    heightLatex,
    width1Latex,
    width2Latex,
    cell1Latex,
    cell2Latex,
    equationLatex,
    heightCoeff: m,
    width1Coeff: a,
    width2Coeff: b,
    cell1Coeff: cell1,
    cell2Coeff: cell2,
    steps,
    teachCallout: null,
  }
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Lesson 2-6 Distribute (outside → in) and Lesson 2-7 Factor GCF (inside → out). Use presets from the exam review scroll.
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="theme-pill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
        :class="
          mode === 'distribute'
            ? 'bg-[var(--color-primary)] text-white'
            : 'border border-[var(--color-border)] text-[var(--color-primary)]'
        "
        @click="setMode('distribute')"
      >
        Distribute
      </button>
      <button
        type="button"
        class="theme-pill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
        :class="
          mode === 'factor'
            ? 'bg-[var(--color-primary)] text-white'
            : 'border border-[var(--color-border)] text-[var(--color-primary)]'
        "
        @click="setMode('factor')"
      >
        Factor GCF
      </button>
    </div>

    <!-- Mode-scoped presets -->
    <div class="flex flex-wrap gap-2">
      <template v-if="mode === 'distribute'">
        <button
          v-for="preset in distributePresets"
          :key="preset.id"
          type="button"
          class="theme-pill border border-amber-500/40 bg-amber-950/20 px-3 py-1.5 text-xs font-semibold text-amber-100"
          @click="loadDistributePreset(preset)"
        >
          <span v-html="renderKatex(preset.label)" />
        </button>
      </template>
      <template v-else>
        <button
          v-for="preset in factorPresets"
          :key="preset.id"
          type="button"
          class="theme-pill border px-3 py-1.5 text-xs font-semibold"
          :class="
            activeFactorPreset === preset.id
              ? 'border-amber-400 bg-amber-500/20 text-amber-100'
              : 'border-amber-500/40 bg-amber-950/20 text-amber-100'
          "
          @click="loadFactorPreset(preset)"
        >
          <span v-html="renderKatex(preset.label)" />
        </button>
      </template>
    </div>

    <!-- Inputs -->
    <div v-if="mode === 'distribute'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Monomial coeff</span>
        <input
          v-model.number="mono"
          type="number"
          step="0.1"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Binomial coeff A (…v)</span>
        <input
          v-model.number="termA"
          type="number"
          step="0.1"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Binomial coeff B (const)</span>
        <input
          v-model.number="termB"
          type="number"
          step="0.1"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input
          v-model="varName"
          type="text"
          maxlength="3"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
    </div>

    <div v-else class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="theme-pill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
          :class="
            gcfSign === 1
              ? 'bg-emerald-600 text-white'
              : 'border border-[var(--color-border)] text-[var(--color-muted)]'
          "
          @click="gcfSign = 1"
        >
          + GCF
        </button>
        <button
          type="button"
          class="theme-pill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
          :class="
            gcfSign === -1
              ? 'bg-rose-700 text-white'
              : 'border border-[var(--color-border)] text-[var(--color-muted)]'
          "
          @click="gcfSign = -1"
        >
          − GCF
        </button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Cell 1 coeff</span>
          <input
            v-model.number="cell1Coeff"
            type="number"
            step="1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
          />
        </label>
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Cell 1 power</span>
          <input
            v-model.number="cell1Power"
            type="number"
            min="0"
            step="1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
          />
        </label>
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Cell 2 coeff</span>
          <input
            v-model.number="cell2Coeff"
            type="number"
            step="1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
          />
        </label>
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Cell 2 power</span>
          <input
            v-model.number="cell2Power"
            type="number"
            min="0"
            step="1"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
          />
        </label>
        <label class="block text-sm">
          <span class="font-semibold text-[var(--color-muted)]">Variable</span>
          <input
            v-model="varName"
            type="text"
            maxlength="3"
            class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
          />
        </label>
      </div>
    </div>

    <p v-if="model.invalid" class="text-sm font-semibold text-amber-200">
      Enter nonzero coefficients for both cells to compute the GCF and widths.
    </p>

    <!-- Area model -->
    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
      <div
        class="mx-auto grid w-full max-w-lg gap-2"
        style="grid-template-columns: auto 1fr 1fr"
        role="img"
        :aria-label="mode === 'factor' ? 'Factor GCF area model' : 'Distribute area model'"
      >
        <div class="min-h-[2.5rem]" />
        <div
          class="flex min-h-[2.5rem] items-center justify-center rounded-[var(--radius-card)] border px-2 py-2 text-center"
          :class="tileClass(model.width1Coeff)"
        >
          <span v-html="renderKatex('$' + model.width1Latex + '$')" />
        </div>
        <div
          class="flex min-h-[2.5rem] items-center justify-center rounded-[var(--radius-card)] border px-2 py-2 text-center"
          :class="tileClass(model.width2Coeff)"
        >
          <span v-html="renderKatex('$' + model.width2Latex + '$')" />
        </div>

        <div
          class="flex min-h-[6.5rem] items-center justify-center rounded-[var(--radius-card)] border px-2 py-3 text-center"
          :class="tileClass(model.heightCoeff)"
        >
          <span v-html="renderKatex('$' + model.heightLatex + '$')" />
        </div>
        <div
          class="flex min-h-[6.5rem] items-center justify-center rounded-[var(--radius-card)] border-2 px-2 py-3 text-center"
          :class="tileClass(model.cell1Coeff)"
        >
          <span v-html="renderKatex('$' + model.cell1Latex + '$')" />
        </div>
        <div
          class="flex min-h-[6.5rem] items-center justify-center rounded-[var(--radius-card)] border-2 px-2 py-3 text-center"
          :class="tileClass(model.cell2Coeff)"
        >
          <span v-html="renderKatex('$' + model.cell2Latex + '$')" />
        </div>
      </div>
      <p class="mt-2 text-xs text-[var(--color-muted)]">
        Dimensions sit outside the rectangle. Emerald = positive; rose = negative.
      </p>
    </div>

    <div class="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <div v-html="renderKatex('$' + model.equationLatex + '$', true)" />
    </div>

    <div class="space-y-3 rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4">
      <p class="display text-lg tracking-wide text-amber-200">
        Scroll Master's Breakdown
      </p>
      <p
        v-if="model.teachCallout"
        class="rounded-[var(--radius-card)] border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100"
        v-html="renderKatex(model.teachCallout)"
      />
      <ol class="space-y-3">
        <li
          v-for="(step, index) in model.steps"
          :key="index"
          class="flex gap-3"
        >
          <span
            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-200"
          >
            {{ index + 1 }}
          </span>
          <div
            class="min-w-0 flex-1 pt-0.5 text-sm leading-relaxed text-[var(--color-text)]"
            v-html="renderKatex(step)"
          />
        </li>
      </ol>
    </div>
  </div>
</template>
