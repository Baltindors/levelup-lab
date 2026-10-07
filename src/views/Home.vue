<script setup>
import { RouterLink } from 'vue-router'
import { mockData } from '../data/mockData'
import { useShinobiProgress } from '../composables/useShinobiProgress'

const { currentRank } = useShinobiProgress()

function gradeBadgeText(grade) {
  if (!grade.rankBadge) return ''
  // Guard undefined before/while progress hydrates from localStorage.
  const title = currentRank.value?.title?.toUpperCase() || 'GENIN'
  const level = currentRank.value?.level || 1
  return `${title} • LEVEL ${level}`
}
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
        class="theme-card block border p-4 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
        :class="[
          grade.theme,
          grade.rankBadge
            ? 'group border-[var(--color-border)] bg-[#16181F] hover:border-orange-500 hover:shadow-[0_0_20px_rgba(255,94,30,0.35)]'
            : 'border-black/5 bg-[var(--color-panel)]',
        ]"
      >
        <div class="flex flex-col items-stretch gap-3">
          <span
            v-if="grade.rankBadge"
            class="ninja-tag display self-end inline-flex items-center gap-1.5 bg-[var(--color-primary)] px-3 py-1 text-sm tracking-wide text-white"
          >
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M12 1.5l2.1 7.2 7.4.2-5.9 4.5 2.1 7.1L12 16.6 6.3 20.5l2.1-7.1L2.5 8.9l7.4-.2L12 1.5z" />
            </svg>
            {{ gradeBadgeText(grade) }}
          </span>
          <h2
            class="display text-2xl font-bold text-[var(--color-primary)]"
            :class="grade.rankBadge ? 'tracking-wide' : ''"
          >
            {{ grade.cardTitle ?? grade.name }}
          </h2>
        </div>
        <p class="mt-2 text-sm text-[var(--color-muted)]">{{ grade.blurb }}</p>
        <p v-if="grade.rankBadge" class="display mt-4 min-h-11 text-sm tracking-wide text-[var(--color-primary)]">
          {{ grade.cta }}
          <span class="dojo-cta-arrow" aria-hidden="true">→</span>
        </p>
        <p v-else class="mt-4 text-sm font-semibold text-[var(--color-primary)]">
          {{ grade.subjects.length }} {{ grade.subjects.length === 1 ? 'subject' : 'subjects' }} →
        </p>
      </RouterLink>
    </div>
  </section>
</template>
