
# RAG Project

This project is a Retrieval-Augmented Generation (RAG) application with a Next.js client and a Node.js/Express server. It uses Redis (Valkey), Qdrant, and Google Gemini for Embeddings, and Ollama llema3 Model for document search and retrieval.

---

## Project Structure

- `client/` — Next.js frontend
- `server/` — Node.js backend (Express, BullMQ, Qdrant, Ollama , llema3 Model)
- `docker-compose.yml` — For running Valkey (Redis-compatible)

---

## Prerequisites

- Node.js (v18+ recommended)
- npm 
- Docker (for Valkey/Redis)

---

## Setup Instructions

### 1. Start Valkey (Redis-compatible)

```
docker-compose up -d
```
This will start Valkey on port 6379.

### 2. Server Setup

```
cd server
cp .env.example .env   # Fill in your API keys and Qdrant details
npm install
npm run dev            # Starts the Express API
```

#### Environment Variables (`server/.env`)

- `GOOGLE_API_KEY` — Your Google Gemini API key
- `QDRANT_API_KEY` — Qdrant API key
- `QDRANT_URL` — Qdrant endpoint (e.g., http://localhost:6333)
- `QDRANT_COLLECTION` — Qdrant collection name (default: rag_documents)
- `REDIS_HOST` — Redis/Valkey host (default: localhost)
- `REDIS_PORT` — Redis/Valkey port (default: 6379)

### 3. Client Setup

```
cd client
npm install
npm run dev            # Starts Next.js on http://localhost:3000
```

---

## Usage

1. Upload PDF files via the client UI (handled by the server and processed into Qdrant)
2. Search and interact with your documents using the RAG-powered interface

---

## Troubleshooting

- Ensure Valkey (Redis) is running on port 6379
- Ensure Qdrant is accessible and API keys are correct
- Check `.env` in the server folder for correct configuration

---

## Scripts

### Server
- `npm run dev` — Start Express server with hot reload
- `npm run dev:worker` — Start BullMQ worker for background PDF processing
- `node search.js` - To document search and retrieval with help of Ollama llama3 Model installed Locally 

### Client
- `npm run dev` — Start Next.js development server
- `npm run build` — Build for production
- `npm start` — Start production server

---

## License

MIT
