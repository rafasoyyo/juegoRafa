# Spec Delta

## Purpose

Presentar a Lalo el búho como guía del niño: un personaje fijo que acompaña las pantallas y que, a
partir de la fase 2, dará las consignas y las pistas con voz.

## ADDED Requirements

### Requirement: Lalo visible en el nivel y en el mapa
El nivel y el mapa SHALL mostrar a Lalo el búho arriba a la izquierda, bajo la barra superior, con un
botón de altavoz al lado en lugar de un bocadillo de texto.

#### Scenario: Abrir un nivel
- **WHEN** se abre un nivel
- **THEN** Lalo aparece arriba a la izquierda con un botón de altavoz y sin texto

### Requirement: Lalo reacciona al tocarlo
Tocar a Lalo o su altavoz SHALL hacer que Lalo dé un pequeño salto y parpadee. Mientras no haya voces
(fase 2) SHALL NOT sonar nada ni abrir nada.

#### Scenario: Tocar el altavoz sin voces
- **WHEN** el niño toca el altavoz de Lalo
- **THEN** Lalo salta y parpadea, y el juego sigue sin pausa

### Requirement: Lalo no estorba
Lalo y su altavoz SHALL NOT solaparse con las zonas de los botones de movimiento ni de salto, y SHALL
NOT tener colisión con el zorro.

#### Scenario: Controles libres
- **WHEN** el niño mantiene pulsado un botón de movimiento y pulsa saltar
- **THEN** los controles responden igual que sin Lalo en pantalla
