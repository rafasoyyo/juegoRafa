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
};

export function guideWordCount(t: GuideText): number {
  return `${t.goal} ${t.how}`.trim().split(/\s+/).length;
}
