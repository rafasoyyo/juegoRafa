## ADDED Requirements

### Requirement: Cada rama de integración publica su propia preview
Cada push o merge en las ramas `dev`, `mundo1`, `mundo2`, `mundo3`, `mundo4` y `mundo5` SHALL lanzar automáticamente el workflow de preview, que SHALL ejecutar las pruebas, compilar y publicar en un canal de Firebase Hosting del proyecto `juegorafa-edu` cuyo `channelId` MUST ser igual al nombre de la rama. Los despliegues de una rama MUST NOT cancelar los de otra, y el despliegue a producción (canal `live`) MUST seguir siendo solo manual desde `main`.

#### Scenario: Merge en una rama de mundo
- **WHEN** se mergea una PR en la rama `mundo3`
- **THEN** se publica una preview en el canal `mundo3` de Firebase Hosting y su URL aparece en el resumen del job

#### Scenario: Merge en dev
- **WHEN** se mergea una PR en la rama `dev`
- **THEN** se publica la preview en el canal `dev`, como hasta ahora

#### Scenario: Ramas a la vez
- **WHEN** llegan pushes casi simultáneos a `dev` y a `mundo2`
- **THEN** se publican las dos previews, cada una en su canal, sin que una cancele a la otra

#### Scenario: Rama de trabajo o main
- **WHEN** se hace push a una rama de trabajo como `mundo3-reto-geiser` o a `main`
- **THEN** no se publica ninguna preview ni se despliega a producción
