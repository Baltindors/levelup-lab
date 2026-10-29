<script setup>
import { computed, ref, watch } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'
import MathSegmentedControl from '../../common/MathSegmentedControl.vue'
import MathPresetChip from '../../common/MathPresetChip.vue'

const presetId = ref('15deg')
const fn = ref('sin')
const revealedStep = ref(0)

const presets = [
  {
    id: '15deg',
    label: '$15^\\circ$',
    split: '15^\\circ = 45^\\circ - 30^\\circ',
    alpha: '45^\\circ',
    beta: '30^\\circ',
    op: '-',
    values: {
      sinA: '\\dfrac{\\sqrt{2}}{2}',
      cosA: '\\dfrac{\\sqrt{2}}{2}',
      tanA: '1',
      sinB: '\\dfrac{1}{2}',
      cosB: '\\dfrac{\\sqrt{3}}{2}',
      tanB: '\\dfrac{1}{\\sqrt{3}}',
    },
    answers: {
      sin: '\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}',
      cos: '\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}',
      tan: '2-\\sqrt{3}',
    },
  },
  {
    id: '75deg',
    label: '$75^\\circ$',
    split: '75^\\circ = 45^\\circ + 30^\\circ',
    alpha: '45^\\circ',
    beta: '30^\\circ',
    op: '+',
    values: {
      sinA: '\\dfrac{\\sqrt{2}}{2}',
      cosA: '\\dfrac{\\sqrt{2}}{2}',
      tanA: '1',
      sinB: '\\dfrac{1}{2}',
      cosB: '\\dfrac{\\sqrt{3}}{2}',
      tanB: '\\dfrac{1}{\\sqrt{3}}',
    },
    answers: {
      sin: '\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}',
      cos: '\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}',
      tan: '2+\\sqrt{3}',
    },
  },
  {
    id: '5pi12',
    label: '$\\dfrac{5\\pi}{12}$',
    split: '\\dfrac{5\\pi}{12} = \\dfrac{\\pi}{6} + \\dfrac{\\pi}{4}',
    alpha: '\\dfrac{\\pi}{6}',
    beta: '\\dfrac{\\pi}{4}',
    op: '+',
    values: {
      sinA: '\\dfrac{1}{2}',
      cosA: '\\dfrac{\\sqrt{3}}{2}',
      tanA: '\\dfrac{1}{\\sqrt{3}}',
      sinB: '\\dfrac{\\sqrt{2}}{2}',
      cosB: '\\dfrac{\\sqrt{2}}{2}',
      tanB: '1',
    },
    answers: {
      sin: '\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}',
      cos: '\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}',
      tan: '2+\\sqrt{3}',
    },
  },
]

const functions = [
  { id: 'sin', label: 'Sine' },
  { id: 'cos', label: 'Cosine' },
  { id: 'tan', label: 'Tangent' },
]

const preset = computed(() => presets.find((p) => p.id === presetId.value) ?? presets[0])

const formulaLatex = computed(() => {
  const a = '\\alpha'
  const b = '\\beta'
  if (fn.value === 'sin') {
    return preset.value.op === '+'
      ? `\\sin(${a}+${b}) = \\sin${a}\\cos${b} + \\cos${a}\\sin${b}`
      : `\\sin(${a}-${b}) = \\sin${a}\\cos${b} - \\cos${a}\\sin${b}`
  }
  if (fn.value === 'cos') {
    return preset.value.op === '+'
      ? `\\cos(${a}+${b}) = \\cos${a}\\cos${b} - \\sin${a}\\sin${b}`
      : `\\cos(${a}-${b}) = \\cos${a}\\cos${b} + \\sin${a}\\sin${b}`
  }
  return preset.value.op === '+'
    ? `\\tan(${a}+${b}) = \\dfrac{\\tan${a}+\\tan${b}}{1-\\tan${a}\\tan${b}}`
    : `\\tan(${a}-${b}) = \\dfrac{\\tan${a}-\\tan${b}}{1+\\tan${a}\\tan${b}}`
})

const substituteLatex = computed(() => {
  const p = preset.value
  const v = p.values
  const left = `${fn.value}\\left(${p.split.split('=')[0].trim()}\\right)`
  if (fn.value === 'sin') {
    return p.op === '+'
      ? `${left} = (${v.sinA})(${v.cosB}) + (${v.cosA})(${v.sinB})`
      : `${left} = (${v.sinA})(${v.cosB}) - (${v.cosA})(${v.sinB})`
  }
  if (fn.value === 'cos') {
    return p.op === '+'
      ? `${left} = (${v.cosA})(${v.cosB}) - (${v.sinA})(${v.sinB})`
      : `${left} = (${v.cosA})(${v.cosB}) + (${v.sinA})(${v.sinB})`
  }
  return p.op === '+'
    ? `${left} = \\dfrac{${v.tanA}+${v.tanB}}{1-(${v.tanA})(${v.tanB})}`
    : `${left} = \\dfrac{${v.tanA}-${v.tanB}}{1+(${v.tanA})(${v.tanB})}`
})

const allSteps = computed(() => [
  {
    title: 'Write the formula',
    latex: formulaLatex.value,
    highlight: 'Match sum or difference to how the angle was split.',
  },
  {
    title: 'Substitute unit-circle values',
    latex: substituteLatex.value,
    highlight: `Use exact values for $${preset.value.alpha}$ and $${preset.value.beta}$.`,
  },
  {
    title: 'Simplify to an exact answer',
    latex: `${fn.value}\\left(${preset.value.split.split('=')[0].trim()}\\right) = ${preset.value.answers[fn.value]}`,
    highlight: 'Combine radicals over a common denominator when needed.',
  },
])

const maxStep = computed(() => allSteps.value.length)
const visibleSteps = computed(() => allSteps.value.slice(0, revealedStep.value))

watch([presetId, fn], () => {
  revealedStep.value = 0
})

function selectPreset(id) {
  presetId.value = id
}

function revealNext() {
  if (revealedStep.value < maxStep.value) revealedStep.value += 1
}

function resetSteps() {
  revealedStep.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-1.5">
      <MathPresetChip
        v-for="item in presets"
        :key="item.id"
        :selected="presetId === item.id"
        @click="selectPreset(item.id)"
      >
        <span v-html="renderKatex(item.label)" />
      </MathPresetChip>
    </div>

    <MathSegmentedControl v-model="fn" :options="functions" aria-label="Trigonometric function" />

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Angle split</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('$' + preset.split + '$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Non-standard angles become exact values once you write them as a sum or difference of
        familiar unit-circle angles.
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="math-btn math-btn--primary"
        :disabled="revealedStep >= maxStep"
        @click="revealNext"
      >
        Reveal next step
      </button>
      <button type="button" class="math-btn math-btn--ghost" @click="resetSteps">
        Reset steps
      </button>
    </div>

    <p
      v-if="revealedStep === 0"
      class="text-sm text-[var(--color-muted)]"
      v-html="renderKatex('Press Reveal next step to expand, substitute, and simplify.')"
    />

    <ol v-else class="space-y-3">
      <li
        v-for="(step, index) in visibleSteps"
        :key="step.title"
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3"
        :class="index === visibleSteps.length - 1 ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : ''"
      >
        <div class="flex gap-3">
          <span
            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-xs font-bold"
          >
            {{ index + 1 }}
          </span>
          <div class="min-w-0 flex-1 space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {{ step.title }}
            </p>
            <div
              class="overflow-x-auto max-w-full py-1 text-base"
              v-html="renderKatex('$' + step.latex + '$', true)"
            />
            <p class="text-xs font-medium text-[var(--color-primary)]" v-html="renderKatex(step.highlight)" />
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
