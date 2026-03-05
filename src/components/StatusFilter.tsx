interface StatusFilterProps {
  value: 'all' | 'active' | 'inactive'
  onChange: (status: 'all' | 'active' | 'inactive') => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="status-filter">
      <label htmlFor="status-filter">Filter by status:</label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value as 'all' | 'active' | 'inactive')}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}
