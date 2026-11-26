## ADDED Requirements

### Requirement: Escenas de historia vistas
El perfil SHALL guardar qué escenas de historia ha visto (el prólogo de un mundo), solo como una marca por escena, sin más datos del niño, y una escena vista SHALL NOT volver a aparecer sola. Un perfil guardado antes de este cambio con progreso en el mundo de los números SHALL contar el prólogo como visto.

#### Scenario: Una vez por perfil
- **WHEN** un perfil que ya vio el prólogo vuelve a entrar en el nivel 1
- **THEN** no se ve el prólogo

#### Scenario: Perfil antiguo
- **WHEN** un perfil guardado con el nivel 1 hecho entra en el nivel 1
- **THEN** no se ve el prólogo

#### Scenario: Recarga
- **WHEN** un perfil ve el prólogo, se recarga la aplicación y vuelve a entrar en el nivel 1
- **THEN** no se ve el prólogo
