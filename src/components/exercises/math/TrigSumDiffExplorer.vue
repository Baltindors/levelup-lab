<script setup>
import { renderKatex } from '../../../utils/mathKatex'
import AngleSplitter from './trig-sum-diff/AngleSplitter.vue'
import TwoTriangleProblem from './trig-sum-diff/TwoTriangleProblem.vue'
import SumDiffIdentity from './trig-sum-diff/SumDiffIdentity.vue'
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-10">
    <p class="text-sm text-[var(--color-muted)]">
      Sum and difference formulas let you evaluate awkward angles, combine two unknown angles from
      their ratios, and simplify identities. Work each strategy below with reveal-step walkthroughs.
    </p>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">1. Angle Decomposition</h3>
        <p
          class="text-sm text-[var(--color-muted)]"
          v-html="
            renderKatex(
              'Exact values for “weird” angles come from writing them as a sum or difference of standard unit-circle angles like $30^\\circ$, $45^\\circ$, and $60^\\circ$.',
            )
          "
        />
      </header>
      <AngleSplitter />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">2. The Two-Triangle Problem</h3>
        <p class="text-sm text-[var(--color-muted)]">
          When you know ratios and quadrants—but not the angle measures—rebuild each triangle, attach
          the correct signs, then expand the sum or difference formula.
        </p>
      </header>
      <TwoTriangleProblem />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">3. Identity Verification</h3>
        <p class="text-sm text-[var(--color-muted)]">
          Expand with a sum or difference formula, insert known exact values, and cancel to verify
          an identity.
        </p>
      </header>
      <SumDiffIdentity />
    </section>
  </div>
</template>
