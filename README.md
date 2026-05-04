# 🧩 HustySudoku | Mobile PWA

> Um jogo de Sudoku minimalista, focado em performance e experiência nativa para iOS — sem precisar baixar nada pela App Store.

---

## 🚀 O Projeto

O **HustySudoku** nasceu da vontade de criar uma ferramenta de lazer pessoal que fosse rápida, visualmente agradável e que funcionasse como um aplicativo nativo no celular. O foco principal foi o uso de bordas arredondadas (estética **HustyCore**) e uma interatividade fluida através de animações suaves.

---

## 🛠️ Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS (Padrão HustyCore) |
| Animações | Framer Motion |
| Lógica de Puzzle | `sudoku-gen` |
| Distribuição | PWA otimizado para iOS |

---

## 🎯 Funcionalidades Principais

- **Interatividade Funcional** — Sistema de seleção de células e teclado numérico customizado para evitar o teclado nativo do iOS.
- **Níveis de Dificuldade** — Geração dinâmica de puzzles: Fácil, Médio e Difícil.
- **Cronômetro em Tempo Real** — Acompanhamento de performance por rodada.
- **Feedback Visual** — Indicação de números errados, destaques de números iguais e validação de quadrantes.
- **PWA Setup** — Configurado para ser adicionado à tela de início com ícone customizado e modo standalone (sem barras de navegação do browser).

---

## 📱 Instalação no iOS

Para rodar o HustySudoku como um aplicativo no seu iPhone:

1. Acesse a URL do projeto via **Safari**.
2. Toque no ícone de **Compartilhar** (⬆️).
3. Selecione **"Adicionar à Tela de Início"**.
4. O HustySudoku aparecerá na sua biblioteca de apps com ícone e splash screen dedicados.

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

---

<p align="center">Feito com 🎮 por <strong>Husty</strong></p>
