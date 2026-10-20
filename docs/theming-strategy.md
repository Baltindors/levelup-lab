# Theming Strategy

Each grade has a distinct visual theme (colors, typography accents, and UI feel). Themes are applied via a **route-driven CSS class** on the app layout wrapper, not by swapping entire CSS frameworks.

## How It Works

1. Vue Router exposes `gradeId` on nested routes (`/grade/:gradeId/...`).
2. `AppLayout.vue` resolves the grade from mock data and applies its `theme` field (e.g. `theme-grade-5` or `theme-college-trig`) in a Vue `computed()` that depends on `route.params.gradeId`.
3. When there is no grade in the route (Home), the layout uses a neutral default class such as `theme-default`.
4. Theme CSS under `src/assets/themes/` defines CSS custom properties scoped to those classes (colors, radius, fonts).
5. Tailwind utilities consume those variables (e.g. `bg-[var(--color-primary)]`) so components stay token-based.

## Example Layout Pattern

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGrade } from '../data/mockData'

const route = useRoute()
const themeClass = computed(() => {
  const gradeId = route.params.gradeId
  if (!gradeId) return 'theme-default'
  return getGrade(gradeId)?.theme ?? 'theme-default'
})
</script>

<template>
  <div :class="['app-shell', themeClass]">
    <router-view />
  </div>
</template>
```

Do **not** build class names as `theme-grade-${gradeId}` — IDs like `college-trig` are not safe to concatenate that way. Use the grade’s `theme` field from mock data.

## Example Theme Tokens

```css
.theme-default {
  --color-primary: #475569;
  --color-primary-soft: #e2e8f0;
  --color-surface: #f8fafc;
  --color-panel: #ffffff;
  --color-text: #0f172a;
  --color-muted: #64748b;
  --radius-card: 0.75rem;
  --radius-pill: 9999px;
  --font-display: 'Trebuchet MS', 'Segoe UI', sans-serif;
  --font-body: 'Segoe UI', system-ui, sans-serif;
}

.theme-grade-5 {
  --color-primary: #ff5e1e;
  --color-primary-soft: #3a1d0e;
  --color-accent: #00e5ff;
  --color-surface: #111217;
  --color-panel: #1a1c24;
  --color-text: #f3f4f6;
  --color-muted: #9ca3af;
  --color-border: #2e3344;
  --radius-card: 0.75rem;
  --font-display: 'Bangers', Impact, sans-serif;
  /* dark shinobi academy palette — intentional for 6th grade */
}

.theme-college-trig {
  --color-primary: #4338ca;
  --color-primary-soft: #e0e7ff;
  --color-surface: #f1f5f9;
  --radius-card: 0.5rem;
  /* academic slate/indigo palette */
}
```

Shared helpers: `.theme-card` uses `--radius-card`; `.theme-pill` uses `--radius-pill`.

For shinobi-grade controls (math, science, and spelling phase bars: phase tabs, tool-mode segments, preset chips, action buttons), use [`src/assets/math-controls.css`](../src/assets/math-controls.css) — see **Control taxonomy** in [`architecture.md`](./architecture.md). Do not invent per-module amber/orange pill variants for navigation.

## Guidelines

- Prefer CSS variables over hard-coded grade colors in components.
- Keep one theme class active at a time on the layout root.
- Add a new grade theme by: (1) mock data entry with a `theme` class name, (2) matching CSS variable block, (3) optional font import.
- `theme-grade-5` is intentionally a dark shinobi theme. New grades should not copy that palette unless the grade is meant to share it.
- Avoid purple-gradient defaults unless a specific grade theme intentionally calls for them.
