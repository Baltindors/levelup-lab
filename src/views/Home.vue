<script setup>
import { RouterLink } from 'vue-router'
import { mockData } from '../data/mockData'
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="display text-4xl font-bold tracking-tight">Pick a level</h1>
      <p class="mt-2 max-w-2xl text-[var(--color-muted)]">
        Choose a level to open its subjects and practice exercises.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <RouterLink
        v-for="grade in mockData.grades"
        :key="grade.id"
        :to="{ name: 'grade', params: { gradeId: grade.id } }"
        class="theme-card block border border-black/5 bg-[var(--color-panel)] p-6 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        :class="grade.theme"
      >
        <h2 class="display text-2xl font-bold text-[var(--color-primary)]">{{ grade.name }}</h2>
        <p class="mt-2 text-sm text-[var(--color-muted)]">{{ grade.blurb }}</p>
        <p class="mt-4 text-sm font-semibold text-[var(--color-primary)]">
          {{ grade.subjects.length }} subjects →
        </p>
      </RouterLink>
    </div>
  </section>
</template>
