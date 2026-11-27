/**
 * Interruptores de desarrollo: piezas que solo se activan con `npm run dev` hasta que estén
 * terminadas. Para publicar una, se quita su interruptor del sitio que lo usa.
 */

export type FlagId = 'mundo-2-rio';

export type Flags = Readonly<Record<FlagId, boolean>>;

export const FLAGS: Flags = {
  /**
   * Mundo 2, «El río de los números»: ya no lo usa ningún mundo, porque el río se abrió en el paso 9 de
   * `docs/MUNDO-2.md`. Queda como ejemplo para el siguiente mundo en construcción.
   */
  'mundo-2-rio': import.meta.env.DEV,
};
