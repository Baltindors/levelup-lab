<script setup>
import { computed, ref } from 'vue'

const CX = 300
const CY = 300
/** ~15% larger ring than the prior 188px radius */
const RING_R = 216
const NODE_R = 38

/** Even circle: Magma at top, then clockwise */
const NODE_DEFS = [
  {
    id: 'magma',
    label: 'Magma',
    angleDeg: -90,
    definition:
      'Hot molten rock beneath Earth’s surface. When it reaches the surface it is called lava.',
    forms: 'Forms when rock melts deep underground from intense heat.',
  },
  {
    id: 'igneous',
    label: 'Igneous Rock',
    angleDeg: -18,
    definition: 'Rock that forms when magma or lava cools and hardens (crystallizes).',
    forms: 'Cooling & crystallization of molten rock.',
  },
  {
    id: 'sediments',
    label: 'Sediments',
    angleDeg: 54,
    definition: 'Bits of broken rock, minerals, and organic pieces.',
    forms: 'Created when rock is broken apart and moved to a new place.',
  },
  {
    id: 'sedimentary',
    label: 'Sedimentary Rock',
    angleDeg: 126,
    definition: 'Rock formed when sediments are compacted and cemented together.',
    forms: 'Compaction & cementation of layered sediments.',
  },
  {
    id: 'metamorphic',
    label: 'Metamorphic Rock',
    angleDeg: 198,
    definition: 'Rock that changed from an existing rock under heat and pressure.',
    forms: 'Heat & pressure transform solid rock without fully melting it.',
  },
]

const ARROW_DEFS = [
  {
    id: 'cooling',
    label: 'Cooling & Crystallization',
    from: 'magma',
    to: 'igneous',
    shortLabel: 'Cooling',
    clue: 'Magma or lava cools and hardens into igneous rock.',
  },
  {
    id: 'weathering',
    label: 'Weathering & Erosion',
    from: 'igneous',
    to: 'sediments',
    shortLabel: 'Weathering',
    clue:
      'Weathering = breaks rock apart | Erosion = moves sediment | Deposition = drops sediment',
  },
  {
    id: 'compaction',
    label: 'Compaction & Cementation',
    from: 'sediments',
    to: 'sedimentary',
    shortLabel: 'Compaction',
    clue: 'Sediments are pressed together and cemented into sedimentary rock.',
  },
  {
    id: 'heat-pressure',
    label: 'Heat & Pressure',
    from: 'sedimentary',
    to: 'metamorphic',
    shortLabel: 'Heat & Pressure',
    clue: 'Existing rock changes under heat and pressure into metamorphic rock.',
  },
  {
    id: 'melting',
    label: 'Melting',
    from: 'metamorphic',
    to: 'magma',
    shortLabel: 'Melting',
    clue: 'Intense heat melts rock back into magma — the cycle continues.',
  },
]

function polar(angleDeg, radius = RING_R) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function pointOnSegment(fromAngle, toAngle, t, radius = RING_R) {
  let delta = toAngle - fromAngle
  while (delta > 180) delta -= 360
  while (delta < -180) delta += 360
  return polar(fromAngle + delta * t, radius)
}

/** Arc path between two node edges along the ring (clockwise). */
function arcPath(fromAngle, toAngle) {
  const start = polar(fromAngle + 14, RING_R)
  const end = polar(toAngle - 14, RING_R)
  const mid = pointOnSegment(fromAngle, toAngle, 0.5, RING_R + 8)
  return `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`
}

const nodes = NODE_DEFS.map((n) => {
  const { x, y } = polar(n.angleDeg)
  return { ...n, x, y }
})

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]))

const arrows = ARROW_DEFS.map((a) => {
  const from = nodeById[a.from]
  const to = nodeById[a.to]
  const labelPos = pointOnSegment(from.angleDeg, to.angleDeg, 0.5, RING_R + 40)
  return {
    ...a,
    d: arcPath(from.angleDeg, to.angleDeg),
    labelX: labelPos.x,
    labelY: labelPos.y,
  }
})

const selectedId = ref('igneous')

const selectedNode = computed(() => nodes.find((n) => n.id === selectedId.value) || null)
const selectedArrow = computed(() => arrows.find((a) => a.id === selectedId.value) || null)

const panelTitle = computed(
  () => selectedNode.value?.label || selectedArrow.value?.label || '',
)

const panelToneClass = computed(() =>
  selectedArrow.value
    ? 'border-amber-500/40 bg-slate-950/95'
    : 'border-emerald-500/35 bg-slate-950/95',
)

function select(id) {
  selectedId.value = id
}

function isActive(id) {
  return selectedId.value === id
}

function labelLines(label) {
  const parts = label.split(' ')
  if (parts.length === 1) return [parts[0]]
  if (parts.length === 2) return parts
  return [parts[0], parts.slice(1).join(' ')]
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Tap a rock type or transformation arrow to explore the non-linear rock cycle.
    </p>

    <div class="mx-auto w-full max-w-xl md:max-w-2xl">
      <div class="relative overflow-x-auto">
        <svg
          viewBox="0 0 600 600"
          class="w-full h-auto select-none rounded-[var(--radius-card)] border border-[var(--color-border)] bg-slate-950/50"
          role="img"
          aria-label="Interactive rock cycle diagram"
        >
          <defs>
            <marker
              id="rockArrow"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill="#94a3b8" />
            </marker>
            <marker
              id="rockArrowActive"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill="#34d399" />
            </marker>
          </defs>

          <!-- Soft guide ring only (no center plate) -->
          <circle
            :cx="CX"
            :cy="CY"
            :r="RING_R"
            fill="none"
            stroke="#334155"
            stroke-width="1.5"
            stroke-dasharray="4 8"
            opacity="0.55"
          />

          <!-- Transformation paths -->
          <path
            v-for="arrow in arrows"
            :key="`vis-${arrow.id}`"
            :d="arrow.d"
            fill="none"
            :stroke="isActive(arrow.id) ? '#34d399' : '#64748b'"
            :stroke-width="isActive(arrow.id) ? 4 : 2.5"
            stroke-linecap="round"
            :marker-end="isActive(arrow.id) ? 'url(#rockArrowActive)' : 'url(#rockArrow)'"
            class="transition-all duration-200"
          />

          <!-- Generous arrow hitboxes -->
          <path
            v-for="arrow in arrows"
            :key="`hit-${arrow.id}`"
            :d="arrow.d"
            fill="none"
            stroke="transparent"
            stroke-width="28"
            class="cursor-pointer"
            @click="select(arrow.id)"
          >
            <title>{{ arrow.label }}</title>
          </path>

          <!-- Process labels outside the ring -->
          <text
            v-for="arrow in arrows"
            :key="`lbl-${arrow.id}`"
            :x="arrow.labelX"
            :y="arrow.labelY"
            text-anchor="middle"
            dominant-baseline="middle"
            :fill="isActive(arrow.id) ? '#6ee7b7' : '#94a3b8'"
            font-size="11"
            font-weight="600"
            class="pointer-events-none"
          >
            {{ arrow.shortLabel }}
          </text>

          <!-- Nodes on the circle -->
          <g v-for="node in nodes" :key="node.id">
            <circle
              :cx="node.x"
              :cy="node.y"
              :r="NODE_R + 10"
              fill="transparent"
              class="cursor-pointer"
              @click="select(node.id)"
            />
            <circle
              :cx="node.x"
              :cy="node.y"
              :r="NODE_R"
              :fill="isActive(node.id) ? '#059669' : '#1e293b'"
              :stroke="isActive(node.id) ? '#6ee7b7' : '#475569'"
              stroke-width="3"
              class="cursor-pointer transition-all duration-200"
              @click="select(node.id)"
            />
            <text
              :x="node.x"
              :y="node.y"
              text-anchor="middle"
              dominant-baseline="middle"
              class="pointer-events-none"
              :fill="isActive(node.id) ? '#ecfdf5' : '#e2e8f0'"
              font-size="11"
              font-weight="700"
            >
              <tspan
                v-for="(line, i) in labelLines(node.label)"
                :key="line"
                :x="node.x"
                :dy="i === 0 ? (labelLines(node.label).length > 1 ? '-0.4em' : '0.35em') : '1.15em'"
              >
                {{ line }}
              </tspan>
            </text>
          </g>
        </svg>

        <!-- Desktop: fixed-size info square centered in the ring (no backing circle) -->
        <div
          class="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex"
          aria-live="polite"
        >
          <div
            class="flex w-52 flex-col items-center justify-center rounded-2xl border px-3 py-3 text-center shadow-lg"
            :class="panelToneClass"
          >
            <p
              class="display text-sm leading-tight tracking-wide"
              :class="selectedArrow ? 'text-amber-200' : 'text-[var(--color-text)]'"
            >
              {{ panelTitle }}
            </p>

            <template v-if="selectedNode">
              <p class="mt-2 text-xs leading-snug text-[var(--color-muted)]">
                {{ selectedNode.definition }}
              </p>
              <p
                class="mt-2 inline-flex max-w-full rounded-full border border-emerald-500/40 bg-emerald-950/50 px-2 py-0.5 text-[0.65rem] font-semibold leading-tight text-emerald-300"
              >
                Forms by: {{ selectedNode.forms }}
              </p>
            </template>

            <template v-else-if="selectedArrow">
              <p class="mt-2 text-xs leading-snug text-amber-100/90">
                {{ selectedArrow.clue }}
              </p>
            </template>
          </div>
        </div>
      </div>

      <!-- Mobile: info panel under the graph -->
      <div
        class="mt-3 rounded-2xl border px-4 py-3 md:hidden"
        :class="panelToneClass"
        aria-live="polite"
      >
        <p
          class="display text-base leading-tight tracking-wide"
          :class="selectedArrow ? 'text-amber-200' : 'text-[var(--color-text)]'"
        >
          {{ panelTitle }}
        </p>

        <template v-if="selectedNode">
          <p class="mt-2 text-sm leading-snug text-[var(--color-muted)]">
            {{ selectedNode.definition }}
          </p>
          <p
            class="mt-3 inline-flex max-w-full rounded-full border border-emerald-500/40 bg-emerald-950/50 px-3 py-1 text-xs font-semibold leading-tight text-emerald-300"
          >
            Forms by: {{ selectedNode.forms }}
          </p>
        </template>

        <template v-else-if="selectedArrow">
          <p class="mt-2 text-sm leading-snug text-amber-100/90">
            {{ selectedArrow.clue }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
