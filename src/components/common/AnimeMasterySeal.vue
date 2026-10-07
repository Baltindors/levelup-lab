<script setup>
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: String,
    required: true,
    validator: (value) => value === 'training' || value === 'mastered',
  },
  topic: {
    type: String,
    default: 'SPELLING-JUTSU',
  },
})

const uid = `mastery-${Math.random().toString(36).slice(2, 9)}`
const glowId = `${uid}-glow`
const glyphGoldId = `${uid}-glyphGold`

const isMastered = computed(() => props.state === 'mastered')
const topicLabel = computed(() => (props.topic || 'SPELLING-JUTSU').toUpperCase())
const statusLabel = computed(() => (isMastered.value ? 'MASTERED' : 'TRAINING'))
const centerGlyph = computed(() => (isMastered.value ? '封' : '1/2'))

const glyphStops = computed(() => {
  if (!isMastered.value) {
    return [
      { offset: '0%', color: '#94a3b8' },
      { offset: '50%', color: '#64748b' },
      { offset: '100%', color: '#475569' },
    ]
  }
  return [
    { offset: '0%', color: '#fef08a' },
    { offset: '40%', color: '#f59e0b' },
    { offset: '100%', color: '#d97706' },
  ]
})

const bracketStroke = computed(() => (isMastered.value ? '#22d3ee' : '#64748b'))
const letterStroke = computed(() => (isMastered.value ? '#78350f' : '#334155'))
const glyphFontSize = computed(() => (isMastered.value ? 72 : 42))
</script>

<template>
  <div
    class="relative h-full w-full select-none"
    role="img"
    :aria-label="
      isMastered
        ? `Mastered seal for ${topicLabel}`
        : `In training seal for ${topicLabel}`
    "
  >
    <span
      class="absolute -top-1 right-2 z-20 rounded-sm px-2.5 py-0.5 text-[10px] font-black uppercase italic tracking-wider shadow-md md:text-xs"
      :class="
        isMastered
          ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white -skew-x-12'
          : 'bg-slate-700/90 text-slate-400 -skew-x-12'
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
            flood-color="#00e5ff"
            flood-opacity="0.8"
          />
        </filter>
        <linearGradient :id="glyphGoldId" x1="0" y1="0" x2="0" y2="1">
          <stop
            v-for="stop in glyphStops"
            :key="stop.offset"
            :offset="stop.offset"
            :stop-color="stop.color"
          />
        </linearGradient>
      </defs>

      <g transform="rotate(-30 80 70)">
        <path
          d="M 42 16 L 20 16 L 20 124 L 42 124"
          fill="none"
          :stroke="bracketStroke"
          stroke-width="10"
          stroke-linejoin="round"
          stroke-linecap="round"
          v-bind="isMastered ? {} : { 'stroke-dasharray': '8 10' }"
          :filter="isMastered ? `url(#${glowId})` : null"
          :opacity="isMastered ? 1 : 0.55"
        />

        <path
          d="M 118 16 L 140 16 L 140 124 L 118 124"
          fill="none"
          :stroke="bracketStroke"
          stroke-width="10"
          stroke-linejoin="round"
          stroke-linecap="round"
          v-bind="isMastered ? {} : { 'stroke-dasharray': '8 10' }"
          :filter="isMastered ? `url(#${glowId})` : null"
          :opacity="isMastered ? 1 : 0.55"
        />

        <text
          x="80"
          :y="isMastered ? 88 : 82"
          text-anchor="middle"
          font-family="'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Segoe UI', sans-serif"
          font-weight="900"
          :font-size="glyphFontSize"
          :fill="`url(#${glyphGoldId})`"
          :stroke="letterStroke"
          stroke-width="2"
          :opacity="isMastered ? 1 : 0.55"
        >
          {{ centerGlyph }}
        </text>

        <text
          x="80"
          y="110"
          text-anchor="middle"
          font-family="system-ui, sans-serif"
          font-weight="800"
          font-size="14"
          letter-spacing="1.5"
          :fill="isMastered ? '#fbbf24' : '#94a3b8'"
          :opacity="isMastered ? 1 : 0.7"
        >
          {{ statusLabel }}
        </text>
      </g>
    </svg>
  </div>
</template>
