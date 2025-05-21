# Authentication Demo

A Node.js authentication system with OAuth (GitHub) integration and PostgreSQL database.

## Features

- OAuth authentication with GitHub (extensible to other providers)
- PostgreSQL database integration
- TypeScript with ESM support
- Monorepo structure for backend and frontend
- Vitest for testing

## Project Structure

```
.
├── packages/
│   ├── backend/      # Backend Express application
│   │   ├── src/         # Source code
│   │   │   ├── auth/       # Authentication related code
│   │   │   ├── config/     # Configuration
│   │   │   ├── database/   # Database connection and operations
│   │   │   ├── middleware/ # Express middleware
│   │   │   ├── models/     # Data models
│   │   │   └── routes/     # API routes
│   │   └── tests/       # Tests
│   └── frontend/     # Frontend placeholder (future development)
```

## Requirements

- Node.js (LTS version)
- PostgreSQL

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file and update it with your details:
   ```bash
   cp packages/backend/env.example packages/backend/.env
   ```
4. Create a GitHub OAuth application and update the .env file with your client ID and secret
5. Start the development server:
   ```bash
   npm run dev:backend
   ```

## Development

- Run backend in development mode: `npm run dev:backend`
- Build backend for production: `npm run build:backend`
- Run tests: `npm test`

## Authentication Flow

1. User initiates authentication via GitHub
2. After successful GitHub authentication, user data is stored/updated in the database
3. A session is created for the authenticated user
4. Authentication state can be checked via the `/auth/status` endpoint

## Best Practices Implemented

- Secure session management
- Environment variable validation with Zod
- Security headers with Helmet
- TypeScript for type safety
- OAuth 2.0 implementation
 