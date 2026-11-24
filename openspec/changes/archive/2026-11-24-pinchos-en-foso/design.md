# Design

## Context

- **Suelo físico.** `LevelScene.create` crea una sola `zone` estática de todo el ancho del mundo (`GROUND_TOP` = 620, 100 px de alto) y la añade a `surfaces`, que también usa la fresa (`physics.add.collider(fruit, this.surfaces)`).
- **Suelo dibujado.** `widgets.addScenery` llama a `drawGround(scene, 0, worldW, …)` de una vez. Ese suelo tiene 4 estilos de borde (`grass`, `sand`, `snow`, `cloud`); los de nieve y nube llevan bultos circulares en el borde inferior de la capa de arriba.
- **Pinchos actuales.**
  - Dibujo: `BootScene.makeSpikes` genera la textura `spikes` (84 × 66), y `buildSpikes` la repite con un `tileSprite` apoyado 6 px dentro del suelo.
  - Contacto: lo deciden `spikes.ts` (`onSpikes` con `SPIKE_FORGIVE` = 16 px y `FOOT_INSET` = 12 px) y `LevelScene.spikesUnderFeet`, solo con Rufo apoyado a la altura del suelo.
  - Rebote: `exitSide` y `reboundVelocity` calculan el rebote suponiendo que despega y aterriza a la misma altura.
  - Si hay protección o fresa (`checkSpikes`), no pasa nada y Rufo anda por encima.
- **Fresa.** `tickPower` da 1 s de protección si el modo invencible acaba con Rufo sobre los pinchos. `nudgeOffSpikes` aparta la fresa de las zonas.
- **Física.**
  - Gravedad: 2880 px/s².
  - Rebote: `KNOCK_VY` ≈ 845 px/s, así que sube ≈ 124 px.
  - Cuerpo del zorro: 56 × 87 px.
  - Control: `KNOCK_MS` = 300 y `PROTECT_MS` = 1000. Coyote de 100 ms.
- **Pruebas.** `ambients.test.ts` exige ΔE ≥ 30 entre el morado de los pinchos y el suelo y el cielo de cada ambiente. `spikes.test.ts` cubre el margen de perdón y el rebote.
- **Medidas validadas** en la maqueta: foso de 64 px, puntas 22 px bajo el suelo, conos de unos 33 px más una placa de 9 px, 3 conos por baldosa de 84 px, borde redondeado de 10 px y la pared del foso hecha con la tierra del ambiente mezclada al 42 % con la tinta `#2B2340`.

## Goals / Non-Goals

**Goals:**
- Que el foso sea geometría real: Rufo cae dentro y lo frena el fondo, sin ilusiones visuales.
- Mantener toda la geometría (tramos de suelo, contacto, rebote y recolocación en el borde) en `spikes.ts`, puro y probado con Vitest.
- Seguir reutilizando el pinchazo común (`knock`) para enemigos y pinchos.
- No tocar los JSON de nivel, ni `validate.ts`, ni la colocación de enemigos.

**Non-Goals:**
- Huecos genéricos en el suelo o un sistema de terreno por baldosas.
- Animar los pinchos (que suban y bajen) o hacer que tiemblen al pincharse.

## Decisions

### 1. Constantes del foso en `spikes.ts`
`PIT_DEPTH = 64`, `PIT_TIP = 22`, `PIT_LIP_RADIUS = 10`, `SPIKE_CONE_H = 33`, `SPIKE_PLATE_H = 9`, `CONES_PER_TILE = 3` y `LIP_MIN_FOOT = 12`. Todas las piezas leen estas constantes: el dibujo, la física y las pruebas. Desaparece `SPIKE_FORGIVE`, porque ahora el margen lo da el borde (decisión 4).

### 2. Suelo por tramos
`groundSpans(worldW, spikes)` (puro) devuelve los tramos `{ from, to }` de suelo firme: el ancho del mundo menos cada zona. `LevelScene`:
- Crea una `zone` estática por tramo, con la misma altura y la misma cara superior que hoy.
- Crea una `zone` estática por foso con la cara superior en `GROUND_TOP + PIT_TIP`, que hace de fondo sobre las puntas. Rufo queda de pie sobre las puntas: con 87 px de cuerpo, la cabeza sobresale del suelo.
- Mete en `surfaces` solo los tramos, no los fondos: la fresa nunca debe posarse en un foso.

Alternativa descartada: mantener la zona continua y hundir a Rufo solo en el dibujo. Habría pies flotando sobre el hueco y dos geometrías distintas que mantener.

### 3. Contacto: estar apoyado dentro del foso
`pitUnder(bodyBottom, foxX, spikes)` devuelve la zona si Rufo está apoyado con `bodyBottom > GROUND_TOP + 2` y su centro dentro de la zona. Como solo puede apoyarse ahí sobre el fondo, estar apoyado en un foso es tocar las puntas. Si salta por encima, nunca se apoya dentro y no hay pinchazo.

### 4. El borde sostiene y recoloca
Los tramos acaban justo en el borde dibujado. Arcade sostiene a Rufo mientras parte de su cuerpo quede sobre el tramo. Para que no se quede «flotando» sobre el hueco, `lipNudge(bodyX, bodyW, spikes)` (puro) devuelve −1, 0 o 1:
- Devuelve la dirección hacia el suelo firme si Rufo está apoyado en un tramo junto a un foso, con menos de `LIP_MIN_FOOT` px de pie (el cuerpo sin `FOOT_INSET`) sobre el tramo.
- Devuelve 0 en cualquier otro caso.

`LevelScene` aplica una velocidad suave de 0,3·`RUN_SPEED` en esa dirección solo si el niño no pulsa ninguna flecha y no hay rebote en curso. Si el niño pulsa hacia el foso, Rufo cae en cuanto el cuerpo deja el tramo. Nunca se le empuja hacia los pinchos.

### 5. Paredes sólidas al caer, ignoradas al rebotar
El collider entre el zorro y los tramos usa un `processCallback`. Mientras dura el rebote (`spikeRebound`), ignora el contacto si los pies de Rufo están por debajo de `GROUND_TOP`, es decir, si es contacto con la pared. Así:
- Al caer, la pared le frena y no se mete en la tierra.
- Al rebotar, nada le corta la velocidad horizontal. Sube los 22 px de pared en ≈ 0,03 s, mientras avanza ≈ 12 px.

Alternativa descartada: recolocar a Rufo unos píxeles antes del rebote. Se notaría el salto.

### 6. Rebote desde el fondo
`reboundVelocity` usa el tiempo en el aire hasta volver a una altura `PIT_TIP` por encima del despegue: `t = (v + √(v² − 2·g·PIT_TIP)) / g` ≈ 0,559 s, en lugar de `2v/g` ≈ 0,587 s. El destino sigue siendo `REBOUND_CLEAR` = 0,75 baldosas fuera del borde, más medio cuerpo.

Peor caso: foso de 2 baldosas, Rufo pegado a la pared contraria. Recorre ≈ 231 px, así que `vx` ≈ 413 px/s, muy por debajo de `MAX_VELOCITY.x`. En lo más alto queda ≈ 102 px por encima del suelo.

### 7. Pinchazo con o sin galleta
`knock(time, side, vx, sound, costsCookie)`:
- Con galleta: pinchazo normal.
- Sin galleta (protegido o invencible): hace el mismo brinco y el mismo sonido y bloquea el control `KNOCK_MS`, pero no llama a `loseCookie` ni a `dropCookie`, no alarga `protectedUntil` y no reinicia el parpadeo (`hitAt`).

`checkSpikes` llama siempre a `knock` si `pitUnder` devuelve una zona, y pasa `costsCookie = !protegido && !invencible`. Se quita de `tickPower` la protección especial «acaba sobre los pinchos», porque ya no se puede estar sobre los pinchos sin rebotar.

### 8. Dibujo
- **Pinchos.** `BootScene.makeSpikes` genera `spikes` de 84 × 33 con 3 conos. Cada cono tiene tres caras que acaban en punta: luz `#E6ECF3`, medio `#B4BFCC` y sombra `#7F8C9D`, más un reflejo blanco al 70 %. No hay contorno.
- **Destello.** Es una textura aparte, `spike-glint`: una estrella de 4 puntas blanca.
- **Foso.** Cada zona se dibuja de atrás adelante:
  - `widgets.drawPit` pinta la pared del fondo con el color de `pitWall(ambient)`, 12 px más ancha por lado para que asome bajo las esquinas redondeadas.
  - Encima, una sombra en degradado bajo el borde (alfa 0,45 → 0, unos 26 px) y la tierra bajo el fondo con una línea más oscura.
  - Luego van la placa con remaches cada 28 px (`Graphics`, redondeada), el `tileSprite` de conos y el destello sobre la primera punta.
  - Por último, los tramos de suelo.
- **Color de la pared.** `pitWall(ambient)` (puro, en `ambients.ts`) mezcla la tierra del ambiente con la tinta.
- **Tramos de suelo.** `drawGround` gana un parámetro opcional `round: { left?: boolean; right?: boolean }` y redondea la esquina superior del lado del foso con `fillRoundedRect` de radio por esquina. Los bultos de nieve y nube se recortan al tramo para que no cuelguen sobre el hueco. Title y LevelComplete siguen llamándolo como hoy.
- **`addScenery`** recibe los tramos y los fosos y dibuja primero los fosos y después los tramos.

## Risks / Trade-offs

- **Contraste en ambientes claros** (nieve, nubes): con la mezcla al 42 %, el acero medio queda cerca del umbral ΔE 30 contra la pared del foso. → `ambients.test.ts` medirá acero claro y medio contra `pitWall` en los 12 ambientes. Si no pasa, se sube la mezcla de esos ambientes (dato propio en `ambients.ts`) antes de tocar el acero.
- **Rufo se mete unos píxeles en la pared** durante el rebote, porque se ignora la pared. → Es menos de 0,03 s y ≈ 12 px, y la textura del zorro es más ancha que su cuerpo. Se comprobará a ojo a 844×390.
- **La fresa cae en un foso**: hoy no puede pasar, porque los bloques están a ≥ 2 baldosas de las zonas y la fresa se posa a < 1. → Los fondos no están en `surfaces`. Si algún día pasara, la fresa caería fuera del mundo. Se añade una prueba en `spikes.test.ts`: con las medidas reales, ningún bloque de los niveles 7 a 12 suelta la fresa sobre un foso.
- **Más cuerpos estáticos** (hasta 7 tramos y 6 fondos en el nivel 12): el coste es despreciable en Arcade.
- **Cambia la sensación del borde**: antes rozar el borde nunca pinchaba; ahora quien se para con casi todo el cuerpo fuera se desliza hacia atrás. Es más amable, pero hay que probarlo con el dedo en el móvil.
