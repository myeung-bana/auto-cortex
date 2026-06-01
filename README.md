# AutoCore

Multi-tenant automotive CRM/CMS platform — Business Space dashboard prototype.

## Structure

```
auto-cortex/
├── apps/dashboard/     # Business Space Next.js app
├── packages/ui/        # Shared Shadcn/UI components
├── packages/utils/     # Domain types, Zod schemas, formatters
└── documentation/      # PRD & architecture docs
```

## Getting Started

This monorepo uses **Yarn 1 workspaces**.

```bash
cd auto-cortex
yarn install
yarn dev
```

To run only the dashboard app:

```bash
yarn dev:dashboard
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a demo account.

## Demo Accounts

| Account | Business Space | Role |
|---------|----------------|------|
| Vincent Chen | Vins Motors (Dealer) | Business Owner |
| Sarah Mitchell | Vins Motors (Dealer) | User |
| Elena Rodriguez | Prestige Rentals (Rental) | Business Owner |
| Marcus Webb | Prestige Rentals (Rental) | User |

Use the user menu to switch between demo spaces without signing out.

## Prototype Mode

The dashboard runs with static mock data (`NEXT_PUBLIC_USE_MOCK_DATA=true`).
Data persists in-memory during the dev session. A GraphQL provider can replace
the mock layer when the Nhost backend is connected.

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start all apps via Turborepo |
| `yarn dev:dashboard` | Start Business Space app on port 3000 |
| `yarn build` | Build all packages |
