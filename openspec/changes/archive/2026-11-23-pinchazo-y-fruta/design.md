# Design

## Context

Todo el nivel vive en `src/game/scenes/LevelScene.ts`:

- `checkEnemies(time)` compara la caja del zorro con la de cada enemigo (`overlaps`, en
  `enemy-motion.ts`). Mientras `time < protectedUntil` no lo hace.
- `onEnemyHit` aplica el rebote (`KNOCK_VX = 0.9·RUN_SPEED`, `KNOCK_VY = 0.55·JUMP_SPEED`), quita el
  control `KNOCK_MS = 300` ms, protege `PROTECT_MS = 1000` ms y llama a `enemy.gesture()` y a
  `audio.sfx('bump')`.
- `blinkFox(time)` baja el alpha del zorro, el gorro y las piernas mientras está protegido.
- `onBlockCollision` marca el bloque como usado, anima la galleta y suma a `this.cookies` y a
  `this.blocksHit`. `onGoal` pasa a `LevelComplete` `{ blocksHit, blocksTotal, cookies }`. Las
  estrellas salen de `blocksHit/blocksTotal`, así que restar galletas no las toca.
- Los efectos son recetas sintetizadas en `src/game/audio/sfx.ts` (`SfxName`, `SFX_NAMES`) y se prueban
  en `sfx.test.ts`.
- Los gráficos son SVG propios cargados en `BootScene.ts` (por ejemplo `svg('cookie', 'cookie', 56)`)
  o texturas generadas por código (por ejemplo `dust`).
- La lógica que se puede probar sin Phaser vive en módulos puros con su `*.test.ts`. Así están
  `enemy-layout.ts` y `enemy-motion.ts`.

## Goals / Non-Goals

**Goals:**
- Poner las reglas nuevas (galleta perdida, elegir el bloque de la fruta, fases del modo invencible)
  en un módulo puro, probado con Vitest.
- Cambiar lo mínimo `LevelScene`: el mismo `checkEnemies` y el mismo `onEnemyHit` con parámetros
  nuevos, más un punto de entrada para la fruta.

**Non-Goals:**
- Un sistema genérico de poderes o de objetos recogibles. Solo hay una fruta y un poder.
- Cambiar `LevelCompleteScene` o el cálculo de estrellas. Ya reciben el contador neto.

## Decisions

### 1. Módulo puro `src/game/power/power.ts`
Funciones sin estado:
- `pickFruitBlock(blockCount, rng = Math.random): number`: índice del bloque con fruta, o `-1` si no
  hay bloques.
- `loseCookie(cookies): { cookies, lost: boolean }`: resta 1 sin bajar de 0.
- `powerPhase(now, startedAt): 'off' | 'on' | 'ending'`, con `POWER_MS = 8000` y `POWER_WARN_MS = 2000`.

**Alternativa descartada:** meter todo en `LevelScene`. No se podría probar el borde de 0 galletas
ni los tiempos sin arrancar Phaser.

### 2. La fruta se elige al entrar, no en el JSON
Se elige al azar en `create()` con `pickFruitBlock(this.world.blocks.length)` y se guarda como
`setData('fruit', true)` en el bloque. Así se mantiene la misma filosofía que la colocación de
enemigos: cambia en cada partida y no obliga a tocar los 6 JSON ni su validación.

**Alternativa descartada:** un campo `fruit: true` en `BlockData`. Es más predecible, pero el niño
aprendería dónde está.

### 3. La fruta es un cuerpo Arcade con gravedad
Al golpear el bloque, se crea un `physics.add.image` con la textura `strawberry` encima del bloque.
- Sale con un impulso hacia arriba y un poco hacia delante, en el sentido en que mira Rufo, para no
  caer sobre su cabeza.
- Choca con el suelo, los escalones y las plataformas reutilizando los grupos de colisión que ya
  existen.
- Al posarse se quita la velocidad horizontal y un tween suave hace los botecitos.
- Un `physics.add.overlap(fox, fruit)` la come.

Con esto la fruta siempre queda sobre una superficie del recorrido, y por la regla «Todo alcanzable
con un salto normal» queda al alcance.

**Alternativa descartada:** dejarla flotando sobre el bloque. Los bloques de la fila alta no dejan
llegar encima con un salto normal.

### 4. Modo invencible
- `powerStartedAt` en la escena. `checkEnemies` comprueba antes `powerPhase(time, powerStartedAt) !== 'off'`.
- En modo invencible, los enemigos que se tocan solo hacen `gesture()` al **entrar** en contacto.
  Un `Set<EnemyView>` de contactos activos evita repetir el gesto en cada fotograma.
- No hay `bump` ni rebote.
- Al pasar de `on`/`ending` a `off`:
  - suena `power-off`;
  - si Rufo toca un enemigo en ese momento, se pone `protectedUntil = time + PROTECT_MS` y
    `hitAt = time` para usar el mismo parpadeo protector. Así no hay un pinchazo injusto en el
    fotograma siguiente.
- `onGoal` pone `powerStartedAt = -Infinity` y limpia el brillo.

### 5. Brillo del modo invencible
- `setTint` cíclico, con 4 o 5 colores cálidos de la paleta, sobre el zorro y el gorro.
- Un pool de destellos (textura `sparkle` generada por código, como `dust`) que salen alrededor de
  Rufo y se desvanecen.
- En la fase `ending`, el ciclo de colores y los destellos van al doble de ritmo.
- `blinkFox` no se toca. El parpadeo es transparencia y el brillo es color, así que se distinguen.
- Las piernas, que son `Graphics`, no admiten tint. Se dibujan con un color más claro mientras dura
  el brillo, pasando un color a `drawLegs`.

### 6. Pinchazo y galleta perdida
- Constantes nuevas: `KNOCK_VY = 0.8·JUMP_SPEED` y `KNOCK_VX = 0.6·RUN_SPEED`. El brinco es más alto y
  más corto hacia atrás. Se mantiene `KNOCK_MS = 300`, por debajo del medio segundo que pide el spec.
- `onEnemyHit` llama a `loseCookie`. Si `lost`:
  - una imagen `cookie` sale de Rufo con un arco hacia atrás y se desvanece en unos 600 ms;
  - `counter.setValue(cookies)`;
  - `bump(this, counter.container)`.
- `blocksHit` no cambia.

### 7. Sonidos
Se añaden tres recetas a `SfxName` y `SFX_NAMES`:
- `fruit`: arpegio corto ascendente de triángulo.
- `power`: barrido ascendente más largo y brillante que `prize`.
- `power-off`: tres notas suaves descendentes, en seno.

## Risks / Trade-offs

- [El brinco más alto mete a Rufo bajo una plataforma o lo empuja contra un escalón] → Las
  plataformas son de un solo sentido y los enemigos ya están fuera de escalones y del espacio bajo
  plataformas, por las zonas seguras. Comprobarlo en el navegador en los niveles 3 a 6.
- [La fruta cae justo sobre un enemigo o en su camino] → Al tocarla se come antes de comprobar
  enemigos en ese mismo fotograma, así que comerla protege a Rufo.
- [Perder galletas frustra a un niño de 4 años] → Se resta de una en una, nunca baja de 0, nunca se
  pierde el total guardado y el sonido es gracioso. Si en las pruebas con niños resulta duro, se
  puede subir `PROTECT_MS`.
- [Choca con la regla de `docs/PROPUESTA.md`] → Hay una tarea para actualizar el documento en el
  mismo cambio.
- [`prueba-en-la-bandera` usa las galletas en «¿Te acuerdas?»] → Recibe `cookies` neto desde
  `onGoal`, igual que `LevelComplete`.
