import { ref, computed } from 'vue'

export function useShinobiMastery(exerciseId, items) {
  const storageKey = `shinobi_mastery_${exerciseId}`
  let stored = {}
  try {
    stored = JSON.parse(localStorage.getItem(storageKey)) || {}
  } catch {
    stored = {}
  }
  const mastery = ref(stored)

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(mastery.value))
  }

  const recordAnswer = (itemId, isCorrect) => {
    if (isCorrect) {
      mastery.value[itemId] = (mastery.value[itemId] || 0) + 1
    } else {
      mastery.value[itemId] = 0
    }
    save()
  }

  const getUnmasteredPool = () => {
    return items.filter((item) => (mastery.value[item.id] || 0) < 2)
  }

  const resetMastery = () => {
    mastery.value = {}
    save()
  }

  const progressStats = computed(() => {
    const mastered = items.filter((item) => (mastery.value[item.id] || 0) >= 2).length
    return { mastered, total: items.length, isComplete: mastered === items.length && items.length > 0 }
  })

  return {
    mastery,
    recordAnswer,
    getUnmasteredPool,
    resetMastery,
    progressStats,
  }
}
