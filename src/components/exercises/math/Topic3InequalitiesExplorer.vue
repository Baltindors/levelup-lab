<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('distribute')
const revealedStep = ref(0)
const activePreset = ref('d-7')
const variable = ref('x')
const factor = ref(7)
const inner = ref(8)
const right = ref(147)
const leftVar = ref(2)
const leftConst = ref(5)
const compare = ref('<')

const modes = [
  { id: 'two-step', label: 'Two-step' },
  { id: 'distribute', label: 'Distribute' },
  { id: 'word', label: 'Word problem' },
]

const twoStepPresets = [
  { id: 't-2', label: '$2x+5<17$', leftVar: 2, leftConst: 5, right: 17, compare: '<', v: 'x' },
  { id: 't-3', label: '$3x-4>11$', leftVar: 3, leftConst: -4, right: 11, compare: '>', v: 'x' },
  { id: 't-neg', label: '$-2x+6>10$', leftVar: -2, leftConst: 6, right: 10, compare: '>', v: 'x' },
]

const distributePresets = [
  { id: 'd-7', label: '$7(x+8)<147$', factor: 7, inner: 8, right: 147, compare: '<', v: 'x' },
  { id: 'd-3', label: '$3(x-2)>15$', factor: 3, inner: -2, right: 15, compare: '>', v: 'x' },
  { id: 'd-neg', label: '$-2(x+3)>8$', factor: -2, inner: 3, right: 8, compare: '>', v: 'x' },
]

const wordPresets = [
  {
    id: 'w-7',
    label: 'Tutoring under $147$',
    story: 'A package costs $7$ dollars per hour plus an $8$-dollar fee. Stay under $147$ dollars.',
    factor: 7,
    inner: 8,
    right: 147,
    compare: '<',
    v: 'x',
  },
  {
    id: 'w-3',
    label: 'Notebooks at most $45$',
    story: 'Notebooks cost $3$ dollars each with a $12$-dollar shipping fee. Budget at most $45$.',
    leftVar: 3,
    leftConst: 12,
    right: 45,
    compare: '\\le',
    v: 'x',
    twoStep: true,
  },
]

const presets = computed(() => {
  if (mode.value === 'two-step') return twoStepPresets
  if (mode.value === 'word') return wordPresets
  return distributePresets
})

const maxStep = computed(() => 3)

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

function flipCompare(op) {
  if (op === '<') return '>'
  if (op === '>') return '<'
  if (op === '\\le') return '\\ge'
  if (op === '\\ge') return '\\le'
  return op
}

function onEdit() {
  activePreset.value = ''
  revealedStep.value = 0
}

function loadPreset(preset) {
  activePreset.value = preset.id
  variable.value = preset.v
  compare.value = preset.compare
  if (preset.twoStep || mode.value === 'two-step' || (mode.value === 'word' && preset.twoStep)) {
    leftVar.value = preset.leftVar
    leftConst.value = preset.leftConst
    right.value = preset.right
  } else {
    factor.value = preset.factor
    inner.value = preset.inner
    right.value = preset.right
  }
  revealedStep.value = 0
}

function setMode(next) {
  mode.value = next
  const first = next === 'two-step' ? twoStepPresets[0] : next === 'word' ? wordPresets[0] : distributePresets[0]
  loadPreset(first)
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
  const isTwoStep = mode.value === 'two-step' || (mode.value === 'word' && activePreset.value === 'w-3')
  const op = compare.value
  let callout = 'Use inverse operations just like equations. The inequality direction stays the same unless you multiply or divide by a negative.'

  if (isTwoStep) {
    const a = intOf(leftVar.value)
    const b = intOf(leftConst.value)
    const r = intOf(right.value)
    const afterConst = r - b
    const flip = a < 0
    const finalOp = flip ? flipCompare(op) : op
    const solution = a === 0 ? null : afterConst / a
    const original = `${expression([
      { coeff: a, body: v },
      { coeff: b, body: '' },
    ])}${op}${r}`
    const moved = `${piece(a, v, true) || '0'}${op}${afterConst}`
    const isolated = solution === null ? '\\text{undefined}' : `${v}${finalOp}${solution}`
    if (flip) callout = 'Dividing by a negative flips the inequality symbol.'
    const steps = [
      { title: 'Original inequality', latex: original },
      { title: 'Move the constant', latex: moved },
      {
        title: flip ? 'Divide and flip' : 'Divide both sides',
        latex: isolated,
      },
      { title: 'Solution', latex: isolated },
    ]
    let live = original
    if (step >= 1) live = moved
    if (step >= 2) live = isolated
    return { live, steps: steps.slice(0, step + 1), callout, story: mode.value === 'word' ? presets.value.find((p) => p.id === activePreset.value)?.story : '' }
  }

  const m = intOf(factor.value)
  const c = intOf(inner.value)
  const r = intOf(right.value)
  const expandedVar = m
  const expandedConst = m * c
  const afterConst = r - expandedConst
  const flip = expandedVar < 0
  const finalOp = flip ? flipCompare(op) : op
  const solution = expandedVar === 0 ? null : afterConst / expandedVar
  const original = `${m}(${v}${c >= 0 ? '+' : ''}${c === 0 ? '' : c})${op}${r}`.replace(`${v}+0`, v).replace(`${v}-0`, v)
  const prettyInner = c === 0 ? v : c > 0 ? `${v}+${c}` : `${v}-${Math.abs(c)}`
  const originalPretty = `${m}(${prettyInner})${op}${r}`
  const expanded = `${expression([
    { coeff: expandedVar, body: v },
    { coeff: expandedConst, body: '' },
  ])}${op}${r}`
  const moved = `${piece(expandedVar, v, true) || '0'}${op}${afterConst}`
  const isolated = solution === null ? '\\text{undefined}' : `${v}${finalOp}${solution}`
  if (flip) callout = 'After distributing a negative factor, dividing by a negative flips the inequality.'

  const steps = [
    { title: 'Original inequality', latex: originalPretty },
    { title: 'Distribute', latex: expanded },
    { title: 'Move the constant', latex: moved },
    { title: flip ? 'Divide and flip' : 'Divide both sides', latex: isolated },
  ]
  let live = originalPretty
  if (step >= 1) live = expanded
  if (step >= 2) live = moved
  if (step >= 3) live = isolated

  return {
    live,
    steps: steps.slice(0, step + 1),
    callout,
    story: mode.value === 'word' ? presets.value.find((p) => p.id === activePreset.value)?.story : '',
  }
})
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Isolate the variable with inverse operations. Flip the symbol only when you multiply or divide by a negative.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Inequalities tool"
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

    <p v-if="model.story" class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3 text-sm text-[var(--color-text)]" v-html="renderKatex(model.story)" />

    <div v-if="mode === 'two-step' || activePreset === 'w-3'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable coeff</span>
        <input v-model.number="leftVar" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Constant</span>
        <input v-model.number="leftConst" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right side</span>
        <input v-model.number="right" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Factor</span>
        <input v-model.number="factor" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Inside constant</span>
        <input v-model.number="inner" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right side</span>
        <input v-model.number="right" type="number" step="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Variable</span>
        <input v-model="variable" type="text" maxlength="1" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Live inequality</p>
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
