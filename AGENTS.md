# Chiquinho Motors - Project Context & Rules

## Scope and Architecture
This is the Chiquinho Motors Dealership System. The platform is a comprehensive system encompassing:
- **Veículos (Cars)**
- **Auto-peças (Auto Parts)**
- **Acessórios (Accessories)**
- **Serviços de Manutenção (Maintenance Services)**

The architecture is strictly split into two layers:
- **Frontend (`/frontend`)**: Vue 3 + Vite Single Page Application. (Pinia recommended for state management of complex catalogs).
- **Backend (`/backend`)**: Node.js + Express REST API.
- **Database**: PostgreSQL (Relational DB) using Prisma ORM (Recommended for strong typing and easy migrations).

## Development Rules
1. **Separation of Concerns**: Never mix frontend UI code with backend API logic. Keep changes isolated to their respective directories.
2. **Relational Modeling**: Ensure strict relationships in the database (e.g., auto parts and accessories should relate to specific compatible car models).
3. **Design System**: Maintain the "Carbon & Racing Red" visual identity. Keep CSS vanilla unless a refactor is explicitly requested.
4. **Running the App**: The backend (port 3001) and frontend (port 5173) must run concurrently during development. The Vite proxy handles CORS automatically.
5. **API Standards**: New domain models must follow standard REST patterns (e.g., `/api/pecas`, `/api/servicos`).
