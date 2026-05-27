# AGENT.md - Business suite and cutting edge ai agent run business
## Project Vision
- **Main App** (in dev enviroment`dev/proto-2`): Lightweight, fast, CRUD + automation focused. Public marketing site + simple admin.
- **Admin-Agent-GUI** (`dev/admin-agent-gui`): Heavy, complex UI for agents, tools, workflows, canvas editors, etc.
- **COSS UI**: Rigidly enforced across **all** interfaces. No ad-hoc Tailwind classes that duplicate COSS primitives.

## Architecture Rules
- Use **Turborepo** + **pnpm workspaces**
- All shared logic in `packages/shared`
- All UI components in `packages/ui-coss`
- Main app owns public SSR + lightweight admin
- GUI app owns complex interfaces

## COSS UI Enforcement
- **Read 'https://coss.com/ui/docs'**
- Every UI element must use components from `packages/ui-coss`
- No duplicate styling classes allowed
- All new components must be added to the shared COSS package first
- MUST INSTALL npx skills add cosscom/coss if not already present in project

## Phased Development (Strict)
**Phase 1 (Current):** Main App - Business Logic + Lightweight Admin
**Phase 2:** Heavy Admin-Agent-GUI
**Phase 3:** Full Agent System + Memory + Workflows

## Coding Standards
- TypeScript strict mode
- COSS UI only
- Bottom-up automation (business logic first)
- Detailed schema-driven development
- Clear separation of concerns

## Agent Behavior Rules
- Be concise by default.
- Answer the question that was actually asked.
- Do not restate the active plan unless the user asks for a plan update or the plan materially changed.
- Do not pad responses with extra options, summaries, or repeated rationale unless the user explicitly asked for choices or tradeoffs.
- Do not repeat the same point in different words.
- Keep progress updates brief and limited to meaningful deltas.

## Execution Rules
- Once a plan is agreed, execute it to completion.
- Do not stop mid-execution to ask what to do next if the next reasonable step is already clear.
- Only interrupt execution for a real blocker, a missing requirement, or an irreversible decision that requires user input.
- Finish the current slice before suggesting optional improvements.
- Solve the root problem, not just the visible symptom.
- Prefer robust, maintainable implementations over hacks, shortcuts, or one-off patches.

## Product and Architecture Mindset
- Think holistically about how each change fits the app, system, and user experience.
- Reuse existing abstractions, components, utilities, and patterns before creating new ones.
- Build for modularity, extensibility, reuse, movement, and long-term maintainability.
- Design interfaces to feel intentional, polished, inviting, and high quality.
- Treat design quality as a product requirement, not decoration.
- Do not make something "just work" if it weakens consistency, extensibility, robustness, or system design.