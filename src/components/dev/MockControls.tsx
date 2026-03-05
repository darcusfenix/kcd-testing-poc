/**
 * MockControls — dev-only floating panel for selecting MSW mock scenarios.
 *
 * Only rendered when VITE_MOCK_API=true. Persists the selection to
 * localStorage and reloads the page so the MSW worker re-initialises with
 * the correct handlers and DB state.
 */
import { useState } from 'react'
import { SCENARIOS, getActiveScenarioKey, setActiveScenarioKey } from '@/mocks/scenarios'
import type { ScenarioKey } from '@/mocks/scenarios'

export function MockControls() {
  const [open, setOpen] = useState(false)
  const activeKey = getActiveScenarioKey()

  function handleSelect(key: ScenarioKey) {
    setActiveScenarioKey(key)
    window.location.reload()
  }

  const activeLabel = SCENARIOS[activeKey].label

  return (
    <div style={styles.root}>
      {open && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>Mock scenario</span>
            <button style={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>
          <ul style={styles.list}>
            {(Object.entries(SCENARIOS) as [ScenarioKey, (typeof SCENARIOS)[ScenarioKey]][]).map(
              ([key, scenario]) => {
                const isActive = key === activeKey
                return (
                  <li key={key} style={styles.listItem}>
                    <button
                      style={{ ...styles.scenarioBtn, ...(isActive ? styles.scenarioBtnActive : {}) }}
                      onClick={() => handleSelect(key)}
                    >
                      <span style={styles.scenarioLabel}>
                        {isActive && <span style={styles.activeDot} aria-hidden="true" />}
                        {scenario.label}
                      </span>
                      <span style={styles.scenarioDesc}>{scenario.description}</span>
                    </button>
                  </li>
                )
              },
            )}
          </ul>
        </div>
      )}

      <button style={styles.toggle} onClick={() => setOpen((o) => !o)} title="Mock scenario controls">
        <span style={styles.toggleIcon}>🎭</span>
        <span style={styles.toggleLabel}>{activeLabel}</span>
      </button>
    </div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: 9999,
    fontFamily: 'system-ui, sans-serif',
    fontSize: '13px',
  } as React.CSSProperties,

  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#1e1e2e',
    color: '#cdd6f4',
    border: '1px solid #45475a',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  } as React.CSSProperties,

  toggleIcon: { fontSize: '14px' } as React.CSSProperties,
  toggleLabel: { fontWeight: 500 } as React.CSSProperties,

  panel: {
    position: 'absolute',
    bottom: '44px',
    right: 0,
    width: '280px',
    background: '#1e1e2e',
    border: '1px solid #45475a',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  } as React.CSSProperties,

  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderBottom: '1px solid #313244',
  } as React.CSSProperties,

  panelTitle: {
    color: '#cdd6f4',
    fontWeight: 600,
    fontSize: '13px',
  } as React.CSSProperties,

  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#6c7086',
    cursor: 'pointer',
    fontSize: '13px',
    padding: '0 2px',
  } as React.CSSProperties,

  list: {
    listStyle: 'none',
    margin: 0,
    padding: '6px 0',
  } as React.CSSProperties,

  listItem: { margin: 0 } as React.CSSProperties,

  scenarioBtn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '8px 14px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#cdd6f4',
    gap: '2px',
  } as React.CSSProperties,

  scenarioBtnActive: {
    background: '#313244',
  } as React.CSSProperties,

  scenarioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 500,
    fontSize: '13px',
  } as React.CSSProperties,

  activeDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#a6e3a1',
    flexShrink: 0,
  } as React.CSSProperties,

  scenarioDesc: {
    color: '#6c7086',
    fontSize: '12px',
  } as React.CSSProperties,
} as const
