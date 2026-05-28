# Strict coss ui Adherence Rules

**MANDATORY**: Every UI component in both apps MUST use coss ui exclusively. No shadcn/ui, no Radix primitives, no other libraries.

## Installation
pnpm dlx skills add cosscom/coss (or follow current coss registry)

## Core Principles
- Use coss Dialog / Sheet / Drawer correctly (section structure: Header, Panel, Footer)
- Always use render props pattern where applicable
- Tailwind v4 semantic colors and --alpha() syntax
- data-slot selectors for styling
- Font variables: --font-sans, --font-mono, --font-heading

## Migration from shadcn (if any legacy)
- asChild → render
- onSelect → onClick for many components
- ToggleGroup type="multiple"

## Common Pitfalls to Avoid
- Never mix coss with other UI libs
- Always check coss skill for latest patterns before coding
- Use particle examples from coss catalog for production quality

## Enforcement
Grok must refuse any PR or edit that uses non-coss components. All new screens start with coss layout primitives.

**Reference**: Full coss skill loaded automatically when working on UI tasks.