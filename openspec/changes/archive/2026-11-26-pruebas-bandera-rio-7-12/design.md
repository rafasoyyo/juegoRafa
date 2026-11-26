# Design

## Decisions

- **Reutilizar vistas**: «Los amigos del 10» es la vista del marco con `whole` (tarjeta con la meta) y marcos de 20; «Saltos de rana» es la vista de la recta con `jumps` (la rana en la salida y un arco por salto con su tamaño); «Los barcos del puerto» usa la vista de «De pequeño a grande» (siempre de menor a mayor). Vistas nuevas: el tren (vagones como zonas táctiles invisibles sobre el dibujo) y los calcetines.
- **Calcetines con dos respuestas** en pares y nones: «todos con pareja» o «sobra uno». La pista los une de dos en dos y hace brillar el que sobra.
- **Repaso**: elige tres pruebas distintas de un grupo de pruebas de elegir (sin «Parejas», que necesita memorizar) y toma una pregunta de cada una. `QuizScene` crea la vista y usa las zonas del tipo de cada pregunta.
- **Separación de los sitios** en la recta del 0 al 20: tres marcas, para que no se solapen las zonas táctiles.

## Risks / Trade-offs

- [Pares y nones con dos respuestas: acertar al azar es más fácil] → La prueba pide 2 de 3 y la pista enseña a emparejar; se revisará con niños.
- [Los barcos aún no se dibujan como barcos] → Se ven como tarjetas de ordenar; el dibujo propio puede llegar con los ajustes del paso 10.
