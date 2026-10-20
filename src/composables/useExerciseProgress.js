import { ref } from 'vue'
import {
  trialXpActivityKey,
  useShinobiProgress,
} from './useShinobiProgress'

export const EXERCISE_PROGRESS_KEY = 'levelup_exercise_progress_v1'
export const LEGACY_MATH_EXAM_STORAGE_KEY = 'levelup_math_exam_100526_progress'
export const LEGACY_MATH_EXAM_SUBJECT_ID = 'math-exam-100526'

export const SCORE_EXERCISE_TYPES = [
  'math-exponents',
  'math-scientific-notation',
  'math-algebraic-expressions',
  'math-fractions-basics',
  'math-mixed-numbers',
  'science-earth-systems',
  'trig-grapher',
]

const PASS_PERCENT = 70
const RANKS = ['S', 'A', 'B', 'C', 'F']

const { recordSubActivityComplete } = useShinobiProgress()

export function isScoreExercise(exercise) {
  return SCORE_EXERCISE_TYPES.includes(exercise?.exerciseType)
}

/**
 * Map percentage (0–100) to a letter rank.
 * @param {number} percentage
 * @returns {'S'|'A'|'B'|'C'|'F'|null}
 */
export function gradeRankFromPercentage(percentage) {
  if (percentage == null || Number.isNaN(Number(percentage))) return null
  const value = Number(percentage)
  if (value >= 100) return 'S'
  if (value >= 90) return 'A'
  if (value >= 70) return 'B'
  if (value >= 50) return 'C'
  if (value >= 0) return 'F'
  return null
}

function emptyProgress() {
  return {
    bestScore: 0,
    total: 10,
    percent: 0,
    gradeRank: null,
    completed: false,
    attempts: 0,
    xpAwarded: false,
  }
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)))
}

/**
 * Normalize a legacy Scroll 2 entry (boolean or structured object).
 * Legacy `true` stays Rank B (7/10).
 * @param {unknown} raw
 */
function fromLegacyEntry(raw) {
  if (raw === true) {
    return {
      bestScore: 7,
      total: 10,
      percent: 70,
      gradeRank: 'B',
      completed: true,
      attempts: 1,
      xpAwarded: false,
    }
  }

  if (!raw || typeof raw !== 'object') return emptyProgress()

  const total = Number(raw.total) > 0 ? Number(raw.total) : 10
  const bestScore = Math.max(0, Math.min(total, Number(raw.bestScore) || 0))
  const rawPercent = raw.percent != null ? raw.percent : raw.percentage
  const percent =
    rawPercent != null && !Number.isNaN(Number(rawPercent))
      ? clampPercent(rawPercent)
      : total
        ? clampPercent((bestScore / total) * 100)
        : 0
  const completed = Boolean(raw.completed) || percent >= PASS_PERCENT
  const attempted = completed || bestScore > 0 || percent > 0 || Number(raw.attempts) > 0
  const gradeRank =
    raw.gradeRank && RANKS.includes(raw.gradeRank)
      ? raw.gradeRank
      : attempted
        ? gradeRankFromPercentage(percent)
        : null

  return {
    bestScore,
    total,
    percent,
    gradeRank: completed && !gradeRank ? 'B' : gradeRank,
    completed,
    attempts: attempted ? Math.max(1, Number(raw.attempts) || 1) : 0,
    xpAwarded: Boolean(raw.xpAwarded),
  }
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function persist(next) {
  try {
    localStorage.setItem(EXERCISE_PROGRESS_KEY, JSON.stringify(next))
  } catch {
    // Private mode or a full disk should not break the session.
  }
}

function migrateLegacy(parsed) {
  const leveledUp = Boolean(parsed.leveledUp)
  const source =
    parsed.exercises && typeof parsed.exercises === 'object' ? parsed.exercises : {}
  const exercises = {}

  for (const [exerciseId, raw] of Object.entries(source)) {
    const entry = fromLegacyEntry(raw)
    if (!entry.attempts && !entry.completed) continue

    if (entry.completed && leveledUp) {
      entry.xpAwarded = true
    } else if (entry.completed && !leveledUp) {
      recordSubActivityComplete(LEGACY_MATH_EXAM_SUBJECT_ID, trialXpActivityKey(exerciseId))
      entry.xpAwarded = true
    }

    exercises[exerciseId] = entry
  }

  const next = { exercises }
  persist(next)
  return next
}

function loadStore() {
  const existing = readJson(EXERCISE_PROGRESS_KEY)
  if (existing) {
    const exercises =
      existing.exercises && typeof existing.exercises === 'object' ? { ...existing.exercises } : {}
    return { exercises }
  }

  const legacy = readJson(LEGACY_MATH_EXAM_STORAGE_KEY)
  if (!legacy) return { exercises: {} }
  return migrateLegacy(legacy)
}

const state = ref(loadStore())

function storedProgress(exerciseId) {
  const raw = state.value.exercises?.[exerciseId]
  if (!raw || typeof raw !== 'object') return emptyProgress()
  return {
    ...emptyProgress(),
    ...raw,
    percent: clampPercent(raw.percent ?? raw.percentage),
    gradeRank: raw.gradeRank && RANKS.includes(raw.gradeRank) ? raw.gradeRank : raw.gradeRank ?? null,
  }
}

export function useExerciseProgress() {
  function getExerciseProgress(exerciseId) {
    return storedProgress(exerciseId)
  }

  function getSubjectProgress(exerciseIds) {
    const ids = Array.isArray(exerciseIds) ? exerciseIds.filter(Boolean) : []
    const completedCount = ids.filter((id) => storedProgress(id).completed).length
    const totalCount = ids.length
    return {
      completedCount,
      totalCount,
      chakraPercent: totalCount ? Math.round((completedCount / totalCount) * 100) : 0,
      allComplete: totalCount > 0 && completedCount === totalCount,
    }
  }

  /**
   * Record a trial. Best percent never falls. XP is written only when awardXp is true.
   * @param {string} exerciseId
   * @param {string} subjectId
   * @param {{ score?: number, total?: number, passed?: boolean }} payload
   * @param {{ awardXp?: boolean }} options
   * @returns {{ xpAwardedNow: boolean }}
   */
  function recordExerciseScore(exerciseId, subjectId, payload = {}, { awardXp = false } = {}) {
    if (!exerciseId) return { xpAwardedNow: false }

    const safeTotal = Number(payload.total) > 0 ? Number(payload.total) : 10
    const attemptScore = Math.max(0, Math.min(safeTotal, Number(payload.score) || 0))
    const attemptPercent = safeTotal ? clampPercent((attemptScore / safeTotal) * 100) : 0
    const previous = storedProgress(exerciseId)
    const keepBest = previous.attempts > 0 && attemptPercent < previous.percent

    const bestScore = keepBest ? previous.bestScore : attemptScore
    const total = keepBest ? previous.total : safeTotal
    const percent = keepBest ? previous.percent : attemptPercent
    const gradeRank = keepBest ? previous.gradeRank : gradeRankFromPercentage(percent)
    const completed = previous.completed || attemptPercent >= PASS_PERCENT

    let xpAwarded = previous.xpAwarded
    let xpAwardedNow = false
    if (completed && !xpAwarded && awardXp && subjectId) {
      recordSubActivityComplete(subjectId, trialXpActivityKey(exerciseId))
      xpAwarded = true
      xpAwardedNow = true
    }

    const entry = {
      bestScore,
      total,
      percent,
      gradeRank,
      completed,
      attempts: previous.attempts + 1,
      xpAwarded,
    }

    const next = {
      exercises: { ...state.value.exercises, [exerciseId]: entry },
    }
    state.value = next
    persist(next)
    return { xpAwardedNow }
  }

  return {
    state,
    getExerciseProgress,
    getSubjectProgress,
    recordExerciseScore,
  }
}
