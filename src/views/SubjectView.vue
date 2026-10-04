<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade, getSubject } from '../data/mockData'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const subject = computed(() => getSubject(route.params.gradeId, route.params.subjectId))
const isShinobi = computed(() => grade.value?.theme === 'theme-grade-5')
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
          :class="isShinobi ? 'border-[var(--color-border)]' : 'border-black/5'"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="display text-xl font-bold text-[var(--color-primary)]">{{ exercise.title }}</h2>
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
          <p
            v-if="exercise.description || exercise.content"
            class="mt-2 text-sm text-[var(--color-muted)]"
          >
            {{ exercise.description || exercise.content }}
          </p>
        </RouterLink>
      </li>
    </ul>
  </section>

  <section v-else class="space-y-3">
    <h1 class="display text-3xl font-bold">Subject not found</h1>
    <RouterLink to="/" class="text-[var(--color-primary)]">Back home</RouterLink>
  </section>
</template>
