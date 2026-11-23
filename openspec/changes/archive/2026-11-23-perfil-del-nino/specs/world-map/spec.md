## MODIFIED Requirements

### Requirement: Pantalla de inicio
Al abrir la aplicación el juego SHALL mostrar una pantalla con el zorro y un botón grande de jugar, y
SHALL pasar al primer toque en cualquier punto de la pantalla a la pantalla de perfil (elegir o crear
el perfil del niño); una vez elegido o creado el perfil, SHALL abrir el mapa con su progreso.

#### Scenario: Primer toque
- **WHEN** el niño toca la pantalla de inicio
- **THEN** se abre la pantalla de perfil y, desde ese momento, el juego puede reproducir sonido también en iOS

#### Scenario: Del perfil al mapa
- **WHEN** el niño elige un perfil guardado o acepta uno nuevo
- **THEN** se abre el mapa del mundo con el progreso de ese perfil
