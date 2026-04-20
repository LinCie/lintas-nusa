# Agent Workflow

Use this workflow when the environment can read and write files.

## 1. Inspect before editing

Read the target passage and enough surrounding context to answer:
- Who is the reader?
- What is this text supposed to accomplish?
- Which terms are fixed and must not change?
- Is the prose user-facing, internal, legal, instructional, or decorative?

## 2. Decide the edit scope

Prefer the narrowest useful scope:
- selected text
- one component or section
- one file

Avoid broad repo-wide rewrites unless the user asked for them.

## 3. Protect non-prose regions

Do not alter:
- code behavior
- identifiers
- imports
- types
- schemas
- tests
- placeholders and interpolation tokens
- localization keys
- URLs unless correcting visible anchor text only

Be careful inside JSX, TSX, markdown tables, and JSON strings.

## 4. Rewrite in place

Make the prose edit directly instead of producing a detached suggestion when the tool can write files.

## 5. Re-read the edited region

Confirm that:
- the file still parses syntactically
- line breaks and indentation remain sane
- text still matches nearby terminology
- no supported claim became unsupported

## 6. Report the change

Return a short summary:

### changes made
Name the main edit categories.
Examples: removed filler, simplified openings, replaced vague claims with context-specific wording, varied repetitive cadence.

### why
Explain the effect on clarity, specificity, and naturalness.

### notes
Use only when needed.
Examples: left legal copy untouched, preserved product terminology, one sentence still needs product input.
