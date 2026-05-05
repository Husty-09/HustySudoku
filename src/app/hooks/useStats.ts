'use client';

import { useState, useCallback } from 'react';
import { AllStats, DifficultyStats, Difficulty } from '../types/sudoku';

const STORAGE_KEY = 'husty-sudoku-stats';

const DEFAULT: DifficultyStats = {
  played: 0, won: 0, bestTime: null, currentStreak: 0, maxStreak: 0,
};

const DEFAULT_ALL: AllStats = {
  easy:   { ...DEFAULT },
  medium: { ...DEFAULT },
  hard:   { ...DEFAULT },
  daily:  {},
};

function load(): AllStats {
  if (typeof window === 'undefined') return DEFAULT_ALL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ALL;
    const parsed = JSON.parse(raw) as Partial<AllStats>;
    return {
      easy:   { ...DEFAULT, ...parsed.easy },
      medium: { ...DEFAULT, ...parsed.medium },
      hard:   { ...DEFAULT, ...parsed.hard },
      daily:  parsed.daily ?? {},
    };
  } catch {
    return DEFAULT_ALL;
  }
}

function save(stats: AllStats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useStats() {
  const [stats, setStats] = useState<AllStats>(load);

  /** Vitória em jogo normal */
  const recordWin = useCallback((difficulty: Difficulty, timeSeconds: number) => {
    setStats((prev) => {
      const d = prev[difficulty];
      const streak = d.currentStreak + 1;
      const next: AllStats = {
        ...prev,
        [difficulty]: {
          played:        d.played + 1,
          won:           d.won + 1,
          bestTime:      d.bestTime === null ? timeSeconds : Math.min(d.bestTime, timeSeconds),
          currentStreak: streak,
          maxStreak:     Math.max(d.maxStreak, streak),
        } satisfies DifficultyStats,
      };
      save(next);
      return next;
    });
  }, []);

  /** Derrota em jogo normal */
  const recordLoss = useCallback((difficulty: Difficulty) => {
    setStats((prev) => {
      const d = prev[difficulty];
      const next: AllStats = {
        ...prev,
        [difficulty]: { ...d, played: d.played + 1, currentStreak: 0 },
      };
      save(next);
      return next;
    });
  }, []);

  /** Vitória no desafio diário (chave = "YYYY-MM-DD|difficulty") */
  const recordDailyWin = useCallback(
    (date: string, difficulty: Difficulty, timeSeconds: number) => {
      setStats((prev) => {
        const key = `${date}|${difficulty}`;
        const existing = prev.daily[key];
        if (existing !== undefined && existing <= timeSeconds) return prev; // não melhora
        const next: AllStats = {
          ...prev,
          daily: { ...prev.daily, [key]: timeSeconds },
        };
        save(next);
        return next;
      });
    },
    [],
  );

  /** Verifica se o desafio diário já foi concluído */
  const isDailyDone = useCallback(
    (date: string, difficulty: Difficulty) =>
      `${date}|${difficulty}` in stats.daily,
    [stats.daily],
  );

  const resetStats = useCallback(() => {
    const fresh: AllStats = {
      easy:   { ...DEFAULT },
      medium: { ...DEFAULT },
      hard:   { ...DEFAULT },
      daily:  {},
    };
    save(fresh);
    setStats(fresh);
  }, []);

  return { stats, recordWin, recordLoss, recordDailyWin, isDailyDone, resetStats };
}
