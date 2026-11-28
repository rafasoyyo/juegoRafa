## ADDED Requirements

### Requirement: La rana del río
La rana SHALL saltar en el sitio con un ritmo fijo y SHALL agacharse durante al menos 400 ms antes de cada salto, para que se vea venir. En lo alto del salto el zorro SHALL poder pasar andando por debajo sin tocarla; quieta, SHALL poder saltarse por encima. Es un gráfico propio en el estilo del juego, anotado en el registro de licencias.

#### Scenario: Pasar por debajo
- **WHEN** el zorro pasa andando bajo la rana mientras está en el aire
- **THEN** no la toca y no pierde galletas

#### Scenario: El aviso
- **WHEN** la rana va a saltar
- **THEN** antes se agacha, aplastándose, y tiembla un poco

### Requirement: El cangrejo del río
El cangrejo SHALL andar de lado, sin darse la vuelta, de ida y vuelta por un tramo de suelo de 200 px como mucho y más despacio que el erizo. Es un gráfico propio en el estilo del juego, anotado en el registro de licencias.

#### Scenario: Ver un cangrejo
- **WHEN** aparece un cangrejo en un móvil horizontal de 844×390
- **THEN** se reconoce como un cangrejo rojo con pinzas y ojos amables que anda de lado despacio

### Requirement: Tipos de enemigo por mundo
Cada mundo SHALL decir qué tipos de enemigo salen y desde qué nivel, y cada enemigo SHALL elegirse al azar entre los tipos que ya han llegado. En el mundo 1 salen el erizo desde el nivel 1 y la abeja desde el 2. En el río salen el erizo y la abeja como en el mundo 1, la rana desde el nivel 3 y el cangrejo desde el 7. Ningún enemigo SHALL colocarse en la zona de un reto del recorrido ni a menos del margen de seguridad.

#### Scenario: Nivel 3 del río
- **WHEN** se abre muchas veces el nivel 3 del río
- **THEN** salen erizos, abejas y ranas, nunca cangrejos, y ninguno junto a un reto

#### Scenario: El mundo 1 no cambia
- **WHEN** se abre el nivel 1 del mundo 1
- **THEN** salen solo erizos, como antes

## MODIFIED Requirements

### Requirement: Enemigos originales y amables
Los enemigos SHALL ser un erizo de pinchos y una abeja zumbona y, en el río, también una rana y un cangrejo: gráficos propios en el estilo vectorial plano y redondeado del juego, sin contornos negros, con cara simpática y sin parecido con personajes de terceros. Cada gráfico SHALL figurar en el registro de licencias como propio del proyecto.

#### Scenario: Ver un erizo
- **WHEN** aparece un erizo en un móvil horizontal de 844×390
- **THEN** se reconoce como un erizo marrón con pinchos redondeados en el lomo, cara clara, nariz y ojos amables, sin ninguna palabra

#### Scenario: Ver una abeja
- **WHEN** aparece una abeja en un móvil horizontal de 844×390
- **THEN** se reconoce como una abeja con rayas amarillas y oscuras y alas claras que aletean

#### Scenario: Licencia de los gráficos
- **WHEN** se revisa el registro de licencias del repositorio
- **THEN** los gráficos del erizo, la abeja, la rana y el cangrejo aparecen como propios del proyecto
