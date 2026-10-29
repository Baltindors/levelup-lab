<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'

const revealedStep = ref(0)
const rootStep = ref(0)

const allSteps = [
  {
    title: 'Set equal to zero',
    prose: 'Move every term to one side before factoring.',
    latex: '\\sin x\\tan x - \\sin x = 0',
    highlight: 'Zero on one side is the setup for a product = 0.',
  },
  {
    title: 'Factor the common term',
    prose: 'Pull out $\\sin x$ instead of dividing by it.',
    latex: '\\sin x(\\tan x - 1) = 0',
    highlight: 'Factoring keeps every branch of solutions.',
  },
  {
    title: 'Split into two equations',
    prose: 'A product is zero when either factor is zero.',
    latex: '\\sin x = 0 \\quad\\text{or}\\quad \\tan x = 1',
    highlight: 'Solve each equation separately on the circle.',
  },
  {
    title: 'Solve in $[0, 2\\pi)$',
    prose: 'Combine both branches for the complete set.',
    latex: 'x = 0,\\ \\pi,\\ \\dfrac{\\pi}{4},\\ \\dfrac{5\\pi}{4}',
    highlight: 'Missing $0$ or $\\pi$ usually means someone divided by $\\sin x$.',
  },
]

const rootSteps = [
  {
    title: 'Isolate the square',
    latex: '4\\cos^2 x = 3 \\Rightarrow \\cos^2 x = \\dfrac{3}{4}',
  },
  {
    title: 'Take square roots with $\\pm$',
    latex: '\\cos x = \\pm \\dfrac{\\sqrt{3}}{2}',
  },
  {
    title: 'Four quadrant answers in $[0, 2\\pi)$',
    latex: 'x = \\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6},\\ \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}',
  },
]

const maxStep = allSteps.length
const visibleSteps = computed(() => allSteps.slice(0, revealedStep.value))
const visibleRoot = computed(() => rootSteps.slice(0, rootStep.value))

function revealNext() {
  if (revealedStep.value < maxStep) revealedStep.value += 1
}

function resetSteps() {
  revealedStep.value = 0
}

function revealRoot() {
  if (rootStep.value < rootSteps.length) rootStep.value += 1
}

function resetRoot() {
  rootStep.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-[var(--radius-card)] border border-amber-500/40 bg-amber-500/10 p-4">
      <p class="text-sm font-semibold text-[var(--color-text)]">The factoring trap</p>
      <p
        class="mt-2 text-sm text-[var(--color-muted)]"
        v-html="
          renderKatex(
            'Never divide both sides by a trig function, or you will lose solutions! Dividing $\\sin x\\tan x=\\sin x$ by $\\sin x$ leaves only $\\tan x=1$ and drops the angles where $\\sin x=0$.',
          )
        "
      />
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Worked example</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('$\\sin x \\tan x = \\sin x$', true)"
      />
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
      Press Reveal next step to factor safely and keep every solution.
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

    <div class="space-y-3 border-t border-[var(--color-border)] pt-4">
      <header class="space-y-1">
        <h4 class="text-base font-semibold text-[var(--color-text)]">Secondary method: square roots</h4>
        <p
          class="text-sm text-[var(--color-muted)]"
          v-html="
            renderKatex(
              'For $4\\cos^2 x - 3 = 0$, taking a square root requires $\\pm$, which produces four quadrant answers.',
            )
          "
        />
      </header>

      <div
        class="overflow-x-auto max-w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-base"
        v-html="renderKatex('$4\\cos^2 x - 3 = 0$', true)"
      />

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="math-btn math-btn--primary"
          :disabled="rootStep >= rootSteps.length"
          @click="revealRoot"
        >
          Reveal next step
        </button>
        <button type="button" class="math-btn math-btn--ghost" @click="resetRoot">
          Reset steps
        </button>
      </div>

      <ol v-if="visibleRoot.length" class="space-y-3">
        <li
          v-for="(step, index) in visibleRoot"
          :key="step.title"
          class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3"
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
              <div
                class="overflow-x-auto max-w-full py-1 text-base"
                v-html="renderKatex('$' + step.latex + '$', true)"
              />
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
