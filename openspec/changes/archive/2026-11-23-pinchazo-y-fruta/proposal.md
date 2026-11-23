# Proposal

## Why

Ahora chocar con un erizo o una abeja no cambia nada, así que al niño le da igual esquivarlos y los
enemigos no pintan nada en el nivel. Si un pinchazo le hace perder una galleta, tiene un motivo para
saltarlos, sin llegar a perder el nivel. Una fruta escondida en un bloque que hace invencible a Rufo
unos segundos es una sorpresa divertida y premia golpear los bloques.

## What Changes

- **Pinchazo:** al chocar con un erizo o una abeja, Rufo da un **brinco hacia arriba y hacia atrás**,
  más alto que el rebote de ahora, como si se hubiera pinchado. Luego parpadea 1 s, protegido, como ahora.
- **Perder una galleta:** cada pinchazo **resta una galleta** del contador del nivel. Se ve una
  galleta que sale de Rufo y se desvanece, y el contador baja con un pequeño bote. Si el contador
  está a 0, Rufo brinca igual pero no se resta nada: el contador nunca es negativo.
  - Las galletas perdidas no se recuperan.
  - Las **estrellas no cambian**: siguen saliendo de llegar a la meta y de los bloques golpeados.
  - Al terminar se suman al total las galletas que quedan en el contador.
- **Bloque con fruta:** en cada nivel, **un** bloque «?» elegido al azar al entrar en el nivel
  esconde una **fresa**. Por fuera es igual que los demás.
  - Al golpearlo, da su galleta como siempre y además suelta la fresa. La fresa salta, cae al suelo
    junto al bloque y espera allí dando botecitos.
  - Rufo se la come al tocarla. Si no la coge, se queda en el suelo hasta el final del nivel.
- **Modo invencible:** al comer la fresa, Rufo **brilla con destellos de colores durante 8 s**.
  Durante el modo invencible:
  - Rufo atraviesa erizos y abejas sin brincar y sin perder galletas.
  - Los enemigos hacen su gesto y siguen a lo suyo.
  - En los **2 últimos segundos** el brillo parpadea más deprisa para avisar de que se acaba.
- **Sonidos nuevos:** uno de premio al aparecer la fresa y al comerla, y un tintineo suave al
  terminar el modo invencible.
- **BREAKING (regla de diseño):** chocar con un enemigo deja de no tener coste. Esto cambia el
  requisito «Chocar no penaliza» de `level-enemies` y la regla «un fallo = rebote suave + pista» de
  `docs/PROPUESTA.md`, que hay que actualizar. Sigue sin haber vidas, derrota, reinicio ni pantalla
  de fallo.

Habilidad educativa: ninguna de forma directa. Ver bajar el contador de uno en uno, y que no baja de
0, refuerza un poco la noción de **cantidad**.

**Fuera de alcance:**
- Otras frutas u otros poderes (correr más rápido, saltar más alto…).
- Más de una fruta por nivel o fruta fija en el JSON del recorrido.
- Derrotar a los enemigos o hacerlos desaparecer, también durante el modo invencible.
- Recuperar las galletas perdidas recogiéndolas del suelo.
- Música especial durante el modo invencible.
- Contar los pinchazos o la fruta en las estrellas o en la prueba de la bandera.

## Capabilities

### New Capabilities
- `power-fruit`: la fruta escondida en un bloque «?» y el modo invencible que da al comerla. Cubre
  qué bloque la lleva, cómo aparece, cómo se come, cuánto dura el modo, cómo se ve y cómo trata a los enemigos.

### Modified Capabilities
- `level-enemies`: «No se tocan» pasa a ser un pinchazo con un brinco más alto. «Chocar no penaliza»
  se sustituye por «Pinchazo resta una galleta»: resta una galleta sin bajar de 0, sin tocar las
  estrellas y sin reiniciar el nivel. Se añade que el modo invencible anula los choques.
- `platformer-level`: «Bloques «?» que dan galletas» admite que un bloque suelte además la fruta.
  En «Sin fallo que penalice», el escenario «Recorrido completo» deja de afirmar que no se resta nada.
- `game-audio`: «Efectos de las acciones del zorro» añade los sonidos de la fruta, de comerla y del
  fin del modo invencible. Al choque se le añade la pérdida de la galleta.

## Impact

- `src/game/scenes/LevelScene.ts`:
  - `onEnemyHit` cambia: brinco más alto, resta una galleta y la animación de la galleta perdida.
  - `checkEnemies` respeta el modo invencible.
  - `onBlockCollision` suelta la fruta.
  - Hay que añadir el estado y el brillo del modo invencible.
- Lógica pura nueva y probable en Vitest, por ejemplo `src/game/power/`:
  - elegir el bloque de la fruta;
  - restar una galleta sin bajar de 0;
  - temporizador del modo invencible.
- `src/game/audio/sfx.ts`: recetas nuevas, por ejemplo `fruit`, `power-on` y `power-off`.
- Gráfico propio nuevo de la fresa (`public/assets/svg/strawberry.svg`) y su línea en
  `public/assets/LICENSES.md`. Se carga en `BootScene.ts`.
- `docs/PROPUESTA.md`: actualizar la regla de los enemigos y de los fallos.
- Relación con el cambio en curso `prueba-en-la-bandera`: si su prueba «¿Te acuerdas?» pregunta por
  las galletas del nivel, debe usar el contador neto, ya con las galletas perdidas restadas.
