# Auditoría de cobertura: capturas S01–S20 vs componentes

Fecha: 2026-10-14. Método: revisión elemento por elemento de cada captura y medición de píxeles en las capturas originales (DPR 2, CSS px = px originales / 2).
Estados: **C** cubierto · **P** parcial (se cubre pero con diferencia medida) · **F** faltante · **X** excluido por decisión aprobada.

## Elementos por captura

| Cap. | Elemento | Componente | Estado | Hueco |
|---|---|---|---|---|
| S01 | Etiqueta "PLATFORM OPERATIONS" mono en mayúsculas | `TopBar` (slot) | C | |
| S01 | Botón de búsqueda con icono y `⌘K` | `Button` + `Kbd` | C | |
| S01 | Avatar con borde e inicial | `Avatar` | P | G17 sin borde |
| S01 | Filtros: label, input 40 px, selects | `Field`, `Input`, `Select` | C | |
| S01 | Separador interno de la tarjeta de filtros y botón | `Card` + `Button` | C | |
| S01 | Cabecera de tabla en mayúsculas con iconos de orden | `SortableHead` | C | |
| S01 | Columna numérica alineada a la derecha | `TableCell` (clase) | C | |
| S01 | Chip de ID mono con borde | (markup local) | F | G1 |
| S01 | Badges Active / Archived | `Badge` | C | |
| S01 | Hover de fila | `TableRow` | C | |
| S02 | Topbar 48 px | `TopBar` (56 px) | P | G16 |
| S02 | Breadcrumb con switchers y badges | `ContextBreadcrumb` | C | |
| S02 | Botones circulares de la topbar, uno pulsado | `Button` icon + `aria-pressed` | C | |
| S02 | Botón circular con punto de notificación | — | F | G2 |
| S02 | Sidebar: ítem 32 px, separación 34 px | `Sidebar` (ítem 36, paso 40) | P | G19 |
| S02 | Punto de aviso en el icono de "Advisors" | — | F | G2 |
| S02 | SubNav con secciones mono en mayúsculas | `SubNav` | C | |
| S02 | "Refresh" y "Last 24 hours" de 26 px | `Button`/`Select` (32/40) | P | G18 |
| S02 | StatTile con ayuda y chevron | `StatTile` | C | |
| S02 | Celdas de gráficos con bordes compartidos y resumen a la derecha | — | F | G3 |
| S02 | Informes vacíos dentro de una tarjeta | `EmptyState` + `Card` | C | |
| S02 | Menú de usuario: etiqueta, ítems con icono, radios de tema | `DropdownMenu*` | C | |
| S02 | Ítem con submenú ("Timezone") | — | F | G4 |
| S02, S03… | Tarjeta flotante promocional | — | X | |
| S03 | Panel acoplado con chip de estado y cierre | `AsidePanel`, `Badge`, `StatusDot` | C | |
| S03 | Filas con icono, título, descripción y chevron | `ListItem` | C | |
| S04 | Tabs de subrayado y botones de filtro con borde punteado | `Tabs`, `Button` dashed | C | |
| S04 | Filas con icono tintado, badge CRITICAL y texto truncado | `ListItem`, `Badge` | C | |
| S05 | Rejilla de 6 tiles y gráficos | `StatTile`, `MiniBarChart` | C | |
| S06 | Sheet con overlay desenfocado y cierre | `Sheet` | C | |
| S06–S10 | Selector de 5 tarjetas con título y descripción | `TabsList variant=cards` | P | tarjetas con 2 líneas sin verificar |
| S06 | Filas etiqueta/control con descripción; switch; select deshabilitado | `Field`, `Switch`, `Select` | C | |
| S06–S10 | Banner "Give your agent everything…" con botón de copiar | — | F | G5 |
| S07 | Radios en tarjeta con icono | `RadioCard` | C | |
| S08 | Radios en tarjeta **unidas** en un solo grupo con divisores | `RadioCard` (separadas) | P | G6 |
| S07, S09, S10 | Pasos numerados con línea | `Steps` | C | |
| S09 | Bloque de código con **tabs dentro** (npm, pnpm, bun, Deno) y copiar | `CodeBlock` (sin tabs) | P | G7 |
| S11 | Secciones plegables SHARED/FAVORITES/PRIVATE | — | F | G8 |
| S11 | Input con acciones, barra de resultados, "Role postgres", botón Run con kbd | `Input`, `Button`, `Kbd` | C | |
| S12 | Menú con icono, título y descripción | `DropdownMenuItemDescription` | C | |
| S13 | Tarjeta de 3 columnas con divisores y plantillas | `Card`, `ListItem` | C | |
| S14 | Badges NEW verdes con contorno en la subnav | `Badge` | F | G9 |
| S14 | EmptyState con borde punteado | `EmptyState` | C | |
| S15 | Input con select a la izquierda ("Email address") | `Input` + `Select` | F | G10 |
| S15 | Checkbox de selección de filas | — | F | G11 |
| S15 | Cabecera de tabla en minúsculas de 36 px | `TableHead` (mayúsculas, 40 px) | P | G12 |
| S15 | Botones con borde punteado y botón de icono cuadrado | `Button` | C | |
| S15 | Pie con total | `TableFooter` | C | |
| S16 | Botón dividido "Copy as SQL ▾" | — | F | G13 |
| S16 | Lienzo del esquema | — | X | |
| S17 | Título de página de mayor tamaño | `PageHeader` | P | G15 |
| S17 | Tarjetas de estado con icono | `StatTile` | C | |
| S18 | Selector de organización con búsqueda y check | `Popover` + `SearchInput` | C | |
| S20 | Alternador cuadrícula/lista | — | F | G14 |
| S20 | Sidebar colapsada de solo iconos | `Sidebar` | C | |
| S19 | Popover "Sidebar control" | `Popover` + `RadioGroup` | C | |
| S19 | Comportamiento responsivo de topbar y sidebar | — | F | G16 (sin evidencia suficiente) |

## Huecos a cerrar

| Id | Hueco | Disposición |
|---|---|---|
| G1 | Chip de ID mono | Nuevo `Code` |
| G2 | Punto de notificación sobre icono | Nuevo `Indicator` |
| G3 | Celdas de gráfico unidas | Nuevos `ChartTile` y `TileGrid` |
| G4 | Submenú | `DropdownMenuSub*` |
| G5 | Banner con acción | Nuevo `Callout` |
| G6 | Radios unidas | `RadioGroup variant="joined"` |
| G7 | Tabs dentro del bloque de código | `CodeBlock tabs` |
| G8 | Secciones plegables | Nuevo `Collapsible` |
| G9 | Badge verde con contorno | `Badge variant="success-outline"` |
| G10 | Input con addon | Nuevos `InputGroup*` |
| G11 | Checkbox | Nuevo `Checkbox` |
| G12 | Cabecera de tabla densa | `TableHead variant="plain"` |
| G13 | Botón dividido | Nuevo `ButtonGroup` |
| G14 | Alternador segmentado | Nuevo `ToggleGroup` |
| G15 | Título grande de página | `PageHeader size="lg"` |
| G16 | Topbar de 48 px y responsivo | `TopBar size`; responsivo queda fuera (sin evidencia) |
| G17 | Avatar con borde | `Avatar` con borde |
| G18 | Controles de 26 px | `size="sm"` en `Input` y `Select` |
| G19 | Ítem de sidebar de 32 px | Corregir `SidebarItem` |

## Geometría medida de la referencia (CSS px)

| Medida | Referencia | Componente actual |
|---|---|---|
| Topbar S01 / S02 | 55 / 48 | 56 |
| Sidebar S02 | 206 | 208 |
| Subnav S02 | 256 | 256 |
| Ítem de sidebar (alto / paso) | 32 / 34 | 36 / 40 |
| StatTile alto | 76–77 | por medir |
| Botón S01 / S02 | 32 / 26 | 32 / 24 |
| Input S01 | 40 | 40 |
| Fila de tabla S15 | 44 | 44 |
| Cabecera de tabla S15 | 36 | 40 |

## Ola A (formularios y retroalimentación)

- `Spinner`: geometría del estado de carga de `Button`.
- `Skeleton` y `TableSkeleton`: tokens y estructura de `Table`.
- `Textarea`: borde, foco y superficie de `Input`.
- `Dialog` y `ConfirmDialog`: overlay, cierre y foco de `Sheet`.
- `Pagination`: botones de `Button`.
- `Combobox`: disparador de `Select` y popup de `Popover`.
- `Toaster`: estados semánticos de `Callout` y apilado con z-index de overlay.
- `SubmitButton` y `FocusOnInvalid`: composición de `Button` e `Input`.
- `FilterCard` y `TableCard`: filtros y tabla de la captura S01.
- `AccountMenu`: menú de cuenta de las capturas S01/S02.
- `FormCard`, `FormSection` y `FormActions`: filas de formulario de la captura S06.
