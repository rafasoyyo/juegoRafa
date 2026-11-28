# Proposal

## Why

Paso 5, el último del plan del mundo 1 (`docs/MUNDO-1.md`, «El castillo y la medalla»). El mundo 2 ya tiene castillo y medalla; el mundo 1 acababa en el nivel 12. Con su castillo, los dos mundos cierran igual y el viaje del arcoíris tiene premio propio.

## What Changes

- **Castillo del arcoíris**: parada propia del mapa tras el nivel 12, sobre una nube al pie del arcoíris, con el nodo y los estados que ya tiene el del río (cerrado con candado, abierto con halo, verde con la medalla).
- **5 preguntas en la bandera**, de pruebas del mundo 1, una de cada: contar, comparar, serie, repartir y balanza. El recorrido del castillo no tiene retos (el mundo 1 no tiene mecánicas de recorrido): solo correr hasta la bandera, por las nubes.
- **Medalla del arcoíris**, siempre, como en el río; se ve en el botón 123 del selector.
- Solo datos del mundo (`ARCOIRIS.castle`, un nodo más en el mapa y la nube bajo el castillo): la pieza del castillo, el nodo y la medalla del selector ya existen y no cambian.

Habilidad educativa: repaso de contar, comparar cantidades, series, reparto y equilibrio.

**Fuera de alcance:** cambios en la pieza del castillo, sonidos o dibujos nuevos, voz grabada.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `world-castle`: el castillo del arcoíris y sus preguntas.
- `world-map`: el castillo en el mapa del mundo 1 y su medalla en el botón 123.

## Impact

- `src/game/worlds/arcoiris/index.ts`: `CASTLE`, nodo 13 y nube del castillo.
- `src/game/worlds/worlds.test.ts`: pruebas del castillo del arcoíris.
- `docs/MUNDO-1.md`: estado del plan.
