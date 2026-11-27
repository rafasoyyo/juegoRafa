# Mundo 3: La isla de los dinosaurios

Boceto aprobado el 26 de noviembre de 2026. Versión visual, con el mapa, las escenas de los retos y el plan: <https://claude.ai/artifact/5NyRuVYUF47ZGpRyAPtxGL>. Hoja de diseño de los dinosaurios (estilo A elegido): <https://claude.ai/artifact/6YvKsCLBKBPTz4ZunxJmvb>.

Este documento manda sobre las specs de `openspec/specs/` en lo que toca al mundo 3. Si algo discrepa, se pregunta antes de cambiarlo.

## La idea

La barca del río deja a Rufo en una isla con un volcán. En la playa encuentra un **huevo de dinosaurio perdido** y decide devolvérselo a su mamá, que vive arriba, en el cráter. En el mundo 1 el niño aprendió a contar y en el 2 descubrió cómo está hecho un número. Aquí aprende a mirar **formas y patrones**: reconocerlas aunque giren, ver qué viene después en una serie, encajar piezas y construir figuras. En una isla de dinosaurios esas formas salen solas: las placas del estegosaurio son triángulos, los huevos son óvalos, la piel tiene manchas en serie y la roca del volcán forma columnas de hexágonos.

- 12 niveles y un castillo, que es una parada propia del mapa después del nivel 12 (igual que en los mundos 1 y 2).
- 4 retos en el recorrido: tres con el gesto del río (golpear un bloque desde abajo) y uno de saltar.
- 3 franjas de edad: 3-4, 5-6 y 7-8.

El mundo 2 acaba en la desembocadura, y la barca lleva a Rufo a la playa donde empieza este mundo (ver [MUNDO-2.md](MUNDO-2.md)).

## El hilo de los cuatro mundos

Cada mundo termina abriendo el siguiente con algo que el niño ve, sin leer nada.

| Mundo | Meta que se ve | Cómo empieza | Cómo acaba |
|---|---|---|---|
| 1. El camino del arcoíris | El arcoíris crece al fondo | Rufo sale de la madriguera | La nube llueve sobre la montaña y nace el manantial |
| 2. El río de los números | El río baja hacia el mar | El manantial | La desembocadura y la barca |
| 3. La isla de los dinosaurios | El huevo se pinta mancha a mancha | La barca llega a la playa negra y aparece el huevo | El huevo se abre en el nido y el bebé lleva a Rufo a una cueva con dibujos que se vuelven letras |
| 4. Letras | Por decidir | La cueva de los dibujos | — |

## El mapa

Es tan ancho como los de los mundos 1 y 2 y también se desplaza. El camino sube desde la playa, donde llega la barca, hasta el cráter del volcán. El nido del cráter es el castillo, en un nodo propio después del nivel 12. Los tramos son playa de arena negra, bosque de helechos, charcas y géiseres, huellas gigantes, cascada templada, pantano de noche, valle de los cuellos largos, columnas de roca, yacimiento de fósiles, cueva de cristales, ríos de lava y borde del cráter; después, el nido. El juego no muestra esos nombres.

Arriba hay un **huevo** con 12 manchas, que hace el papel de los gajos del arcoíris: cada nivel terminado le pinta una mancha siguiendo un patrón.

## Decisiones

Respuestas del usuario:

- **Nombre**: «La isla de los dinosaurios».
- **Dinosaurios y volcanes** como ambientación; **patrones y formas** como tema, según la propuesta.
- **El huevo perdido** como meta, y el bebé dinosaurio como final.
- **12 niveles** con su bandera y el castillo como parada propia después del nivel 12.
- **Las piedras del géiser** entran como reto D.
- **Enemigos**: tiranosaurio, pterosaurios y volcancitos que lanzan una piedra grande que sube y baja en vertical.
- **Desbloqueo**: abierto desde el principio con 7 años o más; para los menores, al acabar el río.
- **Aspecto menos infantil**, pensado para que no se vea de pequeños a ojos de un niño de 7 u 8 años: isla de expedición y dinosaurios en el **estilo A, documental** (ver «Dirección de arte»).

Propuestas del boceto, aceptadas al aprobarlo (se ajustan si la prueba con niños dice otra cosa):

- **Mismo motor que el río**: los retos cortan el paso, nunca atascan (al tercer fallo, Lalo lo resuelve) y fallar no quita galletas. Solo el pinchazo cuesta una.
- **Estrellas como en todos los mundos**: por las galletas de la fase y los aciertos de la prueba de la bandera (`estrellas-por-objetivos`, ver `docs/PROPUESTA.md`).
- **Siguen los bloques «?»** con galletas y fresa entre reto y reto.
- **Demostración de Lalo** la primera vez que aparece cada reto.
- **De 3 a 5 retos por nivel** y niveles de 90 a 150 s.
- **Los herbívoros son amigos** y ayudan a pasar: el braquiosaurio lleva a Rufo, el triceratops aparta la roca de la cueva y el estegosaurio se agacha para que sus placas hagan de escalera.
- **El gran volcán no hace daño**: humea, retumba y brilla al fondo. Solo los volcancitos del camino lanzan piedras.
- **La lava es otro dibujo de los fosos de pinchos**: charcos naranjas redondeados, con el mismo «¡uy!», rebote y una galleta menos.
- **Aventura sin sustos**: dinosaurios con proporciones reales, pero sin sangre, sin bocas abiertas hacia el jugador y siempre con aviso antes de moverse, para los de 3 y 4 años.
- **Dibujos propios**, planos y sin contornos negros como el resto del juego, sin parecerse a los de ninguna película ni serie, anotados en `public/assets/LICENSES.md`.

## Dirección de arte

El mundo 3 sigue siendo plano y sin contornos negros, como todo el juego, pero cambia de registro para no verse infantil: es una isla de expedición, no de cuento. Rufo y Lalo no cambian; el contraste entre ellos y una isla más seria da la sensación de aventura. La paleta oscura entra en `visual-style` como ambiente propio del mundo 3, sin cambiar la de los mundos 1 y 2.

- **Paleta y luz**: cielo de atardecer volcánico (azul pizarra a rosa óxido), selva verde profundo con franjas de niebla, basalto oscuro y piedra gris de ruinas. La luz sale de la lava y del cráter, con un resplandor naranja que tiñe lo que tiene cerca.
- **Formas como grabados de una civilización perdida**: las formas de los retos son grabados en piedra que se iluminan (turquesa, ámbar y óxido), no pegatinas de colores. Hay ruinas por toda la isla: columnas, arcos, tótems y templos excavados en la roca.
- **Bloques de piedra con borde dorado**: son los que se golpean en este mundo. Siguen leyéndose como «golpéame», pero encajan en la isla.
- **Dinosaurios, estilo A (documental)**: anatomía de libro de ciencia y sombreado plano en tres tonos (luz en el lomo, color base, sombra en el vientre y en las patas del fondo). Ojos de reptil, ámbar con pupila vertical, sin mofletes ni sonrisas. Pieles en verdes, pardos y ocres con rayas, manchas y placas en óxido. El tiranosaurio va en postura horizontal, con los dientes solo asomando con la boca cerrada; los pterosaurios llevan alas de membrana con el dedo largo marcado.
- **Sonido y efectos**: golpes de piedra, siseo de lava, retumbos lejanos y vapor, en lugar de «plop», «boing» o burbujas de colores. El suelo tiembla un poco antes de que el volcancito lance la piedra y cuando ruge el tiranosaurio.

## Qué se aprende

Cada concepto se adapta a la edad del perfil, igual que en el río. Ya existen pruebas de la bandera de formas, series y simetría en el mundo 1 (Caza de formas, Sigue la serie, La otra mitad): sus generadores (`shapes.ts`, `series.ts`, `mirror.ts`) sirven de base y aquí se llevan más lejos.

| Concepto | Qué entiende el niño | 3-4 años | 5-6 años | 7-8 años |
|---|---|---|---|---|
| Series | Lo que se repite deja adivinar lo que viene | AB con colores | AB, ABB y AAB con formas | ABC, series que crecen, dos rasgos a la vez |
| Nombrar formas | Un triángulo sigue siéndolo aunque sea grande, pequeño o de otro color | círculo, cuadrado, triángulo | + rectángulo, óvalo, estrella, rombo | + pentágono, hexágono; lados y esquinas |
| Formas que giran | Una forma girada es la misma forma | sin girar | girada un cuarto de vuelta | cualquier giro y volteo |
| Componer | Dos triángulos hacen un cuadrado; las figuras están hechas de piezas | dos mitades | 2 o 3 piezas | tangram de 4 piezas |
| Clasificar y situar | Agrupar por un rasgo; dentro, fuera, encima, debajo | por color; dentro y fuera | por forma; encima, debajo, delante, detrás | dos rasgos; izquierda y derecha |

## Los retos del recorrido

Los retos A, B y C se resuelven golpeando un bloque desde abajo, como en los mundos 1 y 2, y cada uno reutiliza una pieza del motor del río. El D se resuelve saltando.

### A. El camino de huellas

Un puente en ruinas cruza un río de lava, y cada losa lleva grabada una forma siguiendo una serie. Falta una losa. El niño golpea el bloque con la forma que sigue, la losa sube y encaja con un golpe seco de piedra, y el puente se puede cruzar. Si cae a la lava, rebota fuera como en los fosos. Usa la misma pieza que el hueco del puente de los números.

- 3-4 años: AB con colores. 5-6 años: AB, ABB y AAB con formas. 7-8 años: ABC y series que crecen.

| Momento | Qué pasa |
|---|---|
| Acierta | La losa encaja, los grabados se encienden uno tras otro con una nota cada uno y se puede cruzar. |
| 1.er fallo | El bloque se tambalea y el hueco parpadea. |
| 2.º fallo | Las losas se encienden de una en una con su nota, y el ritmo deja oír lo que falta. |
| 3.er fallo | Lalo señala el bloque correcto y la losa sube sola. |

### B. La puerta de la cueva

Una losa tapa la entrada de un templo excavado en la roca y tiene un hueco con una forma. El niño golpea el bloque con la forma que encaja: la pieza vuela al hueco, gira si hace falta hasta encajar con un chasquido de piedra, y el triceratops empuja la losa a un lado. Es la compuerta del río con otro dibujo.

- 3-4 años: círculo, cuadrado y triángulo. 5-6 años: además estrella, rombo y óvalo, y alguna girada un cuarto de vuelta. 7-8 años: giros, volteos y formas compuestas.

| Momento | Qué pasa |
|---|---|
| Acierta | La pieza encaja, el grabado se ilumina, el triceratops empuja y la losa se aparta. |
| 1.er fallo | La pieza vuela al hueco, no cabe, rebota con un golpe sordo y vuelve a su bloque. |
| 2.º fallo | El borde del hueco se recorre con un brillo, esquina a esquina. |
| 3.er fallo | Lalo señala el bloque y la pieza encaja sola. |

### C. Paseo en braquiosaurio

Un braquiosaurio espera en un río humeante para llevar a Rufo a la otra orilla. En el lomo lleva una plataforma con un emblema tallado (una flecha, un escudo, la cabeza de un dinosaurio) al que le falta una pieza. El niño golpea el bloque que lo completa; la pieza vuela a su sitio, Rufo sube y el braquiosaurio cruza despacio. Usa la plataforma que se mueve de la barca de diez.

- 3-4 años: dos mitades. 5-6 años: 2 o 3 piezas. 7-8 años: tangram de 4 piezas.

| Momento | Qué pasa |
|---|---|
| Acierta | La pieza encaja, el braquiosaurio dobla el cuello para que Rufo suba y cruza el río. |
| 1.er fallo | La pieza se posa en el hueco, sobra o falta por un lado y vuelve a su bloque. |
| 2.º fallo | El hueco se llena de puntitos que dibujan la forma que falta. |
| 3.er fallo | Lalo señala el bloque y el emblema se completa. |

### D. Las piedras del géiser

«Pisa solo los círculos», el ejemplo de la propuesta. Un tótem de piedra muestra una forma y sobre un lago de lava hay una fila de piedras con formas. Las que tienen la forma del tótem aguantan; las otras se hunden despacio y Rufo rebota con suavidad a la piedra anterior, sin pinchazo ni galleta menos. Cuenta como acertado a la primera si cruza sin pisar ninguna piedra mala. Siempre hay un camino de piedras buenas que se puede saltar.

- 3-4 años: la forma, siempre del mismo color. 5-6 años: la forma, aunque cambie de color o tamaño. 7-8 años: dos rasgos (por ejemplo, círculos azules) o la serie.

| Momento | Qué pasa |
|---|---|
| Acierta | Cada piedra buena suena al pisarla y, al llegar a la orilla, el géiser lanza una columna de vapor detrás de Rufo. |
| 1.er fallo | La piedra se hunde despacio con un siseo y Rufo vuelve a la anterior; la forma del tótem se ilumina. |
| 2.º fallo | Las piedras buenas brillan un momento, de una en una. |
| 3.er fallo | Lalo vuela sobre las piedras buenas y las malas se hunden solas: solo queda el camino bueno. |

## Los 12 tramos de la isla

Cada reto se presenta solo, con demostración de Lalo, y después se mezcla con los anteriores. Una prueba de la bandera por nivel, siempre la misma en cada nivel, con 3 preguntas que se superan con 2. Las notas de la columna de retos describen la franja de 5-6 años. El castillo no es un nivel: es la parada siguiente del mapa.

| Nivel | Ambiente | Retos del recorrido | Prueba de la bandera | Novedad |
|---|---|---|---|---|
| 1 | Playa de arena negra | A ×3 (AB con colores) | Sombras de dinosaurios: emparejar cada dinosaurio con su silueta | Llega la barca y aparece el huevo; reto A con demostración |
| 2 | Bosque de helechos | A ×3 (AB con formas) | Formas en las cosas: la rueda es un círculo, la ventana un cuadrado | Primeros escalones |
| 3 | Charcas de barro y géiseres | A ×3 (ABB y AAB) | Las placas del estegosaurio: ¿cuál es el triángulo? (mayores: lados y esquinas) | Aparecen los pterosaurios |
| 4 | Huellas gigantes | A ×2, B ×2 | Igual aunque gire: la misma forma, girada | Reto B con demostración; primeros charcos de lava |
| 5 | Cascada templada | B ×4 (estrella, rombo, óvalo) | El nido: dentro, fuera, encima, debajo | Plataformas flotantes (hojas gigantes); aparece el volcancito |
| 6 | Pantano de noche con luciérnagas | A ×2, B ×2 | Los huevos de la familia: ¿cuál no es de la familia? | Más plataformas y escalones |
| 7 | Valle de los cuellos largos | C ×2, A ×2 | El fósil: completar la silueta con piezas | Reto C con demostración; aparece el tiranosaurio |
| 8 | Columnas de roca | B ×2, C ×2 | La piel del dinosaurio: mosaico, completar el dibujo de manchas | Columnas de hexágonos como escalones |
| 9 | Yacimiento de fósiles | A, B, C ×2, D | El cuello que crece: series que crecen | Reto D con demostración |
| 10 | Cueva de cristales y ámbar | B ×2, C ×2, D (mayores: giros y volteos) | Pelota, caja y cono: ¿qué rueda y qué no? | — |
| 11 | Ríos de lava | A, B, C, D ×2 | Formas escondidas: ¿cuántos triángulos hay en el dibujo? | Los charcos de lava más largos |
| 12 | Borde del cráter | A, B, C ×2, D | Repaso de la isla: una pregunta de tres pruebas anteriores | La mamá dinosaurio asoma al fondo; termina en la bandera, como todos |
| Castillo | El nido del cráter | — | Parada propia tras el nivel 12: 5 retos y medalla | Final del mundo |

## Estrellas

Como en todos los mundos (`estrellas-por-objetivos`, detalle en `docs/PROPUESTA.md`): 1 estrella por llegar a la bandera con al menos el 50 % de las galletas de la fase, otra por acertar al menos 1 de las 3 preguntas de la prueba, y las 3 con el 80 % de las galletas y las 3 preguntas. Con 0 se repite la fase. Los retos del recorrido (también el D) dan galletas si su mecánica las da, pero acertarlos a la primera no da estrellas.

## Final, castillo, enemigos y desbloqueo

### El huevo y el final

Se ve una vez por perfil, al volver al mapa después de terminar el nivel 12 por primera vez, y se salta tocando:

1. Se pinta la última mancha del huevo y Rufo sube al cráter con él.
2. La mamá dinosaurio se asoma, el huevo se mueve, se abre y sale un bebé que da un saltito.
3. El bebé tira de Rufo hacia una cueva con dibujos en las paredes que se van convirtiendo en letras. Así se abre el mundo 4.

Mientras el mundo 4 no exista, el final se queda en el paso 2.

### El castillo: el nido del cráter

La pieza `world-castle` del río, con 5 retos seguidos: uno de cada reto A, B y C y dos preguntas de las pruebas de la bandera de la isla. Siempre da la **medalla de la huella**, que aparece en el botón de formas del selector. Se abre al terminar el nivel 12, se puede volver a jugar y no da estrellas.

### Tiranosaurio, pterosaurios y volcancitos

Se suman al erizo, la abeja, la rana y el cangrejo y siguen sus reglas: tocarlos es un pinchazo que resta una galleta del nivel y nunca baja de 0. Los tres se mueven con un ritmo que se ve venir y avisan antes: el tiranosaurio con su rugido, el pterosaurio con su sombra en el suelo y el volcancito temblando.

- **Pterosaurios** (desde el nivel 3): vuelan en fila de dos o tres, en ondas regulares, siempre igual de altas. Se pasa por debajo cuando suben.
- **Volcancito** (desde el nivel 5): un volcán pequeño en el suelo que lanza una piedra grande hacia arriba; la piedra sube y vuelve a caer en el mismo volcán, siempre en vertical. Antes de lanzarla tiembla y echa humo. Se salta el volcancito mientras la piedra está arriba.
- **Tiranosaurio** (desde el nivel 7): con proporciones reales, pero sin sangre ni gestos de ataque. Camina de un lado a otro de un tramo y cada pocos pasos se para a rugir (un rugido grave y corto que se oye venir, nunca de golpe). Mientras ruge está quieto y se le salta por encima.
- Nunca se colocan junto a un reto, para que el niño piense con calma.

### Selector y desbloqueo

El botón de formas (triángulo y círculo), el tercero del selector, deja de temblar. La isla se abre según la edad del perfil:

- **7 años o más**: abierta desde el principio.
- **3 a 6 años**: con candado hasta completar el nivel 12 del río. Al tocarlo, el botón tiembla como ahora.

Cada mundo guarda su propio progreso.

## Fuera de este mundo

- La voz grabada: todo se explica con dibujos, animación y Lalo.
- El mundo 4 y la cueva de las letras, más allá del final.
- La dificultad adaptativa invisible y el repaso de lo fallado. El «Repaso de la isla» del nivel 12 usa pruebas fijas.
- Cambiar los mundos 1 y 2.
- Sincronizar el progreso fuera del dispositivo.

## Plan con OpenSpec: de boceto a mundo jugable en diez pasos

Este mundo se monta sobre el motor del río, así que empieza cuando estén hechos `progreso-por-mundos`, `retos-en-el-recorrido`, `reto-puente`, `reto-barca` y `castillo-y-medalla` (ver [MUNDO-2.md](MUNDO-2.md)). Como en el río, la isla queda oculta tras un interruptor que solo se activa en desarrollo hasta el paso 9.

Ciclo de cada cambio: `openspec-explore` (si hay dudas) → `openspec-propose` → `openspec-apply-change` → `npm test`, `npm run build` y móvil a 844×390 → `openspec-sync-specs` → `openspec-archive-change`.

| Paso | Cambio | Qué hace | Specs y código | Verificación | Estado |
|---|---|---|---|---|---|
| 0 | Documento de rumbo (no es un cambio de OpenSpec) | Este archivo y las líneas de estado en `docs/PROPUESTA.md`, `AGENTS.md` y `openspec/config.yaml`. | — | Revisión del texto. A partir de aquí, cada `openspec-propose` enlaza a este documento. | Hecho |
| 1 | `reto-huellas` | El reto A: generador de series con semilla y franja de edad en `src/learning/` y el hueco de piedra sobre la pieza del puente. | `course-challenges`, `level-courses` | Pruebas del generador (AB, ABB, AAB, ABC, series que crecen). Nivel 1 de la isla en borrador a 844×390. | Hecho |
| ★ | Prueba con niños del reto A | ¿Un niño de 4 años ve qué forma sigue sin que se lo expliquen? ¿Le ayuda la melodía de la serie? Lo que salga se ajusta antes de construir B, C y D. | — | Notas de la prueba. | |
| 2 | `reto-puerta-formas` | El reto B: generador de formas y giros, la pieza que vuela y gira hasta encajar y el triceratops que aparta la roca. | `course-challenges`, `level-courses` | Pruebas del generador por franja (sin giro, un cuarto de vuelta, volteo). Revisión a 844×390. | Hecho (en el borrador, nivel 2 de la isla) |
| 3 | `reto-braquiosaurio` | El reto C: siluetas con una pieza que falta y el braquiosaurio como plataforma que se mueve, reutilizando la barca. | `course-challenges`, `platformer-level`, `game-audio` | Pruebas de las siluetas (2, 3 y 4 piezas). Rufo no puede caerse del lomo en marcha. | Hecho (en el borrador, nivel 3 de la isla) |
| 4 | `reto-geiser` | El reto D: piedras que aguantan o se hunden despacio según su forma, el rebote suave a la piedra anterior y el registro de «a la primera». | `course-challenges`, `platformer-level` (piedras que se hunden) | Pruebas del generador por franja. Siempre hay un camino de piedras buenas que se puede saltar. Revisión a 844×390. | Hecho (en el borrador, nivel 4 de la isla) |
| 5 | `enemigos-de-la-isla` (en paralelo con 1 a 4) | Tiranosaurio, pterosaurios y volcancito. Solo toca `level-enemies`. | `level-enemies` (movimiento, aviso y colocación lejos de los retos); arte en `public/assets/svg` en el estilo A de la hoja de diseño, anotado en `LICENSES.md` | Pruebas de movimiento y de colocación. La piedra del volcancito nunca sale de su columna. El aviso del tiranosaurio y del volcancito se ve venir, comprobado en el móvil. | Hecho (se dan de alta en la isla al juntarse con el paso 1) |
| 6 | `pruebas-bandera-isla` (en paralelo con 1 a 4) | Once tipos de prueba nuevos (niveles 1 a 11), el repaso del nivel 12 y el catálogo del mundo 3, partiendo de `shapes.ts`, `series.ts` y `mirror.ts`. TypeScript puro con el mismo contrato (`Question`, `AgeBand`, `Rng`). | `flag-quiz` | Pruebas deterministas con semilla para cada prueba y franja. Cada prueba revisada en la pantalla de la bandera a 844×390. | Hecho (se dan de alta en la isla al juntarse con el paso 1) |
| 7 | `huevo-del-mapa` | Las 12 manchas del huevo, la animación de la mancha nueva y el final con la eclosión. La cueva de las letras se añade cuando exista el mundo 4. | `world-map`, `mascot-guide`, `child-profile` | Función pura de manchas según el progreso (0, una pendiente, 12). El final se ve una vez y se salta tocando. | |
| 8 | `castillo-del-volcan` | El nido del cráter con la pieza `world-castle` y la medalla de la huella. | `world-castle`, `world-map` | Siempre da medalla y se ve en el selector. | Hecho (en el borrador, se abre al terminar el último nivel que haya) |
| 9 | `mundo-3-isla` | El contenido: 12 ambientes (con la lava como dibujo de los fosos), 12 recorridos en JSON con sus retos, el mapa del volcán, el desbloqueo por edad (7 años) y la apertura del mundo (se quita el interruptor de desarrollo). | `level-courses`, `world-map`, `visual-style` (paleta y ambiente del mundo 3, bloques de piedra, grabados) | `validate.ts` y `duration.ts` pasan con los 12 niveles. Perfil de 6 años: la isla tiembla con candado hasta acabar el río. Recorrido completo del mundo en el móvil. | |
| 10 | Prueba final con niños y ajustes | Rangos por edad, ritmo de los enemigos y si el tiranosaurio o el volcán dan miedo a los de 3 y 4 años. Los ajustes de valores no necesitan un cambio formal. Después, actualizar el estado en README y AGENTS.md y desplegar cuando se decida. | — | Notas de la prueba. | |

Para empezar cada paso: `openspec-propose` con el nombre del cambio y una frase como «sigue docs/MUNDO-3.md, sección A. El camino de huellas», para que la propuesta parta de lo aprobado y no lo vuelva a inventar.
