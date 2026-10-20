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
│   │   ├── themes/          # Per-grade CSS variables / theme layers
│   │   └── math-controls.css
│   ├── components/          # Reusable UI pieces (exercises live under components/exercises)
│   ├── composables/         # Drill, XP, mastery, and progress state
│   ├── data/                # Mock grades / subjects / exercises and question pools
│   ├── layouts/             # App shell + theme wrapper
│   ├── router/              # Vue Router setup
│   ├── utils/               # Graders, generators, KaTeX, trig parser
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

`vite.config.js` currently sets `base: '/'`. The router must use:

```js
createWebHistory(import.meta.env.BASE_URL)
```

so client-side links and history mode stay aligned with Vite’s base. Do not hard-code `/` as the history base. If the site is later served from a subpath (for example GitHub project Pages at `/levelup-lab/`), change Vite `base` to that subpath and leave the router on `import.meta.env.BASE_URL`. See [Deployment](deployment.md).

## Data Store Structure

Mock data lives in `src/data/mockData.js` and follows this shape:

```js
{
  grades: [
    {
      id: 'grade-6',
      name: '6th Grade',
      theme: 'theme-grade-5', // dark shinobi academy theme
      subjects: [
        { id: 'spelling-jutsu', /* spelling-jutsu + custom-spelling exercises */ },
        { id: 'fractions-decimals', /* math-fractions-basics, math-mixed-numbers */ },
        { id: 'math-exam-100526', /* Scroll 2: three math exam modules */ },
        { id: 'linear-equations', /* Scroll 3: three linear-equation modules */ },
        { id: 'earth-systems', /* science-earth-systems */ },
      ],
    },
    {
      id: 'college-trig',
      name: 'College Trigonometry',
      theme: 'theme-college-trig',
      subjects: [
        { id: 'graphing-trig', /* trig-grapher */ },
      ],
    },
  ],
}
```

Exercise objects carry `id`, `title`, `exerciseType`, and type-specific fields (`words`, `practicePool`, `description`). Generic `multiple-choice` and `flashcard` types still resolve, but no live subject uses them.

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
| `math-linear-eq-like-terms` | `math/LikeTermsModule.vue` |
| `math-linear-eq-distributive` | `math/DistributiveEquationsModule.vue` |
| `math-linear-eq-fractions` | `math/FractionEquationsModule.vue` |
| `math-fractions-basics` | `math/FractionsBasicsModule.vue` |
| `math-mixed-numbers` | `math/MixedNumbersModule.vue` |
| `science-earth-systems` | `science/EarthSystemsMission.vue` (async) |
| anything else (e.g. `graph-interactive`) | `ExerciseFallback.vue` |

`trig-grapher` uses [`src/utils/trigSolver.js`](../src/utils/trigSolver.js) to parse `y = A f(B(x-C))+D`, compute period/phase/key points, and plot multi-segment SVG paths that break at asymptotes. The parser accepts fractional/parenthesized coefficients (e.g. `(1/2)csc(x)`, `-3/2tan(x)`), bare signs (`-sin(x)`), `x/k` arguments, and fractional midlines (`+1/2`). Formulas render with KaTeX. It is the first module built on the **Standard Math Module Pattern** below.

`math-exponents`, `math-scientific-notation`, and `math-algebraic-expressions` are the 6th Grade Scroll 2 exam modules (`math-exam-100526`). Each wraps `MathModuleShell`, uses `useMathDrill` with `stratifyBy: 'topic'`, and draws from practice pools in [`src/data/mathExam100526Pools.js`](../src/data/mathExam100526Pools.js). Trial scores flow through [`useExerciseProgress.js`](../src/composables/useExerciseProgress.js) along with every other score-based trial.

`math-linear-eq-like-terms`, `math-linear-eq-distributive`, and `math-linear-eq-fractions` are the 6th Grade Scroll 3 mission (`linear-equations`). Each wraps `MathModuleShell`, uses `useMathDrill` with `stratifyBy: 'topic'`, and draws a 10-card trial from a 15-card static pool (3 topics × 5) in [`src/data/linearEquationsPools.js`](../src/data/linearEquationsPools.js). A seal at ≥70% stores the letter rank and awards +25 academy XP once. The subject meter counts all three trials (`Y/3 TRIALS SEALED`).

`math-fractions-basics` is the Rank C fractions mission. Its 20-card pool is generated once per visit by [`src/utils/fractionGenerator.js`](../src/utils/fractionGenerator.js) (`generateFractionDrillPool`), then a 10-card drill is stratified by `topic` (`add`, `subtract`, `multiply`, `divide`). The same array stays mounted so Retry Missed Only keeps those question ids. Refreshing the page deals a new set. The finished drill emits `{ correct, score, total, passed }` and is graded like any other score-based trial.

`math-mixed-numbers` is the Rank B mixed-numbers mission on the same `fractions-decimals` subject. [`src/utils/mixedNumberGenerator.js`](../src/utils/mixedNumberGenerator.js) (`generateMixedNumberDrillPool`) deals 5 cards each for `convert`, `add-regroup`, `sub-borrow`, and `mult-div` (20 candidates). The 10-card drill is stratified by `topic`. Cards use `correctAnswer` with `$...$` choice labels so the shared multiple-choice question and breakdown components grade them. Refreshing the page deals a new set. The finished drill emits `{ correct, score, total, passed }`. A seal at ≥70% stores the letter rank and awards +25 academy XP once, the same path as the Rank C trial. The subject meter counts both exercises (`Y/2 TRIALS SEALED`).

`science-earth-systems` is the Earth Systems mission. It does **not** use `MathModuleShell` or `useMathDrill`. See **Science module pattern** below.

`spelling-jutsu` and `custom-spelling` are the language modules. See **Language module pattern** below.

Components emit `answered`. Score-based trials (Scroll 2, fractions, Earth Systems, and college trig) include numeric `{ score, total }` plus `{ correct, passed }`. `ExerciseView` calls `recordExerciseScore` for every payload that has those numbers, on every subject. Spelling emits `{ correct: true }` only, so it is not graded here. The view keeps the exercise mounted and shows a completion banner below with **Try Again** (on incorrect), **Next Exercise**, and **Back to Subject**. A first shinobi seal also shows **Trial sealed • +25 XP**. College completions do not.

## Client Storage

The app stays zero-backend. User-authored and progress state live in browser `localStorage`:

| Key | Purpose |
|-----|---------|
| `levelup_custom_spelling_words` | Custom Spelling Jutsu word/definition scroll |
| `shinobi_academy_progress_v1` | Shinobi XP flags. Spelling uses `{exerciseId}:{practice}`. Score trials on the shinobi theme use `xp:{exerciseId}` (+25 once). A legacy subject `complete` flag is still worth +100 and is not granted again. |
| `shinobi_academy_last_seen_v1` | Last animated `{ xp, level }` snapshot for GradeView XP bar / level-up celebration |
| `shinobi_spelling_mastery_v2` | Per-scope mastered word IDs for spelling practices |
| `levelup_exercise_progress_v1` | Universal score store, keyed by `exerciseId`: `{ bestScore, total, percent, gradeRank, completed, attempts, xpAwarded }` |
| `levelup_math_exam_100526_progress` | Legacy Scroll 2 store. Read once into `levelup_exercise_progress_v1` when the new key is absent, then left in place. Boolean `true` becomes Rank B (7/10). |
| `shinobi_science_mastery_earth_systems_v1` | Earth Systems per-question `{ correctStreak, attempts, mastered }` |

Full progress reset also deletes any leftover keys prefixed `shinobi_mastery_` or `shinobi_trial_`. Nothing in the current modules writes those prefixes.

Custom content and mastery survive refresh without a server. Private-mode or storage failures are ignored so sessions still work in-memory.

On Shinobi grade overview ([`GradeView.vue`](../src/views/GradeView.vue)), returning after XP gains animates the rank meter from `shinobi_academy_last_seen_v1` to the current derived totals. Crossing a level threshold fills the bar to 100%, plays `sounds/level-up.mp3` (via `import.meta.env.BASE_URL`, failures ignored), and opens [`ShinobiLevelUpModal.vue`](../src/components/common/ShinobiLevelUpModal.vue). Claiming the rank writes last-seen so refresh does not replay the celebration.

## Academy XP and grades

Rank is derived in [`useShinobiProgress.js`](../src/composables/useShinobiProgress.js). Level is `min(10, floor(totalXp / 100) + 1)`. Academy XP comes from:

| Source | When | Amount |
|--------|------|--------|
| Language Arts — Spelling (`spelling-jutsu`) | A weekly jutsu seals **Seal Matching** or **Blindfold Training** (all words correct on both passes) | **+25 XP once** per practice, flag key `{exerciseId}:{practice}` |
| Score-based trials on `theme-grade-5` | A trial's percent first reaches ≥70% (Rank B or above) | **+25 XP once**, flag key `xp:{exerciseId}` |
| Legacy Scroll 2 lump | All three Scroll 2 trials were sealed before this store existed (`leveledUp`) | **+100 XP once**, subject `complete` flag. Migrated exercises are marked `xpAwarded` so they do not also take +25. |

Custom spelling sets `award-scroll-xp` to false, so forging a personal scroll does not add XP. College Trig (`theme-college-trig`) records a letter grade and never writes `shinobi_academy_progress_v1`.

Letter ranks apply to every score-based trial: S = 100%, A = 90–99%, B = 70–89% (seal), C = 50–69%, F = below 50%. Attempts are compared by percent, so a 25-question result cannot replace a 10-card best just because the raw score is larger. A retake updates `bestScore`, `percent`, and `gradeRank` only when the new percent is greater than or equal to the stored best. `completed` stays true after the first seal. `attempts` increments on every recorded finish.

[`useExerciseProgress.js`](../src/composables/useExerciseProgress.js) keeps that record in a module-level `ref`, so navigating back to the subject updates the stamp and meter without a reload.

Subject pages for score-based exercises show the meter, a rank pill (`NOT ATTEMPTED` or `RANK {rank} • {score}/{total} ({percent}%)`), and a stamp. Grade 6 copy is `X% CHAKRA • Y/Z TRIALS SEALED`. College copy is `X% PROGRESS • Y/Z MODULES COMPLETED`. Spelling keeps mastery seals (`1/2` in training, `2/2` mastered), not letter grades.

Any new XP or grade source must update this section and the storage table in the same change. Do not award academy XP unless the grade theme is `theme-grade-5`.

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
| `math-linear-eq-like-terms` | Like-terms balance visualizer + MC drill |
| `math-linear-eq-distributive` | Signed distributive explorer + MC drill |
| `math-linear-eq-fractions` | LCD vaporize explorer + MC drill |
| `math-fractions-basics` | Rank C four-operation fractions explorer + evergreen MC drill |
| `math-mixed-numbers` | Rank B mixed-number convert, regroup, borrow, and multiply/divide explorer + evergreen MC drill |

### Conventions

- Question cards must remount per item (`:key="currentQuestion.id"` in the shell) so form state does not bleed.
- Record the answer on **Submit**; advance only when the student clicks **Next Card →**.
- Emit `answered({ correct: passed, score, total, passed })` when a full drill session completes so `ExerciseView` can record the letter rank.
- Put a `practicePool` (15+ items recommended) on the exercise object in `src/data/mockData.js` (or an imported pool file under `src/data/`).
- For multi-lesson pools, pass `stratifyBy: 'topic'` to `useMathDrill` so 10-card drills round-robin across subtopics instead of clustering.
- Double-escape LaTeX backslashes in JS pool strings (`\\frac`, `\\times`). Render with [`src/utils/mathKatex.js`](../src/utils/mathKatex.js): undelimited text stays plain prose; `$...$` / `$$...$$` segments render as KaTeX.
- Scroll 2 MC pool items may include optional `rule` (string) and `steps` (string[]) for the **Scroll Master's Breakdown** review UI in `MathMcDrillExplanation`. If `steps` is missing, the UI falls back to `explanation`. Inline math in steps/explanations must use `$...$` delimiters.

### Mandatory UI rules

- **Strict 1-Level Navigation** — The only allowed full-width tab switcher is the top-level Phase bar (math Explore vs Trial, Earth Systems Dojo Sandbox vs trial, or Spelling Study / Seal Matching / Blindfold). Do **not** nest secondary full-width tab bars inside the sandbox explorer.
- **Single-Scroll Sandbox Canvas** — All learning subtopics, tools, and examples for a module must live on one vertically scrollable page. Users scroll down for further examples; they never tab away within Explore. Earth Systems stacks its five explorers this way.
- **KaTeX overflow** — Live Equality / Live Result / numbered step cards wrap formulas in `overflow-x-auto max-w-full py-1` so long expressions scroll inside the card on ~375px viewports instead of widening the page.

#### Control taxonomy (required)

Shinobi-grade explorers (math, science, and the spelling phase bar) must use the shared styles in [`src/assets/math-controls.css`](../src/assets/math-controls.css) and helpers under [`src/components/exercises/common/`](../src/components/exercises/common/). Do **not** invent one-off amber/orange pill variants for navigation.

| Role | Classes / component | Use for | Look |
|------|---------------------|---------|------|
| **Phase Tab** | `.math-phase-tabs` + `.math-phase-tabs__btn` | Explore vs Practice (math shell and Earth Systems); Spelling phases | Full-width grid track; active = solid primary |
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

## Science module pattern

Earth Systems (`science-earth-systems`, subject `earth-systems`) is the science pattern. New science missions follow this shape unless this section is updated first.

### Core pieces

| Piece | Path |
|-------|------|
| Mission shell | [`src/components/exercises/science/EarthSystemsMission.vue`](../src/components/exercises/science/EarthSystemsMission.vue) |
| Mastery engine | [`src/composables/useScienceMasteryDrill.js`](../src/composables/useScienceMasteryDrill.js) |
| Question pool | [`src/data/scienceEarthSystemsPool.js`](../src/data/scienceEarthSystemsPool.js) (25 multiple-choice items) |

Explorers stacked on the sandbox page: Water Cycle, Rock Cycle, Atmosphere, Earth's Layers, Energy & Heat Transfer. One component per topic, one vertical page, no inner tab bar.

### Rules

- Two phases only, using `.math-phase-tabs`: **Dojo Sandbox** and the trial. Leaving an in-progress round asks for confirmation. Mastery already saved is kept; the round ends.
- A question is mastered only after **2 correct answers in a row**. A miss resets `correctStreak` to 0 and clears `mastered`.
- Each round draws up to **10 unmastered** questions, stratified by `topic`, and locks that snapshot so a card is not removed mid-round when it becomes mastered.
- The mission is complete when every pool question is mastered. Only then does it emit `{ correct: true, score: 25, total: 25, passed: true }`, which records Rank S and, on the shinobi theme, +25 XP once. Until that emit, the subject card stays `NOT ATTEMPTED`. Do not grade individual rounds; this is a 2-streak mastery engine, not a fixed-card quiz. The in-mission streak stays in `shinobi_science_mastery_earth_systems_v1`.
- Persist mastery under a dedicated `localStorage` key (`shinobi_science_mastery_earth_systems_v1` for this mission). Add the key to the storage table when a new science mission gets its own store.
- Pool items need `id`, `topic`, `question`, `options` (`{ id, label }`), `correctOptionId`, and `explanation`. `hint` and `topicLabel` are used by the review UI.

## Language module pattern

Language Arts uses one drill engine for weekly lists and custom scrolls.

### Core pieces

| Piece | Path |
|-------|------|
| Weekly drill | [`src/components/exercises/SpellingExercise.vue`](../src/components/exercises/SpellingExercise.vue) |
| Custom scroll builder | [`src/components/exercises/CustomSpellingExercise.vue`](../src/components/exercises/CustomSpellingExercise.vue) |
| Two-pass engine | [`src/composables/useTwoPassRound.js`](../src/composables/useTwoPassRound.js) |
| XP flags | [`src/composables/useShinobiProgress.js`](../src/composables/useShinobiProgress.js) |

### Phases

The only phase bar is **Study Scrolls**, **Seal Matching**, and **Blindfold Training**.

1. **Study** — read the word list (and roots, when the exercise provides them). No XP.
2. **Seal Matching** — hear the word, pick the matching seal.
3. **Blindfold Training** — hear the word, type the spelling.

### Two-pass mastery

- A round is two passes over the same batch. A word counts as mastered only when it is correct on **both** passes.
- The batch is the unmastered words. When two or fewer remain and some words are already mastered, up to three mastered words are mixed in as decoys. A decoy that misses a pass loses mastery.
- Free drill reshuffles the full list and does not write mastery.
- Word mastery is stored in `shinobi_spelling_mastery_v2`, keyed by mastery scope then practice (`seal-matching` or `blindfold-training`).
- Weekly lists: the legacy exercise `weekly-spelling-jutsu` uses mastery scope `spelling-jutsu`. Later weeklies use their own `exercise.id` so lists do not share mastered ids.
- XP is separate from word mastery. Sealing every word in a weekly practice writes `{exerciseId}:seal-matching` or `{exerciseId}:blindfold-training` on subject `spelling-jutsu` and awards +25 XP once. Retakes do not award it again.

### Custom spelling

- The builder stores the word list in `levelup_custom_spelling_words`. At least **3** words with definitions are required before the scroll can be sealed.
- Once sealed, it remounts `SpellingExercise` with mastery scope `custom-spelling-jutsu` and `award-scroll-xp` false. Custom practice never writes weekly XP flags and never overwrites a weekly list's mastered ids.

### Exercise data

Weekly `spelling-jutsu` exercises supply `words` (`id`, `word`, `definition`, and optional `pos`, `sentence`, `root`) and optional `roots` (`root`, `meaning`, `origin`). Register each new weekly list as its own exercise id under subject `spelling-jutsu`.

