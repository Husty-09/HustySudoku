'use client';
import { useSudoku } from './hooks/useSudoku';
import { Board } from './components/Board';
import { NumPad } from './components/NumPad';
import { Timer } from './components/Timer';
import { Difficulty } from './types/sudoku';

const DIFFICULTIES: { label: string; value: Difficulty }[] = [
  { label: 'Fácil',   value: 'easy'   },
  { label: 'Médio',   value: 'medium' },
  { label: 'Difícil', value: 'hard'   },
];

const MAX_MISTAKES = 3;

export default function SudokuPage() {
  const {
    grid, status, difficulty, mistakes, selectedCell, gameId,
    startGame, selectCell, inputNumber, eraseCell, goHome,
  } = useSudoku();

  const isPlaying = status === 'playing';
  const isActive  = status === 'playing' || status === 'won' || status === 'lost';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">

      {/* Logo / título */}
      <div className="flex flex-col items-center gap-1 animate-fade-in">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Husty<span style={{ color: '#07b6d5' }}>Sudoku</span>
        </h1>
        <p className="text-xs text-white/40 tracking-widest uppercase">Mobile PWA</p>
      </div>

      {/* Botões de dificuldade */}
      <div className="flex gap-2 animate-fade-in">
        {DIFFICULTIES.map((d) => {
          const isSelected = difficulty === d.value && isActive;
          const isLocked   = isActive && difficulty !== d.value;
          return (
            <button
              key={d.value}
              onClick={() => !isLocked && startGame(d.value)}
              disabled={isLocked}
              className={`
                px-4 py-2 rounded-2xl text-sm font-semibold
                border transition-all duration-200 active:scale-95
                ${isLocked ? 'opacity-30 cursor-not-allowed border-white/10 text-white/40' : ''}
              `}
              style={isSelected
                ? { background: 'rgba(7,182,213,0.2)', borderColor: '#07b6d5', color: '#07b6d5' }
                : !isLocked
                  ? { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
                  : {}
              }
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Tela idle */}
      {status === 'idle' && (
        <p className="text-white/40 text-sm animate-fade-in">
          Escolha uma dificuldade para começar.
        </p>
      )}

      {/* Jogo ativo */}
      {isActive && (
        <>
          {/* Barra superior: home + timer + erros + reiniciar */}
          <div className="flex items-center gap-4 w-full max-w-sm animate-fade-in">
            {/* Botão Home */}
            <button
              onClick={goHome}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="Voltar ao início"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon-32x32.png" alt="Home" className="w-5 h-5" />
            </button>

            {/* Timer */}
            <div className="flex-1 flex justify-center">
              <Timer key={gameId} status={status} />
            </div>

            {/* Corações de vida */}
            <div className="flex gap-1">
              {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
                <span key={i} className="text-lg transition-all duration-300"
                  style={{ filter: i < mistakes ? 'grayscale(1) opacity(0.3)' : 'none' }}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Botão Reiniciar */}
            <button
              onClick={() => startGame(difficulty)}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              title="Reiniciar jogo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>

          {/* Tabuleiro */}
          <Board grid={grid} selectedCell={selectedCell} onSelectCell={selectCell} />

          {/* Teclado — só aparece durante o jogo */}
          {isPlaying && (
            <NumPad onInput={inputNumber} onErase={eraseCell} />
          )}

          {/* Tela de vitória */}
          {status === 'won' && (
            <div className="flex flex-col items-center gap-4 animate-pop-in">
              <div className="text-5xl">🏆</div>
              <p className="text-2xl font-black text-white">
                Você <span style={{ color: '#10b77f' }}>venceu!</span>
              </p>
              <p className="text-white/40 text-sm">Escolha a próxima dificuldade</p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => startGame(d.value)}
                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all duration-200 active:scale-95"
                    style={d.value === difficulty
                      ? { background: 'rgba(16,183,127,0.25)', borderColor: '#10b77f', color: '#10b77f' }
                      : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tela de derrota */}
          {status === 'lost' && (
            <div className="flex flex-col items-center gap-4 animate-pop-in">
              <div className="text-5xl">💀</div>
              <p className="text-2xl font-black text-white">
                Game <span className="text-red-400">Over</span>
              </p>
              <p className="text-white/40 text-sm">3 erros — escolha a dificuldade</p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => startGame(d.value)}
                    className="px-5 py-2.5 rounded-2xl text-sm font-semibold border transition-all duration-200 active:scale-95"
                    style={d.value === difficulty
                      ? { background: 'rgba(239,68,68,0.25)', borderColor: 'rgba(239,68,68,0.6)', color: '#f87171' }
                      : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
