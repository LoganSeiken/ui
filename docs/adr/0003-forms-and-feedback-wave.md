# ADR 0003: Forms and feedback wave

- Status: Accepted
- Date: 2026-10-17

## Context

The library needs primitives and compositions for forms, loading states, confirmations, pagination, and temporary messages. Geometry must follow the certified components and their semantic tokens.

## Decision

- Add variants to `Callout`; add `Spinner`, `Skeleton`, `Textarea`, `Dialog`, `Combobox`, and `Toaster` to `ui/`; and add `TableSkeleton`, `ConfirmDialog`, `Pagination`, `SubmitButton`, and `FocusOnInvalid` to `patterns/`.
- Use only semantic tokens and geometry inherited from existing components. The library is language-agnostic: visible text is supplied through props, and defaults are generic English.
- `Toast` uses `@radix-ui/react-toast` for accessible announcements, duration, and dismissal.
- `Combobox` composes `Popover` with the ARIA 1.2 pattern; it does not add `cmdk`. Filtering can be local (without accent sensitivity) or external through `onQueryChange`.
- `ConfirmDialog` supports confirmation through an async callback or submission of an external form using `confirmFormId`.

## Layout patterns

- `FilterCard` and `TableCard` implement the filters and table from screenshot S01.
- `FormCard`, `FormSection`, and `FormActions` implement the form rows from screenshot S06.
- `AccountMenu` implements the account menu from screenshots S01/S02.
- Apps compose these patterns; they do not reimplement their structure.

## Consequences

The root API covers the requested loading states and form flows. The Toast dependency increases package installation size.

## Documented exceptions (design-token rule)

- The `Tabs` underline variant uses an inset shadow expression referencing the primary token; it reproduces reference screen S04 and has no equivalent standard utility.
- `Toast` caps its width with `calc(100vw - 2rem)` so it never overflows narrow viewports.
- `react-dom` and `@types/react-dom` appear as dev dependencies because `react-dom` is a declared peer dependency used by `SubmitButton` (`useFormStatus`) and the test suite.
- The development-only gallery in consumer apps is outside the rule.
