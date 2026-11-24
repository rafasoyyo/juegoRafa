## MODIFIED Requirements

### Requirement: Los pinchos no pinchan a Rufo invencible
Mientras dura el modo invencible, caer en el foso de una zona de pinchos SHALL NOT restar galletas ni hacer salir ninguna galleta despedida. Como el foso no es suelo, Rufo SHALL rebotar fuera de él igual que en un pinchazo, por el lado por el que entró, y el modo invencible SHALL seguir sin interrumpirse. Si el modo termina con Rufo en el aire sobre un foso, SHALL caer y pincharse con normalidad.

#### Scenario: Correr sobre pinchos
- **WHEN** Rufo invencible corre hacia una zona de pinchos sin saltar y el contador marca 5
- **THEN** cae al foso, rebota fuera por donde entró, el contador sigue en 5 y Rufo sigue brillando

#### Scenario: Saltar el foso con la fresa
- **WHEN** Rufo invencible salta una zona de pinchos
- **THEN** la cruza por el aire como siempre, sin rebotar ni frenar

#### Scenario: Termina sobre los pinchos
- **WHEN** el modo invencible termina mientras Rufo está en el aire sobre un foso
- **THEN** si cae dentro, se pincha y rebota fuera como en cualquier pinchazo
