<script setup>
import { renderKatex } from '../../../utils/mathKatex'
import DoubleAngleBuilder from './trig-double-half/DoubleAngleBuilder.vue'
import PowerReducingStepDown from './trig-double-half/PowerReducingStepDown.vue'
import HalfAngleSignTrap from './trig-double-half/HalfAngleSignTrap.vue'
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-10">
    <p
      class="text-sm text-[var(--color-muted)]"
      v-html="
        renderKatex(
          'Double-angle formulas scale a known ratio to $2\\theta$, power-reducing trades squares for double angles, and half-angle formulas demand a careful $\\pm$ choice from the half-angle’s quadrant.',
        )
      "
    />

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">1. Double-Angle Formulas</h3>
        <p class="text-sm text-[var(--color-muted)]">
          Find trigonometric values for an angle twice as large as a known angle — without knowing the
          angle’s measure — by rebuilding the reference triangle and expanding.
        </p>
      </header>
      <DoubleAngleBuilder />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">2. Power-Reducing Formulas</h3>
        <p
          class="text-sm text-[var(--color-muted)]"
          v-html="
            renderKatex(
              'Equations with $\\sin^2\\theta$ or $\\cos^2\\theta$ are hard to solve or graph. These formulas trade a high power for a double angle.',
            )
          "
        />
      </header>
      <PowerReducingStepDown />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">
          3. Half-Angle Formulas and the Plus-or-Minus Trap
        </h3>
        <p
          class="text-sm text-[var(--color-muted)]"
          v-html="
            renderKatex(
              'Half-angle formulas look like they offer two answers. They do not — the sign comes from the quadrant of $\\dfrac{\\alpha}{2}$.',
            )
          "
        />
      </header>
      <HalfAngleSignTrap />
    </section>
  </div>
</template>
