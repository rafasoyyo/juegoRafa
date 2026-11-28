# Tasks

## 1. Workflow

- [x] 1.1 Disparar `firebase-deploy-preview.yml` con push a `dev`, `mundo1` … `mundo5`, con `channelId` y grupo de concurrencia iguales a `github.ref_name`, y limitar el job a esas ramas. Verificar parseando el YAML (`python3 -c 'import yaml…'`) y comprobando ramas, canal, condición del job y concurrencia.
- [x] 1.2 Comprobar que `firebase-deploy-produccion.yml` no cambia. Verificar con `git diff --stat` (solo el workflow de preview y OpenSpec).

## 2. Cierre

- [x] 2.1 `npm test` y `npm run build` pasan.
