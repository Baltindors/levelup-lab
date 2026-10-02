<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade } from '../data/mockData'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
</script>

<template>
  <section v-if="grade" class="space-y-6">
    <div>
      <h1 class="display text-4xl font-bold">{{ grade.name }}</h1>
      <p class="mt-2 text-[var(--color-muted)]">{{ grade.blurb }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <RouterLink
        v-for="subject in grade.subjects"
        :key="subject.id"
        :to="{
          name: 'subject',
          params: { gradeId: grade.id, subjectId: subject.id },
        }"
        class="theme-card block border border-black/5 bg-[var(--color-panel)] p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <h2 class="display text-2xl font-bold text-[var(--color-primary)]">{{ subject.name }}</h2>
        <p class="mt-2 text-sm text-[var(--color-muted)]">{{ subject.description }}</p>
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
