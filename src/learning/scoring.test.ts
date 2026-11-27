import { describe, expect, it } from 'vitest';
import { starsForGoals } from './scoring';

const stars = (cookies: number, cookiesTotal: number, quizCorrect: number, quizTotal = 3) =>
  starsForGoals({ cookies, cookiesTotal, quizCorrect, quizTotal });

describe('starsForGoals', () => {
  it('da 3 estrellas con el 80 % de las galletas y las 3 preguntas', () => {
    expect(stars(8, 10, 3)).toBe(3);
    expect(stars(10, 10, 3)).toBe(3);
  });

  it('sin las 3 preguntas, el 80 % no basta para 3', () => {
    expect(stars(10, 10, 2)).toBe(2);
  });

  it('con las 3 preguntas pero menos del 80 % de galletas da 2', () => {
    expect(stars(7, 10, 3)).toBe(2);
  });

  it('las dos primeras estrellas son independientes', () => {
    expect(stars(5, 10, 0)).toBe(1);
    expect(stars(2, 10, 1)).toBe(1);
    expect(stars(5, 10, 1)).toBe(2);
  });

  it('el 50 % se cuenta con la mitad justa', () => {
    expect(stars(1, 3, 0)).toBe(0);
    expect(stars(2, 3, 0)).toBe(1);
    expect(stars(4, 9, 0)).toBe(0);
  });

  it('sin ningún objetivo da 0 estrellas', () => {
    expect(stars(4, 10, 0)).toBe(0);
    expect(stars(0, 10, 0)).toBe(0);
  });

  it('una fase sin galletas cuenta como el 100 %', () => {
    expect(stars(0, 0, 0)).toBe(1);
    expect(stars(0, 0, 3)).toBe(3);
  });

  it('acota los valores fuera de rango', () => {
    expect(stars(-3, 10, -1)).toBe(0);
    expect(stars(15, 10, 9)).toBe(3);
    expect(stars(10, 10, 0, 0)).toBe(1);
  });
});
