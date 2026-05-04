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

export function Timer({ status }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      setSeconds(0);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    if (status === 'won' || status === 'idle') {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  return (
    <div className="text-2xl font-mono font-bold text-gray-700 tracking-widest">
      {formatTime(seconds)}
    </div>
  );
}
