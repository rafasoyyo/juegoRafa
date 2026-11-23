# Registro de licencias de los recursos

Todo recurso que se sirve con el juego aparece aquí con su origen y su licencia. **Regla:** al añadir
un gráfico, fuente o sonido nuevo, se anota en este archivo en el mismo commit. No se admiten
recursos de terceros con copyright (ni personajes, ni logos, ni música).

## Fuentes

| Archivo | Origen | Licencia |
|---|---|---|
| `fonts/baloo2-800.woff2` | Baloo 2 ExtraBold, © 2019 The Baloo 2 Project Authors (https://github.com/EkType/Baloo2), subconjunto latino de @fontsource/baloo-2 | SIL Open Font License 1.1. Texto completo en `fonts/OFL.txt` |

La OFL permite usar, incrustar y redistribuir la fuente con el juego, siempre que se mantenga el aviso
de copyright y la licencia, y que no se venda la fuente sola.

## Gráficos SVG (`assets/svg/`)

Propios del proyecto. Los trazados salen del lienzo de diseño del juego («Juego educativo - diseños»,
hecho para este proyecto). Los marcados como *derivado* se dibujaron aquí siguiendo el mismo estilo.
Licencia: la del repositorio.

| Archivo | Origen |
|---|---|
| `svg/bee-wing.svg` | derivado: ala de la abeja, blanca semitransparente, en la paleta del lienzo |
| `svg/bee.svg` | derivado: abeja zumbona propia (enemigo), en la paleta y el estilo del lienzo |
| `svg/block-used.svg` | derivado de los bloques del lienzo («?» y bloque usado) |
| `svg/block.svg` | derivado de los bloques del lienzo («?» y bloque usado) |
| `svg/cloud.svg` | lienzo de diseño |
| `svg/cookie.svg` | derivado: galleta con pepitas de chocolate en la paleta del lienzo |
| `svg/flag.svg` | derivado de la bandera del lienzo |
| `svg/fox-celebrate.svg` | lienzo de diseño |
| `svg/fox-idle.svg` | lienzo de diseño |
| `svg/fox-jump.svg` | derivado del zorro del lienzo (pose de salto) |
| `svg/fox-run.svg` | derivado de `fox-idle.svg`: cuerpo sin pies y algo más alto, para correr con las piernas dibujadas por código |
| `svg/hat-cap.svg` | lienzo de diseño |
| `svg/hat-crown.svg` | lienzo de diseño |
| `svg/hat-helmet.svg` | lienzo de diseño |
| `svg/hat-party.svg` | lienzo de diseño |
| `svg/hat-wool.svg` | lienzo de diseño |
| `svg/hedgehog.svg` | derivado: erizo de pinchos propio (enemigo), en la paleta y el estilo del lienzo |
| `svg/icon-arrow-left.svg` | flechas del lienzo |
| `svg/icon-arrow-right.svg` | flechas del lienzo |
| `svg/icon-arrow-up-white.svg` | flechas del lienzo |
| `svg/icon-cape.svg` | lienzo de diseño |
| `svg/icon-check-white.svg` | lienzo de diseño |
| `svg/icon-colors.svg` | lienzo de diseño |
| `svg/icon-flag.svg` | lienzo de diseño |
| `svg/icon-fox-face.svg` | lienzo de diseño |
| `svg/icon-glasses.svg` | lienzo de diseño |
| `svg/icon-home.svg` | lienzo de diseño |
| `svg/icon-lock.svg` | lienzo de diseño |
| `svg/icon-map.svg` | lienzo de diseño |
| `svg/icon-next-white.svg` | flechas del lienzo |
| `svg/icon-no-hat.svg` | lienzo de diseño |
| `svg/icon-play-white.svg` | derivado: triángulo de jugar |
| `svg/icon-replay.svg` | lienzo de diseño |
| `svg/icon-shapes.svg` | lienzo de diseño |
| `svg/icon-speaker.svg` | lienzo de diseño |
| `svg/icon-speaker-off.svg` | derivado de `icon-speaker.svg`: mismo altavoz con un aspa en lugar de las ondas (silencio) |
| `svg/lalo-blink.svg` | derivado de Lalo del lienzo (ojos cerrados) |
| `svg/lalo.svg` | lienzo de diseño |
| `svg/star-empty.svg` | lienzo de diseño |
| `svg/star.svg` | lienzo de diseño |
| `svg/tree.svg` | lienzo de diseño |

## Sonido

No hay archivos de audio. La música (melodías del mapa y del nivel y jingle de victoria) y los efectos
de sonido son composiciones y síntesis propias del proyecto: las partituras y las recetas de cada
efecto están en `src/game/audio/` y el juego las genera en tiempo real con Web Audio. No transcriben
ni imitan ninguna música existente (ningún tema de juegos de Nintendo ni de terceros). Licencia: la
del repositorio.

## Iconos de la PWA (`icons/`)

| Archivo | Origen |
|---|---|
| `icons/icon-192.png`, `icons/icon-512.png` | Propios del proyecto (fase 0) |
