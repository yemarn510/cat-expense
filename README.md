# Pawket (Cat Expense)

- [`Frontend/`](./Frontend) — React + Vite + Tailwind app
- [`Playwright/`](./Playwright) — Playwright end-to-end tests

## Frontend

```bash
cd Frontend
npm install
npm run dev
```

App runs at http://localhost:3001 by default.

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
