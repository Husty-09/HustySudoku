'use client';
import { SudokuGrid } from '../types/sudoku';
import { Cell } from './Cell';

interface BoardProps {
  grid: SudokuGrid;
  selectedCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
  isWon: boolean;
}

export function Board({ grid, selectedCell, onSelectCell, isWon }: BoardProps) {
  return (
    <div
      className="animate-fade-in w-full rounded-3xl overflow-hidden shadow-2xl"
      style={{
        border: '2px solid rgba(var(--fg-rgb), 0.18)',
        background: 'var(--board-bg)',
        boxShadow: '0 0 40px rgba(var(--accent-rgb), 0.10)',
      }}
    >
      <div className="grid grid-cols-9">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              notes={cell.notes}
              isFixed={cell.isFixed}
              isError={cell.isError}
              isCorrect={cell.isCorrect}
              isHighlighted={cell.isHighlighted}
              isInRowOrCol={cell.isInRowOrCol}
              isInBlock={cell.isInBlock}
              isSelected={
                selectedCell !== null &&
                selectedCell.row === rowIndex &&
                selectedCell.col === colIndex
              }
              isWon={isWon}
              winDelay={(rowIndex + colIndex) * 60}
              row={rowIndex}
              col={colIndex}
              onSelect={onSelectCell}
            />
          ))
        )}
      </div>
    </div>
  );
}
