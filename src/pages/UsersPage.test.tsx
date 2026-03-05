/**
 * KCD Best Practice: Integration Tests (the bulk of the Testing Trophy)
 *
 * "Write tests. Not too many. Mostly integration."
 *
 * These tests render the full page with all child components and real MSW
 * handlers. This gives maximum confidence because:
 *
 * 1. Components are tested together (as users experience them)
 * 2. Network calls go through MSW (testing the real fetch logic)
 * 3. No mocking of internal modules - only the network boundary
 * 4. Tests read like user stories
 *
 * KCD Patterns applied:
 * - findBy* for async elements (not waitFor + getBy*)
 * - User-centric queries (getByRole, getByText, getByLabelText)
 * - Per-test server overrides for error scenarios
 * - Testing what the user sees, not component internals
 * - Avoid fake timers in integration tests that use MSW (they conflict
 *   with MSW's internal delay). Use findBy and waitFor instead.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, within } from '@/testing/test-utils'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'
import { UsersPage } from './UsersPage'
import { seedDb } from '@/mocks/handlers'
import { buildUser, buildUsers } from '@/mocks/fixtures/generate-users'

describe('UsersPage', () => {
  it('renders a loading state then displays users', async () => {
    render(<UsersPage />)

    // KCD: The user sees a loading indicator first
    expect(screen.getByText(/loading users/i)).toBeInTheDocument()

    // KCD: Use findBy* for async - it combines waitFor + getBy
    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()

    // Loading indicator should be gone
    expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument()
  })

  it('displays the correct user count', async () => {
    render(<UsersPage />)

    expect(
      await screen.findByText(/showing 5 of 5 users/i),
    ).toBeInTheDocument()
  })

  it('shows an error state when the API fails', async () => {
    // KCD Pattern: Override handlers per-test for error scenarios
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    render(<UsersPage />)

    // KCD: Use findByRole('alert') for error messages
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/error/i)).toBeInTheDocument()

    // User should be able to retry
    expect(
      screen.getByRole('button', { name: /retry/i }),
    ).toBeInTheDocument()
  })

  it('retries fetching when the retry button is clicked', async () => {
    let requestCount = 0
    server.use(
      http.get('/api/users', () => {
        requestCount++
        if (requestCount === 1) {
          return new HttpResponse(null, { status: 500 })
        }
        return HttpResponse.json({
          data: [buildUser({ name: 'Recovered User' })],
          total: 1,
          page: 1,
          perPage: 10,
          totalPages: 1,
        })
      }),
    )

    const { user } = render(<UsersPage />)

    // Wait for error
    await screen.findByRole('alert')

    // Click retry
    await user.click(screen.getByRole('button', { name: /retry/i }))

    // Should show the recovered data
    expect(await screen.findByText('Recovered User')).toBeInTheDocument()
  })

  it('filters users by search term', async () => {
    const { user } = render(<UsersPage />)

    // Wait for initial load
    await screen.findByText('Leanne Graham')

    // Type in search - the debounce will fire after 300ms (real time)
    await user.type(screen.getByLabelText('Search users'), 'leanne')

    // KCD: Use waitFor to wait for async results after debounce + network
    await waitFor(() => {
      expect(screen.getByText(/showing 1 of 1 users/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
  })

  it('filters users by status', async () => {
    const { user } = render(<UsersPage />)

    // Wait for initial load
    await screen.findByText('Leanne Graham')

    // Select "Inactive" filter
    await user.selectOptions(
      screen.getByLabelText(/filter by status/i),
      'inactive',
    )

    // Should show only inactive users (Clementine and Chelsey from fixtures)
    await waitFor(() => {
      expect(screen.getByText('Clementine Bauch')).toBeInTheDocument()
    })
    expect(screen.getByText('Chelsey Dietrich')).toBeInTheDocument()

    // Active users should not be visible
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()
  })

  it('shows empty state when no users match', async () => {
    const { user } = render(<UsersPage />)
    await screen.findByText('Leanne Graham')

    await user.type(
      screen.getByLabelText('Search users'),
      'nonexistentuserxyz',
    )

    expect(await screen.findByText(/no users found/i)).toBeInTheDocument()
  })

  it('handles pagination with large datasets', async () => {
    // KCD Pattern: Seed the mock DB with large data for pagination testing
    seedDb(buildUsers(25))

    const { user } = render(<UsersPage />)

    // Wait for first page
    expect(
      await screen.findByText(/showing 10 of 25 users/i),
    ).toBeInTheDocument()

    // Navigate to next page
    await user.click(screen.getByRole('button', { name: /next page/i }))

    await waitFor(() => {
      expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument()
    })

    // Navigate to previous page
    await user.click(
      screen.getByRole('button', { name: /previous page/i }),
    )

    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
    })
  })

  it('handles deleting a user', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const { user } = render(<UsersPage />)

    // Wait for users to load
    await screen.findByText('Leanne Graham')

    // Find and click the delete button for Leanne
    const leanneCard = screen
      .getByText('Leanne Graham')
      .closest('article')!
    const deleteButton = within(leanneCard).getByRole('button', {
      name: /delete leanne graham/i,
    })

    await user.click(deleteButton)

    // Confirm dialog should have been shown
    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete this user?',
    )

    // After deletion, user should no longer appear (page refetches)
    await waitFor(() => {
      expect(
        screen.getByText(/showing 4 of 4 users/i),
      ).toBeInTheDocument()
    })
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()

    confirmSpy.mockRestore()
  })

  it('cancels deletion when user declines confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    const { user } = render(<UsersPage />)
    await screen.findByText('Leanne Graham')

    const leanneCard = screen
      .getByText('Leanne Graham')
      .closest('article')!
    await user.click(
      within(leanneCard).getByRole('button', {
        name: /delete leanne graham/i,
      }),
    )

    // User should still be there
    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()

    confirmSpy.mockRestore()
  })
})
