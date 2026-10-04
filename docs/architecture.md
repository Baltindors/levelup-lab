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
      id: 'grade-6',
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
| `spelling-jutsu` | `SpellingExercise.vue` |
| `custom-spelling` | `CustomSpellingExercise.vue` |
| `math-exponents` | `math/ExponentsModule.vue` |
| `math-scientific-notation` | `math/ScientificNotationModule.vue` |
| `math-algebraic-expressions` | `math/AlgebraicExpressionsModule.vue` |
| anything else (e.g. `graph-interactive`) | `ExerciseFallback.vue` |

`trig-grapher` uses [`src/utils/trigSolver.js`](../src/utils/trigSolver.js) to parse `y = A f(B(x-C))+D`, compute period/phase/key points, and plot multi-segment SVG paths that break at asymptotes. The parser accepts fractional/parenthesized coefficients (e.g. `(1/2)csc(x)`, `-3/2tan(x)`), bare signs (`-sin(x)`), `x/k` arguments, and fractional midlines (`+1/2`). Formulas render with KaTeX. It is the first module built on the **Standard Math Module Pattern** below.

`math-exponents`, `math-scientific-notation`, and `math-algebraic-expressions` are the 6th Grade Scroll 2 exam modules. Each wraps `MathModuleShell`, uses `useMathDrill` with `stratifyBy: 'topic'`, and draws from practice pools in [`src/data/mathExam100526Pools.js`](../src/data/mathExam100526Pools.js). Trial scores flow through [`useMathExamProgress.js`](../src/composables/useMathExamProgress.js): each attempt stores peak `bestScore`, letter rank (S/A/B/C/F), and a sealed `completed` flag (≥70%). Best score never downgrades on retake. Completing all three sealed trials awards +1 Shinobi level once. [`SubjectView.vue`](../src/views/SubjectView.vue) shows a Chakra progress bar plus topic badges and anime rank stamps when the subject is `math-exam-100526`.

`custom-spelling` wraps the spelling drill with a local scroll builder. Once sealed, it remounts `SpellingExercise` with the student’s word list and an isolated mastery scope so weekly jutsu progress is not overwritten.

Components emit `answered` with `{ correct: boolean }`. Scroll 2 math modules also include `{ score, total, passed }`; `ExerciseView` calls `recordExerciseScore` on every finished trial. The view keeps the exercise mounted (inputs disabled) and shows a completion banner below with **Try Again** (on incorrect), **Next Exercise**, and **Back to Subject**.

## Client Storage

The app stays zero-backend. User-authored and progress state live in browser `localStorage`:

| Key | Purpose |
|-----|---------|
| `levelup_custom_spelling_words` | Custom Spelling Jutsu word/definition scroll |
| `shinobi_academy_progress_v1` | Shinobi scroll / trial completion flags |
| `shinobi_spelling_mastery_v2` | Per-scope mastered word IDs for spelling practices |
| `levelup_math_exam_100526_progress` | Scroll 2 per-exercise scores/ranks (`bestScore`, `gradeRank`, `completed`) + one-time level-up guard; legacy boolean `true` normalizes to Rank B (70%) |

Custom content and mastery survive refresh without a server. Private-mode or storage failures are ignored so sessions still work in-memory.

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

Modules must wrap `MathModuleShell` and provide:

- `#explorer` — sandbox tool for the topic
- `#question` — props/bindings: `question`, `submit(studentAnswers)`, `feedback`
- `#explanation` — binding: `item` (`{ question, studentAnswers, isCorrect }`) for missed review

### Canonical examples

| `exerciseType` | Module |
|----------------|--------|
| `trig-grapher` | College Trig grapher + typed drill |
| `math-exponents` | Integer exponent laws (explorer + MC drill) |
| `math-scientific-notation` | Decimal-shift visualizer + MC drill |
| `math-algebraic-expressions` | Area-model distribute/factor + MC drill |

### Conventions

- Question cards must remount per item (`:key="currentQuestion.id"` in the shell) so form state does not bleed.
- Record the answer on **Submit**; advance only when the student clicks **Next Card →**.
- Emit `answered({ correct: passed, score, total, passed })` when a full drill session completes (Scroll 2 modules include score fields for `recordExerciseScore`).
- Put a `practicePool` (15+ items recommended) on the exercise object in `src/data/mockData.js` (or an imported pool file under `src/data/`).
- For multi-lesson pools, pass `stratifyBy: 'topic'` to `useMathDrill` so 10-card drills round-robin across subtopics instead of clustering.
- Double-escape LaTeX backslashes in JS pool strings (`\\frac`, `\\times`). Render with [`src/utils/mathKatex.js`](../src/utils/mathKatex.js): undelimited text stays plain prose; `$...$` / `$$...$$` segments render as KaTeX.
- Scroll 2 MC pool items may include optional `rule` (string) and `steps` (string[]) for the **Scroll Master's Breakdown** review UI in `MathMcDrillExplanation`. If `steps` is missing, the UI falls back to `explanation`. Inline math in steps/explanations must use `$...$` delimiters.

### Mandatory UI rules

- **Strict 1-Level Navigation** — The only allowed full-width tab switcher is the top-level Phase bar (`Dojo Sandbox / Practice Kata` vs `10-Chakra Trial`, or Spelling Study/Match/Spell). Do **not** nest secondary full-width tab bars inside the sandbox explorer.
- **Single-Scroll Sandbox Canvas** — All learning subtopics, tools, and examples for a module must live on one vertically scrollable page. Users scroll down for further examples; they never tab away within Explore.
- **KaTeX overflow** — Live Equality / Live Result / numbered step cards wrap formulas in `overflow-x-auto max-w-full py-1` so long expressions scroll inside the card on ~375px viewports instead of widening the page.

#### Control taxonomy (required)

All grade-5 / Scroll 2 explorers must use the shared styles in [`src/assets/math-controls.css`](../src/assets/math-controls.css) and helpers under [`src/components/exercises/common/`](../src/components/exercises/common/). Do **not** invent one-off amber/orange pill variants for navigation.

| Role | Classes / component | Use for | Look |
|------|---------------------|---------|------|
| **Phase Tab** | `.math-phase-tabs` + `.math-phase-tabs__btn` | Explore vs Practice (shell); Spelling phases | Full-width grid track; active = solid primary |
| **Segmented Tool Mode** | `MathSegmentedControl` (`.math-segment`) | Laws, Distribute/Factor, ×÷+−, ±GCF | Inline rounded track; active = solid primary |
| **Preset Chip** | `MathPresetChip` (`.math-chip`) | Load example inputs | Loose chip row; active = solid primary; inactive = slate border — **never amber** |
| **Action Button** | `.math-btn` / `--primary` / `--ghost` | Submit, Next, Start Drill | Large CTA (`min-h-11`) |

Amber/emerald pills remain reserved for Scroll Master callouts and status badges (e.g. Valid Scientific Notation), not for presets or mode switches.

### Example skeleton (Scroll 2 exponents)

```vue
<MathModuleShell :grade-answer="gradeMc" ...>
  <template #explorer><ExponentsExplorer /></template>
  <template #question="ctx"><MathMcDrillQuestion v-bind="ctx" /></template>
  <template #explanation="{ item }"><MathMcDrillExplanation :item="item" /></template>
</MathModuleShell>
```

