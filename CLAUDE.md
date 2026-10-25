# FIELDNOTES development instructions

## Product
Japanese collaborative idea/proposal app for a very50 project. Preserve existing records, archives and proposal fields. The UI has an idea board, a connected parent/child idea map, merge review, and a nine-section proposal form. Malaysia/Japan domestic programs are categories. This is Vinext + React + Cloudflare Workers + D1/Drizzle, not a generic static Next.js export.

Read README.md and docs/DEVELOPMENT.md before editing.

## Important boundaries
- This GitHub repository is a development copy. Pushes and PR merges do NOT automatically update the live Sites deployment.
- `.openai/hosting.json` retains the original Sites project identity. Do not change the ID, create another Site, change sharing, or delete/recreate the DB during ordinary feature work.
- Live user data is in the original Sites D1. It is not in Git. Local D1 is separate. Do not treat example ideas in `initial` as a snapshot of production data.
- Sites controls hosted authentication. Do not trust client-provided identity headers when porting to another host. A hosting migration requires a separate auth and data migration design.
- The app currently relies on Sites private access for shared API access. Do not make this app public without explicit server authorization for reads and writes.
- Never put credentials, tokens, keys, personal account session data, or database exports in source or PRs. Keep .env/.dev.vars, .wrangler, .sites-runtime, node_modules, dist ignored.
- Claude Code is the development assistant. Do not add Claude API calls, API billing, or send idea content to an external AI provider unless requested separately.

## Architecture
- `app/page.tsx`: client UI and keyword similarity heuristic; optional parentId connects same-category ideas.
- `app/api/workspace/route.ts`: shared JSON workspace with optimistic integer revision; return 409 instead of overwriting concurrent changes.
- `db/schema.ts`: workspaces table (id, JSON data, revision).
- `drizzle/`: immutable applied migrations. Append migrations for schema changes; do not create tables during requests.
- `app/globals.css`: responsive Japanese interface, green/cream visual theme, tree connectors.
- `vite.config.ts`, `worker/index.ts`, scripts/: preserve Sites/Vinext and Worker integration.

## Workflow
Use a feature branch and a PR. Explain user-facing behavior and actual validation. Read current main before editing to avoid overwriting your collaborator.
Use the pinned pnpm lockfile; do not switch package manager or bulk-upgrade dependencies for small UI work.

Validation:
1. `pnpm exec tsc --noEmit`
2. `pnpm build`
3. For changed interactive behavior: verify saving/reloading, merge/archive behavior, parent/child map placement, and narrow-screen layout as applicable.

Before DB-backed local preview, build once and apply pending local D1 migrations as documented. A fresh local DB has no production records.

Do not deploy from a Claude session unless the owner explicitly requests deployment and an authorized supported deployment path is available. Otherwise deliver the PR and its commit SHA so the owner can apply it through Sites.
