# ADR 0002: Three-level component library

- Status: Accepted
- Date: 2026-10-14
- Partially supersedes: ADR 0001 (component scope and tooling)

## Context

ADR 0001 limited the package to `Button` and deferred Storybook, Vitest, and Changesets. The reference screenshots (S01–S20) require more than 30 components with accessible behavior (menus, sheets, tabs, selects), which justifies adopting proven primitives.

## Decision

- Three levels under `src/components`: `ui/` (primitives), `patterns/` (compositions), and `layout/` (structure). Everything is exported from the root of `@loganseiken/ui`.
- Accessible behavior with Radix UI, variants with `class-variance-authority`, and icons with `lucide-react`. These are package dependencies.
- Components consume only semantic tokens (`--ui-*`) through the Tailwind theme. Observed values live in `tokens.css` primitives.
- Use Client Components only when state or Radix primitives require them; the rest can render on the server.
- Keep npm as the package manager. Adopt Vitest with Testing Library (68 tests). Storybook 10 documents every component (one story per component), and a Playwright visual-regression baseline (117 screenshots) protects their appearance; screenshots are generated on macOS with Chrome and do not run in CI.
- Existing token values differ from the provisional version; while the package is in 0.x, treat this as a minor change.

## Alternatives rejected

- Copying shadcn/ui as a dependency: would duplicate components in each app and undermine the shared-package concept.
- Components without Radix: reimplementing focus, keyboard, and ARIA behavior for menus and dialogs has more risk than the dependency cost.
- `cmdk`, a code editor, and a visual schema: one screenshot does not justify the dependency.

## Consequences

The package grows in size and API surface. Revisit Changesets, Storybook, and visual tests when there are three consumers.
