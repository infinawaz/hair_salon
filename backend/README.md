# Backend — Django + DRF

This folder contains the Django REST API for the salon management system.

Prereqs:
- Python 3.10+ (recommended)
- PostgreSQL (optional; project can fallback to SQLite)

Quick setup (Windows CMD):

```cmd
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# edit .env to set DB values or keep SQLite fallback
python manage.py migrate
python manage.py runserver
```

If you want PostgreSQL locally, create a DB and user matching `.env` and update `DB_*` values.

Endpoints and API docs will be added as the project is implemented. Authentication uses JWT (SimpleJWT). CORS is preconfigured and reads allowed origins from `.env`.
