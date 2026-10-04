<script setup>
import { ref } from 'vue'

defineProps({
  rankTitle: { type: String, required: true },
  level: { type: Number, required: true },
  xpDelta: { type: Number, default: 100 },
  fromLevel: { type: Number, default: null },
})

const emit = defineEmits(['claim'])

const open = ref(true)

function onClaim() {
  if (!open.value) return
  open.value = false
}

function onAfterLeave() {
  emit('claim')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="shinobi-level-up" appear @after-leave="onAfterLeave">
      <div
        v-if="open"
        class="theme-grade-5 display fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shinobi-level-up-title"
      >
        <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />

        <div class="level-up-glow pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true" />
        <div class="level-up-rays pointer-events-none absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax]" aria-hidden="true" />
        <div class="level-up-ring level-up-ring--a pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true" />
        <div class="level-up-ring level-up-ring--b pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true" />

        <div class="level-up-content relative z-10 w-full max-w-md space-y-5 text-center">
          <p
            class="level-up-stagger level-up-stagger--1 display text-xs font-black uppercase italic tracking-[0.22em] text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.85)] sm:text-sm"
          >
            ✦ SHINOBI RANK ADVANCEMENT ✦
          </p>

          <h2
            id="shinobi-level-up-title"
            class="level-up-stagger level-up-stagger--2 level-up-title display text-6xl font-black uppercase italic tracking-wider sm:text-7xl"
          >
            LEVEL UP!
          </h2>

          <p
            class="level-up-stagger level-up-stagger--3 display text-xl font-black uppercase italic tracking-wider text-[var(--color-accent)] drop-shadow-[0_0_10px_rgba(0,229,255,0.55)] sm:text-2xl"
          >
            {{ rankTitle }}
            <span class="text-amber-200">• LEVEL {{ level }}</span>
          </p>
          <p
            v-if="fromLevel != null && fromLevel < level"
            class="level-up-stagger level-up-stagger--3 text-xs uppercase tracking-wide text-slate-300"
          >
            Advanced from Level {{ fromLevel }}
          </p>

          <div
            class="level-up-stagger level-up-stagger--4 mx-auto space-y-2.5 rounded-lg border border-cyan-500/30 bg-slate-900/80 px-4 py-4 text-left text-sm text-slate-100 shadow-[0_0_28px_rgba(0,229,255,0.22)]"
          >
            <p class="flex items-start gap-2 font-semibold">
              <span class="text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" aria-hidden="true">✦</span>
              <span class="text-amber-200">+{{ xpDelta }} Academy XP Claimed</span>
            </p>
            <p class="flex items-start gap-2">
              <span class="text-cyan-300 drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" aria-hidden="true">✦</span>
              <span>Scroll Trial Mastered</span>
            </p>
            <p class="flex items-start gap-2">
              <span class="text-cyan-300 drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" aria-hidden="true">✦</span>
              <span>Chakra aura visual upgrade unlocked</span>
            </p>
          </div>

          <button
            type="button"
            class="math-btn math-btn--primary level-up-stagger level-up-stagger--5 level-up-claim w-full max-w-xs px-5 py-3 text-base font-black uppercase tracking-wide"
            @click="onClaim"
          >
            Claim Rank &amp; Continue →
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Teleported outside .app-shell — force display font from theme tokens */
.theme-grade-5.display,
.theme-grade-5 .display {
  font-family: var(--font-display);
}

.level-up-title {
  color: #ffe566;
  text-shadow:
    0 0 4px #fff8c8,
    0 0 14px rgba(255, 200, 50, 0.95),
    0 0 28px rgba(255, 94, 30, 0.75),
    0 0 48px rgba(0, 229, 255, 0.35);
}

.level-up-glow {
  height: min(70vw, 320px);
  width: min(70vw, 320px);
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(0, 229, 255, 0.35) 0%,
    rgba(255, 170, 0, 0.18) 42%,
    transparent 70%
  );
  filter: blur(4px);
  animation: level-up-glow-pulse 2.2s ease-in-out infinite;
}

.level-up-rays {
  background: repeating-conic-gradient(
    from 0deg,
    rgba(0, 229, 255, 0.14) 0deg 3deg,
    transparent 3deg 12deg,
    rgba(255, 170, 0, 0.1) 12deg 15deg,
    transparent 15deg 24deg
  );
  mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.55) 0%, transparent 62%);
  opacity: 0.55;
  animation: level-up-spin 22s linear infinite;
}

.level-up-ring {
  border-radius: 9999px;
  border: 2px solid rgba(0, 229, 255, 0.4);
  box-shadow: 0 0 28px rgba(0, 229, 255, 0.4);
  transform: translate(-50%, -50%);
  animation: level-up-pulse 2.4s ease-out infinite;
}

.level-up-ring--a {
  height: min(70vw, 280px);
  width: min(70vw, 280px);
}

.level-up-ring--b {
  height: min(95vw, 380px);
  width: min(95vw, 380px);
  animation-delay: 0.8s;
  border-color: rgba(251, 191, 36, 0.35);
  box-shadow: 0 0 28px rgba(251, 191, 36, 0.3);
}

.level-up-claim {
  background-image: linear-gradient(90deg, #f59e0b, #ea580c) !important;
  color: #0f172a !important;
  box-shadow:
    0 0 18px rgba(245, 158, 11, 0.55),
    0 0 4px rgba(255, 255, 255, 0.35);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.level-up-claim:hover {
  transform: scale(1.03);
  box-shadow:
    0 0 26px rgba(245, 158, 11, 0.75),
    0 0 8px rgba(255, 255, 255, 0.45);
}

/* Transition: whole overlay */
.shinobi-level-up-enter-active {
  transition: opacity 0.35s ease-out;
}

.shinobi-level-up-leave-active {
  transition: opacity 0.3s ease-in;
}

.shinobi-level-up-enter-active .level-up-content {
  animation: level-up-slam 0.55s cubic-bezier(0.2, 1.55, 0.35, 1) both;
}

.shinobi-level-up-leave-active .level-up-content {
  transition:
    opacity 0.3s ease-in,
    transform 0.3s ease-in;
}

.shinobi-level-up-enter-from {
  opacity: 0;
}

.shinobi-level-up-leave-to {
  opacity: 0;
}

.shinobi-level-up-leave-to .level-up-content {
  opacity: 0;
  transform: scale(0.95);
}

.shinobi-level-up-enter-active .level-up-stagger {
  animation: level-up-rise 0.45s ease-out both;
}

.shinobi-level-up-enter-active .level-up-stagger--1 {
  animation-delay: 0.08s;
}

.shinobi-level-up-enter-active .level-up-stagger--2 {
  animation-delay: 0.16s;
}

.shinobi-level-up-enter-active .level-up-stagger--3 {
  animation-delay: 0.24s;
}

.shinobi-level-up-enter-active .level-up-stagger--4 {
  animation-delay: 0.32s;
}

.shinobi-level-up-enter-active .level-up-stagger--5 {
  animation-delay: 0.4s;
}

@keyframes level-up-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes level-up-pulse {
  0% {
    opacity: 0.85;
    transform: translate(-50%, -50%) scale(0.72);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.25);
  }
}

@keyframes level-up-glow-pulse {
  0%,
  100% {
    opacity: 0.75;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }
}

@keyframes level-up-slam {
  0% {
    opacity: 0;
    transform: scale(1.25);
  }
  70% {
    opacity: 1;
    transform: scale(0.97);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes level-up-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
