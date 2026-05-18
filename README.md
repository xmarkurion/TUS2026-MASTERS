# TUS2026 Masters

TUS2026 Masters is a full-stack project with:
- **Backend**: Spring Boot REST API (`apps/backend`)
- **Frontend**: React + Vite UI (`apps/frontend`)
- **Database**: MongoDB (via `docker-compose.yaml`)

## Branches and deployment mode

- **`main`**: deployment with **Gemini AI**
- **`main_local`**: deployment with **local models**

## Prerequisites

- Java 17+
- Maven
- Node.js + npm
- Docker + Docker Compose

## Run the project

### 1) Start MongoDB

From repository root:

```bash
docker compose up -d
```

MongoDB runs on `localhost:27017`.

### 2) Run backend

From `apps/backend`:

```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

If using Gemini mode, set your API key before starting:

```bash
export GOOGLE_GENAI_API_KEY=your_key_here
```

### 3) Run frontend

From `apps/frontend`:

```bash
npm install
npm run dev
```

Frontend starts with Vite (default: `http://localhost:5173`).

## Useful checks

Frontend:

```bash
npm run lint
npm run build
npm run test -- --run
```

Backend:

```bash
mvn test
mvn -DskipTests package
```
