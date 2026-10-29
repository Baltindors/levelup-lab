<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Recall the power-reducing identity',
    prose:
      'Squared factors like $\\cos^2\\theta$ are awkward to solve or graph. Trade the square for a double angle.',
    latex: '\\cos^2\\theta = \\dfrac{1 + \\cos 2\\theta}{2}',
    highlight: 'The identity comes from rearranging $\\cos 2\\theta = 2\\cos^2\\theta - 1$.',
  },
  {
    title: 'Substitute into the expression',
    prose: 'Replace every $\\cos^2\\theta$ in $6\\cos^2\\theta$.',
    latex: '6\\cos^2\\theta = 6 \\cdot \\dfrac{1 + \\cos 2\\theta}{2}',
    highlight: 'The power is gone; a double-angle cosine remains.',
  },
  {
    title: 'Simplify',
    prose: 'Cancel the $2$ and distribute the $3$.',
    latex: '6 \\cdot \\dfrac{1 + \\cos 2\\theta}{2} = 3(1 + \\cos 2\\theta) = 3 + 3\\cos 2\\theta',
    highlight: 'Final reduced form: $3 + 3\\cos 2\\theta$.',
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
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Expression to reduce</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('$6\\cos^2\\theta$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Power-reducing formulas trade a high power for a double angle so equations and graphs become
        easier to handle.
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
      v-html="renderKatex('Press Reveal next step to rewrite $6\\cos^2\\theta$ as $3+3\\cos 2\\theta$.')"
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
