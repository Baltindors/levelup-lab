<script setup>
import { computed, ref, watch } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import {
  analyzeTrigEquation,
  asymptotesInRange,
  buildPlotSegments,
  formatPiLatex,
} from '../../../utils/trigSolver'

const props = defineProps({
  presets: {
    type: Array,
    default: () => [],
  },
})

const equation = ref(props.presets[0] ?? 'sin(x)')

const keypad = [
  'sin',
  'cos',
  'tan',
  'cot',
  'sec',
  'csc',
  'π',
  'x',
  '+',
  '-',
  '·',
  '/',
  '(',
  ')',
]

const analysis = computed(() => analyzeTrigEquation(equation.value))

const xMin = -2 * Math.PI
const xMax = 2 * Math.PI
const yMin = -6
const yMax = 6
const width = 640
const height = 360
const pad = 36

function toSvgX(x) {
  return pad + ((x - xMin) / (xMax - xMin)) * (width - 2 * pad)
}
function toSvgY(y) {
  return pad + ((yMax - y) / (yMax - yMin)) * (height - 2 * pad)
}

const plotSegments = computed(() => {
  if (!analysis.value.ok) return []
  return buildPlotSegments(analysis.value, xMin, xMax, Math.max(Math.abs(yMin), Math.abs(yMax)), 900)
})

const pathDs = computed(() =>
  plotSegments.value.map((seg) =>
    seg
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x).toFixed(2)} ${toSvgY(p.y).toFixed(2)}`)
      .join(' ')
  )
)

const asymptoteXs = computed(() => {
  if (!analysis.value.ok) return []
  return asymptotesInRange(analysis.value, xMin, xMax)
})

const xTicks = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map((k) => k * Math.PI)
const keyPoints = computed(() => (analysis.value.ok ? analysis.value.keyPoints : []))

function renderKatex(latex, displayMode = false) {
  if (!latex) return ''
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode })
  } catch {
    return latex
  }
}

function appendToken(token) {
  if (token === '·') {
    equation.value += '*'
    return
  }
  if (['sin', 'cos', 'tan', 'cot', 'sec', 'csc'].includes(token)) {
    equation.value += `${token}(`
    return
  }
  equation.value += token
}

function clearEquation() {
  equation.value = ''
}

function loadPreset(value) {
  if (value) equation.value = value
}

function tickLabel(t) {
  if (Math.abs(t) < 1e-9) return '0'
  if (t === Math.PI) return 'π'
  if (t === -Math.PI) return '-π'
  if (t === 2 * Math.PI) return '2π'
  if (t === -2 * Math.PI) return '-2π'
  if (t === Math.PI / 2) return 'π/2'
  if (t === -Math.PI / 2) return '-π/2'
  if (t === (3 * Math.PI) / 2) return '3π/2'
  if (t === (-3 * Math.PI) / 2) return '-3π/2'
  return ''
}

watch(
  () => props.presets,
  (list) => {
    if (list?.length && !equation.value) equation.value = list[0]
  }
)
</script>

<template>
  <div class="space-y-5">
    <div class="theme-card space-y-3 border border-black/5 bg-[var(--color-panel)] p-4 shadow-sm">
      <label class="block text-sm font-semibold text-[var(--color-muted)]" for="trig-eq">
        Equation
      </label>
      <input
        id="trig-eq"
        v-model="equation"
        type="text"
        class="w-full rounded-[var(--radius-card)] border border-black/10 bg-[var(--color-surface)] px-3 py-2 font-mono text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        spellcheck="false"
        autocomplete="off"
      />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="key in keypad"
          :key="key"
          type="button"
          class="theme-pill border border-black/10 bg-[var(--color-primary-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)]"
          @click="appendToken(key)"
        >
          {{ key }}
        </button>
        <button
          type="button"
          class="theme-pill border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700"
          @click="clearEquation"
        >
          Clear
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <label class="text-sm font-semibold text-[var(--color-muted)]" for="trig-preset">
          Preset practice
        </label>
        <select
          id="trig-preset"
          class="min-w-56 rounded-[var(--radius-card)] border border-black/10 bg-[var(--color-surface)] px-3 py-2 text-sm"
          @change="loadPreset($event.target.value)"
        >
          <option value="">Choose a preset…</option>
          <option v-for="p in presets" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <p v-if="!analysis.ok" class="text-sm font-medium text-rose-700">
        {{ analysis.error }}
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-2">
      <div class="theme-card border border-black/5 bg-[var(--color-panel)] p-3 shadow-sm">
        <p class="mb-2 px-1 text-sm font-semibold text-[var(--color-muted)]">Coordinate plane</p>
        <svg
          :viewBox="`0 0 ${width} ${height}`"
          class="h-auto w-full rounded-[var(--radius-card)] bg-[var(--color-surface)]"
          role="img"
          aria-label="Trigonometric function graph"
        >
          <g stroke="#cbd5e1" stroke-width="1">
            <line
              v-for="t in xTicks"
              :key="'vx' + t"
              :x1="toSvgX(t)"
              :y1="pad"
              :x2="toSvgX(t)"
              :y2="height - pad"
            />
            <line
              v-for="y in [-4, -2, 0, 2, 4]"
              :key="'hy' + y"
              :x1="pad"
              :y1="toSvgY(y)"
              :x2="width - pad"
              :y2="toSvgY(y)"
            />
          </g>
          <line
            :x1="pad"
            :y1="toSvgY(0)"
            :x2="width - pad"
            :y2="toSvgY(0)"
            stroke="var(--color-text)"
            stroke-width="1.5"
          />
          <line
            :x1="toSvgX(0)"
            :y1="pad"
            :x2="toSvgX(0)"
            :y2="height - pad"
            stroke="var(--color-text)"
            stroke-width="1.5"
          />
          <text
            v-for="t in xTicks"
            :key="'xl' + t"
            :x="toSvgX(t)"
            :y="toSvgY(0) + 16"
            text-anchor="middle"
            font-size="10"
            fill="var(--color-muted)"
          >
            {{ tickLabel(t) }}
          </text>
          <line
            v-if="analysis.ok"
            :x1="pad"
            :y1="toSvgY(analysis.D)"
            :x2="width - pad"
            :y2="toSvgY(analysis.D)"
            stroke="var(--color-muted)"
            stroke-width="1.5"
            stroke-dasharray="6 4"
          />
          <line
            v-for="(ax, i) in asymptoteXs"
            :key="'as' + i"
            :x1="toSvgX(ax)"
            :y1="pad"
            :x2="toSvgX(ax)"
            :y2="height - pad"
            stroke="#e11d48"
            stroke-width="1.25"
            stroke-dasharray="5 4"
            opacity="0.85"
          />
          <path
            v-for="(d, i) in pathDs"
            :key="'path' + i"
            :d="d"
            fill="none"
            stroke="var(--color-primary)"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <g v-for="(pt, i) in keyPoints" :key="'kp' + i">
            <circle
              v-if="pt.kind === 'point' && pt.y != null && Math.abs(pt.y) <= yMax"
              :cx="toSvgX(pt.x)"
              :cy="toSvgY(pt.y)"
              r="5"
              fill="var(--color-primary)"
              stroke="#fff"
              stroke-width="1.5"
            >
              <title>({{ formatPiLatex(pt.x).replace(/\\/g, '') }}, {{ pt.y }})</title>
            </circle>
            <text
              v-if="pt.kind === 'point' && pt.y != null && Math.abs(pt.y) <= yMax"
              :x="toSvgX(pt.x) + 6"
              :y="toSvgY(pt.y) - 8"
              font-size="9"
              fill="var(--color-text)"
            >
              {{ i }}
            </text>
          </g>
        </svg>
      </div>

      <div class="theme-card space-y-4 border border-black/5 bg-[var(--color-panel)] p-4 shadow-sm">
        <p class="text-sm font-semibold text-[var(--color-muted)]">Step-by-step solution</p>
        <template v-if="analysis.ok">
          <div
            v-for="step in analysis.steps"
            :key="step.title"
            class="rounded-[var(--radius-card)] border border-black/5 bg-[var(--color-surface)] p-3"
          >
            <h3 class="display text-base font-bold text-[var(--color-primary)]">{{ step.title }}</h3>
            <div
              v-if="step.latex"
              class="mt-2 overflow-x-auto text-[var(--color-text)]"
              v-html="renderKatex(step.latex, true)"
            />
            <div
              v-if="step.extraLatex"
              class="mt-2 overflow-x-auto text-[var(--color-text)]"
              v-html="renderKatex(step.extraLatex, true)"
            />
            <p v-if="step.note" class="mt-2 text-sm text-[var(--color-muted)]">{{ step.note }}</p>
            <div v-if="step.table" class="mt-3 overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b border-black/10 text-[var(--color-muted)]">
                    <th class="py-1 pr-2">#</th>
                    <th class="py-1 pr-2">Point / Asymptote</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(pt, i) in analysis.keyPoints"
                    :key="'row' + i"
                    class="border-b border-black/5"
                  >
                    <td class="py-1.5 pr-2 font-semibold">{{ i }}</td>
                    <td class="py-1.5" v-html="renderKatex(pt.label)" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
        <p v-else class="text-sm text-[var(--color-muted)]">
          Enter a valid equation to see the analysis steps.
        </p>
      </div>
    </div>
  </div>
</template>
