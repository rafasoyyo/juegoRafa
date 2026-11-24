# Tasks

## 1. Geometría del foso (puro, sin Phaser)

- [x] 1.1 En `src/game/levels/spikes.ts`:
  - Añadir las constantes del foso (`PIT_DEPTH`, `PIT_TIP`, `PIT_LIP_RADIUS`, `SPIKE_CONE_H`, `SPIKE_PLATE_H`, `CONES_PER_TILE`, `LIP_MIN_FOOT`).
  - Añadir `groundSpans(worldW, spikes)`.
  - Sustituir `onSpikes` y `SPIKE_FORGIVE` por `pitUnder(bodyBottom, foxX, spikes)`.

  Probar en `spikes.test.ts`:
  - Los tramos cubren todo el mundo salvo las zonas, sin solaparse.
  - Un nivel sin zonas da un solo tramo.
  - `pitUnder` solo devuelve zona con los pies por debajo de `GROUND_TOP`, y nunca a la altura del suelo ni en el aire («Saltar rozando»).

  Verificar con `npx vitest run src/game/levels/spikes.test.ts`.
- [x] 1.2 En `spikes.ts`, añadir `lipNudge(bodyX, bodyW, spikes)`. Probar «Pararse en el borde» (con menos de 12 px de pie sobre el borde, devuelve la dirección hacia el suelo firme), «Margen de perdón» (con la punta del pie en el borde, empuja hacia el suelo firme y nunca hacia el foso) y que lejos de un foso devuelve 0. Verificar con `npx vitest run src/game/levels/spikes.test.ts`.
- [x] 1.3 Ajustar `reboundVelocity` al despegue desde `PIT_TIP` bajo el suelo. Probar:
  - «Entrar andando» y «Caer en medio» desde el fondo.
  - «Salir del foso»: simulando el arco con la gravedad, Rufo está por encima de `GROUND_TOP` antes de alcanzar la pared y aterriza fuera, a ≥ 0,75 baldosas del borde.
  - En el peor caso (2 baldosas, pegado a la pared contraria) no pasa de `MAX_VELOCITY.x`.

  Verificar con `npx vitest run src/game/levels`.
- [x] 1.4 Añadir a `spikes.test.ts` la prueba de que, con las medidas reales de los niveles 7 a 12, la fresa de cualquier bloque nunca se posa sobre un foso. Verificar con `npx vitest run src/game/levels`.

## 2. Aspecto: pinchos de acero y foso

- [x] 2.1 En `ambients.ts`, añadir `pitWall(ambient)`: la tierra mezclada al 42 % con la tinta. En `ambients.test.ts`, sustituir la prueba del morado por el contraste ΔE ≥ 30 del acero claro y del medio contra `pitWall` en los 12 ambientes. Si algún ambiente no pasa, darle su propia mezcla. Verificar con `npx vitest run src/game/levels/ambients.test.ts`.
- [x] 2.2 En `BootScene`:
  - Rehacer `makeSpikes`: textura `spikes` de 84 × 33 con 3 conos de acero de tres caras y punta afilada, con reflejo y sin contorno.
  - Añadir la textura `spike-glint`.

  Actualizar la fila de `spikes` (y añadir `spike-glint`) en `public/assets/LICENSES.md` como arte propio. Verificar con `npm run build` y abriendo el nivel 7 con `npm run dev`.
- [x] 2.3 En `widgets.ts`:
  - `drawGround` gana el redondeo opcional por lado y recorta al tramo los bultos de nieve y nube.
  - Añadir `drawPit`: pared, sombra bajo el borde, tierra bajo el fondo y su línea.
  - `addScenery` dibuja los fosos y luego los tramos.

  Verificar con `npm run build` y comprobando en el navegador que la portada y la pantalla de nivel completado se ven igual que antes (captura antes y después).
- [x] 2.4 En `LevelScene.buildSpikes`, dibujar en cada zona la placa redondeada con remaches, el `tileSprite` de conos con la base en el fondo del foso y el destello en la primera punta. Quitar `SPIKES_SINK`. Verificar en el navegador a 844×390 en los niveles 7 a 12 (playa, selva, montaña, nieve, desierto y nubes) los escenarios «Ver el foso», «Ver los pinchos», «Se leen como metal» y «Borde redondeado», y que nada se confunde con un erizo.

## 3. Física y pinchazo en el foso

- [x] 3.1 En `LevelScene.create`:
  - Sustituir la zona de suelo única por una zona estática por tramo (`groundSpans`) y un fondo por foso en `GROUND_TOP + PIT_TIP`.
  - Meter en `surfaces` solo los tramos.
  - Poner en el collider de los tramos el `processCallback` que ignora la pared durante `spikeRebound`.

  Verificar en el navegador, en el nivel 7:
  - Andando hacia un foso sin saltar, Rufo cae dentro y queda de pie sobre las puntas con la cabeza por encima del suelo («Rufo dentro del foso»).
  - En los niveles 1 a 6 el suelo no tiene huecos («Sin otros huecos»).
- [x] 3.2 En `checkSpikes`, usar `pitUnder`. En `knock`, añadir el parámetro `costsCookie`: sin galleta, ni `loseCookie` ni `dropCookie`, y sin tocar `protectedUntil` ni `hitAt`. Quitar de `tickPower` la protección por acabar sobre los pinchos. Verificar en el navegador:
  - «Caer en los pinchos» (el contador baja 1).
  - «Sin galletas».
  - «Entrar andando» y «Caer en medio».
  - «Salir del foso»: no se queda enganchado en la pared.
  - «Niño que no se mueve».
  - «Caer parpadeando» (choque con un erizo y, en menos de 1 s, al foso: el contador no baja).
  - «Caer con la fresa» y «Saltar el foso con la fresa».
  - Suena el «¡uy!» en todos los rebotes, también con la fresa.
- [x] 3.3 En `update`, aplicar `lipNudge` con 0,3·`RUN_SPEED` cuando no se pulsa ninguna flecha y no hay rebote. Verificar en el navegador con controles táctiles a 844×390:
  - «Pararse en el borde»: suelta la flecha con Rufo sobresaliendo y se recoloca hacia atrás.
  - «Margen de perdón»: aterrizando con la punta del pie en el borde, no cae.
  - «Seguir andando»: cae.
  - Saltar desde el borde sigue funcionando con el coyote.

## 4. Integración

- [x] 4.1 Ejecutar `npm test` y `npm run build`, y comprobar que pasan.
- [x] 4.2 Recorrer los niveles 7 y 12 completos en el navegador a 844×390 con controles táctiles. Comprobar que:
  - Todos los fosos se saltan con un salto normal.
  - Caer diez veces no cambia las estrellas y la prueba de la bandera aparece («Muchos pinchazos»).
  - La fresa nunca acaba en un foso.
  - Los erizos no cruzan ningún foso.

## Workflow follow-up

- Sincronizar los deltas con `openspec/specs/` (`openspec-sync-specs`) y archivar el cambio (`openspec-archive-change`) cuando esté validado en el móvil.
