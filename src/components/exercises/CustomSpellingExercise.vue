<script setup>
import { computed, ref } from 'vue'
import { clearPracticeMastery } from '../../composables/useTwoPassRound'
import SpellingExercise from './SpellingExercise.vue'

const STORAGE_KEY = 'levelup_custom_spelling_words'
const MASTERY_SCOPE = 'custom-spelling-jutsu'
const MIN_WORDS = 3

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['answered'])

function emptyRow() {
  return { word: '', definition: '' }
}

function loadStoredWords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.word === 'string' &&
          item.word.trim() &&
          typeof item.definition === 'string',
      )
      .map((item, index) => ({
        id: typeof item.id === 'string' && item.id ? item.id : slugId(item.word, index),
        word: item.word.trim(),
        definition: item.definition.trim(),
      }))
  } catch {
    return []
  }
}

function persistWords(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Private mode or full disk should not break the session.
  }
}

function slugId(word, index) {
  const slug = String(word)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'word'}-${index}`
}

function toDraftRows(list) {
  if (!list.length) return [emptyRow(), emptyRow(), emptyRow()]
  return list.map((item) => ({ word: item.word, definition: item.definition }))
}

const sealedWords = ref(loadStoredWords())
const mode = ref(sealedWords.value.length >= MIN_WORDS ? 'drill' : 'setup')
const rows = ref(toDraftRows(sealedWords.value))
const bulkOpen = ref(false)
const bulkText = ref('')
const setupError = ref('')
const drillKey = ref(0)

const validRows = computed(() =>
  rows.value
    .map((row) => ({
      word: row.word.trim(),
      definition: row.definition.trim(),
    }))
    .filter((row) => row.word),
)

const canSeal = computed(() => validRows.value.length >= MIN_WORDS)

const drillExercise = computed(() => ({
  ...props.exercise,
  words: sealedWords.value,
}))

function addRow() {
  rows.value.push(emptyRow())
}

function removeRow(index) {
  if (rows.value.length <= 1) {
    rows.value[0] = emptyRow()
    return
  }
  rows.value.splice(index, 1)
}

function parseBulkLine(line) {
  const trimmed = line.trim()
  if (!trimmed) return null
  const dashMatch = trimmed.match(/^(.+?)\s+-\s+(.+)$/)
  if (dashMatch) {
    return { word: dashMatch[1].trim(), definition: dashMatch[2].trim() }
  }
  const commaIndex = trimmed.indexOf(',')
  if (commaIndex > 0) {
    return {
      word: trimmed.slice(0, commaIndex).trim(),
      definition: trimmed.slice(commaIndex + 1).trim(),
    }
  }
  return { word: trimmed, definition: '' }
}

function applyBulkImport() {
  const parsed = bulkText.value
    .split(/\r?\n/)
    .map(parseBulkLine)
    .filter((row) => row && row.word)
  if (!parsed.length) {
    setupError.value = 'Paste at least one line like: word - definition'
    return
  }
  rows.value = parsed
  bulkText.value = ''
  bulkOpen.value = false
  setupError.value = ''
}

function sealScroll() {
  if (!canSeal.value) {
    setupError.value = `Add at least ${MIN_WORDS} words before sealing the scroll.`
    return
  }
  const list = validRows.value.map((row, index) => ({
    id: slugId(row.word, index),
    word: row.word,
    definition: row.definition,
  }))
  const prevIds = sealedWords.value.map((item) => item.id).join('|')
  const nextIds = list.map((item) => item.id).join('|')
  if (prevIds !== nextIds) {
    clearPracticeMastery(MASTERY_SCOPE)
  }
  sealedWords.value = list
  persistWords(list)
  rows.value = toDraftRows(list)
  setupError.value = ''
  drillKey.value += 1
  mode.value = 'drill'
}

function editScroll() {
  rows.value = toDraftRows(sealedWords.value)
  setupError.value = ''
  mode.value = 'setup'
}

function resetScroll() {
  const confirmed = window.confirm(
    'Reset this scroll? Your custom words and custom jutsu progress will be cleared.',
  )
  if (!confirmed) return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
  clearPracticeMastery(MASTERY_SCOPE)
  sealedWords.value = []
  rows.value = toDraftRows([])
  bulkText.value = ''
  bulkOpen.value = false
  setupError.value = ''
  drillKey.value += 1
  mode.value = 'setup'
}

function onAnswered(result) {
  emit('answered', result)
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="mode === 'drill'"
      class="theme-card flex flex-wrap items-center justify-between gap-3 border border-[var(--color-border)] bg-[#0b0f17] p-3 sm:p-4"
    >
      <p class="text-sm font-semibold text-[#f97316]">Custom scroll sealed · {{ sealedWords.length }} words</p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
          @click="editScroll"
        >
          Edit Scroll
        </button>
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center border border-[#f97316]/60 px-4 py-2 text-sm font-semibold text-[#f97316]"
          @click="resetScroll"
        >
          Reset Scroll
        </button>
      </div>
    </div>

    <div
      v-if="mode === 'setup'"
      class="theme-card space-y-5 border border-[#f97316]/40 bg-[#0b0f17] p-4 sm:p-6"
    >
      <div class="space-y-1">
        <h2 class="display text-2xl tracking-wide text-[#f97316] sm:text-3xl">Forge Your Scroll</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Enter at least {{ MIN_WORDS }} words with definitions, then seal the scroll to begin jutsu
          training.
        </p>
      </div>

      <ul class="space-y-3">
        <li
          v-for="(row, index) in rows"
          :key="index"
          class="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        >
          <label class="block space-y-1 text-sm font-semibold text-[var(--color-text)]">
            Word
            <input
              v-model="row.word"
              type="text"
              autocomplete="off"
              class="min-h-11 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[#0b0f17] px-3 py-2 font-normal text-[var(--color-text)] outline-none focus:border-[#f97316]"
              :aria-label="`Word ${index + 1}`"
            />
          </label>
          <label class="block space-y-1 text-sm font-semibold text-[var(--color-text)]">
            Definition / Sentence Hint
            <input
              v-model="row.definition"
              type="text"
              autocomplete="off"
              class="min-h-11 w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[#0b0f17] px-3 py-2 font-normal text-[var(--color-text)] outline-none focus:border-[#f97316]"
              :aria-label="`Definition ${index + 1}`"
            />
          </label>
          <button
            type="button"
            class="theme-pill inline-flex min-h-11 items-center justify-center border border-[var(--color-border)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)]"
            :aria-label="`Remove word ${index + 1}`"
            @click="removeRow(index)"
          >
            ✕
          </button>
        </li>
      </ul>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center border border-[#f97316]/50 px-4 py-2 text-sm font-semibold text-[#f97316]"
          @click="addRow"
        >
          Add Word
        </button>
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
          @click="bulkOpen = !bulkOpen"
        >
          {{ bulkOpen ? 'Hide Bulk Import' : 'Bulk Import' }}
        </button>
        <button
          v-if="sealedWords.length"
          type="button"
          class="theme-pill inline-flex min-h-11 items-center border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-muted)]"
          @click="resetScroll"
        >
          Reset Scroll
        </button>
      </div>

      <div
        v-if="bulkOpen"
        class="space-y-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-panel)] p-3 sm:p-4"
      >
        <p class="text-sm text-[var(--color-muted)]">
          Paste one entry per line as <code class="text-[#f97316]">word - definition</code> or
          <code class="text-[#f97316]">word, definition</code>.
        </p>
        <textarea
          v-model="bulkText"
          rows="5"
          class="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[#0b0f17] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[#f97316]"
          placeholder="ancient - very old&#10;courage, bravery when something is frightening"
        />
        <button
          type="button"
          class="theme-pill inline-flex min-h-11 items-center bg-[#f97316] px-4 py-2 text-sm font-semibold text-white"
          @click="applyBulkImport"
        >
          Apply Import
        </button>
      </div>

      <p v-if="setupError" class="text-sm font-semibold text-[#ff6b6b]" role="alert">
        {{ setupError }}
      </p>

      <button
        type="button"
        class="theme-pill inline-flex min-h-11 w-full items-center justify-center bg-[#f97316] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto"
        :disabled="!canSeal"
        @click="sealScroll"
      >
        Seal the Scroll &amp; Begin Jutsu
      </button>
    </div>

    <SpellingExercise
      v-else
      :key="drillKey"
      :exercise="drillExercise"
      :mastery-scope="MASTERY_SCOPE"
      :award-scroll-xp="false"
      @answered="onAnswered"
    />
  </div>
</template>
