'use client';
import { SudokuGrid } from '../types/sudoku';
import { Cell } from './Cell';

interface BoardProps {
  grid: SudokuGrid;
  selectedCell: { row: number; col: number } | null;
  onSelectCell: (row: number, col: number) => void;
}

export function Board({ grid, selectedCell, onSelectCell }: BoardProps) {
  return (
    <div className="grid grid-cols-9 border-2 border-gray-700 rounded-2xl overflow-hidden shadow-lg">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell.value}
            isFixed={cell.isFixed}
            isError={cell.isError}
            isHighlighted={cell.isHighlighted}
            isSelected={
              selectedCell !== null &&
              selectedCell.row === rowIndex &&
              selectedCell.col === colIndex
            }
            row={rowIndex}
            col={colIndex}
            onSelect={onSelectCell}
          />
        ))
      )}
    </div>
  );
}
