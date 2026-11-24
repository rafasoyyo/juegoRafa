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
};

export function guideWordCount(t: GuideText): number {
  return `${t.goal} ${t.how}`.trim().split(/\s+/).length;
}
