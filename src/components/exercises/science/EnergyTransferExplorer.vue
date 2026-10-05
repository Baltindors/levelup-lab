<script setup>
import { computed, ref } from 'vue'
import MathSegmentedControl from '../common/MathSegmentedControl.vue'

const modes = [
  { id: 'radiation', label: 'Radiation' },
  { id: 'conduction', label: 'Conduction' },
  { id: 'convection', label: 'Convection' },
]

const mode = ref('radiation')

const callout = computed(() => {
  if (mode.value === 'radiation') {
    return 'Waves/Rays - No direct contact needed'
  }
  if (mode.value === 'conduction') {
    return 'Direct Contact - Heat moves through touch'
  }
  return 'Warm fluid rises, cool fluid sinks'
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Switch modes to compare how energy moves through Earth’s systems.
    </p>

    <MathSegmentedControl
      v-model="mode"
      :options="modes"
      aria-label="Energy transfer mode"
    />

    <div class="overflow-x-auto max-w-full">
      <svg
        viewBox="0 0 640 320"
        class="w-full h-auto select-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-slate-950/50"
        role="img"
        :aria-label="`Energy transfer: ${mode}`"
      >
        <defs>
          <marker id="convArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#67e8f9" />
          </marker>
        </defs>

        <!-- Radiation scene -->
        <g v-if="mode === 'radiation'">
          <circle cx="100" cy="90" r="40" fill="#fbbf24" />
          <g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
            <line x1="100" y1="30" x2="100" y2="18" />
            <line x1="145" y1="45" x2="155" y2="35" />
            <line x1="160" y1="90" x2="172" y2="90" />
            <line x1="145" y1="135" x2="155" y2="145" />
          </g>
          <text x="100" y="160" text-anchor="middle" fill="#fde68a" font-size="13" font-weight="700">
            Sun
          </text>

          <!-- Beaming rays -->
          <g class="sun-rays" stroke="#fcd34d" stroke-width="3" stroke-linecap="round">
            <line class="ray" x1="150" y1="100" x2="420" y2="200" />
            <line class="ray ray--2" x1="145" y1="80" x2="430" y2="170" />
            <line class="ray ray--3" x1="155" y1="120" x2="410" y2="230" />
          </g>

          <!-- Earth -->
          <circle cx="500" cy="210" r="55" fill="#0369a1" />
          <ellipse cx="485" cy="200" rx="18" ry="12" fill="#16a34a" />
          <ellipse cx="515" cy="220" rx="14" ry="10" fill="#15803d" />
          <text x="500" y="285" text-anchor="middle" fill="#bae6fd" font-size="13" font-weight="700">
            Earth
          </text>
        </g>

        <!-- Conduction scene -->
        <g v-else-if="mode === 'conduction'">
          <!-- Burner -->
          <rect x="180" y="240" width="160" height="28" rx="6" fill="#475569" />
          <circle cx="220" cy="235" r="14" fill="#f97316" class="flame" />
          <circle cx="260" cy="232" r="16" fill="#ef4444" class="flame flame--2" />
          <circle cx="300" cy="235" r="14" fill="#f97316" class="flame flame--3" />
          <text x="260" y="290" text-anchor="middle" fill="#94a3b8" font-size="12">Burner</text>

          <!-- Pan -->
          <ellipse cx="260" cy="200" rx="90" ry="18" fill="#64748b" />
          <rect x="175" y="165" width="170" height="40" rx="8" fill="#94a3b8" />
          <rect x="340" y="175" width="70" height="12" rx="4" fill="#64748b" />
          <text x="260" y="155" text-anchor="middle" fill="#e2e8f0" font-size="12" font-weight="600">
            Hot pan
          </text>

          <!-- Spoon -->
          <ellipse cx="300" cy="145" rx="18" ry="12" fill="#cbd5e1" class="contact-glow" />
          <rect x="312" y="80" width="10" height="70" rx="3" fill="#e2e8f0" class="contact-glow" />
          <text x="360" y="100" fill="#fca5a5" font-size="12" font-weight="700">Metal spoon</text>

          <!-- Vibrating contact particles -->
          <g class="particles">
            <circle class="particle" cx="250" cy="185" r="4" fill="#f87171" />
            <circle class="particle particle--2" cx="270" cy="190" r="3.5" fill="#fb923c" />
            <circle class="particle particle--3" cx="290" cy="182" r="4" fill="#f87171" />
            <circle class="particle particle--4" cx="305" cy="160" r="3" fill="#fbbf24" />
            <circle class="particle particle--5" cx="315" cy="130" r="3" fill="#fbbf24" />
          </g>
        </g>

        <!-- Convection scene -->
        <g v-else>
          <!-- Boiling pot -->
          <rect x="70" y="140" width="140" height="100" rx="8" fill="#64748b" />
          <rect x="80" y="150" width="120" height="80" rx="4" fill="#0ea5e9" opacity="0.55" />
          <ellipse cx="140" cy="150" rx="70" ry="14" fill="#94a3b8" />
          <g class="bubbles">
            <circle class="bubble" cx="120" cy="200" r="5" fill="#e0f2fe" />
            <circle class="bubble bubble--2" cx="145" cy="210" r="4" fill="#bae6fd" />
            <circle class="bubble bubble--3" cx="160" cy="195" r="6" fill="#e0f2fe" />
          </g>
          <text x="140" y="270" text-anchor="middle" fill="#bae6fd" font-size="12" font-weight="600">
            Boiling water
          </text>

          <!-- Mantle cross-section -->
          <circle cx="430" cy="170" r="100" fill="#7c2d12" />
          <circle cx="430" cy="170" r="55" fill="#f59e0b" />
          <circle cx="430" cy="170" r="22" fill="#fde047" />

          <!-- Circulation arrows -->
          <g class="convection-flow" fill="none" stroke="#67e8f9" stroke-width="3" stroke-linecap="round">
            <path
              d="M390 200 Q370 170 390 140 Q410 120 430 130"
              marker-end="url(#convArrow)"
            />
            <path
              d="M470 140 Q490 170 470 200 Q450 220 430 210"
              marker-end="url(#convArrow)"
              class="convection-flow--delay"
            />
          </g>
          <text x="430" y="290" text-anchor="middle" fill="#fdba74" font-size="12" font-weight="700">
            Mantle convection
          </text>
          <text x="430" y="55" text-anchor="middle" fill="#a5f3fc" font-size="11" font-weight="600">
            Warm rises ↑ · Cool sinks ↓
          </text>
        </g>
      </svg>
    </div>

    <div
      class="rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/15 p-4"
    >
      <p class="display text-lg tracking-wide text-amber-200">
        {{ modes.find((m) => m.id === mode)?.label }}
      </p>
      <p class="mt-2 text-sm text-amber-100/90">{{ callout }}</p>
      <p
        v-if="mode === 'convection'"
        class="mt-3 text-xs font-semibold text-emerald-300"
      >
        Earth systems: mantle convection drives tectonic activity; air/water convection drives weather.
      </p>
    </div>
  </div>
</template>

<style scoped>
.ray {
  stroke-dasharray: 8 10;
  animation: beam 1.2s linear infinite;
  opacity: 0.85;
}
.ray--2 { animation-delay: 0.2s; }
.ray--3 { animation-delay: 0.4s; }
@keyframes beam {
  to { stroke-dashoffset: -36; }
}

.flame {
  animation: flicker 0.7s ease-in-out infinite alternate;
}
.flame--2 { animation-delay: 0.15s; }
.flame--3 { animation-delay: 0.3s; }
@keyframes flicker {
  from { transform: scaleY(1); opacity: 0.85; }
  to { transform: scaleY(1.25) translateY(-4px); opacity: 1; }
}

.contact-glow {
  filter: drop-shadow(0 0 6px rgba(248, 113, 113, 0.75));
}

.particle {
  animation: vibrate 0.35s ease-in-out infinite alternate;
}
.particle--2 { animation-delay: 0.05s; }
.particle--3 { animation-delay: 0.1s; }
.particle--4 { animation-delay: 0.15s; }
.particle--5 { animation-delay: 0.2s; }
@keyframes vibrate {
  from { transform: translate(0, 0); }
  to { transform: translate(2px, -2px); }
}

.bubble {
  animation: riseBubble 1.8s ease-in infinite;
  opacity: 0;
}
.bubble--2 { animation-delay: 0.4s; }
.bubble--3 { animation-delay: 0.8s; }
@keyframes riseBubble {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.9; }
  100% { transform: translateY(-55px); opacity: 0; }
}

.convection-flow path {
  stroke-dasharray: 8 8;
  animation: flowDash 1.4s linear infinite;
}
.convection-flow--delay {
  animation-delay: 0.5s;
}
@keyframes flowDash {
  to { stroke-dashoffset: -32; }
}
</style>
