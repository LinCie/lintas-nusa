# Swup + GSAP route transition pattern

Use this pattern when adding new pages that should participate in the current Astro + Swup transition system.

## Current architecture
- `@swup/astro` is configured in `astro.config.mjs` with `theme: false`, `animationClass: false`, `globalInstance: true`, `reloadScripts: false`.
- Global runtime lives in `src/scripts/site-runtime.ts` and `src/scripts/swup-runtime.ts`.
- Transition overlay markup lives in `src/layouts/Layout.astro` as `#route-transition`.
- Transition styles live in `src/styles/global.css`.
- Page-specific content animation must target `.route-stage`, not the whole `main` container.

## Required structure for a new page
1. Render the page inside `Layout.astro`.
2. Keep any fixed chrome that must stay pinned during transitions OUTSIDE `.route-stage`.
   Examples: fixed header, fixed section nav.
3. Wrap the page content that should animate during route changes in:
   - `<div class="route-stage" data-page-view="<page-key>"> ... </div>`
4. Use a unique `data-page-view` value for the page.

## Runtime rule
- `src/scripts/site-runtime.ts` detects the current page from `[data-page-view]`, not from `body`, because Swup does not replace `<body>`.
- If a new page needs its own init function, add a new branch in `runInitializers()` keyed by the new `data-page-view`.

## Page-specific animation module pattern
- Put page init logic in `src/scripts/<page-name>.ts`.
- Export an initializer that returns a cleanup function.
- Guard with a selector for the swapped page content, e.g. `.route-stage[data-page-view="pricing"]`.
- Use `gsap.matchMedia()` and return `mm.revert()` in cleanup.
- Remove any event listeners in cleanup.
- Do not rely on inline `<script>` tags inside Astro pages/components for page behavior; Swup script reloading is disabled.

## Important pitfalls already hit
- Do NOT animate the whole `main[data-swup-container]` if fixed children live inside it. That breaks `position: fixed` during transitions.
  Animate `.route-stage` instead.
- Do NOT rely on `body[data-page]` for page detection after Swup navigation. Body persists across visits.
- Do NOT leave page behavior in inline Astro scripts if it needs to survive Swup navigation.
- If a fixed element appears above the transition overlay, check `#route-transition` z-index in `global.css`.

## If adding another fixed in-page nav
- Place it outside `.route-stage`.
- Keep its color/state logic inside the page-specific initializer module.
- Make sure cleanup removes listeners and ScrollTriggers so leaving and re-entering the page works.

## Minimal checklist for a new page
- Add `.route-stage` wrapper with `data-page-view`.
- Add page initializer module returning cleanup.
- Register it in `site-runtime.ts`.
- Keep fixed UI outside `.route-stage`.
- Verify route transition in both directions.
- Verify leaving the page and returning still re-runs nav/scroll state correctly.