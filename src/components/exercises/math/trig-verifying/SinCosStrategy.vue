<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Convert the left side',
    prose: 'Rewrite every factor with sine and cosine.',
    latex: '\\csc x\\tan x = \\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x}',
    highlight: 'Reciprocal and quotient identities open the door.',
  },
  {
    title: 'Cancel $\\sin x$',
    prose: 'The sine factors cancel (where $\\sin x \\neq 0$).',
    latex: '\\dfrac{1}{\\sin x}\\cdot\\dfrac{\\sin x}{\\cos x} = \\dfrac{1}{\\cos x}',
    highlight: 'Common factors disappear — that is the point of the rewrite.',
  },
  {
    title: 'Recognize the reciprocal',
    prose: 'What remains is already a reciprocal form.',
    latex: '\\dfrac{1}{\\cos x}',
    highlight: 'You are one rename away from the right side.',
  },
  {
    title: 'Arrive at $\\sec x$',
    prose: 'Rename with the reciprocal identity to match the goal.',
    latex: '\\dfrac{1}{\\cos x} = \\sec x',
    highlight: 'Left side equals right side — the identity is verified.',
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
        v-html="renderKatex('$\\csc x \\tan x = \\sec x$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        When a proof feels stuck, convert everything to sine and cosine so shared factors can cancel.
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
      v-html="renderKatex('Press Reveal next step to walk the left side toward $\\sec x$.')"
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
              <span v-html="renderKatex(step.title)" />
            </p>
            <p class="text-sm">{{ step.prose }}</p>
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
