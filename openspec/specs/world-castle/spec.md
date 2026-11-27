# world-castle Specification

## Purpose

Cerrar cada mundo con un castillo: una parada final del mapa que junta retos del recorrido y preguntas de la bandera y que siempre da la medalla del mundo, sin notas. La misma pieza sirve para cualquier mundo.

## Requirements

### Requirement: Castillo con una lista de retos
Un mundo MAY tener un castillo, definido como una lista de retos: retos del recorrido o preguntas de la bandera. Los retos del recorrido SHALL jugarse seguidos en un recorrido corto sin bloques, pinchos ni enemigos y sin demostración de Lalo, con el castillo tras la bandera. Un castillo solo con preguntas SHALL tener un recorrido corto hasta la bandera.

#### Scenario: Retos del recorrido seguidos
- **WHEN** se juega un castillo con los retos contar, puente y barca
- **THEN** aparecen en ese orden con suelo llano entre ellos, sin enemigos ni bloques

#### Scenario: Castillo solo con preguntas
- **WHEN** se juega un castillo sin retos del recorrido
- **THEN** el zorro llega a la bandera tras una carrera corta

### Requirement: Preguntas del castillo
Al llegar a la bandera del castillo SHALL hacerse una pregunta por cada paso de preguntas, elegida entre las pruebas del paso y distinta de las demás mientras se pueda, cada una con su dibujo y su texto para el adulto.

#### Scenario: Preguntas en la bandera
- **WHEN** el niño llega a la bandera de un castillo con dos pasos de preguntas
- **THEN** se le hacen dos preguntas de pruebas distintas, con dos marcas de progreso y el castillo en lugar del dibujo de la prueba

### Requirement: Siempre da la medalla
Terminar el castillo SHALL dar siempre la medalla del mundo, sin estrellas, también si todos los retos y preguntas los resolvió Lalo. La medalla SHALL guardarse en el perfil y no perderse al volver a jugar el castillo.

#### Scenario: Todo resuelto por Lalo
- **WHEN** el niño falla todas las preguntas del castillo
- **THEN** la pantalla final muestra la medalla y el mundo queda con ella

#### Scenario: Volver a jugarlo
- **WHEN** el niño repite un castillo con la medalla ya ganada
- **THEN** al terminarlo sigue teniendo la medalla

### Requirement: Castillo del río
El castillo del río SHALL tener 5 retos: uno de cada mecánica del recorrido (contar, puente y barca) y dos preguntas de las pruebas de la bandera del río, de las que no hay que memorizar cartas.

#### Scenario: Retos del castillo del río
- **WHEN** se juega el castillo del río
- **THEN** se cruzan un reto de contar, un puente y una barca, y en la bandera hay dos preguntas de pruebas del río distintas

### Requirement: Castillo del arcoíris
El castillo del mundo 1 SHALL ser un recorrido corto por las nubes, sin retos, con 5 preguntas en la bandera: una de contar, una de comparar, una de serie, una de repartir y una de balanza.

#### Scenario: Preguntas del castillo del arcoíris
- **WHEN** se juega el castillo del arcoíris y se llega a la bandera
- **THEN** se hacen 5 preguntas, una de cada una de esas pruebas, con cinco marcas de progreso

#### Scenario: Medalla del arcoíris
- **WHEN** el niño termina el castillo del arcoíris, aunque Lalo resuelva todas las preguntas
- **THEN** gana la medalla del arcoíris
