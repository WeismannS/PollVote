# Voting Application

A simple polling application where users can create polls, vote, and view results with support for anonymous poll creation and voting.
> this project was made as a technical assessment

## Tech Stack

### Frontend

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **Authentication**: Better-Auth (email/password)
- **Runtime**: Bun

### Backend

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better-Auth with session-based auth
- **Runtime**: Bun

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 17

## Quick Start

```bash
# Start all services
docker compose up

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## Features

- Create polls with 2-8 options
- Anonymous or public poll creation
- Anonymous or public voting
- One vote per user enforcement
- View poll results and voter lists
- User authentication (optional for anonymous usage)

## Project Structure

```
├── front-end/          # Next.js frontend
├── backend/            # NestJS backend
├── docker-compose.yml  # Docker orchestration
└── *.env              # Environment variables
```
