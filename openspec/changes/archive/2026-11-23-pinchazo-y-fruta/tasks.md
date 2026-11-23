# Tasks

## 1. Reglas puras

- [x] 1.1 Crear `src/game/power/power.ts`, sin importar Phaser, con:
  - `POWER_MS = 8000` y `POWER_WARN_MS = 2000`;
  - `pickFruitBlock(blockCount, rng = Math.random)`, que devuelve un índice válido, o `-1` si no hay bloques;
  - `loseCookie(cookies)`, que devuelve `{ cookies, lost }` y nunca baja de 0;
  - `powerPhase(now, startedAt)`, que devuelve `'off' | 'on' | 'ending'`.

  Verificar con `npm run build`, sin errores de tipos.
- [x] 1.2 Añadir `src/game/power/power.test.ts`. Debe cubrir:
  - `pickFruitBlock`: con un rng con semilla, siempre devuelve un índice entre 0 y n−1; salen índices
    distintos con semillas distintas; devuelve −1 con 0 bloques;
  - `loseCookie`: 3 pasa a 2 con `lost: true`, y 0 se queda en 0 con `lost: false`;
  - `powerPhase`: `on` a los 0 ms y a los 5 999 ms, `ending` a los 6 000 ms y a los 7 999 ms, `off`
    a los 8 000 ms y con `startedAt = -Infinity`.

  Verificar con `npm test`, en verde.

## 2. Sonidos y gráficos

- [x] 2.1 En `src/game/audio/sfx.ts`, añadir `fruit`, `power` y `power-off` a `SfxName`, `SFX_NAMES`
  y `recipe()`, como dice design.md §7. `power-off` va descendente y en seno. Verificar con
  `npm test`: `sfx.test.ts` cubre las recetas nuevas, incluido que `power` sube y `power-off` baja.
- [x] 2.2 Dibujar `public/assets/svg/strawberry.svg`:
  - fresa roja con semillas claras y hojas verdes;
  - sin contornos negros y con sombra inferior sólida.

  Cargarla en `BootScene.ts` como `strawberry` y añadir su línea como propia en
  `public/assets/LICENSES.md`. Generar por código la textura `sparkle`, como `dust`. Verificar en el
  navegador con el móvil emulado a 844×390: la fresa se reconoce y no se confunde con la galleta.

## 3. Pinchazo

- [x] 3.1 En `LevelScene.ts`:
  - subir `KNOCK_VY` a `0.8·JUMP_SPEED` y bajar `KNOCK_VX` a `0.6·RUN_SPEED`;
  - en `onEnemyHit`, llamar a `loseCookie`. Si se pierde una galleta, animar la galleta que sale de
    Rufo y se desvanece, actualizar el contador y hacer `bump` del contador;
  - `blocksHit` no cambia.

  Verificar en el navegador emulado 844×390, nivel 1:
  - con 2 galletas, chocar con un erizo deja el contador en 1 y Rufo brinca más alto que antes;
  - chocar con 0 galletas lo deja en 0;
  - antes de medio segundo se puede mover otra vez.
- [x] 3.2 Comprobar el brinco junto a escalones y plataformas. Verificar en el navegador emulado,
  niveles 3 y 6: pincharse junto a un escalón y cerca de una plataforma nunca deja a Rufo atascado
  ni fuera del recorrido.

## 4. Fruta y modo invencible

- [x] 4.1 En `create()`, marcar con `setData('fruit', true)` el bloque elegido por `pickFruitBlock`.
  En `onBlockCollision`, si el bloque tiene fruta:
  - crear la fresa con física;
  - lanzarla hacia arriba y hacia delante;
  - hacer que choque con el suelo, los escalones y las plataformas;
  - al posarse, quitarle la velocidad horizontal y animar los botecitos;
  - hacer sonar `fruit`.

  Verificar en el navegador emulado:
  - en un nivel con todos los bloques golpeados sale exactamente una fresa;
  - la fresa se posa en una superficie a la que se llega con un salto normal;
  - al repetir el nivel, sale de otro bloque en alguna de varias partidas.
- [x] 4.2 Comer la fresa:
  - un overlap con Rufo la destruye con un destello, guarda `powerStartedAt` y hace sonar `power`;
  - no toca el contador.

  Verificar en el navegador: al tocarla desaparece, Rufo empieza a brillar y el contador no cambia.
- [x] 4.3 Brillo del modo invencible:
  - tint cíclico en el zorro y el gorro;
  - piernas con un color más claro;
  - pool de destellos `sparkle`;
  - ritmo doble en la fase `ending`;
  - limpiarlo todo al pasar a `off` y en `onGoal`.

  Verificar en el navegador emulado 844×390:
  - el brillo dura unos 8 s y acelera en los 2 últimos;
  - se distingue del parpadeo protector;
  - suena `power-off` al terminar.
- [x] 4.4 En `checkEnemies`, cuando `powerPhase !== 'off'`:
  - no hay rebote, ni pérdida, ni `bump`;
  - `gesture()` solo al entrar en contacto, con un `Set` de contactos activos.

  Al pasar a `off` tocando un enemigo, dar `PROTECT_MS` de protección con parpadeo. Verificar en el
  navegador:
  - invencible, Rufo atraviesa erizos y abejas, también cayendo encima, sin frenar y sin bajar el
    contador, y los enemigos hacen su gesto;
  - al acabar encima de un erizo, parpadea 1 s sin pincharse.

## 5. Cierre

- [x] 5.1 Actualizar `docs/PROPUESTA.md`, líneas de «Enemigo» y «Sin vidas ni game over»: tocar un
  enemigo es un pinchazo que resta una galleta del nivel, sin vidas, derrota ni pérdida del total.
  Añadir la fresa y el modo invencible. Verificar con
  `grep -n "pinchazo\|fresa" docs/PROPUESTA.md`, que muestra las líneas nuevas.
- [x] 5.2 Pasada final. Verificar con `npm test` y `npm run build`, en verde. Después, en el
  navegador emulado 844×390, jugar el nivel 2 completo:
  - golpear 4 bloques y pincharse 2 veces;
  - la tarjeta muestra 2 galletas y las mismas estrellas que sin pincharse;
  - el total del mapa sube en 2.

## Workflow follow-up

- Archivar el cambio con `openspec-archive-change` cuando esté probado en el móvil.
