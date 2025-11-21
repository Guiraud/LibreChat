# Repository Guidelines

## Project Structure & Module Organization
- `client/` hosts the Vite React frontend (JSX + TS types). Shared UI helpers live in `client/src/common`, while routing, hooks, and stores sit under `routes/`, `hooks/`, and `store/`. Static assets live in `client/public/`.
- `api/` contains the Express + Mongoose backend plus config scripts in `api/server/` and `config/`. Auth, provider, and MCP integrations all originate here.
- `packages/` exposes reusable workspaces: `data-provider`, `data-schemas`, `api`, and `client`. These must be built before packaging the UI or desktop app.
- `desktop/` wraps the client inside Electron; sync it with the built frontend via `npm run frontend` before packaging.
- Testing, automation, and infra assets reside in `e2e/` (Playwright specs), `helm/`, `deploy-compose.yml`, and `utils/`. Use `librechat.example.yaml` as the baseline for runtime configuration.

## Build, Test, and Development Commands
- `npm run backend:dev` — nodemon-powered API with `NODE_ENV=development`.
- `npm run frontend:dev` — Vite dev server (default http://localhost:3080) after ensuring `packages/data-provider` is built.
- `npm run backend` / `npm run frontend` — production builds for API and client (the latter chains workspace builds plus `vite build`).
- `npm run test:client` / `npm run test:api` — Jest suites for the frontend and backend; run before every PR touching those areas.
- `npm run e2e` — local Playwright regression tests; `npm run e2e:headed` helps debug flaky flows.
- Quality gates: `npm run lint`, `npm run format`, and `npm run typecheck` (from `client/`).

## Coding Style & Naming Conventions
- Enforced by the monorepo ESLint flat config plus Prettier. Use 2-space indentation, trailing commas where possible, and single quotes in JS/TS.
- React components and hooks follow `PascalCase` and `useCamelCase` naming; utility functions remain `camelCase`. Keep file names aligned with the default export (e.g., `ConversationList.jsx`).
- Respect import boundaries: prefer workspace packages or the `~` alias (client) instead of deep relative paths, and avoid cycles flagged by `import/no-cycle`.
- Tailwind classes should be merged via `tailwind-merge`; co-locate small styles in the component and larger themes in `client/src/style.css`.

## Testing Guidelines
- Unit tests belong next to their sources using `*.test.(js|ts|tsx)` or in `client/test/` and `api/__tests__/`. Favor Jest + React Testing Library for UI and Jest + Supertest for HTTP handlers.
- Mock external AI providers, S3, and Redis. Keep fixtures in `client/test/__fixtures__` or `api/testData` to avoid hitting live services.
- Playwright specs in `e2e/tests/` should cover the end-user happy paths; regenerate auth state with `npm run e2e:login`.
- Maintain or increase coverage for touched layers; add regression tests whenever fixing a bug.

## Commit & Pull Request Guidelines
- Follow the existing Conventional-style pattern with emojis, e.g., `🔧 fix: Prevent duplicate preset IDs` or `🧪 test: Cover agent share dialog`. Keep messages imperative and scoped.
- Each PR should include: a concise summary, linked issue or discussion, testing evidence (`npm run test:client`, screenshots for UI), and notes about migrations, feature flags, or config changes (`librechat.example.yaml`). Attach UI captures when altering layout or theme tokens.
- Keep PRs focused; split unrelated refactors, and ensure lint/test pipelines pass before requesting review.

## Configuration & Security Tips
- Copy `librechat.example.yaml` to your deployment, never commit secrets. Use `.env` files ignored by git for provider keys.
- Scripts within `config/` (e.g., `create-user`, `reset-password`) assume a running backend; point `MONGO_URI`, Redis, and storage buckets to non-production resources while testing.
- Sanitize uploaded files and logs under `uploads/` and `logs/` before sharing bug reports.
