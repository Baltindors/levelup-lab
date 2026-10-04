export const SHINOBI_LAST_SEEN_KEY = 'shinobi_academy_last_seen_v1'

/**
 * Within-band meter percent for a given XP/level (mirrors useShinobiProgress).
 * @param {number} xp
 * @param {number} level
 * @returns {number}
 */
export function meterFromXp(xp, level) {
  const safeLevel = Number(level) || 1
  const safeXp = Math.max(0, Number(xp) || 0)
  if (safeLevel >= 10) return 100
  return safeXp % 100
}

/**
 * @returns {{ xp: number, level: number } | null}
 */
export function readLastSeen() {
  try {
    const raw = localStorage.getItem(SHINOBI_LAST_SEEN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const xp = Number(parsed.xp)
    const level = Number(parsed.level)
    if (!Number.isFinite(xp) || !Number.isFinite(level)) return null
    return { xp: Math.max(0, xp), level: Math.max(1, Math.min(10, level)) }
  } catch {
    return null
  }
}

/**
 * @param {{ xp: number, level: number }} snapshot
 */
export function writeLastSeen({ xp, level }) {
  try {
    localStorage.setItem(
      SHINOBI_LAST_SEEN_KEY,
      JSON.stringify({
        xp: Math.max(0, Number(xp) || 0),
        level: Math.max(1, Math.min(10, Number(level) || 1)),
      }),
    )
  } catch {
    // Private mode / full disk should not break the session.
  }
}

export function useShinobiLastSeen() {
  return {
    readLastSeen,
    writeLastSeen,
    meterFromXp,
  }
}
