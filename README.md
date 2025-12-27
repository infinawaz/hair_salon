# Salon Management — Monorepo

This workspace will contain two folders:

- `backend/` — Django + Django REST Framework API
- `frontend/` — Next.js (TypeScript) + Tailwind UI

This repo is scaffolded by an automated assistant. Use the READMEs in each folder for step-by-step setup instructions.

Top-level quick run (once services are created):

Backend:

```cmd
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
# create .env from .env.example and set values
python manage.py migrate
python manage.py runserver
```

Frontend:

```cmd
cd frontend
npm install
npm run dev
```

If you'd like, I can continue by implementing the Django models, serializers, views and the Next.js pages for Services, Staff, Customers, Appointments, and Billing. Reply "continue" or tell me which module to build first.
