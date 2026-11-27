# Proposal

## Why

El juego tenía tirones en los niveles largos: el escenario vectorial se volvía a trazar en cada fotograma (141 ms de render por fotograma en el nivel de las nubes con la CPU frenada 4 veces). La PR #22 lo arregló, pero no hay ninguna regla escrita que impida volver a caer en lo mismo al añadir el mundo 3 o retos nuevos. El público son niños con tablets a menudo antiguas: la fluidez es parte de la experiencia, no un extra.

## What Changes

- **Spec nueva `performance`** con las reglas de rendimiento que todo cambio debe cumplir: presupuesto por fotograma medible, escenario estático sin coste por fotograma, bucle del nivel sin crecimiento de objetos, texturas acotadas y liberadas al salir, música sin cortes al cargar y movimiento igual a 60 y a 120 Hz.
- **`AGENTS.md`**: una restricción nueva que apunta a la spec y resume las reglas clave, para que también la cumplan los cambios pequeños que no pasan por OpenSpec.
- **`openspec/config.yaml`**: una regla para que cada propuesta revise la spec de rendimiento y declare si el cambio la afecta.

No cambia el comportamiento del juego: el código actual (tras la PR #22) ya cumple las reglas.

Habilidad educativa: ninguna.

**Fuera de alcance:** optimizaciones nuevas, un script de medición automático en CI (necesitaría Playwright como dependencia), presupuestos de tamaño de descarga o de tiempo de arranque de la PWA.

## Capabilities

### New Capabilities

- `performance`: reglas de rendimiento transversales que deben cumplir todas las escenas, mundos y retos, y cómo se comprueban.

### Modified Capabilities

Ninguna.

## Impact

- `openspec/specs/performance/spec.md` (nueva, al archivar el cambio).
- `AGENTS.md` y `openspec/config.yaml`.
- Sin cambios de código.
