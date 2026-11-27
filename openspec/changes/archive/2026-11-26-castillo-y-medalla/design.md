# Design

## Context

El mundo 2 tiene tres mecánicas de reto en el recorrido (contar, puente y barca) y una prueba de la bandera por nivel. El castillo junta unas y otras en una parada final que nunca se suspende. El mundo 1 no tiene retos en el recorrido, así que la pieza tiene que funcionar también solo con preguntas.

## Goals / Non-Goals

**Goals:** una pieza de datos (`CastleDef`) que cualquier mundo declara en su `WorldDef`; reutilizar el nivel y la prueba de la bandera sin escenas nuevas; la medalla en el progreso del perfil.

**Non-Goals:** el castillo del mundo 1, música propia del castillo, contenido final del río.

## Decisions

- **Lista de pasos.** `CastleDef.steps` es una lista de `{ challenge }` (reto del recorrido) o `{ quiz: [...] }` (una pregunta de una de esas pruebas). Se juegan primero los del recorrido y después las preguntas, al llegar a la bandera. Alternativa descartada: escribir el recorrido del castillo a mano en JSON; montarlo solo evita que el castillo del mundo 1 necesite otro recorrido y garantiza que cumple `validate.ts` (lo comprueban las pruebas).
- **Recorrido generado.** `castleCourse` pone los retos seguidos con 4 baldosas de suelo entre ellos, respetando las distancias a la salida y a la bandera de `validate.ts`. Sin bloques, pinchos ni enemigos (los tramos libres quedan vacíos) y sin demostración de Lalo. Tras la bandera se dibuja el castillo.
- **Mismas escenas.** `LevelScene`, `QuizScene` y `LevelCompleteScene` reciben `castle: true`. La prueba hace una pregunta por paso (`generateCastleQuiz`), cada una con su vista, su zona y su texto para el adulto, como el repaso del río; las marcas de progreso se centran según el número de preguntas.
- **Siempre medalla.** `LevelCompleteScene` llama a `winMedal` pase lo que pase en la prueba; no se guardan estrellas ni pendientes del castillo.
- **Apertura.** `castleStatus`: cerrado hasta que el último nivel está hecho o pendiente (igual que se abre el nivel siguiente), abierto y, con la medalla, hecho.
- **Guardado.** `medal: true` solo se escribe si se ha ganado, así el progreso guardado de antes sigue igual.

## Risks / Trade-offs

- Con 3 niveles en el borrador del río, el castillo usa el nodo 4 del mapa provisional; el paso 9 fija el mapa definitivo.
- La flecha grande tras el último nivel ahora lleva al castillo si el mundo tiene; en el mundo 1, que aún no tiene, sigue llevando al mapa.
