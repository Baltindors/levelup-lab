import MultipleChoiceExercise from './MultipleChoiceExercise.vue'
import FlashcardExercise from './FlashcardExercise.vue'
import TrigGrapherExercise from './TrigGrapherExercise.vue'
import ExerciseFallback from './ExerciseFallback.vue'

export const exerciseRegistry = {
  'multiple-choice': MultipleChoiceExercise,
  flashcard: FlashcardExercise,
  'trig-grapher': TrigGrapherExercise,
}

export function resolveExerciseComponent(exerciseType) {
  return exerciseRegistry[exerciseType] ?? ExerciseFallback
}

export {
  MultipleChoiceExercise,
  FlashcardExercise,
  TrigGrapherExercise,
  ExerciseFallback,
}
