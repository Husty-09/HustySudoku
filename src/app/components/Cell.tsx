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
  winDelay: number;
  row: number;
  col: number;
  onSelect: (row: number, col: number) => void;
}

/**
 * Grade 9x9 completa usando apenas COR (nunca espessura) para evitar layout shift.
 *
 * Cada celula define somente borderTop e borderLeft.
 * borderBottom/Right so aparecem na ultima linha/coluna (borda externa).
 *
 * Resultado visual:
 *   - Linhas finas entre cada celula (--inner-border)
 *   - Separadores 3x3 mais fortes (--block-border) em rows/cols 0, 3, 6
 *   - Borda externa grossa (--block-border) em row 8 bottom e col 8 right
 */
function blockBorderStyle(row: number, col: number): CSSProperties {
  const block = '1px solid var(--block-border)';
  const inner = '1px solid var(--inner-border)';
  const none  = '1px solid transparent';

  return {
    borderTop:    row % 3 === 0 ? block : inner,
    borderLeft:   col % 3 === 0 ? block : inner,
    borderBottom: row === 8     ? block : none,
    borderRight:  col === 8     ? block : none,
  };
}

export function Cell({
  value, notes, isFixed, isError, isCorrect,
  isHighlighted, isInRowOrCol, isInBlock,
  isSelected, isWon, winDelay, row, col, onSelect,
}: CellProps) {

  const isAnimatingWin = isWon && value !== null;

  /* Background */
  let background = 'transparent';
  if (!isAnimatingWin) {
    if (isError)            background = 'var(--cell-error-bg)';
    else if (isCorrect)     background = 'var(--cell-correct-bg)';
    else if (isSelected)    background = 'rgba(var(--accent-rgb), 0.22)';
    else if (isHighlighted) background = 'rgba(var(--accent-rgb), 0.14)';
    else if (isInBlock)     background = 'rgba(var(--fg-rgb), 0.05)';
    else if (isInRowOrCol)  background = 'rgba(var(--fg-rgb), 0.03)';
  }

  /* Cor do texto */
  let color: string;
  if (isError)      color = 'var(--error-text)';
  else if (isFixed) color = 'rgba(var(--fg-rgb), 0.9)';
  else              color = 'var(--accent)';

  /* Classe de animacao */
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
        background,
        animationDelay: isAnimatingWin ? `${winDelay}ms` : undefined,
        ...blockBorderStyle(row, col),
      }}
    >
      {/* Valor */}
      {value !== null && (
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color, lineHeight: 1 }}>
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
                fontSize: '9px',
                fontWeight: 700,
                lineHeight: 1,
                color: notes.includes(n)
                  ? 'rgba(var(--fg-rgb), 0.70)'
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
