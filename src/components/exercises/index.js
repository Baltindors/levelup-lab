import { defineAsyncComponent } from 'vue'
import MultipleChoiceExercise from './MultipleChoiceExercise.vue'
import FlashcardExercise from './FlashcardExercise.vue'
import TrigGrapherExercise from './TrigGrapherExercise.vue'
import SpellingExercise from './SpellingExercise.vue'
import CustomSpellingExercise from './CustomSpellingExercise.vue'
import ExponentsModule from './math/ExponentsModule.vue'
import ScientificNotationModule from './math/ScientificNotationModule.vue'
import AlgebraicExpressionsModule from './math/AlgebraicExpressionsModule.vue'
import LikeTermsModule from './math/LikeTermsModule.vue'
import DistributiveEquationsModule from './math/DistributiveEquationsModule.vue'
import FractionEquationsModule from './math/FractionEquationsModule.vue'
import FractionsBasicsModule from './math/FractionsBasicsModule.vue'
import MixedNumbersModule from './math/MixedNumbersModule.vue'
import TrigVerifyingModule from './math/TrigVerifyingModule.vue'
import TrigSumDiffModule from './math/TrigSumDiffModule.vue'
import TrigDoubleHalfModule from './math/TrigDoubleHalfModule.vue'
import TrigEquationsModule from './math/TrigEquationsModule.vue'
import Topic3LikeTermsModule from './math/Topic3LikeTermsModule.vue'
import Topic3BothSidesModule from './math/Topic3BothSidesModule.vue'
import Topic3MultistepModule from './math/Topic3MultistepModule.vue'
import Topic3SolutionTypesModule from './math/Topic3SolutionTypesModule.vue'
import Topic3InequalitiesModule from './math/Topic3InequalitiesModule.vue'
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
  'math-linear-eq-like-terms': LikeTermsModule,
  'math-linear-eq-distributive': DistributiveEquationsModule,
  'math-linear-eq-fractions': FractionEquationsModule,
  'math-fractions-basics': FractionsBasicsModule,
  'math-mixed-numbers': MixedNumbersModule,
  'math-trig-verifying': TrigVerifyingModule,
  'math-trig-sum-diff': TrigSumDiffModule,
  'math-trig-double-half': TrigDoubleHalfModule,
  'math-trig-equations': TrigEquationsModule,
  'math-topic3-like-terms': Topic3LikeTermsModule,
  'math-topic3-both-sides': Topic3BothSidesModule,
  'math-topic3-multistep': Topic3MultistepModule,
  'math-topic3-solution-types': Topic3SolutionTypesModule,
  'math-topic3-inequalities': Topic3InequalitiesModule,
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
  LikeTermsModule,
  DistributiveEquationsModule,
  FractionEquationsModule,
  FractionsBasicsModule,
  MixedNumbersModule,
  TrigVerifyingModule,
  TrigSumDiffModule,
  TrigDoubleHalfModule,
  TrigEquationsModule,
  Topic3LikeTermsModule,
  Topic3BothSidesModule,
  Topic3MultistepModule,
  Topic3SolutionTypesModule,
  Topic3InequalitiesModule,
  ExerciseFallback,
}
