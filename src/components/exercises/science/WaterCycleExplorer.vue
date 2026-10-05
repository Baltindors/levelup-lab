<script setup>
import { computed, ref } from 'vue'
import MathPresetChip from '../common/MathPresetChip.vue'

const processes = [
  { id: 'evaporation', label: 'Evaporation' },
  { id: 'condensation', label: 'Condensation' },
  { id: 'precipitation', label: 'Precipitation' },
  { id: 'runoff', label: 'Runoff' },
  { id: 'infiltration', label: 'Infiltration' },
  { id: 'transpiration', label: 'Transpiration' },
]

const activeProcess = ref('evaporation')

const processCopy = computed(() => {
  const map = {
    evaporation: 'Liquid water turns into vapor and rises UP from the ocean.',
    condensation: 'Water vapor cools into liquid droplets — clouds form and densify.',
    precipitation: 'Water comes DOWN as rain, snow, sleet, or hail.',
    runoff: 'Water moves OVER land toward streams, rivers, and the ocean.',
    infiltration: 'Water soaks INTO the ground through soil and rock.',
    transpiration: 'Plants release water vapor UP from their leaves.',
  }
  return map[activeProcess.value]
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Tap a water-cycle process to watch how water moves through Earth’s systems.
    </p>

    <div class="flex flex-wrap gap-1.5">
      <MathPresetChip
        v-for="process in processes"
        :key="process.id"
        :selected="activeProcess === process.id"
        @click="activeProcess = process.id"
      >
        {{ process.label }}
      </MathPresetChip>
    </div>

    <div class="overflow-x-auto max-w-full">
      <svg
        viewBox="0 0 640 360"
        class="w-full h-auto select-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-sky-950/40"
        role="img"
        aria-label="Interactive water cycle landscape"
      >
        <!-- Sky -->
        <rect x="0" y="0" width="640" height="220" fill="#0c4a6e" opacity="0.55" />
        <!-- Land -->
        <path d="M0 230 L180 210 L280 225 L360 200 L480 220 L640 205 L640 360 L0 360 Z" fill="#3f6212" />
        <path d="M0 250 L200 235 L340 250 L500 230 L640 245 L640 360 L0 360 Z" fill="#4d7c0f" />
        <!-- Mountains -->
        <path d="M360 200 L420 120 L480 200 Z" fill="#64748b" />
        <path d="M430 200 L490 100 L560 200 Z" fill="#475569" />
        <path d="M470 130 L490 100 L505 125 Z" fill="#e2e8f0" opacity="0.7" />
        <!-- Ocean / collection -->
        <ellipse cx="140" cy="290" rx="150" ry="55" fill="#0284c7" />
        <ellipse cx="140" cy="285" rx="130" ry="35" fill="#38bdf8" opacity="0.45" />
        <text x="140" y="300" text-anchor="middle" fill="#e0f2fe" font-size="12" font-weight="700">
          Collection
        </text>
        <!-- Sun -->
        <circle cx="560" cy="60" r="28" fill="#fbbf24" />
        <g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
          <line x1="560" y1="18" x2="560" y2="8" />
          <line x1="560" y1="112" x2="560" y2="102" />
          <line x1="518" y1="60" x2="508" y2="60" />
          <line x1="612" y1="60" x2="602" y2="60" />
          <line x1="531" y1="31" x2="524" y2="24" />
          <line x1="596" y1="96" x2="589" y2="89" />
          <line x1="531" y1="89" x2="524" y2="96" />
          <line x1="596" y1="24" x2="589" y2="31" />
        </g>
        <!-- Clouds -->
        <g
          class="clouds"
          :class="{ 'clouds--dense': activeProcess === 'condensation' }"
        >
          <ellipse cx="250" cy="70" rx="42" ry="22" fill="#cbd5e1" />
          <ellipse cx="275" cy="62" rx="28" ry="18" fill="#e2e8f0" />
          <ellipse cx="225" cy="68" rx="24" ry="16" fill="#e2e8f0" />
          <ellipse cx="340" cy="55" rx="36" ry="18" fill="#94a3b8" />
          <ellipse cx="360" cy="48" rx="22" ry="14" fill="#cbd5e1" />
        </g>
        <!-- Plants -->
        <g fill="#22c55e">
          <ellipse cx="300" cy="230" rx="18" ry="28" />
          <ellipse cx="320" cy="235" rx="14" ry="22" />
          <ellipse cx="280" cy="238" rx="12" ry="18" />
          <rect x="296" y="245" width="8" height="22" fill="#166534" />
        </g>
        <text x="300" y="285" text-anchor="middle" fill="#bbf7d0" font-size="11" font-weight="600">
          Plants
        </text>

        <!-- Evaporation overlay -->
        <g v-if="activeProcess === 'evaporation'" class="vapor-rise" pointer-events="none">
          <circle class="vapor" cx="100" cy="250" r="5" fill="#bae6fd" />
          <circle class="vapor vapor--2" cx="140" cy="255" r="4" fill="#e0f2fe" />
          <circle class="vapor vapor--3" cx="180" cy="248" r="5" fill="#bae6fd" />
          <circle class="vapor vapor--4" cx="120" cy="260" r="3.5" fill="#7dd3fc" />
          <circle class="vapor vapor--5" cx="160" cy="258" r="4.5" fill="#e0f2fe" />
        </g>

        <!-- Transpiration overlay -->
        <g v-if="activeProcess === 'transpiration'" class="vapor-rise" pointer-events="none">
          <circle class="vapor" cx="290" cy="210" r="4" fill="#bbf7d0" />
          <circle class="vapor vapor--2" cx="305" cy="205" r="3.5" fill="#86efac" />
          <circle class="vapor vapor--3" cx="318" cy="212" r="4" fill="#bbf7d0" />
          <circle class="vapor vapor--4" cx="300" cy="200" r="3" fill="#dcfce7" />
        </g>

        <!-- Condensation densify handled via cloud class -->

        <!-- Precipitation overlay -->
        <g v-if="activeProcess === 'precipitation'" class="rainfall" pointer-events="none">
          <line class="rain" x1="230" y1="90" x2="220" y2="150" stroke="#7dd3fc" stroke-width="2" />
          <line class="rain rain--2" x1="255" y1="95" x2="245" y2="160" stroke="#38bdf8" stroke-width="2" />
          <line class="rain rain--3" x1="280" y1="88" x2="270" y2="155" stroke="#7dd3fc" stroke-width="2" />
          <line class="rain rain--4" x1="330" y1="75" x2="320" y2="145" stroke="#38bdf8" stroke-width="2" />
          <line class="rain rain--5" x1="350" y1="80" x2="340" y2="150" stroke="#7dd3fc" stroke-width="2" />
          <line class="rain rain--6" x1="370" y1="72" x2="360" y2="140" stroke="#bae6fd" stroke-width="2" />
        </g>

        <!-- Runoff overlay -->
        <g v-if="activeProcess === 'runoff'" pointer-events="none">
          <path
            class="flow-arrow"
            d="M420 215 Q360 230 280 235 Q220 240 160 260"
            fill="none"
            stroke="#38bdf8"
            stroke-width="4"
            stroke-linecap="round"
            marker-end="url(#arrowHead)"
          />
          <path
            class="flow-arrow flow-arrow--delay"
            d="M460 225 Q380 245 260 250"
            fill="none"
            stroke="#7dd3fc"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.7"
          />
          <text x="300" y="220" fill="#bae6fd" font-size="12" font-weight="700">Over land →</text>
        </g>

        <!-- Infiltration overlay -->
        <g v-if="activeProcess === 'infiltration'" pointer-events="none">
          <line class="infil" x1="260" y1="240" x2="260" y2="300" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="6 4" />
          <line class="infil infil--2" x1="300" y1="235" x2="300" y2="305" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4" />
          <line class="infil infil--3" x1="340" y1="245" x2="340" y2="310" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="6 4" />
          <polygon points="255,300 260,312 265,300" fill="#0ea5e9" />
          <polygon points="295,305 300,317 305,305" fill="#38bdf8" />
          <polygon points="335,310 340,322 345,310" fill="#0ea5e9" />
          <text x="380" y="285" fill="#bae6fd" font-size="12" font-weight="700">Into ground ↓</text>
        </g>

        <defs>
          <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
          </marker>
        </defs>
      </svg>
    </div>

    <p class="text-sm font-semibold text-[var(--color-text)]">
      {{ processCopy }}
    </p>

    <div
      class="rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4"
    >
      <p class="display text-lg tracking-wide text-amber-200">Memory Card</p>
      <p class="mt-2 text-sm text-amber-100/90">
        Evaporation goes UP | Precipitation comes DOWN | Collection gathers water
      </p>
    </div>
  </div>
</template>

<style scoped>
.clouds {
  transition: transform 0.45s ease, opacity 0.45s ease;
  transform-origin: 280px 60px;
  opacity: 0.85;
}
.clouds--dense {
  transform: scale(1.18);
  opacity: 1;
  filter: brightness(1.15);
}

.vapor {
  animation: rise 2.2s ease-in infinite;
  opacity: 0;
}
.vapor--2 { animation-delay: 0.35s; }
.vapor--3 { animation-delay: 0.7s; }
.vapor--4 { animation-delay: 1s; }
.vapor--5 { animation-delay: 1.35s; }

@keyframes rise {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.9; }
  100% { transform: translateY(-120px); opacity: 0; }
}

.rain {
  animation: fall 1.1s linear infinite;
  opacity: 0;
}
.rain--2 { animation-delay: 0.15s; }
.rain--3 { animation-delay: 0.3s; }
.rain--4 { animation-delay: 0.1s; }
.rain--5 { animation-delay: 0.45s; }
.rain--6 { animation-delay: 0.25s; }

@keyframes fall {
  0% { transform: translateY(0); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(90px); opacity: 0; }
}

.flow-arrow {
  stroke-dasharray: 10 8;
  animation: dash 1.2s linear infinite;
}
.flow-arrow--delay {
  animation-delay: 0.4s;
}

@keyframes dash {
  to { stroke-dashoffset: -36; }
}

.infil {
  animation: soak 1.4s ease-in-out infinite;
  opacity: 0.35;
}
.infil--2 { animation-delay: 0.25s; }
.infil--3 { animation-delay: 0.5s; }

@keyframes soak {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}
</style>
