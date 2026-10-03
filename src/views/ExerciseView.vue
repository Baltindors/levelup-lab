<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getExercise, getGrade, getNextExercise, getSubject } from '../data/mockData'
import { resolveExerciseComponent } from '../components/exercises'
import ShinobiVersusIntro from '../components/common/ShinobiVersusIntro.vue'

const route = useRoute()

const grade = computed(() => getGrade(route.params.gradeId))
const subject = computed(() => getSubject(route.params.gradeId, route.params.subjectId))
const exercise = computed(() =>
  getExercise(route.params.gradeId, route.params.subjectId, route.params.exerciseId)
)
const nextExercise = computed(() =>
  getNextExercise(route.params.gradeId, route.params.subjectId, route.params.exerciseId)
)

const exerciseComponent = computed(() =>
  resolveExerciseComponent(exercise.value?.exerciseType)
)

const isShinobi = computed(() => grade.value?.theme === 'theme-grade-5')

const completion = ref(null)
const attemptKey = ref(0)
const showIntro = ref(true)
const showVictory = computed(
  () => isShinobi.value && completion.value?.correct && grade.value?.victoryTitle
)

watch(
  () => route.params.exerciseId,
  () => {
    completion.value = null
    attemptKey.value = 0
    showIntro.value = isShinobi.value
  }
)

function onAnswered(result) {
  completion.value = result
}

function tryAgain() {
  completion.value = null
  attemptKey.value += 1
}
</script>

<template>
  <section v-if="grade && subject && exercise" class="space-y-6">
    <ShinobiVersusIntro
      v-if="showIntro && isShinobi"
      :mission-title="subject.missionTitle || exercise.title"
      :sub-title="grade.rankBadge || 'SHINOBI TRAINING'"
      @complete="showIntro = false"
    />

    <div>
      <h1 class="display text-4xl font-bold">{{ exercise.title }}</h1>
      <p class="mt-2 text-sm uppercase tracking-wide text-[var(--color-muted)]">
        {{ exercise.exerciseType }} · {{ grade.name }}
      </p>
    </div>

    <component
      :is="exerciseComponent"
      :key="`${exercise.id}-${attemptKey}`"
      :exercise="exercise"
      @answered="onAnswered"
    />

    <div
      v-if="completion"
      class="theme-card border p-4 shadow-sm sm:p-5"
      :class="
        showVictory
          ? 'speedlines border-[var(--color-primary)]'
          : 'border-black/5 bg-[var(--color-primary-soft)]'
      "
      role="status"
    >
      <p
        class="font-bold text-[var(--color-text)]"
        :class="showVictory ? 'display text-2xl tracking-wide sm:text-4xl' : 'display text-xl'"
      >
        {{
          showVictory
            ? grade.victoryTitle
            : completion.correct
              ? 'Nice work!'
              : 'Not quite — review and try again.'
        }}
      </p>
      <p class="mt-1 text-sm text-[var(--color-muted)]">
        {{
          completion.correct
            ? 'You completed this exercise. Keep going when you are ready.'
            : 'Look back at your answer above, then retry or return to the subject.'
        }}
      </p>

      <div class="mt-4 flex flex-wrap gap-3">
        <button
          v-if="!completion.correct"
          type="button"
          class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          @click="tryAgain"
        >
          Try Again
        </button>

        <RouterLink
          v-if="nextExercise"
          :to="{
            name: 'exercise',
            params: {
              gradeId: grade.id,
              subjectId: subject.id,
              exerciseId: nextExercise.id,
            },
          }"
          class="theme-pill inline-flex min-h-11 items-center bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white no-underline"
        >
          Next Exercise
        </RouterLink>

        <RouterLink
          :to="{
            name: 'subject',
            params: { gradeId: grade.id, subjectId: subject.id },
          }"
          class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] no-underline"
        >
          Back to Subject
        </RouterLink>
      </div>
    </div>
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Exercise not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
