# Spec Delta

## ADDED Requirements

### Requirement: Arcoíris en el horizonte
Cada nivel del 1 al 12 SHALL mostrar un arcoíris lejano a la derecha del fondo, hacia donde corre Rufo, como meta que se ve sin leer. Su tamaño SHALL crecer con el número del nivel. En el nivel 12 SHALL ser el arcoíris del escenario de nubes y el mayor de todos. El arcoíris SHALL verse sin texto, sin voz y sin que el niño haga nada.

#### Scenario: Arcoíris pequeño al empezar
- **WHEN** se abre el nivel 1 en un móvil de 844×390
- **THEN** se ve un arcoíris pequeño a la derecha, casi en el horizonte, sin que ningún elemento del recorrido lo tape del todo

#### Scenario: Crece de un nivel al siguiente
- **WHEN** se comparan los niveles 1 a 11 en orden
- **THEN** el arcoíris de cada nivel es más grande que el del anterior, y en el 11 ocupa más o menos medio cielo

#### Scenario: Montaña
- **WHEN** se abre el nivel 9
- **THEN** el arcoíris asoma por detrás de los picos nevados del fondo

#### Scenario: Bajo el arco en las nubes
- **WHEN** se abre el nivel 12
- **THEN** se ve un solo arcoíris, el más grande del mundo, y Rufo corre por las nubes bajo el arco

#### Scenario: Visible durante todo el nivel
- **WHEN** Rufo corre desde la salida hasta la bandera de cualquier nivel en un móvil de 844×390
- **THEN** el arcoíris se desplaza muy despacio y sigue a la vista en la pantalla hasta llegar a la bandera

### Requirement: Arcoíris tenue de noche
En el nivel 6, con el ambiente de noche, el arcoíris del horizonte SHALL verse a media opacidad, como un arcoíris de luna, sin tapar la luna ni las estrellas de forma que dejen de reconocerse.

#### Scenario: Arcoíris de luna
- **WHEN** se abre el nivel 6 en un móvil de 844×390
- **THEN** el arcoíris se ve más tenue que en los niveles 5 y 7, y la luna y las estrellas se siguen reconociendo

### Requirement: El arcoíris no estorba el recorrido
El arcoíris del horizonte SHALL ser la capa más lejana del fondo, por detrás de las nubes, las colinas, la decoración y el suelo, más apagado que el recorrido. Nunca SHALL tapar al zorro, los bloques «?», las plataformas, los escalones, los enemigos, los pinchos ni la bandera, ni parecer algo en lo que se pueda subir.

#### Scenario: Bloque delante del arcoíris
- **WHEN** un bloque «?» o un enemigo pasa por delante del arcoíris en cualquier nivel
- **THEN** el bloque o el enemigo se ve entero por delante y se distingue claramente del arcoíris

#### Scenario: Zorro que salta hacia el arcoíris
- **WHEN** el zorro salta a la altura del arcoíris
- **THEN** lo atraviesa por delante sin chocar ni apoyarse en él
