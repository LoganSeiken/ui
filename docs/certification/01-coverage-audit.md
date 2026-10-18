# Coverage audit: screenshots S01–S20 vs. components

Date: 2026-10-14. Method: element-by-element review of each screenshot and pixel measurements from the original screenshots (DPR 2, CSS px = original px / 2).
Status: **C** covered · **P** partial (covered with a measured difference) · **F** missing · **X** excluded by an approved decision.

## Elements by screenshot

| Shot | Element | Component | Status | Gap |
|---|---|---|---|---|
| S01 | Uppercase mono "PLATFORM OPERATIONS" label | `TopBar` (slot) | C | |
| S01 | Search button with icon and `⌘K` | `Button` + `Kbd` | C | |
| S01 | Avatar with border and initial | `Avatar` | P | G17 no border |
| S01 | Filters: label, 40 px input, selects | `Field`, `Input`, `Select` | C | |
| S01 | Inner divider in the filter card and button | `Card` + `Button` | C | |
| S01 | Uppercase table header with sort icons | `SortableHead` | C | |
| S01 | Right-aligned numeric column | `TableCell` (class) | C | |
| S01 | Bordered mono ID chip | (local markup) | F | G1 |
| S01 | Active / Archived badges | `Badge` | C | |
| S01 | Row hover | `TableRow` | C | |
| S02 | 48 px top bar | `TopBar` (56 px) | P | G16 |
| S02 | Breadcrumb with switchers and badges | `ContextBreadcrumb` | C | |
| S02 | Circular top bar buttons, one pressed | `Button` icon + `aria-pressed` | C | |
| S02 | Circular button with notification dot | — | F | G2 |
| S02 | Sidebar: 32 px item, 34 px spacing | `Sidebar` (36 item, 40 step) | P | G19 |
| S02 | Notice dot on the "Advisors" icon | — | F | G2 |
| S02 | SubNav with uppercase mono section labels | `SubNav` | C | |
| S02 | 26 px "Refresh" and "Last 24 hours" | `Button`/`Select` (32/40) | P | G18 |
| S02 | StatTile with help and chevron | `StatTile` | C | |
| S02 | Chart cells with shared borders and summary on the right | — | F | G3 |
| S02 | Empty reports inside a card | `EmptyState` + `Card` | C | |
| S02 | User menu: label, icon items, theme radios | `DropdownMenu*` | C | |
| S02 | Submenu item ("Timezone") | — | F | G4 |
| S02, S03… | Floating promotional card | — | X | |
| S03 | Docked panel with status chip and close action | `AsidePanel`, `Badge`, `StatusDot` | C | |
| S03 | Rows with icon, title, description, and chevron | `ListItem` | C | |
| S04 | Underlined tabs and dashed-border filter buttons | `Tabs`, `Button` dashed | C | |
| S04 | Rows with tinted icon, CRITICAL badge, and truncated text | `ListItem`, `Badge` | C | |
| S05 | Grid of 6 tiles and charts | `StatTile`, `MiniBarChart` | C | |
| S06 | Sheet with blurred overlay and close action | `Sheet` | C | |
| S06–S10 | Five-card selector with title and description | `TabsList variant=cards` | P | two-line cards not verified |
| S06 | Label/control rows with description; switch; disabled select | `Field`, `Switch`, `Select` | C | |
| S06–S10 | "Give your agent everything…" banner with copy button | — | F | G5 |
| S07 | Radios in a card with icon | `RadioCard` | C | |
| S08 | Radios **joined** in one group with dividers | `RadioCard` (separate) | P | G6 |
| S07, S09, S10 | Numbered steps with a line | `Steps` | C | |
| S09 | Code block with **tabs inside** (npm, pnpm, bun, Deno) and copy | `CodeBlock` (no tabs) | P | G7 |
| S11 | Collapsible SHARED/FAVORITES/PRIVATE sections | — | F | G8 |
| S11 | Input with actions, result bar, "Role postgres", Run button with kbd | `Input`, `Button`, `Kbd` | C | |
| S12 | Menu with icon, title, and description | `DropdownMenuItemDescription` | C | |
| S13 | Three-column card with dividers and templates | `Card`, `ListItem` | C | |
| S14 | Green outlined NEW badges in the subnav | `Badge` | F | G9 |
| S14 | EmptyState with dashed border | `EmptyState` | C | |
| S15 | Input with select on the left ("Email address") | `Input` + `Select` | F | G10 |
| S15 | Row selection checkbox | — | F | G11 |
| S15 | 36 px lowercase table header | `TableHead` (uppercase, 40 px) | P | G12 |
| S15 | Dashed-border buttons and square icon button | `Button` | C | |
| S15 | Footer with total | `TableFooter` | C | |
| S16 | Split button "Copy as SQL ▾" | — | F | G13 |
| S16 | Schema canvas | — | X | |
| S17 | Larger page title | `PageHeader` | P | G15 |
| S17 | Status cards with icon | `StatTile` | C | |
| S18 | Organization selector with search and check | `Popover` + `SearchInput` | C | |
| S20 | Grid/list toggle | — | F | G14 |
| S20 | Icon-only collapsed sidebar | `Sidebar` | C | |
| S19 | "Sidebar control" popover | `Popover` + `RadioGroup` | C | |
| S19 | Responsive top bar and sidebar behavior | — | F | G16 (insufficient evidence) |

## Gaps to close

| ID | Gap | Implementation |
|---|---|---|
| G1 | Mono ID chip | New `Code` |
| G2 | Notification dot over icon | New `Indicator` |
| G3 | Joined chart cells | New `ChartTile` and `TileGrid` |
| G4 | Submenu | `DropdownMenuSub*` |
| G5 | Banner with action | New `Callout` |
| G6 | Joined radios | `RadioGroup variant="joined"` |
| G7 | Tabs inside code block | `CodeBlock tabs` |
| G8 | Collapsible sections | New `Collapsible` |
| G9 | Green outlined badge | `Badge variant="success-outline"` |
| G10 | Input with addon | New `InputGroup*` |
| G11 | Checkbox | New `Checkbox` |
| G12 | Dense table header | `TableHead variant="plain"` |
| G13 | Split button | New `ButtonGroup` |
| G14 | Segmented toggle | New `ToggleGroup` |
| G15 | Large page title | `PageHeader size="lg"` |
| G16 | 48 px and responsive top bar | `TopBar size`; responsive behavior remains out of scope (no evidence) |
| G17 | Avatar with border | `Avatar` with border |
| G18 | 26 px controls | `size="sm"` on `Input` and `Select` |
| G19 | 32 px sidebar item | Fix `SidebarItem` |

## Measured reference geometry (CSS px)

| Measurement | Reference | Current component |
|---|---|---|
| Top bar S01 / S02 | 55 / 48 | 56 |
| Sidebar S02 | 206 | 208 |
| Subnav S02 | 256 | 256 |
| Sidebar item (height / step) | 32 / 34 | 36 / 40 |
| StatTile height | 76–77 | to measure |
| Button S01 / S02 | 32 / 26 | 32 / 24 |
| Input S01 | 40 | 40 |
| Table row S15 | 44 | 44 |
| Table header S15 | 36 | 40 |

## Wave A (forms and feedback)

- `Spinner`: loading-state geometry from `Button`.
- `Skeleton` and `TableSkeleton`: tokens and structure from `Table`.
- `Textarea`: border, focus, and surface from `Input`.
- `Dialog` and `ConfirmDialog`: overlay, close action, and focus from `Sheet`.
- `Pagination`: `Button` controls.
- `Combobox`: `Select` trigger and `Popover` popup.
- `Toaster`: semantic states from `Callout` and overlay z-index stacking.
- `SubmitButton` and `FocusOnInvalid`: composition of `Button` and `Input`.
- `FilterCard` and `TableCard`: filters and table from screenshot S01.
- `AccountMenu`: account menu from screenshots S01/S02.
- `FormCard`, `FormSection`, and `FormActions`: form rows from screenshot S06.
