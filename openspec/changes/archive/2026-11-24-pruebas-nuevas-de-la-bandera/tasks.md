# Tasks

## 1. Base de la lógica (`src/learning/quiz/`, TypeScript puro)

- [x] 1.1 Comprobar que `niveles-7-a-12-con-pinchos` está implementado: `LEVEL_COUNT = 12` y `QUIZ_BY_LEVEL` tiene entradas 7–12. Verificar con `npx vitest run src/learning/quiz src/game/state.test.ts`
- [x] 1.2 En `types.ts`:
  - Los 6 `QuizKind` nuevos y los `Visual` nuevos con su `visualKey`.
  - El campo `Prompt.scene` (unión discriminada), `Option.place`, los `HintKind` nuevos y la forma `fill`.

  Verificar que `npx tsc --noEmit` pasa y que las pruebas existentes siguen en verde (`npx vitest run src/learning/quiz`)
- [x] 1.3 En `run.ts`:
  - Soporte de `fill` (capacidad, `after`, progreso, fallo al llenar de más o antes de tiempo), `fillLevels(run)` y `remainingAnswer` para `fill`.

  Probar en `quiz.test.ts` con preguntas hechas a mano:
  - «Plato lleno» y «Tarro antes de tiempo».
  - Un tarro de capacidad 0.
  - 3.er fallo con los toques que faltan.
  - Que `choice` y `multi` se comportan igual que antes.

  (`npx vitest run src/learning/quiz`)
- [x] 1.4 En `catalog.ts`: 7 → `share`, 8 → `order`, 9 → `cable-car`, 10 → `tracks`, 11 → `balance`, 12 → `mirror`. Probar el escenario «Niveles nuevos» y que los niveles 1–6 no cambian (`npx vitest run src/learning/quiz`)
- [x] 1.5 Texto del bocadillo de Lalo (`bocadillo-de-lalo`): añadir a `GUIDE_TEXT` en `src/learning/quiz/guide-text.ts` una entrada por cada `QuizKind` nuevo (`share`, `order`, `cable-car`, `tracks`, `balance`, `mirror`), con los textos de `design.md` de ese cambio. Verificar con `npx tsc --noEmit` y `npx vitest run src/learning/quiz` (el `Record` no compila sin ellos)

## 2. Generadores de las seis pruebas

Cada generador se prueba con 200 semillas por franja. Además, en todos se comprueba que las 3 preguntas no son idénticas y que la respuesta correcta está entre las opciones (`npx vitest run src/learning/quiz`).

- [x] 2.1 `share.ts`. Comprobar:
  - Platos y totales de cada franja.
  - Reparto exacto en pequeños y medianos.
  - Resto de 1 a platos − 1 en al menos 2 preguntas de mayores.
  - Capacidades y `after` del tarro.
  - Pista `deal`.
- [x] 2.2 `order.ts`. Comprobar:
  - 3, 4 o 5 elementos según la franja.
  - Razones de escala mínimas.
  - Solo hacia arriba en pequeños.
  - Cifras distintas del 1 al 20 en mayores.
  - `targets` en el orden que marca la escalera, y claves únicas.
  - Pista `compare-two`.
- [x] 2.3 `cable-car.ts`. Comprobar:
  - Rangos de cada franja.
  - Solo suben en pequeños y medianos.
  - Ningún valor intermedio menor que 0 ni mayor que 20.
  - Respuestas en puntos de dado (3) en pequeños, cifras (3) en medianos y cifras (4) en mayores.
  - Pista `count-on`.
- [x] 2.4 `tracks.ts`. Comprobar:
  - Ningún paso sale de la cuadrícula y el destino no es la salida.
  - 3 destinos con dibujo distintos en pequeños.
  - Opciones de casilla en medianos.
  - En mayores, exactamente una tira llega a la fresa y las otras dos acaban en otra casilla.
  - Pistas `ghost-walk` y `dim-wrong` según la franja.
- [x] 2.5 `balance.ts`. Comprobar:
  - En pequeños, un pesado contra un ligero, con el platillo correcto el del pesado.
  - En medianos, a ≠ b en 1–9 y la respuesta |a − b|.
  - En mayores, k en 2–4, n en 2–3, n·k ≤ 12 y 4 opciones.
  - Pistas `heft`, `pair-up` y `swap-fruit` según la franja.
- [x] 2.6 `pictures.ts` y `mirror.ts`. Comprobar:
  - Ninguna mitad es simétrica respecto a su eje vertical.
  - En pequeños, distractores de otros dibujos.
  - En medianos, que estén la reflejada, la sin reflejar y la del detalle cambiado.
  - En mayores, cuadrícula de 4×6 con 3–6 casillas pintadas y objetivos reflejados `col → 5 − col`.
  - Pista `fold`.

## 3. Infraestructura de la escena

- [x] 3.1 Crear `src/game/ui/quiz/view.ts` con la interfaz `QuizView`, y hacer que `QuizScene` delegue en ella para los tipos nuevos: rectángulos de las opciones `scene`, `intro`, `onProgress`, `onCorrect`, `hint` y `showAnswer`. Verificar en el navegador que las pruebas de los niveles 1–6 se ven y funcionan igual que antes, abriendo `Quiz` con `level` 1 a 6
- [x] 3.2 Crear `src/game/ui/quiz/art.ts` con los 6 pictogramas nuevos, la flecha de dirección y la escalera que sube o baja. Verificar en el navegador, en escala de grises a 844×390, que los 12 pictogramas se distinguen entre sí

## 4. Vistas de cada prueba

En cada tarea se verifica en el navegador a 844×390 y a 1280×720, abriendo `Quiz` con su nivel y perfiles de 4, 6 y 8 años.

- [x] 4.1 `share-view.ts`: cesta, platos con amigos, tarro y galleta que vuela al plato; rebote y vuelta a la cesta al fallar; pista `deal` con galletas transparentes. Verificar los escenarios de «Reparte las galletas»
- [x] 4.2 `order-view.ts`: elementos sueltos, fila de destino, escalera de consigna y salto a la fila; pista `compare-two`. Verificar los escenarios de «De pequeño a grande»
- [x] 4.3 `cable-car-view.ts`: cabina con cable, `intro` con subidas y bajadas de una en una, puerta que se cierra y cabina opaca; pista `count-on` y `showAnswer` con la cabina abierta. Verificar los escenarios de «El teleférico», que la escena dura como mucho 6 s y que tocar a Lalo la repite
- [x] 4.4 `tracks-view.ts`: cuadrícula nevada, Rufo, destinos con dibujo, fresa, tira o tiras de flechas, casillas como opciones `scene` y recorrido con huellas al acertar; pistas `ghost-walk` y `dim-wrong`. Verificar los escenarios de «Huellas en la nieve», también que las casillas miden al menos 44 px en pantalla
- [x] 4.5 `balance-view.ts`: balanza sujeta, platillos como opciones `scene`, objetos de peso, hueco, balanza modelo y balanza que se suelta al acertar; pistas `heft`, `pair-up` y `swap-fruit`. Verificar los escenarios de «La balanza»
- [x] 4.6 `mirror-view.ts`: dibujo a partir de `pictures.ts`, línea de espejo, mitades como opciones, cuadrícula de 4×6 con casillas pintadas (relleno y dibujo); pista `fold`. Verificar los escenarios de «La otra mitad», también «Pintado sin color» en escala de grises

## 5. Comprobación final

- [x] 5.1 Ejecutar `npm test` y `npm run build` sin errores
- [ ] 5.2 Jugar en el navegador, emulando un móvil de 844×390, los niveles 7 a 12 hasta la bandera con un perfil de 5 años. Comprobar en cada uno que sale su prueba, que superarla completa el nivel y que fallarla lo deja pendiente, sin errores en la consola
- [ ] 5.3 Repetir las 6 pruebas abriendo `Quiz` directamente con perfiles de 3 y 8 años, fallando a propósito cada pregunta para ver la demostración, la pista y la respuesta de Lalo
- [x] 5.4 Actualizar `docs/PROPUESTA.md` (tabla de pruebas por nivel y habilidades) y comprobar que no contradice las specs del cambio

## Workflow follow-up

- Probar al menos «Reparte las galletas», «El teleférico» y «Huellas en la nieve» con un niño de cada franja antes de archivar.
- Archivar después de `niveles-7-a-12-con-pinchos`, con `openspec-archive-change`.
