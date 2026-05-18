# TUS2026 Masters - AI-Driven Project Management : Automated Project Management Using Large Language Models
Full-stack, AI-powered project management web application designed to automate resource management and sprint planning in Agile software development. By replacing subjective, manager-led task assignments with a prompt-driven allocation mechanism, structurally removes manual cognitive biases (like affinity bias and the availability heuristic) to deliver fairer, data-driven task distribution.

# Process
AgileMind processes software project workflows through three sequential automated stages:

- Stage 1: Task Generation 
Project leads input a high-level goal. The system leverages Spring AI and an LLM to generate structured tasks complete with name, description, difficulty, and estimated effort.

- Stage 2: Task De-Duplication 
An autonomous agent reviews the newly created tasks against the existing MongoDB backlog collection, automatically removing duplicates to keep data clean.

- Stage 3: Task Allocation 
The system maps task complexity and required technologies against developer profiles, recommending the absolute best team member for the job without manual bias.

# Key Features
- Automated Task Generation: Decomposes high-level natural language project goals or feature requests into discrete, actionable backlog tasks.
- Semantic De-Duplication: Uses an intelligent De-Duplication Agent to clean the backlog and purge redundant tasks before sprint allocation.
- Competency-Based Task Allocation: Automatically matches task requirements with developer profiles based on verifiable technical skills, current workload, and real-time hour availability.
- Flexible LLM Inference:  cloud-based models (Google Gemini API -> high reasoning)
- And locally deployed open-source models (Gemma3-12b via LM Studio -> limited reasoning).

# Tech:
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
