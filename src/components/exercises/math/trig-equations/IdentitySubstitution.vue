<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Spot the mismatch',
    prose: 'The equation mixes $\\sin 2x$ and $\\sin x$. Different angles block ordinary factoring.',
    latex: '\\sin 2x - \\sin x = 0',
    highlight: 'When angles disagree, rewrite with an identity first.',
  },
  {
    title: 'Substitute the double-angle formula',
    prose: 'Replace $\\sin 2x$ so every factor depends on $x$.',
    latex: '2\\sin x\\cos x - \\sin x = 0',
    highlight: 'Now a common $\\sin x$ is visible.',
  },
  {
    title: 'Factor',
    prose: 'Do not divide by $\\sin x$ — factor it out.',
    latex: '\\sin x(2\\cos x - 1) = 0',
    highlight: 'Same trap as before: dividing would lose $\\sin x=0$.',
  },
  {
    title: 'Split and solve in $[0, 2\\pi)$',
    prose: 'Solve each factor on the unit circle.',
    latex:
      '\\sin x = 0 \\Rightarrow 0,\\ \\pi \\qquad\\text{and}\\qquad \\cos x = \\dfrac{1}{2} \\Rightarrow \\dfrac{\\pi}{3},\\ \\dfrac{5\\pi}{3}',
    highlight: 'Complete set: $0,\\ \\dfrac{\\pi}{3},\\ \\pi,\\ \\dfrac{5\\pi}{3}$.',
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
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Worked example</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('$\\sin 2x - \\sin x = 0$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        When functions or angles do not match, use an identity to force them into the same form, then
        factor.
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
      v-html="renderKatex('Press Reveal next step to rewrite $\\sin 2x$, factor, and solve.')"
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
