# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

LibreChat is a comprehensive AI chat platform built as a monorepo using npm workspaces. It provides a multi-model AI interface with support for OpenAI, Anthropic, Google, Azure, AWS Bedrock, custom endpoints, and more. The project includes Agents, MCP (Model Context Protocol) integration, file handling, web search, code interpretation, and a desktop Electron app.

## Essential Commands

### Development
```bash
# Backend development (auto-reload with nodemon)
npm run backend:dev

# Frontend development (Vite dev server on port 3090)
npm run frontend:dev

# First time setup - build all workspace packages
npm run build:packages

# Build specific packages
npm run build:data-provider
npm run build:data-schemas
npm run build:api
npm run build:client-package
```

### Production Builds
```bash
# Build backend for production
npm run backend

# Build frontend (chains all package builds + vite build)
npm run frontend

# Frontend CI build (for CI environments)
npm run frontend:ci
```

### Testing
```bash
# Run client tests (Jest + React Testing Library)
npm run test:client
cd client && npm run test:ci

# Run API tests (Jest + Supertest)
npm run test:api
cd api && npm run test:ci

# E2E tests (Playwright)
npm run e2e              # Headless mode
npm run e2e:headed       # Debug mode with browser
npm run e2e:debug        # Debug with PWDEBUG
npm run e2e:codegen      # Generate new test code
npm run e2e:login        # Regenerate auth state
```

### Code Quality
```bash
# Lint all code
npm run lint

# Lint with auto-fix
npm run lint:fix

# Format code with Prettier
npm run format

# TypeScript type checking (from client/)
cd client && npm run typecheck
```

### Database & User Management
```bash
# User management scripts (must be run from root)
npm run create-user
npm run invite-user
npm run list-users
npm run ban-user
npm run delete-user
npm run reset-password

# Balance management
npm run add-balance
npm run set-balance
npm run list-balances
npm run user-stats

# Database utilities
npm run reset-meili-sync
npm run flush-cache

# Permissions migrations
npm run migrate:agent-permissions
npm run migrate:prompt-permissions
```

### Desktop App
```bash
# Desktop development
npm run desktop:dev

# Build desktop app (platform-specific)
npm run desktop:build              # Auto-detect platform
npm run desktop:build:arm64        # macOS ARM64
npm run desktop:build:x64          # macOS x64
npm run desktop:build:universal    # macOS Universal

# Fix electron-builder issues
npm run desktop:fix
```

### Workspace Updates
```bash
# Update dependencies
npm run update              # Standard update
npm run update:local        # Local update only
npm run update:docker       # Docker-specific update
npm run update:deployed     # Deployed environment update

# Reinstall from scratch
npm run reinstall           # Full reinstall
npm run reinstall:docker    # Docker reinstall
```

## Architecture

### Monorepo Structure

LibreChat uses npm workspaces with four main areas:

1. **`api/`** - Express.js backend with Mongoose ODM
   - `api/server/` - Express app setup, middleware, routes
   - `api/app/` - Business logic (clients, tools, prompts)
   - `api/models/` - Mongoose schemas (Conversation, Message, Agent, User, etc.)
   - `api/cache/` - Redis caching layer
   - `api/server/services/` - Core services (Auth, MCP, Files, Endpoints, Permissions)
   - `api/server/controllers/` - Route handlers
   - Entry point: `api/server/index.js`

2. **`client/`** - Vite + React frontend
   - `client/src/components/` - React components
   - `client/src/hooks/` - Custom React hooks
   - `client/src/store/` - Recoil state management
   - `client/src/routes/` - React Router routes
   - `client/src/data-provider/` - API client layer
   - `client/src/utils/` - Utility functions
   - `client/src/Providers/` - React context providers
   - Build config: `client/vite.config.ts`

3. **`packages/`** - Shared workspace packages (must be built before client/api)
   - `packages/data-provider` - API client and data fetching layer
   - `packages/data-schemas` - Mongoose schemas and models
   - `packages/api` - MCP services and shared API utilities
   - `packages/client` - Reusable React components and UI primitives

4. **`desktop/`** - Electron wrapper
   - Must build frontend first with `npm run frontend`
   - Uses `electron-builder` for packaging
   - Config: `desktop/electron-builder.config.js`

### Key Architectural Patterns

#### Backend (Express + Mongoose)
- **Client Architecture**: AI provider clients inherit from `BaseClient` (api/app/clients/BaseClient.js)
  - `OpenAIClient`, `AnthropicClient`, `GoogleClient`, `OllamaClient`
  - Each client handles streaming, tool calling, and provider-specific features
- **Services Layer**: Core business logic in `api/server/services/`
  - `AuthService` - Authentication and session management
  - `MCP.js` - Model Context Protocol server integration
  - `PermissionService` - Role-based access control (RBAC)
  - `ModelService` - Model configuration and availability
  - `Files/` - File upload, storage (S3/Firebase/Local), and processing
- **Mongoose Models**: Database schemas in `api/models/`
  - `Agent.js` - AI agent configurations with tools and capabilities
  - `Conversation.js` - Chat conversations with branching support
  - `Message.js` - Individual messages with tool calls and artifacts
  - `User.js` - User accounts and authentication
  - `Transaction.js` - Token usage and billing
- **Middleware**: `api/server/middleware/` for auth, rate limiting, validation
- **Routes**: REST API endpoints in `api/server/routes/`

#### Frontend (React + Vite)
- **State Management**: Recoil for global state (`client/src/store/`)
- **Data Fetching**: React Query via `librechat-data-provider` package
- **Component Organization**:
  - Presentational components in `client/src/components/`
  - Shared UI primitives from `@librechat/client` package
  - Radix UI primitives with Tailwind CSS styling
- **Routing**: React Router v6 in `client/src/routes/`
- **Build Process**:
  1. Build workspace packages (`data-provider`, `data-schemas`, `api`, `client`)
  2. Run Vite build with TypeScript + JSX
  3. Post-build script copies PWA assets

#### MCP (Model Context Protocol)
- Server management in `packages/api/src/mcp/`
- Client-side MCP UI integration via `@mcp-ui/client`
- MCP servers are initialized in `api/server/services/initializeMCPs.js`
- Used for extensible tool integration with AI agents

#### Agent System
- Agents are configurable AI assistants with tools and capabilities
- Agent configurations stored in MongoDB (`api/models/Agent.js`)
- Support for file search, code execution, web search, and custom tools
- Permission system for sharing agents with users/groups/roles

### Import Aliases and Module Resolution

- Backend uses module-alias: `~` maps to `api/` directory
  - Example: `require('~/models')` → `api/models`
- Frontend uses Vite alias: `~` maps to `client/src/`
  - Example: `import { ... } from '~/utils'` → `client/src/utils`
- Workspace packages are referenced by name:
  - `librechat-data-provider`
  - `@librechat/data-schemas`
  - `@librechat/api`
  - `@librechat/client`

### Configuration Files

- **`.env`** - Environment variables (see `.env.example` for reference)
  - Required: `MONGO_URI`, provider API keys
  - Optional: Redis, S3, Firebase configs
- **`librechat.yaml`** - Runtime configuration (see `librechat.example.yaml`)
  - AI endpoints and models
  - Interface settings and feature flags
  - File storage strategies
  - Agent and MCP configurations
- **`docker-compose.yml`** - Local development with MongoDB, Redis, Meilisearch
- **`deploy-compose.yml`** - Production deployment configuration

### Database Schema Highlights

The MongoDB database uses these key collections:
- `conversations` - Chat history with branching/forking support
- `messages` - Individual messages with references to conversations
- `agents` - AI agent configurations with tools and instructions
- `users` - User accounts with OAuth and local auth
- `files` - File metadata (storage handled by S3/Firebase/local)
- `transactions` - Token usage tracking
- `prompts` - Shared prompt templates
- `roles` - RBAC role definitions

## Build Order Dependencies

**Critical**: Workspace packages must be built before client/api:

1. `npm run build:data-provider` - Core data types and API client
2. `npm run build:data-schemas` - Mongoose schemas
3. `npm run build:api` - MCP and shared API utilities
4. `npm run build:client-package` - Reusable React components
5. Then build `client` or `api` as needed

The `npm run frontend` script handles this automatically.

## Development Workflow

### Starting from Scratch
```bash
# 1. Install dependencies
npm install

# 2. Build all workspace packages
npm run build:packages

# 3. Start backend (requires MongoDB running)
npm run backend:dev

# 4. In another terminal, start frontend
npm run frontend:dev
```

### MongoDB Setup
- Local: Use `docker-compose.yml` to start MongoDB, Redis, Meilisearch
- Or point `MONGO_URI` to an existing MongoDB instance in `.env`

### Making Changes

**Frontend changes**:
- Most changes hot-reload automatically via Vite
- If modifying workspace packages, rebuild them first
- Check `client/vite.config.ts` for module resolution issues

**Backend changes**:
- `npm run backend:dev` uses nodemon for auto-reload
- If modifying mongoose models, check migration scripts in `config/`

**Workspace package changes**:
- Rebuild the specific package: `npm run build:data-provider`
- Restart both frontend and backend to pick up changes

### Common Pitfalls

1. **"Cannot find module" errors**: Rebuild workspace packages
2. **Import path issues with lucide-react**: Check `client/vite.config.ts` aliases
3. **Stale builds**: Run `npm run reinstall` to clean and rebuild everything
4. **Desktop app fails to build**: Ensure `npm run frontend` completed successfully first
5. **Test failures**: Check that test environment has access to test MongoDB (mongodb-memory-server)

## Testing Strategy

- **Unit tests**: Co-located with source files (`*.test.js`, `*.spec.js`)
- **Integration tests**: In `api/__tests__/` and `client/test/`
- **E2E tests**: In `e2e/tests/` using Playwright
- Mock external services (AI providers, S3, Redis) in tests
- Use fixtures in `client/test/__fixtures__` and `api/testData`

## Security Notes

- Never commit `.env` files or secrets
- `librechat.yaml` can be committed if sanitized
- API keys should be in `.env` or secure key management
- Files uploaded to `uploads/` and `logs/` may contain sensitive data
- Use `config/` scripts carefully in production (they access the database directly)

## Deployment

- Production builds should use `NODE_ENV=production`
- Build frontend with `npm run frontend`
- Run backend with `npm run backend`
- Use `deploy-compose.yml` for Docker deployments
- Configure reverse proxy (nginx/caddy) for SSL termination
- Set `TRUST_PROXY` correctly based on your setup

## Bun Support

LibreChat has experimental Bun support:
```bash
# Bun-specific commands (prefix with b:)
npm run b:api                    # Run backend with Bun
npm run b:client                 # Build client with Bun
npm run b:test:client            # Test client with Bun
npm run b:reinstall              # Reinstall with Bun
```

Note: Bun support is experimental and may have compatibility issues.
