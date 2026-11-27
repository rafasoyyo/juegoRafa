## ADDED Requirements

### Requirement: Piedras que se hunden
Una piedra del géiser que se hunde SHALL devolver al zorro en un arco suave a la última piedra buena que pisó (o a la orilla), sin control durante el arco y sin perder galletas ni parpadear. La lava entre las piedras SHALL comportarse como el hueco del puente: rebote fuera sin perder galletas.

#### Scenario: Volver a la anterior
- **WHEN** el zorro cae sobre una piedra que se hunde
- **THEN** vuelve en un saltito a la piedra buena anterior y recupera el control al llegar
