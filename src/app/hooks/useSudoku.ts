'use client';

import { useState, useCallback } from 'react';
import { getSudoku } from 'sudoku-gen';
import { SudokuGrid, Difficulty, GameStatus } from '../types/sudoku';

function parseGrid(puzzle: string): SudokuGrid {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => {
      const char = puzzle[row * 9 + col];
      return {
        value: char === '-' ? null : parseInt(char, 10),
        isFixed: char !== '-',
        isError: false,
        isHighlighted: false,
      };
    })
  );
}

export function useSudoku() {
  const [state, setState] = useState({
    grid: Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        isFixed: false,
        isError: false,
        isHighlighted: false,
      }))
    ) as SudokuGrid,
    solution: '' as string,
    selectedCell: null as { row: number; col: number } | null,
    difficulty: 'easy' as Difficulty,
    status: 'idle' as GameStatus,
    mistakes: 0,
  });

  const startGame = useCallback((difficulty: Difficulty) => {
    const { puzzle, solution } = getSudoku(difficulty);
    setState({
      grid: parseGrid(puzzle),
      solution,
      selectedCell: null,
      difficulty,
      status: 'playing',
      mistakes: 0,
    });
  }, []);

  return {
    ...state,
    startGame,
  };
}