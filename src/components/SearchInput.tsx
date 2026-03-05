import { useEffect, useState } from 'react'

interface SearchInputProps {
  onSearch: (value: string) => void
  debounceMs?: number
  placeholder?: string
}

export function SearchInput({
  onSearch,
  debounceMs = 300,
  placeholder = 'Search users...',
}: SearchInputProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs, onSearch])

  return (
    <div className="search-input">
      <label htmlFor="user-search" className="sr-only">
        Search users
      </label>
      <input
        id="user-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search users"
      />
    </div>
  )
}
