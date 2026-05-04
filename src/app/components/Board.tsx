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
    <div className="animate-fade-in rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', boxShadow: '0 0 40px rgba(7,182,213,0.08)' }}
    >
      <div className="grid grid-cols-9">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell.value}
              isFixed={cell.isFixed}
              isError={cell.isError}
              isHighlighted={cell.isHighlighted}
              isInRowOrCol={cell.isInRowOrCol}
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
    </div>
  );
}
