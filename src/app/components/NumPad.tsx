'use client';

import { memo } from 'react';

interface NumPadProps {
  onInput: (num: number) => void;
  onErase: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
  completedNumbers: Set<number>;
}

export const NumPad = memo(function NumPad({
  onInput, onErase, isNotesMode, onToggleNotes, completedNumbers,
}: NumPadProps) {
  return (
    <div className="animate-slide-up flex flex-col items-center gap-2 w-full max-w-xs mx-auto">

      {/* Toggle rascunho */}
      <button
        onClick={onToggleNotes}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold border transition-all duration-200 active:scale-95"
        style={isNotesMode
          ? { background: 'rgba(var(--accent-rgb),0.18)', borderColor: 'var(--accent)', color: 'var(--accent)' }
          : { background: 'rgba(var(--fg-rgb),0.05)', borderColor: 'rgba(var(--fg-rgb),0.12)', color: 'rgba(var(--fg-rgb),0.55)' }
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        </svg>
        Rascunho {isNotesMode ? 'ativo' : 'desativado'}
      </button>

      {/* Grade de numeros */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const done = completedNumbers.has(num);
          return (
            <button
              key={num}
              onClick={() => !done && onInput(num)}
              disabled={done}
              className={`
                h-14 text-xl font-bold rounded-2xl border
                transition-all duration-150 relative
                ${done
                  ? 'numpad-done'
                  : 'numpad-active active:scale-95'
                }
              `}
            >
              {done ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="mx-auto"
                  style={{ stroke: 'rgba(var(--accent-rgb), 0.45)' }}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <>
                  {num}
                  {isNotesMode && (
                    <span
                      className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Apagar */}
      <button
        onClick={onErase}
        className="w-full h-12 text-sm font-semibold rounded-2xl border border-red-500/30 text-red-400 transition-all duration-150 active:scale-95 hover:bg-red-500/20"
        style={{ background: 'rgba(239,68,68,0.1)' }}
      >
        Apagar
      </button>

    </div>
  );
});
