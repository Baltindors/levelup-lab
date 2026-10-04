<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade } from '../data/mockData'
import { SPELLING_ACTIVITY_KEYS, useShinobiProgress } from '../composables/useShinobiProgress'
import {
  MATH_EXAM_SUBJECT_ID,
  useMathExamProgress,
} from '../composables/useMathExamProgress'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const isShinobi = computed(() => grade.value?.theme === 'theme-grade-5')

const { getScrollProgress, overallXP, currentRank, nextRankMeter } = useShinobiProgress()
const { getScrollProgress: getMathExamProgress } = useMathExamProgress()

function scrollKeys(subject) {
  const spelling = subject.exercises?.some((exercise) => exercise.exerciseType === 'spelling-jutsu')
  return spelling ? SPELLING_ACTIVITY_KEYS : ['complete']
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
</script>

<template>
  <section v-if="grade" class="space-y-6">
    <div
      v-if="isShinobi"
      class="theme-card space-y-3 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6"
    >
      <p class="display text-2xl tracking-wide text-[var(--color-primary)]">
        {{ currentRank.title }} (LEVEL {{ currentRank.level }} • {{ overallXP }} XP)
      </p>
      <div
        class="h-3 overflow-hidden rounded-full bg-[var(--color-border)]"
        role="meter"
        :aria-valuenow="nextRankMeter"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-label="`Progress toward next rank, ${nextRankMeter} percent`"
      >
        <div class="chakra-meter h-full" :style="{ width: `${nextRankMeter}%` }" />
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
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Grade not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
