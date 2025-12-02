# No-Code Data App Builder (Kendraio v2)

A schema-driven, role-aware dashboard for building and managing data flows without writing code. Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## Features

- **Schema-driven layouts** – Dashboard widgets, stats, and sections are defined in `src/config/dashboard.ts`. Add or remove components by editing JSON-like configuration.
- **Role-based visibility (RBAC)** – Stats, widgets, and entire sections can be shown/hidden per role (viewer, analyst, admin). Switch roles via the header dropdown.
- **Data-source abstraction** – The dashboard pulls live data through a pluggable adapter interface (`src/data/dashboard-data-source.ts`). Swap the mock adapter for REST/GraphQL backends without touching UI code.
- **Reusable UI primitives** – Built on Radix UI and shadcn/ui with shared motion and styling utilities.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or later |
| npm | 9 or later (comes with Node) |

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/tvbibayan/Nocodedataappbuilderkendraiov2copy.git

# 2. Navigate into the project folder
cd Nocodedataappbuilderkendraiov2copy

# 3. Install dependencies
npm install
```

---

## Running Locally

```bash
# Start the Vite dev server (hot-reload enabled)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building for Production

```bash
npm run build
```

Output files are written to `dist/`. Serve them with any static file server.

---

## Project Structure

```
src/
├── components/       # React components (Dashboard, StatsCard, etc.)
│   └── ui/           # shadcn/ui primitives
├── config/           # Dashboard schema & role definitions
├── data/             # Data-source interfaces & mock adapter
├── styles/           # Global CSS / Tailwind config
└── main.tsx          # App entry point
```

---

## Customisation

### Adding a new stat card
Edit `src/config/dashboard.ts` → `stats` array. Each entry needs `id`, `label`, `value`, `change`, `color`, and optional `visibleTo` roles.

### Creating a new widget
1. Build a React component in `src/components/`.
2. Register it in `componentRegistry` inside `Dashboard.tsx`.
3. Add a widget entry to a section in `dashboard.ts`.

### Connecting real data
Implement `DashboardDataSource` (see `src/data/dashboard-data-source.ts`) and import your adapter instead of `mockDashboardDataSource`.

---

## License

MIT – see `LICENSE` for details.
