# Mundo 2: El río de los números

Boceto aprobado el 24 de noviembre de 2026. Versión visual, con el mapa, las escenas de las mecánicas y el plan: <https://claude.ai/artifact/FeiQRzX3W9V3tRhyDAG6qw>.

Este documento manda sobre las specs de `openspec/specs/` en lo que toca al mundo 2. Si algo discrepa, se pregunta antes de cambiarlo.

## La idea

Rufo sigue un río desde el manantial hasta el mar. En el mundo 1 el niño aprendió sobre todo a **contar** y probó un poco de todo (comparar, series, formas, memoria). Aquí descubre **cómo está hecho un número hasta el 10**: su cifra, su sitio en la recta, el anterior y el siguiente, y lo que le falta para llegar a 10. Además, ese aprendizaje sale de la bandera y entra en el recorrido: el niño acierta con un gesto que ya domina, golpear un bloque desde abajo.

- 12 niveles y un castillo, que es una parada propia del mapa después del nivel 12 (igual que en el mundo 1).
- 3 mecánicas de reto en el recorrido.
- 3 franjas de edad: 3-4, 5-6 y 7-8.

El mundo 1 acaba con la lluvia que hace nacer el manantial donde empieza este mundo (ver [MUNDO-1.md](MUNDO-1.md), «El final»).

## El mapa

Es tan ancho como el del mundo 1 y también se desplaza. El río sirve de hilo: cada nivel es un tramo y el castillo espera junto a la desembocadura, en un nodo propio después del nivel 12. Los tramos son manantial, arroyo, cascada, molino, cañaveral, lago de noche, embarcadero, puente, huertas, lluvia, puerto y desembocadura; después, el castillo. El juego no muestra esos nombres.

## Decisiones

Respuestas del usuario:

- **Retos en el recorrido**, además de la prueba de la bandera.
- **Tema del río**, del manantial al mar.
- **Estrellas** según los retos acertados a la primera.
- **12 niveles**, como el mundo 1.
- **Desbloqueo por edad**: abierto desde el principio con 6 años o más; para los menores, al acabar el mundo 1.
- **Castillo con medalla** al final, como parada propia después del nivel 12, diseñado para poder usarlo después en el mundo 1.
- **Rana y cangrejo** como enemigos nuevos.
- **Selector como la propuesta**: 123, el río, formas, Aa.

Propuestas del boceto, aceptadas al aprobarlo (se ajustan si la prueba con niños dice otra cosa):

- **Un solo gesto**: los tres retos se resuelven golpeando un bloque desde abajo, igual que en el mundo 1. Lo que cambia es el dibujo que da sentido al número.
- **Los retos cortan el paso** (compuerta, hueco en el puente, barca), pero nunca atascan: al tercer fallo, Lalo lo resuelve.
- **Fallar un reto no quita galletas.** Solo el pinchazo cuesta una, como ahora.
- **Siguen los bloques «?»** con galletas y fresa entre reto y reto.
- **Demostración de Lalo** la primera vez que aparece cada mecánica.
- **De 3 a 5 retos por nivel** y niveles de 90 a 150 s.
- **Fosos de pinchos desde el nivel 4**, con el cambio `pinchos-en-foso` ya archivado.

## Qué se aprende

Cada concepto se adapta a la edad del perfil, igual que las pruebas actuales. Los pequeños trabajan con puntos hasta el 5, los medianos con cifras hasta el 10 y los mayores llegan al 20.

| Concepto | Qué entiende el niño | 3-4 años | 5-6 años | 7-8 años |
|---|---|---|---|---|
| Cantidad y cifra | El «7» y siete cosas son lo mismo | puntos 1-5 | cifras 1-10 | cifras 1-20 |
| Ver sin contar | Reconoce 5 y 2 en el marco de diez o en los dedos | dado 1-5 | marco de diez | dos marcos (20) |
| Recta numérica | Cada número tiene su sitio, entre el anterior y el siguiente | siguiente, 1-5 | siguiente y anterior, 1-10 | cualquier hueco, de 2 en 2, 0-20 |
| Los amigos del 10 | 7 y 3 hacen 10: descomponer | completar el 5 | completar el 10 | completar el 20 |
| Orden y paridad | Primero, segundo, tercero; emparejar y ver si sobra uno | 1.º a 3.º | 1.º a 5.º, pares hasta 10 | hasta 10.º, pares hasta 20 |

## Las mecánicas: tres retos, un solo gesto

### A. Bloques que cuentan

Un cartel muestra una cantidad con puntos, dedos o un marco de diez. Encima del camino hay tres bloques con cifras, y el niño golpea el que dice cuántos hay. La compuerta del arroyo se abre y cae una lluvia de galletas. Desde el nivel 3 también va al revés: el cartel lleva la cifra y los bloques, la cantidad (con 3-4 años, siempre puntos con puntos).

- 3-4 años: puntos con puntos, 1-5. 5-6 años: de la cantidad a la cifra, 1-10. 7-8 años: dos marcos, hasta 20.

| Momento | Qué pasa |
|---|---|
| Acierta | El bloque suena, la compuerta se levanta y salen galletas. |
| 1.er fallo | El bloque se tambalea sin dar galleta y el cartel da un saltito para que lo vuelva a mirar. |
| 2.º fallo | Los puntos del cartel se iluminan uno a uno, contando. |
| 3.er fallo | Lalo vuela al bloque correcto y lo señala; la compuerta se abre igualmente. |

### B. El puente de los números

El puente es una recta numérica a la que le falta una tabla. Desde las tablas firmes, el niño golpea el bloque con el número que va en el hueco; la tabla cae en su sitio y el puente se puede cruzar. Si cae al hueco, rebota fuera como en los fosos, sin mojarse.

- 3-4 años: el siguiente, 1-5. 5-6 años: el anterior o el siguiente, 1-10. 7-8 años: cualquier hueco, de 2 en 2.

| Momento | Qué pasa |
|---|---|
| Acierta | La tabla vuela al hueco, suena una escala de notas y el puente se puede cruzar. |
| 1.er fallo | El bloque se tambalea y el hueco parpadea. |
| 2.º fallo | Las tablas se encienden de una en una desde la primera, con un saltito cada una, hasta llegar al hueco. |
| 3.er fallo | Lalo señala el bloque correcto y la tabla se coloca sola. |

### C. La barca de diez

La barca solo zarpa llena, y sus asientos forman un marco de diez. En el muelle hay bloques con puntos, y el niño golpea el que completa la barca. Los patitos suben de uno en uno contándose, y la barca cruza el lago con Rufo y lo deja en la otra orilla.

- 3-4 años: barca de 5. 5-6 años: barca de 10. 7-8 años: dos barcas (20).

| Momento | Qué pasa |
|---|---|
| Acierta | Los patitos suben de uno en uno, la barca toca la bocina y zarpa. |
| 1.er fallo | Los patitos de ese bloque suben, no caben o no bastan, y vuelven al muelle. |
| 2.º fallo | Los asientos vacíos parpadean de uno en uno. |
| 3.er fallo | Lalo señala el bloque y la barca se llena. |

## Los 12 tramos del río

Cada mecánica se presenta sola y luego se mezcla con las anteriores. Las pruebas de la bandera son nuevas en los niveles 1 a 11 y el 12 cierra con un repaso; una por nivel y siempre la misma en cada nivel, como en el mundo 1. Todas siguen la regla actual: 3 preguntas y se supera con 2. Las notas de la columna de retos describen la franja de 5-6 años; las otras franjas siguen la tabla de «Qué se aprende». El castillo no es un nivel: es la parada siguiente del mapa.

| Nivel | Ambiente | Retos del recorrido | Prueba de la bandera | Novedad |
|---|---|---|---|---|
| 1 | Manantial en la montaña | A ×3 (puntos → cifra) | ¿Cuántos dedos? Manos con dedos levantados; ver sin contar | Mecánica A con demostración de Lalo |
| 2 | Arroyo del bosque | A ×3 (marco de diez → cifra) | El marco de diez: ¿cuántos hay? (mayores: ¿cuántos faltan?) | Primeros escalones |
| 3 | Cascada | A ×3 (al revés: cifra → cantidad) | Parejas: memoria de cartas cantidad-cifra | Aparece la rana |
| 4 | Molino | A ×2, B ×2 | El vecino: el anterior y el siguiente | Mecánica B con demostración; primeros fosos |
| 5 | Cañaveral | B ×4 (siguiente y anterior) | ¿Dónde va? Colocar un número en la recta | Plataformas flotantes (nenúfares) |
| 6 | Lago de noche | A ×2, B ×2 | El número más grande: comparar cifras, sin montones | Más plataformas y escalones |
| 7 | Embarcadero | C ×2, A ×2 | Los amigos del 10: descomponer el 10 (o el 5) | Mecánica C con demostración; aparece el cangrejo |
| 8 | Puente de piedra | B ×2, C ×2 | El tren: ordinales, ¿quién va el tercero? | — |
| 9 | Huertas de la ribera | A, B ×2, C ×2 | Calcetines: emparejar, pares y nones | — |
| 10 | Lluvia | B ×3, C ×2 (mayores: de 2 en 2) | Saltos de rana: contar a saltos sobre la recta | — |
| 11 | Puerto | A, B ×2, C ×2 | Los barcos del puerto: ordenar números de menor a mayor | — |
| 12 | Desembocadura | A, B ×2, C ×2 | Repaso del río: una pregunta de tres pruebas anteriores | Último nivel: termina en la bandera, como todos |
| Castillo | Junto a la desembocadura | — | Parada propia tras el nivel 12: 5 retos y medalla | Final del mundo |

## Estrellas

Las estrellas cuentan lo aprendido. Lo que cuenta es la proporción de retos del recorrido acertados a la primera:

- **3 estrellas** con el 75 % o más.
- **2 estrellas** con el 40 % o más.
- **1 estrella** en el resto de casos. Terminar siempre da al menos una.

La prueba de la bandera no da estrellas y, en este mundo, los bloques «?» tampoco.

Ejemplos: 3 de 4 a la primera (75 %) dan 3 estrellas; 2 de 5 a la primera (40 %) dan 2; ninguno a la primera sigue dando 1.

## Castillo, enemigos y desbloqueo

### El castillo

Después del nivel 12, como parada propia del mapa junto a la desembocadura (igual que en el mundo 1), hay un castillo con 5 retos seguidos: uno de cada mecánica y dos preguntas de las pruebas de la bandera del mundo. Al terminarlo siempre se gana la **medalla del río**, nunca una nota. La medalla aparece en el botón del mundo, en el selector.

- Es una pieza aparte que recibe una lista de retos, para poder montar con ella el castillo del mundo 1.
- Se abre al terminar el nivel 12 y se puede volver a jugar desde el mapa, como cualquier nivel. No da estrellas.

### La rana y el cangrejo

Se suman al erizo y a la abeja y siguen sus reglas: tocarlos es un pinchazo que resta una galleta del nivel, nunca baja de 0 y no cambia las estrellas.

- **Rana** (desde el nivel 3): salta en el sitio con un ritmo fijo y se nota cuándo va a saltar, porque antes se agacha. Se pasa por debajo mientras está en el aire o se salta por encima mientras está quieta.
- **Cangrejo** (desde el nivel 7): camina de lado por un tramo corto de la orilla, más despacio que el erizo.
- Nunca se colocan junto a un reto, para que el niño piense con calma.

### Selector y desbloqueo

El selector queda en el orden de la propuesta: 123, el río (con un marco de diez como icono), formas y Aa. El río se abre según la edad del perfil:

- **6 años o más**: abierto desde el principio.
- **3 a 5 años**: con candado hasta completar el nivel 12 del mundo 1, aunque alguna prueba haya quedado pendiente. Al tocarlo, el botón tiembla como ahora.

Cada mundo guarda su propio progreso, y el zorro del mapa recuerda el nivel actual de cada uno.

## Fuera de este mundo

- La voz grabada: todo se explica con dibujos, animación y Lalo, como hoy.
- Llevar los retos del recorrido al mundo 1 o cambiar cómo se ganan allí las estrellas.
- La dificultad adaptativa invisible y el repaso de lo fallado. El «Repaso del río» del nivel 12 usa pruebas fijas.
- Los mundos 3 y 4, que siguen temblando en el selector.
- Sincronizar el progreso fuera del dispositivo.

## Plan con OpenSpec: de boceto a mundo jugable en once pasos

Un cambio de OpenSpec por pieza, abiertos de uno en uno cuando tocan la misma spec. El mundo 2 queda oculto tras un interruptor que solo se activa en desarrollo hasta el paso 9, así que cada pieza se prueba en el móvil con `npm run dev` sin que llegue al juego publicado.

Ciclo de cada cambio: `openspec-explore` (si hay dudas) → `openspec-propose` → `openspec-apply-change` → `npm test`, `npm run build` y móvil a 844×390 → `openspec-sync-specs` → `openspec-archive-change`.

Grupos: base (0, 1, 2) · motor de retos (3, 4, 5) · en paralelo (6, 7) · cierre (8, 9) · con niños (prueba tras el 3 y paso 10).

| Paso | Cambio | Qué hace | Specs y código | Verificación | Estado |
|---|---|---|---|---|---|
| 0 | `pinchos-en-foso` | Huecos en el suelo de los que se sale rebotando: la base del hueco del puente (mecánica B) y de los fosos desde el nivel 4. | `platformer-level`, `spike-zones` | apply → sync → archive antes del paso 3, porque los dos tocan `platformer-level`. | Hecho (archivado el 2026-11-24) |
| 1 | Documento de rumbo (no es un cambio de OpenSpec) | Este archivo, `docs/PROPUESTA.md` §1.4 y §1.5 (estrellas por retos, orden de los mundos, mundo 2 = el río) y la línea de estado en `openspec/config.yaml` y `AGENTS.md`. | — | Revisión del texto. A partir de aquí, cada `openspec-propose` enlaza a este documento. | Hecho |
| 2 | `progreso-por-mundos` | El progreso pasa de «12 niveles» a «mundo y nivel». Incluye la migración de los perfiles guardados, el selector reordenado, el desbloqueo por edad y el interruptor para que el río solo esté en desarrollo. | `world-map` (selector, mapa por mundo, el zorro recuerda el nivel de cada mundo), `child-profile` (progreso por mundo y migración). Código: `state.ts` (`LEVEL_COUNT`), `profile/progress-codec.ts`, `MapScene.buildWorldSelector`, carpeta de contenido por mundo. La base técnica ya está hecha sin cambiar el juego: niveles por mundo y número, progreso por mundo con migración, `content/levels/<mundo>/` y la definición de cada mundo en `src/game/worlds/`. Quedan el selector reordenado, el desbloqueo por edad y el interruptor de desarrollo. | Prueba de migración: un perfil antiguo conserva estrellas y galletas. Perfil de 5 años: el río tiembla con candado. Perfil de 6 años: el río entra (en desarrollo). | |
| 3 | `retos-en-el-recorrido` | El cambio de más riesgo, así que va primero. Motor común de los retos: el reto como dato en el JSON del nivel, la lógica pura en `src/learning/` con semilla y franja de edad, la escalera de fallos, la demostración de Lalo y el registro de «a la primera». Sobre ese motor, la mecánica A y las estrellas por retos. | Nueva `course-challenges`, `level-courses` (retos en los datos y su validación), `level-complete` (estrellas), `mascot-guide`, `game-audio`. | Pruebas de los generadores por edad y del cálculo de estrellas (75 % y 40 %). Nivel 1 del río jugable en borrador a 844×390. | |
| ★ | Prueba con niños de la mecánica A | Antes de construir B y C: ¿entiende un niño de 4 años el cartel sin explicárselo? ¿La escalera de fallos le ayuda o le frustra? Lo que salga se ajusta en `course-challenges` con `openspec-update-change` o con un arreglo pequeño. | — | Notas de la prueba. | |
| 4 | `reto-puente` | La mecánica B sobre el motor del paso 3: tablas numeradas, un hueco con agua que reutiliza el rebote del foso y la tabla que vuela a su sitio. | `course-challenges`, `level-courses` (puente y hueco), `platformer-level` | Generadores del siguiente, el anterior y de 2 en 2. Validación: los bloques del reto siempre encima de tablas firmes. | |
| 5 | `reto-barca` | La mecánica C. Pieza nueva del motor: una plataforma que se mueve y lleva a Rufo a la otra orilla. | `course-challenges`, `platformer-level` (plataforma móvil), `game-audio` (bocina) | Generadores de barca de 5, de 10 y doble. Rufo no puede caerse de la barca en marcha. | |
| 6 | `enemigos-del-rio` (en paralelo con 3 a 5) | La rana y el cangrejo. Solo toca `level-enemies`. | `level-enemies` (movimiento y colocación lejos de los retos); arte en `public/assets/svg` anotado en `LICENSES.md` | Pruebas de movimiento y de colocación. La rana avisa antes de saltar, comprobado a ojo en el móvil. | |
| 7 | `pruebas-bandera-rio` (en paralelo con 3 a 5) | Once tipos de prueba nuevos (niveles 1 a 11), el repaso del nivel 12 y un catálogo por mundo. TypeScript puro e independientes entre sí, con el mismo contrato (`Question`, `AgeBand`, `Rng`), así que se pueden repartir entre varios agentes. Si se alarga, se divide en dos cambios: niveles 1 a 6 y 7 a 12. | `flag-quiz` (un requisito por prueba y el catálogo por mundo) | Pruebas deterministas con semilla para cada prueba y franja. Cada prueba revisada en la pantalla de la bandera a 844×390. | |
| 8 | `castillo-y-medalla` | Una pieza que recibe una lista de retos (de las mecánicas y de la bandera) y da la medalla. Pensada para reutilizarla en el castillo del mundo 1, que es otro cambio. | Nueva `world-castle`, `world-map` (nodo del castillo tras el nivel 12 y medalla en el selector), `level-complete` | Terminar el castillo siempre da medalla, también con todo resuelto por Lalo. La medalla se ve en el selector. | |
| 9 | `mundo-2-rio` | El contenido: 12 ambientes, 12 recorridos en JSON con sus retos, el mapa del río con el nodo del castillo y la apertura del mundo (se quita el interruptor de desarrollo). Los JSON se pueden repartir entre agentes una vez fijadas las reglas de validación. | `level-courses` (ambientes, de 90 a 150 s, de 3 a 5 retos, dificultad creciente), `world-map` (mapa del río) | `validate.ts` y `duration.ts` pasan con los 12 niveles. Recorrido completo del mundo en el móvil. | |
| 10 | Prueba final con niños y ajustes | Rangos por edad, umbrales de estrellas y ritmo de la rana. Los ajustes de valores no necesitan un cambio formal. Después, actualizar el estado en README y AGENTS.md y desplegar cuando se decida. | — | Notas de la prueba. | |

Para empezar cada paso: `openspec-propose` con el nombre del cambio y una frase como «sigue docs/MUNDO-2.md, sección A. Bloques que cuentan», para que la propuesta parta de lo aprobado y no lo vuelva a inventar.
