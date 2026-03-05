export type Page = 'users' | 'profile' | 'purchases'

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'users',     label: 'Users' },
  { id: 'purchases', label: 'Purchases' },
  { id: 'profile',   label: 'Profile' },
]

interface NavProps {
  current: Page
  onNavigate: (page: Page) => void
}

export function Nav({ current, onNavigate }: NavProps) {
  return (
    <nav className="app-nav">
      <span className="app-nav__brand">KCD PoC</span>
      <ul className="app-nav__list">
        {NAV_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <button
              className={`app-nav__item ${current === id ? 'app-nav__item--active' : ''}`}
              onClick={() => onNavigate(id)}
              aria-current={current === id ? 'page' : undefined}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
