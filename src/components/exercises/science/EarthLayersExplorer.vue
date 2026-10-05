<script setup>
import { computed, ref } from 'vue'

const layers = [
  {
    id: 'crust',
    label: 'Crust',
    outerR: 150,
    innerR: 132,
    color: '#a8a29e',
    thickness: 'Thin outer shell',
    thickest: false,
    state: 'Solid',
    tempPct: 18,
    pressurePct: 15,
    blurb: 'The thin, solid outer shell of Earth — where we live.',
  },
  {
    id: 'mantle',
    label: 'Mantle',
    outerR: 132,
    innerR: 72,
    color: '#ea580c',
    thickness: 'Thickest layer',
    thickest: true,
    state: 'Solid (hot, slowly flowing rock)',
    tempPct: 55,
    pressurePct: 50,
    blurb: 'The thickest layer — hot rock that can slowly convect.',
  },
  {
    id: 'outer-core',
    label: 'Outer Core',
    outerR: 72,
    innerR: 38,
    color: '#f59e0b',
    thickness: 'Liquid metal shell',
    thickest: false,
    state: 'Liquid',
    tempPct: 78,
    pressurePct: 80,
    blurb: 'Liquid iron and nickel surrounding the inner core.',
  },
  {
    id: 'inner-core',
    label: 'Inner Core',
    outerR: 38,
    innerR: 0,
    color: '#fde047',
    thickness: 'Solid center sphere',
    thickest: false,
    state: 'Solid',
    tempPct: 95,
    pressurePct: 98,
    blurb: 'Solid iron and nickel at Earth’s center — extreme pressure keeps it solid.',
  },
]

const activeLayer = ref('crust')
const active = computed(() => layers.find((l) => l.id === activeLayer.value) || layers[0])

function selectLayer(id) {
  activeLayer.value = id
}

/** Build a donut ring path for clickable concentric layers */
function ringPath(cx, cy, outerR, innerR) {
  if (innerR <= 0) {
    return `M ${cx} ${cy} m -${outerR},0 a ${outerR},${outerR} 0 1,0 ${outerR * 2},0 a ${outerR},${outerR} 0 1,0 -${outerR * 2},0`
  }
  return [
    `M ${cx} ${cy - outerR}`,
    `A ${outerR} ${outerR} 0 1 1 ${cx} ${cy + outerR}`,
    `A ${outerR} ${outerR} 0 1 1 ${cx} ${cy - outerR}`,
    `M ${cx} ${cy - innerR}`,
    `A ${innerR} ${innerR} 0 1 0 ${cx} ${cy + innerR}`,
    `A ${innerR} ${innerR} 0 1 0 ${cx} ${cy - innerR}`,
    'Z',
  ].join(' ')
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Tap a layer in Earth’s cross-section to read depth telemetry — temperature and pressure rise as you go deeper.
    </p>

    <div class="overflow-x-auto max-w-full">
      <svg
        viewBox="0 0 360 360"
        class="w-full h-auto select-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-slate-950/60"
        role="img"
        aria-label="Earth layers concentric cross-section"
      >
        <circle cx="180" cy="180" r="155" fill="#0f172a" stroke="#334155" stroke-width="2" />

        <g v-for="layer in layers" :key="layer.id">
          <path
            :d="ringPath(180, 180, layer.outerR, layer.innerR)"
            :fill="layer.color"
            :opacity="activeLayer === layer.id ? 1 : 0.72"
            :stroke="activeLayer === layer.id ? '#6ee7b7' : '#1e293b'"
            :stroke-width="activeLayer === layer.id ? 3 : 1"
            fill-rule="evenodd"
            class="cursor-pointer transition-all duration-200"
            @click="selectLayer(layer.id)"
          />
          <!-- Generous transparent hit ring (slightly padded) -->
          <path
            :d="ringPath(180, 180, layer.outerR + 4, Math.max(0, layer.innerR - 4))"
            fill="transparent"
            fill-rule="evenodd"
            class="cursor-pointer"
            @click="selectLayer(layer.id)"
          >
            <title>{{ layer.label }}</title>
          </path>
        </g>

        <text x="180" y="28" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600">
          Outside → Center
        </text>
        <text
          x="180"
          y="185"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#422006"
          font-size="10"
          font-weight="800"
          class="pointer-events-none"
        >
          Core
        </text>
      </svg>
    </div>

    <div
      class="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <p class="display text-xl tracking-wide text-[var(--color-text)]">
          {{ active.label }}
        </p>
        <span
          v-if="active.thickest"
          class="inline-flex rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300"
        >
          Thickest layer
        </span>
        <span
          class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
          :class="
            active.state === 'Liquid'
              ? 'border-sky-400/50 bg-sky-950/40 text-sky-200'
              : 'border-amber-500/40 bg-amber-950/30 text-amber-200'
          "
        >
          {{ active.state === 'Liquid' ? 'Liquid' : 'Solid' }}
        </span>
      </div>

      <p class="text-sm text-[var(--color-muted)]">{{ active.blurb }}</p>
      <p class="text-xs font-semibold text-[var(--color-muted)]">
        Thickness status: {{ active.thickness }}
      </p>

      <div class="space-y-3">
        <div>
          <div class="mb-1 flex justify-between text-xs font-semibold text-[var(--color-muted)]">
            <span>Temperature</span>
            <span>{{ active.tempPct }}%</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full border border-[var(--color-border)] bg-slate-900">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              :style="{ width: `${active.tempPct}%` }"
            />
          </div>
        </div>
        <div>
          <div class="mb-1 flex justify-between text-xs font-semibold text-[var(--color-muted)]">
            <span>Pressure</span>
            <span>{{ active.pressurePct }}%</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full border border-[var(--color-border)] bg-slate-900">
            <div
              class="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
              :style="{ width: `${active.pressurePct}%` }"
            />
          </div>
        </div>
      </div>

      <p class="text-xs text-amber-200/80">
        Memory: Temperature and pressure both increase with depth.
      </p>
    </div>
  </div>
</template>
