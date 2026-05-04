'use client';

interface CellProps {
  value: number | null;
  isFixed: boolean;
  isError: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  row: number;
  col: number;
  onSelect: (row: number, col: number) => void;
}

function getBlockBorder(row: number, col: number): string {
  const t = row % 3 === 0 ? 'border-t-[2px] border-t-white/20' : '';
  const l = col % 3 === 0 ? 'border-l-[2px] border-l-white/20' : '';
  const b = row === 8    ? 'border-b-[2px] border-b-white/20' : '';
  const r = col === 8    ? 'border-r-[2px] border-r-white/20' : '';
  return [t, l, b, r].filter(Boolean).join(' ');
}

export function Cell({ value, isFixed, isError, isHighlighted, isSelected, row, col, onSelect }: CellProps) {
  let bg = 'bg-transparent';
  let textColor = isFixed ? 'text-white/90' : 'text-[#07b6d5]';
  let extra = '';

  if (isSelected) {
    bg = 'bg-[rgba(7,182,213,0.2)]';
    extra = 'animate-glow';
  } else if (isError) {
    bg = 'bg-[rgba(239,68,68,0.2)]';
    textColor = 'text-red-400';
    extra = 'animate-shake';
  } else if (isHighlighted) {
    bg = 'bg-[rgba(7,182,213,0.07)]';
  }

  return (
    <button
      onClick={() => onSelect(row, col)}
      className={`
        w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center
        text-sm sm:text-base font-bold
        border border-white/5
        transition-all duration-150 active:scale-90
        ${getBlockBorder(row, col)}
        ${bg} ${textColor} ${extra}
      `}
    >
      {value ?? ''}
    </button>
  );
}
