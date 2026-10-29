<script setup>
import IdentitiesReferenceDesk from './trig-verifying/IdentitiesReferenceDesk.vue'
import SinCosStrategy from './trig-verifying/SinCosStrategy.vue'
import FactoringStrategy from './trig-verifying/FactoringStrategy.vue'
import FractionsStrategy from './trig-verifying/FractionsStrategy.vue'
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-10">
    <p class="text-sm text-[var(--color-muted)]">
      Verifying an identity means showing both sides are algebraically the same. Keep your toolkit handy,
      then practice the three strategies that unlock most textbook proofs.
    </p>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">1. Fundamental Identities Reference Desk</h3>
        <p class="text-sm text-[var(--color-muted)]">
          Before you prove anything, know which tool to reach for. Toggle a category to review the core formulas.
        </p>
      </header>
      <IdentitiesReferenceDesk />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">2. Strategy: Change to Sines and Cosines</h3>
        <p class="text-sm text-[var(--color-muted)]">
          When the identity looks stuck, rewrite every function as sine or cosine. Shared factors often cancel and
          the proof opens up.
        </p>
      </header>
      <SinCosStrategy />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">3. Strategy: Factoring and Pythagorean Substitution</h3>
        <p class="text-sm text-[var(--color-muted)]">
          Squared terms or a repeated factor are clues. Factor first, then swap in a Pythagorean identity.
        </p>
      </header>
      <FactoringStrategy />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">4. Strategy: Combining Fractional Expressions</h3>
        <p class="text-sm text-[var(--color-muted)]">
          Separate fractions usually need an LCD. Expand the numerator, clean it with Pythagorean, then cancel.
        </p>
      </header>
      <FractionsStrategy />
    </section>
  </div>
</template>
