'use client';
import { useEffect, useRef, useState } from 'react';
import { useSudoku } from './hooks/useSudoku';
import { useStats } from './hooks/useStats';
import { useTheme } from './hooks/useTheme';
import { Board } from './components/Board';
import { NumPad } from './components/NumPad';
import { Timer } from './components/Timer';
import { StatsModal } from './components/StatsModal';
import { getTodayString } from './utils/dailyPuzzle';
import { Difficulty } from './types/sudoku';

const DIFFICULTIES: { label: string; value: Difficulty }[] = [
  { label: 'Fácil',   value: 'easy'   },
  { label: 'Médio',   value: 'medium' },
  { label: 'Difícil', value: 'hard'   },
];

const MAX_MISTAKES = 3;
const TODAY = getTodayString();

export default function SudokuPage() {
  const {
    grid, status, difficulty, mistakes, selectedCell, gameId,
    isNotesMode, isPaused, isDaily, autoCheck, completedNumbers,
    isBoardFull, gameStartTime,
    startGame, startDailyGame, selectCell, inputNumber, eraseCell,
    goHome, toggleNotesMode, togglePause, setPaused, checkBoard,
  } = useSudoku();

  const { stats, recordWin, recordLoss, recordDailyWin, isDailyDone, resetStats } = useStats();
  const { theme, setTheme } = useTheme();
  const [showStats, setShowStats] = useState(false);
  const dailyDone = isDailyDone(TODAY, 'medium');
  const prevStatusRef = useRef(status);

  /* ── Grava estatísticas no fim de jogo ──────────── */
  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === 'playing') {
      const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      if (status === 'won') {
        if (isDaily) recordDailyWin(TODAY, difficulty, elapsed);
        else recordWin(difficulty, elapsed);
      } else if (status === 'lost') {
        recordLoss(difficulty);
      }
    }
    prevStatusRef.current = status;
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Pause automático ao sair da tela ───────────── */
  useEffect(() => {
    const handler = () => { if (document.hidden) setPaused(true); };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [setPaused]);

  const isPlaying = status === 'playing';
  const isActive  = status === 'playing' || status === 'won' || status === 'lost';

  /* ══════════════════════════════════════════════════
     TELA INICIAL
  ══════════════════════════════════════════════════ */
  if (!isActive) {
    return (
      <main className="select-none h-dvh flex flex-col items-center justify-center gap-5 px-6 relative">

        {/* Botão de tema — canto superior direito */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          className="absolute top-4 right-4 w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active:scale-90 animate-fade-in"
          style={{
            background: 'rgba(var(--fg-rgb),0.05)',
            borderColor: 'rgba(var(--fg-rgb),0.1)',
          }}
        >
          {theme === 'light' ? (
            /* Lua */
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
              fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ stroke: 'rgba(var(--fg-rgb),0.65)' }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            /* Sol */
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
              fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ stroke: 'rgba(var(--fg-rgb),0.65)' }}>
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1"  x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1"  y1="12" x2="3"  y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center gap-1 animate-fade-in">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'rgba(var(--fg-rgb),0.95)' }}>
            Husty<span style={{ color: 'var(--accent)' }}>Sudoku</span>
          </h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(var(--fg-rgb),0.35)' }}>
            Mobile PWA
          </p>
        </div>

        {/* Dificuldades */}
        <div className="flex gap-2 animate-fade-in">
          {DIFFICULTIES.map((d) => (
            <button key={d.value} onClick={() => startGame(d.value)}
              className="px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(var(--fg-rgb),0.05)',
                borderColor: 'rgba(var(--fg-rgb),0.12)',
                color: 'rgba(var(--fg-rgb),0.75)',
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* ── Pesadelo ── */}
        <button
          onClick={() => startGame('easy', false)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-200 active:scale-95 animate-fade-in"
          style={{ background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.28)', color: 'rgba(239,68,68,0.75)' }}
        >
          <span>💀</span>
          Pesadelo
        </button>

        {/* ── Desafio do dia ── */}
        <button
          onClick={() => !dailyDone && startDailyGame('medium')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-200 active:scale-95 animate-fade-in"
          style={dailyDone
            ? { background: 'rgba(var(--accent-rgb),0.12)', borderColor: 'rgba(var(--accent-rgb),0.35)', color: 'rgba(var(--accent-rgb),0.6)', cursor: 'default' }
            : { background: 'rgba(var(--accent-rgb),0.08)', borderColor: 'rgba(var(--accent-rgb),0.25)', color: 'rgba(var(--accent-rgb),0.85)' }
          }
        >
          <span>📅</span>
          {dailyDone ? `Desafio do dia concluído ✓` : `Desafio do dia — ${TODAY}`}
        </button>

        {/* ── Estatísticas ── */}
        <button onClick={() => setShowStats(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-200 active:scale-95 animate-fade-in"
          style={{
            background: 'rgba(var(--fg-rgb),0.04)',
            borderColor: 'rgba(var(--fg-rgb),0.1)',
            color: 'rgba(var(--fg-rgb),0.5)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6"  y1="20" x2="6"  y2="14" />
          </svg>
          Estatísticas
        </button>

        {showStats && (
          <StatsModal stats={stats} onClose={() => setShowStats(false)} onReset={resetStats} />
        )}
      </main>
    );
  }

  /* ══════════════════════════════════════════════════
     JOGO ATIVO
  ══════════════════════════════════════════════════ */
  return (
    <main className="select-none h-dvh flex flex-col">

      {/* ── TOP BAR ──────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-3 pt-3 pb-1 animate-fade-in">

        {/* Home */}
        <button onClick={goHome}
          className="flex items-center justify-center w-11 h-11 rounded-2xl border transition-all active:scale-90"
          style={{ background: 'rgba(var(--accent-rgb),0.1)', borderColor: 'rgba(var(--accent-rgb),0.25)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon-32x32.png" alt="Home" className="w-6 h-6" />
        </button>

        {/* Timer + badges */}
        <div className="flex-1 flex flex-col items-center">
          <Timer key={gameId} status={status} isPaused={isPaused} />
          {isDaily && (
            <span className="text-[9px] font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(var(--accent-rgb),0.6)' }}>📅 diário</span>
          )}
          {!isDaily && !autoCheck && (
            <span className="text-[9px] font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(239,68,68,0.6)' }}>💀 pesadelo</span>
          )}
        </div>

        {/* Corações */}
        {autoCheck && (
          <div className="flex gap-1">
            {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
              <span key={i} className="text-lg transition-all duration-300"
                style={{ filter: i < mistakes ? 'grayscale(1) opacity(0.3)' : 'none' }}>❤️</span>
            ))}
          </div>
        )}

        {/* Pause */}
        {isPlaying && (
          <button onClick={togglePause}
            className="flex items-center justify-center w-11 h-11 rounded-2xl border border-white/10 transition-all active:scale-90"
            style={{ background: isPaused ? 'rgba(var(--accent-rgb),0.15)' : 'rgba(var(--fg-rgb),0.05)' }}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                stroke="none" style={{ fill: 'var(--accent)' }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" strokeWidth="2.5" strokeLinecap="round"
                style={{ stroke: 'rgba(var(--fg-rgb),0.65)' }}>
                <line x1="6" y1="4" x2="6" y2="20"/><line x1="18" y1="4" x2="18" y2="20"/>
              </svg>
            )}
          </button>
        )}

        {/* Reiniciar */}
        <button onClick={() => startGame(difficulty, autoCheck)}
          className="flex items-center justify-center w-11 h-11 rounded-2xl border border-white/10 transition-all active:scale-90"
          style={{ background: 'rgba(var(--fg-rgb),0.05)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ stroke: 'rgba(var(--fg-rgb),0.65)' }}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      {/* ── TABULEIRO ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-3 min-h-0 py-2 relative">
        <div style={{ width: 'min(100%, calc(100dvh - 272px))' }}>
          <Board
            grid={grid}
            selectedCell={isPaused ? null : selectedCell}
            onSelectCell={selectCell}
            isWon={status === 'won'}
          />
        </div>

        {/* Overlay de pause */}
        {isPaused && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={togglePause}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
              stroke="none" style={{ fill: 'var(--accent)' }}>
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <p className="text-white/60 text-sm font-semibold tracking-wide">Toque para continuar</p>
          </div>
        )}
      </div>

      {/* ── SEÇÃO INFERIOR ───────────────────────────── */}
      <div className="shrink-0 px-3 pb-6 pt-1">

        {/* Teclado numérico */}
        {isPlaying && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center w-full">
              <NumPad
                onInput={inputNumber}
                onErase={eraseCell}
                isNotesMode={isNotesMode}
                onToggleNotes={toggleNotesMode}
                completedNumbers={completedNumbers}
              />
            </div>

            {/* Botão "Verificar" — só no modo sem verificação automática */}
            {!autoCheck && (
              <button
                onClick={checkBoard}
                disabled={!isBoardFull}
                className="w-full max-w-xs py-3 rounded-2xl text-sm font-bold border transition-all active:scale-95"
                style={isBoardFull
                  ? { background: 'rgba(var(--accent-rgb),0.18)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                  : { background: 'rgba(var(--fg-rgb),0.03)', borderColor: 'rgba(var(--fg-rgb),0.08)', color: 'rgba(var(--fg-rgb),0.25)', cursor: 'default' }
                }
              >
                {isBoardFull ? '✓ Verificar solução' : 'Preencha o tabuleiro para verificar'}
              </button>
            )}
          </div>
        )}

        {/* Tela de vitória */}
        {status === 'won' && (
          <div className="flex flex-col items-center gap-4 animate-pop-in">
            <div className="text-5xl">{isDaily ? '📅' : '🏆'}</div>
            <p className="text-2xl font-black" style={{ color: 'rgba(var(--fg-rgb),0.9)' }}>
              Você <span style={{ color: 'var(--accent)' }}>venceu!</span>
            </p>
            <p className="text-sm" style={{ color: 'rgba(var(--fg-rgb),0.4)' }}>Próxima dificuldade:</p>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button key={d.value} onClick={() => startGame(d.value)}
                  className="px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-200 active:scale-95"
                  style={d.value === difficulty
                    ? { background: 'rgba(var(--accent-rgb),0.2)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : { background: 'rgba(var(--fg-rgb),0.05)', borderColor: 'rgba(var(--fg-rgb),0.1)', color: 'rgba(var(--fg-rgb),0.65)' }
                  }>{d.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Tela de derrota */}
        {status === 'lost' && (
          <div className="flex flex-col items-center gap-4 animate-pop-in">
            <div className="text-5xl">💀</div>
            <p className="text-2xl font-black" style={{ color: 'rgba(var(--fg-rgb),0.9)' }}>
              Game <span className="text-red-400">Over</span>
            </p>
            <p className="text-sm" style={{ color: 'rgba(var(--fg-rgb),0.4)' }}>Tente novamente:</p>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button key={d.value} onClick={() => startGame(d.value)}
                  className="px-5 py-2.5 rounded-3xl text-sm font-semibold border transition-all duration-200 active:scale-95"
                  style={d.value === difficulty
                    ? { background: 'rgba(239,68,68,0.2)', borderColor: 'rgba(239,68,68,0.55)', color: '#f87171' }
                    : { background: 'rgba(var(--fg-rgb),0.05)', borderColor: 'rgba(var(--fg-rgb),0.1)', color: 'rgba(var(--fg-rgb),0.65)' }
                  }>{d.label}</button>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
