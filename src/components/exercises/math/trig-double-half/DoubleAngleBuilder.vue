<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Draw the reference triangle',
    prose:
      'Given $\\sin\\theta=\\dfrac{4}{5}$ in Quadrant II: opposite $4$, hypotenuse $5$. Solve $x^2+16=25$ and take the negative $x$ for QII.',
    latex: 'x^2 + 16 = 25 \\Rightarrow x = -3 \\Rightarrow \\cos\\theta = -\\dfrac{3}{5}',
    highlight: 'You never need the measure of $\\theta$ — only the signed ratios.',
  },
  {
    title: 'Apply the double-angle formulas',
    prose: 'Use the identities that turn a known $\\theta$ into $2\\theta$.',
    latex:
      '\\sin 2\\theta = 2\\sin\\theta\\cos\\theta,\\quad \\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta,\\quad \\tan 2\\theta = \\dfrac{2\\tan\\theta}{1-\\tan^2\\theta}',
    highlight: 'Any of the three cosine double-angle forms works; this one uses both sine and cosine.',
  },
  {
    title: 'Substitute and simplify',
    prose: 'Plug in $\\sin\\theta=\\dfrac{4}{5}$, $\\cos\\theta=-\\dfrac{3}{5}$, and $\\tan\\theta=-\\dfrac{4}{3}$.',
    latex:
      '\\sin 2\\theta = -\\dfrac{24}{25},\\quad \\cos 2\\theta = -\\dfrac{7}{25},\\quad \\tan 2\\theta = \\dfrac{24}{7}',
    highlight: 'Double-angle formulas produce exact values without measuring $2\\theta$ directly.',
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
        class="overflow-x-auto max-w-full py-1 text-base"
        v-html="
          renderKatex(
            'Given $\\sin\\theta=\\dfrac{4}{5}$ in Quadrant II, find $\\sin 2\\theta$, $\\cos 2\\theta$, and $\\tan 2\\theta$.',
            true,
          )
        "
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Double-angle formulas give trig values for an angle twice as large as a known angle — without
        knowing the angle’s measure.
      </p>
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Reference triangle (Quadrant II)
      </p>
      <svg viewBox="0 0 200 140" class="mt-2 h-36 w-full max-w-sm" aria-hidden="true">
        <line x1="100" y1="120" x2="180" y2="120" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
        <line x1="100" y1="120" x2="100" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
        <polygon
          points="100,120 40,120 40,40"
          fill="var(--color-primary-soft)"
          stroke="var(--color-primary)"
          stroke-width="2"
        />
        <text x="55" y="134" font-size="12" fill="currentColor">adj 3</text>
        <text x="12" y="85" font-size="12" fill="currentColor">opp 4</text>
        <text x="62" y="72" font-size="12" fill="currentColor">r = 5</text>
        <text x="8" y="28" font-size="11" fill="var(--color-primary)">x = −3</text>
      </svg>
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
      Press Reveal next step to rebuild the triangle, then apply the double-angle formulas.
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
