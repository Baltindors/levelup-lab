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
  --color-primary: #059669;
  --color-primary-soft: #fef3c7;
  --color-surface: #ecfdf5;
  --radius-card: 1.25rem;
  /* playful emerald/amber palette */
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

## Guidelines

- Prefer CSS variables over hard-coded grade colors in components.
- Keep one theme class active at a time on the layout root.
- Add a new grade theme by: (1) mock data entry with a `theme` class name, (2) matching CSS variable block, (3) optional font import.
- Avoid dark-mode-first or purple-gradient defaults unless a specific grade theme intentionally calls for them.
