<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade, getSubject } from '../data/mockData'
import {
  MATH_EXAM_SUBJECT_ID,
  useMathExamProgress,
} from '../composables/useMathExamProgress'
import AnimeRankSeal from '../components/common/AnimeRankSeal.vue'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const subject = computed(() => getSubject(route.params.gradeId, route.params.subjectId))
const isShinobi = computed(() => grade.value?.theme === 'theme-grade-5')
const isMathExamScroll = computed(() => subject.value?.id === MATH_EXAM_SUBJECT_ID)

const { getExerciseProgress, subjectStats } = useMathExamProgress()

const stats = computed(() => subjectStats.value)

function cardState(exerciseId) {
  const progress = getExerciseProgress(exerciseId)
  if (!progress.gradeRank && !progress.bestScore && !progress.completed) {
    return 'untested'
  }
  if (progress.completed) return 'passed'
  return 'failed'
}

function cardBorderClass(exerciseId) {
  const state = cardState(exerciseId)
  if (state === 'passed') {
    return 'border-emerald-500/50 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
  }
  if (state === 'failed') {
    return 'border-rose-900/60 bg-rose-950/10'
  }
  return 'border-slate-800'
}

function scorePill(exerciseId) {
  const progress = getExerciseProgress(exerciseId)
  const state = cardState(exerciseId)
  if (state === 'untested') return 'Not Attempted'
  const base = `Best Trial: ${progress.bestScore}/${progress.total} (${progress.percentage}%)`
  if (state === 'failed') return `${base} • Needs 70% to pass`
  return base
}

function ctaLabel(exerciseId) {
  const state = cardState(exerciseId)
  if (state === 'passed') return 'Re-challenge Kata →'
  if (state === 'failed') return 'Retake Trial →'
  return 'Begin Trial →'
}

function sealRank(exerciseId) {
  return getExerciseProgress(exerciseId).gradeRank || 'F'
}
</script>

<template>
  <section v-if="grade && subject" class="space-y-6">
    <div>
      <div v-if="subject.difficulty || subject.status" class="mb-3 flex flex-wrap gap-2">
        <span
          v-if="subject.difficulty"
          class="ninja-tag display bg-[var(--color-primary)] px-3 py-1 text-sm tracking-wide text-white"
        >
          {{ subject.difficulty }}
        </span>
        <span
          v-if="subject.status"
          class="theme-pill border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]"
        >
          {{ subject.status }}
        </span>
      </div>
      <h1 class="display text-4xl font-bold">{{ subject.missionTitle ?? subject.name }}</h1>
      <p class="mt-2 text-[var(--color-muted)]">{{ subject.description }}</p>

      <div v-if="isMathExamScroll" class="mt-5 space-y-3">
        <p
          class="display text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-accent)] sm:text-base"
        >
          {{ stats.chakraPercent }}% CHAKRA • {{ stats.completedCount }}/{{ stats.totalCount }} TRIALS
          SEALED
        </p>

        <div
          v-if="stats.allComplete"
          class="animate-pulse rounded-md border border-amber-400/60 bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-400 px-3 py-2 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.45)]"
        >
          ✦ SCROLL 2 FULLY SEALED • +100 XP LEVEL UP CLAIMED ✦
        </div>

        <div
          class="h-3 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-border)] shadow-[0_0_12px_rgba(0,229,255,0.4)]"
          role="meter"
          :aria-valuenow="stats.chakraPercent"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Scroll 2 chakra progress"
        >
          <div
            class="chakra-meter h-full transition-[width] duration-700 ease-out"
            :style="{ width: `${stats.chakraPercent}%` }"
          />
        </div>
      </div>
    </div>

    <ul class="space-y-3">
      <li v-for="exercise in subject.exercises" :key="exercise.id">
        <RouterLink
          :to="{
            name: 'exercise',
            params: {
              gradeId: grade.id,
              subjectId: subject.id,
              exerciseId: exercise.id,
            },
          }"
          class="theme-card block border bg-[var(--color-panel)] p-4 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          :class="[
            isMathExamScroll
              ? cardBorderClass(exercise.id)
              : isShinobi
                ? 'border-[var(--color-border)]'
                : 'border-black/5',
            isMathExamScroll ? 'relative overflow-hidden' : '',
          ]"
        >
          <!-- Math exam: left content + oversized rank seal -->
          <template v-if="isMathExamScroll">
            <div
              class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
            >
              <div class="min-w-0 flex-1">
                <h2 class="display text-xl font-bold text-[var(--color-primary)]">
                  {{ exercise.title }}
                </h2>
                <p
                  v-if="exercise.description || exercise.content"
                  class="mt-2 text-sm text-[var(--color-muted)]"
                >
                  {{ exercise.description || exercise.content }}
                </p>
                <p
                  class="mt-3 inline-flex rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                  :class="
                    cardState(exercise.id) === 'failed'
                      ? 'border-rose-800/70 text-rose-300'
                      : cardState(exercise.id) === 'passed'
                        ? 'border-emerald-700/60 text-emerald-300'
                        : 'text-[var(--color-muted)]'
                  "
                >
                  {{ scorePill(exercise.id) }}
                </p>
                <div
                  class="mt-3 text-sm font-semibold tracking-wide text-[var(--color-accent)]"
                >
                  {{ ctaLabel(exercise.id) }}
                </div>
              </div>

              <div
                class="flex h-32 w-36 flex-shrink-0 items-center justify-center pt-1 md:h-36 md:w-44"
              >
                <AnimeRankSeal
                  :rank="sealRank(exercise.id)"
                  :topic="exercise.badge ?? exercise.exerciseType"
                  :sealed="cardState(exercise.id) === 'passed'"
                />
              </div>
            </div>
          </template>

          <!-- Non-math subjects: original layout -->
          <template v-else>
            <div class="flex flex-wrap items-start justify-between gap-3">
              <h2 class="display text-xl font-bold text-[var(--color-primary)]">
                {{ exercise.title }}
              </h2>
              <div class="flex flex-wrap items-center gap-2">
                <span
                  :class="
                    isShinobi
                      ? 'ninja-tag display bg-[var(--color-primary)] px-3 py-1 text-sm tracking-wide text-white'
                      : 'theme-pill bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]'
                  "
                >
                  {{ exercise.badge ?? exercise.exerciseType }}
                </span>
              </div>
            </div>
            <p
              v-if="exercise.description || exercise.content"
              class="mt-2 text-sm text-[var(--color-muted)]"
            >
              {{ exercise.description || exercise.content }}
            </p>
          </template>
        </RouterLink>
      </li>
    </ul>
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Subject not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
