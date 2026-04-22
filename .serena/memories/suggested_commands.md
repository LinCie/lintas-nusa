Lintas Nusa is a small Astro marketing site for LintasNusa Logistics. Primary route content currently lives in src/pages/index.astro, shared shells live in src/layouts/, global styling in src/styles/global.css, and static assets in public/. Keep new pages in src/pages/, reusable UI in src/components/ if added, and align copy/design with docs/context.md and .impeccable.md.

Use Bun for package management and scripts. Use tabs in .astro files. Prefer clear, minimal components and keep copy aligned with docs/context.md. Layouts/components use PascalCase.astro; route filenames follow URL structure. Keep shared styles in src/styles/global.css and prefer design tokens and utility-driven styling over ad hoc inline rules. Existing stack: Astro 6, Tailwind CSS v4, GSAP for animations, ESLint, Prettier.

Install deps: bun install
Run dev server: bun dev
Production build: bun build
Preview build: bun preview
Lint: bun run lint
Format: bun run format
Format check: bun run format:check