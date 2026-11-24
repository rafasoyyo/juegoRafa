# Proposal

## Why

Los 6 niveles del mundo de los números ya se pueden completar, y un niño que los domina se queda sin reto. Seis niveles más largos y más exigentes, con una dificultad nueva, alargan el juego para ese niño: zonas de pinchos que hay que saltar. La dificultad sube poco a poco y se mantienen las reglas que lo hacen jugable a los 4–6 años: sin vidas, sin derrota y todo al alcance de un salto normal.

## What Changes

- **Niveles 7 a 12** en el mismo mundo de los números, a continuación del 6 en el camino del mapa. Cada uno tiene su recorrido propio en `content/levels/nivel-N.json`.
- **Más largos y más difíciles** que el 6, y cada uno más que el anterior:

  | Nivel | Longitud (baldosas) | Bloques «?» | Escalones / plataformas | Enemigos | Zonas de pinchos |
  |---|---|---|---|---|---|
  | 7 | 180 | 20 | 7 / 7 | 7 | 2 |
  | 8 | 185 | 21 | 8 / 7 | 8 | 3 |
  | 9 | 190 | 22 | 8 / 8 | 8 | 3 |
  | 10 | 195 | 23 | 9 / 9 | 9 | 4 |
  | 11 | 200 | 24 | 9 / 9 | 9 | 5 |
  | 12 | 210 | 25 | 10 / 10 | 10 | 6 |

  Cada nivel sigue teniendo **una fresa** escondida en un bloque «?» al azar.
- **Duración de los niveles 7–12:** entre 90 y 150 s jugando con calma, y más de 35 s yendo a tope. Para los niveles 1–6 siguen valiendo 60–120 s y más de 30 s.
- **Zonas de pinchos** (nueva), solo en los niveles 7–12:
  - Son tramos de suelo de 1 baldosa en los niveles 7–8 y de 1 o 2 a partir del 9, con pinchos redondeados de aspecto amable.
  - Se saltan con un salto normal y se definen en el JSON del nivel.
  - Van solo sobre el suelo. Quedan lejos de la salida, de la bandera, de los bloques, de los escalones, de las plataformas y de las otras zonas.
  - Tocarlos es un **pinchazo**, como con un enemigo: −1 galleta del contador del nivel (nunca por debajo de 0), sin cambiar las estrellas. Rufo rebota hacia atrás, **fuera de la zona**, al suelo por donde vino, y queda protegido 1 s parpadeando.
  - Con la fresa, los pinchos no hacen nada.
  - Tienen su propio sonido de choque, suave.
- **Enemigos:** nunca aparecen sobre los pinchos ni junto a ellos, y los erizos no los cruzan.
- **Seis ambientes nuevos:** 7 playa, 8 selva, 9 montaña, 10 nieve, 11 desierto y 12 nubes con arcoíris.
- **Mapa de 12 niveles:** el camino sigue más allá del nivel 6. El mapa se desplaza en horizontal, arrastrando o con flechas a los lados, y al abrirse se centra en el nivel actual. La bandera de final de mundo pasa al nivel 12.
- **Prueba de la bandera de los niveles 7–12:** repiten los tipos de los niveles 1–6 en el mismo orden (7 «¿Cuántos hay?» … 12 «¿Te acuerdas?»). El cambio `pruebas-nuevas-de-la-bandera` los sustituirá por pruebas propias.
- **Progreso guardado:** los perfiles guardados siguen funcionando sin migración. Un perfil con los 6 niveles hechos ve el 7 como actual.

Habilidades educativas: ninguna nueva. El cambio es de plataformas: atención, anticipación y coordinación al saltar. La parte educativa de los niveles nuevos llega con su prueba de la bandera.

**Fuera de alcance:**
- Pruebas de la bandera nuevas para los niveles 7–12 (cambio `pruebas-nuevas-de-la-bandera`).
- Pinchos en los niveles 1–6, sobre escalones o plataformas, o que se mueven.
- Hoyos, vidas, caídas fuera del recorrido o cualquier estado de derrota.
- Nuevos tipos de enemigo, enemigos más rápidos o nuevas frutas.
- Melodías nuevas por ambiente y estilos nuevos de plataforma (hielo, arena…): las plataformas siguen siendo troncos o nubes.
- Otros mundos del selector (letras, formas).

## Capabilities

### New Capabilities
- `spike-zones`: las zonas de pinchos. Cubre dónde pueden ponerse, cómo se ven y suenan, qué pasa al tocarlas (pinchazo, rebote fuera de la zona y protección) y su relación con la fresa y los enemigos.

### Modified Capabilities
- `level-courses`: de 6 a 12 recorridos; límites de bloques, duración y dificultad propios de los niveles 7–12; zonas de pinchos en los datos; seis ambientes nuevos.
- `world-map`: el camino tiene 12 niveles; el mapa se desplaza en horizontal y se centra en el nivel actual; la bandera pasa al nivel 12.
- `level-enemies`: cantidad de enemigos de los niveles 7–12, y las zonas de pinchos pasan a ser zonas seguras sin enemigos.
- `platformer-level`: los pinchos también restan galletas, pero siguen sin vidas, sin derrota y con el suelo continuo.
- `power-fruit`: el modo invencible también protege de los pinchos, y la fresa nunca se posa sobre ellos.
- `game-audio`: efecto propio del choque con pinchos.
- `flag-quiz`: tipo de prueba de los niveles 7–12.
- `level-complete`: el último nivel del mundo pasa a ser el 12.

## Impact

- **`content/levels/nivel-7.json` … `nivel-12.json`**, con un nuevo campo `spikes: { x, width }[]`.
- **`src/game/levels/`:**
  - `types.ts`: `SpikeData`, `WorldSpike` y los nuevos `AmbientId`.
  - `parse.ts`, `catalog.ts` (12 niveles), `validate.ts` (reglas de pinchos y límites por tramo de niveles) y `duration.ts` (segundos por zona de pinchos).
  - `ambients.ts`: 6 ambientes y sus decoraciones.
  - Sus pruebas.
- **`src/game/enemies/enemy-layout.ts`:** `ENEMIES_PER_LEVEL` con 12 valores, y las zonas de pinchos se añaden a `keepClear`.
- **`src/game/scenes/LevelScene.ts`:** dibujo de los pinchos, detección del contacto, rebote fuera de la zona, protección e inmunidad con la fresa.
- **`src/game/state.ts`:** `LEVEL_COUNT = 12`. `progress-codec.ts` ya acepta cualquier nivel hasta `LEVEL_COUNT` y no necesita formato nuevo.
- **`src/game/scenes/MapScene.ts`:** 12 nodos, desplazamiento horizontal con arrastre y flechas, y centrado en el nivel actual.
- **`src/game/scenes/LevelCompleteScene.ts`:** el último nivel es `LEVEL_COUNT`.
- **`src/learning/quiz/catalog.ts`:** tipos de prueba de los niveles 7–12.
- **`src/game/audio/sfx.ts`:** efecto `spikes`.
- **`BootScene.ts` y `widgets.ts`:** texturas y decoración de los ambientes nuevos, y textura de los pinchos.
- **Arte propio** dibujado por código: los pinchos y la decoración de los 6 ambientes (palmeras y mar, lianas y hojas, picos, pinos nevados y copos, cactus y dunas, arcoíris). Si se añade algún SVG, se anota en `public/assets/LICENSES.md`.
- **`docs/PROPUESTA.md`:** se actualiza para describir 12 niveles y los pinchos.
- Sin dependencias nuevas ni datos fuera del dispositivo.
