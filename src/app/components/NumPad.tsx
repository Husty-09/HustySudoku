'use client';

interface NumPadProps {
  onInput: (num: number) => void;
  onErase: () => void;
}

export function NumPad({ onInput, onErase }: NumPadProps) {
  return (
    <div className="animate-slide-up flex flex-col items-center gap-3 w-full max-w-xs">
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onInput(num)}
            className="
              h-14 text-xl font-bold rounded-2xl
              border border-white/10
              text-white/90
              transition-all duration-150
              active:scale-90
            "
            style={{ background: 'rgba(255,255,255,0.06)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(7,182,213,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={onErase}
        className="
          w-full h-12 text-sm font-semibold rounded-2xl
          border border-red-500/30 text-red-400
          transition-all duration-150 active:scale-95
        "
        style={{ background: 'rgba(239,68,68,0.1)' }}
      >
        ✕ Apagar
      </button>
    </div>
  );
}
