<script setup>
import { computed } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'

const DISPLAY_LETTERS = ['A', 'B', 'C', 'D']

const props = defineProps({
  item: { type: Object, required: true },
})

const question = computed(() => props.item?.question ?? {})
const selectedId = computed(() => props.item?.studentAnswers?.selectedId)
const correctId = computed(() => question.value.correctAnswer)

const questionHtml = computed(() => renderKatex(question.value.question ?? ''))
const explanationHtml = computed(() => renderKatex(question.value.explanation ?? ''))
const steps = computed(() =>
  Array.isArray(question.value.steps) ? question.value.steps.filter(Boolean) : [],
)
const hasSolution = computed(
  () => steps.value.length > 0 || Boolean(question.value.explanation),
)

function optionHtml(label) {
  return renderKatex(label ?? '')
}

function stepHtml(step) {
  return renderKatex(step ?? '')
}

function displayLetter(index) {
  return DISPLAY_LETTERS[index] ?? String(index + 1)
}

function optionClass(optionId) {
  if (optionId === correctId.value) {
    return 'border-emerald-500 bg-emerald-950/40'
  }
  if (optionId === selectedId.value) {
    return 'border-rose-500 bg-rose-950/40'
  }
  return 'border-[var(--color-border)]'
}
</script>

<template>
  <div class="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
    <div class="font-semibold leading-relaxed [&>.katex-display]:my-0" v-html="questionHtml" />

    <ul class="space-y-2">
      <li
        v-for="(option, index) in question.options || []"
        :key="option.id"
        class="flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] border px-3 py-3"
        :class="optionClass(option.id)"
      >
        <span class="text-xs font-bold uppercase text-[var(--color-muted)]">
          {{ displayLetter(index) }}.
        </span>
        <span class="min-w-0 leading-normal text-[var(--color-text)]" v-html="optionHtml(option.label)" />
        <span
          v-if="option.id === correctId"
          class="text-xs font-semibold text-emerald-300"
        >
          (correct)
        </span>
        <span
          v-else-if="option.id === selectedId"
          class="text-xs font-semibold text-rose-300"
        >
          (your answer)
        </span>
      </li>
    </ul>

    <div
      v-if="hasSolution"
      class="space-y-3 rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <p class="display text-lg tracking-wide text-amber-200">
          Scroll Master's Breakdown
        </p>
        <span
          v-if="question.rule"
          class="ninja-tag display bg-amber-500/20 px-3 py-1 text-xs tracking-wide text-amber-200"
        >
          {{ question.rule }}
        </span>
      </div>

      <ol v-if="steps.length" class="space-y-3">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="flex gap-3"
        >
          <span
            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-500/50 bg-amber-500/15 text-xs font-bold text-amber-200"
          >
            {{ index + 1 }}
          </span>
          <div
            class="min-w-0 flex-1 pt-0.5 text-sm leading-relaxed text-[var(--color-text)]"
            v-html="stepHtml(step)"
          />
        </li>
      </ol>

      <div
        v-else
        class="text-sm leading-relaxed text-[var(--color-text)]"
        v-html="explanationHtml"
      />
    </div>
  </div>
</template>
