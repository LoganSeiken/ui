# Informe de certificación de componentes

Fecha: 2026-10-14 · Paquete: `@loganseiken/ui` (rama `feat/component-library`) · Referencia: capturas S01–S20.

## Alcance de lo que se certifica

**Sí:** 43 componentes en tres niveles (20 `ui`, 16 `patterns`, 7 `layout`), los tokens de `tokens.css` y la composición de cinco pantallas (S01, S05, S06, S14, S15).
**No (decisión aprobada o sin evidencia):** tarjeta promocional flotante, editor de código, esquema visual (S16), `cmdk`, comportamiento responsivo, estados hover y de carga no presentes en las capturas (definidos por inferencia).

## Evidencia

| Prueba | Resultado |
|---|---|
| Cobertura contra las 20 capturas (`01-coverage-audit.md`) | 19 huecos detectados y cerrados (G1–G19, más G20 tabla con divisores) |
| `tsc`, ESLint, `publint`, build | sin errores; el tarball no incluye tests |
| Pruebas unitarias (Vitest + Testing Library) | 68 de 68 pasan |
| Storybook 10 | 43 archivos de stories (74 stories, una o más por componente); `build-storybook` compila |
| Regresión visual (Playwright, Chrome) | 117 capturas de referencia (74 claras y 43 oscuras); 117 de 117 pasan en dos ejecuciones consecutivas |
| axe-core WCAG 2.2 AA + buenas prácticas | 0 violaciones en 7 páginas (galería clara y oscura, S01, S05, S06 con sheet abierto, S14, S15) |
| Teclado y foco | Select, Tabs, DropdownMenu (con submenú), Popover, Sheet (foco atrapado y devuelto), Tooltip, Switch, RadioGroup (incl. unido), ToggleGroup, Collapsible, SortableHead, CodeBlock: correctos |
| Geometría contra la referencia (±2 px) | topbar 48, sidebar 206, subnav 256, ítem de sidebar 32/34, tile 78 (ref. 76–77), cabecera 36 y fila 44 de S15, input 40, botón 32, fila S01 63 (ref. 65) |

## Defectos encontrados y corregidos durante la certificación

| Hallazgo | Corrección |
|---|---|
| Contraste 4,34:1 de `muted-foreground` sobre `muted` en `RadioCard` y `Tabs` (cards) seleccionados | Estado seleccionado sobre `surface-subtle`, con indicador adicional (borde o línea inferior) |
| Ítem de sidebar de 36 px y paso de 40 px (ref. 32/34) | `h-8` y `gap-0.5` |
| `StatTile` de 82 px (ref. 76–77) | `py-3.5` |
| Cabecera de tabla en mono y mayúsculas (S01 usa sans) y fila densa de 36 px (S15) | `TableHead` con variantes `caps` (sans) y `plain` |
| Tabla sin divisores de columna (S15) | `Table variant="grid"` |
| `EmptyState` de 254 px (ref. 195) | padding y tipografía ajustados |
| Tarjetas de `Tabs` de 84 px (ref. 116) | `p-4` y `gap-2` |
| `Field` estiraba la etiqueta en filas con mensaje de error | `content-start` |
| `var(--font-geist-sans)` sin respaldo invalidaba la fuente | respaldo dentro del `var()` |
| Landmark `main` duplicado al incrustar `AppShell` | prop `main` |
| Segmento de botón dividido de 19,7 px (WCAG 2.2, 2.5.8) | uso con icono (26 px) |

## Estado por componente

Leyenda: ✔ verificado · — no aplica. "Pantalla" indica en qué ensamblaje de referencia se midió; "Galería" que se renderizó y pasó axe.

| Nivel | Componente | Cobertura | Pantalla | Galería + axe | Teclado | Tests | Estado |
|---|---|---|---|---|---|---|---|
| ui | Avatar | ✔ | S01, S05 | ✔ | — | ✔ | Certificado |
| ui | Badge (6 variantes, 2 formas) | ✔ | S01, S05, S14, S15 | ✔ | — | ✔ | Certificado |
| ui | Button (6 variantes, 4 tamaños) | ✔ | todas | ✔ | ✔ | ✔ | Certificado |
| ui | Checkbox | ✔ | S15 | ✔ | ✔ | ✔ | Certificado |
| ui | Code | ✔ | S01 | ✔ | — | ✔ | Certificado |
| ui | Collapsible | ✔ | — | ✔ | ✔ | ✔ | Certificado (sin pantalla de referencia propia, S11 no ensamblada) |
| ui | DropdownMenu (+ submenú, radios) | ✔ | — | ✔ | ✔ | ✔ | Certificado |
| ui | Indicator | ✔ | S05, S14, S15 | ✔ | — | ✔ | Certificado |
| ui | Input (sm, md) | ✔ | S01 | ✔ | ✔ | ✔ | Certificado |
| ui | Kbd | ✔ | todas | ✔ | — | ✔ | Certificado |
| ui | Popover | ✔ | — | ✔ | ✔ | ✔ | Certificado |
| ui | RadioGroup / RadioCard (separado, unido) | ✔ | — | ✔ | ✔ | ✔ | Certificado |
| ui | Select (sm, md) | ✔ | S01, S05, S06 | ✔ | ✔ | ✔ | Certificado |
| ui | Sheet | ✔ | S06 | ✔ | ✔ | ✔ | Certificado |
| ui | StatusDot | ✔ | S05 | ✔ | — | ✔ | Certificado |
| ui | Switch | ✔ | S06 | ✔ | ✔ | ✔ | Certificado |
| ui | Table (+ footer, grid, head caps/plain) | ✔ | S01, S15 | ✔ | — | ✔ | Certificado |
| ui | Tabs (underline, cards) | ✔ | S06, S14 | ✔ | ✔ | ✔ | Certificado |
| ui | ToggleGroup | ✔ | — | ✔ | ✔ | ✔ | Certificado (sin pantalla de referencia propia, S20 no ensamblada) |
| ui | Tooltip | ✔ | S05 | ✔ | ✔ | ✔ | Certificado |
| patterns | ButtonGroup | ✔ | S15 | ✔ | — | ✔ | Certificado |
| patterns | Callout | ✔ | S06 | ✔ | — | ✔ | Certificado |
| patterns | Card (+ partes) | ✔ | S01, S05 | ✔ | — | ✔ | Certificado |
| patterns | ChartTile / TileGrid | ✔ | S05 | ✔ | — | ✔ | Certificado |
| patterns | CodeBlock (simple y con tabs) | ✔ | — | ✔ | ✔ | ✔ | Certificado |
| patterns | ContextBreadcrumb | ✔ | S05, S14, S15 | ✔ | — | ✔ | Certificado |
| patterns | EmptyState | ✔ | S05, S14 | ✔ | — | ✔ | Certificado |
| patterns | Field | ✔ | S01, S06 | ✔ | — | ✔ | Certificado |
| patterns | InputGroup | ✔ | S15 | ✔ | — | ✔ | Certificado |
| patterns | ListItem | ✔ | — | ✔ | — | ✔ | Certificado |
| patterns | MiniBarChart | ✔ | S05 | ✔ | — | ✔ | Certificado con reserva (ver 3) |
| patterns | SearchInput | ✔ | — | ✔ | — | ✔ | Certificado |
| patterns | SortableHead | ✔ | S01 | ✔ | ✔ | ✔ | Certificado |
| patterns | StatTile | ✔ | S05 | ✔ | — | ✔ | Certificado |
| patterns | Steps | ✔ | — | ✔ | — | ✔ | Certificado |
| patterns | Toolbar | ✔ | S15 | ✔ | — | ✔ | Certificado |
| layout | AppShell | ✔ | S01, S05, S06, S14, S15 | ✔ | — | ✔ | Certificado |
| layout | AsidePanel | ✔ | — | ✔ | — | ✔ | Certificado |
| layout | PageContainer | ✔ | todas | ✔ | — | ✔ | Certificado |
| layout | PageHeader (sm, md, lg) | ✔ | S01, S05, S14, S15 | ✔ | — | ✔ | Certificado |
| layout | Sidebar (3 modos) | ✔ | S05, S14, S15 | ✔ | ✔ | ✔ | Certificado |
| layout | SubNav | ✔ | S05, S14, S15 | ✔ | — | ✔ | Certificado |
| layout | TopBar (48, 56) | ✔ | todas | ✔ | — | ✔ | Certificado |

## Reservas y desviaciones conocidas

1. **Botón verde de Supabase → `Button` primario** (decisión aprobada, Q4). Es la diferencia visual más visible en S11–S15 y S20.
2. **Tokens normalizados desde S01:** fondo de página `#fafafa` (S02–S20 usan `#fcfcfc`), cabecera de tabla `#fafafa` (S15 usa `#f3f3f3`), borde `#e5e5e5` (S02–S20 usan `#dfdfdf`).
3. **`MiniBarChart`:** las barras se estiran con el ancho del contenedor y la referencia usa barras más finas con muchos huecos; es una diferencia de datos y de proporción, no de color ni de estructura.
4. **Altura de botones del dashboard:** la referencia mide 26 px; el sistema ofrece 24 (sm), diferencia de 2 px.
5. **Ajustes de accesibilidad sobre la referencia:** borde de input `#8f8f8f` (ref. `#d4d4d4`, 1,48:1), texto de advertencia `#865322` (ref. `#cf8035`), borde de advertencia `#cc7e34`.
6. **Estados no observados** (hover, deshabilitado, carga, vacío en otras tablas) se definieron por inferencia y no se compararon con la referencia.

## Lo que no está hecho

- **Regresión visual en CI:** las capturas se generan con Chrome en macOS y se ejecutan localmente (`npm run test:visual`); CI ejecuta lint, tipos, tests, build, `publint` y `build-storybook`.
- **Ensamblaje de las 15 capturas restantes** (S02–S04, S07–S13, S16–S20): se cubrieron por componentes y por la auditoría, no reconstruyéndolas.
- **Responsivo:** solo hay una captura estrecha (S19) y no se modeló.
- **Axe no sustituye una prueba con lector de pantalla.** Se recomienda una pasada manual con VoiceOver antes de publicar.
