import { computed, ref } from 'vue'
import { clearAllSpellingMastery, SPELLING_MASTERY_KEY } from './useTwoPassRound'

export const SPELLING_SUBJECT_ID = 'spelling-jutsu'
export const SPELLING_ACTIVITY_KEYS = ['seal-matching', 'blindfold-training']
export const LEGACY_WEEKLY_SPELLING_ID = 'weekly-spelling-jutsu'
export const SPELLING_XP_PER_PRACTICE = 25

const STORAGE_KEY = 'shinobi_academy_progress_v1'

const RANKS = [
  { level: 1, title: 'Academy Student' },
  { level: 2, title: 'Genin Initiate' },
  { level: 3, title: 'Genin Operative' },
  { level: 4, title: 'Chunin Striker' },
  { level: 5, title: 'Chunin Commander' },
  { level: 6, title: 'Special Jonin' },
  { level: 7, title: 'Jonin Master' },
  { level: 8, title: 'Anbu Black Ops' },
  { level: 9, title: 'S-Rank Shinobi Elite' },
  { level: 10, title: 'Grand Hokage' },
]

export function getRankForLevel(level) {
  const safe = Math.max(1, Math.min(10, Number(level) || 1))
  return RANKS[safe - 1]
}

/** Build XP activity keys for weekly spelling exercises. */
export function spellingActivityKeysForExercises(exercises) {
  if (!Array.isArray(exercises)) return []
  return exercises
    .filter((exercise) => exercise?.exerciseType === 'spelling-jutsu' && exercise?.id)
    .flatMap((exercise) =>
      SPELLING_ACTIVITY_KEYS.map((practice) => `${exercise.id}:${practice}`),
    )
}

export function spellingXpActivityKey(exerciseId, practiceKey) {
  if (!exerciseId || !practiceKey) return ''
  return `${exerciseId}:${practiceKey}`
}

function isScopedSpellingKey(key) {
  if (typeof key !== 'string') return false
  return SPELLING_ACTIVITY_KEYS.some((practice) => key.endsWith(`:${practice}`))
}

function loadScrolls() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.scrolls !== 'object' || parsed.scrolls === null) return {}
    return migrateSpellingFlags(parsed.scrolls)
  } catch {
    return {}
  }
}

/**
 * Map legacy flat seal/blindfold flags onto weekly-spelling-jutsu:* keys.
 * Persists once when a migration actually changes data.
 */
function migrateSpellingFlags(rawScrolls) {
  const spelling = rawScrolls[SPELLING_SUBJECT_ID]
  if (!spelling || typeof spelling !== 'object') return rawScrolls

  let changed = false
  const next = { ...spelling }

  for (const practice of SPELLING_ACTIVITY_KEYS) {
    if (next[practice]) {
      const scoped = spellingXpActivityKey(LEGACY_WEEKLY_SPELLING_ID, practice)
      if (!next[scoped]) {
        next[scoped] = true
        changed = true
      }
      delete next[practice]
      changed = true
    }
  }

  if (!changed) return rawScrolls

  const migrated = { ...rawScrolls, [SPELLING_SUBJECT_ID]: next }
  persistScrolls(migrated)
  return migrated
}

function persistScrolls(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ scrolls: value }))
  } catch {
    // Private mode or a full disk should not break the session.
  }
}

const scrolls = ref(loadScrolls())

function flagsFor(subjectId) {
  const flags = scrolls.value[subjectId]
  if (!flags || typeof flags !== 'object') return {}
  return flags
}

function countSpellingPracticeFlags(flags) {
  return Object.keys(flags).filter((key) => flags[key] && isScopedSpellingKey(key)).length
}

function xpForSubject(subjectId) {
  const flags = flagsFor(subjectId)
  // Spelling XP is exclusively practice-flag based (25 XP each). Never use `complete`.
  if (subjectId === SPELLING_SUBJECT_ID) {
    return countSpellingPracticeFlags(flags) * SPELLING_XP_PER_PRACTICE
  }
  return flags.complete ? 100 : 0
}

export function useShinobiProgress() {
  const overallXP = computed(() =>
    Object.keys(scrolls.value).reduce((total, subjectId) => total + xpForSubject(subjectId), 0),
  )

  const currentRank = computed(() => {
    const level = Math.min(10, Math.floor(overallXP.value / 100) + 1)
    return RANKS[level - 1]
  })

  const nextRankMeter = computed(() =>
    currentRank.value.level >= 10 ? 100 : overallXP.value % 100,
  )

  function getScrollProgress(subjectId, activityKeys) {
    const flags = flagsFor(subjectId)
    let keys = ['complete']
    if (Array.isArray(activityKeys) && activityKeys.length) {
      keys = activityKeys
    } else if (subjectId === SPELLING_SUBJECT_ID) {
      keys = spellingActivityKeysForExercises([
        { id: LEGACY_WEEKLY_SPELLING_ID, exerciseType: 'spelling-jutsu' },
      ])
    }

    const completedCount = keys.filter((key) => flags[key]).length
    const totalCount = keys.length
    const percentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0
    return {
      percentage,
      isMastered: totalCount > 0 && completedCount === totalCount,
      completedCount,
      totalCount,
    }
  }

  function recordSubActivityComplete(subjectId, activityKey) {
    if (!subjectId || !activityKey) return
    const current = flagsFor(subjectId)
    if (current[activityKey]) return
    scrolls.value = {
      ...scrolls.value,
      [subjectId]: { ...current, [activityKey]: true },
    }
    persistScrolls(scrolls.value)
  }

  function resetAllProgress() {
    scrolls.value = {}
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage failures.
    }
    clearAllSpellingMastery()
    try {
      localStorage.removeItem(SPELLING_MASTERY_KEY)
    } catch {
      // Ignore storage failures.
    }
    try {
      const keys = []
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index)
        if (key && (key.startsWith('shinobi_mastery_') || key.startsWith('shinobi_trial_'))) {
          keys.push(key)
        }
      }
      keys.forEach((key) => localStorage.removeItem(key))
    } catch {
      // Ignore storage failures.
    }
  }

  return {
    scrolls,
    getScrollProgress,
    overallXP,
    currentRank,
    nextRankMeter,
    recordSubActivityComplete,
    resetAllProgress,
  }
}
