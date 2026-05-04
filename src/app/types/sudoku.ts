export interface SudokuCell {
  value: number | null; 
  isFixed: boolean;
}

export type SudokuGrid = SudokuCell[][];