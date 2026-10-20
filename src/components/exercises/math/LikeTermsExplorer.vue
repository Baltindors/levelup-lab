<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('combine')
const revealedStep = ref(0)
const activePreset = ref('c-3')
const variable = ref('x')

const combA = ref(3)
const combB = ref(5)
const combC = ref(-2)
const combRight = ref(18)

const balLeftVar = ref(5)
const balLeftConst = ref(0)
const balRightVar = ref(2)
const balRightConst = ref(12)

const colLeftVar = ref(4)
const colLeftConst = ref(7)
const colRightVar = ref(2)
const colRightConst = ref(15)

const modes = [
  { id: 'combine', label: 'Combine' },
  { id: 'balance', label: 'Balance' },
  { id: 'collapse', label: 'Collapse' },
]

const combinePresets = [
  { id: 'c-3', label: '$3x+5x-2x=18$', a: 3, b: 5, c: -2, right: 18, v: 'x' },
  { id: 'c-7', label: '$7x-2x+3x=40$', a: 7, b: -2, c: 3, right: 40, v: 'x' },
  { id: 'c-9', label: '$9y-4y-y=20$', a: 9, b: -4, c: -1, right: 20, v: 'y' },
]

const balancePresets = [
  { id: 'b-5', label: '$5x=2x+12$', leftVar: 5, leftConst: 0, rightVar: 2, rightConst: 12, v: 'x' },
  { id: 'b-4', label: '$4x+18=10x$', leftVar: 4, leftConst: 18, rightVar: 10, rightConst: 0, v: 'x' },
]

const collapsePresets = [
  { id: 'k-4', label: '$4x+7=2x+15$', leftVar: 4, leftConst: 7, rightVar: 2, rightConst: 15, v: 'x' },
  { id: 'k-7', label: '$7a-8=3a+12$', leftVar: 7, leftConst: -8, rightVar: 3, rightConst: 12, v: 'a' },
]

const presets = computed(() => {
  if (mode.value === 'balance') return balancePresets
  if (mode.value === 'collapse') return collapsePresets
  return combinePresets
})

const maxStep = computed(() => {
  if (mode.value === 'combine') return 2
  if (mode.value === 'balance') return 2
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
  if (!Number.isFinite(numer) || !Number.isFinite(denom) || denom === 0) return '?'
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

function loadCombine(preset) {
  activePreset.value = preset.id
  combA.value = preset.a
  combB.value = preset.b
  combC.value = preset.c
  combRight.value = preset.right
  variable.value = preset.v
  revealedStep.value = 0
}

function loadSides(preset) {
  activePreset.value = preset.id
  if (mode.value === 'balance') {
    balLeftVar.value = preset.leftVar
    balLeftConst.value = preset.leftConst
    balRightVar.value = preset.rightVar
    balRightConst.value = preset.rightConst
  } else {
    colLeftVar.value = preset.leftVar
    colLeftConst.value = preset.leftConst
    colRightVar.value = preset.rightVar
    colRightConst.value = preset.rightConst
  }
  variable.value = preset.v
  revealedStep.value = 0
}

function setMode(next) {
  mode.value = next
  revealedStep.value = 0
  const first = next === 'balance' ? balancePresets[0] : next === 'collapse' ? collapsePresets[0] : combinePresets[0]
  if (next === 'combine') loadCombine(first)
  else {
    mode.value = next
    loadSides(first)
  }
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

  if (mode.value === 'combine') {
    const a = intOf(combA.value)
    const b = intOf(combB.value)
    const c = intOf(combC.value)
    const right = intOf(combRight.value)
    const merged = a + b + c
    const originalLeft = [
      { coeff: a, body: v },
      { coeff: b, body: v },
      { coeff: c, body: v },
    ]
    const mergedLeft = [{ coeff: merged, body: v }]
    const solution = merged === 0 ? null : valueLatex(right, merged)
    const leftChips = step >= 1 ? mergedLeft : originalLeft
    const live = step >= 2 && solution
      ? `${v}=${solution}`
      : `${expression(step >= 1 ? mergedLeft : originalLeft)}=${piece(right, '', true) || '0'}`
    const steps = [
      { title: 'Separate like terms', latex: `${expression(originalLeft)}=${piece(right, '', true) || '0'}` },
      { title: 'Add the coefficients', latex: `${expression(mergedLeft)}=${piece(right, '', true) || '0'}` },
      { title: 'Divide to isolate', latex: solution ? `${v}=${solution}` : `${expression(mergedLeft)}=\\text{cannot divide by }0` },
    ]
    return {
      leftChips,
      rightChips: [{ coeff: right, body: '' }],
      live,
      steps: steps.slice(0, step + 1),
      balanced: merged !== 0,
      callout: 'Add the coefficients of the same variable. The constant on the other pan stays put until you divide.',
      leftValue: null,
      rightValue: null,
      tilt: merged === 0 && right !== 0 ? 8 : 0,
    }
  }

  const leftVar = intOf(mode.value === 'balance' ? balLeftVar.value : colLeftVar.value)
  const leftConst = intOf(mode.value === 'balance' ? balLeftConst.value : colLeftConst.value)
  const rightVar = intOf(mode.value === 'balance' ? balRightVar.value : colRightVar.value)
  const rightConst = intOf(mode.value === 'balance' ? balRightConst.value : colRightConst.value)
  const movedVar = leftVar - rightVar
  const movedConst = rightConst - leftConst
  const solution = movedVar === 0 ? null : valueLatex(movedConst, movedVar)

  const startLeft = expression([
    { coeff: leftVar, body: v },
    { coeff: leftConst, body: '' },
  ])
  const startRight = expression([
    { coeff: rightVar, body: v },
    { coeff: rightConst, body: '' },
  ])
  const balancedLeft = expression([
    { coeff: movedVar, body: v },
    { coeff: leftConst, body: '' },
  ])
  const collapsedLeft = expression([{ coeff: movedVar, body: v }])
  const collapsedRight = piece(movedConst, '', true) || '0'

  if (mode.value === 'balance') {
    const leftChips = (step >= 1
      ? [
          { coeff: movedVar, body: v },
          { coeff: leftConst, body: '' },
        ]
      : [
          { coeff: leftVar, body: v },
          { coeff: leftConst, body: '' },
        ]
    ).filter((chip) => chip.coeff !== 0)
    const rightChips = (step >= 1
      ? [{ coeff: rightConst, body: '' }]
      : [
          { coeff: rightVar, body: v },
          { coeff: rightConst, body: '' },
        ]
    ).filter((chip) => chip.coeff !== 0)
    const live = step >= 2 && solution ? `${v}=${solution}` : step >= 1 ? `${balancedLeft}=${piece(rightConst, '', true) || '0'}` : `${startLeft}=${startRight}`
    return {
      leftChips: leftChips.length ? leftChips : [{ coeff: 0, body: '' }],
      rightChips: rightChips.length ? rightChips : [{ coeff: 0, body: '' }],
      live,
      steps: [
        { title: 'Both pans', latex: `${startLeft}=${startRight}` },
        { title: 'Move the variable and flip its sign', latex: `${balancedLeft}=${piece(rightConst, '', true) || '0'}` },
        { title: 'Divide to isolate', latex: solution ? `${v}=${solution}` : `${balancedLeft}=\\text{no single solution}` },
      ].slice(0, step + 1),
      balanced: movedVar !== 0 || movedConst === 0,
      callout: 'A variable term crosses the equals sign only when the same move happens on both pans. Crossing flips its sign.',
      tilt: movedVar === 0 && movedConst !== 0 ? 8 : 0,
    }
  }

  const leftChips = (step >= 2
    ? [{ coeff: movedVar, body: v }]
    : step >= 1
      ? [
          { coeff: movedVar, body: v },
          { coeff: leftConst, body: '' },
        ]
      : [
          { coeff: leftVar, body: v },
          { coeff: leftConst, body: '' },
        ]
  ).filter((chip) => chip.coeff !== 0)
  const rightChips = (step >= 2
    ? [{ coeff: movedConst, body: '' }]
    : step >= 1
      ? [{ coeff: rightConst, body: '' }]
      : [
          { coeff: rightVar, body: v },
          { coeff: rightConst, body: '' },
        ]
  ).filter((chip) => chip.coeff !== 0)
  let live = `${startLeft}=${startRight}`
  if (step === 1) live = `${balancedLeft}=${piece(rightConst, '', true) || '0'}`
  if (step === 2) live = `${collapsedLeft}=${collapsedRight}`
  if (step >= 3) live = solution ? `${v}=${solution}` : `${collapsedLeft}=\\text{no single solution}`

  return {
    leftChips: leftChips.length ? leftChips : [{ coeff: 0, body: '' }],
    rightChips: rightChips.length ? rightChips : [{ coeff: 0, body: '' }],
    live,
    steps: [
      { title: 'Both pans', latex: `${startLeft}=${startRight}` },
      { title: 'Gather variable terms on the left', latex: `${balancedLeft}=${piece(rightConst, '', true) || '0'}` },
      { title: 'Collapse constants on the right', latex: `${collapsedLeft}=${collapsedRight}` },
      { title: 'Divide to isolate', latex: solution ? `${v}=${solution}` : `${collapsedLeft}=\\text{no single solution}` },
    ].slice(0, step + 1),
    balanced: movedVar !== 0 || movedConst === 0,
    callout: 'Constants collapse the same way variables do: move each one across, flip its sign, then add.',
    tilt: movedVar === 0 && movedConst !== 0 ? 8 : 0,
  }
})

function chipLatex(chip) {
  const text = piece(chip.coeff, chip.body, true)
  return text || '0'
}
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Stack like terms on the pans, then reveal one legal move at a time. The beam stays level while both sides stay equal.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Like terms tool"
      @update:model-value="setMode"
    />

    <div class="flex flex-wrap gap-1.5">
      <MathPresetChip
        v-for="preset in presets"
        :key="preset.id"
        :selected="activePreset === preset.id"
        @click="mode === 'combine' ? loadCombine(preset) : loadSides(preset)"
      >
        <span v-html="renderKatex(preset.label)" />
      </MathPresetChip>
    </div>

    <div v-if="mode === 'combine'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Term A</span>
        <input v-model.number="combA" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Term B</span>
        <input v-model.number="combB" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Term C</span>
        <input v-model.number="combC" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right constant</span>
        <input v-model.number="combRight" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div v-else-if="mode === 'balance'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left variable</span>
        <input v-model.number="balLeftVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left constant</span>
        <input v-model.number="balLeftConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right variable</span>
        <input v-model.number="balRightVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right constant</span>
        <input v-model.number="balRightConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left variable</span>
        <input v-model.number="colLeftVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left constant</span>
        <input v-model.number="colLeftConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right variable</span>
        <input v-model.number="colRightVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right constant</span>
        <input v-model.number="colRightConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
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
