# Deployment (GitHub Pages)

This project is a static Vite + Vue site deployed with GitHub Actions to GitHub Pages.

## Prerequisites

1. Push the repo to GitHub (repository name expected: `levelup-lab` for the default base path).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.

## Vite Base Path

`vite.config.js` uses:

```js
base: '/levelup-lab/'
```

That matches project Pages URLs like `https://<user>.github.io/levelup-lab/`.

### Custom domain

If you later attach a custom domain at the site root, change `base` to `'/'` and redeploy. Keep the router on `createWebHistory(import.meta.env.BASE_URL)` so it continues to follow Vite’s base automatically.

## SPA Refresh Fix (Required)

Vue Router uses **HTML5 history mode** (`createWebHistory`). GitHub Pages does not rewrite unknown paths to `index.html`, so refreshing a nested URL such as `/levelup-lab/grade/1` would normally 404.

**Fix used by this project:** after `vite build`, copy `dist/index.html` to `dist/404.html`. GitHub Pages serves `404.html` for missing paths, which loads the Vue app; the client router then resolves the correct route.

This is implemented in `scripts/copy-404.js` and wired into the `build` script in `package.json`. Do not switch to `createWebHashHistory` unless you deliberately want hash URLs.

## Router Alignment

```js
createWebHistory(import.meta.env.BASE_URL)
```

`import.meta.env.BASE_URL` mirrors Vite’s `base`, so asset URLs and client routes stay in sync on project Pages.

## GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

On every push to `main`:

1. Check out the repo
2. Set up Node
3. `npm ci`
4. `npm run build` (includes the 404.html copy)
5. Upload `dist/` and deploy with `actions/deploy-pages`

Required workflow permissions: `contents: read`, `pages: write`, `id-token: write`.

## Local Verification

```bash
npm install
npm run build
npm run preview
```

Confirm `dist/404.html` exists after build and that nested routes work under the configured base.
