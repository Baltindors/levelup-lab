<script setup>
import { computed } from 'vue'

const props = defineProps({
  rank: { type: String, default: '' },
  topic: { type: String, default: '' },
  sealed: { type: Boolean, default: false },
})

const uid = `seal-${Math.random().toString(36).slice(2, 9)}`
const glowId = `${uid}-glow`
const rankGoldId = `${uid}-rankGold`

const RANK_STOPS = {
  S: [
    { offset: '0%', color: '#fef08a' },
    { offset: '40%', color: '#f59e0b' },
    { offset: '100%', color: '#d97706' },
  ],
  A: [
    { offset: '0%', color: '#a7f3d0' },
    { offset: '45%', color: '#34d399' },
    { offset: '100%', color: '#d97706' },
  ],
  B: [
    { offset: '0%', color: '#fed7aa' },
    { offset: '40%', color: '#f97316' },
    { offset: '100%', color: '#d97706' },
  ],
  C: [
    { offset: '0%', color: '#fecdd3' },
    { offset: '45%', color: '#fb7185' },
    { offset: '100%', color: '#b45309' },
  ],
  F: [
    { offset: '0%', color: '#fda4af' },
    { offset: '45%', color: '#e11d48' },
    { offset: '100%', color: '#78350f' },
  ],
}

const hasRank = computed(() => Boolean(props.rank) && Boolean(RANK_STOPS[props.rank]))

const isActive = computed(() => props.sealed && hasRank.value)

const displayRank = computed(() => (hasRank.value ? props.rank : 'SEAL'))

function readThemeToken(name) {
  if (typeof document === 'undefined') return ''
  const root = document.querySelector('.app-shell') || document.documentElement
  return getComputedStyle(root).getPropertyValue(name).trim()
}

const accentColor = computed(() => {
  void props.rank
  return readThemeToken('--color-accent') || readThemeToken('--color-primary') || '#4338ca'
})

const mutedStroke = computed(() => readThemeToken('--color-border') || '#64748b')

const rankStops = computed(() => {
  if (hasRank.value) return RANK_STOPS[props.rank]
  return [
    { offset: '0%', color: '#94a3b8' },
    { offset: '50%', color: '#64748b' },
    { offset: '100%', color: '#475569' },
  ]
})

const topicLabel = computed(() => (props.topic || 'TRIAL').toUpperCase())

const bracketStroke = computed(() => (isActive.value ? accentColor.value : mutedStroke.value))
const letterStroke = computed(() => (isActive.value ? '#78350f' : '#334155'))
</script>

<template>
  <div
    class="relative h-full w-full select-none"
    role="img"
    :aria-label="
      hasRank
        ? `Rank ${displayRank} seal for ${topicLabel}`
        : `Unattempted seal for ${topicLabel}`
    "
  >
    <span
      class="absolute -top-1 right-2 z-20 rounded-sm px-2.5 py-0.5 text-[10px] font-black uppercase italic tracking-wider shadow-md md:text-xs"
      :class="
        isActive
          ? 'bg-[var(--color-primary)] text-white -skew-x-12'
          : hasRank
            ? 'border border-[var(--color-border)] text-[var(--color-primary)] -skew-x-12'
            : 'border border-dashed border-[var(--color-border)] text-[var(--color-muted)] -skew-x-12'
      "
    >
      {{ topicLabel }}
    </span>

    <svg
      class="h-full w-full overflow-visible"
      viewBox="0 0 160 140"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter :id="glowId" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            :flood-color="accentColor"
            flood-opacity="0.8"
          />
        </filter>
        <linearGradient :id="rankGoldId" x1="0" y1="0" x2="0" y2="1">
          <stop
            v-for="stop in rankStops"
            :key="stop.offset"
            :offset="stop.offset"
            :stop-color="stop.color"
          />
        </linearGradient>
      </defs>

      <!-- Rotated stamp: brackets + grade -->
      <g transform="rotate(-30 80 70)">
        <!-- Left bracket [ -->
        <path
          d="M 42 16 L 20 16 L 20 124 L 42 124"
          fill="none"
          :stroke="bracketStroke"
          stroke-width="10"
          stroke-linejoin="round"
          stroke-linecap="round"
          v-bind="hasRank ? {} : { 'stroke-dasharray': '8 10' }"
          :filter="isActive ? `url(#${glowId})` : null"
          :opacity="isActive ? 1 : 0.55"
        />

        <!-- Right bracket ] -->
        <path
          d="M 118 16 L 140 16 L 140 124 L 118 124"
          fill="none"
          :stroke="bracketStroke"
          stroke-width="10"
          stroke-linejoin="round"
          stroke-linecap="round"
          v-bind="hasRank ? {} : { 'stroke-dasharray': '8 10' }"
          :filter="isActive ? `url(#${glowId})` : null"
          :opacity="isActive ? 1 : 0.55"
        />

        <!-- Giant letter grade -->
        <text
          x="80"
          y="98"
          text-anchor="middle"
          font-family="system-ui, sans-serif"
          font-weight="900"
          font-size="82"
          :fill="`url(#${rankGoldId})`"
          :stroke="letterStroke"
          stroke-width="2"
          :opacity="hasRank ? 1 : 0.45"
        >
          {{ displayRank }}
        </text>
      </g>
    </svg>
  </div>
</template>
