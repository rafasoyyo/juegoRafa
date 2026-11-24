# Proposal

## Why

El mundo 1 pasa a ser «El camino del arcoíris» (boceto aprobado, `docs/MUNDO-1.md`): Rufo sale de casa a buscar un arcoíris lejano y cada nivel le acerca un poco más. Hoy el arcoíris solo aparece en el nivel 12, así que un niño de 4 años no ve ninguna meta mientras juega. Este es el paso 1 del plan: poner el arcoíris en el horizonte de todos los niveles, más grande cuanto más avanza Rufo, sin texto ni voz. No depende del mundo 2 y prepara el mapa (paso 2) y el prólogo (paso 3), que reutilizan el mismo arcoíris.

## What Changes

- Cada nivel del 1 al 12 lleva un **arcoíris en la capa más lejana del fondo**, a la derecha (hacia donde corre Rufo), detrás de las nubes, las colinas y la decoración, con un paralaje muy lento como el sol y la luna.
- Su **tamaño crece con el número del nivel**: pequeño y casi en el horizonte en el 1, asomando por detrás de los picos en el 9, ocupando medio cielo en el 11. Lo decide una función pura en `src/game/levels/`, probada sin Phaser.
- En el **nivel 12** el arcoíris del ambiente de nubes es el de esta función, el mayor de todos: Rufo corre bajo el arco. Deja de tener una posición y un tamaño propios dentro de `addScenery`.
- En el **nivel 6 (noche)** el arcoíris va a media opacidad, como un arcoíris de luna. La opacidad la decide cada ambiente.
- La textura `decor-rainbow` (6 bandas pastel) se genera con más resolución para que no se vea borrosa al tamaño del nivel 12. Las miniaturas de la prueba de la bandera la siguen usando igual.
- **Sin cambios:** los ambientes, su orden, los recorridos (`content/levels/`), las pruebas de la bandera, las estrellas, los pinchos y el mapa.

Habilidad educativa: ninguna. Es un hilo visual de la historia. Da al niño una meta que ve sin leer y le muestra el avance (el arcoíris crece), pero no enseña cantidad, número, patrones, formas ni letras.

**Fuera de alcance** (son otros pasos de `docs/MUNDO-1.md` o quedan fuera del plan):
- El arco de 12 gajos del mapa, la madriguera y la animación del gajo nuevo (paso 2, `mapa-del-arcoiris`).
- El prólogo con Lalo señalando el arcoíris (paso 3) y su tintineo de 6 notas.
- El final con la lluvia sobre la montaña (paso 4) y el castillo con la medalla (paso 5).
- Que el arcoíris crezca mientras Rufo avanza dentro de un mismo nivel: solo cambia de un nivel a otro.
- El nombre «El camino del arcoíris» en algún texto del juego. El niño no lee y el mapa es del paso 2.
- Sonido o voz nuevos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `level-courses`: nuevo requisito «Arcoíris en el horizonte», que crece con el nivel, va tenue de noche, en el 12 es el del escenario de nubes y nunca tapa el recorrido.
- `visual-style`: nuevo requisito «Un solo arcoíris en todo el juego», que fija las 6 bandas pastel, sin contorno y nítidas a cualquier tamaño del juego, para que el niño reconozca el mismo arcoíris en los niveles, la prueba de la bandera y, más adelante, el mapa y el prólogo.

## Impact

- `src/game/levels/horizon-rainbow.ts` (nuevo) y su prueba: función pura con el tamaño, la opacidad y la posición del arcoíris de cada nivel.
- `src/game/levels/ambients.ts`: campo opcional de opacidad del arcoíris en `Ambient` (la noche la baja a la mitad).
- `src/game/ui/widgets.ts`: `addScenery` recibe el número de nivel y dibuja el arcoíris como primera capa tras el cielo. El caso especial del arcoíris del ambiente de nubes pasa a usar la función.
- `src/game/scenes/LevelScene.ts`: pasa `this.level` a `addScenery`.
- `src/game/scenes/BootScene.ts`: `decor-rainbow` con más resolución (y el comentario corregido: son 6 bandas, no 5).
- Sin dependencias nuevas ni cambios en datos guardados, perfiles o el formato de los niveles.
