import { getSudoku } from 'sudoku-gen';
import { Difficulty } from '../types/sudoku';

/** Data de hoje no formato YYYY-MM-DD (UTC para ser igual em todos os dispositivos) */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/** Hash determinístico de uma string → número inteiro */
function hashCode(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (((h << 5) + h) + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

/** LCG — gerador pseudoaleatório com semente */
function seededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Gera o puzzle do dia: mesmo resultado para qualquer dispositivo
 * na mesma data + dificuldade.
 */
export function getDailyPuzzle(difficulty: Difficulty, dateStr?: string) {
  const date = dateStr ?? getTodayString();
  const seed = hashCode(`${date}|${difficulty}`);
  const rng  = seededRandom(seed);

  const orig = Math.random;
  Math.random = rng;
  try {
    return getSudoku(difficulty);
  } finally {
    Math.random = orig;
  }
}
