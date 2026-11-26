/**
 * Interruptores de desarrollo: piezas que solo se activan con `npm run dev` hasta que estén
 * terminadas. Para publicar una, se quita su interruptor del sitio que lo usa.
 */

export type FlagId = 'mundo-2-rio';

export type Flags = Readonly<Record<FlagId, boolean>>;

export const FLAGS: Flags = {
  /** Mundo 2, «El río de los números» (`docs/MUNDO-2.md`), hasta el paso 9 del plan. */
  'mundo-2-rio': import.meta.env.DEV,
};
