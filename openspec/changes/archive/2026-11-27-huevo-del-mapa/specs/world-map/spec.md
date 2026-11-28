## ADDED Requirements

### Requirement: Huevo de manchas de la isla
El mapa de la isla SHALL mostrar arriba un huevo con 12 manchas, una por nivel, que siguen un patrón (por filas de abajo arriba y con los colores en serie). La mancha de un nivel SHALL estar pintada cuando el nivel está hecho o pendiente. Al volver al mapa con una mancha nueva, la cámara SHALL ir al huevo, la mancha SHALL aparecer creciendo con una nota y destellos y después Rufo SHALL saltar al nivel siguiente; un toque SHALL acabar la animación. Abrir un perfil con progreso SHALL NOT animar manchas ya pintadas.

#### Scenario: Mancha nueva
- **WHEN** el niño termina el nivel 3 de la isla con estrellas y vuelve al mapa
- **THEN** la tercera mancha del huevo aparece creciendo y Rufo salta al nivel 4

### Requirement: Final de la isla
Al volver al mapa con todos los niveles de la isla hechos o pendientes, una vez por perfil, Rufo SHALL saltar de alegría y SHALL verse una viñeta sin texto: el huevo con sus 12 manchas en el nido del cráter, la mamá dinosaurio que se asoma, el huevo que se mueve, se raja y se abre, y un bebé que da un saltito. Un toque SHALL saltarla. Mientras no exista el mundo 4, el final SHALL acabar ahí.

#### Scenario: Se ve una vez
- **WHEN** un perfil que ya vio el final de la isla vuelve a abrir su mapa
- **THEN** el mapa se abre sin la viñeta
