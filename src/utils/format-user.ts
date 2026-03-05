import type { User } from '@/types/user'

export function formatUserFullAddress(user: User): string {
  const { street, suite, city, zipcode } = user.address
  return `${street}, ${suite}, ${city} ${zipcode}`
}

export function formatUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function filterUsers(
  users: User[],
  search: string,
): User[] {
  if (!search.trim()) return users
  const lower = search.toLowerCase()
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower) ||
      user.company.name.toLowerCase().includes(lower),
  )
}

export function sortUsers(
  users: User[],
  sortBy: 'name' | 'email' | 'company' | 'status',
  direction: 'asc' | 'desc',
): User[] {
  const sorted = [...users].sort((a, b) => {
    let valA: string
    let valB: string

    switch (sortBy) {
      case 'name':
        valA = a.name
        valB = b.name
        break
      case 'email':
        valA = a.email
        valB = b.email
        break
      case 'company':
        valA = a.company.name
        valB = b.company.name
        break
      case 'status':
        valA = a.status
        valB = b.status
        break
    }

    return valA.localeCompare(valB)
  })

  return direction === 'desc' ? sorted.reverse() : sorted
}
