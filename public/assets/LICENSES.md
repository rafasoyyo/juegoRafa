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
| `svg/icon-replay-white.svg` | derivado: `icon-replay` en blanco y más grueso |
| `svg/icon-shapes.svg` | lienzo de diseño |
| `svg/icon-speaker.svg` | lienzo de diseño |
| `svg/frog.svg` | propio: rana saltarina (enemigo del río), en la paleta y el estilo del lienzo |
| `svg/crab.svg` | propio: cangrejo que anda de lado (enemigo del río), en la paleta y el estilo del lienzo |
| `svg/castle.svg` | propio: castillo del final de cada mundo (mapa, recorrido y prueba), en la paleta y el estilo del lienzo |
| `svg/medal.svg` | propio: medalla que da el castillo (fin del castillo y selector de mundos), en la paleta y el estilo del lienzo |
| `svg/icon-ten-frame.svg` | propio: marco de diez (2×5 casillas con 7 fichas), icono del mundo del río, en la paleta del lienzo |
| `svg/icon-speaker-off.svg` | derivado de `icon-speaker.svg`: mismo altavoz con un aspa en lugar de las ondas (silencio) |
| `svg/lalo-blink.svg` | derivado de Lalo del lienzo (ojos cerrados) |
| `svg/lalo.svg` | lienzo de diseño |
| `svg/snail.svg` | derivado: caracol propio (distractor de la prueba de la bandera), en la paleta y el estilo del lienzo |
| `svg/star-empty.svg` | lienzo de diseño |
| `svg/strawberry.svg` | derivado: fresa propia (fruta del modo invencible), en la paleta y el estilo del lienzo |
| `svg/star.svg` | lienzo de diseño |
| `svg/tree.svg` | lienzo de diseño |

## Gráficos generados por código

Propios del proyecto, dibujados con formas planas en el código del juego (no hay archivo de imagen).
Licencia: la del repositorio.

| Clave / elemento | Dónde se dibuja | Origen |
|---|---|---|
| `sky-prado`, `sky-flores`, `sky-bosque`, `sky-otono`, `sky-atardecer`, `sky-noche`, `sky-playa`, `sky-selva`, `sky-montana`, `sky-nieve`, `sky-desierto`, `sky-nubes` | `src/game/scenes/BootScene.ts` | propio: degradados del cielo de cada ambiente (`src/game/levels/ambients.ts`) |
| `decor-tree` | `src/game/scenes/BootScene.ts` | propio: árbol verde redondeado de la decoración del bosque |
| `decor-tree-autumn` | `src/game/scenes/BootScene.ts` | propio: árbol ocre y naranja de la decoración del otoño |
| `decor-flowers` | `src/game/scenes/BootScene.ts` | propio: mata de flores del campo de flores |
| `decor-sun` | `src/game/scenes/BootScene.ts` | propio: sol bajo del atardecer |
| `decor-moon` | `src/game/scenes/BootScene.ts` | propio: luna de la noche |
| `decor-star` | `src/game/scenes/BootScene.ts` | propio: estrella redondeada de la noche |
| `decor-burrow` | `src/game/scenes/BootScene.ts` | propio: madriguera de Rufo en la colina, al principio del mapa del arcoíris |
| `decor-palm` | `src/game/scenes/BootScene.ts` | propio: palmera de la playa |
| `decor-leaf`, `decor-vine` | `src/game/scenes/BootScene.ts` | propio: hoja grande y liana de la selva |
| `decor-peak` | `src/game/scenes/BootScene.ts` | propio: pico nevado de la montaña |
| `decor-pine-snow`, `decor-flake` | `src/game/scenes/BootScene.ts` | propio: pino nevado y copo de la nieve |
| `decor-cactus` | `src/game/scenes/BootScene.ts` | propio: cactus redondeado (sin pinchos) del desierto |
| `decor-rainbow` | `src/game/scenes/BootScene.ts` | propio: arcoíris pastel de las nubes |
| `spikes` | `src/game/scenes/BootScene.ts` | propio: hilera de conos de acero de punta afilada, con caras de luz y sombra (fondo de los fosos de pinchos) |
| `spike-glint` | `src/game/scenes/BootScene.ts` | propio: destello blanco de cuatro puntas sobre una punta de cada foso |
| Foso de los pinchos (pared, sombra y placa con remaches) | `src/game/ui/widgets.ts` (`drawPit`), `src/game/scenes/LevelScene.ts` | propio |
| Mar de la playa y copos que caen | `src/game/ui/widgets.ts` | propio |
| `dust` | `src/game/scenes/BootScene.ts` | propio: mota de polvo de la carrera |
| `sparkle` | `src/game/scenes/BootScene.ts` | propio: destello de cuatro puntas del modo invencible |
| Plataformas (tronco y nube mullida) | `src/game/ui/widgets.ts` (`drawPlatform`) | propio: plataformas de un solo sentido de los niveles |
| Escalones (hierba sobre tierra) | `src/game/ui/widgets.ts` (`drawStep`) | propio: escalones de los niveles |
| Colinas, suelo (hierba, arena, nieve y nube) y piernas del zorro | `src/game/ui/widgets.ts`, `src/game/scenes/LevelScene.ts` | propio |

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
