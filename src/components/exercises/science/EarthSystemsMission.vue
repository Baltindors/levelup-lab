<script setup>
import { computed, ref, watch } from 'vue'
import { scienceEarthSystemsPool } from '../../../data/scienceEarthSystemsPool'
import { useScienceMasteryDrill } from '../../../composables/useScienceMasteryDrill'
import WaterCycleExplorer from './WaterCycleExplorer.vue'
import RockCycleExplorer from './RockCycleExplorer.vue'
import AtmosphereExplorer from './AtmosphereExplorer.vue'
import EarthLayersExplorer from './EarthLayersExplorer.vue'
import EnergyTransferExplorer from './EnergyTransferExplorer.vue'

defineProps({
  exercise: { type: Object, required: true },
})

const emit = defineEmits(['answered'])

const tab = ref('explore') // 'explore' | 'trial'
const roundNumber = ref(0)
const selectedOptionId = ref(null)
const hasSubmitted = ref(false)
const lastFeedback = ref(null) // { isCorrect, correctOptionId, correctStreak, isMastered }
const masteredThisRound = ref(0)
const hasEmittedVictory = ref(false)
const roundActive = ref(false)

const {
  masteryById,
  getQuestionMastery,
  currentRoundQuestions,
  currentCardIndex,
  currentQuestion,
  isRoundComplete,
  masteredCount,
  masteryPercentage,
  isMissionComplete,
  startNewRound,
  recordAnswer,
  nextCard,
  resetProgress,
} = useScienceMasteryDrill(scienceEarthSystemsPool)

const remainingUnmastered = computed(() => Math.max(0, 25 - masteredCount.value))

const currentStreak = computed(() => {
  const id = currentQuestion.value?.id
  // Depend on masteryById so dots update immediately after recordAnswer
  void masteryById.value
  return getQuestionMastery(id).correctStreak
})

const isMasteredNow = computed(() => {
  const id = currentQuestion.value?.id
  void masteryById.value
  return getQuestionMastery(id).mastered
})

const showVictory = computed(() => isMissionComplete.value)

const showRoundSummary = computed(
  () =>
    tab.value === 'trial' &&
    roundActive.value &&
    isRoundComplete.value &&
    !isMissionComplete.value,
)

const showActiveCard = computed(
  () =>
    tab.value === 'trial' &&
    roundActive.value &&
    !isRoundComplete.value &&
    currentQuestion.value &&
    !isMissionComplete.value,
)

function resetCardState() {
  selectedOptionId.value = null
  hasSubmitted.value = false
  lastFeedback.value = null
}

watch(
  () => currentQuestion.value?.id,
  () => {
    resetCardState()
  },
)

watch(isMissionComplete, (done) => {
  if (!done || hasEmittedVictory.value) return
  playVictorySound()
  hasEmittedVictory.value = true
  emit('answered', {
    correct: true,
    score: 25,
    total: 25,
    passed: true,
  })
})

function playVictorySound() {
  try {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/level-up.mp3`)
    audio.preload = 'auto'
    audio.volume = 0.9
    const playPromise = audio.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  } catch {
    // Audio unavailable.
  }
}

function clearRoundUi() {
  roundActive.value = false
  masteredThisRound.value = 0
  resetCardState()
}

function enterTrial() {
  if (isMissionComplete.value) {
    tab.value = 'trial'
    roundActive.value = false
    return
  }
  roundNumber.value += 1
  masteredThisRound.value = 0
  resetCardState()
  startNewRound(10)
  roundActive.value = true
  tab.value = 'trial'
}

function selectTab(next) {
  if (next === 'trial') {
    if (!roundActive.value && !isMissionComplete.value && !isRoundComplete.value) {
      enterTrial()
      return
    }
    tab.value = 'trial'
    return
  }

  if (roundActive.value && !isRoundComplete.value && !isMissionComplete.value) {
    const ok = window.confirm(
      'Leave the trial and return to Dojo Sandbox? This round will end, but mastery progress is saved.',
    )
    if (!ok) return
    clearRoundUi()
  }
  tab.value = 'explore'
}

function submitAnswer() {
  if (!currentQuestion.value || hasSubmitted.value || !selectedOptionId.value) return
  const wasMastered = getQuestionMastery(currentQuestion.value.id).mastered
  const feedback = recordAnswer(currentQuestion.value.id, selectedOptionId.value)
  lastFeedback.value = feedback
  hasSubmitted.value = true
  if (feedback.isMastered && !wasMastered) {
    masteredThisRound.value += 1
  }
}

function onNextCard() {
  nextCard()
  resetCardState()
}

function startNextRound() {
  if (isMissionComplete.value) return
  roundNumber.value += 1
  masteredThisRound.value = 0
  resetCardState()
  startNewRound(10)
  roundActive.value = true
}

function onResetMission() {
  resetProgress()
  hasEmittedVictory.value = false
  roundNumber.value = 0
  clearRoundUi()
  tab.value = 'explore'
}

const explorerSections = [
  { id: 'water-cycle', title: 'Water Cycle', badge: '01', component: WaterCycleExplorer },
  { id: 'rock-cycle', title: 'Rock Cycle', badge: '02', component: RockCycleExplorer },
  { id: 'atmosphere', title: 'Atmosphere Layers', badge: '03', component: AtmosphereExplorer },
  { id: 'earth-layers', title: "Earth's Layers", badge: '04', component: EarthLayersExplorer },
  {
    id: 'energy-transfer',
    title: 'Energy & Heat Transfer',
    badge: '05',
    component: EnergyTransferExplorer,
  },
]
</script>

<template>
  <div class="space-y-5">
    <div class="math-phase-tabs" role="tablist" aria-label="Earth Systems mission mode">
      <button
        type="button"
        role="tab"
        class="math-phase-tabs__btn"
        :class="{ 'math-phase-tabs__btn--active': tab === 'explore' }"
        :aria-selected="tab === 'explore'"
        @click="selectTab('explore')"
      >
        Dojo Sandbox
      </button>
      <button
        type="button"
        role="tab"
        class="math-phase-tabs__btn"
        :class="{ 'math-phase-tabs__btn--active': tab === 'trial' }"
        :aria-selected="tab === 'trial'"
        @click="selectTab('trial')"
      >
        Chakra Mastery Trial
      </button>
    </div>

    <!-- Dojo Sandbox -->
    <div v-if="tab === 'explore'" class="space-y-8">
      <p class="text-sm text-[var(--color-muted)]">
        Train with interactive Earth Systems models, then prove mastery in a 2-streak chakra trial.
      </p>

      <section
        v-for="section in explorerSections"
        :id="section.id"
        :key="section.id"
        class="scroll-mt-4 space-y-3"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span
            class="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-0.5 text-xs font-bold tracking-wide text-[var(--color-primary)]"
          >
            {{ section.badge }}
          </span>
          <h3 class="display text-xl tracking-wide text-[var(--color-text)] sm:text-2xl">
            {{ section.title }}
          </h3>
        </div>
        <component :is="section.component" />
      </section>

      <div class="sticky bottom-3 z-10 flex justify-center pt-2">
        <button type="button" class="math-btn math-btn--primary shadow-lg" @click="enterTrial">
          Enter 10-Card Trial
        </button>
      </div>
    </div>

    <!-- Chakra Mastery Trial -->
    <div v-else class="space-y-4">
      <!-- HUD -->
      <div
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold text-[var(--color-text)]">
            {{ masteredCount }} / 25 Questions Mastered
          </p>
          <p
            v-if="roundActive && currentRoundQuestions.length"
            class="text-sm font-semibold text-[var(--color-muted)]"
          >
            Card {{ Math.min(currentCardIndex + 1, currentRoundQuestions.length) }}
            of {{ currentRoundQuestions.length }}
            <span v-if="roundNumber">(Round {{ roundNumber }})</span>
          </p>
        </div>
        <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-900">
          <div
            class="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
            :style="{ width: `${masteryPercentage}%` }"
          />
        </div>
      </div>

      <!-- Victory -->
      <div v-if="showVictory" class="space-y-4">
        <div
          class="speedlines theme-card border border-[var(--color-primary)] p-4 sm:p-5"
          role="status"
        >
          <p class="display text-2xl tracking-wide text-[var(--color-text)] sm:text-4xl">
            MISSION ACCOMPLISHED
          </p>
          <p class="mt-2 text-sm text-[var(--color-muted)]">
            All 25 Earth Systems questions reached 2-streak chakra mastery. Shinobi victory!
          </p>
        </div>
        <button type="button" class="math-btn math-btn--ghost" @click="onResetMission">
          Reset &amp; Re-challenge Mission
        </button>
      </div>

      <!-- Round summary -->
      <div
        v-else-if="showRoundSummary"
        class="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5"
      >
        <p class="display text-2xl tracking-wide text-[var(--color-text)]">Round Complete</p>
        <p class="text-sm text-[var(--color-muted)]">
          Mastered this round:
          <span class="font-bold text-emerald-300">{{ masteredThisRound }}</span>
        </p>
        <p class="text-sm text-[var(--color-muted)]">
          Still need mastery (&lt; 2 streak):
          <span class="font-bold text-amber-200">{{ remainingUnmastered }}</span>
        </p>
        <button type="button" class="math-btn math-btn--primary" @click="startNextRound">
          Start Next Round ({{ remainingUnmastered }} Cards Remaining)
        </button>
        <button type="button" class="math-btn math-btn--ghost" @click="selectTab('explore')">
          Back to Dojo Sandbox
        </button>
      </div>

      <!-- Active question card -->
      <div
        v-else-if="showActiveCard"
        :key="currentQuestion.id"
        class="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span
            class="inline-flex rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300"
          >
            {{ currentQuestion.topicLabel }}
          </span>
          <div class="flex items-center gap-2" aria-label="Chakra streak">
            <span class="text-xs font-semibold text-[var(--color-muted)]">Streak</span>
            <span
              v-for="n in 2"
              :key="n"
              class="inline-block h-3.5 w-3.5 rounded-full border transition-colors"
              :class="
                currentStreak >= n || isMasteredNow
                  ? 'border-emerald-300 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                  : 'border-slate-600 bg-slate-800'
              "
            />
            <span class="text-xs font-semibold text-[var(--color-muted)]">
              {{ Math.min(currentStreak, 2) }}/2
              <template v-if="isMasteredNow"> Mastered</template>
            </span>
          </div>
        </div>

        <p class="text-base font-semibold text-[var(--color-text)] sm:text-lg">
          {{ currentQuestion.question }}
        </p>

        <div class="grid gap-2">
          <button
            v-for="option in currentQuestion.options"
            :key="option.id"
            type="button"
            class="rounded-[var(--radius-card)] border px-3 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            :class="[
              selectedOptionId === option.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-text)]'
                : 'border-[var(--color-border)] bg-slate-950/40 text-[var(--color-text)] hover:border-[var(--color-primary)]',
              hasSubmitted && option.id === lastFeedback?.correctOptionId
                ? 'border-emerald-500 bg-emerald-950/30'
                : '',
              hasSubmitted &&
              selectedOptionId === option.id &&
              !lastFeedback?.isCorrect
                ? 'border-rose-500 bg-rose-950/30'
                : '',
            ]"
            :disabled="hasSubmitted"
            @click="selectedOptionId = option.id"
          >
            <span class="font-bold uppercase text-[var(--color-muted)]">{{ option.id }}.</span>
            {{ option.label }}
          </button>
        </div>

        <button
          v-if="!hasSubmitted"
          type="button"
          class="math-btn math-btn--primary"
          :disabled="!selectedOptionId"
          @click="submitAnswer"
        >
          Submit Answer
        </button>

        <div v-if="hasSubmitted && lastFeedback" class="space-y-3">
          <p
            class="theme-pill inline-block px-3 py-1.5 text-sm font-bold"
            :class="lastFeedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'"
          >
            {{ lastFeedback.isCorrect ? 'Correct' : 'Incorrect' }}
          </p>
          <div
            class="rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-3 text-sm text-amber-100/90"
          >
            <p class="font-semibold text-amber-200">Hint</p>
            <p class="mt-1">{{ currentQuestion.hint }}</p>
          </div>
          <div
            class="rounded-[var(--radius-card)] border border-emerald-500/30 bg-emerald-950/15 p-3 text-sm text-emerald-100/90"
          >
            <p class="font-semibold text-emerald-200">Explanation</p>
            <p class="mt-1">{{ currentQuestion.explanation }}</p>
          </div>
          <button type="button" class="math-btn math-btn--primary" @click="onNextCard">
            Next Card
          </button>
        </div>
      </div>

      <!-- Idle trial (rare) -->
      <div
        v-else-if="!showVictory"
        class="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4"
      >
        <p class="text-[var(--color-muted)]">Ready for the next chakra trial.</p>
        <button type="button" class="math-btn math-btn--primary mt-3" @click="enterTrial">
          Start 10-Card Trial
        </button>
      </div>
    </div>
  </div>
</template>
