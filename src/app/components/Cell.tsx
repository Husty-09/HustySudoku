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

function getBorderClasses(row: number, col: number): string {
  const classes: string[] = [];
  if (row % 3 === 0) classes.push('border-t-2 border-t-gray-700');
  if (col % 3 === 0) classes.push('border-l-2 border-l-gray-700');
  if (row === 8) classes.push('border-b-2 border-b-gray-700');
  if (col === 8) classes.push('border-r-2 border-r-gray-700');
  return classes.join(' ');
}

export function Cell({
  value,
  isFixed,
  isError,
  isHighlighted,
  isSelected,
  row,
  col,
  onSelect,
}: CellProps) {
  function getBg(): string {
    if (isSelected) return 'bg-blue-400';
    if (isError) return 'bg-red-200';
    if (isHighlighted) return 'bg-blue-100';
    return 'bg-white';
  }

  function getTextColor(): string {
    if (isError) return 'text-red-600';
    if (isFixed) return 'text-gray-900';
    return 'text-blue-600';
  }

  return (
    <button
      onClick={() => onSelect(row, col)}
      className={`
        w-10 h-10 flex items-center justify-center
        text-base font-semibold border border-gray-300
        transition-colors duration-100 active:scale-95
        ${getBorderClasses(row, col)}
        ${getBg()}
        ${getTextColor()}
      `}
    >
      {value ?? ''}
    </button>
  );
}
