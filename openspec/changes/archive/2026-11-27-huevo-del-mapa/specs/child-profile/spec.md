## ADDED Requirements

### Requirement: Final de la isla visto
El perfil SHALL guardar que ha visto el final de la isla con la misma marca por escena que el resto de escenas de historia (`final:isla`), independiente del final del mundo 1, y una vez visto SHALL NOT volver a aparecer solo.

#### Scenario: Recarga tras el final
- **WHEN** un perfil ve el final de la isla, se recarga la aplicación y vuelve al mapa de la isla
- **THEN** no se ve el final
