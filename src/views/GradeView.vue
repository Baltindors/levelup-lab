<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGrade } from '../data/mockData'

const route = useRoute()
const grade = computed(() => getGrade(route.params.gradeId))
const isShinobi = computed(() => grade.value?.theme === 'theme-grade-5')

const chakraPct = computed(() => {
  const hud = grade.value?.hud
  if (!hud?.chakraMax) return 0
  return Math.min(100, Math.round((hud.chakra / hud.chakraMax) * 100))
})
</script>

<template>
  <section v-if="grade" class="space-y-6">
    <div
      v-if="grade.hud"
      class="theme-card space-y-3 border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6"
    >
      <p class="display text-2xl tracking-wide text-[var(--color-primary)]">
        {{ grade.hud.rank }} (Chakra: {{ grade.hud.chakra }} XP)
      </p>
      <div
        class="h-3 overflow-hidden rounded-full bg-[var(--color-border)]"
        role="meter"
        :aria-valuenow="grade.hud.chakra"
        :aria-valuemin="0"
        :aria-valuemax="grade.hud.chakraMax"
        :aria-label="`Chakra ${grade.hud.chakra} of ${grade.hud.chakraMax}`"
      >
        <div class="chakra-meter h-full" :style="{ width: `${chakraPct}%` }" />
      </div>
    </div>

    <div>
      <h1 class="display text-4xl font-bold">{{ grade.cardTitle ?? grade.name }}</h1>
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
        class="theme-card block border bg-[var(--color-panel)] p-4 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
        :class="isShinobi ? 'border-[var(--color-border)]' : 'border-black/5'"
      >
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
        <h2 class="display text-2xl font-bold text-[var(--color-primary)]">
          {{ subject.missionTitle ?? subject.name }}
        </h2>
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
