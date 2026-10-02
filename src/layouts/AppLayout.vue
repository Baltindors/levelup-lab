<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade, getSubject } from '../data/mockData'

const route = useRoute()

const themeClass = computed(() => {
  const gradeId = route.params.gradeId
  if (!gradeId) return 'theme-default'
  return getGrade(gradeId)?.theme ?? 'theme-default'
})

const grade = computed(() => getGrade(route.params.gradeId))
const subject = computed(() => getSubject(route.params.gradeId, route.params.subjectId))
</script>

<template>
  <div :class="['app-shell', themeClass]">
    <header class="border-b border-black/5 bg-[var(--color-panel)]/80 backdrop-blur-sm">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <RouterLink to="/" class="display text-xl font-bold text-[var(--color-primary)] no-underline">
          LevelUp Lab
        </RouterLink>
        <p class="text-sm text-[var(--color-muted)]">Homework helper for curious kids</p>
      </div>
    </header>

    <nav
      class="sticky top-0 z-10 border-b border-black/5 bg-[var(--color-panel)]/95 backdrop-blur-sm"
      aria-label="Breadcrumb"
    >
      <ol class="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3 text-sm text-[var(--color-muted)]">
        <li>
          <RouterLink to="/" class="font-medium text-[var(--color-primary)] no-underline hover:underline">
            Home
          </RouterLink>
        </li>
        <li v-if="grade" class="flex items-center gap-2">
          <span aria-hidden="true">›</span>
          <RouterLink
            :to="{ name: 'grade', params: { gradeId: grade.id } }"
            class="font-medium text-[var(--color-primary)] no-underline hover:underline"
          >
            {{ grade.name }}
          </RouterLink>
        </li>
        <li v-if="grade && subject" class="flex items-center gap-2">
          <span aria-hidden="true">›</span>
          <RouterLink
            :to="{
              name: 'subject',
              params: { gradeId: grade.id, subjectId: subject.id },
            }"
            class="font-medium text-[var(--color-text)] no-underline hover:underline"
          >
            {{ subject.name }}
          </RouterLink>
        </li>
      </ol>
    </nav>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
