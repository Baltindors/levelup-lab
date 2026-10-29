<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Draw and solve Triangle $\\alpha$',
    prose:
      'Given $\\sin\\alpha=\\dfrac{4}{5}$ in Quadrant II: opposite $4$, hypotenuse $5$. Pythagorean gives adjacent $3$, but $x$ is negative in QII.',
    latex: '4^2 + x^2 = 5^2 \\Rightarrow |x|=3 \\Rightarrow \\cos\\alpha = -\\dfrac{3}{5}',
    highlight: 'Quadrant II: sine positive, cosine negative.',
  },
  {
    title: 'Draw and solve Triangle $\\beta$',
    prose:
      'Given $\\sin\\beta=\\dfrac{1}{2}$ in Quadrant I. This is a $30^\\circ$–$60^\\circ$–$90^\\circ$ pattern (or Pythagorean with hypotenuse $2$).',
    latex: '\\cos\\beta = \\dfrac{\\sqrt{3}}{2}',
    highlight: 'Quadrant I keeps cosine positive.',
  },
  {
    title: 'Apply the formula',
    prose: 'We want $\\cos(\\alpha+\\beta)$, so expand with the cosine sum identity.',
    latex: '\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta',
    highlight: 'Both sines and both cosines are now known.',
  },
  {
    title: 'Substitute and simplify',
    prose: 'Plug in the signed ratios and combine over a common denominator.',
    latex:
      '\\cos(\\alpha+\\beta) = \\left(-\\dfrac{3}{5}\\right)\\left(\\dfrac{\\sqrt{3}}{2}\\right) - \\left(\\dfrac{4}{5}\\right)\\left(\\dfrac{1}{2}\\right) = \\dfrac{-3\\sqrt{3}-4}{10}',
    highlight: 'Final exact value: $\\dfrac{-3\\sqrt{3}-4}{10}$.',
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
            'Given $\\sin\\alpha=\\dfrac{4}{5}$ (Quadrant II) and $\\sin\\beta=\\dfrac{1}{2}$ (Quadrant I), find $\\cos(\\alpha+\\beta)$.',
            true,
          )
        "
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        When angles are unknown but ratios and quadrants are known, rebuild each triangle, attach the
        correct signs, then expand the sum formula.
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Triangle α (QII)</p>
        <svg viewBox="0 0 160 120" class="mt-2 h-28 w-full" aria-hidden="true">
          <line x1="80" y1="100" x2="140" y2="100" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
          <line x1="80" y1="100" x2="80" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
          <polygon points="80,100 30,100 30,40" fill="var(--color-primary-soft)" stroke="var(--color-primary)" stroke-width="2" />
          <text x="48" y="112" font-size="11" fill="currentColor">adj 3</text>
          <text x="8" y="75" font-size="11" fill="currentColor">opp 4</text>
          <text x="52" y="62" font-size="11" fill="currentColor">r=5</text>
          <text x="18" y="30" font-size="10" fill="var(--color-primary)">x negative</text>
        </svg>
      </div>
      <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Triangle β (QI)</p>
        <svg viewBox="0 0 160 120" class="mt-2 h-28 w-full" aria-hidden="true">
          <line x1="30" y1="100" x2="140" y2="100" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
          <line x1="30" y1="100" x2="30" y2="20" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
          <polygon points="30,100 110,100 30,40" fill="var(--color-primary-soft)" stroke="var(--color-primary)" stroke-width="2" />
          <text x="55" y="112" font-size="11" fill="currentColor">adj √3</text>
          <text x="4" y="72" font-size="11" fill="currentColor">opp 1</text>
          <text x="68" y="68" font-size="11" fill="currentColor">r=2</text>
        </svg>
      </div>
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
      Press Reveal next step to rebuild each triangle, then expand the formula.
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
            <p class="text-xs font-medium text-[var(--color-primary)]" v-html="renderKatex(step.highlight)" />
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
