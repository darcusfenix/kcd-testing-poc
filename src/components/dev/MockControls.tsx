/**
 * MockControls — dev-only floating panel for selecting MSW mock scenarios.
 *
 * Scenarios are grouped by service and filterable by search so the panel
 * stays usable as the number of services grows.
 *
 * Only rendered when VITE_MOCK_API=true. Persists the selection to
 * localStorage and reloads the page so the MSW worker re-initialises with
 * the correct handlers and DB state.
 */
import { useMemo, useRef, useState } from 'react'
import { SCENARIOS, getActiveScenarioKey, setActiveScenarioKey } from '@/mocks/scenarios'
import type { ScenarioKey } from '@/mocks/scenarios'

// Build an ordered map of { groupName → [key, scenario][] }
function buildGroups(filter: string) {
  const q = filter.toLowerCase()
  const map = new Map<string, { key: ScenarioKey; label: string; description: string }[]>()

  for (const [key, scenario] of Object.entries(SCENARIOS) as [ScenarioKey, (typeof SCENARIOS)[ScenarioKey]][]) {
    if (q && !scenario.label.toLowerCase().includes(q) && !scenario.description.toLowerCase().includes(q) && !scenario.group.toLowerCase().includes(q)) {
      continue
    }
    if (!map.has(scenario.group)) map.set(scenario.group, [])
    map.get(scenario.group)!.push({ key, label: scenario.label, description: scenario.description })
  }

  return map
}

export function MockControls() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const searchRef = useRef<HTMLInputElement>(null)
  const activeKey = getActiveScenarioKey()
  const activeScenario = SCENARIOS[activeKey]

  const groups = useMemo(() => buildGroups(filter), [filter])

  function handleSelect(key: ScenarioKey) {
    setActiveScenarioKey(key)
    window.location.reload()
  }

  function toggleGroup(name: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  function handleOpen() {
    setOpen(true)
    // Focus search on next tick
    setTimeout(() => searchRef.current?.focus(), 0)
  }

  const totalVisible = [...groups.values()].reduce((n, items) => n + items.length, 0)

  return (
    <div style={s.root}>
      {open && (
        <div style={s.panel} role="dialog" aria-label="Mock scenario selector">
          {/* ── Header ── */}
          <div style={s.header}>
            <span style={s.headerTitle}>Mock scenario</span>
            <button style={s.iconBtn} onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          {/* ── Search ── */}
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>⌕</span>
            <input
              ref={searchRef}
              style={s.searchInput}
              placeholder="Filter scenarios…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter scenarios"
            />
            {filter && (
              <button style={s.clearBtn} onClick={() => setFilter('')} aria-label="Clear filter">✕</button>
            )}
          </div>

          {/* ── Groups ── */}
          <div style={s.body}>
            {groups.size === 0 && (
              <p style={s.empty}>No scenarios match "{filter}"</p>
            )}
            {[...groups.entries()].map(([groupName, items]) => {
              const isCollapsed = collapsed.has(groupName)
              return (
                <div key={groupName}>
                  <button
                    style={s.groupHeader}
                    onClick={() => toggleGroup(groupName)}
                    aria-expanded={!isCollapsed}
                  >
                    <span style={s.groupChevron}>{isCollapsed ? '▶' : '▼'}</span>
                    <span style={s.groupName}>{groupName}</span>
                    <span style={s.groupCount}>{items.length}</span>
                  </button>

                  {!isCollapsed && (
                    <ul style={s.list}>
                      {items.map(({ key, label, description }) => {
                        const isActive = key === activeKey
                        return (
                          <li key={key}>
                            <button
                              style={{ ...s.scenarioBtn, ...(isActive ? s.scenarioBtnActive : {}) }}
                              onClick={() => handleSelect(key)}
                            >
                              <span style={s.scenarioRow}>
                                <span style={{ ...s.dot, ...(isActive ? s.dotActive : s.dotInactive) }} />
                                <span style={s.scenarioLabel}>{label}</span>
                              </span>
                              <span style={s.scenarioDesc}>{description}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Footer ── */}
          <div style={s.footer}>
            <span style={s.footerText}>
              {totalVisible} scenario{totalVisible !== 1 ? 's' : ''}
              {filter ? ` matching "${filter}"` : ''}
            </span>
          </div>
        </div>
      )}

      {/* ── Toggle pill ── */}
      <button style={s.toggle} onClick={open ? () => setOpen(false) : handleOpen} title="Mock scenario controls">
        <span style={s.pill}>
          <span style={s.pillDot} />
          <span style={s.pillService}>{activeScenario.group}</span>
          <span style={s.pillSep}>·</span>
          <span>{activeScenario.label}</span>
        </span>
      </button>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const COLOR = {
  bg:       '#1e1e2e',
  border:   '#313244',
  muted:    '#45475a',
  text:     '#cdd6f4',
  subtext:  '#6c7086',
  active:   '#313244',
  green:    '#a6e3a1',
  hover:    '#282838',
} as const

const s = {
  root: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: 9999,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '13px',
  } as React.CSSProperties,

  // ── Panel ──
  panel: {
    position: 'absolute',
    bottom: '44px',
    right: 0,
    width: '300px',
    background: COLOR.bg,
    border: `1px solid ${COLOR.muted}`,
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '520px',
    overflow: 'hidden',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderBottom: `1px solid ${COLOR.border}`,
    flexShrink: 0,
  } as React.CSSProperties,

  headerTitle: {
    color: COLOR.text,
    fontWeight: 600,
    fontSize: '13px',
  } as React.CSSProperties,

  iconBtn: {
    background: 'none',
    border: 'none',
    color: COLOR.subtext,
    cursor: 'pointer',
    fontSize: '13px',
    padding: '0 2px',
    lineHeight: 1,
  } as React.CSSProperties,

  // ── Search ──
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 10px',
    borderBottom: `1px solid ${COLOR.border}`,
    flexShrink: 0,
  } as React.CSSProperties,

  searchIcon: {
    color: COLOR.subtext,
    fontSize: '16px',
    lineHeight: 1,
    flexShrink: 0,
  } as React.CSSProperties,

  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: COLOR.text,
    fontSize: '13px',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  clearBtn: {
    background: 'none',
    border: 'none',
    color: COLOR.subtext,
    cursor: 'pointer',
    fontSize: '11px',
    padding: '0 2px',
    lineHeight: 1,
    flexShrink: 0,
  } as React.CSSProperties,

  // ── Body ──
  body: {
    overflowY: 'auto',
    flex: 1,
  } as React.CSSProperties,

  empty: {
    padding: '20px 14px',
    color: COLOR.subtext,
    textAlign: 'center',
    fontSize: '12px',
  } as React.CSSProperties,

  // ── Group ──
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    padding: '6px 12px',
    background: 'none',
    border: 'none',
    borderTop: `1px solid ${COLOR.border}`,
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  groupChevron: {
    color: COLOR.subtext,
    fontSize: '9px',
    flexShrink: 0,
  } as React.CSSProperties,

  groupName: {
    flex: 1,
    color: COLOR.subtext,
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
  } as React.CSSProperties,

  groupCount: {
    color: COLOR.muted,
    fontSize: '11px',
    background: COLOR.active,
    borderRadius: '10px',
    padding: '0 6px',
  } as React.CSSProperties,

  // ── Scenario row ──
  list: {
    listStyle: 'none',
    margin: 0,
    padding: '2px 0',
  } as React.CSSProperties,

  scenarioBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    padding: '6px 12px 6px 14px',
    background: 'none',
    border: 'none',
    textAlign: 'left' as const,
    cursor: 'pointer',
    color: COLOR.text,
    gap: '1px',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  scenarioBtnActive: {
    background: COLOR.active,
  } as React.CSSProperties,

  scenarioRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  } as React.CSSProperties,

  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  } as React.CSSProperties,

  dotActive: {
    background: COLOR.green,
  } as React.CSSProperties,

  dotInactive: {
    background: COLOR.muted,
  } as React.CSSProperties,

  scenarioLabel: {
    fontWeight: 500,
    fontSize: '13px',
  } as React.CSSProperties,

  scenarioDesc: {
    color: COLOR.subtext,
    fontSize: '11px',
    paddingLeft: '13px',
  } as React.CSSProperties,

  // ── Footer ──
  footer: {
    padding: '6px 12px',
    borderTop: `1px solid ${COLOR.border}`,
    flexShrink: 0,
  } as React.CSSProperties,

  footerText: {
    color: COLOR.subtext,
    fontSize: '11px',
  } as React.CSSProperties,

  // ── Toggle pill ──
  toggle: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,

  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 11px',
    background: COLOR.bg,
    color: COLOR.text,
    border: `1px solid ${COLOR.muted}`,
    borderRadius: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    fontSize: '12px',
  } as React.CSSProperties,

  pillDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: COLOR.green,
    flexShrink: 0,
  } as React.CSSProperties,

  pillService: {
    color: COLOR.subtext,
    fontSize: '11px',
  } as React.CSSProperties,

  pillSep: {
    color: COLOR.muted,
  } as React.CSSProperties,
}
