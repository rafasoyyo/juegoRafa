# Design

## Decisions

- **Sin cambios en la pieza del castillo** salvo la medalla: `castleCourse` ya coloca cualquier reto por su `challengeZone`, así que los retos de la isla entran sin tocarla. El reto D (géiser) no va, como dice el documento: el castillo usa los tres retos de bloques.
- **`medalTexture(castle, large)`** da la textura (`medal-footprint` y `medal-footprint-l`); sin `medal`, la de siempre. El mapa, el selector y el final del castillo la usan.
- **Borrador**: el castillo se abre al terminar el último nivel que haya (el 4 mientras la isla tenga 4).
