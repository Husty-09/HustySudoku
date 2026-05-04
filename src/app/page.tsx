'use client';
import { useSudoku } from './hooks/useSudoku';
import { Board } from './components/Board';
import { NumPad } from './components/NumPad';
import { Timer } from './components/Timer';
import { Difficulty } from './types/sudoku';

const DIFFICULTIES: { label: string; value: Difficulty }[] = [
  { label: 'Fácil', value: 'easy' },
  { label: 'Médio', value: 'medium' },
  { label: 'Difícil', value: 'hard' },
];

export default function SudokuPage() {
  const {
    grid,
    status,
    difficulty,
    mistakes,
    selectedCell,
    startGame,
    selectCell,
    inputNumber,
    eraseCell,
  } = useSudoku();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
        🧩 HustySudoku
      </h1>

      <div className="flex gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            onClick={() => startGame(d.value)}
            className={`
              px-4 py-2 rounded-2xl text-sm font-semibold
              border transition-all duration-150 active:scale-95
              ${
                difficulty === d.value && status !== 'idle'
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-300'
              }
            `}
          >
            {d.label}
          </button>
        ))}
      </div>

      {status === 'idle' && (
        <p className="text-gray-500 text-sm">
          Escolha uma dificuldade para começar.
        </p>
      )}

      {status !== 'idle' && (
        <>
          <div className="flex items-center gap-6">
            <Timer status={status} />
            <span className="text-sm text-red-500 font-semibold">
              ✕ {mistakes} {mistakes === 1 ? 'erro' : 'erros'}
            </span>
          </div>

          <Board
            grid={grid}
            selectedCell={selectedCell}
            onSelectCell={selectCell}
          />

          {status === 'playing' && (
            <NumPad onInput={inputNumber} onErase={eraseCell} />
          )}

          {status === 'won' && (
            <div className="flex flex-col items-center gap-3">
              <p className="text-2xl font-bold text-green-600">
                🎉 Parabéns, você venceu!
              </p>
              <button
                onClick={() => startGame(difficulty)}
                className="px-6 py-3 bg-gray-800 text-white rounded-2xl font-semibold active:scale-95 transition-all"
              >
                Jogar novamente
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
