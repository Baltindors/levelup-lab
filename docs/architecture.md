# Architecture

Frontend-only Vue 3 app for a kids educational portal. All content is static mock data; there is no backend.

## Folder Structure

```text
levelup-lab/
├── .cursor/rules/           # Cursor project rules
├── .github/workflows/       # GitHub Pages deploy
├── docs/                    # Project documentation
├── scripts/                 # Build helpers (e.g. copy-404.js)
├── public/                  # Static assets copied as-is
├── src/
│   ├── assets/
│   │   └── themes/          # Per-grade CSS variables / theme layers
│   ├── components/          # Reusable UI pieces
│   ├── data/                # Mock grades / subjects / exercises
│   ├── layouts/             # App shell + theme wrapper
│   ├── router/              # Vue Router setup
│   ├── views/               # Route-level pages
│   ├── App.vue
│   ├── main.js
│   └── style.css            # Tailwind entry + shared tokens
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Routing Schema

| Path | View | Purpose |
|------|------|---------|
| `/` | `Home.vue` | Grade selection dashboard |
| `/grade/:gradeId` | `GradeView.vue` | Subjects for a grade |
| `/grade/:gradeId/subject/:subjectId` | `SubjectView.vue` | Exercises for a subject |
| `/grade/:gradeId/subject/:subjectId/exercise/:exerciseId` | `ExerciseView.vue` | Single exercise |

Routes are nested under a layout that applies the active grade theme class.

### Router base alignment

Vite is configured with `base: '/levelup-lab/'` for GitHub project Pages. The router must use:

```js
createWebHistory(import.meta.env.BASE_URL)
```

so client-side links and history mode stay aligned with that base path. Do not hard-code `/` as the history base while Vite `base` is a subpath.

## Data Store Structure

Mock data lives in `src/data/mockData.js` and follows this shape:

```js
{
  grades: [
    {
      id: 'grade-5',
      name: '6th Grade',
      theme: 'theme-grade-5',
      subjects: [
        {
          id: 'fractions-decimals',
          name: 'Math — Fractions & Decimals',
          exercises: [
            {
              id: 'fraction-pizza-slices',
              title: 'Pizza Slice Fractions',
              exerciseType: 'multiple-choice', // multiple-choice | flashcard | graph-interactive
              content: '...',
              question: '...',
              options: [{ id: 'a', label: '...' }],
              correctOptionId: 'a',
              // flashcard fields when exerciseType === 'flashcard':
              // front: '...', back: '...'
            }
          ]
        }
      ]
    },
    {
      id: 'college-trig',
      name: 'College Trigonometry',
      theme: 'theme-college-trig',
      subjects: [/* ... */]
    }
  ]
}
```

Views resolve entities by route params (`gradeId`, `subjectId`, `exerciseId`) against this tree. Helpers: `getGrade`, `getSubject`, `getExercise`, `getNextExercise`. No remote fetch layer is required for v1.

## Exercise Engine

`ExerciseView.vue` loads the active exercise from mock data and renders it with a dynamic component from `src/components/exercises/index.js`:

| `exerciseType` | Component |
|----------------|-----------|
| `multiple-choice` | `MultipleChoiceExercise.vue` |
| `flashcard` | `FlashcardExercise.vue` |
| `trig-grapher` | `TrigGrapherExercise.vue` |
| anything else (e.g. `graph-interactive`) | `ExerciseFallback.vue` |

`trig-grapher` uses [`src/utils/trigSolver.js`](../src/utils/trigSolver.js) to parse `y = A f(B(x-C))+D`, compute period/phase/key points, and plot multi-segment SVG paths that break at asymptotes. Formulas render with KaTeX. It is the first module built on the **Standard Math Module Pattern** below.

Components emit `answered` with `{ correct: boolean }`. The view keeps the exercise mounted (inputs disabled) and shows a completion banner below with **Try Again** (on incorrect), **Next Exercise**, and **Back to Subject**.

## Standard Math Module Pattern

Every math topic should follow the same two-phase UX:

1. **Explore & Learn** — untimed sandbox (calculators, visualizers, step solvers).
2. **Practice Drill** — standardized 10-card quiz with scoring, feedback, missed-item explanations, and **Retry Missed Only**.

### Core pieces

| Piece | Path |
|-------|------|
| Drill state | [`src/composables/useMathDrill.js`](../src/composables/useMathDrill.js) |
| Shell UI | [`src/components/exercises/common/MathModuleShell.vue`](../src/components/exercises/common/MathModuleShell.vue) |

### Required slots

Future modules (e.g. 6th Grade Fractions) must wrap `MathModuleShell` and provide:

- `#explorer` — sandbox tool for the topic
- `#question` — props/bindings: `question`, `submit(studentAnswers)`, `feedback`
- `#explanation` — binding: `item` (`{ question, studentAnswers, isCorrect }`) for missed review

### Conventions

- Question cards must remount per item (`:key="currentQuestion.id"` in the shell) so form state does not bleed.
- Record the answer on **Submit**; advance only when the student clicks **Next Card →**.
- Emit `answered({ correct: passed })` when a full drill session completes.
- Put a `practicePool` (15+ items recommended) on the exercise object in `src/data/mockData.js`.

### Example skeleton (Fractions)

```vue
<MathModuleShell :grade-answer="gradeFractions" ...>
  <template #explorer><FractionExplorer /></template>
  <template #question="ctx"><FractionDrillQuestion v-bind="ctx" /></template>
  <template #explanation="{ item }"><FractionDrillExplanation :item="item" /></template>
</MathModuleShell>
```
