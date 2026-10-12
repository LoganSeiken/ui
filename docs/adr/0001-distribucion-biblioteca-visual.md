# ADR 0001: Distribución de la biblioteca visual

- Estado: Aceptada
- Fecha: 2026-10-12

## Contexto

`crm-lite-core` y `ai-receptionist-core` son aplicaciones independientes en repositorios y cuentas distintas. El consumidor piloto usa Next 16, React 19 y Tailwind 4; en el futuro podría aparecer UI en otras tecnologías.

## Decisión

Crear el repositorio público `LoganSeiken/ui` como un único paquete `@loganseiken/ui`, sin monorepo. Publicarlo en npmjs público: la primera publicación será manual con 2FA y desde 0.1.1 se configurará trusted publishing mediante OIDC en otra tarea.

La compilación usa solo `tsc` para ESM y declaraciones. React 19, React DOM 19 y Tailwind 4 son peers; `clsx` y `tailwind-merge` son dependencias. Los tokens agnósticos viven en `tokens.css`; `theme.css` importa esos tokens y los mapea a Tailwind 4. El paquete no compila utilidades CSS. La API pública inicial incluye `.`, `./theme.css`, `./tokens.css` y `./package.json`; el único componente es `Button`. No se incluyen Storybook, Changesets ni Vitest.

## Alternativas consideradas

- GitHub Packages privado: descartado por exigir autenticación en cada consumidor y PAT classic.
- npm privado: costo.
- Dependencia Git: sin semver ni rollback limpio.
- Monorepo global: incompatible con cuentas separadas.
- CSS precompilado: duplicaría utilidades y podría generar conflictos.
- Paquetes separados `tokens` y `ui-react` desde el inicio: prematuro sin consumidor de otra tecnología.

## Consecuencias

El código será público y los consumidores no necesitarán credenciales. El scope está ligado a la cuenta `loganseiken`; cambiarlo es breaking. Si surge otra tecnología, extraer `@loganseiken/tokens` y crear `@loganseiken/ui-<tecnología>` en este mismo repo sin romper `@loganseiken/ui/theme.css`.

Revisar esta decisión si se requiere privacidad, aparece una organización propietaria, surge un consumidor de UI en otra tecnología o sin Tailwind 4/React 19, o se superan 10 componentes o 3 consumidores (evaluar Changesets, Storybook y Vitest).
