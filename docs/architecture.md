# Architecture

## High-Level
Two separate Next.js apps on same Hostinger server (initial deployment), sharing single Postgres DB via Prisma client.

- **proto-2** (public + lightweight admin): Next.js App Router, public marketing site, simple CRUD admin for business entities.
- **admin-agent-GUI** (deep workspace): Full agentic OS with human-agent task interface, memory explorer, content studio, startup lab.

## Data Flow
- Both apps use identical Prisma client (same DATABASE_URL + schema.prisma from proto-2).
- admin-agent-GUI reads/writes heavily to proto-2 models (Leads, Opportunities, WorkOrders, Invoices, Ads, Users with ai_agent role, etc.).
- Future: tRPC layer or shared package for type-safe calls. Initial: direct Prisma + API routes.

## Key Models (Prisma)
Huge comprehensive schema ported from Laravel:
- User (human / ai_agent / automation, roles)
- Business, Organization, Contact, Lead, Opportunity, Ticket, Estimate, Invoice, WorkOrder, Product, Inventory, Booking
- Finance: JournalEntry, ChartOfAccount, Payment
- Marketing: Ad, AdCampaign, Funnel, MarketingAttribution
- Operations: SafetyIncident, Review, Integration, Webhook, ApiCredential

## UI Layer
Strict coss ui only. No other component libraries. All screens composed from coss Dialog, Sheet, Drawer, DataTable, etc. with Tailwind v4 semantic tokens.

## Agent Memory
To be implemented in admin-agent-GUI: vector embeddings + graph for long-term agent memory tied to business entities.

## Deployment
Initial: Two separate apps on Hostinger VPS, same DB. Later: Turborepo monorepo if needed.