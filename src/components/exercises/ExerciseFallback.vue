<script setup>
import { ref } from 'vue'

defineProps({
  exercise: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['answered'])
const completed = ref(false)

function markComplete() {
  if (completed.value) return
  completed.value = true
  emit('answered', { correct: true })
}
</script>

<template>
  <div class="theme-card space-y-4 border border-black/5 bg-[var(--color-panel)] p-6 shadow-sm">
    <p class="theme-pill inline-block bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
      {{ exercise.exerciseType }} · coming soon
    </p>
    <p class="leading-relaxed text-[var(--color-text)]">
      {{ exercise.content ?? 'This exercise type is not implemented yet.' }}
    </p>
    <button
      type="button"
      class="theme-pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      :disabled="completed"
      @click="markComplete"
    >
      {{ completed ? 'Marked complete' : 'Mark complete' }}
    </button>
  </div>
</template>
