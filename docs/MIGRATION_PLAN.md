# Proto‑1 → Proto‑2 Migration Plan

> Source of truth: `Proto-1` (Laravel + Filament v3 admin).
> Target: `proto-2` (Next.js 15 App Router + Prisma 7 + COSS UI).
> Hard rule: **on any conflict, Proto‑1 wins**.

This document captures the full inventory and the phased plan that the agent executes. It is intentionally exhaustive on schema and navigation because those are the long‑lived contracts of the migration.

---

## 1. Routes & Pages — Laravel → Next.js Mapping

Proto‑1 has two "outer" web routes plus the Filament admin panel (`/admin/...`), where each Filament Resource registers `index | create | edit | view` sub‑routes and each Filament Page registers a single route via `$slug`. Proto‑2 mirrors the admin URLs 1:1 under `app/admin/`.

### Public / public‑facing routes (Laravel `routes/web.php`)

| Laravel route                            | Proto‑2 route                | Notes |
|------------------------------------------|------------------------------|-------|
| `GET /` → redirect `/admin/tasks`        | `app/page.tsx` redirects     | Same |
| `GET /login`                             | `app/login/page.tsx`         | Placeholder (auth deferred) |
| `GET /booking/{token}`                   | `app/booking/[token]/page.tsx` | Public booking flow |
| `POST /booking/{token}`                  | API route                    | Placeholder |
| `GET /i/{token}` (public invoice)        | `app/i/[token]/page.tsx`     | Placeholder |
| `GET /pay/{invoice}` (Stripe)            | `app/pay/[invoice]/page.tsx` | Placeholder |
| `POST /stripe/webhook`                   | `app/api/stripe/webhook/route.ts` | Placeholder |
| Studio JSON endpoints (`/studio/api/*`)  | `app/api/studio/*/route.ts`  | Deferred |
| `GET /ide`                               | (Skipped — Livewire IDE)     | Out of scope for Phase 1 |

### Admin (Filament panel `/admin/...`)

Every Filament Resource produces `/<slug>` (index), `/<slug>/create`, `/<slug>/{record}/edit`, `/<slug>/{record}` view routes. Proto‑2 mirrors with `app/admin/<slug>/page.tsx` (list), `app/admin/<slug>/new/page.tsx` (create), `app/admin/<slug>/[id]/edit/page.tsx`, and `app/admin/<slug>/[id]/page.tsx` (view). For this pass we ship list + a single combined page placeholder per resource. CRUD detail/edit pages can be added incrementally; the schema and navigation are the long‑lived contracts.

### Menu groupings (matches Proto‑1 exactly)

Source: `app/Providers/Filament/AdminPanelProvider.php` and every Filament Resource/Page `$navigationGroup`.

```
Main
  ├ Dashboard (TasksPage   /admin/tasks)        sort 0  icon queue-list
  ├ Tasks (TaskResource   /admin/task-library)  sort 1  icon check-circle
  ├ Opportunities                /admin/opportunities      sort 1  briefcase
  ├ Images (MediaPage)           /admin/images             sort 2  photo
  ├ Assets                       /admin/assets             sort 3  folder
  └ Documents                    /admin/documents          sort 4  document-text

Operations
  ├ Dashboard (OperationsDashboard) /admin/operations-dashboard sort 1  home
  ├ Work Orders                  /admin/jobs               sort 2  briefcase
  ├ Schedule                     /admin/schedulings        sort 3  calendar-days
  ├ Availability                 /admin/schedulings/availability sort 4 clock
  ├ Booking Links                /admin/schedulings/booking-links sort 5 link
  └ Estimates                    /admin/estimates          sort 5  document-duplicate
  └ Invoices                     /admin/invoices           sort 6  document-text

Customer Relations
  ├ Dashboard (CrmDashboard)     /admin/crm-dashboard      sort 1  home
  ├ Organizations                /admin/organizations      sort 2  building-office-2
  ├ Contacts                     /admin/contacts           sort 3  users
  ├ Mail                         /admin/mail               sort 4  envelope
  └ Leads                        /admin/leads              sort 4  user-plus

Accounting
  ├ Dashboard (AccountingDashboard) /admin/accounting-dashboard sort 1 home
  ├ Chart of Accounts            /admin/chart-of-accounts  sort 2  queue-list
  ├ Journal Entries              /admin/journal-entries    sort 3  book-open
  ├ Balances                     /admin/balances           sort 3  scale
  ├ Payments                     /admin/payments           sort 5  credit-card
  ├ Recurring Invoices           /admin/recurring-invoices sort 7  arrow-path
  ├ Catalog                      /admin/catalog            sort 8  archive-box
  ├ Offerings                    /admin/offerings          sort 8  wrench-screwdriver
  └ Reports (AccountingReport)   /admin/accounting-reports sort 11 document-chart-bar

Banking
  ├ Bank Accounts                /admin/bank-accounts      sort 1  building-library
  ├ Transactions                 /admin/bank-transactions  sort 2  arrows-right-left
  ├ Cards                        /admin/bank-cards         sort 3  credit-card
  └ Bills                        /admin/bills              sort 5  receipt-percent

Marketing & Ads
  ├ Dashboard (MarketingDashboard) /admin/marketing-dashboard sort 1 home
  ├ Ads                          /admin/ads                sort 2  megaphone
  ├ Campaigns                    /admin/campaigns          sort 3  sparkles
  └ Design Studio                /admin/design-studio      sort 4  swatch

Content & Blog
  ├ Dashboard (ContentDashboard) /admin/content-dashboard  sort 1  home
  ├ Web                          /admin/web-contents       sort 2  globe-alt
  ├ Social Media                 /admin/social-media-posts sort 3  chat-bubble-left-right
  ├ Blog                         /admin/blog-posts         sort 4  pencil-square
  └ Physical                     /admin/physical-assets    sort 5  cube

AI Tools
  ├ Dashboard (AiDashboard)      /admin/ai-dashboard       sort 1  home
  ├ Agents                       /admin/agents             sort 2  cpu-chip
  ├ Workflows                    /admin/workflows          sort 3  arrow-path
  └ Architecture                 /admin/architectures      sort 4  circle-stack

Integrations
  ├ Dashboard (IntegrationsDashboard) /admin/integrations-dashboard sort 1 home
  ├ Marketplace                  /admin/marketplace-workspace sort 2 shopping-bag
  ├ Messages                     /admin/messages-workspace sort 3  inbox-stack
  ├ API                          /admin/api-integrations   sort 3  command-line
  ├ External Leads               /admin/external-leads     sort 4  user-plus
  ├ MCP                          /admin/mcp-servers        sort 4  server-stack
  ├ Snippets                     /admin/snippets           sort 5  code-bracket
  ├ Google                       /admin/google-workspace   sort 5  globe-alt
  └ Webhooks                     /admin/webhooks           sort 2  link

Administration
  ├ Settings                     /admin/settings           sort 1  cog-6-tooth
  ├ Log                          /admin/log                sort 2  clipboard-document-list
  └ Users                        /admin/users              sort 3  user-group
```

---

## 2. Prisma Schema Mapping (Postgres)

The full Postgres schema in `Proto-1/schema.sql` (95 tables) is ported verbatim to `prisma/schema.prisma` using:

- `provider = "postgresql"`
- `prisma-client` generator with `output = "../generated"`
- snake_case at the DB level (Postgres convention from Proto‑1) preserved via `@@map("table_name")` and `@map("column_name")`
- TypeScript field names in **camelCase**
- All FKs, indexes, unique constraints, and CHECK enums preserved
- CHECK‑constraint enums in SQL become Prisma `enum` types with a `_pg_check` suffix where they conflict with `model` names

Conflict resolution table:

| Proto‑1 (Laravel) construct | Prisma equivalent | Note |
|---|---|---|
| `uuid PRIMARY KEY DEFAULT gen_random_uuid()` | `String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid` | requires `pgcrypto` |
| `timestamptz DEFAULT now()` | `DateTime @default(now()) @db.Timestamptz(6)` | |
| `jsonb` | `Json @db.JsonB` | |
| `numeric(12,2)` | `Decimal @db.Decimal(12,2)` | |
| `varchar(N)` | `String @db.VarChar(N)` | |
| Polymorphic (`creatable_type` + `creatable_id`) | Stored as two scalar fields, no Prisma relation | mirrors Laravel morphTo |
| Composite indexes | `@@index([a, b])` | |
| Partial indexes (`WHERE provider IS NOT NULL …`) | Documented in `// note:` comments and the unique index is emitted as a regular `@@unique`. Prisma does not yet support partial unique indexes in schema syntax — DB‑level constraint applied via migration. | |

If the user runs `prisma migrate`, the migration script will need a `CREATE EXTENSION IF NOT EXISTS pgcrypto;` step (already in `schema.sql`).

---

## 3. Settings Inventory

Source: `app/Filament/Resources/SettingResource.php` + `app/Support/BrandSettings.php`.

The Proto‑1 `settings` table is a generic key‑value JSON store keyed by `(module, key)`. Modules:

| Module slug          | Label                |
|----------------------|----------------------|
| `business`           | Business             |
| `accounting`         | Accounting           |
| `operations`         | Operations           |
| `crm`                | Customer Relations   |
| `customer_relations` | Customer Relations   |
| `ui_preferences`     | User Preferences     |
| `user_preferences`   | User Preferences     |

Grouped categories used by the Settings filter:

| Category slug          | Label                       | Modules                              |
|------------------------|-----------------------------|--------------------------------------|
| `business`             | Business Settings           | business, accounting                 |
| `operations`           | Operations Settings         | operations                           |
| `customer_relations`   | Customer Relations Settings | crm, customer_relations              |
| `user_preferences`     | User Preferences            | ui_preferences, user_preferences     |

Branding additionally lives on `businesses` (`name`, `legal_name`, `logo_path`, `primary_color`, `accent_color`, `default_payment_terms`, `default_discount_type`, `document_intro_text`, `document_footer_text`, `is_primary`).

Proto‑2 Settings page exposes all four category tabs **plus** a fifth Theming tab (described below).

---

## 4. Theming Architecture (highest priority feature)

Requirement: a **main color scheme picker** + multiple **secondary palettes** for pills/badges.

### Storage

Two parallel storage layers (Prisma + localStorage) so the UI is instant and the server is source of truth:

- DB: `settings` row with `module='ui_preferences'` and `key='theme'`, `value` is a JSONB blob:
  ```json
  { "primary": "violet", "primaryHex": "#7C3AED", "palette": "default" }
  ```
- Client: same blob mirrored to `localStorage['proto2.theme']` for first‑paint without a server round‑trip.

### Runtime

`src/providers/theme-provider.tsx` is a client component that:

1. Reads the value from a server prop on first paint (server fetches the row through Prisma).
2. Falls back to `localStorage`, then to the built‑in default (`violet` + `default` palette).
3. Sets CSS variables on `document.documentElement`:
   - `--primary`, `--primary-foreground`, `--ring` (driven by the main color scheme)
4. Sets `data-palette="<name>"` on `<html>` so palette‑scoped CSS variables in `globals.css` swap the badge/pill colors atomically.
5. Persists changes back via a server action (`updateUserTheme`) and into `localStorage`.

### Palettes shipped

Each palette defines colors for badge variants `neutral`, `info`, `success`, `warning`, `danger`, `accent` plus `pill-bg`/`pill-fg` for soft chips:

- **Default** — Tailwind‑weight neutrals + saturated semantic colors
- **Vivid** — high‑saturation neons (fuchsia/cyan/lime/amber)
- **Pastel** — low‑saturation tints
- **Monochrome** — slate/gray gradient, single accent

### UI

The Settings → Theming tab uses COSS primitives:

- `coss/radio-group-cards` for "Main color" swatch picker (8 named colors), plus a "Custom hex" input.
- `coss/radio-group-cards` for "Palette" with a live mini‑preview of badges/pills inside each card.
- `coss/card` "Live preview" surface showing buttons, badges, pills, and a sample table row.

---

## 5. Phasing (what ships in this pass)

| Phase | Scope | Status |
|---|---|---|
| 0 | Discover + plan (this file) | ✅ |
| 1 | Prisma schema port (112 models from 95 SQL tables, FKs/indexes/checks preserved) | ✅ |
|   | Prisma 7 `prisma.config.ts` + `src/lib/prisma.ts` singleton with PrismaPg adapter | ✅ |
|   | `prisma generate` succeeds | ✅ |
| 2 | Canonical nav at `src/config/navigation.ts` + sidebar refactored to consume it | ✅ |
| 3 | Placeholder pages for every Proto-1 admin route (51 new + 14 existing = 65 routes) | ✅ |
| 4 | Settings page (`/admin/settings`) with category tabs: Theming, Business, Operations, Customer Relations, User Preferences, Advanced | ✅ |
|   | ThemeProvider w/ first-paint script + localStorage persistence + server-prop hydration hook | ✅ |
|   | Dual-layer theming: 8 named main colors + custom hex; 4 secondary palettes (default / vivid / pastel / monochrome) for pills/badges | ✅ |
|   | Live-preview surface in Theming tab | ✅ |
| 5 | `next build` clean (all 65 routes compile) + `tsc --noEmit` clean | ✅ |

### COSS UI installation (next pass)

COSS primitives are not yet `npx shadcn add`-ed into this repo. The theming
system has been built around the same CSS variable conventions COSS uses
(`--primary`, `--ring`, `--card`, `--border`, `--muted-foreground`, plus
palette `--pill-*` variables) so installing COSS components in the next pass
will inherit the user's theme automatically — no rewiring required.

When ready, install in this order:

```bash
npx shadcn@latest add @coss/button @coss/card @coss/field @coss/tabs \
  @coss/radio-group @coss/badge @coss/pill @coss/table @coss/dialog
```

Then swap the lightweight surface utilities in `app/globals.css` (`.card`,
`.btn`, `.pill`) for the COSS imports. Existing pages will pick up the
COSS visual language without code changes because they consume the same
variables.

Deferred to later passes (explicitly out of scope here, with placeholders pointing at the Proto‑1 controller):

- Full CRUD detail/edit forms per resource (only list placeholders ship now)
- Filament's `RelationManagers` (we'll port these incrementally per resource)
- Filament's Livewire `Ide` page
- Stripe webhook handler logic (route stub only)
- Public booking flow (route stub only)
- Studio API endpoints

---

## 6. Risks

- **Filament `RelationManagers`**: each Proto‑1 Resource defines nested relation managers (e.g. `OpportunityResource\RelationManagers\TasksRelationManager`). Porting these is iterative work — they become tabbed sub‑sections of the detail page.
- **Polymorphic relations** (e.g. `creative_assets.creatable_type/creatable_id`): Prisma does not support morphTo directly. We model them as plain scalar columns and document the morph in code.
- **CHECK constraints as enums**: not all Postgres CHECK constraints translate to a clean Prisma enum (e.g. when the same value space appears in multiple columns). We define enums where the value space is reused, and fall back to `String` + zod validation where it is one‑off.
- **Auth**: Proto‑1 uses Laravel session auth + Filament middleware. Proto‑2 doesn't have auth yet; pages render without it for now.

---

## 7. Commands the user should run after this pass

```bash
cd /Users/grant/Desktop/APP-LAB/dev/proto-2
npm install
npx prisma generate
npm run typecheck
```
