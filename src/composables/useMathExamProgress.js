import { computed, ref } from 'vue'
import { useShinobiProgress } from './useShinobiProgress'

export const MATH_EXAM_SUBJECT_ID = 'math-exam-100526'
export const MATH_EXAM_STORAGE_KEY = 'levelup_math_exam_100526_progress'
export const MATH_EXAM_EXERCISE_IDS = [
  'exponents-laws',
  'scientific-notation',
  'algebraic-expressions',
]

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

const state = ref(loadState())

export function useMathExamProgress() {
  const { recordSubActivityComplete } = useShinobiProgress()

  const completedCount = computed(
    () => MATH_EXAM_EXERCISE_IDS.filter((id) => state.value.exercises[id]).length,
  )

  const allComplete = computed(
    () => completedCount.value === MATH_EXAM_EXERCISE_IDS.length,
  )

  const leveledUp = computed(() => state.value.leveledUp)

  function isExerciseComplete(exerciseId) {
    return Boolean(state.value.exercises[exerciseId])
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
   * Mark an exercise passed. Awards Shinobi XP once when all three complete.
   * @returns {{ leveledUpNow: boolean }}
   */
  function markExerciseComplete(exerciseId) {
    if (!MATH_EXAM_EXERCISE_IDS.includes(exerciseId)) {
      return { leveledUpNow: false }
    }

    const next = {
      exercises: { ...state.value.exercises, [exerciseId]: true },
      leveledUp: state.value.leveledUp,
    }
    state.value = next
    persist(next)

    const allThreeComplete = MATH_EXAM_EXERCISE_IDS.every((id) => next.exercises[id])

    // Idempotent XP guard: only dispatch once, ever, for this scroll.
    if (allThreeComplete && !next.leveledUp) {
      const leveled = { ...next, leveledUp: true }
      state.value = leveled
      persist(leveled)
      recordSubActivityComplete(MATH_EXAM_SUBJECT_ID, 'complete')
      return { leveledUpNow: true }
    }

    return { leveledUpNow: false }
  }

  return {
    state,
    completedCount,
    allComplete,
    leveledUp,
    isExerciseComplete,
    getScrollProgress,
    markExerciseComplete,
  }
}
