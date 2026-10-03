<script>
// Survives remounts so a new intro can cut off a previous ~4s clip.
let activeTransitionAudio = null
</script>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  missionTitle: { type: String, default: 'MISSION START' },
  subTitle: { type: String, default: 'SHINOBI TRAINING' },
})

const emit = defineEmits(['complete'])

const isExiting = ref(false)
const showTitle = ref(false)

const timers = []
let keyHandler = null

function stopImpactSound() {
  if (!activeTransitionAudio) return
  try {
    activeTransitionAudio.pause()
    activeTransitionAudio.currentTime = 0
  } catch {
    // Ignore pause failures.
  }
  activeTransitionAudio = null
}

function playImpactSound() {
  stopImpactSound()
  try {
    const audio = new Audio(
      `${import.meta.env.BASE_URL}sounds/transition_sound_effects_1.mp3`,
    )
    audio.preload = 'auto'
    audio.volume = 0.9
    activeTransitionAudio = audio
    audio.addEventListener(
      'ended',
      () => {
        if (activeTransitionAudio === audio) activeTransitionAudio = null
      },
      { once: true },
    )
    const playPromise = audio.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay may be blocked until a user gesture; click/key skip still works.
      })
    }
  } catch {
    // Audio playback unavailable.
  }
}

function triggerExit() {
  if (isExiting.value) return
  isExiting.value = true
  timers.push(
    setTimeout(() => {
      emit('complete')
    }, 320),
  )
}

function onKeydown(event) {
  if (event.key === ' ' || event.key === 'Enter' || event.key === 'Escape') {
    if (event.key === ' ' || event.key === 'Enter') event.preventDefault()
    triggerExit()
  }
}

onMounted(() => {
  playImpactSound()
  keyHandler = onKeydown
  window.addEventListener('keydown', keyHandler)

  timers.push(
    setTimeout(() => {
      showTitle.value = true
    }, 200),
  )

  timers.push(
    setTimeout(() => {
      triggerExit()
    }, 1300),
  )
})

onUnmounted(() => {
  timers.forEach((id) => clearTimeout(id))
  timers.length = 0
  if (keyHandler) {
    window.removeEventListener('keydown', keyHandler)
    keyHandler = null
  }
  // Do not stop activeTransitionAudio here — let the ~4s SFX finish after
  // the visual exit. The next intro call to playImpactSound() will replace it.
})
</script>

<template>
  <Teleport to="body">
    <div
      class="theme-grade-5 shinobi-versus-intro display fixed inset-0 z-50 flex cursor-pointer select-none items-center justify-center overflow-hidden"
      title="Click to skip"
      @click="triggerExit"
    >
      <div class="pointer-events-none absolute inset-0 z-30 bg-cyan-200 anim-vs-flash" />

      <div
        :class="[
          'absolute inset-0 z-10 bg-gradient-to-br from-orange-600 via-orange-800 to-[#1a120c]',
          isExiting ? 'anim-vs-exit-l' : 'anim-vs-door-l',
        ]"
        style="clip-path: polygon(0 0, 65% 0, 35% 100%, 0 100%)"
      >
        <div class="speedlines h-full w-full opacity-20" />
      </div>

      <div
        :class="[
          'absolute inset-0 z-10 bg-gradient-to-tl from-[#0a0c10] via-[#121620] to-[#1a2233]',
          isExiting ? 'anim-vs-exit-r' : 'anim-vs-door-r',
        ]"
        style="clip-path: polygon(65% 0, 100% 0, 100% 100%, 35% 100%)"
      >
        <div class="speedlines h-full w-full opacity-25" />
      </div>

      <svg
        class="pointer-events-none absolute inset-0 z-20 h-full w-full drop-shadow-[0_0_12px_#00e5ff]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 65 0 L 58 28 L 62 31 L 49 60 L 53 63 L 35 100"
          fill="none"
          stroke="#00e5ff"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="anim-vs-lightning"
        />
        <path
          d="M 65 0 L 58 28 L 62 31 L 49 60 L 53 63 L 35 100"
          fill="none"
          stroke="#ffffff"
          stroke-width="0.5"
          class="anim-vs-lightning"
        />
      </svg>

      <div
        v-if="showTitle"
        :class="[
          'relative z-30 flex flex-col items-center justify-center px-4 text-center tracking-wider anim-vs-title',
          isExiting ? 'opacity-0 transition-opacity duration-200' : '',
        ]"
      >
        <div
          class="ninja-tag mb-2 bg-cyan-400 px-6 py-1 text-xs font-black text-black shadow-lg sm:text-sm"
        >
          {{ subTitle.toUpperCase() }}
        </div>

        <h1
          class="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-4xl font-black text-transparent drop-shadow-[0_4px_16px_rgba(255,94,30,0.85)] sm:text-6xl md:text-7xl"
        >
          {{ missionTitle.toUpperCase() }}
        </h1>

        <div
          class="mt-2 font-mono text-[11px] uppercase tracking-widest text-cyan-300 opacity-80 sm:text-xs"
        >
          BATTLE STANCE READY • TAP TO SKIP
        </div>
      </div>
    </div>
  </Teleport>
</template>
