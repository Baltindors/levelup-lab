<script setup>
import { computed, ref } from 'vue'
import { renderKatex } from '../../../utils/mathKatex'

const presets = [
  { label: 'Large distance', value: 420000 },
  { label: 'Hydrogen radius', value: 0.000000000025 },
  { label: 'Custom', value: null },
]

const activePreset = ref(0)
const customValue = ref('2500000')
const shift = ref(0)

const original = computed(() => {
  if (presets[activePreset.value].value != null) return presets[activePreset.value].value
  const parsed = Number(customValue.value)
  return Number.isFinite(parsed) ? parsed : 0
})

/**
 * Format a number as a fixed decimal digit string with no e-notation and no ×10^n.
 * Uses exponential parts only to recover digits, then places the decimal explicitly
 * (critical for values like 2.5e-11 → 0.000000000025).
 */
function formatPlain(value) {
  if (!Number.isFinite(value)) return '0'
  if (value === 0) return '0'

  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const expStr = abs.toExponential(15)
  const [coeffPart, expPart] = expStr.split('e')
  const exp = Number(expPart)
  const [whole, frac = ''] = coeffPart.split('.')
  let digits = `${whole}${frac}`.replace(/0+$/, '')
  if (!digits) digits = '0'

  const pointPos = whole.length + exp

  let body
  if (pointPos <= 0) {
    body = `0.${'0'.repeat(-pointPos)}${digits}`
  } else if (pointPos >= digits.length) {
    body = `${digits}${'0'.repeat(pointPos - digits.length)}`
  } else {
    body = `${digits.slice(0, pointPos)}.${digits.slice(pointPos)}`
  }

  if (body.includes('.')) {
    body = body.replace(/\.?0+$/, '')
  }

  return sign + (body || '0')
}

function normalizeScientific(n) {
  const sign = n < 0 ? -1 : 1
  let abs = Math.abs(n)
  let naturalExp = 0

  while (abs >= 10) {
    abs /= 10
    naturalExp += 1
  }
  while (abs > 0 && abs < 1) {
    abs *= 10
    naturalExp -= 1
  }

  // Clean float noise on the scientific mantissa itself.
  abs = Number(abs.toPrecision(8))
  return { sign, sciMantissa: abs, naturalExp }
}

const analysis = computed(() => {
  const n = original.value
  if (!Number.isFinite(n) || n === 0) {
    return {
      mantissa: 0,
      mantissaPlain: '0',
      exponent: 0,
      latex: '0 = 0 \\times 10^{0}',
      inScientific: false,
    }
  }

  const { sign, sciMantissa, naturalExp } = normalizeScientific(n)
  const exponent = naturalExp + shift.value

  // Shift decimal opposite to power change; round before render + badge.
  let mantissa = sciMantissa * 10 ** -shift.value
  mantissa = Number(mantissa.toPrecision(8))
  const signedMantissa = sign * mantissa
  const absMantissa = Math.abs(mantissa)
  const inScientific = absMantissa >= 1 && absMantissa < 10

  const latex = `${formatPlain(n)} = ${formatPlain(signedMantissa)} \\times 10^{${exponent}}`

  return {
    mantissa: signedMantissa,
    mantissaPlain: formatPlain(signedMantissa),
    exponent,
    naturalExp,
    latex,
    inScientific,
  }
})

function selectPreset(index) {
  activePreset.value = index
  shift.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-muted)]">
      Move the decimal left or right and watch the power of 10 change so equality is preserved —
      including microscopic values like the hydrogen radius
      <span v-html="renderKatex('$2.5\\times 10^{-11}$')" />.
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="(preset, index) in presets"
        :key="preset.label"
        type="button"
        class="theme-pill px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
        :class="
          activePreset === index
            ? 'bg-[var(--color-primary)] text-white'
            : 'border border-[var(--color-border)] text-[var(--color-primary)]'
        "
        @click="selectPreset(index)"
      >
        {{ preset.label }}
      </button>
    </div>

    <label v-if="activePreset === 2" class="block text-sm">
      <span class="font-semibold text-[var(--color-muted)]">Custom number</span>
      <input
        v-model="customValue"
        type="text"
        class="mt-1 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 font-mono text-[var(--color-text)]"
      />
    </label>

    <label class="block text-sm">
      <span class="font-semibold text-[var(--color-muted)]">
        Exponent shift: {{ shift }}
      </span>
      <input
        v-model.number="shift"
        type="range"
        min="-12"
        max="12"
        step="1"
        class="mt-2 w-full"
      />
      <div class="mt-1 flex justify-between text-xs text-[var(--color-muted)]">
        <span>More negative 10ⁿ</span>
        <span>Scientific sweet spot</span>
        <span>Larger 10ⁿ</span>
      </div>
    </label>

    <div class="rounded-[var(--radius-card)] border border-black/10 bg-[var(--color-panel)] p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        Live equality
      </p>
      <div class="mt-2 overflow-x-auto text-lg" v-html="renderKatex('$' + analysis.latex + '$', true)" />
      <p class="mt-3 text-sm text-[var(--color-muted)]">
        Mantissa:
        <span class="font-mono text-[var(--color-text)]">{{ analysis.mantissaPlain }}</span>
        · Power:
        <span class="font-mono text-[var(--color-text)]">10^{{ analysis.exponent }}</span>
      </p>
      <p
        v-if="analysis.inScientific"
        class="mt-2 inline-flex rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-300"
      >
        Valid Scientific Notation (1 ≤ a &lt; 10)
      </p>
      <p
        v-else
        class="mt-2 inline-flex rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-200"
      >
        Equivalent Form (Non-Standard)
      </p>
    </div>
  </div>
</template>
