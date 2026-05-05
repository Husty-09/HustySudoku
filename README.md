# 🧩 HustySudoku | Mobile PWA

> Um jogo de Sudoku, focado em performance e experiência nativa — sem precisar baixar nada pela App Store.

---

## 🚀 O Projeto

O **HustySudoku** nasceu da vontade de criar uma ferramenta de lazer pessoal que fosse rápida, visualmente agradável e que funcionasse como um aplicativo nativo no celular. O foco principal foi o uso de bordas arredondadas (estética **HustyCore**) e uma interatividade fluida através de animações suaves.

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 (Padrão HustyCore) |
| Lógica de Puzzle | `sudoku-gen` |
| Analytics | Vercel Web Analytics |
| Distribuição | PWA (iOS & Android) |

---

## 🎯 Funcionalidades Principais

- **Interatividade Funcional** — Sistema de seleção de células e teclado numérico customizado para evitar o teclado nativo do sistema.
- **Níveis de Dificuldade** — Geração dinâmica de puzzles: Fácil, Médio e Difícil.
- **Modo Pesadelo 💀** — Modo especial sem verificação automática de erros. Você preenche todo o tabuleiro e só pode verificar quando estiver completo.
- **Desafio Diário 📅** — Um puzzle único por dia para todos os jogadores, com rastreamento de conclusão.
- **Cronômetro Inteligente** — Acompanhamento de performance com suporte a pausa, sem contar tempo pausado nas estatísticas.
- **Sistema de Vidas ❤️** — 3 corações; cada erro consome um e reverte a célula. Perca os 3 e o jogo termina.
- **Modo Rascunho ✏️** — Anote candidatos nas células antes de confirmar. Rascunhos de células vizinhas são removidos automaticamente ao acertar.
- **Feedback Visual & Sonoro** — Sons distintos para acerto, erro, seleção, borracha, vitória e derrota. Indicação visual de conflitos por linha, coluna e bloco.
- **Sistema de Estatísticas 📊** — Rastreamento completo por dificuldade: jogos, vitórias, melhor tempo, taxa de vitória, sequência atual e recorde.
- **Tutorial Interativo** — Modal de onboarding com slides explicando regras, rascunho, sistema de vidas e instalação como app.
- **Pause Automático** — O jogo pausa automaticamente ao sair da aba ou minimizar o app.
- **Tema Claro/Escuro** — Alternância com um toque, com paleta confortável para longas sessões.
- **PWA Completo** — Configurado com manifest, service worker, ícones e splash screen dedicados. Funciona offline e abre sem navegador.

---

## 📱 Instalação no Celular

### iOS (Safari)
1. Acesse a URL do projeto via **Safari**.
2. Toque no ícone de **Compartilhar** (⬆️).
3. Selecione **"Adicionar à Tela de Início"**.

### Android (Chrome)
1. Acesse a URL do projeto via **Chrome**.
2. Toque no menu **⋮** → **"Adicionar à tela inicial"**.

O HustySudoku aparecerá na sua biblioteca de apps com ícone e splash screen dedicados.

---

## 🖥️ Rodando Localmente

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📐 Conceitos de Design (HustyCore)

O projeto segue a filosofia visual do **HustyCore**:

- **Bordas Arredondadas** — Uso extensivo de `rounded-2xl` e `rounded-3xl` para um visual moderno e suave.
- **Dark Mode Nativo** — Paleta de cores focada em contraste confortável para longas sessões de jogo.
- **Responsividade Touch** — Elementos dimensionados especificamente para a anatomia do polegar em dispositivos móveis.
- **Feedback Háptico** — Vibrações sutis em acertos e erros para uma experiência tátil mais rica.

---

<p align="center">Feito com 🎮 por <strong>Husty</strong></p>
