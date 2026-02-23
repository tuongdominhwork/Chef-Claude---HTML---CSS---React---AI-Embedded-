# Chef Claude

Chef Claude is a React + Vite app that generates a recipe from ingredients you provide.
It uses a local Ollama model (`llama3.2:3b`) and renders the response as markdown in the UI.

## Features

- Add ingredients one by one.
- Generate a recipe when you have at least 4 ingredients.
- Show loading state while the model is generating.
- Handle API/network errors with clear messages.
- Render rich markdown output using `react-markdown`.

## Tech Stack

- React 19
- Vite 7
- Ollama local API
- `react-markdown`
- ESLint 9

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm
- [Ollama](https://ollama.com/) installed and running locally
- Model pulled locally:

```bash
ollama pull llama3.2:3b
```

## Installation

```bash
npm install
```

## Environment Variables

This project includes `.env.example`:

```bash
VITE_HF_ACCESS_TOKEN=hf_your_token_here
```

This variable is currently not required by the app's active Ollama flow, but you can keep it for future integrations.

## Run Locally

1. Start Ollama (if not already running).
2. Start the Vite dev server:

```bash
npm run dev
```

3. Open the local URL shown by Vite (usually `http://localhost:5173`).

## How API Calls Work

- Frontend calls: `/api/ollama/api/chat`
- Vite proxy (`vite.config.js`) forwards that path to: `http://127.0.0.1:11434`
- Request payload uses:
  - `model: "llama3.2:3b"`
  - `stream: false`
  - reasonable generation options (`temperature`, `num_predict`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```text
.
├── components/
│   ├── ClaudeRecipe.jsx
│   ├── Header.jsx
│   ├── Ingredient.jsx
│   └── Main.jsx
├── assets/images/
├── ai.js
├── App.jsx
├── index.jsx
├── index.html
├── styles.css
└── vite.config.js
```

## Notes

- The app entrypoint currently uses root-level `index.jsx` and `App.jsx`.
- `src/` still contains default Vite starter files and is not the active app path.

## Troubleshooting

- `Could not reach Ollama...`:
  - Ensure Ollama is running.
  - Run `ollama pull llama3.2:3b` if the model is missing.
- `Ollama API error ...`:
  - Check Ollama logs and confirm the model name is available locally.
- No recipe returned:
  - Try different ingredients or a shorter ingredient list.
