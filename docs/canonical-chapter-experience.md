# Canonical Chapter Experience

This document is the product contract for the Project 3|26 chapter experience. Content may change chapter by chapter; this layout should not.

## Core rule

**Admin publishes content into a stable chapter shell. Content loading must not redesign the shell.**

A new chapter should require content data only. Do not add chapter-specific JSX, hardcoded titles, one-off player layouts, or custom Study section markup.

## Canonical tabs

The chapter experience stays in this order:

1. Read
2. Listen
3. Study
4. Leader

Entitlements may lock a tab, but they should not change the tab order or visual structure.

## Listen

The Listen experience is a reusable chapter audio player. The content contract is:

- Heading: the canonical Bible reference, for example `John 1`.
- Subtitle: `listenSummary`, a single approved sentence describing what the chapter is about.
- Audio source: the current published chapter audio resource.
- Controls: seekable timeline, elapsed time, duration, 15-second back, play/pause, 15-second forward.
- The uploaded filename or internal content title must not become the customer-facing heading.
- The subtitle must not be derived at render time from `Before You Read` or another Study section.
- Missing subtitle content should fail gracefully without changing the player layout.

## Study

The Study experience is a reusable accordion. The canonical section order is:

1. Before You Read
2. Setting the Scene
3. Observe
4. Interpret
5. Apply
6. Closing Prayer
7. Memory Verse Option

Rules:

- All accordions begin collapsed.
- The layout is identical for every chapter.
- Admin-approved summaries populate the accordion; chapter-specific UI is not permitted.
- Apply remains pastoral teaching with a reflective question as the final sentence of each paragraph.
- Quote of the Chapter is not a Study accordion item.
- Community Connection is not a Study accordion item.
- The designed Study PDF remains a separate action/resource rather than replacing the native Study experience.

## Read

The Bible reader remains the canonical Scripture experience. Content ingestion must not replace the reader with uploaded document markup.

## Leader

Leader content remains a separately entitled resource. Its content may evolve, but it must remain inside the canonical Leader tab rather than introducing chapter-specific tabs.

## Data contract

The frontend chapter adapter should receive stable fields from the backend and map them into the canonical shell:

- `resources.audio.url`
- `listenSummary`
- `studyExperience.sections[]`
- `chapterQuote`
- `resources.study.url` for the designed Study PDF
- `resources.leader` for Leader content

The frontend should be presentation-first: new content should populate these fields without requiring layout changes.

## Change policy

Any change to the chapter shell should be treated as a product-design change, not a content-ingestion change. Before changing the shell:

1. Compare the change against this document.
2. Run `npm run verify:chapter-experience`.
3. Confirm Listen controls, Study order/collapsed state, and tab order still match the canonical experience.
4. Do not remove a canonical element simply because a newly uploaded chapter lacks data.

This file is intentionally called **canonical**. Future chapter content should conform to this experience unless the product owner deliberately revises the contract.
