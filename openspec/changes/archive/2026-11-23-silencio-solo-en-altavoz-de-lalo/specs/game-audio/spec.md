## MODIFIED Requirements

### Requirement: Silencio total recordado
El juego SHALL ofrecer un silencio total que calla a la vez la música y todos los efectos, y se
SHALL activar y quitar únicamente con el altavoz de Lalo. La elección SHALL recordarse en el
dispositivo al recargar o reabrir la aplicación y SHALL NOT guardarse fuera de él.

#### Scenario: Silenciar
- **WHEN** el niño o un adulto toca el altavoz de Lalo con el sonido activo
- **THEN** dejan de oírse la música y los efectos de inmediato

#### Scenario: Reabrir en silencio
- **WHEN** se reabre la aplicación después de haberla dejado en silencio
- **THEN** el juego sigue en silencio también tras el primer toque

#### Scenario: Quitar el silencio
- **WHEN** se toca el altavoz tachado de Lalo en el mapa
- **THEN** vuelve a sonar la melodía del mapa y los efectos

#### Scenario: Silenciar dentro de un nivel
- **WHEN** el niño toca el altavoz de Lalo durante un nivel
- **THEN** se callan la música del nivel y los efectos sin pausar el juego
