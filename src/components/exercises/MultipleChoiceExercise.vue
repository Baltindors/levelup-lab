<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['answered'])

const selectedId = ref(null)
const hasAnswered = ref(false)

const question = computed(
  () => props.exercise.question ?? props.exercise.content ?? props.exercise.title
)
const options = computed(() => props.exercise.options ?? [])

function selectOption(optionId) {
  if (hasAnswered.value) return

  selectedId.value = optionId
  hasAnswered.value = true

  const correct = optionId === props.exercise.correctOptionId
  emit('answered', { correct })
}

function optionClasses(optionId) {
  const base =
    'min-h-11 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3 text-left transition disabled:cursor-not-allowed'

  if (!hasAnswered.value) {
    return `${base} bg-[var(--color-panel)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]`
  }

  const isSelected = selectedId.value === optionId
  const isCorrect = optionId === props.exercise.correctOptionId

  if (isCorrect) {
    return `${base} feedback-correct`
  }
  if (isSelected) {
    return `${base} feedback-incorrect`
  }
  return `${base} bg-[var(--color-panel)] text-[var(--color-text)] opacity-60`
}
</script>

<template>
  <div class="theme-card space-y-4 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm sm:p-6">
    <p class="text-lg font-medium leading-relaxed text-[var(--color-text)]">{{ question }}</p>

    <div class="grid gap-3" role="listbox" aria-label="Answer choices">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        role="option"
        :aria-selected="selectedId === option.id"
        :disabled="hasAnswered"
        :class="optionClasses(option.id)"
        @click="selectOption(option.id)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
