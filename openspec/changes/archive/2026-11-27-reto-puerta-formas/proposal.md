# Proposal

## Why

Paso 2 del plan del mundo 3 (`docs/MUNDO-3.md`, «B. La puerta de la cueva»): reconocer una forma aunque esté girada (y, los mayores, distinguirla de su imagen en el espejo), en el recorrido.

## What Changes

- **Mecánica B de la isla** sobre el motor de retos: una losa con un hueco con forma tapa la entrada de un templo; el niño golpea el bloque con la forma que encaja; la pieza vuela al hueco girando, encaja con un golpe de piedra y el triceratops aparta la losa (3 galletas).
- **Según la edad**: formas simples sin girar (3-4); más formas y el hueco girado un cuarto de vuelta (5-6); piezas compuestas giradas y la misma pieza volteada como trampa (7-8).
- **Escalera de fallos**: la pieza no cabe y rebota; un brillo recorre el borde; Lalo señala y encaja sola.
- **Datos**: `"kind": "door"`, con la geometría de los bloques que cuentan y sitio para el triceratops.
- **Borrador**: un nivel 2 de la isla con tres puertas, para probarlo en desarrollo.

Habilidad educativa: **formas y espacio** (forma girada, volteo).

**Fuera de alcance:** los recorridos definitivos (paso 9), sonidos nuevos (se usan `stone`, `gate`, `nope` y `tick`).

## Capabilities

### Modified Capabilities

- `course-challenges`: mecánica B de la isla.
- `level-courses`: `door` en los datos.
