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
        { id: 'fractions-decimals', /* math-fractions-basics */ },
        { id: 'math-exam-100526', /* Scroll 2: three math exam modules */ },
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
| `math-fractions-basics` | `math/FractionsBasicsModule.vue` |
| `science-earth-systems` | `science/EarthSystemsMission.vue` (async) |
| anything else (e.g. `graph-interactive`) | `ExerciseFallback.vue` |

`trig-grapher` uses [`src/utils/trigSolver.js`](../src/utils/trigSolver.js) to parse `y = A f(B(x-C))+D`, compute period/phase/key points, and plot multi-segment SVG paths that break at asymptotes. The parser accepts fractional/parenthesized coefficients (e.g. `(1/2)csc(x)`, `-3/2tan(x)`), bare signs (`-sin(x)`), `x/k` arguments, and fractional midlines (`+1/2`). Formulas render with KaTeX. It is the first module built on the **Standard Math Module Pattern** below.

`math-exponents`, `math-scientific-notation`, and `math-algebraic-expressions` are the 6th Grade Scroll 2 exam modules (`math-exam-100526`). Each wraps `MathModuleShell`, uses `useMathDrill` with `stratifyBy: 'topic'`, and draws from practice pools in [`src/data/mathExam100526Pools.js`](../src/data/mathExam100526Pools.js). Trial scores flow through [`useMathExamProgress.js`](../src/composables/useMathExamProgress.js): each attempt stores peak `bestScore`, letter rank (S/A/B/C/F), and a sealed `completed` flag (≥70%). Best score never downgrades on retake. Sealing all three trials awards **+100 XP once** (see Academy XP). [`SubjectView.vue`](../src/views/SubjectView.vue) shows a Chakra progress bar, best-trial pills, and anime rank stamps only when the subject is `math-exam-100526`.

`math-fractions-basics` is the Rank C fractions mission. Its 20-card pool is generated once per visit by [`src/utils/fractionGenerator.js`](../src/utils/fractionGenerator.js) (`generateFractionDrillPool`), then a 10-card drill is stratified by `topic` (`add`, `subtract`, `multiply`, `divide`). The same array stays mounted so Retry Missed Only keeps those question ids. Refreshing the page deals a new set. Fractions do not persist a letter grade and do not award academy XP.

`science-earth-systems` is the Earth Systems mission. It does **not** use `MathModuleShell` or `useMathDrill`. See **Science module pattern** below.

`spelling-jutsu` and `custom-spelling` are the language modules. See **Language module pattern** below.

Components emit `answered`. Scroll 2 math modules include `{ correct, score, total, passed }`. `ExerciseView` calls `recordExerciseScore` only when the subject id is `math-exam-100526`. Other subjects may emit a score (Earth Systems emits `{ correct: true, score: 25, total: 25, passed: true }` when the mission is mastered) and that payload is ignored for grades and XP. The view keeps the exercise mounted and shows a completion banner below with **Try Again** (on incorrect), **Next Exercise**, and **Back to Subject**.

## Client Storage

The app stays zero-backend. User-authored and progress state live in browser `localStorage`:

| Key | Purpose |
|-----|---------|
| `levelup_custom_spelling_words` | Custom Spelling Jutsu word/definition scroll |
| `shinobi_academy_progress_v1` | Shinobi scroll / trial completion flags (XP and rank are derived) |
| `shinobi_academy_last_seen_v1` | Last animated `{ xp, level }` snapshot for GradeView XP bar / level-up celebration |
| `shinobi_spelling_mastery_v2` | Per-scope mastered word IDs for spelling practices |
| `levelup_math_exam_100526_progress` | Scroll 2 per-exercise scores/ranks (`bestScore`, `gradeRank`, `completed`) + one-time level-up guard; legacy boolean `true` normalizes to Rank B (70%) |
| `shinobi_science_mastery_earth_systems_v1` | Earth Systems per-question `{ correctStreak, attempts, mastered }` |

Full progress reset also deletes any leftover keys prefixed `shinobi_mastery_` or `shinobi_trial_`. Nothing in the current modules writes those prefixes.

Custom content and mastery survive refresh without a server. Private-mode or storage failures are ignored so sessions still work in-memory.

On Shinobi grade overview ([`GradeView.vue`](../src/views/GradeView.vue)), returning after XP gains animates the rank meter from `shinobi_academy_last_seen_v1` to the current derived totals. Crossing a level threshold fills the bar to 100%, plays `sounds/level-up.mp3` (via `import.meta.env.BASE_URL`, failures ignored), and opens [`ShinobiLevelUpModal.vue`](../src/components/common/ShinobiLevelUpModal.vue). Claiming the rank writes last-seen so refresh does not replay the celebration.

## Academy XP and grades

Rank is derived in [`useShinobiProgress.js`](../src/composables/useShinobiProgress.js). Level is `min(10, floor(totalXp / 100) + 1)`. Only two sources add XP:

| Source | When | Amount |
|--------|------|--------|
| Language Arts — Spelling (`spelling-jutsu`) | A weekly jutsu seals **Seal Matching** or **Blindfold Training** (all words correct on both passes) | **+25 XP once** per practice, flag key `{exerciseId}:{practice}` |
| Scroll 2 (`math-exam-100526`) | All three trials are sealed at ≥70% | **+100 XP once**, via the subject `complete` flag |

Custom spelling sets `award-scroll-xp` to false, so forging a personal scroll does not add XP. Fractions, Earth Systems, and college trig do not set `complete` and do not add XP.

Letter ranks (S ≥100%, A ≥90%, B ≥70%, C ≥50%, otherwise F) exist only on Scroll 2. Spelling shows mastery seals (`1/2` in training, `2/2` mastered), not letter grades.

Any new XP or grade source must update this section and the storage table in the same change. Do not award academy XP from a drill emit alone; `ExerciseView` only persists scores for `math-exam-100526`.

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
| `math-fractions-basics` | Rank C four-operation fractions explorer + evergreen MC drill |

### Conventions

- Question cards must remount per item (`:key="currentQuestion.id"` in the shell) so form state does not bleed.
- Record the answer on **Submit**; advance only when the student clicks **Next Card →**.
- Emit `answered({ correct: passed, score, total, passed })` when a full drill session completes (Scroll 2 modules include score fields for `recordExerciseScore`).
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
- The mission is complete when every pool question is mastered. That emits `answered` and plays the level-up sound. It does **not** write a letter grade or academy XP.
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

