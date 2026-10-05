<script setup>
import { computed, ref } from 'vue'

const layers = [
  {
    id: 'exosphere',
    label: 'Exosphere',
    altitude: '600+ km',
    y: 20,
    height: 56,
    fill: '#0f172a',
    feature: 'Outer edge of the atmosphere — satellites orbit here.',
  },
  {
    id: 'thermosphere',
    label: 'Thermosphere',
    altitude: '~80–600 km',
    y: 76,
    height: 70,
    fill: '#1e1b4b',
    feature: 'Auroras glow here as charged particles dance with Earth’s magnetic field.',
  },
  {
    id: 'mesosphere',
    label: 'Mesosphere',
    altitude: '~50–80 km',
    y: 146,
    height: 58,
    fill: '#312e81',
    feature: 'Meteors burn up in this layer.',
  },
  {
    id: 'stratosphere',
    label: 'Stratosphere',
    altitude: '~12–50 km',
    y: 204,
    height: 70,
    fill: '#1e3a5f',
    feature: 'Contains the ozone layer that shields Earth from harmful UV rays.',
  },
  {
    id: 'troposphere',
    label: 'Troposphere',
    altitude: '0–12 km',
    y: 274,
    height: 86,
    fill: '#0c4a6e',
    feature: 'Where we live & all weather happens.',
  },
]

const layerOrder = ['troposphere', 'stratosphere', 'mesosphere', 'thermosphere', 'exosphere']
const activeLayer = ref('troposphere')

const activeIndex = computed(() => layerOrder.indexOf(activeLayer.value))
const activeMeta = computed(() => layers.find((l) => l.id === activeLayer.value))

function selectLayer(id) {
  activeLayer.value = id
}

function onSlider(e) {
  const idx = Number(e.target.value)
  activeLayer.value = layerOrder[idx] || 'troposphere'
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="sticky top-0 z-10 rounded-[var(--radius-card)] border border-amber-500/30 bg-amber-950/90 px-4 py-3 backdrop-blur"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-amber-300/80">Mnemonic</p>
      <p class="display text-lg tracking-wide text-amber-100 sm:text-xl">
        The Smart Monkey Takes Everything
      </p>
      <p class="mt-1 text-xs text-amber-200/70">
        Troposphere → Stratosphere → Mesosphere → Thermosphere → Exosphere
      </p>
    </div>

    <p class="text-sm text-[var(--color-muted)]">
      Drag the altitude slider or tap a layer band to explore the atmosphere from ground to space.
    </p>

    <label class="block text-sm">
      <span class="font-semibold text-[var(--color-muted)]">
        Altitude focus: {{ activeMeta?.label }} ({{ activeMeta?.altitude }})
      </span>
      <input
        class="mt-2 w-full accent-[var(--color-primary)]"
        type="range"
        min="0"
        max="4"
        step="1"
        :value="activeIndex"
        aria-label="Atmosphere layer altitude"
        @input="onSlider"
      />
      <div class="mt-1 flex justify-between text-[10px] text-[var(--color-muted)] sm:text-xs">
        <span>0 km (surface)</span>
        <span>600+ km (space)</span>
      </div>
    </label>

    <div class="overflow-x-auto max-w-full">
      <svg
        viewBox="0 0 420 380"
        class="w-full h-auto select-none rounded-[var(--radius-card)] border border-[var(--color-border)]"
        role="img"
        aria-label="Atmosphere altitude cross-section"
      >
        <!-- Layer bands -->
        <g v-for="layer in layers" :key="layer.id">
          <rect
            x="70"
            :y="layer.y"
            width="280"
            :height="layer.height"
            :fill="layer.fill"
            :stroke="activeLayer === layer.id ? '#34d399' : '#334155'"
            :stroke-width="activeLayer === layer.id ? 3 : 1"
            class="cursor-pointer transition-all duration-200"
            @click="selectLayer(layer.id)"
          />
          <!-- Extra hit padding -->
          <rect
            x="60"
            :y="layer.y"
            width="300"
            :height="layer.height"
            fill="transparent"
            class="cursor-pointer"
            @click="selectLayer(layer.id)"
          />
          <text
            x="210"
            :y="layer.y + layer.height / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#e2e8f0"
            font-size="13"
            font-weight="700"
            class="pointer-events-none"
          >
            {{ layer.label }}
          </text>
          <text
            x="365"
            :y="layer.y + layer.height / 2"
            dominant-baseline="middle"
            fill="#94a3b8"
            font-size="10"
            class="pointer-events-none"
          >
            {{ layer.altitude }}
          </text>
        </g>

        <!-- Ground -->
        <rect x="70" y="360" width="280" height="16" fill="#166534" />
        <text x="210" y="372" text-anchor="middle" fill="#bbf7d0" font-size="10" font-weight="600">
          Earth surface
        </text>

        <!-- Troposphere features -->
        <g v-if="activeLayer === 'troposphere'" class="pointer-events-none">
          <ellipse cx="140" cy="300" rx="22" ry="12" fill="#94a3b8" />
          <ellipse cx="155" cy="296" rx="14" ry="9" fill="#cbd5e1" />
          <line class="rain-drop" x1="145" y1="312" x2="142" y2="335" stroke="#7dd3fc" stroke-width="2" />
          <line class="rain-drop rain-drop--2" x1="155" y1="314" x2="152" y2="338" stroke="#38bdf8" stroke-width="2" />
          <path d="M250 320 L285 312 L300 318 L285 324 Z" fill="#e2e8f0" />
          <circle cx="262" cy="318" r="3" fill="#64748b" />
          <circle cx="278" cy="316" r="3" fill="#64748b" />
        </g>

        <!-- Stratosphere ozone shield -->
        <g v-if="activeLayer === 'stratosphere'" class="pointer-events-none">
          <rect
            x="95"
            y="228"
            width="230"
            height="28"
            rx="10"
            fill="#34d399"
            opacity="0.35"
            class="ozone-pulse"
          />
          <text x="210" y="247" text-anchor="middle" fill="#a7f3d0" font-size="13" font-weight="800">
            Ozone Layer Shield
          </text>
        </g>

        <!-- Mesosphere meteor -->
        <g v-if="activeLayer === 'mesosphere'" class="pointer-events-none">
          <g class="meteor">
            <line x1="300" y1="155" x2="250" y2="185" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" />
            <circle cx="248" cy="187" r="5" fill="#f97316" />
            <circle cx="248" cy="187" r="9" fill="#fbbf24" opacity="0.35" />
          </g>
        </g>

        <!-- Thermosphere aurora -->
        <g v-if="activeLayer === 'thermosphere'" class="pointer-events-none aurora">
          <path
            d="M90 130 Q140 90 190 125 T290 115 T350 130"
            fill="none"
            stroke="#22d3ee"
            stroke-width="4"
            opacity="0.75"
          />
          <path
            d="M100 140 Q160 100 210 135 T320 120"
            fill="none"
            stroke="#a78bfa"
            stroke-width="3"
            opacity="0.65"
          />
          <path
            d="M110 145 Q170 115 230 140 T340 135"
            fill="none"
            stroke="#34d399"
            stroke-width="2.5"
            opacity="0.55"
          />
        </g>

        <!-- Exosphere satellite -->
        <g v-if="activeLayer === 'exosphere'" class="pointer-events-none satellite">
          <rect x="285" y="35" width="22" height="14" rx="2" fill="#cbd5e1" />
          <rect x="272" y="38" width="12" height="8" fill="#64748b" />
          <rect x="308" y="38" width="12" height="8" fill="#64748b" />
          <circle cx="296" cy="42" r="2.5" fill="#38bdf8" />
          <line x1="296" y1="49" x2="296" y2="58" stroke="#94a3b8" stroke-width="1.5" />
        </g>
      </svg>
    </div>

    <div
      class="rounded-[var(--radius-card)] border border-emerald-500/30 bg-emerald-950/20 p-4"
    >
      <p class="display text-lg tracking-wide text-emerald-200">
        {{ activeMeta?.label }}
      </p>
      <p class="mt-1 text-xs font-semibold text-emerald-300/80">
        {{ activeMeta?.altitude }}
      </p>
      <p class="mt-2 text-sm text-emerald-100/90">
        {{ activeMeta?.feature }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.rain-drop {
  animation: drip 1s linear infinite;
  opacity: 0;
}
.rain-drop--2 {
  animation-delay: 0.35s;
}
@keyframes drip {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(20px); opacity: 0; }
}

.ozone-pulse {
  animation: pulseGlow 1.8s ease-in-out infinite;
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.28; }
  50% { opacity: 0.55; }
}

.meteor {
  animation: streak 1.6s ease-in infinite;
}
@keyframes streak {
  0% { transform: translate(30px, -20px); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(-40px, 35px); opacity: 0; }
}

.aurora path {
  animation: auroraWave 2.4s ease-in-out infinite alternate;
}
.aurora path:nth-child(2) {
  animation-delay: 0.3s;
}
.aurora path:nth-child(3) {
  animation-delay: 0.6s;
}
@keyframes auroraWave {
  from { transform: translateY(0); opacity: 0.45; }
  to { transform: translateY(-6px); opacity: 0.9; }
}

.satellite {
  animation: orbitBob 2.5s ease-in-out infinite;
}
@keyframes orbitBob {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(12px); }
}
</style>
