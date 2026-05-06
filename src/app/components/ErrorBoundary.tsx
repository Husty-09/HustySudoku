'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Captura excecoes nao tratadas na arvore de componentes filhos
 * e exibe mensagem amigavel em vez de tela branca.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido';
    return { hasError: true, message };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        className="h-dvh flex flex-col items-center justify-center gap-5 px-8 text-center"
        style={{ background: 'var(--bg)' }}
      >
        <span style={{ fontSize: 48 }}>💥</span>
        <h1
          className="text-2xl font-black"
          style={{ color: 'rgba(var(--fg-rgb),0.9)' }}
        >
          Algo deu errado
        </h1>
        <p
          className="text-sm max-w-xs"
          style={{ color: 'rgba(var(--fg-rgb),0.45)' }}
        >
          {this.state.message || 'Ocorreu um erro inesperado. Tente reiniciar o jogo.'}
        </p>
        <button
          onClick={this.handleReset}
          className="px-6 py-3 rounded-2xl text-sm font-semibold border transition-all active:scale-95"
          style={{
            background: 'rgba(var(--accent-rgb),0.12)',
            borderColor: 'rgba(var(--accent-rgb),0.35)',
            color: 'var(--accent)',
          }}
        >
          Tentar novamente
        </button>
      </main>
    );
  }
}
