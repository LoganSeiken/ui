# Verification scripts

Reproduce the checks in the `../02-certification.md` report.

Requirements: the app with the gallery running at `http://localhost:3133` (`crm-lite-core` branch `spike/ui-gallery`, `npm run dev -- --port 3133`), Google Chrome installed, and `npm i playwright-core axe-core` in a separate directory.

| Script | What it checks |
|---|---|
| `axe.mjs` | axe-core (WCAG 2.0/2.1/2.2 A and AA, plus best practices) on the light and dark gallery and the 5 screens |
| `keys.mjs`, `extras.mjs` | keyboard and focus behavior per component (Tab, arrows, Enter, Space, Esc) |
| `fidelity.mjs` | rendered geometry of the 5 screens (heights, widths, spacing) |
| `two-apps-parity.mjs` | compares the rendered gallery in two apps that consume the library (text and computed style for each element) |
| `reference-geometry.py` | pixel measurements from the original screenshots (requires Pillow) |

Note: Radix moves focus in radio groups with `setTimeout` after `keydown`; to test arrow keys, hold the key (`keyboard.down`, wait ~100 ms, `keyboard.up`) instead of using `press`.

## Test both apps at once

```sh
# 1. ui on the branch with the library (main after PR #1 is merged)
# 2. In each app (spike/ui-gallery branch), with ../ui alongside
cd crm-lite-core        && npm install && npm run dev -- --port 3133
cd ai-receptionist-core && npm install && npm run dev -- --port 3134
# 3. Run each app's E2E suite (starts the server if it is not running)
npm run test:e2e
# 4. Compare parity between the apps
node two-apps-parity.mjs http://localhost:3133/ui-gallery http://localhost:3134/ui-gallery ./out
```
