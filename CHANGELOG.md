# Changelog

## Unreleased

## 0.2.0

### Added

- Layout patterns: AccountMenu, TableCard, FilterCard, FormCard, FormSection and FormActions.
- Form and feedback components: Callout variants, Spinner, Skeleton, TableSkeleton, Textarea, Dialog, ConfirmDialog, Pagination, Combobox, Toast, SubmitButton and FocusOnInvalid.
- Added `@radix-ui/react-toast` for accessible toast announcements and dismissal.

### Changed

- Expanded the root package exports with the new form and feedback components.

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
