# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web Push notification scheduler built with Node.js and Express. Accepts push subscriptions with scheduled datetime and payload, stores them, and sends notifications at the specified time via Web Push Protocol.

## Commands

```bash
npm run setup        # Install dependencies and generate VAPID keys
npm run start        # Start production server
npm run dev          # Start development server with watch mode
npm run test:jsonStore  # Run JSON store unit tests
npm run test:e2e     # Run end-to-end tests
```

Run a single test file:
```bash
node --test tests/jsonStore/store.test.ts
```

## Architecture

Dependency injection via factory functions in `main.ts`:

```
main.ts → createApp(port, router, scheduler, logger)
            ├── createRouter(scheduler, pusher, logger)
            │     ├── createNotificationRouter
            │     └── createVapidKeyRouter
            ├── createNotificationScheduler(store, pusher, logger)
            ├── createJsonStore(filename)
            ├── createWebPusher(vapidConfig, logger)
            └── createConsoleLogger()
```

**Core modules:**
- `scheduler/` - Polls store on interval, sends due notifications via pusher
- `jsonStore/` - File-based notification storage implementing `NotificationStore` interface
- `pusher/` - Web Push sending wrapper around `web-push` library
- `router/` - Express routes: `POST /api/notifications`, `GET /api/key`, `GET /api/health`

**Data flow:** Client → Router → Scheduler.schedule() → Store → (on interval) → Pusher → Push Service

## Code Style Rules

**No classes:** Use factory functions (`createX(deps) => { ...methods }`), pure functions, modules with named exports, and closures.

**ESM imports:**
- Only relative imports (`./`, `../`) - no aliases or path mapping
- Always include file extension (`.ts`)
- Order: library imports first, blank line, then project imports

**Async only:** Use `node:fs/promises` exclusively. No sync methods (`readFileSync`, `existsSync`, etc.).

**Git commits:** Commit messages must be in Russian.

## Testing

Tests use Node.js built-in test runner (`node:test`) with `node:assert/strict`. Test utilities in `tests/tools.ts` provide `createTestApp()` for e2e tests and `createFakeNotification()` for unit tests.

## Environment

Requires Node.js >= 22.6. Environment variables in `.env` (see `.env.example`):
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` - Generated via `npm run setup`
- `VAPID_SUBJECT` - Format: `mailto:email` or `https://domain`
- `PORT` - Server port (default: 3001)
