# Pawket (Cat Expense)

- [`Frontend/`](./Frontend) — React + Vite + Tailwind app
- [`Playwright/`](./Playwright) — Playwright end-to-end tests
- [`.github/workflows/`](./.github/workflows) — CI/CD (deploy Frontend to Cloudflare Pages)

Live app: https://pawket.pages.dev

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

App runs at http://localhost:3001 by default.

### Tech stack

| Technology | Role |
| --- | --- |
| **React + Vite** | UI framework and build tooling |
| **TypeScript** | Typed JavaScript |
| **Shadcn** | Component library (Radix-based primitives, copy-into-project) |
| **ThemeCN** | Theme editor used to tune CSS color tokens (see link in `src/index.css`) |
| **Tailwind CSS** | Utility-first CSS library |
| **Lucide React** | Icon library |
| **Vitest** | Unit tests |

### Folder structure

```
Frontend/
├── public/                 # Static assets served as-is
│   ├── images/             # Images (photos, PNGs, decorative SVGs)
│   └── svgs/               # Brand / UI SVG icons
├── src/
│   ├── components/         # App UI
│   │   ├── dialogs/        # Modal flows (create/edit, delete expense)
│   │   ├── ui/             # Shadcn primitives (button, input, table, …)
│   │   └── *.tsx           # Feature components (Navbar, ExpenseTable, Footer)
│   ├── constants/          # Shared constants (API URLs, app-wide values)
│   ├── lib/                # Small shared helpers (e.g. `cn()` for class names)
│   ├── services/           # External API / data-fetching logic
│   ├── types/              # TypeScript models and type definitions
│   ├── utils/              # Pure helpers (formatting, expense logic, …)
│   ├── App.tsx             # Root app layout and state wiring
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles, Tailwind, theme tokens
├── components.json         # Shadcn CLI config
└── vite.config.ts          # Vite + Vitest config
```

- **`public/`** — Files referenced by path (favicon, images, SVGs); not processed by the bundler the same way as `src/`.
- **`src/components/`** — Screen-level and feature UI. Feature components live at this level; reusable dialogs under `dialogs/`; Shadcn building blocks under `ui/`.
- **`src/constants/`** — Fixed values used across the app (e.g. API endpoints).
- **`src/lib/`** — Low-level utilities shared by components (class-name merging, etc.).
- **`src/services/`** — Calls to external APIs and related data access.
- **`src/types/`** — Shared TypeScript types/models for expenses and related data.
- **`src/utils/`** — Domain helpers and formatting; often covered by unit tests.

### Unit tests (Vitest)

```bash
cd Frontend
npm test
```

Useful scripts:

- `npm test` — run unit tests once
- `npm run test:watch` — watch mode
- `npm run test:coverage` — coverage report

## E2E tests (Playwright)

```bash
cd Playwright
npm install
npx playwright install chromium   # first time only
npm test
```

Set `BASE_URL` in `Playwright/.env` (see `.env.example`), or pass it inline.
Defaults to `http://localhost:3001` when unset.

```bash
# Playwright/.env
BASE_URL=https://pawket.pages.dev
```

Useful scripts (from `Playwright/`):

- `npm test` — run all e2e tests
- `npm run test:ui` — Playwright UI mode
- `npm run test:headed` — headed browser
- `npm run report` — open the HTML report

When `BASE_URL` points at localhost, Playwright starts `Frontend` via `npm run dev` automatically. For remote URLs, the local server is skipped.

## CI/CD and deployment

Deployment is handled by GitHub Actions → Cloudflare Pages.

Workflow: [`.github/workflows/deploy-frontend-cloudflare-pages.yml`](./.github/workflows/deploy-frontend-cloudflare-pages.yml)

### When it runs

Triggers on **push to `main`** when either of these change:

- `Frontend/**`
- the deploy workflow file itself

### Pipeline steps

1. Check out the repo
2. Set up Node.js `22.19.0` (npm cache from `Frontend/package-lock.json`)
3. In `Frontend/`: `npm ci` → `npm run build`
4. Publish `Frontend/dist` with Wrangler to Cloudflare Pages project **`pawket`** (`--branch=main`)

### Required GitHub secrets

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Auth for Wrangler Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account that owns the Pages project |

After a successful deploy, the production site is available at https://pawket.pages.dev.
