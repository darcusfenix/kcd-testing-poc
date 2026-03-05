/**
 * KCD Best Practice: Test user interactions, not state.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/testing/test-utils'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('displays current page and total pages', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
  })

  it('disables Previous button on first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: /previous/i }),
    ).toBeDisabled()
  })

  it('disables Next button on last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('calls onPageChange with correct page when navigating', async () => {
    const handlePageChange = vi.fn()
    const { user } = render(
      <Pagination page={3} totalPages={5} onPageChange={handlePageChange} />,
    )

    await user.click(screen.getByRole('button', { name: /previous/i }))
    expect(handlePageChange).toHaveBeenCalledWith(2)

    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(handlePageChange).toHaveBeenCalledWith(4)
  })

  it('has accessible navigation landmark', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)
    expect(
      screen.getByRole('navigation', { name: /pagination/i }),
    ).toBeInTheDocument()
  })
})
