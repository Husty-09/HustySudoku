'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  /* Inicializa direto do localStorage -- evita useEffect com setState */
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('sudoku-sound');
    return saved === null ? true : saved === '1';
  });

  /* Fecha o AudioContext ao desmontar -- evita vazamento em navegacao SPA */
  useEffect(() => {
    return () => { ctxRef.current?.close(); };
  }, []);

  /* Ref espelha o state para evitar closures stale nos callbacks de audio */
  const enabledRef = useRef(enabled);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  const toggleSound = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      localStorage.setItem('sudoku-sound', next ? '1' : '0');
      enabledRef.current = next;
      return next;
    });
  }, []);

  /* Cria (ou retorna) o AudioContext com lazy init */
  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  /* Oscilador basico: freq, duracao, forma de onda, volume
   * Desconecta os nos do grafo apos o stop() para evitar
   * acumulo de OscillatorNode/GainNode no AudioContext. */
  const tone = useCallback(
    (freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) => {
      if (!enabledRef.current) return;
      const c = getCtx();
      if (!c) return;
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.connect(g);
      g.connect(c.destination);
      osc.onended = () => {
        osc.disconnect();
        g.disconnect();
      };
      osc.start();
      osc.stop(c.currentTime + dur);
    },
    [getCtx]
  );

  /* Sons individuais */

  /** Tick suave ao selecionar celula */
  const playSelect = useCallback(() => tone(880, 0.03, 'sine', 0.06), [tone]);

  /** Apagar */
  const playErase = useCallback(() => tone(440, 0.07, 'sine', 0.09), [tone]);

  /** Toggle do modo rascunho */
  const playNotes = useCallback(() => tone(1100, 0.04, 'square', 0.06), [tone]);

  /** Numero correto -- dois tons ascendentes */
  const playCorrect = useCallback(() => {
    tone(587, 0.10, 'sine', 0.14); // D5
    setTimeout(() => tone(740, 0.18, 'sine', 0.12), 100); // F#5
  }, [tone]);

  /** Numero errado -- dois tons dissonantes simultaneos
   *  Usa inline disconnect via onended em cada oscilador. */
  const playError = useCallback(() => {
    if (!enabledRef.current) return;
    const c = getCtx();
    if (!c) return;
    [220, 185].forEach((freq, i) => {
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.type  = 'sawtooth';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      g.gain.setValueAtTime(i === 0 ? 0.11 : 0.07, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);
      osc.connect(g);
      g.connect(c.destination);
      osc.onended = () => {
        osc.disconnect();
        g.disconnect();
      };
      osc.start();
      osc.stop(c.currentTime + 0.28);
    });
  }, [getCtx]);

  /** Vitoria -- arpejo ascendente C5 E5 G5 C6 */
  const playWin = useCallback(() => {
    [523, 659, 784, 1047].forEach((freq, i) =>
      setTimeout(() => tone(freq, 0.32, 'sine', 0.17), i * 130)
    );
  }, [tone]);

  /** Derrota -- queda triste de dois tons */
  const playLose = useCallback(() => {
    tone(380, 0.22, 'sine', 0.14);
    setTimeout(() => tone(270, 0.40, 'sine', 0.14), 230);
  }, [tone]);

  return {
    enabled,
    toggleSound,
    playSelect,
    playCorrect,
    playError,
    playErase,
    playNotes,
    playWin,
    playLose,
  };
}
