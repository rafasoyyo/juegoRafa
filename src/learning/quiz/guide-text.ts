/**
 * Texto del bocadillo de Lalo «Para el adulto»: qué se practica en cada prueba y cómo guiar al niño.
 * Un `Record` exhaustivo: un `QuizKind` nuevo no compila hasta que tenga su texto.
 */

import type { QuizKind } from './types';

export interface GuideText {
  /** Nombre de la prueba. */
  title: string;
  /** Qué aprende el niño. */
  goal: string;
  /** Frase para guiar al niño sin darle la respuesta. */
  how: string;
}

/** Tope de palabras entre `goal` y `how`, para que el bocadillo quepa en un móvil de 844×390. */
export const GUIDE_MAX_WORDS = 35;

export const GUIDE_TEXT: Record<QuizKind, GuideText> = {
  count: {
    title: '¿Cuántos hay?',
    goal: 'Contar objetos y relacionar la cantidad con su número.',
    how: '¿Cuántos ves? Vamos a contarlos con el dedo.',
  },
  compare: {
    title: '¿Dónde hay más?',
    goal: 'Comparar cantidades: más y menos.',
    how: '¿En cuál cesta hay más? ¿Cómo lo sabes?',
  },
  series: {
    title: 'Sigue la serie',
    goal: 'Descubrir la regla de una serie y continuarla.',
    how: '¿Qué viene después? ¿Qué se repite?',
  },
  shapes: {
    title: 'Caza de formas',
    goal: 'Reconocer formas aunque cambien de color, tamaño o giro.',
    how: '¿Cuál es igual que el modelo? ¿Cómo se llama?',
  },
  'name-letters': {
    title: 'Las letras de tu nombre',
    goal: 'Reconocer las letras del propio nombre y su orden.',
    how: '¿Qué letra falta? Dígalas en voz alta.',
  },
  recall: {
    title: '¿Te acuerdas?',
    goal: 'Recordar lo que pasó en el nivel.',
    how: '¿Qué había en este nivel? ¿Qué hicimos?',
  },
  share: {
    title: 'Reparte las galletas',
    goal: 'Repartir a partes iguales entre los platos, primera idea de la división y del resto.',
    how: '¿Cuántas galletas le tocan a cada plato? ¿Sobra alguna?',
  },
  order: {
    title: 'De pequeño a grande',
    goal: 'Ordenar por tamaño y ordenar números.',
    how: '¿Cuál es el más pequeño? ¿Y el siguiente?',
  },
  'cable-car': {
    title: 'El teleférico',
    goal: 'Sumar y restar como algo que pasa: suben y bajan pasajeros.',
    how: '¿Cuántos había? ¿Cuántos bajaron? ¿Cuántos quedan?',
  },
  tracks: {
    title: 'Huellas en la nieve',
    goal: 'Orientarse y seguir flechas, primeros pasos de programación.',
    how: '¿Hacia dónde va esta flecha? ¿Dónde acabará?',
  },
  balance: {
    title: 'La balanza',
    goal: 'Comparar pesos y entender la igualdad.',
    how: '¿Qué pesa más? ¿Qué hace falta para equilibrarla?',
  },
  mirror: {
    title: 'La otra mitad',
    goal: 'Reconocer la simetría.',
    how: 'Si doblamos el dibujo por la mitad, ¿cómo quedaría el otro lado?',
  },
  fingers: {
    title: '¿Cuántos dedos?',
    goal: 'Ver cantidades sin contar: una mano entera son 5.',
    how: 'Enséñale tus manos. ¿Cuántos dedos hay sin contarlos uno a uno?',
  },
  'ten-frame': {
    title: 'El marco de diez',
    goal: 'Ver cantidades en el marco de diez y cuánto falta para llenarlo.',
    how: '¿Cuántas fichas hay? ¿Cuántas casillas quedan vacías?',
  },
  memory: {
    title: 'Parejas',
    goal: 'Relacionar una cantidad con su número y recordar dónde estaba.',
    how: '¿Dónde viste ese número? Miradlo juntos antes de que se den la vuelta.',
  },
  neighbor: {
    title: 'El vecino',
    goal: 'El número anterior y el siguiente.',
    how: '¿Qué número va justo después? ¿Y justo antes? Contad en voz alta.',
  },
  'number-line': {
    title: '¿Dónde va?',
    goal: 'Cada número tiene su sitio en la recta numérica.',
    how: 'Contad desde el principio de la recta. ¿Dónde está este número?',
  },
  biggest: {
    title: 'El número más grande',
    goal: 'Comparar números sin contar objetos.',
    how: '¿Cuál es más grande? ¿Cuál viene después al contar?',
  },
  'ten-friends': {
    title: 'Los amigos del 10',
    goal: 'Descomponer el 10 (o el 5, o el 20): cuánto falta para completarlo.',
    how: '¿Cuántas fichas hay? ¿Cuántas faltan para llenar el marco?',
  },
  train: {
    title: 'El tren',
    goal: 'Los ordinales: primero, segundo, tercero…',
    how: 'Contad los vagones desde la locomotora: primero, segundo…',
  },
  socks: {
    title: 'Calcetines',
    goal: 'Emparejar y descubrir los números pares e impares.',
    how: 'Juntad los calcetines de dos en dos. ¿Sobra alguno?',
  },
  'frog-jumps': {
    title: 'Saltos de rana',
    goal: 'Contar a saltos sobre la recta numérica.',
    how: '¿Dónde está la rana? Contad cada salto con ella.',
  },
  boats: {
    title: 'Los barcos del puerto',
    goal: 'Ordenar números de menor a mayor.',
    how: '¿Qué barco lleva el número más pequeño? ¿Y después?',
  },
  'river-review': {
    title: 'Repaso del río',
    goal: 'Repasar lo aprendido en el río: cantidades, recta y comparar.',
    how: 'Recordad cómo lo hicisteis en los niveles anteriores.',
  },
  'dino-shadows': {
    title: 'Sombras de dinosaurios',
    goal: 'Reconocer una figura por su silueta, aunque mire al otro lado.',
    how: '¿Qué sombra es de este dinosaurio? Mira el cuello, la cola y las patas.',
  },
  'shape-things': {
    title: 'Formas en las cosas',
    goal: 'Ver las formas en los objetos de todos los días.',
    how: '¿Qué forma tiene? Recorred el borde con el dedo.',
  },
  'stego-plates': {
    title: 'Las placas del estegosaurio',
    goal: 'Reconocer una forma aunque cambie de tamaño, color o giro; los mayores cuentan sus esquinas.',
    how: '¿Cuál tiene la misma forma? ¿Cuántas esquinas tiene?',
  },
  'turned-shapes': {
    title: 'Igual aunque gire',
    goal: 'Ver que una pieza girada sigue siendo la misma, y que volteada ya no.',
    how: 'Gira la pieza con la imaginación: ¿cuál es igual?',
  },
  nest: {
    title: 'El nido',
    goal: 'Situar cosas: dentro, fuera, encima, debajo, delante, detrás, izquierda y derecha.',
    how: '¿Dónde está el bebé? ¿Dónde está el huevo en cada dibujo?',
  },
  'odd-egg': {
    title: 'Los huevos de la familia',
    goal: 'Clasificar por un rasgo (color o dibujo) y, los mayores, por dos a la vez.',
    how: '¿En qué se parecen los huevos del nido? ¿Cuál no es igual?',
  },
};

export function guideWordCount(t: GuideText): number {
  return `${t.goal} ${t.how}`.trim().split(/\s+/).length;
}
