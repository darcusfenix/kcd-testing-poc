/**
 * KCD Best Practice: Component test with async behavior.
 *
 * - Test the behavior the user sees, not internal state
 * - For debounce, use waitFor with real timers for reliable results
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@/testing/test-utils'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders with placeholder text', () => {
    render(<SearchInput onSearch={vi.fn()} />)
    expect(
      screen.getByPlaceholderText('Search users...'),
    ).toBeInTheDocument()
  })

  it('calls onSearch after debounce period', async () => {
    const handleSearch = vi.fn()

    const { user } = render(
      <SearchInput onSearch={handleSearch} debounceMs={50} />,
    )

    await user.type(screen.getByRole('searchbox'), 'alice')

    // Wait for debounce to fire
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith('alice')
    })
  })

  it('has accessible label', () => {
    render(<SearchInput onSearch={vi.fn()} />)
    expect(screen.getByLabelText('Search users')).toBeInTheDocument()
  })
})
