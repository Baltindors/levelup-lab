<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['answered'])

const flipped = ref(false)
const hasAnswered = ref(false)

const front = computed(() => props.exercise.front ?? props.exercise.title)
const back = computed(() => props.exercise.back ?? props.exercise.content)

function flipCard() {
  if (hasAnswered.value) return
  flipped.value = !flipped.value
}

function markGotIt() {
  if (hasAnswered.value || !flipped.value) return
  hasAnswered.value = true
  emit('answered', { correct: true })
}

function markReviewAgain() {
  if (hasAnswered.value || !flipped.value) return
  hasAnswered.value = true
  emit('answered', { correct: false })
}
</script>

<template>
  <div class="theme-card space-y-4 border border-black/5 bg-[var(--color-panel)] p-6 shadow-sm">
    <button
      type="button"
      class="min-h-40 w-full rounded-[var(--radius-card)] border border-black/10 bg-[var(--color-primary-soft)] p-6 text-left transition hover:border-[var(--color-primary)] disabled:cursor-not-allowed"
      :disabled="hasAnswered"
      :aria-pressed="flipped"
      @click="flipCard"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {{ flipped ? 'Answer' : 'Prompt' }}
      </p>
      <p class="mt-3 text-lg font-medium leading-relaxed text-[var(--color-text)]">
        {{ flipped ? back : front }}
      </p>
      <p v-if="!hasAnswered" class="mt-4 text-sm text-[var(--color-muted)]">
        {{ flipped ? 'Tap to hide answer' : 'Tap to reveal answer' }}
      </p>
    </button>

    <div v-if="flipped" class="flex flex-wrap gap-3">
      <button
        type="button"
        class="theme-pill bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        :disabled="hasAnswered"
        @click="markGotIt"
      >
        Got it
      </button>
      <button
        type="button"
        class="theme-pill border border-[var(--color-primary)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-50"
        :disabled="hasAnswered"
        @click="markReviewAgain"
      >
        Review again
      </button>
    </div>
  </div>
</template>
