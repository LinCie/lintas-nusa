---
name: humanize-text
description: analyze prose in pasted text or source files, identify likely ai-generated or under-specified writing patterns, rewrite the text into clearer and more natural human prose, and summarize the changes. use when the user asks to humanize text, reduce ai slop, make copy sound less robotic, improve flow or clarity, or revise user-facing prose inside markdown, docs, emails, prompts, blog drafts, comments, jsx or tsx strings, and similar files without changing code behavior.
---

# Humanize Text

## Overview

Use this skill to turn stiff, generic, over-signposted prose into natural, specific, readable writing.
Default to a balanced rewrite: preserve meaning, structure, and factual claims where possible, but improve rhythm, specificity, sentence flow, and information density.

## Workflow

Follow this sequence:

1. Read the full target before editing.
2. Diagnose likely AI-style patterns and clarity problems. Use `references/ai-slop-signals.md`.
3. Choose the smallest rewrite that materially improves naturalness and readability.
4. Rewrite the text directly when write tools are available.
5. Report what changed and why using the summary format below.

## Diagnosis Rules

Do not claim certainty that text is AI-generated.
Treat "ai slop" as a cluster of surface signals and writing weaknesses, not authorship proof.

Look for patterns such as:
- generic opening or closing sentences that add little information
- repetitive sentence shape or cadence
- heavy use of signposting transitions such as "moreover," "furthermore," or "in conclusion"
- abstract nouns and vague claims where concrete detail should exist
- filler, hedging, or intensity words that do not change meaning
- repeated points phrased in slightly different ways
- polished but context-thin copy that sounds safe rather than specific

Use `references/ai-slop-signals.md` for the fuller checklist.

## Rewrite Rules

Apply these constraints on every pass:

- Preserve the original meaning unless the text is unclear, self-contradictory, or obviously padded.
- Preserve names, numbers, links, product terms, API names, legal language, and other fixed strings unless the user asked for substantive rewriting.
- Prefer concrete nouns and strong verbs over abstract phrasing.
- Cut filler before changing substance.
- Replace generic claims with specifics only when the surrounding context supports them.
- Vary sentence length naturally, but do not chase variation for its own sake.
- Lead with the point instead of throat-clearing.
- Keep the author's certainty level honest. Do not add fake confidence, fake doubt, fake anecdotes, fake typos, or fake personal voice.
- Do not inject slang, emojis, humor, or deliberate mistakes just to seem human.

Use `references/humanization-playbook.md` for tactics.

## File Editing Rules

When the target is a file in an agentic coding environment:

- Read enough surrounding context to understand what the text is doing.
- Edit prose only. Do not change executable logic, identifiers, imports, types, selectors, routes, schemas, or tests unless the user explicitly asked for that.
- Preserve formatting, markup, JSX structure, markdown structure, localization keys, placeholders, and escaping.
- If the prose appears in UI strings, keep terminology consistent across nearby components.
- If the file mixes prose and code, keep the edit narrowly scoped to the prose-bearing regions.
- If a sentence is ambiguous because of missing product or feature context, infer only from nearby text. Do not invent unsupported details.

Use `references/agent-workflow.md` for operational guidance.

## Output Contract

When write tools are available:
1. Edit the target directly.
2. Return a concise summary with these sections:
   - `changes made`
   - `why`
   - `notes` (only when something was left unchanged on purpose or still needs human input)

When write tools are not available:
1. Return the revised text first.
2. Then provide the same summary sections.

Keep the summary short and concrete. Explain categories of edits, not every sentence-level micro-change.

## Defaults

Use these defaults unless the user overrides them:
- mode: balanced
- scope: general prose
- priority order: clarity -> specificity -> natural rhythm -> concision
- rewrite strategy: preserve intent, remove padding, sharpen language, smooth cadence

## References

- Use `references/ai-slop-signals.md` to diagnose AI-like prose without overclaiming authorship.
- Use `references/humanization-playbook.md` to choose revision tactics.
- Use `references/agent-workflow.md` when editing files with write tools.
- Use `references/research-notes.md` for the evidence base and design rationale behind this skill.
