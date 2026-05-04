export interface SudokuCell {
  value: number | null;
  isFixed: boolean;
  isError: boolean;
  isHighlighted: boolean;
}

export interface SudokuGame {
  grid: SudokuGrid;
  status: GameStatus;
  difficulty: Difficulty;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'won';

export type SudokuGrid = SudokuCell[][];