# @loganseiken/ui

Shared, framework-agnostic design tokens and small React UI primitives.

## Install

```sh
npm install @loganseiken/ui
```

With Tailwind CSS 4, import the app stylesheet first and the package theme second:

```css
@import "tailwindcss";
@import "@loganseiken/ui/theme.css";
```

For apps without Tailwind or using another technology, import only the plain CSS tokens:

```css
@import "@loganseiken/ui/tokens.css";
```

Use semantic custom properties such as `var(--ui-background)` and `var(--ui-primary)`.

## Button

```tsx
import { Button } from "@loganseiken/ui";

<Button variant="primary" size="md">Save changes</Button>
<Button loading>Saving</Button>
```

`Button` supports `primary`, `secondary`, `outline`, `ghost`, and `destructive` variants; `sm`, `md`, and `lg` sizes; native button props; and a `loading` state.

## Compatibility

| Technology | Compatibility |
| --- | --- |
| React | 19 |
| Tailwind CSS | 4 (optional for token-only consumers) |
| Next.js | Optional; no Next.js dependency |

Dark tokens follow `prefers-color-scheme: dark`; set `data-theme="dark"` on an element to force dark tokens, or `data-theme="light"` to force light tokens.

The neutral palette is provisional and has no brand identity. Semver policy: patch releases fix bugs, minor releases add backward-compatible features, and major releases may break the API or token contract.

## Local package validation

Run `npm pack --dry-run` to inspect the package contents. Avoid `npm link`, which can load a second React copy and cause invalid hook/runtime behavior in consumers.
