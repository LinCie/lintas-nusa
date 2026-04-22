# Repository Guidelines

## Project Structure & Module Organization
This repository is a small Astro site for **LintasNusa Logistics**.

- `src/pages/`: route files. `src/pages/index.astro` is the current homepage.
- `src/layouts/`: shared page shells such as `Layout.astro`.
- `src/styles/`: global styling. `global.css` imports Tailwind v4.
- `public/`: static assets such as favicons.
- `docs/context.md`: source-of-truth brand and product context.
- `.impeccable.md`: design context used to keep UI work aligned with the brand.

Keep new pages in `src/pages/`, reusable UI in `src/components/` if added, and static assets in `public/`.

## Build, Test, and Development Commands
Use Bun for package management and scripts.

- `bun install`: install dependencies.
- `bun dev`: start the Astro dev server.
- `bun run build`: create a production build in `dist/`.
- `bun preview`: serve the production build locally.
- `bun run lint`: run ESLint on `src/**/*.{js,astro}`.
- `bun run format`: format `src/**/*.{js,astro}` with Prettier.
- `bun run format:check`: verify formatting without rewriting files.

## Mandatory Styling & Animation Rules

**Tailwind is non-negotiable.** Use Tailwind CSS for all styling under any circumstances. Only deviate from Tailwind when a problem cannot be solved with Tailwind alone.

**GSAP is required for all animations.** Use GSAP for any animation needs, even if it feels like overkill. Do not use CSS animations, Web Animations API, or other animation libraries.

## Coding Style & Naming Conventions
Use tabs in `.astro` files, matching the existing codebase. Prefer clear, minimal components and keep copy aligned with `docs/context.md`.

- Pages and layouts: `PascalCase.astro` for layouts/components, route filenames based on URL structure.
- CSS: keep shared styles in `src/styles/global.css`; prefer design tokens and utility-driven styling over ad hoc inline rules.
- Tooling: ESLint (`eslint.config.mjs`) and Prettier enforce style. Run lint and format checks before opening a PR.

## Testing Guidelines
There is no automated test suite configured yet. Until one exists, treat the following as required verification:

- `bun run lint`
- `bun run format:check`
- `bun run build`

If you add tests later, place them near the feature or in a dedicated `tests/` directory and document the command here.

## Commit & Pull Request Guidelines
Current history uses short, imperative commit subjects with Conventional Commit prefixes, for example:

- `feat: setup prettier, eslint, tailwind`

Follow that pattern when possible: `feat:`, `fix:`, `docs:`, `refactor:`. Keep PRs focused, explain user-visible changes, link relevant issues, and include screenshots for UI updates.
