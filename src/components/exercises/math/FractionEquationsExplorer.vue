<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('lcd')
const revealedStep = ref(0)
const activePreset = ref('sum-6')
const variable = ref('x')
const leftTerms = ref([
  { num: 1, den: 2, variable: true },
  { num: 1, den: 3, variable: false },
])
const rightTerms = ref([{ num: 5, den: 6, variable: false }])

const modes = [
  { id: 'lcd', label: 'Name the LCD' },
  { id: 'vaporize', label: 'Vaporize' },
  { id: 'isolate', label: 'Isolate' },
]

const lcdPresets = [
  {
    id: 'sum-6',
    label: '$\\dfrac{x}{2}+\\dfrac{1}{3}=\\dfrac{5}{6}$',
    v: 'x',
    left: [
      { num: 1, den: 2, variable: true },
      { num: 1, den: 3, variable: false },
    ],
    right: [{ num: 5, den: 6, variable: false }],
  },
  {
    id: 'both-x',
    label: '$\\dfrac{x}{3}+\\dfrac{x}{6}=3$',
    v: 'x',
    left: [
      { num: 1, den: 3, variable: true },
      { num: 1, den: 6, variable: true },
    ],
    right: [{ num: 3, den: 1, variable: false }],
  },
]

const vaporPresets = [
  {
    id: 'two-thirds',
    label: '$\\dfrac{2}{3}x=8$',
    v: 'x',
    left: [{ num: 2, den: 3, variable: true }],
    right: [{ num: 8, den: 1, variable: false }],
  },
  {
    id: 'half-quarter',
    label: '$\\dfrac{x}{2}-\\dfrac{1}{4}=\\dfrac{3}{4}$',
    v: 'x',
    left: [
      { num: 1, den: 2, variable: true },
      { num: -1, den: 4, variable: false },
    ],
    right: [{ num: 3, den: 4, variable: false }],
  },
]

const isolatePresets = [
  {
    id: 'both-sides',
    label: '$\\dfrac{x}{4}-\\dfrac{1}{2}=\\dfrac{x}{2}-3$',
    v: 'x',
    left: [
      { num: 1, den: 4, variable: true },
      { num: -1, den: 2, variable: false },
    ],
    right: [
      { num: 1, den: 2, variable: true },
      { num: -3, den: 1, variable: false },
    ],
  },
  {
    id: 'plus-three',
    label: '$\\dfrac{x}{4}+3=\\dfrac{x}{2}$',
    v: 'x',
    left: [
      { num: 1, den: 4, variable: true },
      { num: 3, den: 1, variable: false },
    ],
    right: [{ num: 1, den: 2, variable: true }],
  },
]

const presets = computed(() => {
  if (mode.value === 'vaporize') return vaporPresets
  if (mode.value === 'isolate') return isolatePresets
  return lcdPresets
})

const maxStep = computed(() => {
  if (mode.value === 'lcd') return 1
  if (mode.value === 'vaporize') return 2
  return 3
})

function intOf(value) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.trunc(n) : 0
}

function varBody() {
  const raw = String(variable.value || 'x').trim()
  return /^[A-Za-z]$/.test(raw) ? raw : 'x'
}

function gcd(a, b) {
  let x = Math.abs(Math.trunc(a))
  let y = Math.abs(Math.trunc(b))
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function lcm(a, b) {
  const x = Math.abs(Math.trunc(a))
  const y = Math.abs(Math.trunc(b))
  if (!x || !y) return 0
  return (x / gcd(x, y)) * y
}

function piece(coeff, body, leading) {
  const c = intOf(coeff)
  if (c === 0) return ''
  const abs = Math.abs(c)
  const core = body ? (abs === 1 ? body : `${abs}${body}`) : String(abs)
  if (leading) return c < 0 ? `-${core}` : core
  return c < 0 ? `-${core}` : `+${core}`
}

function expression(terms) {
  const parts = []
  terms.forEach((term) => {
    const text = piece(term.coeff, term.body, parts.length === 0)
    if (text) parts.push(text)
  })
  return parts.length ? parts.join('') : '0'
}

function valueLatex(numer, denom) {
  if (!denom) return '?'
  let n = Math.trunc(numer)
  let d = Math.trunc(denom)
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  n /= g
  d /= g
  if (d === 1) return String(n)
  return n < 0 ? `-\\dfrac{${-n}}{${d}}` : `\\dfrac{${n}}{${d}}`
}

function cloneTerms(list) {
  return list.map((term) => ({ ...term }))
}

function onEdit() {
  activePreset.value = ''
  revealedStep.value = 0
}

function loadPreset(preset) {
  activePreset.value = preset.id
  variable.value = preset.v
  leftTerms.value = cloneTerms(preset.left)
  rightTerms.value = cloneTerms(preset.right)
  revealedStep.value = 0
}

function setMode(next) {
  mode.value = next
  const first = next === 'vaporize' ? vaporPresets[0] : next === 'isolate' ? isolatePresets[0] : lcdPresets[0]
  loadPreset(first)
}

function revealNext() {
  if (revealedStep.value >= maxStep.value) return
  revealedStep.value += 1
}

function resetKata() {
  revealedStep.value = 0
}

function normalized(term) {
  let num = intOf(term.num)
  let den = intOf(term.den)
  if (den < 0) {
    num = -num
    den = -den
  }
  return { num, den, variable: Boolean(term.variable) }
}

const model = computed(() => {
  const v = varBody()
  const left = leftTerms.value.map(normalized)
  const right = rightTerms.value.map(normalized)
  const dens = [...left, ...right].map((term) => term.den)
  const invalid = dens.some((den) => den === 0)
  const lcd = invalid ? 0 : dens.reduce((acc, den) => lcm(acc, den), 1)

  function scale(term) {
    if (!term.den || !lcd || lcd % term.den !== 0) return null
    return term.num * (lcd / term.den)
  }

  const scaledLeft = left.map((term) => ({ ...term, value: scale(term) }))
  const scaledRight = right.map((term) => ({ ...term, value: scale(term) }))
  const scaleFailed = [...scaledLeft, ...scaledRight].some((term) => term.value == null)

  let leftVar = 0
  let leftConst = 0
  let rightVar = 0
  let rightConst = 0
  scaledLeft.forEach((term) => {
    if (term.value == null) return
    if (term.variable) leftVar += term.value
    else leftConst += term.value
  })
  scaledRight.forEach((term) => {
    if (term.value == null) return
    if (term.variable) rightVar += term.value
    else rightConst += term.value
  })

  const denom = leftVar - rightVar
  const numer = rightConst - leftConst
  const solution = !scaleFailed && denom !== 0 ? valueLatex(numer, denom) : null

  function fracLatex(term) {
    const body = term.variable ? v : ''
    const n = term.num
    const d = term.den
    if (!d) return '?'
    if (d === 1) return piece(n, body, true) || '0'
    const abs = Math.abs(n)
    const core = body ? (abs === 1 ? body : `${abs}${body}`) : String(abs)
    const frac = `\\dfrac{${core}}{${d}}`
    return n < 0 ? `-${frac}` : frac
  }

  function sideLatex(terms, leadingAware) {
    if (!leadingAware) return terms.map((term) => fracLatex(term)).join('+')
    const parts = []
    terms.forEach((term) => {
      const raw = fracLatex(term)
      if (!raw || raw === '0') return
      if (!parts.length) parts.push(raw)
      else if (raw.startsWith('-')) parts.push(raw)
      else parts.push(`+${raw}`)
    })
    return parts.length ? parts.join('') : '0'
  }

  const original = `${sideLatex(left, true)}=${sideLatex(right, true)}`
  const multiplierNote = left.concat(right).map((term) => {
    if (!term.den || !lcd) return '?'
    return String(lcd / term.den)
  }).join(', ')
  const cleared = scaleFailed
    ? '\\text{denominator must divide the LCD}'
    : `${expression([
        { coeff: leftVar, body: v },
        { coeff: leftConst, body: '' },
      ])}=${expression([
        { coeff: rightVar, body: v },
        { coeff: rightConst, body: '' },
      ])}`
  const gathered = scaleFailed
    ? cleared
    : `${expression([{ coeff: denom, body: v }])}=${piece(numer, '', true) || '0'}`
  const isolated = solution ? `${v}=${solution}` : `${expression([{ coeff: denom, body: v }])}=\\text{no single solution}`

  const steps = [
    { title: 'Original equation', latex: original },
    { title: 'Name the LCD', latex: invalid ? '\\text{denominators must be nonzero}' : `\\mathrm{LCD}=${lcd},\\ \\text{multipliers }${multiplierNote}` },
    { title: 'Vaporize denominators', latex: cleared },
    { title: 'Isolate the variable', latex: isolated },
  ]

  let live = original
  if (revealedStep.value === 1) live = steps[1].latex
  if (revealedStep.value === 2) live = cleared
  if (revealedStep.value >= 3) live = isolated

  const tiles = [
    ...scaledLeft.map((term) => ({ ...term, side: 'Left' })),
    ...scaledRight.map((term) => ({ ...term, side: 'Right' })),
  ]

  return {
    invalid,
    lcd,
    tiles,
    live,
    vaporized: revealedStep.value >= 2,
    steps: steps.slice(0, revealedStep.value + 1),
    callout: 'Multiply every term by the LCD, including whole numbers. The denominators drop, and the equation stays equivalent.',
    fracLatex,
  }
})
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Name the least common denominator, vaporize every denominator with that multiplier, then isolate the variable.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Fraction equation tool"
      @update:model-value="setMode"
    />

    <div class="flex flex-wrap gap-1.5">
      <MathPresetChip
        v-for="preset in presets"
        :key="preset.id"
        :selected="activePreset === preset.id"
        @click="loadPreset(preset)"
      >
        <span v-html="renderKatex(preset.label)" />
      </MathPresetChip>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="min-w-0 space-y-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Left terms</p>
        <div v-for="(term, index) in leftTerms" :key="`L-${index}`" class="grid grid-cols-2 gap-2">
          <label class="block text-sm">
            <span class="font-semibold text-[var(--color-muted)]">Numerator {{ index + 1 }}</span>
            <input v-model.number="term.num" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
          </label>
          <label class="block text-sm">
            <span class="font-semibold text-[var(--color-muted)]">Denominator {{ index + 1 }}</span>
            <input v-model.number="term.den" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
          </label>
        </div>
      </div>
      <div class="min-w-0 space-y-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Right terms</p>
        <div v-for="(term, index) in rightTerms" :key="`R-${index}`" class="grid grid-cols-2 gap-2">
          <label class="block text-sm">
            <span class="font-semibold text-[var(--color-muted)]">Numerator {{ index + 1 }}</span>
            <input v-model.number="term.num" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
          </label>
          <label class="block text-sm">
            <span class="font-semibold text-[var(--color-muted)]">Denominator {{ index + 1 }}</span>
            <input v-model.number="term.den" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
          </label>
        </div>
      </div>
    </div>

    <label class="block max-w-[8rem] text-sm">
      <span class="font-semibold text-[var(--color-muted)]">Variable</span>
      <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
    </label>

    <div class="min-w-0 rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Denominator badges</p>
      <div class="mt-3 flex flex-wrap items-stretch gap-2">
        <div
          v-for="(term, index) in model.tiles"
          :key="`${term.side}-${index}`"
          class="flex min-h-24 flex-col items-center justify-center overflow-visible rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-3"
        >
          <p class="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">{{ term.side }}</p>
          <div class="overflow-visible px-1 py-2 text-center text-lg leading-none [&_.katex]:text-lg" v-html="renderKatex('$' + model.fracLatex(term) + '$')" />
          <p
            class="mt-1 inline-flex rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)] transition-opacity"
            :class="model.vaporized ? 'opacity-30 line-through' : ''"
          >
            ÷ {{ term.den || '?' }}
            <span v-if="model.vaporized && term.value != null"> → {{ term.value }}</span>
          </p>
        </div>
      </div>
      <p v-if="!model.invalid && revealedStep >= 1" class="mt-3 text-sm text-[var(--color-muted)]">
        LCD multiplier: {{ model.lcd }}
      </p>
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Live equality</p>
      <div class="overflow-x-auto max-w-full py-1 text-lg" v-html="renderKatex('$' + model.live + '$', true)" />
    </div>

    <div class="flex flex-wrap gap-2">
      <button type="button" class="math-btn math-btn--primary" :disabled="revealedStep >= maxStep" @click="revealNext">
        Reveal next step
      </button>
      <button type="button" class="math-btn math-btn--ghost" @click="resetKata">
        Reset kata
      </button>
    </div>

    <div class="space-y-3 rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4">
      <p class="display text-lg tracking-wide text-amber-200">Scroll Master's Breakdown</p>
      <p class="text-sm text-amber-100">{{ model.callout }}</p>
      <ol class="space-y-3">
        <li v-for="(step, index) in model.steps" :key="step.title" class="flex gap-3">
          <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-200">
            {{ index + 1 }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{{ step.title }}</p>
            <div class="overflow-x-auto max-w-full py-1 text-sm" v-html="renderKatex('$' + step.latex + '$', true)" />
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
