export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: {
    lat: string
    lng: string
  }
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
  status: 'active' | 'inactive'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type UserSortField = 'name' | 'email' | 'company' | 'status'
export type SortDirection = 'asc' | 'desc'

export interface UsersQueryParams {
  page?: number
  perPage?: number
  search?: string
  status?: 'active' | 'inactive' | 'all'
  sortBy?: UserSortField
  sortDirection?: SortDirection
}
