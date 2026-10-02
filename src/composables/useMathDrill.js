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
 * Reusable quiz session manager for math modules.
 * @param {import('vue').MaybeRefOrGetter<Array>} questionPool
 * @param {{ drillSize?: number, passingScore?: number }} config
 */
export function useMathDrill(questionPool, { drillSize = 10, passingScore = 0.7 } = {}) {
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

  function startDrill(customList) {
    const source = Array.isArray(customList) && customList.length
      ? [...customList]
      : shuffle(pool()).slice(0, Math.min(drillSize, pool().length))

    session.value = source
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
