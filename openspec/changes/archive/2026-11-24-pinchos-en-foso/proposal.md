# Proposal

## Why

Los pinchos actuales son conos morados de punta redonda puestos encima del suelo y no se leen como peligro: parecen decoración o un juguete. El diseño validado (maqueta «Pinchos en foso») los pasa a un foso hundido bajo la línea del suelo con conos de acero afilados. Así se ve de un vistazo dónde hay que saltar, y el niño sigue sin perder vidas ni volver a la salida.

## What Changes

- Cada zona de pinchos se convierte en un **foso real**: el suelo se corta en el ancho de la zona (1 o 2 baldosas), con el borde redondeado, una sombra bajo el borde y paredes de la tierra del ambiente oscurecida. El foso mide 64 px de hondo.
- Los pinchos pasan a ser **conos de acero de punta afilada** (3 por baldosa, gris claro, sin rojo ni contorno negro) sobre una placa con remaches en el fondo del foso, con un destello blanco en una punta por zona. Sus puntas quedan 22 px por debajo de la línea del suelo.
- Rufo **cae al foso** si no salta. El borde le sostiene mientras pise el borde, y si se queda parado con casi todo el cuerpo sobre el hueco se recoloca suavemente sobre el suelo firme, nunca hacia los pinchos.
- Al tocar las puntas hay pinchazo como hasta ahora y el rebote le saca del foso por el lado por el que entró. El cálculo del rebote tiene en cuenta que sale desde 22 px por debajo del suelo.
- **BREAKING (comportamiento):** con la fresa o mientras parpadea tras un pinchazo, Rufo ya no corre por encima de los pinchos. Cae al foso y rebota fuera igual, con el sonido de los pinchos, pero sin perder galleta.
- **Sin cambios:** los archivos de nivel `nivel-7.json` a `nivel-12.json`, el ancho de las zonas, sus reglas de colocación, el número de zonas por nivel, los erizos y la colocación de la fresa.

Habilidad educativa: ninguna. Es un cambio de presentación y de reglas del recorrido.

**Fuera de alcance:**
- Fosos sin pinchos, fosos más anchos de 2 baldosas o caídas fuera del recorrido.
- Pinchos en escalones, en plataformas o en los niveles 1 a 6.
- Cambiar el aspecto de los erizos o el sonido de los pinchos.
- Voz o pistas nuevas de Lalo sobre los pinchos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `spike-zones`: el aspecto pasa a pinchos de acero afilados dentro de un foso; nuevo requisito del foso bajo el suelo; el contacto pasa a ser caer al foso (cambia el margen de perdón); el rebote sale desde dentro del foso y se aplica también con protección o fresa, sin perder galleta.
- `power-fruit`: «Los pinchos no pinchan a Rufo invencible» deja de dejarle correr por encima. Ahora rebota fuera del foso sin perder galleta.
- `platformer-level`: «Sin fallo que penalice» deja de exigir suelo continuo bajo los pinchos. Los únicos huecos del suelo son los fosos de pinchos, de los que siempre se sale rebotando.
- `game-audio`: el escenario de pinchos con Rufo invencible pasa a sonar con el rebote.

## Impact

- `src/game/scenes/BootScene.ts`: nueva textura `spikes` (conos de acero y placa) y destello.
- `src/game/ui/widgets.ts`: `addScenery` y `drawGround` dibujan el suelo por tramos con el borde redondeado y el interior de cada foso.
- `src/game/levels/ambients.ts`: color de la pared del foso por ambiente.
- `src/game/levels/spikes.ts`: geometría del foso (medidas, tramos de suelo, contacto dentro del foso, rebote desde abajo y recolocación en el borde). Es TypeScript puro y tiene pruebas.
- `src/game/scenes/LevelScene.ts`:
  - El suelo físico pasa de una sola zona a tramos con un fondo en cada foso.
  - Cambian la comprobación de los pinchos y el pinchazo sin galleta.
  - Se quita la protección especial de la fresa al acabar sobre los pinchos.
- `src/game/levels/ambients.test.ts`: el contraste de los pinchos se mide en acero contra la pared del foso en lugar de en morado contra el suelo.
- `public/assets/LICENSES.md`: se actualiza la descripción del gráfico propio `spikes`.
- Sin dependencias nuevas. No hay que tocar los JSON de nivel ni el validador de colocación.
