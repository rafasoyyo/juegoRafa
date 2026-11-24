# Spec Delta

## MODIFIED Requirements

### Requirement: Un tipo de prueba por nivel
Cada nivel del mundo de los números SHALL tener siempre el mismo tipo de prueba: nivel 1, «¿Cuántos hay?»; nivel 2, «¿Dónde hay más?»; nivel 3, «Sigue la serie»; nivel 4, «Caza de formas»; nivel 5, «Las letras de tu nombre»; nivel 6, «¿Te acuerdas?»; nivel 7, «Reparte las galletas»; nivel 8, «De pequeño a grande»; nivel 9, «El teleférico»; nivel 10, «Huellas en la nieve»; nivel 11, «La balanza»; nivel 12, «La otra mitad».

#### Scenario: Nivel 3
- **WHEN** el niño llega a la bandera del nivel 3
- **THEN** la prueba es «Sigue la serie»

#### Scenario: Repetir un nivel
- **WHEN** el niño repite el nivel 5 y llega a la bandera
- **THEN** la prueba vuelve a ser «Las letras de tu nombre»

#### Scenario: Niveles nuevos
- **WHEN** el niño llega a la bandera del nivel 7 y, más tarde, a la del nivel 12
- **THEN** la prueba del 7 es «Reparte las galletas» y la del 12 es «La otra mitad»

#### Scenario: Cada prueba nueva con su pictograma
- **WHEN** se abren una tras otra las pruebas de los niveles 7 a 12 en un móvil horizontal de 844×390
- **THEN** cada una muestra su propio pictograma, distinto del de las demás pruebas, y Lalo hace su demostración antes de que el niño pueda tocar

## ADDED Requirements

### Requirement: Prueba «Reparte las galletas»
Se ve una cesta de galletas y varios platos, cada uno con un amigo dibujado. Cada toque en un plato lleva una galleta de la cesta a ese plato. Se acierta cuando la cesta queda vacía y todos los platos tienen lo mismo. Dar a un plato más de lo que le toca SHALL contar como fallo y la galleta SHALL volver a la cesta. La pista de Lalo SHALL repartir una vuelta de galletas transparentes, una a cada plato, que luego vuelven a la cesta.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «Reparte las galletas»
- **THEN** ve 2 platos y una cesta con 2, 4 o 6 galletas, y acierta cuando cada plato tiene la mitad

#### Scenario: Medianos
- **WHEN** a un perfil de 5 años le sale «Reparte las galletas»
- **THEN** ve 2 o 3 platos y como mucho 12 galletas, siempre un número que se reparte sin que sobre ninguna

#### Scenario: Mayores con sobras
- **WHEN** a un perfil de 8 años le salen 3 platos y 11 galletas
- **THEN** ve también el tarro de Lalo, y acierta cuando cada plato tiene 3 galletas y las 2 que sobran están en el tarro

#### Scenario: Tarro antes de tiempo
- **WHEN** un perfil de 8 años toca el tarro de Lalo cuando aún se puede dar otra vuelta completa a los platos
- **THEN** cuenta como fallo y la galleta vuelve a la cesta

#### Scenario: Plato lleno
- **WHEN** el niño toca un plato que ya tiene lo que le toca
- **THEN** la galleta rebota y vuelve a la cesta, cuenta como fallo y las galletas ya repartidas siguen en sus platos

#### Scenario: Pista de reparto
- **WHEN** el niño falla dos veces en la misma pregunta
- **THEN** Lalo reparte una vuelta de galletas transparentes, una a cada plato, que vuelven a la cesta sin cambiar lo que ya había repartido

### Requirement: Prueba «De pequeño a grande»
Se ven varios elementos sueltos y hay que tocarlos en orden; cada uno salta a su sitio en una fila. El pictograma de la consigna, una escalera que sube o que baja, indica si se ordena de pequeño a grande o de grande a pequeño. Tocar uno fuera de orden SHALL contar como fallo y los ya colocados SHALL seguir en su sitio. La pista de Lalo SHALL poner juntos el que toca y otro de los que quedan, para compararlos.

#### Scenario: Pequeños
- **WHEN** a un perfil de 3 años le sale «De pequeño a grande»
- **THEN** ve 3 dibujos iguales de tamaños muy distintos y la escalera que sube, y acierta tocándolos del más pequeño al más grande

#### Scenario: Medianos al revés
- **WHEN** a un perfil de 6 años le sale una pregunta con la escalera que baja
- **THEN** ve 4 dibujos de distinto tamaño y acierta tocándolos del más grande al más pequeño

#### Scenario: Mayores con números
- **WHEN** a un perfil de 7 años le sale «De pequeño a grande»
- **THEN** ve 5 tarjetas del mismo tamaño con cifras distintas del 1 al 20, y acierta tocándolas de menor a mayor o de mayor a menor según la escalera

#### Scenario: Tamaño claro
- **WHEN** se generan preguntas de dibujos para cualquier franja
- **THEN** dos dibujos seguidos en el orden correcto se diferencian claramente de tamaño a simple vista en un móvil de 844×390, y el tamaño no depende del color

#### Scenario: Fuera de orden
- **WHEN** el niño ha colocado dos elementos y toca uno que no es el siguiente
- **THEN** el elemento rebota, cuenta como fallo y los dos colocados siguen en la fila

### Requirement: Prueba «El teleférico»
Llega una cabina con pasajeros (erizos, abejas o caracoles). Se ve cómo suben o bajan otros, de uno en uno; luego se cierra la puerta, la cabina deja de verse por dentro y se toca cuántos hay ahora. Mientras dura la escena no se puede responder, y tocar a Lalo la repite. La pista de Lalo SHALL volver transparente la cabina, enseñar cuántos había al principio y seguir contando desde ahí los que suben, o descontando los que bajan.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «El teleférico»
- **THEN** solo suben pasajeros, hay como mucho 4 al final y las 3 respuestas son puntos de dado

#### Scenario: Medianos
- **WHEN** a un perfil de 5 años le sale «El teleférico»
- **THEN** solo suben pasajeros, hay como mucho 10 al final y las 3 respuestas son cifras

#### Scenario: Mayores en dos pasos
- **WHEN** a un perfil de 8 años le sale una pregunta en la que primero suben y luego bajan pasajeros
- **THEN** ve los dos pasos de uno en uno, nunca hay más de 20 ni menos de 0 pasajeros, y elige entre 4 respuestas en cifras

#### Scenario: No se cuenta mirando
- **WHEN** termina la escena y se puede responder
- **THEN** la puerta está cerrada y los pasajeros no se ven, hasta que Lalo da la pista o enseña la respuesta

#### Scenario: Pista de seguir contando
- **WHEN** el niño falla dos veces una pregunta en la que había 5 pasajeros y suben 3
- **THEN** la cabina se vuelve transparente, sobre ella aparece el 5 y los 3 que subieron se iluminan uno a uno mientras el número pasa a 6, 7 y 8

### Requirement: Prueba «Huellas en la nieve»
Se ve una cuadrícula nevada con Rufo en una casilla y una tira de flechas grandes. Hay que averiguar adónde llega Rufo si da un paso por cada flecha, en orden. Ninguna tira SHALL sacar a Rufo de la cuadrícula. Al acertar, Rufo SHALL recorrer el camino dejando huellas. La pista de Lalo SHALL hacer que un Rufo transparente siga la primera mitad de las flechas, dejando huellas; en la franja de mayores, SHALL apagar una tira incorrecta.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «Huellas en la nieve»
- **THEN** ve una cuadrícula de 3×3, una tira de 1 o 2 flechas y 3 casillas con un dibujo (pino, muñeco de nieve, iglú), y acierta tocando el dibujo de la casilla a la que llega Rufo

#### Scenario: Medianos
- **WHEN** a un perfil de 6 años le sale «Huellas en la nieve»
- **THEN** ve una cuadrícula de 4×4 y una tira de 3 o 4 flechas en las cuatro direcciones, y acierta tocando la casilla a la que llega Rufo

#### Scenario: Mayores eligen el camino
- **WHEN** a un perfil de 7 años le sale «Huellas en la nieve»
- **THEN** ve en la cuadrícula a Rufo y una fresa, y 3 tiras de 4 a 6 flechas, de las que solo una lleva a Rufo hasta la fresa

#### Scenario: Casilla equivocada
- **WHEN** un perfil de 6 años toca una casilla a la que no llega Rufo
- **THEN** la casilla rebota, cuenta como fallo y la pregunta sigue

#### Scenario: Casillas que se tocan bien
- **WHEN** aparece la cuadrícula de 4×4 en un móvil de 844×390
- **THEN** cada casilla mide al menos 44 px de lado en pantalla y la tira de flechas se ve entera, sin taparse con la cuadrícula ni con Lalo

### Requirement: Prueba «La balanza»
Se ve una balanza de mercado con dos platillos, sujeta en equilibrio. Según la franja, hay que tocar el platillo que bajará o cuántas galletas faltan para equilibrarla. Al acertar, la balanza SHALL soltarse y moverse para mostrar el resultado. La pista de Lalo SHALL depender de la franja: sopesar los dos objetos, emparejar las galletas de los dos platillos, o cambiar cada fresa por sus galletas.

#### Scenario: Pequeños
- **WHEN** a un perfil de 4 años le sale «La balanza»
- **THEN** ve en un platillo un objeto pesado (sandía, piedra o calabaza) y en el otro uno ligero (pluma, hoja o fresa), y acierta tocando el platillo del pesado

#### Scenario: Pista de sopesar
- **WHEN** un perfil de 4 años falla dos veces la pregunta de la balanza
- **THEN** Lalo coge un objeto con cada ala y baja del lado del objeto pesado

#### Scenario: Medianos
- **WHEN** a un perfil de 6 años le sale «La balanza»
- **THEN** ve galletas en los dos platillos, de 1 a 9 en cada uno y nunca iguales, con un hueco en el platillo con menos, y elige entre 3 cifras cuántas galletas faltan para equilibrarla

#### Scenario: Pista de emparejar
- **WHEN** un perfil de 6 años falla dos veces la pregunta de las galletas
- **THEN** Lalo une con líneas, de una en una, las galletas de un platillo con las del otro, y brillan los huecos que quedan sin pareja

#### Scenario: Mayores con equivalencias
- **WHEN** a un perfil de 8 años le sale «La balanza»
- **THEN** ve arriba una balanza modelo equilibrada con 1 fresa en un lado y de 2 a 4 galletas en el otro, y debajo una balanza con 2 o 3 fresas, y elige entre 4 cifras cuántas galletas la equilibran, nunca más de 12

#### Scenario: Pista de cambiar fresas
- **WHEN** un perfil de 8 años falla dos veces la pregunta de las fresas
- **THEN** Lalo cambia cada fresa de la balanza por las galletas que vale según la balanza modelo, y luego vuelven a ser fresas

### Requirement: Prueba «La otra mitad»
Se ve la mitad de un dibujo junto a una línea de espejo, y hay que completar la otra mitad. Los dibujos SHALL ser simétricos y propios del juego (mariposa, cometa, la cara de Lalo, casita, flor, pez), y las opciones SHALL distinguirse por la forma, no solo por el color. La pista de Lalo SHALL doblar el dibujo por la línea y mostrar en transparente la mitad reflejada.

#### Scenario: Pequeños
- **WHEN** a un perfil de 3 años le sale «La otra mitad»
- **THEN** ve la mitad de un dibujo y 3 mitades para elegir; la correcta es la reflejada y las otras dos son mitades de dibujos distintos

#### Scenario: Medianos con trampa
- **WHEN** a un perfil de 5 años le sale «La otra mitad»
- **THEN** entre las 3 mitades está la reflejada, la misma mitad sin reflejar y otra con un detalle distinto, y solo la reflejada es correcta

#### Scenario: Mayores en cuadrícula
- **WHEN** a un perfil de 7 años le sale «La otra mitad»
- **THEN** ve una cuadrícula de 4 filas y 6 columnas con la línea de espejo en medio y algunas casillas pintadas a la izquierda, y tiene que tocar todas las casillas de la derecha que las reflejan

#### Scenario: Casilla de más
- **WHEN** un perfil de 7 años toca una casilla de la derecha que no refleja ninguna pintada
- **THEN** cuenta como fallo, las casillas ya bien tocadas siguen pintadas, y la pregunta cuenta como acertada al pintar todas si ha tenido menos de 3 fallos

#### Scenario: Pintado sin color
- **WHEN** se ven las casillas pintadas en una pantalla en escala de grises
- **THEN** se distinguen de las vacías porque llevan relleno y un dibujo, no solo un color

#### Scenario: Pista de doblar
- **WHEN** el niño falla dos veces una pregunta de «La otra mitad»
- **THEN** la mitad dibujada se dobla por la línea como una hoja de papel y se queda en transparente sobre el lado donde va la respuesta
