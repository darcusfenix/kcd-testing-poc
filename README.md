# KCD Testing Best Practices PoC

A proof-of-concept project demonstrating **Kent C. Dodds' testing best practices** with a real-world Users List page.

## Quick Start

```bash
npm install

# Run the app with mocked API (MSW in the browser)
npm run dev:mock

# Run unit + integration tests (Vitest)
npm test

# Run tests once
npm run test:run

# Run E2E tests (Playwright)
npx playwright install chromium
npm run test:e2e
```

## Project Structure

```
src/
├── api/                    # API client functions
├── components/             # React components + component tests
│   ├── UserCard.tsx
│   ├── UserCard.test.tsx
│   ├── SearchInput.tsx
│   ├── SearchInput.test.tsx
│   ├── Pagination.tsx
│   ├── Pagination.test.tsx
│   └── StatusFilter.tsx
├── hooks/
│   └── use-users.ts
├── mocks/                  # MSW mock infrastructure (shared dev + test)
│   ├── browser.ts                # MSW worker for development
│   ├── server.ts                 # MSW server for tests (Node.js)
│   ├── handlers/
│   │   ├── index.ts
│   │   └── users.ts              # API handlers used everywhere
│   └── fixtures/
│       ├── users.ts              # Small, deterministic fixture
│       ├── generate-users.ts     # Factory functions for large datasets
│       └── generate-users.test.ts
├── pages/
│   ├── UsersPage.tsx
│   └── UsersPage.test.tsx        # Integration tests (Testing Trophy core)
├── testing/
│   ├── setup.ts                  # Global test setup (MSW lifecycle)
│   └── test-utils.tsx            # Custom render + re-exports
├── types/
│   └── user.ts
└── utils/
    ├── format-user.ts
    └── format-user.test.ts       # Unit tests (pure functions)
e2e/
└── users.spec.ts                 # Playwright E2E tests
```

## KCD Best Practices Applied

### 1. The Testing Trophy (not Pyramid)

```
    /  E2E  \            <- Few, critical user flows (Playwright)
   /----------\
  / Integration \        <- Most tests live here (Testing Library + MSW)
 /----------------\
/ Component Tests  \     <- Individual component behavior
--------------------
    Unit Tests           <- Pure functions only
```

### 2. "Write tests. Not too many. Mostly integration."

`UsersPage.test.tsx` is the core - it tests the full page with all components wired together, with MSW intercepting network calls.

### 3. Test Behavior, Not Implementation

- **DO**: `screen.getByRole('button', { name: /delete/i })`
- **DON'T**: `wrapper.find('.delete-btn').simulate('click')`

### 4. Accessible Queries (Priority)

1. `getByRole` - the user sees roles
2. `getByLabelText` - form elements
3. `getByText` - visible text
4. `getByPlaceholderText` - last resort
5. `getByTestId` - escape hatch only

### 5. MSW for Mocking (Not Module Mocks)

Mock at the **network boundary**, not at the module level. The same handlers power:
- `npm run dev:mock` - development mode with mocks
- Vitest tests - via `setupServer`
- E2E tests - via `setupWorker` in the browser

### 6. Factory Functions for Large Data

Instead of 5000+ line JSON fixture files:

```typescript
// Generate 200 users on-the-fly (would be 5k+ lines as JSON)
const users = buildUsers(200)

// Override only what matters for THIS test
const user = buildUser({ status: 'inactive', name: 'Test User' })
```

### 7. Custom Render Function

Every test imports from `@/testing/test-utils` instead of `@testing-library/react`:

```typescript
import { render, screen } from '@/testing/test-utils'

const { user } = render(<MyComponent />)
await user.click(screen.getByRole('button'))
```

### 8. Per-Test Server Overrides

```typescript
// In setup: default happy-path handlers
// In specific test: override for error scenario
server.use(
  http.get('/api/users', () => new HttpResponse(null, { status: 500 }))
)
```

### 9. findBy for Async (not waitFor + getBy)

```typescript
// DO:
expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()

// DON'T:
await waitFor(() => {
  expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
})
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (real API) |
| `npm run dev:mock` | Start dev server with MSW mocks |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright with UI |
| `npm run test:all` | Run all tests (unit + integration + E2E) |
