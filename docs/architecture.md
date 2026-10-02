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
      name: '5th Grade',
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
              content: '...'
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

Views resolve entities by route params (`gradeId`, `subjectId`, `exerciseId`) against this tree. Helpers may be added under `src/data/` later, but no remote fetch layer is required for v1.
