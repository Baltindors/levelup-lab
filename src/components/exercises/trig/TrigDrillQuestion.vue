<script setup>
import { computed, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { analyzeTrigEquation } from '../../../utils/trigSolver'

const props = defineProps({
  question: { type: Object, required: true },
  submit: { type: Function, required: true },
  feedback: { type: String, default: null },
})

const amplitude = ref('')
const period = ref('')
const phaseDirection = ref('none')
const phaseMagnitude = ref('')
const midline = ref('')

const locked = computed(() => Boolean(props.feedback))

const ampLabel = computed(() => {
  const a = analyzeTrigEquation(props.question.equation)
  if (!a.ok) return 'Amplitude / Vertical Stretch'
  return a.amplitudeDefined ? 'Amplitude |A|' : 'Vertical Stretch Factor |A|'
})

const equationHtml = computed(() => {
  const eq = props.question.equation.replace(/\*/g, '\\cdot ')
  try {
    return katex.renderToString(`y=${eq}`, {
      throwOnError: false,
      displayMode: true,
    })
  } catch {
    return `y = ${props.question.equation}`
  }
})

function onSubmit() {
  if (locked.value) return
  props.submit({
    amplitude: amplitude.value,
    period: period.value,
    phaseDirection: phaseDirection.value,
    phaseMagnitude: phaseMagnitude.value,
    midline: midline.value,
  })
}
</script>

<template>
  <div class="theme-card space-y-4 border border-black/5 bg-[var(--color-panel)] p-5 shadow-sm">
    <p class="text-sm text-[var(--color-muted)]">
      {{ question.prompt || 'Find amplitude/stretch, period, phase shift, and midline.' }}
    </p>
    <div class="overflow-x-auto" v-html="equationHtml" />

    <div class="grid gap-3 sm:grid-cols-2">
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">{{ ampLabel }}</span>
        <input
          v-model="amplitude"
          type="text"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-black/10 px-3 py-2 font-mono"
          placeholder="e.g. 3"
          :disabled="locked"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Period T</span>
        <input
          v-model="period"
          type="text"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-black/10 px-3 py-2 font-mono"
          placeholder="e.g. pi/2 or 2pi"
          :disabled="locked"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Phase shift direction</span>
        <select
          v-model="phaseDirection"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-black/10 px-3 py-2"
          :disabled="locked"
        >
          <option value="none">None</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-[var(--color-muted)]">Phase shift magnitude</span>
        <input
          v-model="phaseMagnitude"
          type="text"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-black/10 px-3 py-2 font-mono"
          placeholder="0 or pi/2"
          :disabled="locked"
        />
      </label>
      <label class="block text-sm sm:col-span-2">
        <span class="font-semibold text-[var(--color-muted)]">Midline y = D</span>
        <input
          v-model="midline"
          type="text"
          class="mt-1 w-full rounded-[var(--radius-card)] border border-black/10 px-3 py-2 font-mono"
          placeholder="e.g. 1 or -2"
          :disabled="locked"
        />
      </label>
    </div>

    <button
      type="button"
      class="theme-pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      :disabled="locked"
      @click="onSubmit"
    >
      Submit Answer
    </button>
  </div>
</template>
