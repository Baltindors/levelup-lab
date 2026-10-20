import { defineAsyncComponent } from 'vue'
import MultipleChoiceExercise from './MultipleChoiceExercise.vue'
import FlashcardExercise from './FlashcardExercise.vue'
import TrigGrapherExercise from './TrigGrapherExercise.vue'
import SpellingExercise from './SpellingExercise.vue'
import CustomSpellingExercise from './CustomSpellingExercise.vue'
import ExponentsModule from './math/ExponentsModule.vue'
import ScientificNotationModule from './math/ScientificNotationModule.vue'
import AlgebraicExpressionsModule from './math/AlgebraicExpressionsModule.vue'
import FractionsBasicsModule from './math/FractionsBasicsModule.vue'
import MixedNumbersModule from './math/MixedNumbersModule.vue'
import ExerciseFallback from './ExerciseFallback.vue'

export const exerciseRegistry = {
  'multiple-choice': MultipleChoiceExercise,
  flashcard: FlashcardExercise,
  'trig-grapher': TrigGrapherExercise,
  'spelling-jutsu': SpellingExercise,
  'custom-spelling': CustomSpellingExercise,
  'math-exponents': ExponentsModule,
  'math-scientific-notation': ScientificNotationModule,
  'math-algebraic-expressions': AlgebraicExpressionsModule,
  'math-fractions-basics': FractionsBasicsModule,
  'math-mixed-numbers': MixedNumbersModule,
  'science-earth-systems': defineAsyncComponent(() =>
    import('./science/EarthSystemsMission.vue'),
  ),
}

export function resolveExerciseComponent(exerciseType) {
  return exerciseRegistry[exerciseType] ?? ExerciseFallback
}

export {
  MultipleChoiceExercise,
  FlashcardExercise,
  TrigGrapherExercise,
  SpellingExercise,
  CustomSpellingExercise,
  ExponentsModule,
  ScientificNotationModule,
  AlgebraicExpressionsModule,
  FractionsBasicsModule,
  MixedNumbersModule,
  ExerciseFallback,
}
