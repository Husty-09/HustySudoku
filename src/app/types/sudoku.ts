export interface SudokuCell {
  value: number | null;
  isFixed: boolean;
  isError: boolean;
  isCorrect: boolean;   // flash temporário de acerto
  notes: number[];      // candidatos escritos pelo jogador (1-9)
  isHighlighted: boolean;
  isInRowOrCol: boolean;
  isInBlock: boolean;   // mesmo bloco 3×3 da célula selecionada
}

export interface SudokuGame {
  grid: SudokuGrid;
  status: GameStatus;
  difficulty: Difficulty;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type SudokuGrid = SudokuCell[][];

export interface DifficultyStats {
  played: number;
  won: number;
  bestTime: number | null; // segundos; null = nunca venceu
  currentStreak: number;
  maxStreak: number;
}

export interface AllStats {
  easy:   DifficultyStats;
  medium: DifficultyStats;
  hard:   DifficultyStats;
  /** chave = "YYYY-MM-DD|difficulty", valor = melhor tempo em segundos */
  daily: Record<string, number>;
}