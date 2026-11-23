# mascot-guide Specification

## Purpose
Presentar a Lalo el búho como guía del niño: un personaje fijo que acompaña las pantallas y que, a
partir de la fase 2, dará las consignas y las pistas con voz.

## Requirements

### Requirement: Lalo visible en el nivel y en el mapa
El nivel y el mapa SHALL mostrar a Lalo el búho arriba a la izquierda, bajo la barra superior, con un
botón de altavoz al lado en lugar de un bocadillo de texto.

#### Scenario: Abrir un nivel
- **WHEN** se abre un nivel
- **THEN** Lalo aparece arriba a la izquierda con un botón de altavoz y sin texto

### Requirement: Lalo reacciona al tocarlo
Tocar a Lalo SHALL hacer que dé un pequeño salto y parpadee, sin cambiar el sonido. Tocar su
altavoz SHALL, además de la misma reacción, alternar el silencio total del juego. Mientras no haya
voces (fase 2) el altavoz SHALL NOT hacer nada más, ni abrir nada.

#### Scenario: Tocar a Lalo
- **WHEN** el niño toca al búho
- **THEN** Lalo salta y parpadea y el sonido no cambia

#### Scenario: Tocar el altavoz sin voces
- **WHEN** el niño toca el altavoz de Lalo con el sonido activo
- **THEN** el juego se calla, Lalo salta y parpadea y el juego sigue sin pausa

### Requirement: Lalo no estorba
Lalo y su altavoz SHALL NOT solaparse con las zonas de los botones de movimiento ni de salto, y SHALL
NOT tener colisión con el zorro.

#### Scenario: Controles libres
- **WHEN** el niño mantiene pulsado un botón de movimiento y pulsa saltar
- **THEN** los controles responden igual que sin Lalo en pantalla

### Requirement: El altavoz de Lalo muestra el estado del sonido
El altavoz de Lalo SHALL verse como altavoz normal con el sonido activo y como altavoz tachado en
silencio, sin depender solo del color. El estado mostrado SHALL coincidir con el real al abrir cada
pantalla, también tras reabrir la aplicación o cambiar de pantalla.

#### Scenario: Volver a activar el sonido
- **WHEN** el niño toca el altavoz tachado de Lalo
- **THEN** vuelve a sonar la música de la pantalla y el icono pasa a altavoz normal

#### Scenario: Cambiar de pantalla en silencio
- **WHEN** el juego está en silencio y el niño pasa del mapa a un nivel
- **THEN** el altavoz de Lalo del nivel aparece tachado y sigue sin sonar nada

#### Scenario: Reabrir en silencio
- **WHEN** se reabre la aplicación tras haberla dejado en silencio
- **THEN** el altavoz de Lalo aparece tachado desde el primer momento

### Requirement: El altavoz de Lalo es el único control de sonido
El altavoz de Lalo SHALL ser el único botón que pone o quita el sonido. Ninguna otra pantalla
SHALL ofrecer otro botón de silencio.

#### Scenario: Buscar otro botón de silencio
- **WHEN** el niño recorre el mapa, el nivel, mi personaje y la pantalla de nivel completado
- **THEN** el único control que activa o quita el sonido es el altavoz de Lalo
