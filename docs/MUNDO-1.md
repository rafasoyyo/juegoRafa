# Mundo 1: El camino del arcoíris

Boceto aprobado el 24 de noviembre de 2026. Versión visual, con el mapa, las escenas y el plan: <https://claude.ai/artifact/YYXq3BbzM52udsMoBRJL4S>.

Este documento manda sobre las specs de `openspec/specs/` en lo que toca al tema del mundo 1. Si algo discrepa, se pregunta antes de cambiarlo.

## La idea

Desde su madriguera en la colina, junto al prado, Rufo ve un arcoíris muy lejos y sale a buscarlo con Lalo. Cada nivel le acerca un poco más, y en el último corre por las nubes, bajo el arco. El contenido del mundo 1 no cambia (los mismos 12 ambientes, pruebas, estrellas y pinchos), pero gana una meta que un niño de 4 años ve sin leer: el arcoíris siempre está delante.

## Qué no cambia

- Los 12 ambientes y su orden. Algunas pruebas de la bandera van ligadas a su ambiente (el teleférico en la montaña, las huellas en la nieve).
- Las pruebas de la bandera, una por nivel.
- Las estrellas y las galletas (desde `estrellas-por-objetivos`, las estrellas salen de las galletas y de la prueba de la bandera, como en todos los mundos: ver `docs/PROPUESTA.md`).
- Los pinchos desde el nivel 7, el erizo y la abeja.
- El selector de mundos, con el botón 123 para este mundo.

## Decisiones

1. **Nombre**: «El camino del arcoíris», en lugar de «Colina de los números». La colina se queda como punto de partida.
2. **Prólogo**: se ve una sola vez por perfil. Se puede volver a ver tocando la madriguera en el mapa.
3. **Gajo de un nivel pendiente**: se pinta igualmente. Si terminar el recorrido ya abre el siguiente nivel, quitarle el color sería como un castigo. El nodo sigue en amarillo para el adulto.
4. **Final en dos tiempos**: primero, la lluvia sobre la montaña. El manantial que abre el río llega cuando el río esté abierto en el juego (paso 9 del plan del mundo 2, `mundo-2-rio`).

## La historia en dos partes

| Parte | Niveles | Qué pasa |
|---|---|---|
| Un día fuera de casa | 1 a 6, sin pinchos | Rufo sale por la mañana de su madriguera en la colina, cruza el prado, las flores, el bosque y el otoño, ve ponerse el sol y llega a la noche bajo las estrellas. |
| El gran viaje | 7 a 12, con pinchos | Amanece en la playa y Rufo se aleja de casa por la selva, la montaña, la nieve y el desierto, hasta subir a las nubes. La subida de dificultad se explica porque está lejos de casa. |

## Las piezas visuales

Ninguna lleva texto ni voz.

### 1. El prólogo

La primera vez que un perfil entra en el nivel 1, antes de poder moverse:

| Momento | Qué se ve |
|---|---|
| 0 s | Rufo asoma de la madriguera y se despereza. |
| 1 s | Lalo aterriza a su lado y señala hacia la derecha con el ala, con el mismo gesto de las demostraciones de la bandera. |
| 2 s | El arcoíris lejano destella con un tintineo de 6 notas. |
| 3,5 s | Rufo da un salto de alegría y el niño ya puede jugar. |

Se salta tocando la pantalla. El perfil guarda que ya lo vio, sin más datos del niño.

### 2. El arcoíris en el horizonte

- Cada nivel lleva un arcoíris en la capa más lejana del fondo, a la derecha (hacia donde corre Rufo), detrás de las colinas y con el desplazamiento más lento.
- Su tamaño crece con el número del nivel y lo decide una función pura, probada sin Phaser. En el nivel 12, el ambiente de nubes ya lo tiene como escenario.
- De noche (nivel 6) va a media opacidad, como un arcoíris de luna.
- Nunca tapa bloques, enemigos ni pinchos, porque va siempre al fondo.
- Reutiliza la textura `decor-rainbow` de `BootScene` (6 bandas).

### 3. El mapa del arcoíris

- El camino empieza en la madriguera, a la izquierda, y sube hacia la derecha.
- El cielo del mapa pasa del día (niveles 1 a 4) al atardecer y la noche (5 y 6), amanece en la playa (7) y acaba en el cielo lila de las nubes (12).
- Sobre los últimos niveles hay un arco de 12 gajos que se pinta de izquierda a derecha, un gajo por nivel terminado (aunque la prueba quede pendiente).
- Al volver al mapa tras terminar un nivel por primera vez, el gajo nuevo se colorea banda a banda, de fuera adentro, con una escala de 6 notas y unos destellos. Después el zorro salta al nodo siguiente, como ahora.
- Con los 12 gajos pintados empieza el final.

## Los 12 tramos

| Nivel | Ambiente | Momento de la historia | Prueba de la bandera | Nota |
|---|---|---|---|---|
| 1 | Prado | Rufo sale de la madriguera y Lalo le señala el arcoíris (prólogo). | ¿Cuántos hay? | |
| 2 | Flores | Cruza el campo de flores de la colina. | ¿Dónde hay más? | |
| 3 | Bosque | Se mete en el bosque. | Sigue la serie | |
| 4 | Otoño | El bosque se vuelve naranja y caen hojas. | Caza de formas | |
| 5 | Atardecer | Se pone el sol detrás de la colina. | Las letras de tu nombre | |
| 6 | Noche | Bajo las estrellas; el arcoíris se ve tenue. | ¿Te acuerdas? | Fin del día |
| 7 | Playa | Amanece junto al mar: empieza el gran viaje. | Reparte las galletas | Pinchos |
| 8 | Selva | Lianas, hojas grandes y mucho verde. | De pequeño a grande | Pinchos |
| 9 | Montaña | Sube hacia los picos. | El teleférico | Pinchos |
| 10 | Nieve | Deja huellas en la nieve. | Huellas en la nieve | Pinchos |
| 11 | Desierto | Baja por el otro lado: el arcoíris ocupa medio cielo. | La balanza | Pinchos |
| 12 | Nubes | Sube por las nubes y corre bajo el arcoíris. | La otra mitad | Pinchos, final |

## El final

Se ve una vez por perfil, al volver al mapa después de terminar el nivel 12 por primera vez y antes de que se abra el castillo, y se salta tocando.

1. Se pinta el gajo 12 y Rufo salta de alegría en la nube.
2. La nube de la cima llueve sobre la montaña nevada.
3. Una gota baja al manantial y nace el río. Para los menores de 6 años, además, el botón del río deja de temblar: ese es el momento en que se abre el mundo 2, así que el niño ve por qué se abre. Con 6 años o más el río ya estaba abierto, así que ven la lluvia y el manantial sin la animación del botón.

Mientras el río no esté abierto en el juego publicado (paso 9 del plan del mundo 2, `mundo-2-rio`), el final se queda en el paso 2.

## El castillo y la medalla

- El castillo del mundo 1 está sobre una nube, al pie del arcoíris, como parada propia del mapa después del nivel 12, igual que el del mundo 2.
- Tiene 5 preguntas de las pruebas del mundo 1 (por ejemplo contar, comparar, serie, repartir y balanza), con la misma escalera de fallos.
- Da siempre la **medalla del arcoíris**, que aparece en el botón 123 del selector.
- Se monta con la pieza reutilizable del castillo del plan del mundo 2, así que va después de ella.

## Fuera de alcance

- Cambiar los ambientes, su orden, los recorridos o las pruebas de la bandera.
- Mecánicas nuevas o retos dentro del recorrido (son del mundo 2).
- Cambiar cómo se ganan las estrellas en el mundo 1 (lo hizo después, para todos los mundos, `estrellas-por-objetivos`).
- La voz grabada.
- Textos para el niño. Si hiciera falta explicar algo al adulto, va en el bocadillo de Lalo.

## Plan con OpenSpec

Un cambio de OpenSpec por pieza, cada uno con su ciclo: `openspec-propose` → `openspec-apply-change` → `npm test`, `npm run build` y revisión en el móvil a 844×390 → `openspec-sync-specs` → `openspec-archive-change`. Los pasos 1 a 3 no dependen del mundo 2. Los pasos 4 y 5 esperan a piezas del plan del río.

| Paso | Cambio | Qué hace | Specs | Verificación |
|---|---|---|---|---|
| 0 | Documento de rumbo (este archivo) | Pasa el boceto al repositorio y actualiza `docs/PROPUESTA.md` §1.5. | — | Revisión del texto. |
| 1 | `arcoiris-en-el-horizonte` | Arcoíris del fondo según el nivel, tenue de noche. Función pura del tamaño en `src/game/levels/`, capa lejana en `LevelScene` y opacidad de noche en `ambients.ts`. | `visual-style`, `level-courses` | Prueba de la función (crece con el nivel; el 12 es escenario). Niveles 1, 6 y 11 a 844×390. |
| 2 | `mapa-del-arcoiris` | Arco de 12 gajos, madriguera, camino que sube y animación del gajo nuevo. `MapScene` (`NODES`, `DECOR`, arco) y función pura de gajos pintados según el progreso. | `world-map` | Prueba: perfil nuevo con 0 gajos; con todo, 12; un nivel pendiente cuenta. Animación a 844×390. El selector no tapa nodos ni gajos. |
| ★ | Prueba con niños | Preguntar «¿adónde va Rufo?». Si el niño señala el arcoíris sin ayuda, el prólogo puede ser más corto. | — | Notas de la prueba. |
| 3 | `prologo-del-arcoiris` | La escena del prólogo, que se ve una vez por perfil y se repite tocando la madriguera. | `mascot-guide`, `child-profile`, `world-map` | Perfil nuevo: se ve una vez y se salta tocando. Perfil antiguo: no se ve. Revisión a 844×390. |
| 4 | `final-del-arcoiris` | La lluvia sobre la montaña. Va después de `progreso-por-mundos` del mundo 2; el manantial que abre el río se ve cuando el río se abre con `mundo-2-rio`. | `world-map`, `level-complete`, `mascot-guide` | Perfil de 5 años que termina el nivel 12: ve el final y el río se abre. Perfil de 6 años: ve la lluvia y el manantial sin la animación del botón. No se repite. |
| 5 | `castillo-del-arcoiris` | Castillo del mundo 1 con la pieza de `castillo-y-medalla` del mundo 2, como parada propia tras el nivel 12: 5 retos y la medalla del arcoíris. | `world-castle`, `world-map` | El castillo siempre da medalla y la medalla se ve en el selector. |

**Estado (26 de noviembre de 2026):** hechos todos los pasos: 0, 1 (`arcoiris-en-el-horizonte`), 2 (`mapa-del-arcoiris`), 3 (`prologo-del-arcoiris`), 4 (`final-del-arcoiris`) y 5 (`castillo-del-arcoiris`); la prueba con niños se dio por validada.

Para empezar cada paso: `openspec-propose` con el nombre del cambio y una frase como «sigue docs/MUNDO-1.md, sección El mapa del arcoíris», para que la propuesta parta de lo aprobado.
