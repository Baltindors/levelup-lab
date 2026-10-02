import MultipleChoiceExercise from './MultipleChoiceExercise.vue'
import FlashcardExercise from './FlashcardExercise.vue'
import ExerciseFallback from './ExerciseFallback.vue'

export const exerciseRegistry = {
  'multiple-choice': MultipleChoiceExercise,
  flashcard: FlashcardExercise,
}

export function resolveExerciseComponent(exerciseType) {
  return exerciseRegistry[exerciseType] ?? ExerciseFallback
}

export { MultipleChoiceExercise, FlashcardExercise, ExerciseFallback }
