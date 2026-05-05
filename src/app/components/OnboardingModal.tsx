'use client';

import { useState } from 'react';

interface Props {
  onClose: () => void;
}

const SLIDES = [
  {
    icon: (
      <svg viewBox="0 0 72 72" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        {/* Mini grid 3x3 com bloco destacado */}
        {[0,1,2].map(r => [0,1,2].map(c => (
          <rect key={`${r}-${c}`}
            x={4 + c * 21} y={4 + r * 21} width={19} height={19} rx={3}
            fill={r === 1 && c === 1
              ? 'rgba(16,183,127,0.35)'
              : r === 1 || c === 1
              ? 'rgba(16,183,127,0.10)'
              : 'rgba(255,255,255,0.05)'}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"
          />
        )))}
        {/* Numeros de exemplo */}
        {[[0,0,'5'],[0,2,'3'],[1,0,'9'],[1,2,'2'],[2,1,'7']].map(([r,c,n]) => (
          <text key={`t${r}${c}`}
            x={13.5 + Number(c) * 21} y={17.5 + Number(r) * 21}
            textAnchor="middle" fontSize="9" fontWeight="700"
            fill={r === 1 ? 'var(--accent)' : 'rgba(255,255,255,0.75)'}
          >{n}</text>
        ))}
      </svg>
    ),
    title: 'Regra básica',
    text: 'Preencha o grid 9×9 para que cada linha, coluna e bloco 3×3 contenha os números de 1 a 9 — sem repetições.',
  },
  {
    icon: (
      <svg viewBox="0 0 72 72" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        {/* Celula com notas */}
        <rect x="8" y="8" width="56" height="56" rx="8"
          fill="rgba(16,183,127,0.12)" stroke="rgba(16,183,127,0.4)" strokeWidth="1.5"/>
        {/* Mini grade 3x3 de notas */}
        {[1,2,3,4,5,6,7,8,9].map((n, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const active = [1,3,5,7].includes(n);
          return (
            <text key={n}
              x={22 + col * 14} y={26 + row * 14}
              textAnchor="middle" fontSize="9" fontWeight="700"
              fill={active ? 'rgba(255,255,255,0.80)' : 'transparent'}
            >{n}</text>
          );
        })}
        {/* Icone de lapis */}
        <circle cx="56" cy="16" r="10" fill="rgba(16,183,127,0.9)"/>
        <path d="M52 19.5l5-5 2.5 2.5-5 5z" fill="white"/>
        <path d="M51 20.5l1-1 2.5 2.5-1.5.5z" fill="white"/>
      </svg>
    ),
    title: 'Modo rascunho',
    text: 'Ative o lápis para anotar candidatos em uma célula antes de confirmar. Os rascunhos de células vizinhas somem automaticamente quando você preenche o número certo.',
  },
  {
    icon: (
      <svg viewBox="0 0 72 72" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        {/* 3 coracoes, 1 apagado */}
        {[0,1,2].map(i => (
          <path key={i}
            transform={`translate(${8 + i * 22}, 16)`}
            d="M10 6C10 3.8 8.2 2 6 2S2 3.8 2 6c0 1.2.5 2.3 1.4 3.1L10 16l6.6-6.9C17.5 8.3 18 7.2 18 6c0-2.2-1.8-4-4-4S10 3.8 10 6z"
            fill={i < 2 ? '#ef4444' : 'rgba(255,255,255,0.12)'}
          />
        ))}
        {/* Numero errado abaixo */}
        <rect x="26" y="46" width="20" height="20" rx="5"
          fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
        <text x="36" y="59" textAnchor="middle" fontSize="11" fontWeight="800"
          fill="rgba(239,68,68,0.9)">7</text>
        <text x="36" y="42" textAnchor="middle" fontSize="8" fontWeight="600"
          fill="rgba(255,255,255,0.35)">errado</text>
      </svg>
    ),
    title: 'Cuidado com os erros',
    text: 'Você tem 3 corações. Cada número errado remove um coração e a célula volta ao estado anterior. Perca os 3 e o jogo termina.',
  },
  {
    icon: (
      <svg viewBox="0 0 72 72" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
        {/* Telefone */}
        <rect x="18" y="6" width="36" height="60" rx="7"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <rect x="22" y="12" width="28" height="44" rx="3" fill="rgba(16,183,127,0.08)"/>
        {/* Icone de adicionar */}
        <circle cx="36" cy="34" r="10" fill="rgba(16,183,127,0.2)" stroke="rgba(16,183,127,0.5)" strokeWidth="1.5"/>
        <path d="M36 28v12M30 34h12" stroke="rgba(16,183,127,0.9)" strokeWidth="2" strokeLinecap="round"/>
        {/* Seta de compartilhar */}
        <path d="M36 58l-3-3h6z" fill="rgba(255,255,255,0.2)"/>
        <text x="36" y="70" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.30)" fontWeight="600">
          instalar
        </text>
      </svg>
    ),
    title: 'Instale como app',
    text: 'Toque em Compartilhar → Adicionar à tela inicial para instalar o Husty Sudoku no celular. Funciona offline e abre sem navegador.',
  },
];

export function OnboardingModal({ onClose }: Props) {
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ zIndex: 50, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Sheet */}
      <div
        className="w-full max-w-[430px] rounded-t-3xl animate-slide-up"
        style={{ background: 'var(--card-bg)', paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(var(--fg-rgb),0.15)' }}/>
        </div>

        {/* Slide content */}
        <div className="flex flex-col items-center px-6 pt-4 pb-2 text-center" style={{ minHeight: 260 }}>
          <div className="mb-4" style={{ opacity: 0.95 }}>
            {current.icon}
          </div>

          <h2 className="text-xl font-black mb-2" style={{ color: 'rgba(var(--fg-rgb),0.95)' }}>
            {current.title}
          </h2>

          <p className="text-sm leading-relaxed" style={{ color: 'rgba(var(--fg-rgb),0.55)', maxWidth: 300 }}>
            {current.text}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 py-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                height: 6,
                width: i === slide ? 20 : 6,
                borderRadius: 3,
                background: i === slide ? 'var(--accent)' : 'rgba(var(--fg-rgb),0.15)',
                transition: 'all 0.25s ease',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Botoes */}
        <div className="flex items-center gap-3 px-6 pb-6 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold border transition-all active:scale-95"
            style={{
              background: 'rgba(var(--fg-rgb),0.04)',
              borderColor: 'rgba(var(--fg-rgb),0.1)',
              color: 'rgba(var(--fg-rgb),0.45)',
            }}
          >
            Pular
          </button>

          <button
            onClick={() => isLast ? onClose() : setSlide(s => s + 1)}
            className="flex-2 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
          >
            {isLast ? 'Começar a jogar' : 'Próximo →'}
          </button>
        </div>
      </div>
    </div>
  );
}
