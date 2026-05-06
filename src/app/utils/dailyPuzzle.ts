import { getSudoku } from 'sudoku-gen';
import { Difficulty } from '../types/sudoku';

/** Data de hoje no formato YYYY-MM-DD (UTC para ser igual em todos os dispositivos) */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/** Hash deterministico de uma string para inteiro (djb2) */
function hashCode(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (((h << 5) + h) + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

/** LCG -- gerador pseudoaleatório com semente */
function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Guard de re-entrancia: impede que duas chamadas simultaneas
 * (improvavel em JS single-thread, mas defensivo) corrompam Math.random.
 */
let _generating = false;

/**
 * Gera o puzzle do dia: mesmo resultado para qualquer dispositivo
 * na mesma data + dificuldade.
 *
 * Seguranca do monkey-patch: getSudoku() é sincrono e JS é single-thread,
 * portanto nao ha janela de tempo entre a substituicao e a restauracao
 * de Math.random. A guard _generating bloqueia qualquer chamada re-entrante.
 */
export function getDailyPuzzle(difficulty: Difficulty, dateStr?: string) {
  if (_generating) {
    throw new Error('getDailyPuzzle: chamada re-entrante detectada');
  }

  const date = dateStr ?? getTodayString();
  const seed = hashCode(`${date}|${difficulty}`);
  const rng  = seededRandom(seed);

  const orig = Math.random;
  _generating = true;
  Math.random = rng;
  try {
    return getSudoku(difficulty);
  } finally {
    Math.random = orig;
    _generating = false;
  }
}
