# ADR 0001: Visual library distribution

- Status: Accepted
- Date: 2026-10-12

## Context

`crm-lite-core` and `ai-receptionist-core` are independent applications in separate repositories and accounts. The pilot consumer uses Next 16, React 19, and Tailwind 4; UI consumers built with other technologies may appear in the future.

## Decision

Create the public `LoganSeiken/ui` repository as a single `@loganseiken/ui` package, without a monorepo. Publish it publicly on npm: the first release will be manual with 2FA, and trusted publishing via OIDC will be configured from 0.1.1 in a separate task.

Build only ESM and declarations with `tsc`. React 19, React DOM 19, and Tailwind 4 are peers; `clsx` and `tailwind-merge` are dependencies. Framework-agnostic tokens live in `tokens.css`; `theme.css` imports those tokens and maps them to Tailwind 4. The package does not compile CSS utilities. The initial public API includes `.`, `./theme.css`, `./tokens.css`, and `./package.json`; its only component is `Button`. Storybook, Changesets, and Vitest are not included.

## Alternatives considered

- Private GitHub Packages: rejected because every consumer would need authentication and a classic PAT.
- Private npm: cost.
- Git dependency: no semver or clean rollback.
- Global monorepo: incompatible with separate accounts.
- Precompiled CSS: would duplicate utilities and could cause conflicts.
- Separate `tokens` and `ui-react` packages from the start: premature without a consumer using another technology.

## Consequences

The code will be public, and consumers will not need credentials. The scope is tied to the `loganseiken` account; changing it is a breaking change. If another technology emerges, extract `@loganseiken/tokens` and create `@loganseiken/ui-<technology>` in this repository without breaking `@loganseiken/ui/theme.css`.

Revisit this decision if privacy is required, an owning organization appears, a consumer uses another technology or does not use Tailwind 4/React 19, or the package exceeds 10 components or 3 consumers (evaluate Changesets, Storybook, and Vitest).
