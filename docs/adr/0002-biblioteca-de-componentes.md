# ADR 0002: Biblioteca de componentes en tres niveles

- Estado: Propuesta
- Fecha: 2026-10-14
- Reemplaza parcialmente: ADR 0001 (alcance de componentes y herramientas)

## Contexto

El ADR 0001 limitaba el paquete a `Button` y posponía Storybook, Vitest y Changesets. Las capturas de referencia (S01–S20) exigen más de 30 componentes con comportamiento accesible (menús, sheet, tabs, select), lo que justifica adoptar primitivas probadas.

## Decisión

- Tres niveles bajo `src/components`: `ui/` (primitivos), `patterns/` (composiciones) y `layout/` (estructura). Todo se exporta desde la raíz de `@loganseiken/ui`.
- Comportamiento accesible con Radix UI, variantes con `class-variance-authority` e íconos con `lucide-react`. Son dependencias del paquete.
- Los componentes solo consumen tokens semánticos (`--ui-*`) mediante el tema de Tailwind. Los valores observados viven en primitivos de `tokens.css`.
- Client Components solo donde hay estado o primitivas Radix; el resto es renderizable en servidor.
- Se mantiene npm como gestor. Vitest con Testing Library queda adoptado (68 pruebas). Storybook y una línea base de regresión visual con Playwright siguen pendientes.
- Los valores de los tokens existentes cambian respecto a la versión provisional; mientras el paquete esté en 0.x se trata como cambio minor.

## Alternativas descartadas

- shadcn/ui como dependencia copiada: duplicaría componentes en cada app y rompería la idea de paquete compartido.
- Componentes sin Radix: reimplementar foco, teclado y ARIA de menús y diálogos tiene más riesgo que costo de dependencia.
- `cmdk`, editor de código y esquema visual: una sola captura no justifica la dependencia.

## Consecuencias

El paquete crece en peso y en superficie de API. Revisar Changesets, Storybook y pruebas visuales al llegar a tres consumidores.
