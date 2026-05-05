'use client';

import { useState } from 'react';
import { AllStats, Difficulty } from '../types/sudoku';

interface StatsModalProps {
  stats: AllStats;
  onClose: () => void;
  onReset: () => void;
}

const TABS: { label: string; value: Difficulty }[] = [
  { label: 'Fácil',   value: 'easy'   },
  { label: 'Médio',   value: 'medium' },
  { label: 'Difícil', value: 'hard'   },
];

function formatTime(seconds: number | null): string {
  if (seconds === null) return '--:--';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function winRate(played: number, won: number): string {
  if (played === 0) return '0%';
  return `${Math.round((won / played) * 100)}%`;
}

export function StatsModal({ stats, onClose, onReset }: StatsModalProps) {
  const [tab, setTab] = useState<Difficulty>('easy');
  const d = stats[tab];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl border animate-slide-up pb-10"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'rgba(var(--fg-rgb),0.1)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-3">
          <h2
            className="text-lg font-black tracking-tight"
            style={{ color: 'rgba(var(--fg-rgb), 0.9)' }}
          >
            Estatísticas
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border transition-all active:scale-90"
            style={{
              background: 'rgba(var(--fg-rgb),0.05)',
              borderColor: 'rgba(var(--fg-rgb),0.1)',
              color: 'rgba(var(--fg-rgb),0.5)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Abas de dificuldade */}
        <div className="flex gap-2 px-6 mb-5">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="flex-1 py-2 rounded-2xl text-sm font-semibold border transition-all duration-200 active:scale-95"
              style={tab === t.value
                ? { background: 'rgba(var(--accent-rgb),0.18)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                : { background: 'rgba(var(--fg-rgb),0.04)', borderColor: 'rgba(var(--fg-rgb),0.08)', color: 'rgba(var(--fg-rgb),0.45)' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grade de estatísticas */}
        <div className="grid grid-cols-2 gap-3 px-6">
          <StatCard label="Jogados"          value={d.played}                   />
          <StatCard label="Vitórias"         value={d.won}                      />
          <StatCard label="Taxa de vitória"  value={winRate(d.played, d.won)}   />
          <StatCard label="Melhor tempo"     value={formatTime(d.bestTime)}     mono />
          <StatCard label="Sequência atual"  value={`${d.currentStreak} 🔥`}    />
          <StatCard label="Melhor sequência" value={`${d.maxStreak} 🏆`}        />
        </div>

        {/* Resetar */}
        <div className="flex justify-center mt-6 px-6">
          <button
            onClick={() => { if (confirm('Resetar todas as estatísticas?')) onReset(); }}
            className="text-xs border px-4 py-2 rounded-xl transition-all active:scale-95"
            style={{
              color: 'rgba(var(--fg-rgb),0.25)',
              borderColor: 'rgba(var(--fg-rgb),0.1)',
            }}
          >
            Resetar estatísticas
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, mono = false,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-2xl border"
      style={{
        background: 'rgba(var(--fg-rgb),0.04)',
        borderColor: 'rgba(var(--fg-rgb),0.08)',
      }}
    >
      <span
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: 'rgba(var(--fg-rgb),0.4)' }}
      >
        {label}
      </span>
      <span
        className={`text-2xl font-black ${mono ? 'font-mono' : ''}`}
        style={{ color: mono ? 'var(--accent)' : 'rgba(var(--fg-rgb),0.9)' }}
      >
        {value}
      </span>
    </div>
  );
}
