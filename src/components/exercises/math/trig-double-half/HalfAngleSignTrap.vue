<script setup>
import { computed, ref, watch } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'
import MathSegmentedControl from '../../common/MathSegmentedControl.vue'

const revealedStep = ref(0)
const quadrantChoice = ref(null)
const signLocked = ref(false)
const feedback = ref('')

const quadrants = [
  { id: 'I', label: 'QI' },
  { id: 'II', label: 'QII' },
  { id: 'III', label: 'QIII' },
  { id: 'IV', label: 'QIV' },
]

const setupSteps = [
  {
    title: 'Rewrite as a half-angle',
    prose: 'Express $105^\\circ$ as half of a standard angle.',
    latex: '105^\\circ = \\dfrac{210^\\circ}{2} \\Rightarrow \\cos 105^\\circ = \\cos\\left(\\dfrac{210^\\circ}{2}\\right)',
    highlight: 'The full angle in the formula is $210^\\circ$; the half-angle is $105^\\circ$.',
  },
]

const afterSignSteps = [
  {
    title: 'Apply the half-angle formula with the chosen sign',
    prose: 'Cosine is negative in Quadrant II, so take the negative root.',
    latex: '\\cos 105^\\circ = -\\sqrt{\\dfrac{1 + \\cos 210^\\circ}{2}}',
    highlight: 'The $\\pm$ is now a definite minus — one answer, not two.',
  },
  {
    title: 'Substitute and simplify',
    prose: 'Use $\\cos 210^\\circ = -\\dfrac{\\sqrt{3}}{2}$.',
    latex:
      '-\\sqrt{\\dfrac{1 - \\dfrac{\\sqrt{3}}{2}}{2}} = -\\sqrt{\\dfrac{2-\\sqrt{3}}{4}} = -\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}',
    highlight: 'Exact value: $-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$.',
  },
]

const visibleSetup = computed(() => setupSteps.slice(0, Math.min(revealedStep.value, 1)))
const showSignGate = computed(() => revealedStep.value >= 1 && !signLocked.value)
const visibleAfter = computed(() =>
  signLocked.value ? afterSignSteps.slice(0, Math.max(0, revealedStep.value - 1)) : [],
)

const maxStep = computed(() => (signLocked.value ? 1 + afterSignSteps.length : 1))

watch(quadrantChoice, (value) => {
  if (!value || signLocked.value) return
  if (value === 'II') {
    signLocked.value = true
    feedback.value = 'Correct — $105^\\circ$ is in Quadrant II, so cosine is negative.'
  } else {
    feedback.value = 'Not yet. Locate $105^\\circ$ on the unit circle: past $90^\\circ$, before $180^\\circ$.'
  }
})

function revealNext() {
  if (!signLocked.value && revealedStep.value >= 1) return
  if (revealedStep.value < maxStep.value) revealedStep.value += 1
}

function resetSteps() {
  revealedStep.value = 0
  quadrantChoice.value = null
  signLocked.value = false
  feedback.value = ''
}

const canReveal = computed(() => {
  if (revealedStep.value === 0) return true
  if (!signLocked.value) return false
  return revealedStep.value < maxStep.value
})

const ray = (() => {
  const rad = (105 * Math.PI) / 180
  return {
    x: 100 + 70 * Math.cos(rad),
    y: 100 - 70 * Math.sin(rad),
  }
})()
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-[var(--radius-card)] border border-amber-500/40 bg-amber-500/10 p-4">
      <p class="text-sm font-semibold text-[var(--color-text)]">The plus-or-minus trap</p>
      <p
        class="mt-2 text-sm text-[var(--color-muted)]"
        v-html="
          renderKatex(
            'The $\\pm$ does NOT mean there are two answers. It means YOU have to choose the sign based on the quadrant where the half-angle ($\\dfrac{\\alpha}{2}$) lives.',
          )
        "
      />
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Goal</p>
      <div
        class="overflow-x-auto max-w-full py-1 text-lg"
        v-html="renderKatex('Find the exact value of $\\cos 105^\\circ$.', true)"
      />
    </div>

    <div class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Unit circle — half-angle $105^\\circ$
      </p>
      <svg viewBox="0 0 200 200" class="mx-auto mt-2 h-44 w-44" aria-hidden="true">
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" stroke-width="1" opacity="0.3" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" stroke-width="1" opacity="0.3" />
        <line
          x1="100"
          y1="100"
          :x2="ray.x"
          :y2="ray.y"
          stroke="var(--color-primary)"
          stroke-width="2.5"
        />
        <circle :cx="ray.x" :cy="ray.y" r="4" fill="var(--color-primary)" />
        <text x="28" y="48" font-size="12" fill="var(--color-primary)">QII</text>
        <text x="118" y="58" font-size="11" fill="currentColor">105°</text>
      </svg>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="math-btn math-btn--primary"
        :disabled="!canReveal"
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
      v-html="renderKatex('Press Reveal next step to set up $\\cos\\left(\\dfrac{210^\\circ}{2}\\right)$.')"
    />

    <ol v-if="visibleSetup.length" class="space-y-3">
      <li
        v-for="(step, index) in visibleSetup"
        :key="step.title"
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3"
        :class="!signLocked && index === visibleSetup.length - 1 ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : ''"
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

    <div
      v-if="showSignGate || signLocked"
      class="space-y-3 rounded-[var(--radius-card)] border border-[var(--color-border)] p-3"
    >
      <p
        class="text-sm font-semibold"
        v-html="renderKatex('Which quadrant is $105^\\circ$ in?')"
      />
      <MathSegmentedControl
        v-model="quadrantChoice"
        :options="quadrants"
        aria-label="Quadrant of 105 degrees"
      />
      <p
        v-if="feedback"
        class="text-sm"
        :class="signLocked ? 'font-semibold text-emerald-700' : 'text-[var(--color-muted)]'"
        v-html="renderKatex(feedback)"
      />
    </div>

    <ol v-if="visibleAfter.length" class="space-y-3">
      <li
        v-for="(step, index) in visibleAfter"
        :key="step.title"
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3"
        :class="index === visibleAfter.length - 1 ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]' : ''"
      >
        <div class="flex gap-3">
          <span
            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-xs font-bold"
          >
            {{ index + 2 }}
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
