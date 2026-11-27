## ADDED Requirements

### Requirement: Final del arcoíris
Al abrirse el mapa del mundo de los números con sus 12 niveles hechos o pendientes, si el perfil no ha visto el final, el mapa SHALL mostrarlo, sin texto y después de pintarse el gajo 12 si es nuevo: Rufo salta de alegría sobre el nivel 12, la nube de la cima llueve sobre la montaña nevada y una gota baja al manantial, del que nace el río. El final SHALL verse una sola vez por perfil y quedar guardado.

#### Scenario: Terminar el nivel 12
- **WHEN** un perfil termina el nivel 12 por primera vez y vuelve al mapa
- **THEN** se pinta el gajo 12 y después se ve la lluvia sobre la montaña y el nacimiento del río

#### Scenario: No se repite
- **WHEN** el perfil vuelve al mapa otra vez, o tras recargar la aplicación
- **THEN** no se ve el final

### Requirement: El río se abre en el final
Para un perfil de menos de 6 años, al acabar el final el botón del río SHALL perder su candado con una animación y quedar abierto. Para un perfil de 6 años o más, el final SHALL verse sin animación del botón, porque el río ya estaba abierto.

#### Scenario: Perfil de 5 años
- **WHEN** un perfil de 5 años ve el final
- **THEN** el botón del río empieza con candado y, al acabar el final, el candado salta y el botón queda abierto

#### Scenario: Perfil de 6 años
- **WHEN** un perfil de 6 años ve el final
- **THEN** ve la lluvia y el manantial y el botón del río no cambia

### Requirement: Saltar el final
Un toque en la pantalla durante el final SHALL acabarlo al instante, con el río abierto si le corresponde, sin abrir ningún nivel ni otro mundo.

#### Scenario: Toque
- **WHEN** el niño toca la pantalla durante la lluvia
- **THEN** el final acaba, el mapa queda como siempre y el río abierto, y no se abre nada
