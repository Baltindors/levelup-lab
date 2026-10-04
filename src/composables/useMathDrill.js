import { computed, ref, unref } from 'vue'

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Round-robin sample across buckets so drills cover every subtopic.
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

/**
 * Reusable quiz session manager for math modules.
 * @param {import('vue').MaybeRefOrGetter<Array>} questionPool
 * @param {{ drillSize?: number, passingScore?: number, stratifyBy?: string|null }} config
 */
export function useMathDrill(
  questionPool,
  { drillSize = 10, passingScore = 0.7, stratifyBy = null } = {},
) {
  const session = ref([])
  const currentIndex = ref(0)
  const results = ref([])
  const isComplete = ref(false)
  const inProgress = ref(false)
  const answeredCurrent = ref(false)

  const pool = () => {
    const value = typeof questionPool === 'function' ? questionPool() : unref(questionPool)
    return Array.isArray(value) ? value : []
  }

  const currentQuestion = computed(() => session.value[currentIndex.value] ?? null)

  const correctCount = computed(() => results.value.filter((r) => r.isCorrect).length)

  const score = computed(() => {
    if (!results.value.length) return 0
    return correctCount.value / results.value.length
  })

  const missedQuestions = computed(() => results.value.filter((r) => !r.isCorrect))

  const passed = computed(() => score.value >= passingScore)

  const size = computed(() => session.value.length || drillSize)

  function pickFromPool() {
    const source = pool()
    const limit = Math.min(drillSize, source.length)
    if (stratifyBy) return sampleStratified(source, limit, stratifyBy)
    return shuffle(source).slice(0, limit)
  }

  function startDrill(customList) {
    const source = Array.isArray(customList) && customList.length
      ? [...customList]
      : pickFromPool()

    // Clone each card and shuffle choices so correctAnswer id stays stable
    // while display position varies across A/B/C/D.
    session.value = source.map((q) => ({
      ...q,
      options: shuffle(Array.isArray(q.options) ? q.options : []),
    }))
    currentIndex.value = 0
    results.value = []
    isComplete.value = false
    inProgress.value = source.length > 0
    answeredCurrent.value = false
  }

  function recordAnswer(isCorrect, studentAnswers) {
    const question = currentQuestion.value
    if (!question || answeredCurrent.value) return

    results.value.push({
      question,
      isCorrect: Boolean(isCorrect),
      studentAnswers,
    })
    answeredCurrent.value = true
  }

  function advance() {
    if (!inProgress.value || !answeredCurrent.value) return

    if (currentIndex.value >= session.value.length - 1) {
      isComplete.value = true
      inProgress.value = false
      answeredCurrent.value = false
      return
    }

    currentIndex.value += 1
    answeredCurrent.value = false
  }

  function restartFull() {
    startDrill()
  }

  function retryMissed() {
    const missed = missedQuestions.value.map((r) => r.question)
    if (!missed.length) {
      startDrill()
      return
    }
    startDrill(missed)
  }

  function reset() {
    session.value = []
    currentIndex.value = 0
    results.value = []
    isComplete.value = false
    inProgress.value = false
    answeredCurrent.value = false
  }

  return {
    drillSize,
    passingScore,
    session,
    currentIndex,
    currentQuestion,
    isComplete,
    inProgress,
    answeredCurrent,
    results,
    correctCount,
    score,
    missedQuestions,
    passed,
    size,
    startDrill,
    recordAnswer,
    advance,
    restartFull,
    retryMissed,
    reset,
  }
}
