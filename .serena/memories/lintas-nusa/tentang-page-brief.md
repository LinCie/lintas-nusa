# Tentang Page Design Brief (Confirmed + Post-Critique Updates)

## Feature
Single scrollable corporate credibility page at `/tentang` — digital-native, lean, NOT mirror of 18-page PDF.

## User
Prospective clients/partners/enterprise accounts evaluating LintasNusa. High-intent, task-focused.

## Primary Job
Land → "who is this company?" → "credible, coherent logistics partner" in one scroll.

## Design Direction
- Tone: Confident & measured — calm, precise, proof-first
- Aesthetic: logistics infrastructure meets modern SaaS (from .impeccable.md)
- Theme: Light-first, navy-led (navy/teal/orange/mist/charcoal from context.md)
- Avoid: generic courier-brochure, promo energy, hype, clutter

## Layout & Sections
1. Hero/Narrative scroll — full-viewport GSAP scroll-driven reveal, tagline + founding statement, abstract/map-geometry visual
2. Company Story — problem → thesis ("logistics is information discipline"), editorial layout, 3-4 paragraphs
3. Mission + LINTAS Values — 6-item values grid, acronym-driven
4. Leadership Team — portrait cards: Nadira (CEO), Bima (COO), Kevin (CTO), Marissa (CCO), Raka (VP Network)
5. CTA Strip — "Jadwalkan konsultasi operasional" → /contact

## Post-Critique Fixes Applied (2026-04-22)
- LINTAS acronym introduced in hero thesis block (L — Lugas I — Integritas N — Nyata T — Tanggap A — Andal S — Selaras)
- LINTAS acronym anchored in cerita-thesis block with annotation line
- Sticky section nav added below Header with ScrollTrigger-driven active state (Cerita — Visi & Misi — Nilai Inti — Kepemimpinan — Kontak)
- Leadership initials replaced with gradient avatar + camera-icon hover (photo-ready, not anonymous)
- Company profile metrics given geographic/contextual sub-labels (e.g., "Jawa, Sumatra, Kalimantan, Sulawesi" under 247 cities)
- Misi 01-04 numbering opacity fixed: text-navy/30 → text-navy/45 for contrast

## Key States
- Default: scroll-triggered GSAP reveals
- Mobile: single-column collapse
- Reduced motion: respects prefers-reduced-motion

## Outstanding P0
- WhatsApp link `wa.me/6281234567890` is a placeholder — replace with real number before prod deployment

## Content
All copy from docs/context.md lines 41–115.