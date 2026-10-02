<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade, getSubject } from '../data/mockData'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const subject = computed(() => getSubject(route.params.gradeId, route.params.subjectId))
</script>

<template>
  <section v-if="grade && subject" class="space-y-6">
    <div>
      <h1 class="display text-4xl font-bold">{{ subject.name }}</h1>
      <p class="mt-2 text-[var(--color-muted)]">{{ subject.description }}</p>
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
          class="theme-card block border border-black/5 bg-[var(--color-panel)] p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="flex items-center justify-between gap-3">
            <h2 class="display text-xl font-bold text-[var(--color-primary)]">{{ exercise.title }}</h2>
            <span
              class="theme-pill bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]"
            >
              {{ exercise.exerciseType }}
            </span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Subject not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
