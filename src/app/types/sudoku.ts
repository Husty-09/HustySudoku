export interface SudokuCell {
  value: number | null;
  isFixed: boolean;
  isError: boolean;
  isHighlighted: boolean;
  isInRowOrCol: boolean; // mesma linha ou coluna da célula selecionada
}

export interface SudokuGame {
  grid: SudokuGrid;
  status: GameStatus;
  difficulty: Difficulty;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type SudokuGrid = SudokuCell[][];