'use client';
import { useState, useEffect, useRef } from 'react';
import { GameStatus } from '../types/sudoku';

interface TimerProps {
  status: GameStatus;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Este componente recebe uma `key` externa (gameId).
// Quando a key muda, o React desmonta e remonta o componente,
// resetando o state para 0 automaticamente — sem precisar de
// setState dentro do useEffect (que causaria o erro de lint).
export function Timer({ status }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  return (
    <div className="text-2xl font-mono font-bold tracking-widest"
      style={{ color: '#07b6d5' }}
    >
      {formatTime(seconds)}
    </div>
  );
}
