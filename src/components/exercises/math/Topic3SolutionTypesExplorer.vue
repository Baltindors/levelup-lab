<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'
import MathPresetChip from '../common/MathPresetChip.vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const mode = ref('infinite')
const revealedStep = ref(0)
const activePreset = ref('inf-6')

const modes = [
  { id: 'one', label: 'One solution' },
  { id: 'none', label: 'No solution' },
  { id: 'infinite', label: 'Infinitely many' },
]

const onePresets = [
  {
    id: 'one-3',
    label: '$3x+5=2x+11$',
    steps: [
      { title: 'Original', latex: '3x+5=2x+11' },
      { title: 'Subtract $2x$', latex: 'x+5=11' },
      { title: 'Subtract $5$', latex: 'x=6' },
      { title: 'Classify', latex: '\\text{One solution}' },
    ],
    callout: 'Simplifying yields a single value for $x$. That means one solution.',
    result: 'one',
  },
  {
    id: 'one-5',
    label: '$5x-4=3x+8$',
    steps: [
      { title: 'Original', latex: '5x-4=3x+8' },
      { title: 'Subtract $3x$', latex: '2x-4=8' },
      { title: 'Add $4$', latex: '2x=12' },
      { title: 'Divide by $2$', latex: 'x=6\\quad(\\text{one solution})' },
    ],
    callout: 'When the variable survives with a nonzero coefficient, you get one solution.',
    result: 'one',
  },
]

const nonePresets = [
  {
    id: 'none-3',
    label: '$3x+4=3x+9$',
    steps: [
      { title: 'Original', latex: '3x+4=3x+9' },
      { title: 'Subtract $3x$', latex: '4=9' },
      { title: 'Classify', latex: '4=9\\quad\\text{false}' },
      { title: 'Result', latex: '\\text{No solution}' },
    ],
    callout: 'A false statement like $4=9$ means no value of $x$ can make both sides equal.',
    result: 'none',
  },
  {
    id: 'none-2',
    label: '$2(x+3)=2x+1$',
    steps: [
      { title: 'Original', latex: '2(x+3)=2x+1' },
      { title: 'Distribute', latex: '2x+6=2x+1' },
      { title: 'Subtract $2x$', latex: '6=1' },
      { title: 'Result', latex: '\\text{No solution}' },
    ],
    callout: 'After simplifying, the variables cancel and leave a contradiction.',
    result: 'none',
  },
]

const infinitePresets = [
  {
    id: 'inf-6',
    label: '$6x+9=2x+4+4x+5$',
    steps: [
      { title: 'Original', latex: '6x+9=2x+4+4x+5' },
      { title: 'Combine right', latex: '6x+9=6x+9' },
      { title: 'Subtract $6x$', latex: '9=9' },
      { title: 'Result', latex: '\\text{Infinitely many solutions}' },
    ],
    callout: 'A true statement like $9=9$ is an identity — every $x$ works.',
    result: 'infinite',
  },
  {
    id: 'inf-3',
    label: '$3x+6=3(x+2)$',
    steps: [
      { title: 'Original', latex: '3x+6=3(x+2)' },
      { title: 'Distribute', latex: '3x+6=3x+6' },
      { title: 'Subtract $3x$', latex: '6=6' },
      { title: 'Result', latex: '\\text{Infinitely many solutions}' },
    ],
    callout: 'Both sides are identical after expanding — infinitely many solutions.',
    result: 'infinite',
  },
]

const presets = computed(() => {
  if (mode.value === 'one') return onePresets
  if (mode.value === 'none') return nonePresets
  return infinitePresets
})

const current = computed(() => presets.value.find((p) => p.id === activePreset.value) ?? presets.value[0])
const maxStep = computed(() => (current.value?.steps.length ?? 1) - 1)

function setMode(next) {
  mode.value = next
  const first = next === 'one' ? onePresets[0] : next === 'none' ? nonePresets[0] : infinitePresets[0]
  activePreset.value = first.id
  revealedStep.value = 0
}

function loadPreset(preset) {
  activePreset.value = preset.id
  revealedStep.value = 0
}

function revealNext() {
  if (revealedStep.value >= maxStep.value) return
  revealedStep.value += 1
}

function resetKata() {
  revealedStep.value = 0
}

const model = computed(() => {
  const preset = current.value
  const steps = preset.steps.slice(0, revealedStep.value + 1)
  const live = steps[steps.length - 1]?.latex ?? ''
  const badge =
    preset.result === 'one'
      ? { label: 'One solution', class: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-100' }
      : preset.result === 'none'
        ? { label: 'No solution', class: 'border-rose-500/50 bg-rose-950/40 text-rose-100' }
        : { label: 'Infinitely many', class: 'border-sky-500/50 bg-sky-950/40 text-sky-100' }
  return {
    live,
    steps,
    callout: preset.callout,
    badge,
    showBadge: revealedStep.value >= maxStep.value,
  }
})
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Simplify until the variables cancel or a single value remains. True statements mean infinitely many; false statements mean none.
    </p>

    <MathSegmentedControl
      :model-value="mode"
      :options="modes"
      aria-label="Solution types tool"
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

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Live statement</p>
      <div class="overflow-x-auto max-w-full py-2 text-lg" v-html="renderKatex('$' + model.live + '$', true)" />
      <p
        v-if="model.showBadge"
        class="mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold"
        :class="model.badge.class"
      >
        {{ model.badge.label }}
      </p>
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
