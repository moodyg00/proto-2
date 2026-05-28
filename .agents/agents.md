# AGENTS.md

## Project

**proto-2 + admin-agent-GUI Business Suite**

Production-grade business operating system where humans and AI agents collaborate across one shared business stack.

- **proto-2** (`dev/proto-2`): public website plus lightweight admin for CRUD, automation, and business logic.
- **admin-agent-GUI** (`dev/admin-agent-gui`): deep agentic workspace for tasks, memory, content studio, startup lab, tools, workflows, and canvas-style interfaces.
- Both apps share the same PostgreSQL database through Prisma.

## Current State and Plan

- **Current phase:** Phase 1, Main App business logic plus lightweight admin.
- **Phase 2:** Heavy admin-agent-GUI.
- **Phase 3:** Full agent system, memory, and workflows.
- `proto-2` is an early Next.js refactor of Laravel with a large Prisma schema.
- `admin-agent-GUI` is currently an empty starter.
- See `docs/plan.md` for priorities.

## Stack and Architecture

- Next.js 15.3, React 19, TypeScript strict mode.
- Prisma 7 with PostgreSQL using a shared `DATABASE_URL`.
- Tailwind v4, AI SDK, Supabase auth, and Zod.
- Use Turborepo with pnpm workspaces.
- Keep shared logic in `packages/shared`.
- Keep shared COSS UI components in `packages/ui-coss`.
- Main app owns public SSR plus lightweight admin.
- GUI app owns complex interfaces.
- Use the shared Prisma schema for the full business model set, including entities such as `User`, `Lead`, `Opportunity`, `WorkOrder`, `Invoice`, `Ad`, and `Integration`.
- Admin-agent-GUI can perform heavy read and write operations through tRPC or direct Prisma access while both apps still share the same database.

## UI Rules

- COSS UI is mandatory across all interfaces.
- Follow the COSS docs and local guidance in `docs/coss-ui.md`.
- Do not use shadcn/ui. Migrate existing UI to COSS.
- Do not add ad hoc Tailwind styling that duplicates COSS primitives.
- Every screen should feel premium, intentional, and agent-native.
- New shared UI patterns belong in the shared COSS package first when they are broadly reusable.
- Install the COSS skill if it is not already present in the project.

## Development Standards

- Build business logic first, then automation on top.
- Prefer schema-driven development and clear separation of concerns.
- Reuse existing abstractions, components, utilities, and patterns before creating new ones.
- Optimize for modularity, extensibility, reuse, and long-term maintainability.
- Solve the root problem instead of patching symptoms.
- Prefer robust, maintainable implementations over hacks or one-off shortcuts.

## Agent Behavior

- Be concise by default.
- Answer the question that was actually asked.
- Do not restate the active plan unless the user asks for it or the plan materially changed.
- Do not pad responses with repeated rationale, extra summaries, or optional branches unless asked.
- Keep progress updates brief and focused on meaningful deltas.
- Once a plan is agreed, execute it to completion unless blocked by a real dependency, a missing requirement, or an irreversible decision.
- Do not stop mid-execution if the next reasonable step is already clear.
- Finish the current slice before suggesting optional improvements.

## Product Mindset

- Think holistically about how each change affects the app, the system, and the user experience.
- Treat design quality as a product requirement, not decoration.
- Do not make something "just work" if it weakens consistency, extensibility, or system design.

## Maintenance and Safety

- Update the architecture docs when the architecture changes.
- Use clear commit messages.
- Test COSS components before pushing.
- Sandbox agent tool calls.
- Require human approval for production changes.