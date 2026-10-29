<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Write the tangent sum formula',
    prose: 'Expand the left side with the sum formula for tangent.',
    latex: '\\tan(x+\\pi) = \\dfrac{\\tan x + \\tan\\pi}{1 - \\tan x\\tan\\pi}',
    highlight: 'Sum formulas turn an identity into algebra you can finish.',
  },
  {
    title: 'Evaluate the known angle',
    prose: 'On the unit circle, $\\tan\\pi=0$ (sine is $0$, cosine is $-1$).',
    latex: '\\tan\\pi = 0',
    highlight: 'Known exact values are the shortcuts inside these proofs.',
  },
  {
    title: 'Substitute and simplify',
    prose: 'Replace $\\tan\\pi$ with $0$ and cancel the trivial terms.',
    latex: '\\dfrac{\\tan x + 0}{1 - \\tan x\\cdot 0} = \\tan x',
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
        v-html="renderKatex('$\\tan(x+\\pi) = \\tan x$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Sum and difference formulas also verify identities: expand, insert known values, and cancel.
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
      v-html="renderKatex('Press Reveal next step to expand $\\tan(x+\\pi)$ down to $\\tan x$.')"
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
            <p class="text-xs font-medium text-[var(--color-primary)]">{{ step.highlight }}</p>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
