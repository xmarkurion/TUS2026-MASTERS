# TUS2026-MASTERS

A modern monorepo setup using Nx, featuring Spring Boot backend, React frontend, Storybook component library, and Jenkins CI/CD pipeline.

## 🏗️ Architecture

This repository is organized as a monorepo using Nx workspace:

- **Frontend**: React + TypeScript application with Vite
- **Backend**: Spring Boot REST API (Java 17)
- **Storybook**: Component library documentation
- **CI/CD**: Jenkins pipeline configuration

## 📦 Tech Stack

### Frontend
- React 18.2
- TypeScript 5.3
- Vite 5
- Vitest for testing
- Storybook 7.6

### Backend
- Spring Boot 3.2.1
- Java 17
- Maven 3.x
- JUnit 5

### Build Tools
- Nx 18.0.4
- Node.js 20+
- npm 10+

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm 10+
- Java 17+
- Maven 3.9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xmarkurion/TUS2026-MASTERS.git
cd TUS2026-MASTERS
```

2. Install Node.js dependencies:
```bash
npm install
```

## 🏃 Running the Applications

### Frontend Development Server

```bash
npm run start:frontend
# or
npx nx serve frontend
```

The frontend will be available at http://localhost:3000

### Backend Development Server

```bash
npx nx serve backend
```

The backend API will be available at http://localhost:8080

### Storybook

```bash
npm run storybook
# or
npx nx storybook frontend
```

Storybook will be available at http://localhost:6006

## 🧪 Testing

The frontend supports both Vitest and Jest test runners.

### Run all tests

```bash
npm test
# or
npx nx run-many -t test
```

### Test specific project

```bash
# Frontend (Vitest - default)
npm run test:frontend
# or
npx nx test frontend

# Frontend (Jest)
npm run test:frontend:jest
# or
npx nx test:jest frontend

# Backend
npm run test:backend
# or
npx nx test backend
```

## 🏗️ Building

### Build all projects

```bash
npm run build
# or
npx nx run-many -t build
```

### Build specific project

```bash
# Frontend
npm run build:frontend
# or
npx nx build frontend

# Backend
npm run build:backend
# or
npx nx build backend

# Storybook
npm run build-storybook
# or
npx nx build-storybook frontend
```

## 📝 Linting

```bash
npm run lint
# or
npx nx run-many -t lint

npm install --save-dev eslint-plugin-prettier
npm run lint
npm run lint -- --fix
npm run lint

```

## 🔄 CI/CD

The project includes a Jenkins pipeline configuration in `Jenkinsfile`. The pipeline:

1. Checks out the code
2. Installs dependencies
3. Runs linters in parallel
4. Builds frontend and backend in parallel
5. Runs tests in parallel
6. Builds Storybook
7. Archives build artifacts

### Jenkins Requirements

- NodeJS 20 (configured as 'NodeJS 20' in Jenkins)
- Maven 3.9 (configured as 'Maven 3.9' in Jenkins)
- JDK 17 (configured as 'JDK 17' in Jenkins)

## 📁 Project Structure

```
TUS2026-MASTERS/
├── apps/
│   ├── frontend/              # React application
│   │   ├── src/
│   │   │   ├── app/          # Main app component
│   │   │   ├── components/   # React components
│   │   │   └── main.tsx      # Entry point
│   │   ├── .storybook/       # Storybook configuration
│   │   ├── index.html
│   │   ├── project.json      # Nx project configuration
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── backend/              # Spring Boot application
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/tus2026/backend/
│       │   │   │       ├── BackendApplication.java
│       │   │   │       └── controller/
│       │   │   │           └── HealthController.java
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       ├── pom.xml
│       └── project.json      # Nx project configuration
│
├── node_modules/
├── dist/                     # Build outputs
├── .gitignore
├── .editorconfig
├── .eslintrc.json
├── .prettierrc
├── Jenkinsfile              # Jenkins pipeline
├── nx.json                  # Nx workspace configuration
├── package.json
├── tsconfig.base.json
└── README.md
```

## 🔌 API Endpoints

### Backend API

- `GET /api/health` - Health check endpoint
- `GET /api/info` - Application information
- `GET /actuator/health` - Spring Boot actuator health
- `GET /actuator/info` - Spring Boot actuator info

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT