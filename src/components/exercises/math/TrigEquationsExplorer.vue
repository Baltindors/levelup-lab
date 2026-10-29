<script setup>
import { renderKatex } from '../../../utils/mathKatex'
import LinearEquationSolver from './trig-equations/LinearEquationSolver.vue'
import FactoringTrap from './trig-equations/FactoringTrap.vue'
import IdentitySubstitution from './trig-equations/IdentitySubstitution.vue'
</script>

<template>
  <div id="explorer" class="min-w-0 space-y-10">
    <p class="text-sm text-[var(--color-muted)]">
      Solving trig equations means isolating a function, factoring carefully (never dividing away
      solutions), and using identities when angles do not match. Work each strategy below.
    </p>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">
          1. Isolating the Function &amp; Periodic Solutions
        </h3>
        <p
          class="text-sm text-[var(--color-muted)]"
          v-html="
            renderKatex(
              'Treat the trig function like an algebraic variable until it is isolated. Then find angles in $[0, 2\\pi)$ and add $+2n\\pi$ for all solutions.',
            )
          "
        />
      </header>
      <LinearEquationSolver />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">
          2. Quadratic Form &amp; The Factoring Trap
        </h3>
        <p class="text-sm text-[var(--color-muted)]">
          Squared or product equations need factoring or square roots. Dividing by a trig function
          throws away zeros — factor instead.
        </p>
      </header>
      <FactoringTrap />
    </section>

    <section class="space-y-3">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-[var(--color-text)]">3. Using Identities to Solve</h3>
        <p class="text-sm text-[var(--color-muted)]">
          When angles or functions disagree, rewrite with an identity until everything matches, then
          factor and solve.
        </p>
      </header>
      <IdentitySubstitution />
    </section>
  </div>
</template>
