<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('positive')
const revealedStep = ref(0)
const activePreset = ref('p-3')
const variable = ref('x')
const multiplier = ref(3)
const inner = ref(4)
const rightSide = ref(21)
const extra = ref(4)
const multiplier2 = ref(3)
const inner2 = ref(-1)

const modes = [
  { id: 'positive', label: 'Positive' },
  { id: 'negative', label: 'Negative trap' },
  { id: 'expand', label: 'Expand and solve' },
]

const positivePresets = [
  { id: 'p-3', label: '$3(x+4)=21$', m: 3, inner: 4, right: 21, v: 'x' },
  { id: 'p-5', label: '$5(y-3)=20$', m: 5, inner: -3, right: 20, v: 'y' },
]

const negativePresets = [
  { id: 'n-5', label: '$-5(x-2)=20$', m: -5, inner: -2, right: 20, v: 'x' },
  { id: 'n-2', label: '$-2(y-5)=8$', m: -2, inner: -5, right: 8, v: 'y' },
]

const expandPresets = [
  { id: 'e-2', label: '$2(x+3)+4=3(x-1)$', m: 2, inner: 3, extra: 4, m2: 3, inner2: -1, v: 'x' },
  { id: 'e-4', label: '$4(x-2)=2(x+3)$', m: 4, inner: -2, extra: 0, m2: 2, inner2: 3, v: 'x' },
]

const presets = computed(() => {
  if (mode.value === 'negative') return negativePresets
  if (mode.value === 'expand') return expandPresets
  return positivePresets
})

const maxStep = computed(() => (mode.value === 'expand' ? 3 : 2))

function intOf(value) {
  const n = Number(value)
  return Number.isFinite(n) ? Math.trunc(n) : 0
}

function varBody() {
  const raw = String(variable.value || 'x').trim()
  return /^[A-Za-z]$/.test(raw) ? raw : 'x'
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

function parenBody(constant, name) {
  const c = intOf(constant)
  if (c === 0) return name
  if (c > 0) return `${name}+${c}`
  return `${name}-${Math.abs(c)}`
}

function factorTimes(factor, body) {
  const m = intOf(factor)
  if (m === 1) return `(${body})`
  if (m === -1) return `-(${body})`
  return `${m}(${body})`
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

function tileClass(coeff) {
  const n = intOf(coeff)
  if (n < 0) return 'border-rose-500/50 bg-rose-950/40 text-rose-100'
  if (n > 0) return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-100'
  return 'border-[var(--color-border)] text-[var(--color-muted)]'
}

function onEdit() {
  activePreset.value = ''
  revealedStep.value = 0
}

function applySimple(preset) {
  activePreset.value = preset.id
  multiplier.value = preset.m
  inner.value = preset.inner
  rightSide.value = preset.right
  variable.value = preset.v
  revealedStep.value = 0
}

function applyExpand(preset) {
  activePreset.value = preset.id
  multiplier.value = preset.m
  inner.value = preset.inner
  extra.value = preset.extra
  multiplier2.value = preset.m2
  inner2.value = preset.inner2
  variable.value = preset.v
  revealedStep.value = 0
}

function loadPreset(preset) {
  if (mode.value === 'expand') applyExpand(preset)
  else applySimple(preset)
}

function setMode(next) {
  mode.value = next
  revealedStep.value = 0
  const first = next === 'negative' ? negativePresets[0] : next === 'expand' ? expandPresets[0] : positivePresets[0]
  if (next === 'expand') applyExpand(first)
  else applySimple(first)
}

function revealNext() {
  if (revealedStep.value >= maxStep.value) return
  revealedStep.value += 1
}

function resetKata() {
  revealedStep.value = 0
}

const model = computed(() => {
  const v = varBody()
  const m = intOf(multiplier.value)
  const b = intOf(inner.value)
  const expand = mode.value === 'expand'
  const addOn = expand ? intOf(extra.value) : 0
  const m2 = expand ? intOf(multiplier2.value) : 0
  const b2 = expand ? intOf(inner2.value) : 0
  const right = expand ? 0 : intOf(rightSide.value)
  const varProduct = m
  const constProduct = m * b
  const varProduct2 = m2
  const constProduct2 = m2 * b2

  const originalLeft = addOn
    ? `${factorTimes(m, parenBody(b, v))}${piece(addOn, '', false)}`
    : factorTimes(m, parenBody(b, v))
  const originalRight = expand
    ? factorTimes(m2, parenBody(b2, v))
    : piece(right, '', true) || '0'
  const expandedLeft = expression([
    { coeff: varProduct, body: v },
    { coeff: constProduct, body: '' },
    { coeff: addOn, body: '' },
  ])
  const expandedRight = expand
    ? expression([
        { coeff: varProduct2, body: v },
        { coeff: constProduct2, body: '' },
      ])
    : piece(right, '', true) || '0'

  const leftVar = varProduct
  const leftConst = constProduct + addOn
  const rightVar = expand ? varProduct2 : 0
  const rightConst = expand ? constProduct2 : right
  const denom = leftVar - rightVar
  const numer = rightConst - leftConst
  const solution = denom === 0 ? null : valueLatex(numer, denom)
  const gathered = expression([
    { coeff: denom, body: v },
  ])
  const combinedEquation = `${expression([
    { coeff: leftVar, body: v },
    { coeff: leftConst, body: '' },
  ])}=${expression([
    { coeff: rightVar, body: v },
    { coeff: rightConst, body: '' },
  ])}`
  const isolated = solution
    ? `${combinedEquation}\\Rightarrow ${v}=${solution}`
    : `${gathered}=\\text{no single solution}`

  const steps = [
    { title: 'Original parentheses', latex: `${originalLeft}=${originalRight}` },
    {
      title: 'Write both products',
      latex: expand
        ? `${piece(varProduct, v, true) || '0'}${piece(constProduct, '', false)}\\text{ and }${piece(varProduct2, v, true) || '0'}${piece(constProduct2, '', false)}`
        : `${piece(varProduct, v, true) || '0'}${piece(constProduct, '', false)}`,
    },
    { title: 'Replace the parentheses', latex: `${expandedLeft}=${expandedRight}` },
  ]
  if (expand) {
    steps.push({ title: 'Combine and isolate', latex: isolated })
  }

  let live = `${originalLeft}=${originalRight}`
  if (revealedStep.value === 1) live = steps[1].latex
  if (revealedStep.value >= 2) live = `${expandedLeft}=${expandedRight}`
  if (expand && revealedStep.value >= 3) live = isolated

  let callout = 'Multiply the outside factor by each term inside. Signs travel with the factor.'
  if (m < 0 && b < 0) {
    callout = 'A negative factor times a subtracted term flips twice, so the constant becomes positive. $-5(x-2)=-5x+10$.'
  } else if (m < 0) {
    callout = 'A negative factor flips every sign inside the parentheses.'
  }

  return {
    m,
    b,
    varProduct,
    constProduct,
    m2,
    b2,
    varProduct2,
    constProduct2,
    expand,
    v,
    live,
    steps: steps.slice(0, revealedStep.value + 1),
    callout,
    showProducts: revealedStep.value >= 1,
  }
})

function signedLabel(coeff, body) {
  return piece(coeff, body, true) || '0'
}
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Watch the outside factor travel into each term. Rose tiles are negative products. Emerald tiles are positive products.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Distributive tool"
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

    <div v-if="mode !== 'expand'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Factor</span>
        <input v-model.number="multiplier" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Inside constant</span>
        <input v-model.number="inner" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right side</span>
        <input v-model.number="rightSide" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left factor</span>
        <input v-model.number="multiplier" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left inside</span>
        <input v-model.number="inner" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Added constant</span>
        <input v-model.number="extra" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right factor</span>
        <input v-model.number="multiplier2" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right inside</span>
        <input v-model.number="inner2" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div class="min-w-0 space-y-3 rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Sign propagation</p>
      <div class="flex min-w-0 flex-wrap items-center gap-2">
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.m)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.m, '') + '$')" />
        </span>
        <span class="text-[var(--color-muted)]" aria-hidden="true">→</span>
        <span class="inline-flex rounded-[var(--radius-card)] border border-emerald-500/50 bg-emerald-950/40 px-3 py-2 text-emerald-100">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + model.v + '$')" />
        </span>
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.b)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.b, '') + '$')" />
        </span>
      </div>
      <div v-if="model.showProducts" class="flex min-w-0 flex-wrap gap-2">
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.varProduct)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.varProduct, model.v) + '$')" />
        </span>
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.constProduct)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.constProduct, '') + '$')" />
        </span>
      </div>

      <div v-if="model.expand" class="flex min-w-0 flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-3">
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.m2)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.m2, '') + '$')" />
        </span>
        <span class="text-[var(--color-muted)]" aria-hidden="true">→</span>
        <span class="inline-flex rounded-[var(--radius-card)] border border-emerald-500/50 bg-emerald-950/40 px-3 py-2 text-emerald-100">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + model.v + '$')" />
        </span>
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.b2)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.b2, '') + '$')" />
        </span>
      </div>
      <div v-if="model.expand && model.showProducts" class="flex min-w-0 flex-wrap gap-2">
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.varProduct2)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.varProduct2, model.v) + '$')" />
        </span>
        <span class="inline-flex rounded-[var(--radius-card)] border px-3 py-2" :class="tileClass(model.constProduct2)">
          <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + signedLabel(model.constProduct2, '') + '$')" />
        </span>
      </div>
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
      <p class="text-sm text-amber-100" v-html="renderKatex(model.callout)" />
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
