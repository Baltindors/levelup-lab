<script setup>
import { watch } from 'vue'
import { useMathDrill } from '../../../composables/useMathDrill'
import { gradeMcAnswer } from '../../../utils/mathMcGrade'
import { generateMixedNumberDrillPool } from '../../../utils/mixedNumberGenerator'
import MathModuleShell from '../common/MathModuleShell.vue'
import MixedNumbersExplorer from './MixedNumbersExplorer.vue'
import MathMcDrillQuestion from './MathMcDrillQuestion.vue'
import MathMcDrillExplanation from './MathMcDrillExplanation.vue'

defineProps({
  exercise: { type: Object, required: true },
})

const emit = defineEmits(['answered'])

const drillPool = generateMixedNumberDrillPool(5)

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
} = useMathDrill(drillPool, { drillSize: 10, passingScore: 0.7, stratifyBy: 'topic' })

function gradeAnswer(question, studentAnswers) {
  return gradeMcAnswer(question, studentAnswers).correct
}

watch(isComplete, (done) => {
  if (done) {
    emit('answered', {
      correct: passed.value,
      score: correctCount.value,
      total: size.value,
      passed: passed.value,
    })
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
      <MixedNumbersExplorer />
    </template>

    <template #question="{ question, submit, feedback }">
      <MathMcDrillQuestion :question="question" :submit="submit" :feedback="feedback" />
    </template>

    <template #explanation="{ item }">
      <MathMcDrillExplanation :item="item" />
    </template>
  </MathModuleShell>
</template>
