# Tasks

## 1. Reglas

- [x] 1.1 Añadir en `AGENTS.md`, en «Restricciones no negociables», la restricción de rendimiento con las reglas técnicas de design.md y el enlace a `openspec/specs/performance/spec.md`. Verificar leyendo el archivo: la restricción aparece y el enlace apunta a la spec.
- [x] 1.2 Añadir en `openspec/config.yaml`, en `rules.proposal`, la regla de revisar la spec `performance` y declarar si el cambio la afecta. Verificar con `npx @fission-ai/openspec instructions proposal --change reglas-de-rendimiento --json`: la regla sale en `rules`.

## 2. Comprobación

- [x] 2.1 Medir con el procedimiento de design.md el nivel 12 del mundo 1 y el nivel 10 del mundo 2 sobre `dev` con la PR #22: cumplen el presupuesto (media ≤ 20 ms, percentil 95 ≤ 33 ms). Verificar anotando las cifras en la PR.
- [x] 2.2 `npx @fission-ai/openspec validate reglas-de-rendimiento` pasa.

## Workflow follow-up

- Sincronizar y archivar el cambio (`openspec-sync-specs`, `openspec-archive-change`) para crear `openspec/specs/performance/spec.md`.
