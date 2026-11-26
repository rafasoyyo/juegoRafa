# Proposal

## Why

El mundo 2, «El río de los números» (`docs/MUNDO-2.md`), saca el aprendizaje de la bandera y lo mete en el recorrido: el niño acierta golpeando un bloque desde abajo, el gesto que ya domina. Es el paso 3 del plan y el de más riesgo, así que va primero: el motor común de los retos y, sobre él, la mecánica A, «Bloques que cuentan», con las estrellas por retos acertados a la primera.

## What Changes

- **Retos como datos**: un nivel puede declarar retos en su JSON (tipo, posición, cómo se muestra la cantidad, si va al revés y si Lalo hace la demostración). La validación comprueba que cada reto tiene sitio llano y libre a su alrededor.
- **Mecánica A, «Bloques que cuentan»**: un cartel muestra una cantidad (puntos o marco de diez) y encima del camino hay tres bloques con cifras; golpear el correcto abre la compuerta del arroyo y caen galletas. Al revés, el cartel lleva la cifra y los bloques la cantidad. Se adapta a la edad: 3-4 años, puntos con puntos de 1 a 5; 5-6 años, de la cantidad a la cifra de 1 a 10; 7-8 años, dos marcos de diez hasta 20.
- **La compuerta corta el paso** y no se puede saltar, pero nunca atasca: escalera de fallos (el bloque se tambalea y el cartel da un saltito; luego los puntos se encienden uno a uno contando; al tercer fallo Lalo vuela al bloque correcto y la compuerta se abre igualmente). **Fallar no quita galletas.**
- **Demostración de Lalo** en el reto marcado como demostración: Lalo vuela al cartel, cuenta los puntos y señala el bloque correcto; el niño lo golpea. Ese reto no cuenta para las estrellas.
- **Estrellas por retos** en los mundos que lo eligen (el río): 3 con el 75 % o más de retos acertados a la primera, 2 con el 40 % o más y 1 en el resto. El mundo 1 sigue con la regla de los bloques «?».
- **Sonidos** nuevos: compuerta que se abre y «tic» al contar.
- **Nivel 1 del río** en borrador con 3 retos A (el primero con demostración), jugable en desarrollo.

Habilidad educativa: **número** (cantidad y cifra, ver sin contar con el marco de diez).

**Fuera de alcance:**
- Mecánicas B (puente) y C (barca): pasos 4 y 5.
- Dedos como forma de mostrar la cantidad (la prueba «¿Cuántos dedos?» es del paso 7).
- Ambientes, recorridos definitivos y mapa del río (paso 9). La rana y el cangrejo (paso 6).
- Llevar los retos al mundo 1 o cambiar allí sus estrellas.
- Recordar entre partidas qué demostraciones ha visto el niño: la demostración va en el reto que la declara.

## Capabilities

### New Capabilities

- `course-challenges`: retos del recorrido (mecánica A), escalera de fallos, demostración, compuerta y registro de «a la primera».

### Modified Capabilities

- `level-courses`: los recorridos pueden llevar retos y su colocación se valida.
- `level-complete`: las estrellas se cuentan por retos en los mundos que lo eligen.
- `mascot-guide`: Lalo vuela por el nivel para la demostración y la ayuda del tercer fallo.
- `game-audio`: sonidos de la compuerta y del conteo.

## Impact

- `src/learning/challenges/` (nuevo): generador de la mecánica A por franja de edad con semilla, escalera de fallos y registro. `src/learning/scoring.ts`: `starsForChallenges`.
- `src/game/levels/types.ts`, `parse.ts`, `validate.ts`: retos en los datos y su validación.
- `src/game/challenges/` (nuevo): vista Phaser del reto (cartel, bloques con cara, compuerta, pistas y Lalo volando).
- `src/game/scenes/LevelScene.ts`, `QuizScene.ts`, `LevelCompleteScene.ts`: integrar los retos, pasar el registro y calcular las estrellas con la regla del mundo.
- `src/game/worlds/types.ts` y `rio/`: regla de estrellas del mundo y nivel 1 con retos.
- `src/game/enemies/enemy-layout.ts`: la zona de un reto se mantiene libre de enemigos.
- `src/game/audio/sfx.ts`: efectos `gate` y `tick`.
- Sin dependencias nuevas.
