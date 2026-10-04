<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useShinobiProgress } from '../../composables/useShinobiProgress'
import {
  clearPracticeMastery,
  getPracticeMasteredIds,
  setPracticeMasteredIds,
  useTwoPassRound,
} from '../../composables/useTwoPassRound'

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
  masteryScope: {
    type: String,
    default: '',
  },
  awardScrollXp: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['answered'])

const route = useRoute()
const subjectId = computed(() => String(route.params.subjectId ?? ''))
const progressKey = computed(() => props.masteryScope || subjectId.value)
const words = props.exercise.words ?? []
const { scrolls, recordSubActivityComplete } = useShinobiProgress()

const phase = ref('STUDY')
const practiceKey = ref(null)
const isFreeDrill = ref(false)
const debrief = ref(null)
const transitionTimer = ref(null)
const masteryVersion = ref(0)

const sealChoices = ref([])
const sealSelectedId = ref(null)
const sealFeedback = ref(null)
const blindInput = ref('')
const blindFeedback = ref(null)
const blindInputEl = ref(null)

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

const {
  currentCard,
  headerLabel,
  answeredCurrent,
  startRound,
  beginPass2,
  submitAnswer,
  advanceCard,
  resetEngine,
  shuffle,
} = useTwoPassRound(words)

const tabs = [
  { id: 'study', label: 'Study Scrolls', practice: null },
  { id: 'seal', label: 'Seal Matching', practice: 'seal-matching' },
  { id: 'blind', label: 'Blindfold Training', practice: 'blindfold-training' },
]

const activeTab = computed(() => {
  if (phase.value === 'STUDY' || !practiceKey.value) return 'study'
  return practiceKey.value === 'seal-matching' ? 'seal' : 'blind'
})

const meterPracticeKey = computed(() => practiceKey.value || 'seal-matching')

function allWordsMastered(practice) {
  if (!progressKey.value || !words.length) return false
  const ids = new Set(getPracticeMasteredIds(progressKey.value, practice))
  return words.every((item) => ids.has(item.id))
}

const masteredIds = computed(() => {
  masteryVersion.value
  return getPracticeMasteredIds(progressKey.value, meterPracticeKey.value)
})

const progressStats = computed(() => {
  const mastered = masteredIds.value.length
  return { mastered, total: words.length }
})

const progressPct = computed(() => {
  if (!progressStats.value.total) return 0
  return Math.round((progressStats.value.mastered / progressStats.value.total) * 100)
})

const sealConquered = computed(() => {
  masteryVersion.value
  if (props.awardScrollXp) {
    return Boolean(subjectId.value && scrolls.value[subjectId.value]?.['seal-matching'])
  }
  return allWordsMastered('seal-matching')
})
const blindConquered = computed(() => {
  masteryVersion.value
  if (props.awardScrollXp) {
    return Boolean(subjectId.value && scrolls.value[subjectId.value]?.['blindfold-training'])
  }
  return allWordsMastered('blindfold-training')
})
const scrollMastered = computed(() => sealConquered.value && blindConquered.value)

function readMastered() {
  return getPracticeMasteredIds(progressKey.value, practiceKey.value)
}

function writeMastered(ids) {
  setPracticeMasteredIds(progressKey.value, practiceKey.value, ids)
  masteryVersion.value += 1
}

function isWordMasteredAnywhere(itemId) {
  masteryVersion.value
  const seal = new Set(getPracticeMasteredIds(progressKey.value, 'seal-matching'))
  const blind = new Set(getPracticeMasteredIds(progressKey.value, 'blindfold-training'))
  return seal.has(itemId) || blind.has(itemId)
}

function speak(text) {
  if (!canSpeak || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

function clearTransitionTimer() {
  if (transitionTimer.value) {
    clearTimeout(transitionTimer.value)
    transitionTimer.value = null
  }
}

function clearCardUi() {
  sealChoices.value = []
  sealSelectedId.value = null
  sealFeedback.value = null
  blindInput.value = ''
  blindFeedback.value = null
}

function prepareCurrentCard() {
  clearCardUi()
  const card = currentCard.value
  if (!card) return
  if (practiceKey.value === 'seal-matching') {
    const decoys = shuffle(words.filter((item) => item.id !== card.id)).slice(0, 3)
    sealChoices.value = shuffle([card, ...decoys])
  }
  if (practiceKey.value === 'blindfold-training') {
    nextTick(() => {
      blindInputEl.value?.focus()
      speak(card.word)
    })
  }
}

function beginPractice(key, { freeDrill = false } = {}) {
  clearTransitionTimer()
  practiceKey.value = key
  isFreeDrill.value = freeDrill
  debrief.value = null
  resetEngine()

  if (!freeDrill) {
    const ids = new Set(getPracticeMasteredIds(progressKey.value, key))
    if (words.length && words.every((item) => ids.has(item.id))) {
      phase.value = 'PRACTICE_CONQUERED'
      return
    }
  }

  const result = startRound({
    masteredIds: getPracticeMasteredIds(progressKey.value, key),
    freeDrill,
  })
  if (!result.started || result.complete) {
    phase.value = 'PRACTICE_CONQUERED'
    return
  }
  phase.value = 'PLAYING'
  prepareCurrentCard()
}

function selectTab(tabId) {
  if (tabId === 'study') {
    clearTransitionTimer()
    practiceKey.value = null
    isFreeDrill.value = false
    debrief.value = null
    resetEngine()
    clearCardUi()
    phase.value = 'STUDY'
    return
  }
  beginPractice(tabId === 'seal' ? 'seal-matching' : 'blindfold-training')
}

function enterBlindfold() {
  beginPractice('blindfold-training')
}

function practiceAgain() {
  if (!practiceKey.value) return
  beginPractice(practiceKey.value, { freeDrill: true })
}

function drillRemaining() {
  beginPractice(practiceKey.value, { freeDrill: false })
}

function sealChoiceClass(choice) {
  const base =
    'min-h-11 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-4 py-3 text-left font-semibold'
  if (!sealFeedback.value || !currentCard.value) {
    return `${base} bg-[var(--color-panel)] text-[var(--color-text)]`
  }
  if (choice.id === currentCard.value.id) return `${base} feedback-correct`
  if (choice.id === sealSelectedId.value) return `${base} feedback-incorrect`
  return `${base} bg-[var(--color-panel)] text-[var(--color-text)] opacity-60`
}

function chooseSeal(choice) {
  if (phase.value !== 'PLAYING' || !currentCard.value || answeredCurrent.value) return
  const isCorrect = choice.id === currentCard.value.id
  submitAnswer(isCorrect)
  sealSelectedId.value = choice.id
  sealFeedback.value = {
    correct: isCorrect,
    text: isCorrect ? 'Correct' : 'Not quite',
  }
}

function handleAdvance() {
  if (phase.value !== 'PLAYING' || !answeredCurrent.value) return
  const result = advanceCard(readMastered, writeMastered)
  if (result.kind === 'nextCard') {
    prepareCurrentCard()
    return
  }
  if (result.kind === 'pass1Complete') {
    clearCardUi()
    phase.value = 'PASS_TRANSITION'
    clearTransitionTimer()
    transitionTimer.value = setTimeout(() => {
      beginPass2()
      phase.value = 'PLAYING'
      prepareCurrentCard()
      transitionTimer.value = null
    }, 1000)
    return
  }
  if (result.kind === 'roundComplete') {
    clearCardUi()
    debrief.value = result.debrief
    if (result.debrief.freeDrill) {
      phase.value = 'ROUND_SUMMARY'
      return
    }
    if (result.debrief.allMastered) {
      if (props.awardScrollXp && practiceKey.value && subjectId.value) {
        recordSubActivityComplete(subjectId.value, practiceKey.value)
      }
      phase.value = 'PRACTICE_CONQUERED'
      return
    }
    phase.value = 'ROUND_SUMMARY'
  }
}

function onSealNext() {
  handleAdvance()
}

function submitBlind() {
  if (phase.value !== 'PLAYING' || !currentCard.value || answeredCurrent.value) return
  const typed = blindInput.value.trim().toLowerCase()
  if (!typed) return
  const isCorrect = typed === currentCard.value.word.toLowerCase()
  submitAnswer(isCorrect)
  blindFeedback.value = {
    correct: isCorrect,
    text: isCorrect ? 'Correct' : 'Not quite',
    reveal: currentCard.value.word,
  }
}

function onBlindAction() {
  if (answeredCurrent.value) {
    handleAdvance()
    return
  }
  submitBlind()
}

function onFreeDrillDone() {
  phase.value = 'PRACTICE_CONQUERED'
  debrief.value = null
  isFreeDrill.value = false
}

function completeMission() {
  if (!words.length || !progressKey.value) return
  if (props.awardScrollXp) {
    const flags = scrolls.value[subjectId.value]
    if (!flags?.['seal-matching'] || !flags?.['blindfold-training']) return
  } else if (!scrollMastered.value) {
    return
  }
  emit('answered', { correct: true })
}

function onReset() {
  clearTransitionTimer()
  if (practiceKey.value) {
    clearPracticeMastery(progressKey.value, practiceKey.value)
    masteryVersion.value += 1
    beginPractice(practiceKey.value)
    return
  }
  clearPracticeMastery(progressKey.value)
  masteryVersion.value += 1
  debrief.value = null
  isFreeDrill.value = false
  resetEngine()
  clearCardUi()
  phase.value = 'STUDY'
}

function onGlobalKeydown(event) {
  if (event.key !== 'Enter') return
  if (phase.value !== 'PLAYING' || practiceKey.value !== 'seal-matching') return
  if (!answeredCurrent.value) return
  event.preventDefault()
  onSealNext()
}

watch(subjectId, () => {
  selectTab('study')
})

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onGlobalKeydown)
}

onUnmounted(() => {
  clearTransitionTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onGlobalKeydown)
  }
  if (canSpeak) window.speechSynthesis.cancel()
})
</script>

<template>
  <div class="space-y-5">
    <div class="theme-card space-y-3 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm font-semibold text-[var(--color-text)]">
          {{ progressStats.mastered }} / {{ progressStats.total }} seals mastered
        </p>
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-muted)]"
          @click="onReset"
        >
          Reset seals
        </button>
      </div>
      <div
        class="h-3 overflow-hidden rounded-full bg-[var(--color-border)]"
        role="meter"
        :aria-valuenow="progressStats.mastered"
        :aria-valuemin="0"
        :aria-valuemax="progressStats.total"
        aria-label="Seals mastered"
      >
        <div class="chakra-meter h-full" :style="{ width: `${progressPct}%` }" />
      </div>
    </div>

    <div
      class="math-phase-tabs"
      style="--math-phase-cols: 3"
      role="tablist"
      aria-label="Spelling jutsu mode"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="math-phase-tabs__btn"
        :class="{ 'math-phase-tabs__btn--active': activeTab === tab.id }"
        :aria-selected="activeTab === tab.id"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <p v-if="!canSpeak" class="text-sm text-[var(--color-muted)]">
      Audio is unavailable in this browser.
    </p>

    <div v-if="phase === 'STUDY'" class="space-y-3">
      <ul class="space-y-3">
        <li
          v-for="item in words"
          :key="item.id"
          class="theme-card border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-lg font-semibold text-[var(--color-text)]">
                {{ item.word }}
                <span v-if="isWordMasteredAnywhere(item.id)" class="ml-2 text-[#ffaa00]">⭐ Mastered</span>
              </p>
              <p class="mt-1 text-sm text-[var(--color-muted)]">{{ item.definition }}</p>
            </div>
            <button
              type="button"
              class="theme-pill inline-flex min-h-11 items-center justify-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              @click="speak(item.word)"
            >
              Listen
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-else-if="phase === 'PASS_TRANSITION'"
      class="theme-card border border-[var(--color-primary)] bg-[var(--color-panel)] p-6 text-center sm:p-8"
      role="status"
    >
      <p class="display text-2xl tracking-wide text-[#00e5ff] sm:text-3xl">
        PASS 1 COMPLETE! SHINOBI SPEED RESHUFFLE: PASS 2 BEGINS! ⚡
      </p>
    </div>

    <div
      v-else-if="phase === 'PLAYING'"
      class="theme-card space-y-4 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-[#00e5ff]">
        {{ headerLabel }}
      </p>

      <template v-if="practiceKey === 'seal-matching' && currentCard">
        <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Definition</p>
        <p class="text-lg leading-relaxed text-[var(--color-text)]">{{ currentCard.definition }}</p>
        <div class="grid gap-3" role="listbox" aria-label="Word seals">
          <button
            v-for="choice in sealChoices"
            :key="choice.id"
            type="button"
            role="option"
            :aria-selected="sealSelectedId === choice.id"
            :disabled="answeredCurrent"
            :class="sealChoiceClass(choice)"
            @click="chooseSeal(choice)"
          >
            {{ choice.word }}
          </button>
        </div>
        <div v-if="sealFeedback" class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p
            class="theme-pill px-3 py-1.5 text-sm font-bold"
            :class="sealFeedback.correct ? 'feedback-correct' : 'feedback-incorrect'"
            role="status"
          >
            {{ sealFeedback.text }}
          </p>
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            @click="onSealNext"
          >
            Next seal
          </button>
        </div>
      </template>

      <form
        v-else-if="practiceKey === 'blindfold-training' && currentCard"
        class="space-y-4"
        @submit.prevent="onBlindAction"
      >
        <p class="text-sm text-[var(--color-muted)]">
          Listen, then spell the word. The letters stay hidden until you submit.
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            @click="speak(currentCard.word)"
          >
            Listen
          </button>
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]"
            @click="speak(currentCard.word)"
          >
            Replay audio
          </button>
        </div>
        <label class="block text-sm font-semibold text-[var(--color-text)]" for="blindfold-spelling">
          Spelling
        </label>
        <input
          id="blindfold-spelling"
          ref="blindInputEl"
          v-model="blindInput"
          type="text"
          inputmode="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="none"
          spellcheck="false"
          :readonly="answeredCurrent"
          class="min-h-11 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[var(--color-text)]"
          @keydown.enter.prevent="onBlindAction"
        />
        <div v-if="blindFeedback" class="space-y-3" role="status">
          <p
            class="theme-pill inline-block px-3 py-1.5 text-sm font-bold"
            :class="blindFeedback.correct ? 'feedback-correct' : 'feedback-incorrect'"
          >
            {{ blindFeedback.text }}
          </p>
          <p class="text-sm text-[var(--color-text)]">
            The spelling is <span class="font-semibold">{{ blindFeedback.reveal }}</span>.
          </p>
        </div>
        <button
          type="submit"
          class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          {{ answeredCurrent ? 'Next word' : 'Check seal' }}
        </button>
      </form>
    </div>

    <div
      v-else-if="phase === 'ROUND_SUMMARY' && debrief"
      class="theme-card space-y-4 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6"
      role="status"
    >
      <p class="display text-2xl tracking-wide text-[var(--color-primary)]">
        {{ debrief.masteredCount }} of {{ debrief.totalCount }} Words Mastered!
      </p>

      <div v-if="debrief.newlyMastered.length" class="space-y-2">
        <p class="text-sm font-semibold text-[#ffaa00]">Newly Mastered</p>
        <ul class="space-y-1 text-sm text-[var(--color-text)]">
          <li v-for="item in debrief.newlyMastered" :key="`new-${item.id}`">⭐ {{ item.word }}</li>
        </ul>
      </div>

      <div v-if="debrief.retainedMastery.length" class="space-y-2">
        <p class="text-sm font-semibold text-[#00e5ff]">Retained Mastery</p>
        <ul class="space-y-1 text-sm text-[var(--color-text)]">
          <li v-for="item in debrief.retainedMastery" :key="`keep-${item.id}`">{{ item.word }}</li>
        </ul>
      </div>

      <div v-if="debrief.needsPractice.length" class="space-y-2">
        <p class="text-sm font-semibold text-[var(--color-muted)]">Needs Practice</p>
        <ul class="space-y-1 text-sm text-[var(--color-text)]">
          <li v-for="item in debrief.needsPractice" :key="`need-${item.id}`">{{ item.word }}</li>
        </ul>
      </div>

      <button
        v-if="debrief.freeDrill"
        type="button"
        class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        @click="onFreeDrillDone"
      >
        Back to Trial Complete
      </button>
      <button
        v-else-if="debrief.needsPractice.length"
        type="button"
        class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        @click="drillRemaining"
      >
        Drill Remaining Words ➔
      </button>
    </div>

    <div
      v-else-if="phase === 'PRACTICE_CONQUERED'"
      class="space-y-4"
    >
      <div
        class="theme-card space-y-3 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5"
        role="status"
      >
        <p
          v-if="practiceKey === 'seal-matching'"
          class="text-sm font-bold tracking-wide text-[#00e5ff]"
        >
          SEAL MATCHING TRIAL CONQUERED! (+50% Scroll Chakra)
        </p>
        <p
          v-else-if="practiceKey === 'blindfold-training'"
          class="text-sm font-bold tracking-wide text-[#00e5ff]"
        >
          BLINDFOLD SPELLING TRIAL CONQUERED! (+50% Scroll Chakra)
        </p>

        <div class="flex flex-wrap gap-3">
          <button
            v-if="practiceKey === 'seal-matching' && !blindConquered"
            type="button"
            class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            @click="enterBlindfold"
          >
            Enter Blindfold Training ➔
          </button>
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
            @click="practiceAgain"
          >
            Practice Again (Free Drill) 🔄
          </button>
        </div>
      </div>

      <div
        v-if="scrollMastered"
        class="theme-card space-y-3 border border-[var(--color-primary)] bg-[var(--color-panel)] p-4 sm:p-5"
        role="status"
      >
        <p class="display text-xl tracking-wide text-[#ffaa00] sm:text-2xl">
          SCROLL I FULLY MASTERED • RANK LEVEL UP UNLOCKED!
        </p>
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          @click="completeMission"
        >
          Complete Mission
        </button>
      </div>
    </div>
  </div>
</template>
