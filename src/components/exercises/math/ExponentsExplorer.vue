<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'

const mode = ref('product')
const base = ref('r')
const expA = ref(5)
const expB = ref(-4)
const outer = ref(2)

const modes = [
  { id: 'product', label: 'Product' },
  { id: 'quotient', label: 'Quotient' },
  { id: 'power', label: 'Power of Powers' },
  { id: 'negative', label: 'Negative Exponent' },
]

const steps = computed(() => {
  const b = String(base.value || 'x').trim() || 'x'
  const a = Number(expA.value)
  const c = Number(expB.value)
  const n = Number(outer.value)

  if (mode.value === 'product') {
    const sum = a + c
    return [
      { title: 'Start', latex: `${b}^{${a}} \\cdot ${b}^{${c}}` },
      { title: 'Add exponents', latex: `${b}^{${a}+(${c})}` },
      { title: 'Simplify', latex: `${b}^{${sum}}` },
    ]
  }

  if (mode.value === 'quotient') {
    const diff = a - c
    return [
      { title: 'Start', latex: `\\dfrac{${b}^{${a}}}{${b}^{${c}}}` },
      { title: 'Subtract exponents', latex: `${b}^{${a}-(${c})}` },
      { title: 'Simplify', latex: `${b}^{${diff}}` },
    ]
  }

  if (mode.value === 'power') {
    const prod = a * n
    return [
      { title: 'Start', latex: `(${b}^{${a}})^{${n}}` },
      { title: 'Multiply exponents', latex: `${b}^{${a}\\cdot ${n}}` },
      { title: 'Simplify', latex: `${b}^{${prod}}` },
    ]
  }

  // negative
  return [
    { title: 'Start', latex: `${b}^{${a}}` },
    {
      title: 'Negative exponent rule',
      latex: a < 0 ? `\\dfrac{1}{${b}^{${-a}}}` : `${b}^{${a}}\\ (already non-negative)`,
    },
    {
      title: 'Check',
      latex:
        a < 0
          ? `${b}^{${a}}=\\dfrac{1}{${b}^{${-a}}}`
          : `If the exponent were negative, invert the base.`,
    },
  ]
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Enter a base and exponents to watch each integer-exponent law applied step by step.
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="item in modes"
        :key="item.id"
        type="button"
        class="theme-pill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
        :class="
          mode === item.id
            ? 'bg-[var(--color-primary)] text-white'
            : 'border border-[var(--color-border)] text-[var(--color-primary)]'
        "
        @click="mode = item.id"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Base</span>
        <input
          v-model="base"
          type="text"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">
          {{ mode === 'power' ? 'Inner exponent' : 'Exponent A' }}
        </span>
        <input
          v-model.number="expA"
          type="number"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
      <label v-if="mode === 'product' || mode === 'quotient'" class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Exponent B</span>
        <input
          v-model.number="expB"
          type="number"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
      <label v-if="mode === 'power'" class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Outer exponent</span>
        <input
          v-model.number="outer"
          type="number"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
        />
      </label>
    </div>

    <ol class="space-y-3">
      <li
        v-for="(step, index) in steps"
        :key="index"
        class="rounded-[var(--radius-card)] border border-black/10 bg-[var(--color-panel)] p-3"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Step {{ index + 1 }} · {{ step.title }}
        </p>
        <div class="mt-2 overflow-x-auto" v-html="renderKatex('$' + step.latex + '$', true)" />
      </li>
    </ol>
  </div>
</template>
