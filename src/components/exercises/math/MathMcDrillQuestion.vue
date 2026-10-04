<script setup>
import { computed, ref, watch } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'

const DISPLAY_LETTERS = ['A', 'B', 'C', 'D']

const props = defineProps({
  question: { type: Object, required: true },
  submit: { type: Function, required: true },
  feedback: { type: String, default: null },
})

const selectedId = ref(null)
const locked = computed(() => Boolean(props.feedback))

watch(
  () => props.question?.id,
  () => {
    selectedId.value = null
  },
)

const questionHtml = computed(() => renderKatex(props.question?.question ?? ''))

function optionHtml(label) {
  return renderKatex(label ?? '')
}

function displayLetter(index) {
  return DISPLAY_LETTERS[index] ?? String(index + 1)
}

function onSubmit() {
  if (locked.value || !selectedId.value) return
  props.submit({ selectedId: selectedId.value })
}
</script>

<template>
  <div class="theme-card space-y-4 border border-black/5 bg-[var(--color-panel)] p-5 shadow-sm">
    <div class="text-lg font-semibold leading-relaxed [&>.katex-display]:my-0" v-html="questionHtml" />

    <div class="grid gap-2" role="radiogroup" aria-label="Answer choices">
      <button
        v-for="(option, index) in question.options || []"
        :key="option.id"
        type="button"
        role="radio"
        :aria-checked="selectedId === option.id"
        class="flex min-h-11 items-center gap-3 rounded-[var(--radius-card)] border px-3 py-3 text-left transition"
        :class="
          selectedId === option.id
            ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]'
            : 'border-black/10 bg-[var(--color-panel)] hover:border-[var(--color-primary)]/50'
        "
        :disabled="locked"
        @click="selectedId = option.id"
      >
        <span
          class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold uppercase"
          :class="
            selectedId === option.id
              ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
              : 'border-black/20 text-[var(--color-muted)]'
          "
        >
          {{ displayLetter(index) }}
        </span>
        <span
          class="min-w-0 flex-1 leading-normal [&>.katex]:whitespace-normal"
          v-html="optionHtml(option.label)"
        />
      </button>
    </div>

    <p
      v-if="feedback === 'correct'"
      class="text-sm font-semibold text-emerald-700"
    >
      Correct!
    </p>
    <p
      v-else-if="feedback === 'incorrect'"
      class="text-sm font-semibold text-rose-700"
    >
      Not quite — check the explanation after the drill.
    </p>

    <button
      type="button"
      class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      :disabled="locked || !selectedId"
      @click="onSubmit"
    >
      Submit
    </button>
  </div>
</template>
