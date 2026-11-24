## MODIFIED Requirements

### Requirement: Efectos de las acciones del zorro
El nivel SHALL tener un efecto de sonido propio para: saltar, golpear un bloque «?» y ganar su
galleta, chocar con un enemigo, caer en una zona de pinchos, que salga la fruta, comer la fruta y que
termine el modo invencible. Los sonidos de chocar con un enemigo y de caer en los pinchos SHALL ser
rebotes suaves y graciosos, distintos entre sí, nunca un sonido de error, castigo o susto, también
cuando el choque resta una galleta.

#### Scenario: Saltar
- **WHEN** el zorro salta
- **THEN** suena el efecto de salto una vez por salto

#### Scenario: Bloque con galleta
- **WHEN** el zorro golpea desde abajo un bloque «?» sin usar
- **THEN** suena el golpe del bloque seguido del tintineo de la galleta

#### Scenario: Bloque ya usado
- **WHEN** el zorro golpea un bloque ya usado
- **THEN** no suena el tintineo de la galleta

#### Scenario: Chocar con un enemigo
- **WHEN** el zorro toca un erizo o una abeja
- **THEN** suena un «boing» suave junto con el brinco, igual tenga o no galletas que perder

#### Scenario: Caer en los pinchos
- **WHEN** el zorro cae en una zona de pinchos
- **THEN** suena un «¡uy!» musical corto y suave, distinto del «boing» de los enemigos, junto con el rebote, igual tenga o no galletas que perder

#### Scenario: Sale la fruta
- **WHEN** el zorro golpea el bloque que esconde la fruta
- **THEN** tras el tintineo de la galleta suena un efecto alegre de aparición, distinto de la galleta

#### Scenario: Comer la fruta
- **WHEN** el zorro come la fruta
- **THEN** suena un efecto de poder ascendente, distinto del de comprar un gorro

#### Scenario: Fin del modo invencible
- **WHEN** termina el modo invencible
- **THEN** suena un tintineo suave descendente, nunca un sonido de error

#### Scenario: Atravesar enemigos
- **WHEN** el zorro invencible atraviesa un erizo o una abeja
- **THEN** no suena el «boing» del choque

#### Scenario: Pisar pinchos siendo invencible
- **WHEN** el zorro invencible cae al foso de una zona de pinchos
- **THEN** suena el mismo «¡uy!» de los pinchos junto con el rebote, aunque no pierda ninguna galleta
