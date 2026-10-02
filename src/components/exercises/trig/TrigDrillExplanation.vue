<script setup>
import { computed } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { analyzeTrigEquation } from '../../../utils/trigSolver'
import { gradeTrigDrillAnswers } from '../../../utils/trigDrillGrade'

const props = defineProps({
  item: { type: Object, required: true },
})

const grade = computed(() =>
  gradeTrigDrillAnswers(props.item.question.equation, props.item.studentAnswers)
)

const analysis = computed(() => analyzeTrigEquation(props.item.question.equation))

function renderKatex(latex, displayMode = false) {
  if (!latex) return ''
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode })
  } catch {
    return latex
  }
}

function fmtStudent(value) {
  if (value == null || value === '') return '(blank)'
  return String(value)
}
</script>

<template>
  <div class="space-y-4 text-sm">
    <div class="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-3">
      <p class="font-semibold text-[var(--color-muted)]">Your answers</p>
      <ul class="mt-2 space-y-1 text-[var(--color-text)]">
        <li>Amplitude / stretch: {{ fmtStudent(item.studentAnswers?.amplitude) }}</li>
        <li>Period: {{ fmtStudent(item.studentAnswers?.period) }}</li>
        <li>
          Phase:
          {{ fmtStudent(item.studentAnswers?.phaseDirection) }}
          {{ fmtStudent(item.studentAnswers?.phaseMagnitude) }}
        </li>
        <li>Midline: {{ fmtStudent(item.studentAnswers?.midline) }}</li>
      </ul>
    </div>

    <div v-if="grade.expected" class="rounded-[var(--radius-card)] bg-[var(--color-surface)] p-3">
      <p class="font-semibold text-[var(--color-muted)]">Expected</p>
      <ul class="mt-2 space-y-1 text-[var(--color-text)]">
        <li>
          {{ grade.expected.amplitudeLabel }}:
          {{ grade.expected.amplitude }}
        </li>
        <li>
          Period:
          <span v-html="renderKatex(grade.expected.periodLatex)" />
        </li>
        <li>
          Phase: {{ grade.expected.phaseDirection }}
          <span v-html="renderKatex(grade.expected.phaseMagnitudeLatex)" />
        </li>
        <li>
          Midline:
          <span v-html="renderKatex('y=' + grade.expected.midlineLatex)" />
        </li>
      </ul>
    </div>

    <template v-if="analysis.ok">
      <p class="font-semibold text-[var(--color-primary)]">Step-by-step solution</p>
      <div
        v-for="step in analysis.steps"
        :key="step.title"
        class="rounded-[var(--radius-card)] border border-black/5 p-3"
      >
        <p class="font-bold text-[var(--color-text)]">{{ step.title }}</p>
        <div
          v-if="step.latex"
          class="mt-2 overflow-x-auto"
          v-html="renderKatex(step.latex, true)"
        />
        <div
          v-if="step.extraLatex"
          class="mt-2 overflow-x-auto"
          v-html="renderKatex(step.extraLatex, true)"
        />
        <p v-if="step.note" class="mt-2 text-[var(--color-muted)]">{{ step.note }}</p>
      </div>
    </template>
  </div>
</template>
