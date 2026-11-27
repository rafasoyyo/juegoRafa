# performance Specification

## Purpose
Fijar las reglas de rendimiento que todas las escenas, mundos y retos del juego deben cumplir para que se juegue fluido en tablets y móviles antiguos, y cómo se comprueban.

## Requirements

### Requirement: Presupuesto por fotograma
Cada nivel SHALL caber en el presupuesto de un fotograma a 60 Hz con margen. Medido en Chromium a
844×390 con la CPU frenada 4 veces, mientras el zorro corre y salta durante 4 s, la media del tiempo
de lógica más el de dibujo por fotograma SHALL ser de 20 ms o menos, y el percentil 95 SHALL ser de
33 ms o menos, en todos los niveles de todos los mundos.

#### Scenario: Nivel más cargado
- **WHEN** se mide así el nivel con más escenario y retos de cada mundo
- **THEN** la media de lógica más dibujo no pasa de 20 ms y el percentil 95 no pasa de 33 ms

#### Scenario: Mundo nuevo
- **WHEN** se añade un mundo o un reto nuevo
- **THEN** se mide al menos su nivel más largo y cumple el mismo presupuesto antes de fusionarlo

### Requirement: Escenario estático sin coste por fotograma
Todo lo que no cambia de forma durante un nivel (suelo, fosos, colinas, agua, escalones,
plataformas, placas de los pinchos, carteles, tablas y demás piezas fijas de los retos) SHALL
dibujarse una sola vez al crear la escena y SHALL mostrarse después como imagen. Solo MAY volver a
trazarse en cada fotograma lo que cambia de forma con el juego, y SHALL ser pequeño (las piernas del
zorro, la barra de progreso al avanzar, el contador de galletas al cambiar).

#### Scenario: Escenario de nubes o nieve
- **WHEN** se abre un nivel con suelo de bultos (nubes o nieve)
- **THEN** el coste de dibujo por fotograma es parecido al de un nivel de prado, no proporcional al número de bultos

#### Scenario: Aspecto
- **WHEN** se compara una captura del escenario dibujado una vez con la del mismo escenario trazado en cada fotograma
- **THEN** se ven iguales

### Requirement: Bucle del nivel sin crecimiento
Mientras se juega un nivel, el número de objetos de la escena SHALL mantenerse estable: los efectos
que se repiten (polvo, destellos, galletas que saltan) SHALL reutilizar objetos o destruirse al
acabar, y la lógica de cada fotograma SHALL evitar crear listas u objetos nuevos cuando no hace falta.

#### Scenario: Correr un minuto
- **WHEN** el zorro corre y salta un minuto sin golpear bloques ni tocar enemigos
- **THEN** el número de objetos de la escena al final es el mismo que al principio

### Requirement: Texturas acotadas y liberadas
Ninguna textura creada en el juego SHALL medir más de 2048 px de lado, para que funcione en tablets
antiguas. Las texturas creadas para un nivel SHALL liberarse al salir de él.

#### Scenario: Nivel muy largo
- **WHEN** se abre un nivel de más de 19.000 px de ancho
- **THEN** su escenario se reparte en texturas de 2048 px de ancho como mucho

#### Scenario: Entrar y salir muchas veces
- **WHEN** se entra en varios niveles seguidos una y otra vez
- **THEN** el número de texturas en memoria no crece de una vuelta a otra

### Requirement: Música sin cortes al cargar
La música SHALL programarse con al menos 0,25 s de margen, para que crear una escena en una tablet
lenta no la corte. Ninguna escena SHALL bloquear el juego más de ese margen al crearse.

#### Scenario: Entrar en un nivel
- **WHEN** se entra en un nivel con la música sonando, con la CPU frenada 4 veces
- **THEN** la música del nivel empieza sin silencios ni notas cortadas

### Requirement: Movimiento igual a cualquier frecuencia de pantalla
El movimiento del zorro, la altura de sus saltos y el ritmo de los enemigos SHALL ser los mismos en
pantallas de 60, 90 y 120 Hz, sin tirones por desajuste entre la física y el dibujo. Las
posiciones SHALL dibujarse sin redondear a píxeles enteros del juego, porque el lienzo se estira a la
pantalla y el redondeo daría pasos desiguales.

#### Scenario: Pantalla de 120 Hz
- **WHEN** se juega en una pantalla de 120 Hz
- **THEN** el zorro corre y salta igual que a 60 Hz y el desplazamiento se ve continuo
