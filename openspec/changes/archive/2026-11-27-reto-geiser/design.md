# Design

## Context

Los retos A, B y C se resuelven golpeando bloques (`ChallengeView` y la escalera de `ladder.ts`). El D se resuelve saltando, así que la escalera se lleva con las piedras: pisar una mala es un fallo (`hitBlock` con un índice que no es el bueno) y llegar a la otra orilla es el acierto.

## Decisions

- **Geometría** (`levels/types.ts`): lago de 11,25 baldosas, seis piedras de 1,25 cada 1,75; tótem 2,5 baldosas antes y géiser tras la orilla de llegada. Una prueba comprueba que saltar una piedra hundida (2,25 baldosas de lava) y llegar de la orilla a la segunda piedra caben de sobra en un salto.
- **La lava es agua de reto**: el escenario la quita del suelo (`waterHoles`) y `holes()` da la lava entre las piedras que siguen en pie. Caer en ella hace rebotar sin galleta, como el hueco del puente.
- **Piedra mala**: al pisarla, Rufo queda sujeto (`hold`) y vuelve en arco a la última piedra buena (o a la orilla) sin gravedad; la piedra se hunde y vuelve a subir, salvo tras el tercer fallo, cuando las malas se hunden del todo y pasan a ser lava.
- **Grabado en una estela** al fondo de cada piedra: la cara de la piedra queda casi entera bajo el borde de la pantalla, y la estela se ve sobre el suelo con Rufo delante.
- **Medianos, tótem sin color**: el tótem se talla en piedra clara para que no sugiera un color.

## Risks / Trade-offs

- [Los de 3 y 4 años podrían quedarse en la orilla sin saltar] → el niño solo necesita saltos cortos (0,5 baldosas entre piedras en pie) y la demostración enseña el camino.
- [La vuelta en arco quita el control medio segundo] → es el «rebote suave» del documento; dura menos que un pinchazo.
