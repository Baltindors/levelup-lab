<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Spot the common factor',
    prose: 'Both terms on the left share $\\sin x$. That is your cue to factor.',
    latex: '\\sin x - \\sin x\\cos^2 x',
    highlight: 'Repeated factors almost always want to be pulled out.',
  },
  {
    title: 'Factor $\\sin x$',
    prose: 'Pull $\\sin x$ out of both terms.',
    latex: '\\sin x(1 - \\cos^2 x)',
    highlight: 'The parentheses now look like a Pythagorean rearrange.',
  },
  {
    title: 'Apply Pythagorean',
    prose: 'Replace the difference of squares form with $\\sin^2 x$.',
    latex: '1 - \\cos^2 x = \\sin^2 x',
    highlight: 'Squared leftovers often unlock with $\\sin^2+\\cos^2=1$.',
  },
  {
    title: 'Multiply to finish',
    prose: 'Substitute and multiply powers of sine.',
    latex: '\\sin x\\cdot\\sin^2 x = \\sin^3 x',
    highlight: 'Left side matches the right side — verified.',
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
        v-html="renderKatex('$\\sin x - \\sin x \\cos^2 x = \\sin^3 x$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Squared terms or a repeated factor are clues: factor first, then swap in a Pythagorean identity.
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

    <p v-if="revealedStep === 0" class="text-sm text-[var(--color-muted)]">
      Press Reveal next step to factor, substitute, and finish the proof.
    </p>

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
              <span v-html="renderKatex(step.title)" />
            </p>
            <p class="text-sm" v-html="renderKatex(step.prose)" />
            <div
              class="overflow-x-auto max-w-full py-1 text-base"
              v-html="renderKatex('$' + step.latex + '$', true)"
            />
            <p class="text-xs font-medium text-[var(--color-primary)]">{{ step.highlight }}</p>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
