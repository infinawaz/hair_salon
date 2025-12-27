<!--
Short, actionable instructions for AI coding agents working in this repository.
This file is generated/updated by an automated assistant. If something looks off,
ask the repo maintainer for more context (build, tests, intended runtime).
-->

# Copilot instructions (project-specific)

- Repo snapshot: monorepo with `backend/` (Django + DRF) and `frontend/` (Next.js + Tailwind).
- Primary runtime: Backend uses CPython on Windows (developer environment uses cmd.exe). Frontend uses Node.js. Expect commands like `python manage.py runserver` and `npm run dev`.

## What to do first

- Backend: open `backend/README.md` and `backend/.env.example` — they contain the environment variables and quick start.
- Frontend: open `frontend/README.md` and `frontend/.env.example` for API URL configuration.

## Project conventions and quick patterns

- Backend uses a single Django project at `backend/backend_project` and will expose APIs under `/api/`.
- DRF + SimpleJWT is configured in settings. CORS reads `CORS_ALLOWED_ORIGINS` from `.env`.
- Frontend uses Next.js + Tailwind. Keep pages under `frontend/pages` and global styles in `frontend/styles/globals.css`.

## How to run and debug (discovered)

- Backend:
	- Create venv, install `requirements.txt`, copy `.env.example` to `.env`, then `python manage.py migrate` and `python manage.py runserver`.
- Frontend:
	- `npm install` then `npm run dev`. Set `NEXT_PUBLIC_API_URL` in `.env.local` if the backend is not at the default.

## What the agent should NOT do automatically

- Do not add or commit CI workflows or tests unless requested by the maintainer.
- Do not infer external services or APIs — the repository contains no integration code. Ask for network/service credentials or API contracts before introducing external integrations.

## When to ask the user

- Confirm the target Python version and whether PostgreSQL or SQLite should be the primary DB in development.
- Confirm preferred frontend state library (Zustand or Context) and whether to include React Hook Form.

## Files to reference when making changes

- `backend/backend_project/settings.py` — central settings (auth, CORS, DB from env).
- `frontend/pages/_app.tsx` and `frontend/styles/globals.css` — bootstrapping UI and Tailwind.

## Merging guidance

- Keep this file short. When updating, add dated bullets explaining why the change was made.

