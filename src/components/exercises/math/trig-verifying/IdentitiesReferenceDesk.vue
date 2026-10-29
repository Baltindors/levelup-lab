<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../../utils/mathKatex'
import MathSegmentedControl from '../../common/MathSegmentedControl.vue'

const category = ref('reciprocal')

const categories = [
  { id: 'reciprocal', label: 'Reciprocal' },
  { id: 'quotient', label: 'Quotient' },
  { id: 'pythagorean', label: 'Pythagorean' },
  { id: 'even-odd', label: 'Even-Odd' },
]

const catalogs = {
  reciprocal: {
    blurb: 'Reciprocal identities flip a function into its partner. Reach for these when you see csc, sec, or cot.',
    formulas: [
      '$\\csc x = \\dfrac{1}{\\sin x}$',
      '$\\sec x = \\dfrac{1}{\\cos x}$',
      '$\\cot x = \\dfrac{1}{\\tan x}$',
      '$\\sin x = \\dfrac{1}{\\csc x}$',
      '$\\cos x = \\dfrac{1}{\\sec x}$',
      '$\\tan x = \\dfrac{1}{\\cot x}$',
    ],
  },
  quotient: {
    blurb: 'Quotient identities rewrite tangent and cotangent as a ratio of sine and cosine.',
    formulas: [
      '$\\tan x = \\dfrac{\\sin x}{\\cos x}$',
      '$\\cot x = \\dfrac{\\cos x}{\\sin x}$',
    ],
  },
  pythagorean: {
    blurb: 'Pythagorean identities come from $\\sin^2 x+\\cos^2 x=1$. Spot squares and rearrangements like $1-\\cos^2 x$.',
    formulas: [
      '$\\sin^2 x + \\cos^2 x = 1$',
      '$1 - \\cos^2 x = \\sin^2 x$',
      '$1 - \\sin^2 x = \\cos^2 x$',
      '$1 + \\tan^2 x = \\sec^2 x$',
      '$1 + \\cot^2 x = \\csc^2 x$',
    ],
  },
  'even-odd': {
    blurb: 'Even-odd identities tell you what happens when the input flips sign. Cosine is even; sine and tangent are odd.',
    formulas: [
      '$\\sin(-x) = -\\sin x$',
      '$\\cos(-x) = \\cos x$',
      '$\\tan(-x) = -\\tan x$',
      '$\\csc(-x) = -\\csc x$',
      '$\\sec(-x) = \\sec x$',
      '$\\cot(-x) = -\\cot x$',
    ],
  },
}

const active = computed(() => catalogs[category.value] ?? catalogs.reciprocal)
</script>

<template>
  <div class="space-y-4">
    <MathSegmentedControl
      v-model="category"
      :options="categories"
      aria-label="Identity category"
    />

    <p class="text-sm text-[var(--color-muted)]">
      {{ active.blurb }}
    </p>

    <ul class="grid gap-2 sm:grid-cols-2">
      <li
        v-for="(formula, index) in active.formulas"
        :key="`${category}-${index}`"
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-3"
      >
        <div
          class="overflow-x-auto max-w-full py-1 text-base"
          v-html="renderKatex(formula, true)"
        />
      </li>
    </ul>
  </div>
</template>
