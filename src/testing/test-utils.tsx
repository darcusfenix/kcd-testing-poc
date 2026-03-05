/**
 * KCD Best Practice: Custom render function.
 *
 * "The more your tests resemble the way your software is used,
 *  the more confidence they can give you."
 *
 * This custom render wraps components with necessary providers
 * so each test doesn't have to set them up manually.
 *
 * Re-exports everything from @testing-library/react so tests
 * only import from this file.
 */
import { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function AllProviders({ children }: { children: React.ReactNode }) {
  // Add providers here as needed (Router, Theme, etc.)
  return <>{children}</>
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return {
    ...render(ui, { wrapper: AllProviders, ...options }),
    // KCD Pattern: Return userEvent.setup() for every render
    // so tests use the recommended event approach
    user: userEvent.setup(),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with our custom version
export { customRender as render }

// Re-export userEvent for convenience
export { userEvent }

// Re-export the MSW server for per-test handler overrides
export { server } from '@/mocks/server'
