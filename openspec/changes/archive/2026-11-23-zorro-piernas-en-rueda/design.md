# Design

## Context

- El zorro del nivel es un `Phaser.Physics.Arcade.Sprite` (`LevelScene.fox`) con origen (0.5, 1) y
  texturas SVG de 120×120 (`fox-idle`, `fox-jump`, `fox-celebrate`). El dibujo mira de frente. Sus
  pies son dos elipses marrones (`#B85C10`) en y ≈ 111, justo bajo el cuerpo (elipse con cy=90 y
  ry=20). No tiene piernas.
- `animateFox()` elige la pose (`idle`, `jump`, `celebrate`) y, al andar, solo aplica
  `angle = sin(t·0.02)·6`. La velocidad horizontal es constante (`RUN_SPEED`) desde el primer
  fotograma: no hay aceleración física de la que sacar una «velocidad».
- El gorro se coloca cada fotograma con `placeHat()`, que ya tiene en cuenta el giro y la escala del
  zorro y usa `HAT_OFFSETS[pose]`.
- La caja de física es `setSize(56, 87).setOffset(32, 30)` sobre la textura de 120×120. Cambiar a
  otra textura del mismo tamaño no la altera.
- Estilo obligatorio (`visual-style`): formas planas y redondeadas, paleta fija, sin contornos negros.
- El proyecto declara Phaser 3, pero `package.json` usa Phaser 4.2. Aquí solo se usan `Graphics`,
  `Image` y tweens, que tienen la misma API en las dos versiones.

## Goals / Non-Goals

**Goals:**
- Las piernas se dibujan por código y se parametrizan con dos números, la fase (ángulo del ciclo) y
  la intensidad (0 = zancada lenta, 1 = rueda), para ajustarlas sin redibujar SVG.
- La cinemática es testeable en Vitest, sin Phaser.
- Coste por fotograma acotado en móviles modestos.

**Non-Goals:**
- Sistema de animación genérico reutilizable por otros personajes.
- Rodillas o articulaciones realistas: las piernas son tubos redondeados, como el resto del estilo.

## Decisions

### 1. Piernas por código con un `Graphics`, no hojas de sprites SVG
Un único `Phaser.GameObjects.Graphics` (profundidad 9, bajo el cuerpo, que está en 10) se borra y se
redibuja cada fotograma mientras el zorro corre.
- **Por qué**: la transición de zancada a rueda es continua (ritmo, longitud de zancada, opacidad de
  la estela). Con fotogramas habría que dibujar y anotar muchos SVG y la transición iría a saltos.
  Además, lo generado por código no necesita licencia aparte.
- **Alternativa descartada**: una hoja de 8 a 12 fotogramas SVG (`fox-run-0..n`) más fotogramas de
  rueda. Da más control artístico, pero cuesta más hacerla y ajustarla, y queda rígida.

### 2. Cuerpo nuevo `fox-run.svg` sin pies y algo más alto
Se copia `fox-idle.svg` sin las dos elipses de los pies, con el grupo del cuerpo desplazado 10
unidades hacia arriba (`transform="translate(0 -10)"`) y el mismo lienzo de 120×120.
- **Por qué**: así las piernas tienen unos 17 px de recorrido sobre el suelo en vez de 7, la rueda
  se lee bien en un móvil y la caja de física no cambia. Primero se probaron 6 unidades, pero la
  rueda apenas se distinguía.
- Se añade `run: { x: 0, y: -87, angle: 0 }` a `HAT_OFFSETS` y `'run'` a `FoxPose`.
- El suelo queda en y = −3 respecto a la base de la textura, porque la caja de física acaba en 117.
- **Alternativa descartada**: ocultar los pies de `fox-idle` con una máscara. Es más frágil y no
  deja espacio a las piernas.

### 3. Módulo puro `src/game/ui/run-cycle.ts`
Contiene el estado y la geometría, sin Phaser:
- `RunState { phase: number; intensity: number }` y
  `stepRun(state, dtMs, { running, grounded, finished })`:
  - En el suelo y corriendo, `intensity` sube linealmente de 0 a 1 en `RAMP_MS = 400`.
  - En el aire se congela: el zorro aterriza ya en rueda.
  - Parado en el suelo, o en la meta, vuelve a 0 en el acto.
  - `phase` avanza a `lerp(3, 8, intensity)` ciclos por segundo.
- `legFeet(phase, intensity)`: posición local de los dos pies (desfase de π) sobre una elipse con
  `rx = lerp(8, 14, i)` y `ry = lerp(5, 11, i)`, centrada bajo la cadera. La `y` se recorta en 0
  para que el pie nunca baje del suelo (el «fondo plano» de la rueda). Las caderas son fijas en
  (±6, −22). Tras verlo en pantalla, la elipse final es `rx = lerp(8, 18, i)` y `ry = lerp(5, 14, i)`.
- `wheelMix(intensity) = smoothstep(0.5, 0.9, intensity)`: reparte la opacidad entre las piernas
  nítidas (1 − mix) y la rueda (mix).
- Todo en unidades del zorro (caja de 120). El dibujo escala con `fox.displayWidth / FOX_UNITS`.

### 4. Cómo se dibuja la rueda (sin efecto de rueda de carro)
A 60 fps, una rueda real a 8 Hz puede parecer que gira hacia atrás. En vez de confiar en la rotación:
- **Estela**: 4 «pies fantasma» en `phase − k·0.35` con opacidad decreciente (0.6, 0.4, 0.25, 0.15).
- **Borrón de piernas**: una elipse naranja (`#F28C28`, α 0.28) del tamaño de la trayectoria y 3
  arcos naranjas (α 0.75) que giran con la fase. Una sola elipse marrón fina se veía demasiado tenue.
- **Piernas**: tubos naranjas (`#F28C28`, grosor 8) de la cadera a cada pie, con α 0.35 en rueda.
- Los pies son elipses `#B85C10`, como en los SVG actuales. Sin contornos.

El `Graphics` copia la posición y el giro del zorro, y `scaleX = faceLeft ? −1 : 1`. Así, «delante»
es siempre +x en el espacio local y la rueda gira según el sentido de la marcha.

### 5. Inclinación, rebote, líneas de velocidad y polvo
- **Inclinación**: `angle = dirSign · 10° · mix`. Sustituye al vaivén `sin(t)·6`, que ahora solo se
  aplica escalado por `(1 − mix)`.
- **Rebote**: `sy = 1 + 0.03·|sin(2π·phase)|`, el mismo máximo que el vaivén anterior. Arcade
  escala la caja de colisión con el sprite, así que un rebote mayor la habría cambiado.
- **Líneas de velocidad**: 3 trazos redondeados de color tinta `#2B2340` con α 0.18·mix, detrás del
  cuerpo, con longitud variable cada fotograma. Se dibujan en el mismo `Graphics`.
- **Polvo**: un pool de 6 `Image` con una textura `dust` (círculo color crema `#FFF4E0`, generada en
  `BootScene` con `Graphics.generateTexture`). Con mix > 0.5 sale uno cada 90 ms en el pie trasero.
  Crece y se desvanece en 350 ms y vuelve al pool, sin crear ni destruir objetos.
- **Alternativa descartada**: el sistema de partículas de Phaser. Su API cambia entre la 3 y la 4, y
  para 6 motas un pool es más simple.

### 6. Cambios de pose y transición al parar
`pose = finished ? 'celebrate' : !grounded ? 'jump' : running ? 'run' : 'idle'`. Al pasar de `run` a
`idle`, el cuerpo baja 10 unidades. Para que no se note el salto, se lanza el aplastamiento existente
con `amount = 0.5`, que se lee como un frenazo de dibujos animados. El `Graphics` se oculta y se
borra en cuanto no está en `run`.

## Risks / Trade-offs

- [Salto visual de 10 px al cambiar entre `run` e `idle`] → Se tapa con el aplastamiento de la
  decisión 6. Si aun así se nota en el móvil, se puede bajar el desplazamiento.
- [Efecto de rueda de carro o parpadeo a 30 fps en móviles lentos] → La estela fantasma no depende
  de la frecuencia de muestreo y el ritmo se limita a 8 Hz. Hay que comprobarlo con el
  estrangulamiento de CPU de DevTools.
- [Coste del redibujado] → Un solo `Graphics` con menos de 15 formas y un pool fijo de polvo. Si se
  nota en móvil, se puede pasar la rueda a una textura pregenerada que gira.
- [La rueda tapa la lectura de los pies al calcular un salto] → La caja de colisión y el momento del
  salto no cambian. El niño mira el cuerpo, que sigue igual.
- [Arte menos pulido que el SVG del lienzo de diseño] → Los colores, grosores y tamaños son
  constantes en `run-cycle.ts`, fáciles de ajustar sin tocar la lógica.

## Migration Plan

Solo cambia el cliente: se despliega con `npm run deploy` y se deshace revirtiendo el commit. No hay
datos ni progreso guardado afectados.

## Open Questions

- Los valores finos (grosor de pierna, α de la estela, número de líneas de velocidad) se ajustarán
  viéndolo en el móvil. No cambian ni el enfoque ni las tareas.
