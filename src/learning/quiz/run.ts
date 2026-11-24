/**
 * Una prueba en marcha: tres preguntas, 3 intentos por pregunta, pistas y resultado.
 * TypeScript puro: la escena solo llama a `tap` y anima el evento que recibe.
 */

import type { HintKind, Question } from './types';

/** Intentos por pregunta: al tercer fallo la pregunta cuenta como fallada. */
export const MAX_TRIES = 3;
/** Preguntas acertadas para superar la prueba. */
export const PASS_MARK = 2;

export type Mark = 'pending' | 'correct' | 'failed';

interface QuestionState {
  fails: number;
  mark: Mark;
  /** Opciones ya tocadas bien en una pregunta de tocar varias. */
  used: Set<number>;
  /** Opciones apagadas por la pista: tocarlas no hace nada. */
  dimmed: Set<number>;
  /** En preguntas de repartir: toques ya dados a cada hueco (id de opción → cantidad). */
  filled: Map<number, number>;
}

export interface QuizRun {
  readonly questions: readonly Question[];
  index: number;
  readonly states: QuestionState[];
}

export type TapEvent =
  /** Toque sin efecto: prueba acabada, opción apagada o ya usada. */
  | { type: 'ignored' }
  /** Pregunta acertada; `next` es el índice de la siguiente o `null` si la prueba ha acabado. */
  | { type: 'correct'; option: number; next: number | null }
  /** Pieza bien tocada en una pregunta de tocar varias que aún no ha acabado. */
  | { type: 'progress'; option: number }
  /**
   * Fallo con pista: nivel 1 = repetir la demostración; nivel 2 = la pista propia (`hint`).
   * Con `dim-wrong`, `dimmed` es la opción que se apaga.
   */
  | { type: 'wrong'; option: number; level: 1 | 2; hint: HintKind; dimmed?: number }
  /** Tercer fallo: la pregunta cuenta como fallada. `answer` son las opciones que había que tocar. */
  | { type: 'failed'; option: number; answer: number[]; next: number | null };

export function createRun(questions: readonly Question[]): QuizRun {
  return {
    questions,
    index: 0,
    states: questions.map(() => ({
      fails: 0,
      mark: 'pending' as Mark,
      used: new Set<number>(),
      dimmed: new Set<number>(),
      filled: new Map<number, number>(),
    })),
  };
}

export function isFinished(run: QuizRun): boolean {
  return run.index >= run.questions.length;
}

export function currentQuestion(run: QuizRun): Question | null {
  return run.questions[run.index] ?? null;
}

export function marks(run: QuizRun): Mark[] {
  return run.states.map((s) => s.mark);
}

/** Opciones apagadas de la pregunta actual. */
export function dimmedOptions(run: QuizRun): ReadonlySet<number> {
  return run.states[run.index]?.dimmed ?? new Set();
}

/** Opciones ya tocadas bien en la pregunta actual. */
export function usedOptions(run: QuizRun): ReadonlySet<number> {
  return run.states[run.index]?.used ?? new Set();
}

/** Toques ya dados a cada hueco en una pregunta de repartir (vacío en las demás). */
export function fillLevels(run: QuizRun): ReadonlyMap<number, number> {
  return run.states[run.index]?.filled ?? new Map();
}

/** Las opciones que quedan por tocar para acertar la pregunta actual (en repartir, una vez por cada toque que falta). */
export function remainingAnswer(run: QuizRun): number[] {
  const q = currentQuestion(run);
  const st = run.states[run.index];
  if (!q || !st) return [];
  if (q.answer.form === 'choice') return [...q.answer.correct];
  if (q.answer.form === 'fill') {
    return q.answer.slots.flatMap((slot) => Array.from({ length: Math.max(0, slot.capacity - (st.filled.get(slot.option) ?? 0)) }, () => slot.option));
  }
  if (!q.answer.ordered) return q.answer.targets.filter((t) => !st.used.has(t));
  // En orden: la opción que toca ahora (o una con la misma clave), luego las siguientes.
  return q.answer.targets.slice(st.used.size);
}

/** Si tocar `option` ahora es correcto. */
function isRight(q: Question, st: QuestionState, option: number): boolean {
  if (q.answer.form === 'choice') return q.answer.correct.includes(option);
  if (q.answer.form === 'fill') {
    const slot = q.answer.slots.find((s) => s.option === option);
    if (!slot || (st.filled.get(option) ?? 0) >= slot.capacity) return false;
    return (slot.after ?? []).every((id) => isSlotFull(q, st, id));
  }
  if (!q.answer.ordered) return q.answer.targets.includes(option);
  const expected = q.answer.targets[st.used.size];
  if (expected === undefined) return false;
  const key = q.options[expected]?.key;
  return q.options[option]?.key === key;
}

function isSlotFull(q: Question, st: QuestionState, option: number): boolean {
  if (q.answer.form !== 'fill') return false;
  const slot = q.answer.slots.find((s) => s.option === option);
  return !!slot && (st.filled.get(option) ?? 0) >= slot.capacity;
}

/** Una opción incorrecta (ahora) que aún no está apagada, para la pista `dim-wrong`. */
function pickWrong(q: Question, st: QuestionState): number | undefined {
  return q.options.find((o) => !st.dimmed.has(o.id) && !st.used.has(o.id) && !isRight(q, st, o.id))?.id;
}

function advance(run: QuizRun): number | null {
  run.index += 1;
  return isFinished(run) ? null : run.index;
}

export function tap(run: QuizRun, option: number): TapEvent {
  const q = currentQuestion(run);
  const st = run.states[run.index];
  if (!q || !st) return { type: 'ignored' };
  if (!q.options.some((o) => o.id === option) || st.dimmed.has(option) || st.used.has(option)) return { type: 'ignored' };

  if (isRight(q, st, option)) {
    if (q.answer.form === 'choice') {
      st.mark = 'correct';
      return { type: 'correct', option, next: advance(run) };
    }
    if (q.answer.form === 'fill') {
      st.filled.set(option, (st.filled.get(option) ?? 0) + 1);
      if (q.answer.slots.every((slot) => isSlotFull(q, st, slot.option))) {
        st.mark = 'correct';
        return { type: 'correct', option, next: advance(run) };
      }
      return { type: 'progress', option };
    }
    st.used.add(option);
    // Al ordenar, la letra apagada solo lo estaba para este paso.
    if (q.answer.ordered) st.dimmed.clear();
    if (st.used.size >= q.answer.targets.length) {
      st.mark = 'correct';
      return { type: 'correct', option, next: advance(run) };
    }
    return { type: 'progress', option };
  }

  st.fails += 1;
  if (st.fails >= MAX_TRIES) {
    const answer = remainingAnswer(run);
    st.mark = 'failed';
    return { type: 'failed', option, answer, next: advance(run) };
  }
  const level = st.fails as 1 | 2;
  if (level === 2 && q.hint === 'dim-wrong') {
    // Se apaga la opción recién tocada si sigue siendo incorrecta; si no, otra incorrecta.
    const dimmed = !st.dimmed.has(option) ? option : pickWrong(q, st);
    if (dimmed !== undefined) st.dimmed.add(dimmed);
    return { type: 'wrong', option, level, hint: q.hint, dimmed };
  }
  return { type: 'wrong', option, level, hint: q.hint };
}

export interface QuizResult {
  correct: number;
  total: number;
  passed: boolean;
}

export function result(run: QuizRun): QuizResult {
  const correct = run.states.filter((s) => s.mark === 'correct').length;
  return { correct, total: run.questions.length, passed: correct >= PASS_MARK };
}
