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
    'w-full rounded-[var(--radius-card)] border px-4 py-3 text-left transition disabled:cursor-not-allowed'

  if (!hasAnswered.value) {
    return `${base} border-black/10 bg-[var(--color-panel)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]`
  }

  const isSelected = selectedId.value === optionId
  const isCorrect = optionId === props.exercise.correctOptionId

  if (isCorrect) {
    return `${base} border-emerald-500 bg-emerald-50 text-emerald-900`
  }
  if (isSelected) {
    return `${base} border-rose-400 bg-rose-50 text-rose-900`
  }
  return `${base} border-black/5 bg-[var(--color-panel)] opacity-60`
}
</script>

<template>
  <div class="theme-card space-y-4 border border-black/5 bg-[var(--color-panel)] p-6 shadow-sm">
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
