<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getGrade } from '../../../data/mockData'

const route = useRoute()
const activeGrade = computed(() => getGrade(route.params.gradeId))
const shinobi = computed(() => activeGrade.value?.theme === 'theme-grade-5')
const phaseLabels = computed(() => (shinobi.value ? activeGrade.value?.phaseLabels : null))
const victoryTitle = computed(() => (shinobi.value ? activeGrade.value?.victoryTitle : null))

const props = defineProps({
  gradeAnswer: {
    type: Function,
    required: true,
  },
  currentIndex: { type: Number, default: 0 },
  drillSize: { type: Number, default: 10 },
  currentQuestion: { type: Object, default: null },
  isComplete: { type: Boolean, default: false },
  inProgress: { type: Boolean, default: false },
  answeredCurrent: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  results: { type: Array, default: () => [] },
  missedQuestions: { type: Array, default: () => [] },
  passed: { type: Boolean, default: false },
  startDrill: { type: Function, required: true },
  recordAnswer: { type: Function, required: true },
  advance: { type: Function, required: true },
  restartFull: { type: Function, required: true },
  retryMissed: { type: Function, required: true },
  reset: { type: Function, required: true },
})

const tab = ref('explore') // 'explore' | 'practice'
const cardFeedback = ref(null) // null | 'correct' | 'incorrect'
const openResultIds = ref([])

const progressPct = computed(() => {
  if (!props.drillSize) return 0
  const done = props.isComplete
    ? props.drillSize
    : props.currentIndex + (props.answeredCurrent ? 1 : 0)
  return Math.min(100, Math.round((done / props.drillSize) * 100))
})

const scorePct = computed(() => Math.round((props.score || 0) * 100))

const isLastCard = computed(
  () => props.currentIndex >= Math.max(0, props.drillSize - 1)
)

watch(
  () => props.currentQuestion?.id,
  () => {
    cardFeedback.value = null
  }
)

function selectTab(next) {
  if (next === 'practice') {
    if (!props.inProgress && !props.isComplete) {
      props.startDrill()
    }
    tab.value = 'practice'
    return
  }

  if (props.inProgress && !props.isComplete) {
    const ok = window.confirm('Leave the drill and return to Explore? Progress on this run will be cleared.')
    if (!ok) return
    props.reset()
    cardFeedback.value = null
  }
  tab.value = 'explore'
}

function onSubmit(studentAnswers) {
  if (!props.currentQuestion || props.answeredCurrent) return
  const isCorrect = Boolean(props.gradeAnswer(props.currentQuestion, studentAnswers))
  props.recordAnswer(isCorrect, studentAnswers)
  cardFeedback.value = isCorrect ? 'correct' : 'incorrect'
}

function onNext() {
  props.advance()
  cardFeedback.value = null
}

function onRetryMissed() {
  props.retryMissed()
  cardFeedback.value = null
  tab.value = 'practice'
}

function onRetake() {
  props.restartFull()
  cardFeedback.value = null
  tab.value = 'practice'
}

function toggleResult(id) {
  if (openResultIds.value.includes(id)) {
    openResultIds.value = openResultIds.value.filter((x) => x !== id)
  } else {
    openResultIds.value = [...openResultIds.value, id]
  }
}
</script>

<template>
  <div class="space-y-5">
    <div
      class="math-phase-tabs"
      role="tablist"
      aria-label="Math module mode"
    >
      <button
        type="button"
        role="tab"
        class="math-phase-tabs__btn"
        :class="{ 'math-phase-tabs__btn--active': tab === 'explore' }"
        :aria-selected="tab === 'explore'"
        @click="selectTab('explore')"
      >
        {{ phaseLabels?.explore ?? 'Explore & Learn' }}
      </button>
      <button
        type="button"
        role="tab"
        class="math-phase-tabs__btn"
        :class="{ 'math-phase-tabs__btn--active': tab === 'practice' }"
        :aria-selected="tab === 'practice'"
        @click="selectTab('practice')"
      >
        {{ phaseLabels?.practice ?? `Practice Drill (${drillSize} Questions)` }}
      </button>
    </div>

    <!-- Explore -->
    <div v-if="tab === 'explore'">
      <slot name="explorer" />
    </div>

    <!-- Practice in progress -->
    <div v-else-if="inProgress && currentQuestion" class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm font-semibold text-[var(--color-muted)]">
          Card {{ currentIndex + 1 }} of {{ drillSize }}
        </p>
        <button
          type="button"
          class="text-sm font-semibold text-[var(--color-primary)] underline"
          @click="selectTab('explore')"
        >
          Exit drill
        </button>
      </div>

      <div class="h-2 overflow-hidden rounded-full bg-[var(--color-primary-soft)]">
        <div
          class="h-full bg-[var(--color-primary)] transition-all duration-300"
          :style="{ width: `${progressPct}%` }"
        />
      </div>

      <div :key="currentQuestion.id">
        <slot
          name="question"
          :question="currentQuestion"
          :submit="onSubmit"
          :feedback="cardFeedback"
        />
      </div>

      <div v-if="cardFeedback" class="flex flex-wrap items-center gap-3">
        <p
          class="theme-pill px-3 py-1.5 text-sm font-bold"
          :class="cardFeedback === 'correct' ? 'feedback-correct' : 'feedback-incorrect'"
        >
          {{ cardFeedback === 'correct' ? 'Correct' : 'Incorrect' }}
        </p>
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          @click="onNext"
        >
          {{ isLastCard ? 'See Results →' : 'Next Card →' }}
        </button>
      </div>
    </div>

    <!-- Practice results -->
    <div v-else-if="isComplete" class="space-y-5">
      <div
        v-if="passed && victoryTitle"
        class="speedlines theme-card border border-[var(--color-primary)] p-4 sm:p-5"
        role="status"
      >
        <p class="display text-2xl tracking-wide text-[var(--color-text)] sm:text-4xl">
          {{ victoryTitle }}
        </p>
      </div>
      <div class="theme-card border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm sm:p-5">
        <p class="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Drill complete
        </p>
        <p class="display mt-2 text-3xl font-bold text-[var(--color-text)]">
          {{ correctCount }} / {{ results.length }} ({{ scorePct }}%)
        </p>
        <p
          class="theme-pill mt-3 inline-block px-3 py-1 text-sm font-bold"
          :class="passed ? 'feedback-correct' : 'feedback-pending'"
        >
          {{ passed ? 'Passed' : 'Keep practicing' }}
        </p>

        <div class="mt-4 flex flex-wrap gap-3">
          <button
            v-if="missedQuestions.length"
            type="button"
            class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            @click="onRetryMissed"
          >
            Retry Missed Questions
          </button>
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]"
            @click="onRetake"
          >
            Retake Full Drill
          </button>
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-muted)]"
            @click="selectTab('explore')"
          >
            Back to Explore
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="display text-xl font-bold">Review</h3>
        <div
          v-for="(item, idx) in results"
          :key="item.question.id + '-' + idx"
          class="theme-card border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            @click="toggleResult(item.question.id + '-' + idx)"
          >
            <span class="font-semibold text-[var(--color-text)]">
              {{ idx + 1 }}. {{ item.question.equation }}
            </span>
            <span
              class="theme-pill px-2 py-0.5 text-xs font-bold uppercase"
              :class="item.isCorrect ? 'feedback-correct' : 'feedback-incorrect'"
            >
              {{ item.isCorrect ? 'Correct' : 'Missed' }}
            </span>
          </button>
          <div
            v-if="!item.isCorrect && openResultIds.includes(item.question.id + '-' + idx)"
            class="border-t border-[var(--color-border)] px-4 py-3"
          >
            <slot name="explanation" :item="item" />
          </div>
          <div
            v-else-if="item.isCorrect && openResultIds.includes(item.question.id + '-' + idx)"
            class="border-t border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-muted)]"
          >
            Nice work on this one.
          </div>
        </div>
      </div>
    </div>

    <!-- Practice idle (should rarely show) -->
    <div v-else class="theme-card border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm sm:p-5">
      <p class="text-[var(--color-muted)]">Ready when you are.</p>
      <button
        type="button"
        class="theme-pill mt-3 inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        @click="startDrill(); tab = 'practice'"
      >
        Start Practice Drill
      </button>
    </div>
  </div>
</template>
