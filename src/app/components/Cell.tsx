'use client';

import type { CSSProperties } from 'react';

interface CellProps {
  value: number | null;
  notes: number[];
  isFixed: boolean;
  isError: boolean;
  isCorrect: boolean;
  isHighlighted: boolean;
  isInRowOrCol: boolean;
  isInBlock: boolean;
  isSelected: boolean;
  isWon: boolean;
  winDelay: number;   // ms — delay na animação de cascata de vitória
  row: number;
  col: number;
  onSelect: (row: number, col: number) => void;
}

/** Bordas grossas 3×3, usando variável CSS para cor */
function blockBorderStyle(row: number, col: number): CSSProperties {
  const c = 'rgba(var(--fg-rgb), 0.22)';
  const s: CSSProperties = {};
  if (row % 3 === 0) { s.borderTopWidth    = '2px'; s.borderTopColor    = c; }
  if (col % 3 === 0) { s.borderLeftWidth   = '2px'; s.borderLeftColor   = c; }
  if (row === 8)     { s.borderBottomWidth = '2px'; s.borderBottomColor = c; }
  if (col === 8)     { s.borderRightWidth  = '2px'; s.borderRightColor  = c; }
  return s;
}

export function Cell({
  value, notes, isFixed, isError, isCorrect,
  isHighlighted, isInRowOrCol, isInBlock,
  isSelected, isWon, winDelay, row, col, onSelect,
}: CellProps) {

  const isAnimatingWin = isWon && value !== null;

  /* ── Background ─────────────────────────────────── */
  let background = 'transparent';
  if (!isAnimatingWin) {
    if (isError)           background = 'rgba(239,68,68,0.45)';
    else if (isCorrect)    background = 'rgba(var(--accent-rgb), 0.3)';
    else if (isSelected)   background = 'rgba(var(--accent-rgb), 0.22)';
    else if (isHighlighted) background = 'rgba(var(--accent-rgb), 0.14)';
    else if (isInBlock)    background = 'rgba(var(--fg-rgb), 0.05)';
    else if (isInRowOrCol) background = 'rgba(var(--fg-rgb), 0.03)';
  }

  /* ── Cor do texto ───────────────────────────────── */
  let color: string;
  if (isError)      color = '#fca5a5';
  else if (isFixed) color = 'rgba(var(--fg-rgb), 0.9)';
  else              color = 'var(--accent)';

  /* ── Classe de animação ─────────────────────────── */
  let animClass = '';
  if (isAnimatingWin)    animClass = 'animate-win-cell';
  else if (isError)      animClass = 'animate-shake';
  else if (isCorrect)    animClass = 'animate-correct';
  else if (isSelected)   animClass = 'animate-glow';

  const ringClass = isError ? 'ring-2 ring-red-500/60' : '';
  const showNotes = !value && notes.length > 0;

  return (
    <button
      onClick={() => onSelect(row, col)}
      className={`
        aspect-square w-full flex items-center justify-center
        transition-colors duration-150 active:scale-90
        ${ringClass} ${animClass}
      `}
      style={{
        border: '1px solid rgba(var(--fg-rgb), 0.06)',
        background,
        animationDelay: isAnimatingWin ? `${winDelay}ms` : undefined,
        ...blockBorderStyle(row, col),
      }}
    >
      {/* Valor */}
      {value !== null && (
        <span className="text-base font-bold" style={{ color }}>
          {value}
        </span>
      )}

      {/* Mini-grade de notas */}
      {showNotes && (
        <div className="grid grid-cols-3 w-full h-full p-[2px] gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className="flex items-center justify-center"
              style={{
                fontSize: '8px',
                fontWeight: 600,
                lineHeight: 1,
                color: notes.includes(n)
                  ? 'rgba(var(--fg-rgb), 0.65)'
                  : 'transparent',
              }}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
