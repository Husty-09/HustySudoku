'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { getSudoku } from 'sudoku-gen';
import { getDailyPuzzle } from '../utils/dailyPuzzle';
import { hapticError, hapticSuccess } from '../utils/haptics';
import { SudokuGrid, Difficulty, GameStatus } from '../types/sudoku';

/**
 * Gera um puzzle mapeando dificuldade do jogo para a biblioteca:
 *   easy   -> lib 'easy' + 12 celulas extras reveladas (bem mais facil)
 *   medium -> lib 'easy' (equivale ao antigo easy)
 *   hard   -> lib 'hard'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getSudoku = getSudoku as any;

function generatePuzzle(difficulty: Difficulty): { puzzle: string; solution: string } {
  if (difficulty === 'easy') {
    const result = _getSudoku('easy');
    const arr = result.puzzle.split('');
    const empties: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (arr[i] === '-') empties.push(i);
    }
    for (let i = empties.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [empties[i], empties[j]] = [empties[j], empties[i]];
    }
    for (const idx of empties.slice(0, 12)) {
      arr[idx] = result.solution[idx];
    }
    return { puzzle: arr.join(''), solution: result.solution };
  }
  if (difficulty === 'medium') {
    return _getSudoku('easy');
  }
  return _getSudoku(difficulty);
}

function parseGrid(puzzle: string): SudokuGrid {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => {
      const char = puzzle[row * 9 + col];
      return {
        value:         char === '-' ? null : parseInt(char, 10),
        isFixed:       char !== '-',
        isError:       false,
        isCorrect:     false,
        notes:         [],
        isHighlighted: false,
        isInRowOrCol:  false,
        isInBlock:     false,
      };
    })
  );
}

function sameBlock(row: number, col: number, r: number, c: number) {
  return (
    Math.floor(r / 3) === Math.floor(row / 3) &&
    Math.floor(c / 3) === Math.floor(col / 3)
  );
}

export function useSudoku() {

  /* Refs para cleanup de timers (evita memory leak / stale state) */
  const errorTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState({
    grid: Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value:         null,
        isFixed:       false,
        isError:       false,
        isCorrect:     false,
        notes:         [] as number[],
        isHighlighted: false,
        isInRowOrCol:  false,
        isInBlock:     false,
      }))
    ) as SudokuGrid,
    solution:      '' as string,
    selectedCell:  null as { row: number; col: number } | null,
    difficulty:    'easy' as Difficulty,
    status:        'idle' as GameStatus,
    mistakes:      0,
    gameId:        0,
    isNotesMode:   false,
    isPaused:      false,
    isDaily:       false,
    autoCheck:     true,
    gameStartTime: 0,
  });

  const startGame = useCallback((difficulty: Difficulty, withAutoCheck = true) => {
    /* Cancela timers pendentes ao iniciar novo jogo */
    if (errorTimerRef.current)   clearTimeout(errorTimerRef.current);
    if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
    const { puzzle, solution } = generatePuzzle(difficulty);
    setState((prev) => ({
      grid:          parseGrid(puzzle),
      solution,
      selectedCell:  null,
      difficulty,
      status:        'playing',
      mistakes:      0,
      gameId:        prev.gameId + 1,
      isNotesMode:   false,
      isPaused:      false,
      isDaily:       false,
      autoCheck:     withAutoCheck,
      gameStartTime: Date.now(),
    }));
  }, []);

  const startDailyGame = useCallback((difficulty: Difficulty) => {
    if (errorTimerRef.current)   clearTimeout(errorTimerRef.current);
    if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
    const { puzzle, solution } = getDailyPuzzle(difficulty);
    setState((prev) => ({
      grid:          parseGrid(puzzle),
      solution,
      selectedCell:  null,
      difficulty,
      status:        'playing',
      mistakes:      0,
      gameId:        prev.gameId + 1,
      isNotesMode:   false,
      isPaused:      false,
      isDaily:       true,
      autoCheck:     true,
      gameStartTime: Date.now(),
    }));
  }, []);

  const setPaused = useCallback((value: boolean) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      return { ...prev, isPaused: value };
    });
  }, []);

  const togglePause = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      return { ...prev, isPaused: !prev.isPaused };
    });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setState((prev) => {
      if (prev.isPaused) return prev;
      const selectedValue = prev.grid[row][col].value;
      const newGrid = prev.grid.map((r, ri) =>
        r.map((c, ci) => ({
          ...c,
          isInRowOrCol: (ri === row || ci === col) && !(ri === row && ci === col),
          isInBlock:    sameBlock(row, col, ri, ci) && !(ri === row && ci === col),
          isHighlighted:
            selectedValue !== null &&
            c.value === selectedValue &&
            !(ri === row && ci === col),
        }))
      );
      return { ...prev, grid: newGrid, selectedCell: { row, col } };
    });
  }, []);

  const toggleNotesMode = useCallback(() => {
    setState((prev) => ({ ...prev, isNotesMode: !prev.isNotesMode }));
  }, []);

  const inputNumber = useCallback((num: number) => {
    setState((prev) => {
      if (!prev.selectedCell || prev.status !== 'playing' || prev.isPaused) return prev;
      const { row, col } = prev.selectedCell;
      const cell = prev.grid[row][col];
      if (cell.isFixed) return prev;

      /* Modo rascunho */
      if (prev.isNotesMode) {
        if (cell.value !== null) return prev;
        const has = cell.notes.includes(num);
        const newNotes = has
          ? cell.notes.filter((n) => n !== num)
          : [...cell.notes, num].sort((a, b) => a - b);
        return {
          ...prev,
          grid: prev.grid.map((r, ri) =>
            r.map((c, ci) =>
              ri === row && ci === col ? { ...c, notes: newNotes } : c
            )
          ),
        };
      }

      const correctValue = parseInt(prev.solution[row * 9 + col], 10);

      /* Sem verificacao automatica */
      if (!prev.autoCheck) {
        const newGrid = prev.grid.map((r, ri) =>
          r.map((c, ci) =>
            ri === row && ci === col
              ? { ...c, value: num, isError: false, isCorrect: false, notes: [] }
              : c
          )
        );
        const allFilled = newGrid.every((r) => r.every((c) => c.value !== null));
        if (allFilled) {
          const allCorrect = newGrid.every((r, ri) =>
            r.every((c, ci) => {
              if (c.isFixed) return true;
              return c.value === parseInt(prev.solution[ri * 9 + ci], 10);
            })
          );
          if (allCorrect) {
            hapticSuccess();
            return { ...prev, grid: newGrid, status: 'won' };
          }
        }
        return { ...prev, grid: newGrid };
      }

      /* Com verificacao automatica */
      const isError = num !== correctValue;
      if (isError) hapticError(); else hapticSuccess();

      let newGrid = prev.grid.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col
            // Se errou: mantem as notas para restaurar apos o flash
            ? { ...c, value: num, isError, isCorrect: !isError, notes: isError ? c.notes : [] }
            : c
        )
      );

      if (!isError) {
        newGrid = newGrid.map((r, ri) =>
          r.map((c, ci) => {
            if (ri === row && ci === col) return c;
            const peer = ri === row || ci === col || sameBlock(row, col, ri, ci);
            if (peer && c.notes.includes(num)) {
              return { ...c, notes: c.notes.filter((n) => n !== num) };
            }
            return c;
          })
        );
      }

      const newMistakes = isError ? prev.mistakes + 1 : prev.mistakes;
      const lost = newMistakes >= 3;
      const won  = !lost && newGrid.every((r) => r.every((c) => c.value !== null && !c.isError));

      if (isError && !lost) {
        /* Cancela timer anterior antes de criar novo */
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
          errorTimerRef.current = null;
          setState((s) => ({
            ...s,
            grid: s.grid.map((r, ri) =>
              r.map((c, ci) =>
                ri === row && ci === col && c.isError
                  // Restaura: limpa o valor errado mas mantem as notas
                  ? { ...c, value: null, isError: false }
                  : c
              )
            ),
          }));
        }, 700);
      }

      if (!isError) {
        if (correctTimerRef.current) clearTimeout(correctTimerRef.current);
        correctTimerRef.current = setTimeout(() => {
          correctTimerRef.current = null;
          setState((s) => ({
            ...s,
            grid: s.grid.map((r, ri) =>
              r.map((c, ci) =>
                ri === row && ci === col ? { ...c, isCorrect: false } : c
              )
            ),
          }));
        }, 600);
      }

      return {
        ...prev,
        grid:     newGrid,
        mistakes: newMistakes,
        status:   lost ? 'lost' : won ? 'won' : 'playing',
      };
    });
  }, []);

  const checkBoard = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      let hasError = false;
      const newGrid = prev.grid.map((r, ri) =>
        r.map((c, ci) => {
          if (c.isFixed || c.value === null) return c;
          const correct = parseInt(prev.solution[ri * 9 + ci], 10);
          const err = c.value !== correct;
          if (err) hasError = true;
          return { ...c, isError: err };
        })
      );
      const allFilled = newGrid.every((r) => r.every((c) => c.value !== null));
      if (!hasError && allFilled) return { ...prev, grid: newGrid, status: 'won' };
      return { ...prev, grid: newGrid };
    });
  }, []);

  const eraseCell = useCallback(() => {
    setState((prev) => {
      if (!prev.selectedCell || prev.status !== 'playing') return prev;
      const { row, col } = prev.selectedCell;
      if (prev.grid[row][col].isFixed) return prev;
      return {
        ...prev,
        grid: prev.grid.map((r, ri) =>
          r.map((c, ci) =>
            ri === row && ci === col
              ? { ...c, value: null, isError: false, isCorrect: false, notes: [] }
              : c
          )
        ),
      };
    });
  }, []);

  const goHome = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'idle', selectedCell: null, isPaused: false }));
  }, []);

  /* Computacoes memoizadas — evitam recalculo em cada render */
  const completedNumbers = useMemo(() => {
    const set = new Set<number>();
    for (let n = 1; n <= 9; n++) {
      const count = state.grid.flat().filter((c) => c.value === n && !c.isError).length;
      if (count === 9) set.add(n);
    }
    return set;
  }, [state.grid]);

  const isBoardFull = useMemo(
    () => state.grid.every((r) => r.every((c) => c.value !== null)),
    [state.grid]
  );

  return {
    ...state,
    completedNumbers,
    isBoardFull,
    startGame,
    startDailyGame,
    goHome,
    selectCell,
    inputNumber,
    eraseCell,
    toggleNotesMode,
    togglePause,
    setPaused,
    checkBoard,
  };
}
