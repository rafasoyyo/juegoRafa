# level-complete Specification

## Purpose
Celebrar el final de cada nivel sin presión: el niño ve cuántas estrellas y galletas ha ganado y elige
con un toque si sigue, repite o vuelve al mapa.

## Requirements

### Requirement: Celebración al completar
Al llegar a la meta el juego SHALL abrir la pantalla de nivel completado, con confeti, el zorro
celebrando con el gorro elegido y una tarjeta central sin texto.

#### Scenario: Llegar a la bandera
- **WHEN** el niño toca la bandera de un nivel
- **THEN** en menos de 2 segundos aparece la pantalla de nivel completado con confeti y el zorro celebrando

### Requirement: Estrellas de 1 a 3
La tarjeta SHALL mostrar 3 estrellas, llenas las ganadas y grises las que faltan, con la central más
grande. Terminar SHALL dar al menos 1 estrella. Hasta que existan retos (fase 2) se gana 1 estrella por
llegar, otra por golpear al menos la mitad de los bloques «?» y otra por golpearlos todos.

#### Scenario: Recorrido sin bloques
- **WHEN** el niño llega a la meta sin golpear ningún bloque «?»
- **THEN** la tarjeta muestra 1 estrella llena y 2 grises

#### Scenario: Todos los bloques
- **WHEN** el niño llega a la meta tras golpear todos los bloques «?»
- **THEN** la tarjeta muestra 3 estrellas llenas

#### Scenario: Mejor resultado
- **WHEN** el niño repite un nivel que ya tenía con 3 estrellas y esta vez consigue 1
- **THEN** el mapa sigue mostrando 3 estrellas en ese nivel

### Requirement: Galletas ganadas
La tarjeta SHALL mostrar las galletas recogidas en el nivel con el icono de la galleta con pepitas de
chocolate y un número, y esas galletas SHALL sumarse al total del niño.

#### Scenario: Suma de galletas
- **WHEN** el niño tenía 5 galletas y termina un nivel recogiendo 4
- **THEN** la tarjeta muestra 4 galletas y el mapa muestra 9

#### Scenario: Nivel sin galletas
- **WHEN** el niño termina un nivel sin golpear ningún bloque «?»
- **THEN** la tarjeta muestra la galleta con el número 0 y su total no cambia

### Requirement: Tres caminos tras la celebración
La pantalla SHALL ofrecer tres botones sin texto: mapa (icono de mapa), siguiente nivel (flecha, el más
grande y en coral) y repetir (flecha circular). En el último nivel del mundo el botón de siguiente SHALL
llevar al mapa.

#### Scenario: Siguiente nivel
- **WHEN** el niño completa el nivel 2 y toca la flecha grande
- **THEN** se abre el nivel 3

#### Scenario: Repetir
- **WHEN** el niño toca la flecha circular
- **THEN** el mismo nivel empieza de nuevo con el contador de galletas del nivel a cero

#### Scenario: Volver al mapa
- **WHEN** el niño toca el icono de mapa
- **THEN** se abre el mapa con el nivel recién completado en estado hecho
