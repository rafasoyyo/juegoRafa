## ADDED Requirements

### Requirement: Progreso guardado por mundo
El progreso de los niveles (estrellas y pendientes) SHALL guardarse por mundo, mientras que las galletas y los gorros SHALL ser del perfil y compartirse entre mundos. El progreso de un perfil guardado antes de haber varios mundos SHALL pasar entero al mundo de los números, con sus estrellas, sus pendientes y sus galletas. El progreso de un mundo que la aplicación no conoce SHALL conservarse al guardar.

#### Scenario: Perfil guardado con un solo mundo
- **WHEN** se abre un perfil guardado antes de este cambio con los niveles 1 y 2 hechos con 3 y 2 estrellas, el 3 pendiente y 14 galletas
- **THEN** en el mundo de los números los niveles 1 y 2 siguen hechos con 3 y 2 estrellas, el 3 pendiente, y el perfil tiene 14 galletas

#### Scenario: Galletas compartidas
- **WHEN** el niño gana 5 galletas en el río
- **THEN** el contador del mapa de los números también las suma

#### Scenario: Mundo desconocido
- **WHEN** se abre con una versión anterior de la aplicación un perfil que tiene progreso en un mundo que esa versión no conoce, y se guarda
- **THEN** el progreso de ese mundo sigue guardado
