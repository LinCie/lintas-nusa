# Research Notes

This skill is built around three evidence-backed ideas.

## 1. AI detection is unreliable as authorship proof

Modern detectors are too weak to support confident authorship claims in ordinary editing workflows.
The practical implication for this skill is simple:
- do not label text as AI-generated with certainty
- diagnose surface signals and writing weaknesses instead
- optimize for better prose, not for "beating" detectors

## 2. Natural writing usually overlaps with plain-language guidance

Many traits people describe as "more human" are the same traits recommended by established plain-language guidance:
- active voice where appropriate
- short, direct sentences
- clear actors and actions
- omitted filler
- everyday words when precision allows
- organized paragraphs that reach the point quickly

## 3. Reusable agent instructions need a stable workflow

Agentic coding tools work best when the instruction is explicit about:
- task order
- edit boundaries
- protected regions
- expected output format

That is why this skill separates diagnosis, rewriting, file safety, and reporting into distinct steps.

## Source notes

The design of this skill was informed by:
- OpenAI guidance noting that its own AI text classifier was removed because of low accuracy and should not be used as a primary decision tool.
- NIST GenAI evaluation materials on text generation and discrimination tasks.
- U.S. plain-language guidance from Digital.gov, the National Archives, DHS, and related federal writing resources.
- OpenAI prompting guidance recommending clear task definitions and explicit output formats for reusable instructions.
