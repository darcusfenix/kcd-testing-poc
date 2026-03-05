/**
 * KCD Best Practice: E2E Tests
 *
 * Top of the Testing Trophy - fewest tests, highest confidence.
 * Test the critical user journeys, not every edge case.
 *
 * The app runs with MSW in the browser, so these tests are
 * deterministic and offline-capable. Same mock handlers used
 * in unit/integration tests.
 *
 * KCD Patterns:
 * - Test user flows, not individual features
 * - Use accessible locators (getByRole, getByLabel, getByText)
 * - Avoid test IDs when accessible queries work
 * - Keep E2E tests focused on happy paths and critical flows
 */
import { test, expect } from '@playwright/test'

test.describe('Users Page', () => {
  test('displays the users list on load', async ({ page }) => {
    await page.goto('/')

    // Wait for users to load
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
    await expect(page.getByText('Leanne Graham')).toBeVisible()
    await expect(page.getByText('Ervin Howell')).toBeVisible()

    // Verify user count
    await expect(page.getByText(/showing \d+ of \d+ users/i)).toBeVisible()
  })

  test('user can search for a specific user', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Leanne Graham')).toBeVisible()

    // Search for a user
    await page.getByLabel('Search users').fill('clementine')

    // Wait for debounce and results
    await expect(page.getByText('Clementine Bauch')).toBeVisible()
    await expect(page.getByText('Leanne Graham')).not.toBeVisible()
    await expect(page.getByText(/showing 1 of 1 users/i)).toBeVisible()
  })

  test('user can filter by status', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Leanne Graham')).toBeVisible()

    // Filter by inactive
    await page.getByLabel(/filter by status/i).selectOption('inactive')

    // Should show only inactive users
    await expect(page.getByText('Clementine Bauch')).toBeVisible()
    await expect(page.getByText('Leanne Graham')).not.toBeVisible()
  })

  test('user can delete a user from the list', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Leanne Graham')).toBeVisible()

    // Accept the confirmation dialog
    page.on('dialog', (dialog) => dialog.accept())

    // Click delete for Leanne Graham
    await page
      .getByRole('button', { name: /delete leanne graham/i })
      .click()

    // Leanne should no longer appear
    await expect(page.getByText('Leanne Graham')).not.toBeVisible()
    await expect(page.getByText(/showing 4 of 4 users/i)).toBeVisible()
  })

  test('shows empty state when search has no results', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Leanne Graham')).toBeVisible()

    await page.getByLabel('Search users').fill('nonexistentuserxyz123')

    await expect(page.getByText(/no users found/i)).toBeVisible()
  })

  test('search and filter work together', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Leanne Graham')).toBeVisible()

    // Filter to active only
    await page.getByLabel(/filter by status/i).selectOption('active')
    await expect(page.getByText('Leanne Graham')).toBeVisible()

    // Then search within active
    await page.getByLabel('Search users').fill('patricia')
    await expect(page.getByText('Patricia Lebsack')).toBeVisible()
    await expect(page.getByText(/showing 1 of 1 users/i)).toBeVisible()
  })
})
