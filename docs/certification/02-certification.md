# Component certification report

Date: 2026-10-14 · Package: `@loganseiken/ui` (branch `feat/component-library`) · Reference: screenshots S01–S20.

## Certification scope

**Included:** 43 components across three levels (20 `ui`, 16 `patterns`, 7 `layout`), the `tokens.css` tokens, and five composed screens (S01, S05, S06, S14, S15).
**Excluded (approved decision or no evidence):** floating promotional card, code editor, visual schema (S16), `cmdk`, responsive behavior, and hover/loading states not present in the screenshots (defined by inference).

## Evidence

| Check | Result |
|---|---|
| Coverage against the 20 screenshots (`01-coverage-audit.md`) | 19 gaps found and closed (G1–G19, plus G20 table dividers) |
| `tsc`, ESLint, `publint`, build | no errors; the tarball excludes tests |
| Unit tests (Vitest + Testing Library) | 68 of 68 pass |
| Storybook 10 | 43 story files (74 stories, one or more per component); `build-storybook` compiles |
| Visual regression (Playwright, Chrome) | 117 reference screenshots (74 light and 43 dark); all 117 pass in two consecutive runs |
| axe-core WCAG 2.2 AA + best practices | 0 violations across 7 pages (light and dark gallery, S01, S05, S06 with sheet open, S14, S15) |
| Keyboard and focus | Select, Tabs, DropdownMenu (with submenu), Popover, Sheet (focus trapped and returned), Tooltip, Switch, RadioGroup (including joined), ToggleGroup, Collapsible, SortableHead, CodeBlock: pass |
| Geometry against reference (±2 px) | top bar 48, sidebar 206, subnav 256, sidebar item 32/34, tile 78 (ref. 76–77), header 36 and row 44 in S15, input 40, button 32, S01 row 63 (ref. 65) |

## Issues found and fixed during certification

| Finding | Fix |
|---|---|
| 4.34:1 contrast of `muted-foreground` on `muted` in selected `RadioCard` and `Tabs` cards | Selected state on `surface-subtle`, with an additional indicator (border or underline) |
| Sidebar item height 36 px and step 40 px (ref. 32/34) | `h-8` and `gap-0.5` |
| `StatTile` height 82 px (ref. 76–77) | `py-3.5` |
| Monospace uppercase table header (S01 uses sans) and dense 36 px row (S15) | `TableHead` with `caps` (sans) and `plain` variants |
| Table without column dividers (S15) | `Table variant="grid"` |
| `EmptyState` height 254 px (ref. 195) | Adjusted padding and typography |
| `Tabs` cards height 84 px (ref. 116) | `p-4` and `gap-2` |
| `Field` stretched the label in rows with an error message | `content-start` |
| `var(--font-geist-sans)` without fallback invalidated the font | Added fallback inside `var()` |
| Duplicate `main` landmark when embedding `AppShell` | `main` prop |
| Split-button segment height 19.7 px (WCAG 2.2, 2.5.8) | Use with icon (26 px) |

## Status by component

Legend: ✔ verified · — not applicable. "Screen" indicates the reference composition used for measurement; "Gallery" means it was rendered and passed axe.

| Level | Component | Coverage | Screen | Gallery + axe | Keyboard | Tests | Status |
|---|---|---|---|---|---|---|---|
| ui | Avatar | ✔ | S01, S05 | ✔ | — | ✔ | Certified |
| ui | Badge (6 variants, 2 shapes) | ✔ | S01, S05, S14, S15 | ✔ | — | ✔ | Certified |
| ui | Button (6 variants, 4 sizes) | ✔ | all | ✔ | ✔ | ✔ | Certified |
| ui | Checkbox | ✔ | S15 | ✔ | ✔ | ✔ | Certified |
| ui | Code | ✔ | S01 | ✔ | — | ✔ | Certified |
| ui | Collapsible | ✔ | — | ✔ | ✔ | ✔ | Certified (no dedicated reference screen; S11 not composed) |
| ui | DropdownMenu (+ submenu, radios) | ✔ | — | ✔ | ✔ | ✔ | Certified |
| ui | Indicator | ✔ | S05, S14, S15 | ✔ | — | ✔ | Certified |
| ui | Input (sm, md) | ✔ | S01 | ✔ | ✔ | ✔ | Certified |
| ui | Kbd | ✔ | all | ✔ | — | ✔ | Certified |
| ui | Popover | ✔ | — | ✔ | ✔ | ✔ | Certified |
| ui | RadioGroup / RadioCard (separate, joined) | ✔ | — | ✔ | ✔ | ✔ | Certified |
| ui | Select (sm, md) | ✔ | S01, S05, S06 | ✔ | ✔ | ✔ | Certified |
| ui | Sheet | ✔ | S06 | ✔ | ✔ | ✔ | Certified |
| ui | StatusDot | ✔ | S05 | ✔ | — | ✔ | Certified |
| ui | Switch | ✔ | S06 | ✔ | ✔ | ✔ | Certified |
| ui | Table (+ footer, grid, caps/plain head) | ✔ | S01, S15 | ✔ | — | ✔ | Certified |
| ui | Tabs (underline, cards) | ✔ | S06, S14 | ✔ | ✔ | ✔ | Certified |
| ui | ToggleGroup | ✔ | — | ✔ | ✔ | ✔ | Certified (no dedicated reference screen; S20 not composed) |
| ui | Tooltip | ✔ | S05 | ✔ | ✔ | ✔ | Certified |
| patterns | ButtonGroup | ✔ | S15 | ✔ | — | ✔ | Certified |
| patterns | Callout | ✔ | S06 | ✔ | — | ✔ | Certified |
| patterns | Card (+ parts) | ✔ | S01, S05 | ✔ | — | ✔ | Certified |
| patterns | ChartTile / TileGrid | ✔ | S05 | ✔ | — | ✔ | Certified |
| patterns | CodeBlock (simple and with tabs) | ✔ | — | ✔ | ✔ | ✔ | Certified |
| patterns | ContextBreadcrumb | ✔ | S05, S14, S15 | ✔ | — | ✔ | Certified |
| patterns | EmptyState | ✔ | S05, S14 | ✔ | — | ✔ | Certified |
| patterns | Field | ✔ | S01, S06 | ✔ | — | ✔ | Certified |
| patterns | InputGroup | ✔ | S15 | ✔ | — | ✔ | Certified |
| patterns | ListItem | ✔ | — | ✔ | — | ✔ | Certified |
| patterns | MiniBarChart | ✔ | S05 | ✔ | — | ✔ | Certified with reservation (see 3) |
| patterns | SearchInput | ✔ | — | ✔ | — | ✔ | Certified |
| patterns | SortableHead | ✔ | S01 | ✔ | ✔ | ✔ | Certified |
| patterns | StatTile | ✔ | S05 | ✔ | — | ✔ | Certified |
| patterns | Steps | ✔ | — | ✔ | — | ✔ | Certified |
| patterns | Toolbar | ✔ | S15 | ✔ | — | ✔ | Certified |
| layout | AppShell | ✔ | S01, S05, S06, S14, S15 | ✔ | — | ✔ | Certified |
| layout | AsidePanel | ✔ | — | ✔ | — | ✔ | Certified |
| layout | PageContainer | ✔ | all | ✔ | — | ✔ | Certified |
| layout | PageHeader (sm, md, lg) | ✔ | S01, S05, S14, S15 | ✔ | — | ✔ | Certified |
| layout | Sidebar (3 modes) | ✔ | S05, S14, S15 | ✔ | ✔ | ✔ | Certified |
| layout | SubNav | ✔ | S05, S14, S15 | ✔ | — | ✔ | Certified |
| layout | TopBar (48, 56) | ✔ | all | ✔ | — | ✔ | Certified |

## Known reservations and deviations

1. **Green Supabase button → primary `Button`** (approved decision, Q4). This is the most visible visual difference in S11–S15 and S20.
2. **Tokens normalized from S01:** page background `#fafafa` (S02–S20 use `#fcfcfc`), table header `#fafafa` (S15 uses `#f3f3f3`), border `#e5e5e5` (S02–S20 use `#dfdfdf`).
3. **`MiniBarChart`:** bars stretch to the container width, while the reference uses thinner bars with more gaps; this is a data and proportion difference, not a color or structure difference.
4. **Dashboard button height:** the reference measures 26 px; the system offers 24 (sm), a 2 px difference.
5. **Accessibility adjustments from the reference:** input border `#8f8f8f` (ref. `#d4d4d4`, 1.48:1), warning text `#865322` (ref. `#cf8035`), warning border `#cc7e34`.
6. **Unobserved states** (hover, disabled, loading, empty state in other tables) were defined by inference and were not compared with the reference.

## Not completed

- **Visual regression in CI:** screenshots are generated with Chrome on macOS and run locally (`npm run test:visual`); CI runs lint, types, tests, build, `publint`, and `build-storybook`.
- **Composition of the remaining 15 screenshots** (S02–S04, S07–S13, S16–S20): they were covered by components and the audit, not reconstructed.
- **Responsive behavior:** there is only one narrow screenshot (S19), and it was not modeled.
- **Axe does not replace screen-reader testing.** A manual VoiceOver pass is recommended before release.
