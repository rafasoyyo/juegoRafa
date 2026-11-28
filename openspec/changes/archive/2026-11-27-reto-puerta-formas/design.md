# Design

## Decisiones

- **Misma geometría que los bloques que cuentan**: la losa va donde la compuerta, sin cartel (el hueco es la consigna). La zona crece 2,5 baldosas por detrás para el triceratops, así ni enemigos ni bloques se le echan encima.
- **Los bloques van siempre derechos** y el giro está en el hueco: elegir la pieza es reconocer la forma girada; el vuelo con giro enseña que encaja.
- **Formas que no cambian al girar** (círculo, cuadrado) nunca salen giradas: el giro no se notaría.
- **Piezas de los mayores**: las mismas piezas sin simetría de «Igual aunque gire» (`piecePoints` de `ui/quiz/island-art.ts`), así la prueba y el reto hablan el mismo idioma. Esta rama parte de las PR #24 y #26.
- **Todo estático**: la losa, la fachada y el triceratops se dibujan una vez; solo se animan con tweens al fallar o resolver.
