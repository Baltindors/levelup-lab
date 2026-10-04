import { computed, ref } from 'vue'
import { useShinobiProgress } from './useShinobiProgress'

export const MATH_EXAM_SUBJECT_ID = 'math-exam-100526'
export const MATH_EXAM_STORAGE_KEY = 'levelup_math_exam_100526_progress'
export const MATH_EXAM_EXERCISE_IDS = [
  'exponents-laws',
  'scientific-notation',
  'algebraic-expressions',
]

const DEFAULT_TOTAL = 10
const PASS_RATIO = 0.7

function emptyProgress() {
  return {
    completed: false,
    bestScore: 0,
    total: DEFAULT_TOTAL,
    percentage: 0,
    gradeRank: null,
  }
}

/**
 * Map percentage (0–100) to anime letter rank.
 * @param {number} percentage
 * @returns {'S'|'A'|'B'|'C'|'F'|null}
 */
export function gradeRankFromPercentage(percentage) {
  if (percentage == null || Number.isNaN(percentage)) return null
  if (percentage >= 100) return 'S'
  if (percentage >= 90) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 50) return 'C'
  if (percentage > 0 || percentage === 0) return 'F'
  return null
}

/**
 * Normalize a stored exercise value (boolean legacy or structured object).
 * Legacy `true` grandfathered as Rank B (7/10) — the pass threshold.
 * @param {unknown} raw
 */
export function normalizeExerciseProgress(raw) {
  if (raw === true) {
    return {
      completed: true,
      bestScore: 7,
      total: DEFAULT_TOTAL,
      percentage: 70,
      gradeRank: 'B',
    }
  }

  if (!raw || typeof raw !== 'object') {
    return emptyProgress()
  }

  const total = Number(raw.total) > 0 ? Number(raw.total) : DEFAULT_TOTAL
  const bestScore = Math.max(0, Math.min(total, Number(raw.bestScore) || 0))
  const percentage =
    raw.percentage != null && !Number.isNaN(Number(raw.percentage))
      ? Math.max(0, Math.min(100, Math.round(Number(raw.percentage))))
      : total
        ? Math.round((bestScore / total) * 100)
        : 0
  const completed =
    Boolean(raw.completed) || percentage >= PASS_RATIO * 100
  const gradeRank =
    raw.gradeRank && ['S', 'A', 'B', 'C', 'F'].includes(raw.gradeRank)
      ? raw.gradeRank
      : bestScore > 0 || percentage > 0 || completed
        ? gradeRankFromPercentage(percentage)
        : null

  return {
    completed,
    bestScore,
    total,
    percentage,
    gradeRank: completed && !gradeRank ? 'B' : gradeRank,
  }
}

function emptyState() {
  return {
    exercises: {},
    leveledUp: false,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(MATH_EXAM_STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyState()
    return {
      exercises:
        parsed.exercises && typeof parsed.exercises === 'object' ? { ...parsed.exercises } : {},
      leveledUp: Boolean(parsed.leveledUp),
    }
  } catch {
    return emptyState()
  }
}

function persist(state) {
  try {
    localStorage.setItem(MATH_EXAM_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode / full disk should not break the session.
  }
}

function isCompletedEntry(raw) {
  return normalizeExerciseProgress(raw).completed
}

const state = ref(loadState())

export function useMathExamProgress() {
  const { recordSubActivityComplete } = useShinobiProgress()

  const completedCount = computed(
    () => MATH_EXAM_EXERCISE_IDS.filter((id) => isCompletedEntry(state.value.exercises[id])).length,
  )

  const allComplete = computed(
    () => completedCount.value === MATH_EXAM_EXERCISE_IDS.length,
  )

  const leveledUp = computed(() => state.value.leveledUp)

  const subjectStats = computed(() => {
    const totalCount = MATH_EXAM_EXERCISE_IDS.length
    const done = completedCount.value
    return {
      completedCount: done,
      totalCount,
      chakraPercent: totalCount ? Math.round((done / totalCount) * 100) : 0,
      allComplete: done === totalCount,
    }
  })

  function getExerciseProgress(exerciseId) {
    return normalizeExerciseProgress(state.value.exercises[exerciseId])
  }

  function isExerciseComplete(exerciseId) {
    return getExerciseProgress(exerciseId).completed
  }

  function getScrollProgress() {
    const totalCount = MATH_EXAM_EXERCISE_IDS.length
    const done = completedCount.value
    return {
      percentage: totalCount ? Math.round((done / totalCount) * 100) : 0,
      isMastered: allComplete.value,
      completedCount: done,
      totalCount,
    }
  }

  /**
   * Award Shinobi XP once when all three trials are sealed.
   * @param {{ exercises: Record<string, unknown>, leveledUp: boolean }} next
   * @returns {{ leveledUpNow: boolean }}
   */
  function maybeLevelUp(next) {
    const allThreeComplete = MATH_EXAM_EXERCISE_IDS.every((id) =>
      isCompletedEntry(next.exercises[id]),
    )

    if (allThreeComplete && !next.leveledUp) {
      const leveled = { ...next, leveledUp: true }
      state.value = leveled
      persist(leveled)
      recordSubActivityComplete(MATH_EXAM_SUBJECT_ID, 'complete')
      return { leveledUpNow: true }
    }

    return { leveledUpNow: false }
  }

  /**
   * Record a trial score. Keeps peak bestScore; never downgrades sealed status.
   * @param {string} exerciseId
   * @param {{ score: number, total?: number, passed?: boolean }} payload
   * @returns {{ leveledUpNow: boolean }}
   */
  function recordExerciseScore(exerciseId, { score, total = DEFAULT_TOTAL, passed } = {}) {
    if (!MATH_EXAM_EXERCISE_IDS.includes(exerciseId)) {
      return { leveledUpNow: false }
    }

    const safeTotal = Number(total) > 0 ? Number(total) : DEFAULT_TOTAL
    const attemptScore = Math.max(0, Math.min(safeTotal, Number(score) || 0))
    const previous = getExerciseProgress(exerciseId)
    const bestScore = Math.max(previous.bestScore, attemptScore)
    const percentage = safeTotal ? Math.round((bestScore / safeTotal) * 100) : 0
    const isPassed =
      passed === true || attemptScore / safeTotal >= PASS_RATIO || percentage >= PASS_RATIO * 100
    const completed = previous.completed || isPassed

    const entry = {
      completed,
      bestScore,
      total: safeTotal,
      percentage,
      gradeRank: gradeRankFromPercentage(percentage),
    }

    const next = {
      exercises: { ...state.value.exercises, [exerciseId]: entry },
      leveledUp: state.value.leveledUp,
    }
    state.value = next
    persist(next)

    return maybeLevelUp(next)
  }

  /**
   * Mark an exercise passed (legacy). Awards Shinobi XP once when all three complete.
   * @returns {{ leveledUpNow: boolean }}
   */
  function markExerciseComplete(exerciseId) {
    if (!MATH_EXAM_EXERCISE_IDS.includes(exerciseId)) {
      return { leveledUpNow: false }
    }

    const previous = getExerciseProgress(exerciseId)
    if (previous.completed) {
      return maybeLevelUp({
        exercises: state.value.exercises,
        leveledUp: state.value.leveledUp,
      })
    }

    return recordExerciseScore(exerciseId, {
      score: Math.max(previous.bestScore, Math.ceil(DEFAULT_TOTAL * PASS_RATIO)),
      total: DEFAULT_TOTAL,
      passed: true,
    })
  }

  return {
    state,
    completedCount,
    allComplete,
    leveledUp,
    subjectStats,
    getExerciseProgress,
    isExerciseComplete,
    getScrollProgress,
    recordExerciseScore,
    markExerciseComplete,
  }
}
