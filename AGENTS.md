---
name: presentation-app
description: Full-stack interactive slide deck builder for live workshops
---

# AGENTS.md

## Project

Presentation App — live slide rendering + admin dashboard for delivering a
50-min workshop on "Building Apps with Google AI Studio & Antigravity."
15 slide layout types, image management, theme customization, backup/restore.

## Tech Stack

| Layer   | Tools                                                             |
|---------|-------------------------------------------------------------------|
| Front   | React 18 + TypeScript, Vite 6, MUI v6, framer-motion, zustand    |
| Back    | Express 4 + TypeScript via `tsx`, file-based JSON storage         |
| Image   | sharp (processing), multer (upload), archiver/unzipper (backup)   |
| Dev     | concurrently (parallel server + UI), Vite proxy to :3001          |

Non-obvious:
- Dev server uses `tsx` to run TypeScript directly — no `tsc` compile step
- Server ESM requires `.js` extensions in import paths (e.g. `./routes.js`)
- Vite proxies `/api` and `/images` to Express at `http://localhost:3001`
- `concurrently` runs both servers in one terminal

## Commands

| Command            | Intent                                              |
|--------------------|-----------------------------------------------------|
| `npm run dev`      | Start dev (server + Vite in parallel)               |
| `npm run build`    | Vite build + tsc check (server)                     |
| `npm start`        | Production server (serves `dist/` + API, :3001)     |
| `npm run server`   | Server-only watch mode                              |

Always run `npm run build` before committing to catch TS errors.

## Architecture Pointers

- `server/index.ts` — Express entry: mount routes, serve static, file watcher
- `server/routes/` — 6 route modules: presentation, settings, slides, upload,
  images, backup
- `server/storage/db.ts` — JSON read/write, image library, defaults
- `server/middleware/upload.ts` — multer config, file filter, 20 MB limit
- `src/main.tsx` → `App.tsx` — React entry point and router
- `src/store/presentationStore.ts` — zustand store for slide data + actions
- `src/store/settingsStore.ts` — zustand store for app settings
- `src/api/client.ts` — typed fetch wrappers, all backend calls
- `src/types/index.ts` — all shared interfaces (Slide, Settings, etc.)
- `src/theme.ts` — MUI theme builder from Settings object
- `src/components/Presentation/` — slide renderer + live view
- `src/components/Dashboard/` — admin panels (7 components)
- `vite.config.ts` — plugin setup, `@/` alias, proxy config
- `tsconfig.json` — strict ES2022, bundler module resolution
- `tsconfig.server.json` — server-specific TS config
- `storage/presentation.json` — slide deck data (matches `Slide` interface)
- `storage/settings.json` — app settings (matches `Settings` interface)
- `storage/images/` — uploaded images + thumbnails subdirectory

## Code Conventions

**File headers.** Every source file starts with:
```ts
// Purpose: ...
// Responsibilities: ...
// Public interfaces: ...
// Dependencies: ...
// Related files: ...
```
Read these first — they're the fastest navigation aid.

**Naming.**
- PascalCase: components, types, interfaces
- camelCase: functions, variables, hooks
- kebab-case: filenames

**Imports.** Use `@/` alias for `src/` (configured in vite.config.ts).
Server imports use `.js` extensions per ESM convention:
```ts
import { presentationRouter } from './routes/presentation.js';
```

**State.** Zustand stores with typed interfaces. Async actions defined inside
the store (see `src/store/presentationStore.ts`).

**API.** All calls through `src/api/client.ts`. Responses wrapped in
`ApiResponse<T>`. Errors throw with `body.error || 'HTTP {status}'`.

**Styling.** MUI `sx` prop or `styled` components. Use theme tokens, not raw
values. Theme built dynamically from Settings in `src/theme.ts`.

**Slide data.** Typed JSON in `storage/presentation.json`. Schema defined by
`Slide` interface in `src/types/index.ts`. 15 layout types: hero, content,
divider, hero-alt, with sub-types (featureGrid, timeline, pipeline,
comparisonTable, beforeAfter, interactive, etc.).

**Type safety.** Strict TS. Prefer `unknown` over `any` for new code.
Existing files tolerate `noUnusedLocals: false`.

## Testing

No test framework configured yet. Verification by:
- `npm run build` — catches all TS errors
- Manual check of `/api/presentation` and `/api/settings` endpoints
- Image upload → verify via `/images` endpoint (thumbnail auto-generated)
- Check `storage/presentation.json` schema matches `Slide` interface

## Git Workflow

- Branches: `feat/`, `fix/`, `refactor/`, `chore/`
- Commits: conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`)
- Scope: one slide type change = one commit. Small, focused PRs
- No direct pushes to main

## Boundaries

**Always:**
- Read file header comments before editing a source file
- Run `npm run build` after any change
- Preserve `Slide` / `Settings` interface shapes in storage JSON
- Match existing code patterns (same naming, same structure)

**Ask:**
- Before restructuring routes or adding new route modules
- Before changing the JSON storage format or adding a database
- Before adding major npm dependencies

**Never:**
- Delete `storage/` data files
- Commit credentials or API keys
- Edit `node_modules/` or `dist/`
- Remove file header comments
- Bypass the `src/api/client.ts` API layer in components

## Agent Notes

Treat the file header blocks as your primary navigation. Start any task by
reading `src/types/index.ts` to understand the data model, then check
`storage/presentation.json` for current slide structure.

When researching, use `dispatch` with focused questions about the codebase
rather than reading everything.

After each change, verify with `npm run build`.

## Related Docs

(Not yet written — add as needed for deep work.)

- `agent_docs/slide-types.md` — detailed guide to all 15 slide layout types
- `agent_docs/image-workflow.md` — upload, compression, thumbnail, reference
- `agent_docs/theme-system.md` — Settings → MUI theme mapping
- `agent_docs/storage-schema.md` — JSON file shapes and migration patterns
