# ADR 0004: Shared application pattern wave

- Status: Accepted
- Date: 2026-10-25
- Extends: ADR 0002 and ADR 0003

## Context

The suite applications need the same interaction patterns for feedback, menus,
responsive navigation, asynchronous selection, file upload, form ranges and
conversation rendering. Reimplementing these in each repository would create
drift in keyboard behavior, semantics and token usage.

## Decision

Add the patterns in the `ui/`, `patterns/` and `layout/` namespaces of the shared
package. Components remain presentational or framework-neutral: applications
provide labels, locale persistence, router links, server actions and data
fetchers. `AsyncCombobox` owns only debounce/cancellation state; it does not
know a framework, cache or API. `MessageThread` renders supplied children and
does not infer channel or conversation state. `AccountMenuActionItem` submits a
consumer-owned form by `requestSubmit()` because Radix menu content may unmount.

All visible strings are props with generic English defaults. Components use the
existing semantic tokens, `cn`, CVA and Radix primitives; no dependency or
application-to-application integration is added. The package is released as
`0.4.0` with stories, Testing Library behavior/a11y coverage and Chrome visual
baselines.

## Consequences

Applications can compose the same accessible behavior without duplicating code.
They must pass translated labels and enforce their own authorization and data
rules. The package API grows, so future additions require a typed API, story,
behavior test and visual review.
