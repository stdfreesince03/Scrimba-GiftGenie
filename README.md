# Gift Genie

<center>
    ![Gift Genie GIF](./assets/gift-genie.gif)
</center>

Gift Genie is a Scrimba AI Engineer Path project that generates gift ideas from a short profile (interests, occasion, budget, and preferences).

The project has two apps:
- `FE/`: React + Vite frontend
- `BE/`: Express + TypeScript backend

## Features

- Prompt input for describing the person and gifting context
- “Rub the lamp” interaction to trigger generation
- Streaming AI output from backend to frontend (incremental updates)
- Browser geolocation capture and forwarding (`lat`/`lon`) to the backend
- Location-aware AI context via reverse geocoding + OpenAI web search tool options
- Markdown rendering of AI output with sanitization before display
- Last AI response persisted in local storage

## Tech Stack

### Frontend (`FE`)
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Motion (for lamp animation)
- `marked` + `dompurify` (Markdown parse + sanitize)

### Backend (`BE`)
- Node.js + Express 5 + TypeScript
- OpenAI Node SDK (`responses.create` with streaming)
- `cors`, `dotenv`

## How It Works

1. User writes a profile in the frontend and clicks/rubs the lamp.
2. Frontend gets browser geolocation (if available) and sends `prompt`, `lat`, and `lon` to `POST /api/ai`.
3. Backend optionally reverse-geocodes coordinates using OpenStreetMap Nominatim.
4. Backend calls OpenAI Responses API with:
   - a developer prompt for output format
   - the user prompt
   - web search tool config (including approximate location when available)
   - `stream: true`
5. Backend writes newline-delimited JSON chunks to the response stream.
6. Frontend reads stream chunks, updates UI incrementally, parses Markdown, sanitizes HTML, and renders output.

## Installation

### 1) Clone and install dependencies

```bash
# from project root
cd BE
npm install

cd ../FE
npm install
```

### 2) Configure environment variables

Create/update `.env` files in both apps.

#### `BE/.env`

```dotenv
PORT=4000
AI_KEY=your_openai_api_key
AI_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

#### `FE/.env`

```dotenv
VITE_BE_URL=http://localhost:4000
```

## Environment Variables Used

### Backend (`BE`)
- `PORT` (optional): Express server port (defaults to `3000`)
- `AI_KEY` (required): OpenAI API key
- `AI_URL` (required): OpenAI base URL
- `AI_MODEL` (optional): model name (defaults to `gpt-4o-mini`)

### Frontend (`FE`)
- `VITE_BE_URL` (required): backend base URL used by the frontend

## Run the Project

Use two terminals.

### Terminal 1 (backend)

```bash
cd BE
npm start
```

### Terminal 2 (frontend)

```bash
cd FE
npm run dev
```

Open the Vite URL shown in terminal (typically `http://localhost:5173`).

## Basic Usage

1. Open the app.
2. Enter a gift profile (interests, budget, occasion, constraints, etc.).
3. Click/rub the lamp.
4. Watch suggestions stream in progressively.
5. Allow location access if you want location-adjusted suggestions.

## Notes

- Geolocation is optional; if blocked/unavailable, generation still runs.
- AI output is rendered from Markdown and sanitized before insertion into the DOM.
- Keep your real API key out of source control.