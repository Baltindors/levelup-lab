<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('decimals')
const revealedStep = ref(0)
const activePreset = ref('d-5')
const variable = ref('x')
const combA = ref(5)
const combB = ref(0.45)
const combC = ref(0)
const combExtra = ref(0)
const combRight = ref(49.05)

const modes = [
  { id: 'decimals', label: 'Decimals' },
  { id: 'integers', label: 'Integers' },
  { id: 'then-solve', label: 'Then solve' },
]

const decimalPresets = [
  { id: 'd-5', label: '$5x+0.45x=49.05$', a: 5, b: 0.45, c: 0, extra: 0, right: 49.05, v: 'x' },
  { id: 'd-3', label: '$3x+0.5x=14$', a: 3, b: 0.5, c: 0, extra: 0, right: 14, v: 'x' },
  { id: 'd-25', label: '$2.5y+1.5y=20$', a: 2.5, b: 1.5, c: 0, extra: 0, right: 20, v: 'y' },
]

const integerPresets = [
  { id: 'i-3', label: '$3x+5x-2x=18$', a: 3, b: 5, c: -2, extra: 0, right: 18, v: 'x' },
  { id: 'i-7', label: '$7x-2x+3x=40$', a: 7, b: -2, c: 3, extra: 0, right: 40, v: 'x' },
  { id: 'i-9', label: '$9y-4y-y=20$', a: 9, b: -4, c: -1, extra: 0, right: 20, v: 'y' },
]

const thenSolvePresets = [
  { id: 's-4', label: '$4x+x+6=26$', a: 4, b: 1, c: 0, extra: 6, right: 26, v: 'x' },
  { id: 's-3', label: '$3y-y+8=20$', a: 3, b: -1, c: 0, extra: 8, right: 20, v: 'y' },
  { id: 's-7', label: '$7a+2a-5=31$', a: 7, b: 2, c: 0, extra: -5, right: 31, v: 'a' },
]

const presets = computed(() => {
  if (mode.value === 'integers') return integerPresets
  if (mode.value === 'then-solve') return thenSolvePresets
  return decimalPresets
})

const maxStep = computed(() => (mode.value === 'then-solve' ? 3 : 2))

function numOf(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function varBody() {
  const raw = String(variable.value || 'x').trim()
  return /^[A-Za-z]$/.test(raw) ? raw : 'x'
}

function coeffText(coeff) {
  const c = numOf(coeff)
  if (Number.isInteger(c) || Math.abs(c - Math.round(c)) < 1e-9) return String(Math.round(c))
  return String(Math.round(c * 100) / 100)
}

function piece(coeff, body, leading) {
  const c = numOf(coeff)
  if (Math.abs(c) < 1e-12) return ''
  const abs = Math.abs(c)
  const absText = coeffText(abs)
  const core = body ? (Math.abs(abs - 1) < 1e-12 ? body : `${absText}${body}`) : absText
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
  if (!Number.isFinite(numer) || !Number.isFinite(denom) || Math.abs(denom) < 1e-12) return '?'
  const q = numer / denom
  if (Number.isInteger(q) || Math.abs(q - Math.round(q)) < 1e-9) return String(Math.round(q))
  return String(Math.round(q * 1000) / 1000)
}

function tileClass(coeff) {
  const n = numOf(coeff)
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
  combA.value = preset.a
  combB.value = preset.b
  combC.value = preset.c
  combExtra.value = preset.extra ?? 0
  combRight.value = preset.right
  variable.value = preset.v
  revealedStep.value = 0
}

function setMode(next) {
  mode.value = next
  const first =
    next === 'integers' ? integerPresets[0] : next === 'then-solve' ? thenSolvePresets[0] : decimalPresets[0]
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
  const a = numOf(combA.value)
  const b = numOf(combB.value)
  const c = numOf(combC.value)
  const extra = mode.value === 'then-solve' ? numOf(combExtra.value) : 0
  const right = numOf(combRight.value)
  const merged = a + b + c
  const target = right - extra
  const originalLeft = [
    { coeff: a, body: v },
    { coeff: b, body: v },
    { coeff: c, body: v },
    { coeff: extra, body: '' },
  ]
  const mergedLeft = [
    { coeff: merged, body: v },
    { coeff: extra, body: '' },
  ]
  const isolatedLeft = [{ coeff: merged, body: v }]
  const solution = Math.abs(merged) < 1e-12 ? null : valueLatex(target, merged)

  const steps = [
    {
      title: 'Write the equation',
      latex: `${expression(originalLeft)}=${coeffText(right)}`,
    },
    {
      title: 'Combine like terms',
      latex: `${expression(mergedLeft)}=${coeffText(right)}`,
    },
  ]
  if (mode.value === 'then-solve') {
    steps.push({
      title: 'Move the constant',
      latex: `${expression(isolatedLeft)}=${coeffText(target)}`,
    })
    steps.push({
      title: 'Divide to isolate',
      latex: solution ? `${v}=${solution}` : '\\text{cannot divide by }0',
    })
  } else {
    steps.push({
      title: 'Divide to isolate',
      latex: solution ? `${v}=${solution}` : '\\text{cannot divide by }0',
    })
  }

  let live = `${expression(originalLeft)}=${coeffText(right)}`
  if (step >= 1) live = `${expression(mergedLeft)}=${coeffText(right)}`
  if (mode.value === 'then-solve' && step >= 2) live = `${expression(isolatedLeft)}=${coeffText(target)}`
  if (step >= maxStep.value && solution) live = `${v}=${solution}`

  const leftChips = step >= 1 ? mergedLeft.filter((t) => Math.abs(t.coeff) > 1e-12) : originalLeft.filter((t) => Math.abs(t.coeff) > 1e-12)

  return {
    leftChips: leftChips.length ? leftChips : [{ coeff: 0, body: '' }],
    rightChips: [{ coeff: right, body: '' }],
    live,
    steps: steps.slice(0, Math.min(step + 1, steps.length)),
    balanced: Math.abs(merged) > 1e-12,
    callout:
      mode.value === 'then-solve'
        ? 'Pro-Tip: Merge every variable term first so inverse operations act on one clean coefficient. Trap: the constant is not a like term — leave it until after you combine.'
        : 'Pro-Tip: Like terms share a variable; adding coefficients counts how many copies you have. Trap: a lone $-y$ is still $-1y$ — do not drop the invisible $1$.',
    tilt: Math.abs(merged) < 1e-12 && Math.abs(target) > 1e-12 ? 8 : 0,
  }
})

function chipLatex(chip) {
  return piece(chip.coeff, chip.body, true) || '0'
}
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Think of each variable term as a stack of the same tile. Combining like terms merges stacks that share a variable — decimals stay glued to their coefficients — then inverse operations isolate the unknown. Trap: do not move constants until the variable piles are merged.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Combine like terms tool"
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

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Term A</span>
        <input v-model.number="combA" type="number" step="any" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Term B</span>
        <input v-model.number="combB" type="number" step="any" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Term C</span>
        <input v-model.number="combC" type="number" step="any" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label v-if="mode === 'then-solve'" class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Left constant</span>
        <input v-model.number="combExtra" type="number" step="any" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Right constant</span>
        <input v-model.number="combRight" type="number" step="any" class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]" @input="onEdit" />
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
