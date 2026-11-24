# Design

## Context

- **Recorridos.** Están en `content/levels/nivel-N.json` (`ambient`, `length`, `steps`, `platforms`, `blocks`, en baldosas de 84 px). `catalog.ts` importa los 6 y los pasa por `parseLevel`. `validate.ts` comprueba las reglas geométricas de cada nivel (alcance, salida y bandera libres, `maxEmpty`…). `catalog.test.ts` comprueba las reglas entre niveles: `MIN_BLOCKS`/`MAX_BLOCKS` 12–20, que el número de bloques no baje, los ambientes en orden y la dificultad creciente.
- **Duración.** `duration.ts` la estima así: `fastS = (length − 10) · 84 / RUN_SPEED` y `calmS = fastS + 2,5·bloques + 1,5·plataformas + 1·escalones`, con `RUN_SPEED` = 352 px/s.
- **Física** (`main.ts` y `LevelScene.ts`): gravedad 2880 px/s² y `JUMP_SPEED` 1056 px/s, así que el salto dura ≈ 0,73 s en el aire. Como la velocidad horizontal se mantiene en el aire, recorre ≈ 258 px (≈ 3,07 baldosas).
- **Pinchazo de enemigo.** `onEnemyHit` aplica `KNOCK_VX` = 0,6·`RUN_SPEED` y `KNOCK_VY` = 0,8·`JUMP_SPEED`, unos 0,59 s en el aire y ≈ 125 px hacia atrás. Después: `KNOCK_MS` 300, `PROTECT_MS` 1000, `loseCookie` y `dropCookie`.
- **Fresa.** `tickPower` ya da 1 s de protección si el modo invencible acaba tocando un enemigo. La fresa sale con `FRUIT_VX` ≈ 123 px/s y se posa a menos de 1 baldosa del bloque.
- **Enemigos.** `enemy-layout.ts`: `courseFor(world)` construye `keepClear` con bloques, escalones y plataformas. Los enemigos solo van en tramos libres, con `BLOCK_CLEAR` = 150 px a cada lado. `ENEMIES_PER_LEVEL` tiene 6 valores.
- **Ambientes.** `ambients.ts` guarda colores y `decor` (`clouds`, `flowers`, `trees`, `autumn-trees`, `sunset`, `night`), y `platform` es `log` o `cloud`. `BootScene` genera las texturas de decoración y `widgets.addScenery` y `drawGround` las dibujan. El suelo siempre se dibuja como hierba sobre tierra.
- **Mapa.** `MapScene` coloca 6 `NODES` en un lienzo de diseño de 1180×820 escalado al ancho, sin cámara móvil. `RoundButton` dispara `onTap` en `pointerup` solo si sigue `pressed`.
- **Estado.** `state.ts` tiene `LEVEL_COUNT = 6`. `progress-codec.ts` descarta niveles mayores que `LEVEL_COUNT`, así que subirlo a 12 no rompe nada.
- **Prueba.** `QUIZ_BY_LEVEL` tiene entradas del 1 al 6. `recall.ts` elige miniaturas de paisaje entre `AMBIENT_IDS`.

## Goals / Non-Goals

**Goals:**
- Que los pinchos sean solo datos más una comprobación por fotograma: sin cuerpos físicos nuevos ni colisiones de Phaser.
- Que todas las reglas de colocación se comprueben con Vitest, sin navegador.
- Reutilizar el pinchazo, la protección y el modo invencible que ya existen, en lugar de duplicarlos.
- Mantener los niveles 1–6 exactamente como están.

**Non-Goals:**
- Un editor de niveles o un generador automático de recorridos: los 6 JSON se escriben a mano y los valida la batería de pruebas.
- Unificar los límites de los niveles 1–6 con los de 7–12: cada tramo de niveles tiene los suyos.

## Decisions

### 1. Las zonas de pinchos son datos del nivel
- El JSON gana `spikes: { x, width }[]` (borde izquierdo y ancho en baldosas). Es opcional: si falta, se lee como `[]`, así que los niveles 1–6 no cambian.
- `types.ts`: `SpikeData`, y `WorldSpike { index, x, width }` en px. `parse.ts` las convierte al mundo.
- `validate.ts` (reglas de un nivel) añade:
  - Ancho entre 1 y 2 baldosas.
  - Solo sobre el suelo: ni dentro de un escalón ni bajo una plataforma.
  - Al menos 10 baldosas tras la salida y antes de la bandera.
  - Al menos 2 baldosas desde el centro de un bloque y desde el borde de un escalón o una plataforma.
  - Al menos 6 baldosas entre zonas.
  - El ancho más 2 márgenes de despegue y aterrizaje de 0,5 baldosas no puede superar el salto normal (≈ 3,07 baldosas), calculado a partir de las constantes de física.
  - Las zonas cuentan como elemento para `maxEmpty`.
- `catalog.test.ts` (reglas entre niveles) añade:
  - Ninguna zona en los niveles 1–6.
  - Número de zonas 2, 3, 3, 4, 5 y 6, y ancho 1 en los niveles 7–8.
  - Bloques: 12–20 en los niveles 1–6 y 20–25 en los 7–12, sin bajar nunca.
  - Dificultad del 7 al 12 sin bajar en ningún eje, y el 12 con estrictamente más plataformas, escalones y zonas que cualquier otro.

Alternativa descartada: colocar los pinchos al azar, como los enemigos. Se perdería la garantía, comprobada en las pruebas, de que siempre se pueden saltar, y además el niño aprende un recorrido fijo.

### 2. Contacto por los pies, con margen de perdón
En cada fotograma, si el modo invencible no está activo, no hay protección y Rufo está apoyado en el suelo (`blocked.down`), se comprueba si el tramo de sus pies (el ancho del cuerpo reducido) se solapa con alguna zona recortada 16 px por cada lado. Si se solapa, hay pinchazo de pinchos.

Así, rozar el borde no cuenta y no hace falta una caja física. Además, un salto que pasa rozando por encima nunca pincha, porque solo cuenta estar apoyado.

Alternativa descartada: un `StaticBody` con `overlap`. Pincharía también en el aire al rozar la punta, sería menos predecible para un niño y habría que ajustar su altura a cada dibujo.

### 3. Rebote calculado para salir de la zona
- **Lado de salida.** Mientras Rufo pisa suelo fuera de los pinchos, se guarda `lastSafeX`. Al pincharse, el rebote va hacia el lado de `lastSafeX` respecto al centro de la zona, que es el lado por donde entró. Si no hay `lastSafeX`, va hacia el borde más cercano.
- **Velocidad.** La vertical es la misma `KNOCK_VY` que con un enemigo. La horizontal se calcula para aterrizar a 0,75 baldosas fuera del borde, más medio cuerpo: `vx = distancia / tiempo_en_el_aire(KNOCK_VY)`, limitada por `MAX_VELOCITY.x`. Para la peor zona (2 baldosas, entrando por el borde opuesto) sale ≈ 500 px/s, por debajo del límite.
- **Después.** Se reutilizan `knockUntil`, `protectedUntil` (1 s), `loseCookie`, `dropCookie` y el contador. `onEnemyHit` se parte en un `knock(side, vx, sound)` común y dos llamadas: enemigo y pinchos.

Alternativa descartada: el mismo brinco fijo que con un enemigo (≈ 125 px). En una zona de 2 baldosas Rufo volvería a caer en los pinchos y un niño quieto perdería una galleta cada ~1,3 s.

### 4. Pinchos e invencibilidad
- Durante el modo invencible no se hace la comprobación de los pinchos. Rufo pisa el suelo de debajo, que es continuo, y corre por encima.
- Al terminar el modo, `tickPower` da también 1 s de protección si Rufo está sobre una zona, igual que ya hace con los enemigos.

### 5. La fresa nunca sobre pinchos
La regla de 2 baldosas entre bloques y zonas ya basta, porque la fresa se posa a menos de 1 baldosa del bloque. Aun así, por seguridad, `settleFruit` comprueba si se ha posado sobre una zona y, si es así, la desplaza al borde más cercano antes de empezar los botecitos.

### 6. Enemigos lejos de los pinchos
`courseFor` añade las zonas de pinchos a `keepClear`, así que el reparto existente deja `BLOCK_CLEAR` (150 px) a cada lado. Los erizos nunca patrullan sobre ellos y los aterrizajes del rebote (≈ 63–110 px fuera del borde) quedan libres.

`ENEMIES_PER_LEVEL` pasa a 12 valores: `[2,3,4,5,6,7,7,8,8,9,9,10]`. La prueba «caben todos» se amplía a los 12 niveles con muchas semillas.

### 7. Recorridos de los niveles 7–12
Las cifras están en la tabla de `proposal.md`. Duración con calma estimada, sumando 1 s por zona de pinchos en `duration.ts`:

| Nivel | Con calma | A tope |
|---|---|---|
| 7 | ≈ 110 s | ≈ 41 s |
| 8 | ≈ 116 s | ≈ 42 s |
| 9 | ≈ 121 s | ≈ 43 s |
| 10 | ≈ 128 s | ≈ 44 s |
| 11 | ≈ 131 s | ≈ 45 s |
| 12 | ≈ 141 s | ≈ 48 s |

Todos dentro de 90–150 s y por encima de 35 s. Los límites pasan a depender del nivel (`durationLimits(level)`).

Pauta para diseñar los JSON:
- Alternar tramos de bloques con tramos de pinchos, con algún pincho entre dos escalones (respetando las 2 baldosas).
- En los niveles 11–12, algún pincho justo antes de una plataforma, para que el salto al pincho lleve a ella.
- Siempre con la regla de que nada atrapa.

### 8. Seis ambientes nuevos
- **Tipos.** `AmbientId` gana `playa`, `selva`, `montana`, `nieve`, `desierto` y `nubes`. `DecorKind` gana `beach`, `jungle`, `mountains`, `snow`, `desert` y `rainbow`.
- **Suelo.** `Ambient` gana `ground: 'grass' | 'sand' | 'snow' | 'cloud'`. `drawGround` lo usa para el borde superior: matas de hierba, borde liso de arena, borde de nieve redondeado o borde de nube festoneado. Los colores siguen en `grass`, `grassDark` y `earth`.
- **Plataformas.** Las de `nubes` usan el estilo `cloud`; el resto, `log`.
- **Decoración** por código en `BootScene` (estilo plano, sin contornos negros, más apagada que el recorrido):
  - Playa: palmera y franja de mar en el horizonte.
  - Selva: hoja grande y liana.
  - Montaña: pico nevado.
  - Nieve: pino nevado y copos con paralaje.
  - Desierto: cactus redondeado y duna.
  - Nubes: arcoíris y nubes grandes.
- **Contraste.** Desierto con arena pálida (≈ `#F2DFB0`) y tierra marrón clara, nunca naranja, para que el zorro naranja destaque. Nieve con suelo blanco azulado y base gris azulada. `ambients.test.ts` comprueba con un cálculo de contraste que el zorro, el bloque y los pinchos destacan sobre el suelo y el cielo de cada ambiente, con un umbral fijado en la prueba.

### 9. Gráfico de los pinchos
Se dibuja con `Graphics` en `BootScene` como textura repetible de 1 baldosa: 3 conos de punta redondeada en el morado de la paleta (`COLORS.purple`), con un brillo claro y una base de piedra gris clara con sombra inferior sólida. Se usa igual en todos los ambientes: el morado no aparece en ningún suelo y se distingue del erizo, que es marrón.

### 10. Mapa con cámara que se desplaza
- **Lienzo.** El de diseño pasa a 2 pantallas de ancho (2 × 1180). `NODES` tiene 12 posiciones: las 6 actuales en la primera mitad y otras 6 que continúan el camino en zigzag. La decoración de la segunda mitad mezcla árboles con 2–3 adornos de los ambientes nuevos (palmera, pino nevado, cactus, arcoíris), que reutilizan sus texturas.
- **Cámara.** Límites `[0, anchoLienzo]` en x. El cielo y el HUD (contador, Lalo, botón del zorro, selector de mundos, flechas) quedan fijos con `fixToCamera` o `setScrollFactor(0)`.
- **Arrastre.** `pointerdown` guarda el punto. Si el puntero se mueve más de 12 px en x, empieza el arrastre: se llama a `setPressed(false)` en todos los botones de nodo, así su `pointerup` ya no dispara `onTap`, y `scrollX` sigue al dedo. Un pequeño impulso al soltar es opcional.
- **Flechas.** Dos `RoundButton` grandes con el icono de flecha, que solo se ven si queda camino por ese lado. Al tocarlas, la cámara se desplaza con un tween el 70 % del ancho visible.
- **Al abrir**, `scrollX = clamp(xDelNodoActual − ancho/2)`.
- **Bandera.** El icono de bandera pasa del nodo 6 al 12 (`level === LEVEL_COUNT`).

Alternativa descartada: dos filas o nodos más pequeños en una sola pantalla. Con 12 nodos de 96 px lógicos en 844×390, los nodos y las estrellas serían demasiado pequeños para tocar y leer de un vistazo.

Alternativa descartada: dos páginas del mapa. Partiría el camino y el niño perdería la sensación de avance continuo.

### 11. Estado, prueba y celebración
- `LEVEL_COUNT = 12`. El desbloqueo, el nivel actual y el codec ya están escritos en función de `LEVEL_COUNT`.
- `LevelCompleteScene` usa `LEVEL_COUNT` para el último nivel.
- `QUIZ_BY_LEVEL` gana las entradas 7–12 con el mismo ciclo. Así el cambio `pruebas-nuevas-de-la-bandera` solo tendrá que cambiar esas 6 entradas.

### 12. Sonido de los pinchos
Nuevo efecto `spikes` en `sfx.ts`: un «¡uy!» corto, con un tono que sube y baja rápido, triangular y suave, con el mismo volumen moderado que `bump` y distinguible de él. Se prueba en `sfx.test.ts` como los demás efectos.

## Risks / Trade-offs

- **[Riesgo] Los pinchos pueden ser demasiado difíciles a los 4 años** → Se saltan con un salto normal, cuestan como mucho 1 galleta por pinchazo y no afectan a las estrellas. Hay 1 baldosa de ancho en los dos primeros niveles y margen de perdón en los bordes. Se prueba con un niño antes de archivar.
- **[Riesgo] Escribir 6 JSON a mano que cumplan todas las reglas es laborioso** → La batería de `validate.ts` y `catalog.test.ts` dice exactamente qué elemento falla. Se diseñan de uno en uno, del 7 al 12.
- **[Riesgo] El arrastre del mapa puede abrir niveles sin querer, o al revés** → Umbral de 12 px y cancelación del `pressed` de los botones. Se prueba en el navegador con emulación táctil, tocando y arrastrando sobre un nodo.
- **[Riesgo] El rebote calculado puede empujar a Rufo contra un escalón o fuera del mundo** → Las zonas están al menos a 2 baldosas de escalones, plataformas, salida y bandera, y el aterrizaje cae a menos de 1,5 baldosas del borde. Hay una prueba pura del cálculo del rebote para la peor zona.
- **[Compromiso] La comprobación de pinchos va en `LevelScene`, que ya es grande (773 líneas)** → La geometría (solape con margen, lado de salida, velocidad del rebote) va en un módulo puro `src/game/levels/spikes.ts` probado con Vitest. La escena solo lo llama.
- **[Riesgo] Contraste en el desierto y la nieve** → Prueba de contraste en `ambients.test.ts` y revisión visual a 844×390.

## Migration Plan

- No hay migración de datos: los perfiles guardados siguen valiendo.
- Despliegue normal con `npm run deploy`.
- Para volver atrás basta con desplegar la versión anterior: el codec ignora los niveles mayores que `LEVEL_COUNT`. Un perfil que haya llegado a un nivel del 7 al 12 conserva los niveles 1–6 y solo pierde los posteriores.
