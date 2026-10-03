import { computed, ref } from 'vue'

export const SPELLING_MASTERY_KEY = 'shinobi_spelling_mastery_v2'
export const PRACTICE_KEYS = ['seal-matching', 'blindfold-training']

function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const swap = copy[i]
    copy[i] = copy[j]
    copy[j] = swap
  }
  return copy
}

function loadMasteryStore() {
  try {
    const raw = localStorage.getItem(SPELLING_MASTERY_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed
  } catch {
    return {}
  }
}

function persistMasteryStore(store) {
  try {
    localStorage.setItem(SPELLING_MASTERY_KEY, JSON.stringify(store))
  } catch {
    // Ignore storage failures.
  }
}

export function getPracticeMasteredIds(subjectId, practiceKey) {
  if (!subjectId || !practiceKey) return []
  const store = loadMasteryStore()
  const list = store[subjectId]?.[practiceKey]
  return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : []
}

export function setPracticeMasteredIds(subjectId, practiceKey, ids) {
  if (!subjectId || !practiceKey) return
  const store = loadMasteryStore()
  const subject = { ...(store[subjectId] || {}) }
  subject[practiceKey] = [...new Set(ids.filter((id) => typeof id === 'string'))]
  store[subjectId] = subject
  persistMasteryStore(store)
}

export function clearPracticeMastery(subjectId, practiceKey) {
  if (!subjectId) return
  const store = loadMasteryStore()
  if (!store[subjectId]) return
  if (practiceKey) {
    store[subjectId] = { ...store[subjectId], [practiceKey]: [] }
  } else {
    store[subjectId] = {
      'seal-matching': [],
      'blindfold-training': [],
    }
  }
  persistMasteryStore(store)
}

export function clearAllSpellingMastery() {
  try {
    localStorage.removeItem(SPELLING_MASTERY_KEY)
  } catch {
    // Ignore storage failures.
  }
}

function wordById(words, id) {
  return words.find((item) => item.id === id) || null
}

function toWordList(words, ids) {
  return ids.map((id) => wordById(words, id)).filter(Boolean)
}

export function useTwoPassRound(words) {
  const pass = ref(1)
  const cardIndex = ref(0)
  const queue = ref([])
  const batchIds = ref([])
  const challengeIds = ref([])
  const decoyIds = ref([])
  const pass1Success = ref({})
  const pass2Success = ref({})
  const freeDrill = ref(false)
  const answeredCurrent = ref(false)

  const batchSize = computed(() => batchIds.value.length)
  const currentCard = computed(() => queue.value[cardIndex.value] || null)
  const headerLabel = computed(() => {
    if (!batchSize.value) return ''
    return `PASS ${pass.value} OF 2 • CARD ${cardIndex.value + 1} / ${batchSize.value}`
  })

  function buildRoundBatch(masteredIds) {
    const mastered = new Set(masteredIds)
    const unmastered = words.filter((item) => !mastered.has(item.id))
    const masteredWords = words.filter((item) => mastered.has(item.id))

    if (!unmastered.length) {
      return { batch: [], challengeIds: [], decoyIds: [], complete: true }
    }

    if (unmastered.length <= 2 && masteredWords.length > 0) {
      const decoys = shuffle(masteredWords).slice(0, 3)
      const batch = [...unmastered, ...decoys]
      return {
        batch,
        challengeIds: unmastered.map((item) => item.id),
        decoyIds: decoys.map((item) => item.id),
        complete: false,
      }
    }

    return {
      batch: unmastered,
      challengeIds: unmastered.map((item) => item.id),
      decoyIds: [],
      complete: false,
    }
  }

  function startRound({ masteredIds = [], freeDrill: isFree = false } = {}) {
    freeDrill.value = Boolean(isFree)
    pass1Success.value = {}
    pass2Success.value = {}
    answeredCurrent.value = false
    pass.value = 1
    cardIndex.value = 0

    if (isFree) {
      const batch = shuffle([...words])
      batchIds.value = batch.map((item) => item.id)
      challengeIds.value = []
      decoyIds.value = batchIds.value.slice()
      queue.value = batch
      return { started: batch.length > 0, complete: false }
    }

    const built = buildRoundBatch(masteredIds)
    if (built.complete || !built.batch.length) {
      batchIds.value = []
      challengeIds.value = []
      decoyIds.value = []
      queue.value = []
      return { started: false, complete: true }
    }

    const ordered = shuffle(built.batch)
    batchIds.value = ordered.map((item) => item.id)
    challengeIds.value = built.challengeIds
    decoyIds.value = built.decoyIds
    queue.value = ordered
    return { started: true, complete: false }
  }

  function beginPass2() {
    pass.value = 2
    cardIndex.value = 0
    answeredCurrent.value = false
    queue.value = shuffle(toWordList(words, batchIds.value))
  }

  function submitAnswer(isCorrect) {
    const card = currentCard.value
    if (!card || answeredCurrent.value) return false
    const map = pass.value === 1 ? pass1Success : pass2Success
    map.value = { ...map.value, [card.id]: Boolean(isCorrect) }
    answeredCurrent.value = true
    return true
  }

  function finishRound(getMasteredIds, setMasteredIds) {
    const newlyMastered = []
    const retainedMastery = []
    const needsPractice = []
    const challenge = new Set(challengeIds.value)
    const decoys = new Set(decoyIds.value)

    const nextMastered = new Set(getMasteredIds())

    for (const id of batchIds.value) {
      const passedBoth = pass1Success.value[id] === true && pass2Success.value[id] === true
      if (freeDrill.value) {
        if (passedBoth) retainedMastery.push(id)
        else needsPractice.push(id)
        continue
      }

      if (challenge.has(id)) {
        if (passedBoth) {
          nextMastered.add(id)
          newlyMastered.push(id)
        } else {
          nextMastered.delete(id)
          needsPractice.push(id)
        }
      } else if (decoys.has(id)) {
        if (passedBoth) {
          nextMastered.add(id)
          retainedMastery.push(id)
        } else {
          nextMastered.delete(id)
          needsPractice.push(id)
        }
      }
    }

    if (!freeDrill.value) {
      setMasteredIds([...nextMastered])
    }

    const masteredCount = nextMastered.size
    return {
      newlyMastered: toWordList(words, newlyMastered),
      retainedMastery: toWordList(words, retainedMastery),
      needsPractice: toWordList(words, needsPractice),
      masteredCount,
      totalCount: words.length,
      allMastered: masteredCount === words.length && words.length > 0,
      freeDrill: freeDrill.value,
    }
  }

  function advanceCard(getMasteredIds, setMasteredIds) {
    if (!answeredCurrent.value) return { kind: 'blocked' }
    const nextIndex = cardIndex.value + 1
    if (nextIndex < queue.value.length) {
      cardIndex.value = nextIndex
      answeredCurrent.value = false
      return { kind: 'nextCard' }
    }
    if (pass.value === 1) {
      return { kind: 'pass1Complete' }
    }
    const debrief = finishRound(getMasteredIds, setMasteredIds)
    return { kind: 'roundComplete', debrief }
  }

  function resetEngine() {
    pass.value = 1
    cardIndex.value = 0
    queue.value = []
    batchIds.value = []
    challengeIds.value = []
    decoyIds.value = []
    pass1Success.value = {}
    pass2Success.value = {}
    freeDrill.value = false
    answeredCurrent.value = false
  }

  return {
    pass,
    cardIndex,
    queue,
    batchIds,
    batchSize,
    currentCard,
    headerLabel,
    answeredCurrent,
    freeDrill,
    buildRoundBatch,
    startRound,
    beginPass2,
    submitAnswer,
    advanceCard,
    finishRound,
    resetEngine,
    shuffle,
  }
}
