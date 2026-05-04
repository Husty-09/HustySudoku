'use client';

import { useState, useCallback } from "react";
import { getSudoku } from 'sudoku-gen';
import { SudokuGrid, Difficulty, GameStatus } from '../types/sudoku';

export function useSudoku() {
  const [state, setState] = useState({
    grid: Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null, isFixed: false, isError: false, isHighlighted: false
      }))
    ) as SudokuGrid,
    solution: '' as string,
    selectedCell: null as { row: number; col: number } | null,
    difficulty: 'easy' as Difficulty,
    status: 'idle' as GameStatus,
    mistakes: 0,
  });
}