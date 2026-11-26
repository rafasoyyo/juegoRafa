## ADDED Requirements

### Requirement: Estrellas por retos
En los mundos que cuentan las estrellas por retos, las estrellas SHALL depender de la proporción de retos del recorrido acertados a la primera, sin contar los de demostración: 3 con el 75 % o más, 2 con el 40 % o más y 1 en el resto. Ni los bloques «?» ni la prueba de la bandera SHALL cambiar las estrellas en esos mundos. Los demás mundos SHALL seguir con la regla de los bloques «?».

#### Scenario: Tres de cuatro
- **WHEN** en el río el niño acierta a la primera 3 de 4 retos
- **THEN** la tarjeta muestra 3 estrellas

#### Scenario: Ninguno a la primera
- **WHEN** en el río el niño no acierta ningún reto a la primera
- **THEN** la tarjeta muestra 1 estrella

#### Scenario: El mundo 1 no cambia
- **WHEN** el niño termina un nivel del mundo de los números golpeando todos los bloques «?»
- **THEN** la tarjeta muestra 3 estrellas, como antes
