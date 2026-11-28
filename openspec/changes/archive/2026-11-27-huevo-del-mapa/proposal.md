# Proposal

## Why

Paso 7 del plan del mundo 3 (`docs/MUNDO-3.md`, «El mapa» y «El huevo y el final»): la meta que se ve en la isla es un huevo que se pinta mancha a mancha, como los gajos del arcoíris en el mundo 1, y el mundo acaba cuando el huevo se abre.

## What Changes

- **Huevo en el mapa** de la isla, arriba, con 12 manchas (una por nivel) que siguen un patrón: por filas de abajo arriba y con los colores en serie (turquesa, ámbar, óxido). Se pintan con la misma regla que los gajos (nivel hecho o pendiente).
- **Mancha nueva animada**: al volver al mapa tras terminar un nivel, la cámara va al huevo, que se mueve un poco, y la mancha nueva crece con una nota y destellos; luego Rufo salta al nivel siguiente.
- **Final de la eclosión** (`story/hatch-finale.ts`), sin texto: el huevo en el nido del cráter, la mamá dinosaurio que se asoma, el huevo que se mueve, se raja y se abre, y el bebé que da un saltito. Se ve una vez por perfil y un toque lo salta. Sin el mundo 4, se queda ahí (sin la cueva de las letras).
- **`finale`** de un mundo pasa de `true` a `'rain'` (mundo 1) o `'hatch'` (isla).

**Fuera de alcance:** la cueva de las letras (cuando exista el mundo 4) y el sitio definitivo del huevo en el mapa de dos pantallas (paso 9).

## Capabilities

### Modified Capabilities

- `world-map`: huevo de manchas y final de la isla.
- `child-profile`: el final de la isla queda marcado como visto.
