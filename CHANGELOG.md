# Changelog

## 0.5.0 - 2026-10-25

### Added

- Generic, accessible `KanbanBoard` with Pointer Events and keyboard movement, localized labels, card and loading patterns; card body dragging with a 4px threshold, floating preview and placeholder, edge autoscroll, and memoized items.

## 0.4.0 - 2026-10-25

### Added

- `Toaster` accepts localized labels for toast announcements and the viewport, including Radix's `{hotkey}` placeholder.
- `SheetContent` and `AsidePanel` accept a localized close button label.
- `CodeBlock` accepts localized tab list, copy, and copied labels.
- Shared pattern wave: `ActionFeedback`, `AccountMenuActionItem`, `LocaleMenuItems`,
  `SidebarNav`, `MessageThread`, `MessageBubble`, and `SystemEventRow`.
- Shared form and navigation controls: `AsyncCombobox`, `LinkButton`, `FileInput`,
  and `Slider`.
- `Callout` accepts an optional description while preserving its existing API.

## Unreleased

## 0.2.0

### Added

- Section pattern with accessible headings and optional actions and separators.
- FilterCard supports custom form components.
- ListItem supports linked roots with `href`.
- Pending ConfirmDialog states that prevent cancel, close, Escape and outside dismissal.
- Layout patterns: AccountMenu, TableCard, FilterCard, FormCard, FormSection and FormActions.
- Form and feedback components: Callout variants, Spinner, Skeleton, TableSkeleton, Textarea, Dialog, ConfirmDialog, Pagination, Combobox, Toast, SubmitButton and FocusOnInvalid.
- `Field` links its description and error to the control through `aria-describedby`, including a nested `SelectTrigger`.
- `SidebarItem` and `SubNavItem` accept `linkComponent` (like `Pagination`) so apps can use their router link and avoid full page reloads.
- `Combobox` options `loadingLabel`, `errorText` and `aria-describedby`.
- `@radix-ui/react-toast` for accessible toast announcements; `react-dom` as a peer dependency (used by `SubmitButton`).

### Changed

- Root exports include every new component.
- Test suite: 104 tests. Visual regression baselines: 189.

## 0.1.x

- Component library in three levels: `ui/` (Avatar, Badge, Button, DropdownMenu, Input, Kbd, Popover, RadioGroup, Select, Sheet, StatusDot, Switch, Table, Tabs, Tooltip), `patterns/` (Card, CodeBlock, ContextBreadcrumb, EmptyState, Field, ListItem, MiniBarChart, SearchInput, SortableHead, StatTile, Steps, Toolbar) and `layout/` (AppShell, AsidePanel, PageContainer, PageHeader, Sidebar, SubNav, TopBar).
- New semantic tokens: surface-subtle, border-subtle, status tints for destructive, success and warning, chart colors and overlay. Primitive palette added to `tokens.css`.
- Added after the certification audit: Checkbox, Code, Collapsible, Indicator, ToggleGroup, dropdown submenus, ButtonGroup, Callout, ChartTile/TileGrid, InputGroup, `Table variant="grid"`, `TableHead variant="plain"`, `RadioGroup variant="joined"`, `CodeBlock tabs`, `PageHeader size="sm"`, `TopBar size="sm"`, `AppShell main`, `foreground-subtle` token.
- Vitest and Testing Library test suite (68 tests).
- Storybook 10 with one story file per component, light/dark toolbar and the a11y addon.
- Playwright visual regression suite (117 baselines) and a GitHub Actions workflow.
- `Button` sizes are now sm 24px, md 32px, lg 40px and icon; new `dashed` variant.

## 0.1.0

- Semantic design tokens (`tokens.css`) and Tailwind 4 theme mapping (`theme.css`).
- `cn` helper and `Button` component (variants, sizes, loading state).
- `@loganseiken/ui/demo` subpath exporting `SharedDemo`, a sample used to validate integration in consumer apps. It is not part of the root API.
