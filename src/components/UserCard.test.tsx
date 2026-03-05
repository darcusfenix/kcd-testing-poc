/**
 * KCD Best Practice: Component Tests
 *
 * - Test from the user's perspective (what they see and interact with)
 * - Use accessible queries (getByRole, getByText, getByLabelText)
 * - Avoid testing implementation details (no checking state, internal methods)
 * - Use userEvent over fireEvent for realistic interactions
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/testing/test-utils'
import { UserCard } from './UserCard'
import { buildUser } from '@/mocks/fixtures/generate-users'

describe('UserCard', () => {
  it('displays user information', () => {
    const user = buildUser({
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: { name: 'Acme Corp', catchPhrase: '', bs: '' },
      status: 'active',
    })

    render(<UserCard user={user} />)

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('shows user initials in avatar', () => {
    const user = buildUser({ name: 'Jane Doe' })
    render(<UserCard user={user} />)

    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('calls onDelete with user id when delete button is clicked', async () => {
    const handleDelete = vi.fn()
    const user = buildUser({ id: 42, name: 'Test User' })

    const { user: userEvent } = render(
      <UserCard user={user} onDelete={handleDelete} />,
    )

    // KCD: Use accessible query - the button has an aria-label
    await userEvent.click(
      screen.getByRole('button', { name: /delete test user/i }),
    )

    expect(handleDelete).toHaveBeenCalledWith(42)
    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it('does not render delete button when onDelete is not provided', () => {
    const user = buildUser({ name: 'Test User' })
    render(<UserCard user={user} />)

    expect(
      screen.queryByRole('button', { name: /delete/i }),
    ).not.toBeInTheDocument()
  })

  it('renders correct status badge style', () => {
    const activeUser = buildUser({ status: 'active' })
    const { unmount } = render(<UserCard user={activeUser} />)
    expect(screen.getByText('active')).toHaveClass(
      'user-card__status--active',
    )
    unmount()

    const inactiveUser = buildUser({ status: 'inactive' })
    render(<UserCard user={inactiveUser} />)
    expect(screen.getByText('inactive')).toHaveClass(
      'user-card__status--inactive',
    )
  })
})
