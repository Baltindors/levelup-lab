<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Find the LCD',
    prose: 'Separate fractions need a shared denominator before they can combine.',
    latex: '\\text{LCD} = \\sin x(1+\\cos x)',
    highlight: 'Multiply the two distinct denominators together.',
  },
  {
    title: 'Rewrite both fractions',
    prose: 'Build each fraction up to the LCD.',
    latex:
      '\\dfrac{\\sin x\\cdot\\sin x}{\\sin x(1+\\cos x)} + \\dfrac{(1+\\cos x)(1+\\cos x)}{\\sin x(1+\\cos x)}',
    highlight: 'First multiplies by $\\dfrac{\\sin x}{\\sin x}$; second by $\\dfrac{1+\\cos x}{1+\\cos x}$.',
  },
  {
    title: 'Add numerators',
    prose: 'With a common denominator, add the tops.',
    latex: '\\dfrac{\\sin^2 x + (1+\\cos x)^2}{\\sin x(1+\\cos x)}',
    highlight: 'The hard work moves into simplifying this numerator.',
  },
  {
    title: 'Expand and use Pythagorean',
    prose: 'Expand $(1+\\cos x)^2$, then fold $\\sin^2 x+\\cos^2 x=1$ into the constant terms.',
    latex: '\\sin^2 x + 1 + 2\\cos x + \\cos^2 x = 2 + 2\\cos x',
    highlight: 'Pythagorean turns the squared pair into an extra $1$.',
  },
  {
    title: 'Factor the numerator',
    prose: 'Pull out a $2$ so a factor matches the LCD.',
    latex: '\\dfrac{2(1+\\cos x)}{\\sin x(1+\\cos x)}',
    highlight: 'Matching factors are ready to cancel.',
  },
  {
    title: 'Cancel and rename',
    prose: 'Cancel $(1+\\cos x)$ (where defined) and rewrite the reciprocal.',
    latex: '\\dfrac{2}{\\sin x} = 2\\csc x',
    highlight: 'Left side equals the right side — verified.',
  },
]

const maxStep = allSteps.length
const visibleSteps = computed(() => allSteps.slice(0, revealedStep.value))

function revealNext() {
  if (revealedStep.value < maxStep) revealedStep.value += 1
}

function resetSteps() {
  revealedStep.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Goal identity</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('$\\dfrac{\\sin x}{1+\\cos x} + \\dfrac{1+\\cos x}{\\sin x} = 2\\csc x$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Two separate fractions almost always want an LCD, expansion, then a Pythagorean cleanup before canceling.
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
      v-html="renderKatex('Press Reveal next step to combine the fractions down to $2\\csc x$.')"
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
            <p class="text-sm" v-html="renderKatex(step.prose)" />
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
