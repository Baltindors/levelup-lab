<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)

const allSteps = [
  {
    title: 'Collect like terms',
    prose: 'Treat $\\sin x$ like an algebraic variable. Subtract $3\\sin x$ from both sides.',
    latex: '5\\sin x - 3\\sin x = \\sqrt{3} \\Rightarrow 2\\sin x = \\sqrt{3}',
    highlight: 'Same trig function on both sides → move and combine.',
  },
  {
    title: 'Isolate the function',
    prose: 'Divide by the coefficient to finish the algebraic stage.',
    latex: '\\sin x = \\dfrac{\\sqrt{3}}{2}',
    highlight: 'Now switch from algebra to the unit circle.',
  },
  {
    title: 'Unit-circle lookup in $[0, 2\\pi)$',
    prose: 'Sine is positive $\\dfrac{\\sqrt{3}}{2}$ in Quadrants I and II.',
    latex: 'x = \\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}',
    highlight: 'One period of the circle gives the base solutions.',
  },
  {
    title: 'The infinite loop',
    prose: 'Waves repeat every $2\\pi$. Add $+2n\\pi$ to each base angle for all coterminal solutions.',
    latex:
      'x = \\dfrac{\\pi}{3} + 2n\\pi \\quad\\text{or}\\quad x = \\dfrac{2\\pi}{3} + 2n\\pi,\\ n\\in\\mathbb{Z}',
    highlight: 'Report $[0,2\\pi)$ when asked for one cycle; use $+2n\\pi$ for all reals.',
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

const rayA = {
  x: 100 + 70 * Math.cos(Math.PI / 3),
  y: 100 - 70 * Math.sin(Math.PI / 3),
}
const rayB = {
  x: 100 + 70 * Math.cos((2 * Math.PI) / 3),
  y: 100 - 70 * Math.sin((2 * Math.PI) / 3),
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Worked example</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('$5\\sin x = 3\\sin x + \\sqrt{3}$', true)"
      />
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        Isolate the trig function just like an algebraic variable, then read angles from the unit circle.
      </p>
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p
        class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
        v-html="renderKatex('Unit circle — $\\sin x = \\sqrt{3}/2$')"
      />
      <svg viewBox="0 0 200 200" class="mx-auto mt-2 h-44 w-44" aria-hidden="true">
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" stroke-width="1" opacity="0.3" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" stroke-width="1" opacity="0.3" />
        <line x1="100" y1="100" :x2="rayA.x" :y2="rayA.y" stroke="var(--color-primary)" stroke-width="2" />
        <line x1="100" y1="100" :x2="rayB.x" :y2="rayB.y" stroke="var(--color-primary)" stroke-width="2" />
        <circle :cx="rayA.x" :cy="rayA.y" r="4" fill="var(--color-primary)" />
        <circle :cx="rayB.x" :cy="rayB.y" r="4" fill="var(--color-primary)" />
        <text x="132" y="52" font-size="11" fill="currentColor">π/3</text>
        <text x="48" y="52" font-size="11" fill="currentColor">2π/3</text>
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
      Press Reveal next step to isolate, look up angles, then write the general solution.
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
