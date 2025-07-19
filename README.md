# ContextGuard: Context-Aware Access Control Policy Engine for Databases

## Overview
ContextGuard is a smart middleware system that acts as an intelligent gateway between applications and databases, implementing dynamic access control based on user context, time, location, and purpose.

## Architecture
```
Frontend (React) → API Gateway → Policy Engine → Database Layer
                     ↓
                 Audit Logger ← Policy Rules DB
```

---

## Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL (main), MongoDB (logs)
- Policy Engine: Custom JSON-based rules
- Auth: JWT tokens
- Containerization: Docker

## Quick Start
1. Clone this repo
2. Run `docker-compose up` (see `/docker`)
3. See `/backend` and `/frontend` for setup instructions

## Project Structure
- `/backend` - Express API, middleware, DB connectors
- `/frontend` - React app
- `/policy-engine` - Policy logic, rules, logger
- `/database` - Migrations, seeds
- `/docker` - Dockerfiles, compose

---

## Commit Your Work

```bash
git add .
git commit -m "chore: initial project structure, README, .gitignore, env examples"
```

