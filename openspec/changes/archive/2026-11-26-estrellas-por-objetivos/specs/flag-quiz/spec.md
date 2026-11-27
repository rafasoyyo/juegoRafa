## ADDED Requirements

### Requirement: Los aciertos de la prueba dan estrellas
La prueba SHALL contar sus preguntas acertadas, con cualquier número de intentos, y pasarlas a la pantalla final: acertar al menos 1 SHALL dar una estrella y acertar las 3 SHALL ser condición para las 3 estrellas (ver `level-complete`). La prueba SHALL NOT sumar ni quitar galletas.

#### Scenario: Una pregunta acertada
- **WHEN** el niño acierta solo la segunda pregunta y llega con menos de la mitad de las galletas
- **THEN** la pantalla final muestra 1 estrella

#### Scenario: Ninguna acertada
- **WHEN** el niño no acierta ninguna pregunta y llega con menos de la mitad de las galletas
- **THEN** se abre la pantalla de ánimo sin estrellas

## REMOVED Requirements

### Requirement: Prueba superada con dos de tres
**Reason**: La prueba ya no se aprueba ni se suspende: sus aciertos entran en las estrellas.
**Migration**: ver «Los aciertos de la prueba dan estrellas» y `level-complete`.

### Requirement: La prueba no da estrellas
**Reason**: Ahora la prueba da estrellas.
**Migration**: ver «Los aciertos de la prueba dan estrellas».
