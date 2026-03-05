import type { User } from '@/types/user'
import { formatUserFullAddress, formatUserInitials } from '@/utils/format-user'

interface UserCardProps {
  user: User
  onDelete?: (id: number) => void
}

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <article className="user-card" data-testid={`user-card-${user.id}`}>
      <div className="user-card__avatar">
        <span className="user-card__initials">
          {formatUserInitials(user.name)}
        </span>
      </div>
      <div className="user-card__info">
        <h3 className="user-card__name">{user.name}</h3>
        <p className="user-card__email">{user.email}</p>
        <p className="user-card__company">{user.company.name}</p>
        <p className="user-card__address">{formatUserFullAddress(user)}</p>
        <span
          className={`user-card__status user-card__status--${user.status}`}
        >
          {user.status}
        </span>
      </div>
      {onDelete && (
        <button
          className="user-card__delete"
          onClick={() => onDelete(user.id)}
          aria-label={`Delete ${user.name}`}
        >
          Delete
        </button>
      )}
    </article>
  )
}
