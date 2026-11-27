# Mundo 11: El universo

Borrador del 27 de noviembre de 2026, pendiente de aprobar. Versión visual, con el mapa, las escenas de los retos y el plan: <https://claude.ai/artifact/JHjimaQVpKcGDsMCLuQxvy>. Rafael eligió el universo como mundo 11, entre los inventos (mundo 10) y la inteligencia artificial (mundo 12); el resto de este documento es una propuesta que se ajusta antes de empezar el plan.

Cuando se apruebe, este documento mandará sobre las specs de `openspec/specs/` en lo que toca al mundo 11. Si algo discrepa, se pregunta antes de cambiarlo.

## La idea

Al final de los inventos, en el taller donde se ha construido el primer **cohete**, cae del cielo una **estrellita** que apenas brilla. Rufo y Lalo suben al cohete para devolverla a su sitio. Después de recorrer la historia, de los dinosaurios a la revolución industrial, Rufo sale de la Tierra. Aquí el niño aprende a **pensar por pasos**: orientarse (arriba, abajo, izquierda, derecha), dar órdenes en secuencia como un pequeño programa, recordar el orden en que pasan las cosas y deducir a partir de pistas. En una nave esas ideas salen solas: se pilota con flechas, los paneles se encienden en secuencia y cada alienígena se reconoce por sus rasgos.

- 12 niveles y un castillo, que es una parada propia del mapa después del nivel 12 (igual que en los mundos 1 a 3).
- 4 retos en el recorrido: tres con el gesto de siempre (golpear un bloque desde abajo) y uno de saltar.
- **Gravedad baja** como novedad de juego: en la luna y en los asteroides los saltos son más altos, más largos y más lentos.
- 3 franjas de edad: 3-4, 5-6 y 7-8.

El mundo 10, «Inventos y revolución industrial», aún no tiene documento. Este mundo cuenta con que acabe en un taller con un cohete y una estrellita caída; si su diseño cambia, se ajusta el principio de este.

## El hilo de los mundos

Cada mundo termina abriendo el siguiente con algo que el niño ve, sin leer nada.

| Mundo | Meta que se ve | Cómo empieza | Cómo acaba |
|---|---|---|---|
| 1. El camino del arcoíris | El arcoíris crece al fondo | Rufo sale de la madriguera | La nube llueve sobre la montaña y nace el manantial |
| 2. El río de los números | El río baja hacia el mar | El manantial | La desembocadura y la barca |
| 3. La isla de los dinosaurios | El huevo se pinta mancha a mancha | La barca llega a la playa negra y aparece el huevo | El huevo se abre en el nido y el bebé lleva a Rufo a una cueva con dibujos |
| 4 a 9. Prehistoria, egipcios, romanos, árabes, caballeros y renacimiento | Por diseñar | — | — |
| 10. Inventos y revolución industrial | Por diseñar | — | Un taller con el primer cohete y una estrellita que cae del cielo |
| 11. El universo | La constelación de Rufo se enciende estrella a estrella | El cohete despega del taller | La estrellita vuelve a su sitio y, en el observatorio, un pequeño robot se despierta |
| 12. Inteligencia artificial | Por diseñar | El robot del observatorio | — |

Orden de los mundos fijado por Rafael el 27 de noviembre de 2026: dinosaurios (3), prehistoria (4), egipcios (5), romanos (6), árabes (7), caballeros (8), renacimiento (9), inventos y revolución industrial (10), universo (11) e inteligencia artificial (12).

## El mapa

Es tan ancho como los de los otros mundos y también se desplaza. El camino sale de la plataforma de lanzamiento del taller y sube por el cielo hasta las estrellas: base de lanzamiento, pasillos de la estación espacial, invernadero de la estación, cráteres de la luna, cara oculta de la luna, cinturón de asteroides, planeta rojo, luna de hielo, planeta de anillos, nebulosa de colores, cola del cometa y puerta de las constelaciones; después, el observatorio. El juego no muestra esos nombres.

Arriba hay una **constelación con la silueta de Rufo**, de 12 estrellas, que hace el papel de los gajos del arcoíris y de las manchas del huevo: cada nivel terminado enciende una estrella y la une a la anterior con una línea de luz.

## Decisiones

Respuesta del usuario:

- **El universo** como mundo 11, después de los inventos y antes de la inteligencia artificial. Se aprovecha de la idea de la nave la parte de lógica y programación sencilla, que prepara el mundo 12.

Propuestas de este borrador, a confirmar al aprobarlo (se ajustan si la prueba con niños dice otra cosa):

- **Nombre**: «El universo». Otras opciones: «El viaje a las estrellas» o «La constelación de Rufo».
- **Lógica y orientación** como tema: direcciones, programas de flechas, secuencias y deducción por pistas.
- **La estrellita caída** como meta, y la constelación de Rufo como final.
- **12 niveles** con su bandera y el castillo como parada propia después del nivel 12.
- **Desbloqueo**: al completar el nivel 12 del mundo 10. Si los mundos 4 a 12 tienen atajo por edad, como los mundos 2 y 3, se decide al planificar la ruta completa.
- **Mismo motor que el río y la isla**: los retos cortan el paso, nunca atascan (al tercer fallo, Lalo lo resuelve) y fallar no quita galletas. Solo el pinchazo cuesta una.
- **Estrellas como en todos los mundos**: por las galletas de la fase y los aciertos de la prueba de la bandera (`estrellas-por-objetivos`, ver `docs/PROPUESTA.md`).
- **Siguen los bloques «?»** con galletas y fresa entre reto y reto.
- **Demostración de Lalo** la primera vez que aparece cada reto.
- **De 3 a 5 retos por nivel** y niveles de 90 a 150 s.
- **Los alienígenas son amigos**, como los herbívoros de la isla: piden ayuda en el reto C y llevan a Rufo en su lanzadera. Los enemigos son máquinas y rocas, nunca seres con cara de malo.
- **La gravedad baja es un dato del nivel**, no del mundo entero: los niveles de la estación y del planeta rojo tienen gravedad normal; los de la luna, los asteroides, los anillos, la nebulosa, el cometa y la puerta, gravedad baja.
- **Los cráteres con cristales son otro dibujo de los fosos de pinchos**: con el mismo «¡uy!», rebote y una galleta menos.
- **Aventura sin sustos**: el espacio no es oscuro del todo, siempre se ve un planeta o la Tierra al fondo, y nada se cae «al vacío». Los de 3 y 4 años nunca quedan flotando sin control.
- **Dibujos propios**, planos y sin contornos negros como el resto del juego, sin parecerse a los de ninguna película, serie o agencia espacial real (sin logotipos ni banderas), anotados en `public/assets/LICENSES.md`.

## Dirección de arte

El mundo 11 sigue el registro de la isla, pensado para que un niño de 7 u 8 años no lo vea de pequeños: es una **misión de exploración**, no un dibujo de cuento. Rufo lleva un casco de burbuja y Lalo unas gafas de piloto; ninguno de los dos cambia de forma.

- **Paleta y luz**: cielos de azul noche a violeta, nunca negro puro, con nebulosas en turquesa y magenta suaves. Superficies en gris luna, óxido marciano y blanco hielo. La luz sale de las estrellas, de los paneles de la nave y del planeta del fondo.
- **Máquinas de expedición**: el cohete, la estación y los robots tienen paneles, remaches y luces de estado, en blanco roto, naranja seguridad y azul. Nada de caras sonrientes en las máquinas.
- **Bloques de panel con borde luminoso**: son los que se golpean en este mundo. Siguen leyéndose como «golpéame», con su luz de estado.
- **Alienígenas**: pocos y amables, con rasgos que se distinguen bien a simple vista (color, número de ojos, antenas, rayas o manchas), porque el reto C se juega con ellos. Sin dientes ni gestos de ataque.
- **Sonido y efectos**: pitidos de panel, zumbidos suaves, notas de sintetizador al encender cada luz y un «fuuu» largo en los saltos de gravedad baja. Todo sintetizado, como el resto del audio.
- **Rendimiento**: el cielo de estrellas, las nebulosas y los planetas del fondo son escenario estático y se dibujan una vez (`openspec/specs/performance`, «Escenario estático sin coste por fotograma»). El centelleo se hace con unas pocas estrellas sueltas que cambian de opacidad, no redibujando el cielo.

## La gravedad baja

Es la novedad de juego del mundo y se nota sin explicarla: Rufo salta más alto, más lejos y cae más despacio, con una estela de polvo de luna al aterrizar.

- **Cuánto**: la gravedad baja a algo más de la mitad y el impulso del salto baja un poco, para que el salto suba como mucho un tercio más (sin salirse de la pantalla) y dure en el aire alrededor de una vez y media más. Los valores exactos se fijan en el paso de la gravedad y se ajustan en la prueba con niños.
- **Control**: Rufo se sigue dirigiendo en el aire igual que siempre, y el salto corto (soltar pronto) funciona igual. La velocidad de caída tiene tope, para que nunca parezca que se cae sin fin.
- **Dónde**: es un dato del recorrido en JSON (`gravedad: baja`), de modo que el motor no pregunta en qué mundo está. Al entrar en un nivel de gravedad baja, Lalo hace una demostración la primera vez: da un saltito larguísimo.
- **Diseño de niveles**: los huecos, escalones y plataformas se validan con el alcance del salto de ese nivel. `validate.ts`, `duration.ts` y las comprobaciones de los fosos dejan de usar las constantes fijas de `level-course.ts` y reciben la física del nivel.
- **Enemigos y retos**: su ritmo no depende de la gravedad. Solo cambian Rufo y lo que salta o cae con él (galletas que saltan del bloque, fresa).

## Qué se aprende

Cada concepto se adapta a la edad del perfil, igual que en el río y la isla. Ya existen pruebas de la bandera de orientación y orden en el mundo 1 (Huellas en la nieve, De pequeño a grande, ¿Te acuerdas?): sus generadores (`tracks.ts`, `order.ts`, `memory.ts`) sirven de base y aquí se llevan más lejos.

| Concepto | Qué entiende el niño | 3-4 años | 5-6 años | 7-8 años |
|---|---|---|---|---|
| Direcciones | Arriba, abajo, izquierda y derecha llevan a sitios distintos | arriba y abajo; hacia el planeta | izquierda y derecha desde Rufo | izquierda y derecha de otro que mira de frente; giros |
| Programas | Una fila de órdenes se cumple de una en una, en orden | 1 flecha | 2 o 3 flechas, falta una | 4 flechas, elegir el programa o encontrar la que sobra |
| Secuencias y memoria | El orden importa y se puede recordar | 2 luces | 3 luces | 4 luces, o al revés |
| Deducción | Con pistas se descarta hasta que solo queda uno | 1 pista («tiene antenas») | 2 pistas | 2 pistas con un «no» («no es verde») |
| Ordenar y clasificar | Poner en fila por un rasgo y agrupar con una regla | el más grande; por color | 3 de pequeño a grande; por forma | dos rasgos a la vez; lo que va en las dos cajas |

## Los retos del recorrido

Los retos A, B y C se resuelven golpeando bloques desde abajo, como en el río y en la isla, y cada uno reutiliza una pieza del motor. El D se resuelve saltando, con la gravedad baja.

### A. El robot de las flechas

Una puerta de la estación está cerrada y su llave es una batería. En una pantalla junto a la puerta hay un pequeño robot en una cuadrícula y la batería unas casillas más allá. El niño golpea el bloque con la flecha (o la tira de flechas) que lleva al robot hasta la batería. El robot recorre la cuadrícula paso a paso con un pitido en cada casilla, coge la batería y la puerta se abre. Usa la pieza de la compuerta del río y la puerta de la cueva de la isla, con la cuadrícula de `tracks.ts`.

- 3-4 años: una flecha, con la batería al lado del robot. 5-6 años: una tira de 2 o 3 flechas a la que le falta una. 7-8 años: tres tiras de 3 o 4 flechas, y solo una llega sin pasar por un cráter de la cuadrícula.

| Momento | Qué pasa |
|---|---|
| Acierta | El robot camina paso a paso, coge la batería, la puerta sube con un zumbido y la luz del panel se pone verde. |
| 1.er fallo | El robot hace el recorrido de la flecha elegida, se para en la casilla equivocada, se encoge de hombros y vuelve a la salida. |
| 2.º fallo | La casilla de la batería parpadea y el camino bueno se dibuja con puntitos. |
| 3.er fallo | Lalo señala el bloque correcto y el robot hace el camino solo. |

### B. Las luces de la nave

La compuerta de un módulo tiene un panel con luces de colores. El panel enciende una secuencia, con una nota por luz, y abajo hay un bloque de cada color. El niño golpea los bloques en el mismo orden; cada golpe enciende su luz en el panel. Es el único reto de golpes en orden: parte de los bloques que cuentan del río, que ya suman golpes, y de la compuerta.

- 3-4 años: 2 luces. 5-6 años: 3 luces. 7-8 años: 4 luces, o 3 luces que se repiten al revés (el panel lo indica con una flecha hacia atrás).

| Momento | Qué pasa |
|---|---|
| Acierta | Las luces se encienden todas a la vez con la melodía completa y la compuerta se abre. |
| 1.er fallo | La luz equivocada se apaga con un pitido grave, el panel se vacía y repite la secuencia más despacio. |
| 2.º fallo | El panel repite la secuencia y, a la vez, cada bloque brilla cuando suena su luz. |
| 3.er fallo | Lalo golpea los bloques en orden y la compuerta se abre. |

Un fallo en una luz cuenta como un intento, no cada golpe: si el niño se equivoca en la tercera luz, se vuelve a empezar la secuencia.

### C. ¿Quién viaja en la lanzadera?

Una lanzadera espera para cruzar un cráter grande. En su ventanilla se ve la silueta de su piloto y unas pistas dibujadas: una antena, unos ojos, un color, y a veces la misma pista tachada («no»). Delante hay tres alienígenas, cada uno sobre su bloque. El niño golpea el bloque del alienígena que cumple las pistas: sube a la lanzadera, Rufo sube detrás y la lanzadera cruza despacio. Usa la plataforma que se mueve de la barca de diez y del braquiosaurio.

- 3-4 años: una pista («tiene antenas»), y solo un alienígena la cumple. 5-6 años: dos pistas («tiene antenas» y «es verde»). 7-8 años: dos pistas, una de ellas con «no» («tiene tres ojos» y «no es verde»).

| Momento | Qué pasa |
|---|---|
| Acierta | El alienígena salta a la lanzadera, saluda, Rufo sube y cruzan el cráter. |
| 1.er fallo | El alienígena se acerca a la ventanilla, la pista que no cumple se ilumina en rojo y vuelve a su bloque. |
| 2.º fallo | Los alienígenas que no cumplen alguna pista se apartan un paso; quedan dos. |
| 3.er fallo | Lalo señala el bloque y el alienígena sube solo. |

### D. Saltos entre asteroides

Un hueco del recorrido se cruza saltando de asteroide en asteroide, con la gravedad baja. Los asteroides flotan a dos alturas, arriba y abajo. Una baliza al principio muestra el camino con flechas (por ejemplo, arriba, abajo, abajo). Los asteroides del camino aguantan; los otros se alejan flotando despacio y Rufo vuelve al anterior con un rebote suave, sin pinchazo ni galleta menos. Cuenta como acertado a la primera si cruza sin pisar ninguno malo. Siempre hay un camino bueno que se puede saltar. Usa la pieza de las piedras del géiser de la isla.

- 3-4 años: los buenos son siempre los de arriba, que además son del color de la baliza. 5-6 años: una serie de 3 flechas (arriba y abajo). 7-8 años: 4 o 5 flechas, con diagonales (el siguiente puede estar arriba a la derecha o abajo a la derecha, saltándose uno).

| Momento | Qué pasa |
|---|---|
| Acierta | Cada asteroide bueno suena al pisarlo y, al llegar a la otra orilla, la baliza lanza un destello. |
| 1.er fallo | El asteroide se aleja despacio y Rufo vuelve al anterior; la flecha que tocaba se ilumina en la baliza. |
| 2.º fallo | Los asteroides buenos brillan un momento, de uno en uno, siguiendo las flechas. |
| 3.er fallo | Lalo vuela sobre los buenos y los malos se alejan solos: solo queda el camino bueno. |

## Los 12 tramos del espacio

Cada reto se presenta solo, con demostración de Lalo, y después se mezcla con los anteriores. Una prueba de la bandera por nivel, siempre la misma en cada nivel, con 3 preguntas. Las notas de la columna de retos describen la franja de 5-6 años. El castillo no es un nivel: es la parada siguiente del mapa.

| Nivel | Ambiente | Gravedad | Retos del recorrido | Prueba de la bandera | Novedad |
|---|---|---|---|---|---|
| 1 | Base de lanzamiento del taller | Normal | A ×3 (1 flecha) | ¿Hacia dónde va el cohete? | El cohete despega; reto A con demostración |
| 2 | Pasillos de la estación espacial | Normal | A ×3 (2 flechas) | Las luces de la nave: recordar la secuencia | Primeros escalones de panel |
| 3 | Invernadero de la estación | Normal | A ×3 (3 flechas, falta una) | El camino del robot: el programa en la cuadrícula | Aparecen los satélites |
| 4 | Cráteres de la luna | Baja | A ×2, B ×2 | Izquierda y derecha del astronauta | Gravedad baja con demostración; reto B con demostración; primeros cráteres con cristales |
| 5 | Cara oculta de la luna, con la Tierra al fondo | Baja | B ×4 (3 luces) | Los planetas en fila: ordenar por tamaño | Aparecen los meteoritos |
| 6 | Cinturón de asteroides | Baja | A ×2, B ×2 | ¿Quién es el alienígena? (pistas) | Plataformas que flotan y se mueven |
| 7 | Planeta rojo: dunas y cañones | Normal | C ×2, A ×2 | La constelación: copiar las estrellas en la cuadrícula | Reto C con demostración; aparece el robot patrulla |
| 8 | Luna de hielo | Normal | B ×2, C ×2 | Las viñetas del despegue: ¿qué pasa antes? | Suelo de hielo que resbala un poco al frenar |
| 9 | Planeta de anillos | Baja | A, B, C ×2, D | Cada cosa en su caja: clasificar con una regla | Reto D con demostración |
| 10 | Nebulosa de colores | Baja | B ×2, C ×2, D (mayores: luces al revés) | La nave vista desde arriba | — |
| 11 | Cola del cometa | Baja | A, B, C, D ×2 | El laberinto del cometa | Los cráteres con cristales más largos |
| 12 | Puerta de las constelaciones | Baja | A, B, C ×2, D | Repaso del espacio: una pregunta de tres pruebas anteriores | La estrellita brilla cada vez más; termina en la bandera, como todos |
| Castillo | El observatorio de las estrellas | Baja | — | Parada propia tras el nivel 12: 5 retos y medalla | Final del mundo |

El suelo de hielo del nivel 8 es opcional: si en la prueba con niños frustra a los de 3 y 4 años, se queda solo en el dibujo.

## Las pruebas de la bandera

Once tipos nuevos (niveles 1 a 11) y el repaso del nivel 12, con el mismo contrato que las demás (`Question`, `AgeBand`, `Rng`) y generadores con semilla en `src/learning/quiz/`.

| Nivel | Prueba | 3-4 años | 5-6 años | 7-8 años |
|---|---|---|---|---|
| 1 | ¿Hacia dónde va el cohete? | la flecha que apunta al planeta (arriba o abajo) | las cuatro direcciones | el cohete gira un cuarto de vuelta: ¿hacia dónde apunta ahora? |
| 2 | Las luces de la nave | 2 luces: elegir la tira igual | 3 luces | 4 luces, o la tira al revés |
| 3 | El camino del robot | ¿a qué casilla llega con 1 flecha? | con 2 o 3 flechas | elegir el programa que llega sin pisar un cráter |
| 4 | Izquierda y derecha del astronauta | encima o debajo de la nave | izquierda o derecha, mirando como el niño | izquierda o derecha del astronauta que mira de frente |
| 5 | Los planetas en fila | el planeta más grande | ordenar 3 de pequeño a grande | ¿cuál falta en la fila? (por tamaño y por anillos) |
| 6 | ¿Quién es el alienígena? | 1 pista | 2 pistas | 2 pistas con un «no» |
| 7 | La constelación | la constelación igual entre tres | poner la estrella que falta | poner una estrella en su fila y su columna |
| 8 | Las viñetas del despegue | 2 viñetas: ¿qué pasa antes? | ordenar 3 viñetas | ordenar 4 viñetas, o encontrar la que está fuera de sitio |
| 9 | Cada cosa en su caja | por color | por forma | por dos rasgos; lo que va en las dos cajas a la vez |
| 10 | La nave vista desde arriba | la sombra igual | ¿cómo se ve desde arriba? (cosas sencillas) | desde arriba y de lado |
| 11 | El laberinto del cometa | 2 caminos: ¿cuál llega? | 3 salidas | con una regla: solo por las estrellas azules |
| 12 | Repaso del espacio | una pregunta de tres pruebas anteriores | ídem | ídem |

## Estrellas

Como en todos los mundos (`estrellas-por-objetivos`, detalle en `docs/PROPUESTA.md`): 1 estrella por llegar a la bandera con al menos el 50 % de las galletas de la fase, otra por acertar al menos 1 de las 3 preguntas de la prueba, y las 3 con el 80 % de las galletas y las 3 preguntas. Con 0 se repite la fase. Los retos del recorrido (también el D) dan galletas si su mecánica las da, pero acertarlos a la primera no da estrellas. Las estrellas de la constelación del mapa no tienen nada que ver con las de puntuación: se encienden por nivel terminado, como los gajos y las manchas.

## Final, castillo, enemigos y desbloqueo

### La constelación y el final

Se ve una vez por perfil, al volver al mapa después de terminar el nivel 12 por primera vez, y se salta tocando:

1. Se enciende la última estrella y la línea de luz cierra la silueta de Rufo.
2. El cohete sube hasta el hueco de la constelación, Rufo abre la escotilla y la estrellita vuela a su sitio: es el ojo de la silueta y brilla más que ninguna.
3. La constelación entera parpadea, como si guiñara un ojo, y el cohete aterriza junto al observatorio.

Como el del arcoíris y el del huevo, el final es una animación de `story/finale.ts`: se añade un tipo nuevo (`constellation`) a `WorldDef.finale`. Cuando exista el mundo 12, se añade un paso 4: en el observatorio, un pequeño robot abre los ojos y saluda a Rufo. Así se abre la inteligencia artificial.

### El castillo: el observatorio de las estrellas

La pieza `world-castle` del río y de la isla, con 5 retos seguidos: uno de cada reto A, B y C y dos preguntas de las pruebas de la bandera del espacio. Siempre da la **medalla del cohete**, que aparece en el botón del universo del selector. Se abre al terminar el nivel 12, se puede volver a jugar y no da estrellas.

### Satélites, meteoritos y robot patrulla

Se suman al erizo, la abeja, la rana, el cangrejo, el tiranosaurio, los pterosaurios y el volcancito, y siguen sus reglas: tocarlos es un pinchazo que resta una galleta del nivel y nunca baja de 0. Los tres se mueven con un ritmo que se ve venir y avisan antes.

- **Satélites** (desde el nivel 3): giran en un círculo alrededor de un punto fijo, a velocidad constante, con una luz que parpadea. Se pasa cuando están en la parte de arriba del círculo. Es un movimiento nuevo (`level-enemies`).
- **Meteoritos** (desde el nivel 5): caen en vertical en un sitio fijo, siempre el mismo, cada pocos segundos. Antes de caer, su sombra crece en el suelo. Al tocar el suelo se deshacen en polvo y vuelven a empezar arriba, fuera de la pantalla.
- **Robot patrulla** (desde el nivel 7): un robot de limpieza que va de un lado a otro de un tramo y cada pocos pasos se para a girar la antena con un pitido. Mientras gira está quieto y se le salta por encima. Es el ritmo del tiranosaurio con otro dibujo.
- Nunca se colocan junto a un reto, para que el niño piense con calma. En los niveles de gravedad baja se dejan más separados, porque el salto dura más.

### Selector y desbloqueo

El botón del universo (un cohete) es el undécimo del selector. Con candado hasta completar el nivel 12 del mundo 10; al tocarlo, el botón tiembla como ahora. El atajo por edad, si lo hay, se decide con la ruta completa.

Cada mundo guarda su propio progreso.

## Fuera de este mundo

- La voz grabada: todo se explica con dibujos, animación y Lalo.
- Los mundos 4 a 10 y 12. Este documento solo supone que el 10 acaba con el cohete y que el 12 empieza con el robot del observatorio.
- La dificultad adaptativa invisible y el repaso de lo fallado. El «Repaso del espacio» del nivel 12 usa pruebas fijas.
- Cambiar los mundos 1 a 3.
- Sincronizar el progreso fuera del dispositivo.
- Programación con bucles o condiciones escritas: los programas son tiras cortas de flechas dibujadas.

## Plan con OpenSpec: de boceto a mundo jugable en once pasos

Este mundo se monta sobre el motor del río y de la isla, así que empieza cuando la isla esté en `dev`. Puede adelantarse a los mundos 4 a 10: mientras no existan, en desarrollo se abre sin candado. Como en los otros, el universo queda oculto tras un interruptor que solo se activa en desarrollo hasta el paso 10. Cada mundo es independiente: lo propio del universo va en `src/game/worlds/universo/` y `content/levels/universo/`, y lo que el motor necesite de nuevo (gravedad por nivel, enemigo que gira, final de la constelación, reto de golpes en orden) entra como pieza común configurable desde los datos, sin preguntar en qué mundo está. Cada cambio, también este documento, va en una rama `mundo11-<nombre del cambio>` nacida de `mundo11`, con su PR contra `mundo11`.

Ciclo de cada cambio: `openspec-explore` (si hay dudas) → `openspec-propose` → `openspec-apply-change` → `npm test`, `npm run build`, móvil a 844×390 y la medida de `openspec/specs/performance` en el nivel más cargado → `openspec-sync-specs` → `openspec-archive-change`.

| Paso | Cambio | Qué hace | Specs y código | Verificación | Estado |
|---|---|---|---|---|---|
| 0 | Documento de rumbo (no es un cambio de OpenSpec) | Este archivo y las líneas de estado en `docs/PROPUESTA.md`, `AGENTS.md` y `openspec/config.yaml`. | — | Revisión del texto. A partir de aquí, cada `openspec-propose` enlaza a este documento. | Borrador |
| 1 | `reto-robot-flechas` | El reto A: generador de programas de flechas con semilla y franja de edad en `src/learning/` (partiendo de `tracks.ts`), el robot en la pantalla de la puerta y la puerta que sube. Crea el borrador del mundo `universo` tras el interruptor `mundo-11-universo`. | `course-challenges`, `level-courses` | Pruebas del generador (1 flecha, falta una, tres tiras con una sola buena que no pisa cráter). Nivel 1 del espacio en borrador a 844×390. | |
| ★ | Prueba con niños del reto A | ¿Un niño de 4 años entiende que la flecha mueve al robot? ¿Un niño de 6 lee una tira de 3 flechas en orden? Lo que salga se ajusta antes de construir B, C y D. | — | Notas de la prueba. | |
| 2 | `reto-luces-nave` | El reto B: generador de secuencias de luces, los golpes en orden sobre varios bloques, la repetición más lenta y la compuerta. | `course-challenges`, `game-audio` | Pruebas del generador por franja (2, 3, 4 luces y al revés). Un fallo en cualquier luz cuenta un intento. Revisión a 844×390. | |
| 3 | `reto-lanzadera` | El reto C: generador de alienígenas por rasgos y pistas (con «no») que garantiza una sola respuesta, y la lanzadera como plataforma que se mueve, reutilizando la barca y el braquiosaurio. | `course-challenges`, `platformer-level` | Pruebas del generador: siempre exactamente un alienígena cumple las pistas. Rufo no puede caerse de la lanzadera en marcha. | |
| 4 | `gravedad-baja` (antes del paso 5) | La gravedad como dato del recorrido (`gravedad: baja`), la física del salto a partir de ella y la validación de huecos, fosos y duración con el alcance de cada nivel. La demostración de Lalo y el polvo al aterrizar. | `platformer-level`, `level-courses`, `spike-zones` | Pruebas de alcance y tiempo en el aire con las dos gravedades. Los niveles de los mundos 1 a 3 no cambian (mismas pruebas en verde). En el móvil, el salto no se sale de la pantalla. | |
| 5 | `reto-asteroides` | El reto D: asteroides a dos alturas, baliza con flechas, los malos que se alejan, el rebote suave al anterior y el registro de «a la primera», sobre la pieza del géiser. | `course-challenges`, `platformer-level` | Pruebas del generador por franja. Siempre hay un camino bueno que se puede saltar con la gravedad baja. Revisión a 844×390. | |
| 6 | `enemigos-del-espacio` (en paralelo con 1 a 5) | Satélites en órbita, meteoritos con sombra y robot patrulla. Solo toca `level-enemies`. | `level-enemies` (movimiento circular, aviso y colocación lejos de los retos y con más margen en gravedad baja); arte en `public/assets/svg`, anotado en `LICENSES.md` | Pruebas de movimiento y de colocación. El meteorito nunca sale de su columna. Los avisos se ven venir, comprobado en el móvil. | |
| 7 | `pruebas-bandera-espacio` (en paralelo con 1 a 5) | Once tipos de prueba nuevos (niveles 1 a 11), el repaso del nivel 12 y el catálogo del mundo 11, partiendo de `tracks.ts`, `order.ts` y `memory.ts`. TypeScript puro con el mismo contrato (`Question`, `AgeBand`, `Rng`). | `flag-quiz` | Pruebas deterministas con semilla para cada prueba y franja. Cada prueba revisada en la pantalla de la bandera a 844×390. | |
| 8 | `constelacion-del-mapa` | Las 12 estrellas de la constelación de Rufo, la línea de luz de la estrella nueva y el final `constellation`. | `world-map`, `mascot-guide`, `child-profile` | Función pura de estrellas encendidas según el progreso (0, una pendiente, 12). El final se ve una vez y se salta tocando. | |
| 9 | `castillo-del-observatorio` | El observatorio con la pieza `world-castle` y la medalla del cohete. | `world-castle`, `world-map` | Siempre da medalla y se ve en el selector. | |
| 10 | `mundo-11-universo` | El contenido: 12 ambientes (con los cráteres de cristales como dibujo de los fosos), 12 recorridos en JSON con sus retos y su gravedad, el mapa de las estrellas, el desbloqueo al acabar el mundo 10 y la apertura del mundo (se quita el interruptor de desarrollo). | `level-courses`, `world-map`, `visual-style` (paleta y ambiente del mundo 4, bloques de panel) | `validate.ts` y `duration.ts` pasan con los 12 niveles. El universo tiembla con candado hasta acabar el mundo 10. Presupuesto de `performance` medido en el nivel más largo y en la nebulosa. Recorrido completo del mundo en el móvil. | |
| 11 | Prueba final con niños y ajustes | Rangos por edad, cuánto flota el salto, el hielo del nivel 8 y si los programas de 4 flechas son demasiado para los de 7 y 8 años. Los ajustes de valores no necesitan un cambio formal. Después, actualizar el estado en README y AGENTS.md y desplegar cuando se decida. | — | Notas de la prueba. | |

Para empezar cada paso: `openspec-propose` con el nombre del cambio y una frase como «sigue docs/MUNDO-11.md, sección A. El robot de las flechas», para que la propuesta parta de lo aprobado y no lo vuelva a inventar.
