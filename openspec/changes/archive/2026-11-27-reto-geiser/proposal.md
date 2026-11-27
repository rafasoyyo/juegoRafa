# Proposal

## Why

Paso 4 del plan del mundo 3 (`docs/MUNDO-3.md`, «D. Las piedras del géiser»): clasificar por un rasgo (y, los mayores, por dos), «pisa solo los círculos», el ejemplo de la propuesta. Es el único reto de la isla que se resuelve saltando.

## What Changes

- **Mecánica D de la isla**: un tótem en la orilla muestra una forma; sobre un lago de lava hay seis piedras con una estela grabada. Las que cumplen lo del tótem aguantan y suenan; las otras se hunden despacio con un siseo y Rufo vuelve con un saltito a la piedra buena anterior (o a la orilla), sin galleta menos. Al llegar a la otra orilla, el géiser lanza vapor.
- **Según la edad**: la forma, todo del mismo color (3-4); la forma aunque cambie de color o tamaño, con el tótem sin color (5-6); forma y color a la vez, con trampas de un solo rasgo (7-8).
- **Siempre hay camino**: nunca dos piedras malas seguidas, y saltar una hundida cabe en un salto.
- **Escalera de fallos**: el tótem se ilumina; las buenas brillan de una en una; Lalo vuela sobre las buenas y las malas se hunden del todo.
- **A la primera**: si cruza sin pisar ninguna mala.
- **Datos**: `"kind": "geyser"`, con tótem, lago y géiser.
- **Sonidos**: `hiss` (piedra que se hunde) y `steam` (géiser).
- **Borrador**: un nivel 4 de la isla con tres lagos, para probarlo en desarrollo.

Habilidad educativa: **clasificar** (por forma; por forma y color).

**Fuera de alcance:** la variante «la serie» de los mayores y los recorridos definitivos (paso 9).

## Capabilities

### Modified Capabilities

- `course-challenges`: mecánica D de la isla.
- `level-courses`: `geyser` en los datos.
- `platformer-level`: piedras que se hunden y vuelta a la anterior.
- `game-audio`: siseo y vapor.
