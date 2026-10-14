# Scripts de verificación

Reproducen las comprobaciones del informe `../02-certification.md`.

Requisitos: la app con la galería corriendo en `http://localhost:3133` (rama `spike/ui-gallery` de `crm-lite-core`, `npm run dev -- --port 3133`), Google Chrome instalado y, en una carpeta aparte, `npm i playwright-core axe-core`.

| Script | Qué comprueba |
|---|---|
| `axe.mjs` | axe-core (WCAG 2.0/2.1/2.2 A y AA y buenas prácticas) en la galería en claro y oscuro y en las 5 pantallas |
| `keys.mjs`, `extras.mjs` | teclado y foco por componente (Tab, flechas, Enter, Espacio, Esc) |
| `fidelity.mjs` | geometría renderizada de las 5 pantallas (alturas, anchos, pasos) |
| `two-apps-parity.mjs` | compara la galería renderizada por dos apps que consumen la librería (texto y estilo calculado de cada elemento) |
| `reference-geometry.py` | medición de píxeles sobre las capturas originales (necesita Pillow) |

Nota: Radix mueve el foco de los grupos de radios con `setTimeout` tras `keydown`; para probar flechas hay que mantener la tecla (`keyboard.down`, esperar ~100 ms, `keyboard.up`), no usar `press`.

## Prueba con las dos apps a la vez

```sh
# 1. ui en la rama con la librería (main una vez fusionado el PR #1)
# 2. en cada app (rama spike/ui-gallery), con ../ui al lado
cd crm-lite-core        && npm install && npm run dev -- --port 3133
cd ai-receptionist-core && npm install && npm run dev -- --port 3134
# 3. suite E2E de cada app (levanta el servidor si no está corriendo)
npm run test:e2e
# 4. paridad entre ambas apps
node two-apps-parity.mjs http://localhost:3133/ui-gallery http://localhost:3134/ui-gallery ./out
```
