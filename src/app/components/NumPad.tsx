'use client';

interface NumPadProps {
  onInput: (num: number) => void;
  onErase: () => void;
}

export function NumPad({ onInput, onErase }: NumPadProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onInput(num)}
            className="
              h-14 text-xl font-bold bg-white text-gray-800
              rounded-2xl shadow border border-gray-200
              active:scale-95 active:bg-gray-100
              transition-all duration-100
            "
          >
            {num}
          </button>
        ))}
      </div>
      <button
        onClick={onErase}
        className="
          w-full h-12 text-sm font-semibold
          bg-red-100 text-red-600 rounded-2xl shadow
          border border-red-200
          active:scale-95 active:bg-red-200
          transition-all duration-100
        "
      >
        ✕ Apagar
      </button>
    </div>
  );
}
