'use client';
import { useState } from 'react';
import { SudokuGrid } from './types/sudoku';

export default function SudokuPage() {
  //caixa de memória para o tabuleiro
  const [grid, setGrid] = useState<SudokuGrid>(
  Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({ value: null, isFixed: false }))
  )
);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Husty Sudoku</h1>

      {/* aqui ficará o tabuleiro */}
<div className="grid grid-cols-9 gap-1 bg-gray-400 p-1 rounded-lg">
  {grid.map((row, rowIndex) => (
  row.map((cell, colIndex) => (
    <div 
      key={`${rowIndex}-${colIndex}`} 
      className="w-10 h-10 bg-white flex items-center justify-center text-black border border-gray-200"
    >
      {cell.value}
    </div>
  ))
))}

      </div>
    </main>
  );
}