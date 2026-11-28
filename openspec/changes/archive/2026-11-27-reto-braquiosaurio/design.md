# Design

## Context

La barca del río (`boat-challenge-view.ts`) ya resuelve la plataforma que se mueve: una cubierta firme a ras del suelo, el agua libre como foso sin pinchos y `hold`/`carry` para llevar a Rufo sin control. El reto C cambia el dibujo y la pregunta, no la física.

## Decisions

- **Misma geometría que la barca** (`BOAT_LAKE`, `BOAT_LENGTH`, bloques en la orilla): `challengeZone`, la validación, los huecos de agua y la duración se comparten. El braquiosaurio está metido en el río: el lomo, a ras del suelo, es la cubierta; el agua de delante tapa patas y tripa.
- **Emblemas como datos** en `src/learning/challenges/brachio.ts`: polígonos en una cuadrícula de 4 × 4 (y hacia abajo). Una prueba comprueba que caben y que sus piezas no se pisan.
- **Las piezas no giran**: encaja la que tiene la forma del hueco tal cual (`polyKey`, forma sin moverla de sitio). Así el reto C pide componer y el B, reconocer giros. Para los mayores, uno de los bloques es la pieza buena girada un cuarto de vuelta.
- **Distractores**: para los pequeños, la mitad del mismo lado de otro emblema (otra forma, mismo tamaño); para los demás, piezas de otros emblemas de su franja. Nunca dos bloques con la misma forma.
- **Escala**: la pieza del bloque va a 16 px por unidad y crece a 34 al volar a la tablilla, así se comparan los tamaños.
- **Sin galletas** al resolverse, como la barca.

## Risks / Trade-offs

- [Los puntitos de la segunda pista podrían confundirse con galletas] → son pequeños, amarillo pálido y solo dentro del hueco.
- [El cuello del braquiosaurio, alto, puede salirse de la pantalla en tablets 4:3] → solo decora: el reto se lee en la tablilla y en los bloques.
