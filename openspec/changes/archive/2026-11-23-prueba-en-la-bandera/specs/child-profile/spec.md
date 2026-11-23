# Spec Delta

## MODIFIED Requirements

### Requirement: Guardado automático del progreso
El juego SHALL guardar en el navegador, bajo el id del perfil activo, las estrellas de cada nivel, los niveles pendientes (los que se jugaron sin superar su prueba), las galletas, los gorros comprados y el gorro puesto, sin que el niño pulse nada: al terminar la prueba de un nivel, al completar un nivel y al comprar o ponerse un gorro. Un perfil nuevo SHALL empezar sin niveles hechos ni pendientes, con 0 galletas y el gorro inicial. El progreso guardado antes de existir las pruebas SHALL conservarse: sus niveles hechos siguen hechos.

#### Scenario: Cerrar y volver
- **WHEN** el niño completa el nivel 1 con 2 estrellas, cierra la pestaña y vuelve a abrir el juego con su perfil
- **THEN** el nivel 1 aparece hecho con 2 estrellas y el 2 es el actual

#### Scenario: Pendiente guardado
- **WHEN** el niño no supera la prueba del nivel 1, cierra la pestaña y vuelve con su perfil
- **THEN** el nivel 1 aparece pendiente, el 2 es el actual y las galletas de ese nivel siguen sumadas

#### Scenario: Progreso anterior a las pruebas
- **WHEN** un perfil guardado antes de este cambio tenía los niveles 1 y 2 hechos
- **THEN** al abrirlo, los niveles 1 y 2 siguen hechos con sus estrellas y el 3 es el actual

#### Scenario: Comprar un gorro
- **WHEN** el niño compra un gorro y recarga la página
- **THEN** al volver con su perfil sigue teniendo el gorro, puesto, y las galletas restantes

#### Scenario: Mejor puntuación
- **WHEN** el niño repite un nivel y saca menos estrellas que antes
- **THEN** se conserva la mejor puntuación guardada
