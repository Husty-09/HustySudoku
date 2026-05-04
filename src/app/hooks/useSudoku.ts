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
    gameId: 0, // incrementado a cada novo jogo para resetar o Timer via key
  });

  const startGame = useCallback((difficulty: Difficulty) => {
    const { puzzle, solution } = getSudoku(difficulty);
    setState((prev) => ({
      grid: parseGrid(puzzle),
      solution,
      selectedCell: null,
      difficulty,
      status: 'playing',
      mistakes: 0,
      gameId: prev.gameId + 1,
    }));
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setState((prev) => {
      const selectedValue = prev.grid[row][col].value;
      const newGrid = prev.grid.map((r, ri) =>
        r.map((c, ci) => ({
          ...c,
          isHighlighted:
            selectedValue !== null &&
            c.value === selectedValue &&
            !(ri === row && ci === col),
        }))
      );
      return { ...prev, grid: newGrid, selectedCell: { row, col } };
    });
  }, []);

  const inputNumber = useCallback((num: number) => {
    setState((prev) => {
      if (!prev.selectedCell || prev.status !== 'playing') return prev;
      const { row, col } = prev.selectedCell;
      if (prev.grid[row][col].isFixed) return prev;

      const correctValue = parseInt(prev.solution[row * 9 + col], 10);
      const isError = num !== correctValue;

      const newGrid = prev.grid.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col ? { ...c, value: num, isError } : c
        )
      );

      const newMistakes = isError ? prev.mistakes + 1 : prev.mistakes;
      const lost = newMistakes >= 3;
      const won = !lost && newGrid.every((r) => r.every((c) => c.value !== null && !c.isError));

      return {
        ...prev,
        grid: newGrid,
        mistakes: newMistakes,
        status: lost ? 'lost' : won ? 'won' : 'playing',
      };
    });
  }, []);

  const eraseCell = useCallback(() => {
    setState((prev) => {
      if (!prev.selectedCell || prev.status !== 'playing') return prev;
      const { row, col } = prev.selectedCell;
      if (prev.grid[row][col].isFixed) return prev;
      const newGrid = prev.grid.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col ? { ...c, value: null, isError: false } : c
        )
      );
      return { ...prev, grid: newGrid };
    });
  }, []);

  return {
    ...state,
    startGame,
    selectCell,
    inputNumber,
    eraseCell,
  };
}