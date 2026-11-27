# Proposal

## Why

Paso 8 del plan del mundo 3 (`docs/MUNDO-3.md`, «El castillo: el nido del cráter»): la isla, como el río, acaba en una parada propia después del último nivel que siempre da medalla.

## What Changes

- **Castillo de la isla** con la pieza `world-castle`: los retos A (camino de huellas), B (puerta de la cueva) y C (paseo en braquiosaurio) seguidos y dos preguntas de las pruebas de la bandera de la isla, distintas entre sí (sin el repaso del nivel 12).
- **Medalla de la huella**: cada castillo puede tener su medalla (`CastleDef.medal`); la de la isla lleva la huella de tres dedos de un dinosaurio en los colores de los grabados. Se ve al acabar el castillo, junto al castillo en el mapa y en el botón de formas del selector. Arte propio anotado en `LICENSES.md`.

**Fuera de alcance:** el dibujo propio del nido en el mapa (de momento, el icono del castillo) y su sitio definitivo, que llegan con el mapa del paso 9.

## Capabilities

### Modified Capabilities

- `world-castle`: castillo de la isla y medalla propia de cada mundo.
- `world-map`: la medalla de la huella en el mapa y en el selector.
