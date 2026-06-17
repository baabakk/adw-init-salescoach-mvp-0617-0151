# init-salescoach-mvp

Node.js + Express + TypeScript backend scaffold for the SalesCoach MVP.

## Requirements
- Node.js 18+
- npm

## Setup
```bash
npm install
```

## Run (dev)
```bash
npm run dev
```

Server:
- HTTP: `http://localhost:3000`
- WebSocket: `ws://localhost:3000/ws?callId=<callId>`

## Build
```bash
npm run build
```

## Notes
This repository currently includes a minimal Express + WebSocket server scaffold and basic API endpoints.
The full MVP architecture (EventBus-only internal communication, AssemblyAI streaming adapter, PCRC-LLM orchestrator, MongoDB persistence, and cue policy enforcement) will be implemented in subsequent iterations.
