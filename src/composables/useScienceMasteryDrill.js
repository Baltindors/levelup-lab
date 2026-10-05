import { computed, ref, unref } from 'vue'

const STORAGE_KEY = 'shinobi_science_mastery_earth_systems_v1'
const POOL_SIZE = 25
const MASTERY_STREAK = 2

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Round-robin sample across topic buckets so rounds cover unmastered topics.
 * @param {Array} list
 * @param {number} count
 * @param {string} key
 */
function sampleStratified(list, count, key) {
  const buckets = new Map()
  for (const item of list) {
    const bucketKey = item?.[key] ?? '__default__'
    if (!buckets.has(bucketKey)) buckets.set(bucketKey, [])
    buckets.get(bucketKey).push(item)
  }

  const queues = [...buckets.values()].map((bucket) => shuffle(bucket))
  if (!queues.length) return []

  const picked = []
  let guard = 0
  while (picked.length < count && guard < count * 20) {
    guard += 1
    let progressed = false
    for (const queue of queues) {
      if (picked.length >= count) break
      if (!queue.length) continue
      picked.push(queue.shift())
      progressed = true
    }
    if (!progressed) break
  }

  return shuffle(picked)
}

function defaultRecord() {
  return { correctStreak: 0, attempts: 0, mastered: false }
}

function loadMasteryMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function persistMasteryMap(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Keep working from in-memory state if storage is unavailable.
  }
}

function clearPersistedMastery() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage failures; in-memory reset still applies.
  }
}

/**
 * 2-correct-streak mastery engine for Earth Systems science drills.
 * @param {import('vue').MaybeRefOrGetter<Array>} questionPool
 */
export function useScienceMasteryDrill(questionPool) {
  const masteryById = ref(loadMasteryMap())
  const currentRoundQuestions = ref([])
  const currentCardIndex = ref(0)
  const isRoundComplete = ref(false)

  const pool = () => {
    const value = typeof questionPool === 'function' ? questionPool() : unref(questionPool)
    return Array.isArray(value) ? value : []
  }

  const getRecord = (questionId) => {
    return masteryById.value[questionId] ?? defaultRecord()
  }

  /** Reactive-friendly lookup — read after accessing masteryById in a computed. */
  function getQuestionMastery(questionId) {
    if (!questionId) return defaultRecord()
    return getRecord(questionId)
  }

  const ensureRecord = (questionId) => {
    if (!masteryById.value[questionId]) {
      masteryById.value = {
        ...masteryById.value,
        [questionId]: defaultRecord(),
      }
    }
    return masteryById.value[questionId]
  }

  const unmasteredPool = () => {
    return pool().filter((q) => !getRecord(q.id).mastered)
  }

  const masteredCount = computed(() => {
    const source = pool()
    const total = source.length || POOL_SIZE
    let count = 0
    for (const q of source) {
      if (getRecord(q.id).mastered) count += 1
    }
    // Also count orphan mastery entries only if they match pool ids — pool is source of truth.
    return Math.min(count, total)
  })

  const masteryPercentage = computed(() => {
    const total = pool().length || POOL_SIZE
    if (!total) return 0
    return Math.round((masteredCount.value / total) * 100)
  })

  const isMissionComplete = computed(() => {
    const source = pool()
    if (!source.length) return false
    return masteredCount.value === source.length
  })

  const currentQuestion = computed(
    () => currentRoundQuestions.value[currentCardIndex.value] ?? null,
  )

  function startNewRound(roundSize = 10) {
    const active = unmasteredPool()
    const limit = Math.min(roundSize, active.length)
    const selected = limit > 0 ? sampleStratified(active, limit, 'topic') : []

    // Snapshot/lock the round so mastery updates never remove cards mid-test.
    currentRoundQuestions.value = selected.map((q) => ({ ...q }))
    currentCardIndex.value = 0
    isRoundComplete.value = selected.length === 0
  }

  function recordAnswer(questionId, selectedOptionId) {
    const question =
      pool().find((q) => q.id === questionId) ||
      currentRoundQuestions.value.find((q) => q.id === questionId)

    const correctOptionId = question?.correctOptionId ?? null
    const isCorrect = Boolean(correctOptionId) && selectedOptionId === correctOptionId

    const record = { ...ensureRecord(questionId) }
    record.attempts = (record.attempts || 0) + 1

    if (isCorrect) {
      record.correctStreak = (record.correctStreak || 0) + 1
      if (record.correctStreak >= MASTERY_STREAK) {
        record.mastered = true
      }
    } else {
      record.correctStreak = 0
      record.mastered = false
    }

    masteryById.value = {
      ...masteryById.value,
      [questionId]: record,
    }
    persistMasteryMap(masteryById.value)

    return {
      isCorrect,
      correctOptionId,
      correctStreak: record.correctStreak,
      isMastered: record.mastered,
    }
  }

  function nextCard() {
    if (isRoundComplete.value) return
    const lastIndex = currentRoundQuestions.value.length - 1
    if (lastIndex < 0) {
      isRoundComplete.value = true
      return
    }
    if (currentCardIndex.value >= lastIndex) {
      isRoundComplete.value = true
      return
    }
    currentCardIndex.value += 1
  }

  function resetProgress() {
    masteryById.value = {}
    clearPersistedMastery()
    currentRoundQuestions.value = []
    currentCardIndex.value = 0
    isRoundComplete.value = false
  }

  return {
    masteryById,
    getQuestionMastery,
    currentRoundQuestions,
    currentCardIndex,
    currentQuestion,
    isRoundComplete,
    masteredCount,
    masteryPercentage,
    isMissionComplete,
    startNewRound,
    recordAnswer,
    nextCard,
    resetProgress,
  }
}
