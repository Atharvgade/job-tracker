# Pipeline — Job Application Tracker

A full-stack job application tracker: a Kanban board for your pipeline (Applied → Interview → Offer → Rejected), interview round tracking, and an analytics dashboard on your conversion rates.

**Stack:** Java 17, Spring Boot 3, Spring Security + JWT, Spring Data JPA, PostgreSQL (H2 for local dev) · React 18, Vite, Tailwind CSS, Recharts, React Router.

## Quick start (no Docker, fastest way to see it running)

### 1. Backend
Requires Java 17+ and Maven.

```bash
cd backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080` and uses an embedded H2 database by default — no setup needed. Data persists to `backend/data/jobtracker.mv.db` between restarts.

### 2. Frontend
Requires Node 18+.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`, register an account, and start adding applications.

## Running with Docker Compose (Postgres instead of H2)

```bash
docker compose up --build
```

This spins up Postgres, the Spring Boot backend, and an Nginx-served frontend build. Frontend at `http://localhost:5173`, backend at `http://localhost:8080`.

## Switching the local backend from H2 to Postgres

Set these environment variables before running `mvn spring-boot:run` (or put them in a `.env` and export them):

```bash
export DB_URL=jdbc:postgresql://localhost:5432/jobtracker
export DB_USERNAME=jobtracker
export DB_PASSWORD=jobtracker
export DB_DRIVER=org.postgresql.Driver
```

## Before deploying anywhere real

- Set `JWT_SECRET` to a long random value — the default in `application.yml` is a placeholder.
- Set `CORS_ORIGINS` to your actual deployed frontend URL.
- Point `VITE_API_URL` (frontend `.env`) at your deployed backend's `/api` path.

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/applications/all` | List all applications for the logged-in user |
| POST | `/api/applications` | Create an application |
| PUT | `/api/applications/{id}` | Update an application |
| PATCH | `/api/applications/{id}/status` | Move an application to a new status |
| DELETE | `/api/applications/{id}` | Delete an application |
| POST | `/api/applications/{id}/interview-rounds` | Add an interview round |
| PUT | `/api/applications/{id}/interview-rounds/{roundId}` | Update a round |
| GET | `/api/analytics` | Conversion rates and stage counts |

All endpoints except `/api/auth/**` require an `Authorization: Bearer <token>` header.

## Project structure

```
backend/    Spring Boot REST API (entities, repositories, services, controllers, JWT security)
frontend/   React + Vite SPA (Kanban board, analytics dashboard, auth)
docker-compose.yml
```

## Resume-ready talking points

- JWT-based stateless authentication with Spring Security, including per-user data isolation (users can only ever see/modify their own applications — enforced at the repository query level, not just the UI)
- DTO-based API design decoupled from JPA entities
- Custom analytics endpoint aggregating conversion rates and weekly trends from raw application data
- Drag-and-drop Kanban board built with native HTML5 DnD (no extra dependency)
- Dockerized for one-command local deployment (Postgres + backend + frontend)
