# Design

## Decisions

- **Misma regla y misma memoria que los gajos**: las manchas pintadas son `paintedBands` y las nuevas salen de `rainbowMemory`, así que abrir un perfil con progreso no anima nada y cada mancha nueva se anima una sola vez.
- **Patrón como dato puro** (`map/egg-spots.ts`): 12 posiciones en fracciones del alto del huevo y su color de la serie; una prueba comprueba que caben en el huevo y no se tocan.
- **Dibujo compartido** (`ui/island-egg.ts`): el mapa y el final dibujan el mismo huevo.
- **Final elegido por el mundo**: `WorldDef.finale` dice qué viñeta (`rain` o `hatch`); `MapScene` lanza una u otra con la misma secuencia (salto de Rufo, viñeta, candados que saltan).
- **La mamá se asoma por detrás del borde del cráter**, dentro de la viñeta: así no hace falta recortar nada y nunca se ve una boca abierta hacia el niño.
- **Borrador**: mientras la isla tenga 4 niveles, el final sale al terminar el 4; con los 12 del paso 9, al terminar el 12.

## Risks / Trade-offs

- [El huevo puede tapar nodos del mapa definitivo] → su sitio se fija en el paso 9 con el mapa de dos pantallas.
