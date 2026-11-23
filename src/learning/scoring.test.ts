import { describe, expect, it } from 'vitest';
import { starsFor } from './scoring';

describe('starsFor', () => {
  it('da 1 estrella por llegar sin golpear bloques', () => {
    expect(starsFor(0, 10)).toBe(1);
  });

  it('da 2 estrellas con la mitad de los bloques', () => {
    expect(starsFor(5, 10)).toBe(2);
    expect(starsFor(2, 3)).toBe(2);
  });

  it('da 1 estrella con menos de la mitad', () => {
    expect(starsFor(4, 10)).toBe(1);
    expect(starsFor(1, 3)).toBe(1);
  });

  it('da 3 estrellas con todos los bloques', () => {
    expect(starsFor(10, 10)).toBe(3);
  });

  it('da 3 estrellas en un nivel sin bloques', () => {
    expect(starsFor(0, 0)).toBe(3);
  });

  it('nunca da 0 ni más de 3', () => {
    expect(starsFor(-2, 4)).toBe(1);
    expect(starsFor(9, 4)).toBe(3);
  });
});
