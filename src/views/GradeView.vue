<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade } from '../data/mockData'
import {
  getRankForLevel,
  spellingActivityKeysForExercises,
  useShinobiProgress,
} from '../composables/useShinobiProgress'
import {
  MATH_EXAM_SUBJECT_ID,
  useMathExamProgress,
} from '../composables/useMathExamProgress'
import { meterFromXp, readLastSeen, writeLastSeen } from '../composables/useShinobiLastSeen'
import ShinobiLevelUpModal from '../components/common/ShinobiLevelUpModal.vue'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const isShinobi = computed(() => grade.value?.theme === 'theme-grade-5')

const { getScrollProgress, overallXP, currentRank, nextRankMeter } = useShinobiProgress()
const { getScrollProgress: getMathExamProgress } = useMathExamProgress()

const pendingLastSeen = (() => {
  if (!isShinobi.value) return null
  const seen = readLastSeen()
  if (!seen) return null
  // After XP rebalance (e.g. spelling 50→25 per practice), clamp stale last_seen.
  if (seen.xp > overallXP.value || seen.level > currentRank.value.level) {
    writeLastSeen({ xp: overallXP.value, level: currentRank.value.level })
    return null
  }
  if (overallXP.value > seen.xp || currentRank.value.level > seen.level) return seen
  return null
})()

const displayXp = ref(pendingLastSeen ? pendingLastSeen.xp : overallXP.value)
const displayMeter = ref(
  pendingLastSeen
    ? meterFromXp(pendingLastSeen.xp, pendingLastSeen.level)
    : nextRankMeter.value,
)
const displayRankTitle = ref(
  pendingLastSeen ? getRankForLevel(pendingLastSeen.level).title : currentRank.value.title,
)
const displayRankLevel = ref(pendingLastSeen ? pendingLastSeen.level : currentRank.value.level)
const meterTransition = ref(false)
const showLevelUpModal = ref(false)
const levelUpFromLevel = ref(null)
const levelUpXpDelta = ref(100)

const timers = []
let xpRaf = null

function scrollKeys(subject) {
  const spellingKeys = spellingActivityKeysForExercises(subject.exercises)
  return spellingKeys.length ? spellingKeys : ['complete']
}

function scrollProgress(subject) {
  if (subject.id === MATH_EXAM_SUBJECT_ID) return getMathExamProgress()
  return getScrollProgress(subject.id, scrollKeys(subject))
}

function scrollStatusLabel(subject) {
  const progress = scrollProgress(subject)
  if (progress.percentage >= 100) return 'MASTERED SCROLL ⭐'
  if (progress.percentage === 0) return 'NOT STARTED'
  if (progress.completedCount === progress.totalCount - 1) {
    return `${progress.percentage}% CHAKRA • 1 TRIAL REMAINING`
  }
  return `${progress.percentage}% CHAKRA`
}

function scrollStatusClass(subject) {
  const progress = scrollProgress(subject)
  if (progress.percentage >= 100) return 'text-[#ffaa00]'
  if (progress.percentage === 0) return 'text-[var(--color-muted)]'
  return 'text-[#00e5ff]'
}

function syncDisplayToLive() {
  displayXp.value = overallXP.value
  displayMeter.value = nextRankMeter.value
  displayRankTitle.value = currentRank.value.title
  displayRankLevel.value = currentRank.value.level
}

function persistCurrentSeen() {
  writeLastSeen({ xp: overallXP.value, level: currentRank.value.level })
}

function tweenXp(from, to, durationMs, onDone) {
  const start = performance.now()
  const delta = to - from

  function frame(now) {
    const t = Math.min(1, (now - start) / durationMs)
    const eased = 1 - (1 - t) ** 3
    displayXp.value = Math.round(from + delta * eased)
    if (t < 1) {
      xpRaf = requestAnimationFrame(frame)
    } else {
      displayXp.value = to
      xpRaf = null
      onDone?.()
    }
  }

  if (xpRaf) cancelAnimationFrame(xpRaf)
  xpRaf = requestAnimationFrame(frame)
}

function playLevelUpSound() {
  try {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/level-up.mp3`)
    audio.preload = 'auto'
    audio.volume = 0.9
    const playPromise = audio.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay blocked or missing asset — celebration still runs.
      })
    }
  } catch {
    // Audio unavailable.
  }
}

function startXpGainSequence(lastSeen) {
  const targetXp = overallXP.value
  const targetLevel = currentRank.value.level
  const didLevelUp = targetLevel > lastSeen.level
  const fillDuration = 1000

  timers.push(
    setTimeout(() => {
      meterTransition.value = true

      if (didLevelUp) {
        displayMeter.value = 100
        tweenXp(lastSeen.xp, targetXp, fillDuration)

        timers.push(
          setTimeout(() => {
            playLevelUpSound()
            levelUpFromLevel.value = lastSeen.level
            levelUpXpDelta.value = Math.max(0, targetXp - lastSeen.xp) || 100
            showLevelUpModal.value = true
          }, fillDuration + 400),
        )
      } else {
        displayMeter.value = nextRankMeter.value
        tweenXp(lastSeen.xp, targetXp, fillDuration, () => {
          persistCurrentSeen()
          syncDisplayToLive()
        })
      }
    }, 300),
  )
}

function onClaimRank() {
  showLevelUpModal.value = false
  meterTransition.value = false
  persistCurrentSeen()
  syncDisplayToLive()
  // Re-enable transitions after settle so future visits still animate smoothly.
  requestAnimationFrame(() => {
    meterTransition.value = true
  })
}

onMounted(() => {
  if (!isShinobi.value) return

  if (pendingLastSeen) {
    startXpGainSequence(pendingLastSeen)
    return
  }

  const lastSeen = readLastSeen()
  if (!lastSeen) {
    persistCurrentSeen()
  }
  syncDisplayToLive()
})

onUnmounted(() => {
  timers.forEach((id) => clearTimeout(id))
  timers.length = 0
  if (xpRaf) cancelAnimationFrame(xpRaf)
})
</script>

<template>
  <section v-if="grade" class="space-y-6">
    <div
      v-if="isShinobi"
      class="theme-card space-y-3 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6"
    >
      <p class="display text-2xl tracking-wide text-[var(--color-primary)]">
        {{ displayRankTitle || currentRank.title }} (LEVEL
        {{ displayRankLevel || currentRank.level }} • {{ displayXp }} XP)
      </p>
      <div
        class="h-3 overflow-hidden rounded-full bg-[var(--color-border)] shadow-[0_0_12px_rgba(0,229,255,0.25)]"
        role="meter"
        :aria-valuenow="displayMeter"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-label="`Progress toward next rank, ${displayMeter} percent`"
      >
        <div
          class="chakra-meter h-full ease-out"
          :class="meterTransition ? 'transition-[width] duration-1000' : ''"
          :style="{ width: `${displayMeter}%` }"
        />
      </div>
    </div>

    <div>
      <h1 class="display text-4xl font-bold">{{ grade.cardTitle ?? grade.name }}</h1>
      <p class="mt-2 text-[var(--color-muted)]">{{ grade.blurb }}</p>
    </div>

    <div :class="['grid gap-4', grade.subjects.length > 1 ? 'sm:grid-cols-2' : 'max-w-xl']">
      <RouterLink
        v-for="subject in grade.subjects"
        :key="subject.id"
        :to="{
          name: 'subject',
          params: { gradeId: grade.id, subjectId: subject.id },
        }"
        class="theme-card block border bg-[var(--color-panel)] p-4 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
        :class="isShinobi ? 'border-[var(--color-border)]' : 'border-black/5'"
      >
        <div v-if="subject.difficulty || subject.status || isShinobi" class="mb-3 flex flex-wrap gap-2">
          <span
            v-if="subject.difficulty"
            class="ninja-tag display bg-[var(--color-primary)] px-3 py-1 text-sm tracking-wide text-white"
          >
            {{ subject.difficulty }}
          </span>
          <span
            v-if="isShinobi"
            class="theme-pill border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            :class="scrollStatusClass(subject)"
          >
            {{ scrollStatusLabel(subject) }}
          </span>
          <span
            v-else-if="subject.status"
            class="theme-pill border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]"
          >
            {{ subject.status }}
          </span>
        </div>
        <h2 class="display text-2xl font-bold text-[var(--color-primary)]">
          {{ subject.missionTitle ?? subject.name }}
        </h2>
        <p class="mt-2 text-sm text-[var(--color-muted)]">{{ subject.description }}</p>
        <div
          v-if="isShinobi"
          class="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-border)]"
          role="meter"
          :aria-valuenow="scrollProgress(subject).percentage"
          :aria-valuemin="0"
          :aria-valuemax="100"
          :aria-label="`${subject.missionTitle ?? subject.name} chakra`"
        >
          <div
            class="chakra-meter h-full"
            :style="{ width: `${scrollProgress(subject).percentage}%` }"
          />
        </div>
        <p class="mt-4 text-sm font-semibold text-[var(--color-primary)]">
          {{ subject.exercises.length }} exercises →
        </p>
      </RouterLink>
    </div>

    <ShinobiLevelUpModal
      v-if="showLevelUpModal"
      :rank-title="currentRank.title"
      :level="currentRank.level"
      :xp-delta="levelUpXpDelta"
      :from-level="levelUpFromLevel"
      @claim="onClaimRank"
    />
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Grade not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
