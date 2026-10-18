# ADR 0003: Ola de formularios y retroalimentación

- Estado: Aceptada
- Fecha: 2026-10-17

## Contexto

La biblioteca necesita primitivas y composiciones para formularios, estados de carga, confirmaciones, paginación y mensajes temporales. La geometría debe seguir los componentes certificados y sus tokens semánticos.

## Decisión

- Agregar variantes a `Callout`; `Spinner`, `Skeleton`, `Textarea`, `Dialog`, `Combobox` y `Toaster` a `ui/`; y `TableSkeleton`, `ConfirmDialog`, `Pagination`, `SubmitButton` y `FocusOnInvalid` a `patterns/`.
- Usar solo tokens semánticos y geometría heredada de componentes existentes. La biblioteca es agnóstica de idioma: los textos visibles se reciben por props y los defaults son genéricos en inglés.
- `Toast` usa `@radix-ui/react-toast` para anuncios, duración y cierre accesibles.
- `Combobox` compone Popover con el patrón ARIA 1.2; no agrega `cmdk`. El filtrado puede ser local (sin distinguir acentos) o externo mediante `onQueryChange`.
- `ConfirmDialog` permite confirmar con un callback asíncrono o enviar un formulario externo mediante `confirmFormId`.

## Patrones de layout

- `FilterCard` y `TableCard` materializan los filtros y la tabla de la captura S01.
- `FormCard`, `FormSection` y `FormActions` materializan las filas de formulario de la captura S06.
- `AccountMenu` materializa el menú de cuenta de las capturas S01/S02.
- Las apps componen estos patrones; no reimplementan su estructura.

## Consecuencias

La API de raíz cubre los estados de carga y los flujos de formularios solicitados. La dependencia de Toast aumenta el tamaño de instalación del paquete.

## Documented exceptions (design-token rule)

- `Tabs` underline variant uses an inset shadow expression referencing the primary token; it reproduces the reference screen S04 and has no standard utility equivalent.
- `Toast` caps its width with `calc(100vw - 2rem)` so it never overflows narrow viewports.
- `react-dom` and `@types/react-dom` appear as dev dependencies because `react-dom` is a declared peer dependency used by `SubmitButton` (`useFormStatus`) and by the test suite.
- The development-only gallery in consumer apps is outside the rule.
