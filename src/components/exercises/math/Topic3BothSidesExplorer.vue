<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('balance')
const revealedStep = ref(0)
const activePreset = ref('b-2')
const variable = ref('x')
const leftVar = ref(2)
const leftConst = ref(21)
const rightVar = ref(7)
const rightConst = ref(6)

const modes = [
  { id: 'balance', label: 'Collect variables' },
  { id: 'collapse', label: 'Move constants' },
]

const balancePresets = [
  { id: 'b-2', label: '$2x+21=7x+6$', leftVar: 2, leftConst: 21, rightVar: 7, rightConst: 6, v: 'x' },
  { id: 'b-5', label: '$5x=2x+12$', leftVar: 5, leftConst: 0, rightVar: 2, rightConst: 12, v: 'x' },
  { id: 'b-4', label: '$4x+18=10x$', leftVar: 4, leftConst: 18, rightVar: 10, rightConst: 0, v: 'x' },
]

const collapsePresets = [
  { id: 'k-4', label: '$4x+7=2x+15$', leftVar: 4, leftConst: 7, rightVar: 2, rightConst: 15, v: 'x' },
  { id: 'k-7', label: '$7a-8=3a+12$', leftVar: 7, leftConst: -8, rightVar: 3, rightConst: 12, v: 'a' },
  { id: 'k-5', label: '$5x+6=x+18$', leftVar: 5, leftConst: 6, rightVar: 1, rightConst: 18, v: 'x' },
]

const presets = computed(() => (mode.value === 'collapse' ? collapsePresets : balancePresets))
const maxStep = computed(() => (mode.value === 'collapse' ? 3 : 2))

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

function loadPreset(preset) {
  activePreset.value = preset.id
  leftVar.value = preset.leftVar
  leftConst.value = preset.leftConst
  rightVar.value = preset.rightVar
  rightConst.value = preset.rightConst
  variable.value = preset.v
  revealedStep.value = 0
}

function setMode(next) {
  mode.value = next
  loadPreset(next === 'collapse' ? collapsePresets[0] : balancePresets[0])
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
  const step = revealedStep.value
  const lv = intOf(leftVar.value)
  const lc = intOf(leftConst.value)
  const rv = intOf(rightVar.value)
  const rc = intOf(rightConst.value)
  const movedVar = lv - rv
  const movedConst = rc - lc
  const solution = movedVar === 0 ? null : valueLatex(movedConst, movedVar)

  const startLeft = expression([
    { coeff: lv, body: v },
    { coeff: lc, body: '' },
  ])
  const startRight = expression([
    { coeff: rv, body: v },
    { coeff: rc, body: '' },
  ])
  const balancedLeft = expression([
    { coeff: movedVar, body: v },
    { coeff: lc, body: '' },
  ])
  const collapsedLeft = expression([{ coeff: movedVar, body: v }])
  const collapsedRight = piece(movedConst, '', true) || '0'

  if (mode.value === 'balance') {
    const leftChips = (
      step >= 1
        ? [
            { coeff: movedVar, body: v },
            { coeff: lc, body: '' },
          ]
        : [
            { coeff: lv, body: v },
            { coeff: lc, body: '' },
          ]
    ).filter((chip) => chip.coeff !== 0)
    const rightChips = (
      step >= 1
        ? [{ coeff: rc, body: '' }]
        : [
            { coeff: rv, body: v },
            { coeff: rc, body: '' },
          ]
    ).filter((chip) => chip.coeff !== 0)
    const live =
      step >= 2 && solution
        ? `${v}=${solution}`
        : step >= 1
          ? `${balancedLeft}=${piece(rc, '', true) || '0'}`
          : `${startLeft}=${startRight}`
    return {
      leftChips: leftChips.length ? leftChips : [{ coeff: 0, body: '' }],
      rightChips: rightChips.length ? rightChips : [{ coeff: 0, body: '' }],
      live,
      steps: [
        { title: 'Both pans', latex: `${startLeft}=${startRight}` },
        { title: 'Move the variable and flip its sign', latex: `${balancedLeft}=${piece(rc, '', true) || '0'}` },
        { title: 'Divide to isolate', latex: solution ? `${v}=${solution}` : `${balancedLeft}=\\text{no single solution}` },
      ].slice(0, step + 1),
      balanced: movedVar !== 0 || movedConst === 0,
      callout: 'Pro-Tip: An equation is a balanced scale — every move on one pan must happen on the other. Trap: crossing the equals sign without flipping the term’s sign breaks the balance.',
      tilt: movedVar === 0 && movedConst !== 0 ? 8 : 0,
    }
  }

  const leftChips = (
    step >= 2
      ? [{ coeff: movedVar, body: v }]
      : step >= 1
        ? [
            { coeff: movedVar, body: v },
            { coeff: lc, body: '' },
          ]
        : [
            { coeff: lv, body: v },
            { coeff: lc, body: '' },
          ]
  ).filter((chip) => chip.coeff !== 0)
  const rightChips = (
    step >= 2
      ? [{ coeff: movedConst, body: '' }]
      : step >= 1
        ? [{ coeff: rc, body: '' }]
        : [
            { coeff: rv, body: v },
            { coeff: rc, body: '' },
          ]
  ).filter((chip) => chip.coeff !== 0)
  let live = `${startLeft}=${startRight}`
  if (step === 1) live = `${balancedLeft}=${piece(rc, '', true) || '0'}`
  if (step === 2) live = `${collapsedLeft}=${collapsedRight}`
  if (step >= 3) live = solution ? `${v}=${solution}` : `${collapsedLeft}=\\text{no single solution}`

  return {
    leftChips: leftChips.length ? leftChips : [{ coeff: 0, body: '' }],
    rightChips: rightChips.length ? rightChips : [{ coeff: 0, body: '' }],
    live,
    steps: [
      { title: 'Both pans', latex: `${startLeft}=${startRight}` },
      { title: 'Gather variable terms on the left', latex: `${balancedLeft}=${piece(rc, '', true) || '0'}` },
      { title: 'Collapse constants on the right', latex: `${collapsedLeft}=${collapsedRight}` },
      { title: 'Divide to isolate', latex: solution ? `${v}=${solution}` : `${collapsedLeft}=\\text{no single solution}` },
    ].slice(0, step + 1),
    balanced: movedVar !== 0 || movedConst === 0,
    callout: 'Pro-Tip: After variables are gathered, move constants the same way — cross, flip, then combine. Trap: forgetting to flip a constant when it crosses turns $+7$ into another $+7$ instead of $-7$.',
    tilt: movedVar === 0 && movedConst !== 0 ? 8 : 0,
  }
})

function chipLatex(chip) {
  return piece(chip.coeff, chip.body, true) || '0'
}
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Variables can sit on both pans of a balanced scale. Collect them on one side and constants on the other — each time a term crosses the equals sign, its sign flips so both pans stay equal. Then divide once to isolate.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Variables on both sides tool"
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

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left variable</span>
        <input v-model.number="leftVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left constant</span>
        <input v-model.number="leftConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right variable</span>
        <input v-model.number="rightVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right constant</span>
        <input v-model.number="rightConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
      <div class="grid min-w-0 gap-3 sm:grid-cols-2">
        <div class="min-w-0 rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Left pan</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="(chip, index) in model.leftChips"
              :key="`L-${index}-${chip.coeff}-${chip.body}`"
              class="inline-flex max-w-full rounded-full border px-3 py-1 text-sm"
              :class="tileClass(chip.coeff)"
            >
              <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + chipLatex(chip) + '$')" />
            </span>
          </div>
        </div>
        <div class="min-w-0 rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Right pan</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="(chip, index) in model.rightChips"
              :key="`R-${index}-${chip.coeff}-${chip.body}`"
              class="inline-flex max-w-full rounded-full border px-3 py-1 text-sm"
              :class="tileClass(chip.coeff)"
            >
              <span class="overflow-x-auto max-w-full py-1" v-html="renderKatex('$' + chipLatex(chip) + '$')" />
            </span>
          </div>
        </div>
      </div>
      <div class="relative mx-auto mt-4 h-8 max-w-xs" aria-hidden="true">
        <div
          class="absolute left-4 right-4 top-3 h-1.5 rounded-full bg-[var(--color-primary)] transition-transform duration-300"
          :style="{ transform: `rotate(${model.tilt}deg)` }"
        />
        <div class="absolute left-1/2 top-1 h-6 w-1 -translate-x-1/2 rounded-full bg-[var(--color-text)]" />
      </div>
      <p class="mt-1 text-center text-xs text-[var(--color-muted)]">
        {{ model.balanced ? 'Pans agree — this move keeps the equation equivalent.' : 'These pans do not balance. Check the coefficients.' }}
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
