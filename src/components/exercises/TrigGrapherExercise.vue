<script setup>
import { computed, watch } from 'vue'
import { useMathDrill } from '../../composables/useMathDrill'
import MathModuleShell from './common/MathModuleShell.vue'
import TrigGrapherExplorer from './trig/TrigGrapherExplorer.vue'
import TrigDrillQuestion from './trig/TrigDrillQuestion.vue'
import TrigDrillExplanation from './trig/TrigDrillExplanation.vue'
import { gradeTrigDrillAnswers } from '../../utils/trigDrillGrade'

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['answered'])

const practicePool = computed(() => props.exercise.practicePool ?? [])
const presets = computed(() => props.exercise.presets ?? [])

const {
  currentIndex,
  currentQuestion,
  isComplete,
  inProgress,
  answeredCurrent,
  score,
  correctCount,
  results,
  missedQuestions,
  passed,
  size,
  startDrill,
  recordAnswer,
  advance,
  restartFull,
  retryMissed,
  reset,
} = useMathDrill(practicePool, { drillSize: 10, passingScore: 0.7 })

function gradeAnswer(question, studentAnswers) {
  return gradeTrigDrillAnswers(question.equation, studentAnswers).correct
}

watch(isComplete, (done) => {
  if (done) {
    emit('answered', { correct: passed.value })
  }
})
</script>

<template>
  <MathModuleShell
    :grade-answer="gradeAnswer"
    :current-index="currentIndex"
    :drill-size="size || 10"
    :current-question="currentQuestion"
    :is-complete="isComplete"
    :in-progress="inProgress"
    :answered-current="answeredCurrent"
    :score="score"
    :correct-count="correctCount"
    :results="results"
    :missed-questions="missedQuestions"
    :passed="passed"
    :start-drill="startDrill"
    :record-answer="recordAnswer"
    :advance="advance"
    :restart-full="restartFull"
    :retry-missed="retryMissed"
    :reset="reset"
  >
    <template #explorer>
      <TrigGrapherExplorer :presets="presets" />
    </template>

    <template #question="{ question, submit, feedback }">
      <TrigDrillQuestion :question="question" :submit="submit" :feedback="feedback" />
    </template>

    <template #explanation="{ item }">
      <TrigDrillExplanation :item="item" />
    </template>
  </MathModuleShell>
</template>
