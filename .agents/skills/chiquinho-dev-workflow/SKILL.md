---
name: chiquinho-dev-workflow
description: >-
  Use this skill when developing, testing, or running the Chiquinho Motors project. It provides the runbooks for starting the backend and frontend servers, managing the PostgreSQL database, and developing new modules (cars, parts, accessories, services).
---

# Chiquinho Motors Development Workflow

This skill outlines the standard operating procedures for the Chiquinho Motors project.

## Running the Project
To start the project locally, run both the backend and frontend in separate terminals:

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   # npx prisma generate / migrate (when Postgres is fully active)
   npm start
   ```
   *A API estará disponível em `http://localhost:3001`*

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *O site estará disponível em `http://localhost:5173`*

## Database Workflow (PostgreSQL)
The system is migrating to utilize PostgreSQL as the core database.
1. **Migrations**: Whenever modifying the schema for Cars, Parts, Accessories, or Services, run the ORM migration tool (e.g., `npx prisma migrate dev`).
2. **Entity Management**: Ensure any new endpoint follows the pattern `/api/[entity]`, routing to controllers that query PostgreSQL.

## Adding a New Domain Entity (e.g., Parts or Accessories)
1. Model the table in the database schema (ensuring foreign keys if parts are vehicle-specific).
2. Create standard CRUD endpoints in Express (`backend/server.js` or dedicated routes).
3. Create the corresponding Vue 3 Views and Components in the frontend.

## Troubleshooting
- **CORS Errors**: Garanta que o frontend chame `/api/...` para aproveitar o proxy do Vite.
- **Database Issues**: Verify `DATABASE_URL` in `.env` points to your active local PostgreSQL service.
