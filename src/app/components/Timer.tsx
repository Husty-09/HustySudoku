'use client';
import { useState, useEffect } from 'react';
import { GameStatus } from '../types/sudoku';

interface TimerProps {
  status: GameStatus;
  isPaused: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function Timer({ status, isPaused }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (status !== 'playing' || isPaused) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [status, isPaused]);

  return (
    <div
      className="text-2xl font-mono font-bold tracking-widest"
      style={{ color: isPaused ? 'rgba(var(--fg-rgb), 0.3)' : 'var(--accent)' }}
    >
      {formatTime(seconds)}
    </div>
  );
}
