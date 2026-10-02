<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getExercise, getGrade, getSubject } from '../data/mockData'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const subject = computed(() => getSubject(route.params.gradeId, route.params.subjectId))
const exercise = computed(() =>
  getExercise(route.params.gradeId, route.params.subjectId, route.params.exerciseId)
)
</script>

<template>
  <section v-if="grade && subject && exercise" class="space-y-6">
    <div>
      <h1 class="display text-4xl font-bold">{{ exercise.title }}</h1>
      <p class="mt-2 text-sm uppercase tracking-wide text-[var(--color-muted)]">
        {{ exercise.exerciseType }} · {{ grade.name }}
      </p>
    </div>

    <article class="theme-card border border-black/5 bg-[var(--color-panel)] p-6 shadow-sm">
      <p class="leading-relaxed text-[var(--color-text)]">{{ exercise.content }}</p>
    </article>
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Exercise not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
