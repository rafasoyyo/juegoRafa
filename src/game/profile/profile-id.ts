/**
 * Alias, edad e id de perfil. TypeScript puro (sin Phaser) para poder probarlo en Vitest.
 */

/** Letras que ofrece el teclado en pantalla (en filas). */
export const KEYBOARD_ROWS: readonly string[] = ['ABCDEFGHI', 'JKLMNÑOPQ', 'RSTUVWXYZ'];
export const MAX_ALIAS = 12;
export const AGE_OPTIONS: readonly number[] = [3, 4, 5, 6, 7, 8];

const LETTERS = new Set(KEYBOARD_ROWS.join(''));

/** Deja solo las letras del teclado, en mayúsculas y con el máximo de letras. */
export function cleanAlias(alias: string): string {
  // Las vocales con tilde o diéresis valen como la letra base; la Ñ se conserva.
  const base = [...alias.toLocaleUpperCase('es')].map((c) => (c === 'Ñ' ? c : (c.normalize('NFD')[0] ?? c)));
  const letters = base.filter((c) => LETTERS.has(c));
  return letters.slice(0, MAX_ALIAS).join('');
}

export function isValidAge(age: number): boolean {
  return AGE_OPTIONS.includes(age);
}

export function isValidProfile(alias: string, age: number): boolean {
  return cleanAlias(alias).length > 0 && isValidAge(age);
}

/** Id del perfil: alias en minúsculas sin tildes (la Ñ pasa a `n`), un guion y la edad. */
export function profileId(alias: string, age: number): string {
  const slug = cleanAlias(alias)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z]/g, '');
  return `${slug}-${age}`;
}
