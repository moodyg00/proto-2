# COSS UI Guidance

## Core Rule

Use COSS UI for all interface work. Do not introduce shadcn/ui, Radix-only wrappers, or ad hoc component patterns that bypass the shared design system.

## Implementation Rules

- Prefer existing COSS primitives before creating new UI.
- If a reusable pattern is missing, add it to the shared COSS layer before duplicating it locally.
- Do not rebuild COSS primitives with custom Tailwind classes.
- Use Tailwind only for layout, spacing, and project-specific composition around COSS components.
- Keep interactions polished, intentional, and premium rather than generic dashboard UI.

## Screen Expectations

- Admin screens should feel lightweight and task-focused.
- Heavy agent workflows belong in `admin-agent-GUI`, not in the lightweight admin.
- Use consistent dialogs, tables, fields, tabs, menus, and feedback patterns across the suite.

## Quality Bar

- Match existing component patterns before inventing new ones.
- Prefer reusable abstractions over one-off visual fixes.
- Validate COSS-based UI changes before pushing.