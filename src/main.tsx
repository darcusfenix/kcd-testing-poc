import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

async function enableMocking() {
  // KCD Best Practice: Use MSW in development for consistent mock behavior.
  // The same handlers used in tests power the dev experience.
  if (import.meta.env.VITE_MOCK_API !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser.ts')
  return worker.start({
    onUnhandledRequest: 'warn',
  })
}

const isMocking = import.meta.env.VITE_MOCK_API === 'true'

enableMocking().then(async () => {
  const root = document.getElementById('root')!

  if (isMocking) {
    // Lazy-load MockControls so it is never bundled for production.
    const { MockControls } = await import('./components/dev/MockControls.tsx')
    const { createElement, Fragment } = await import('react')

    createRoot(root).render(
      createElement(StrictMode, null,
        createElement(Fragment, null,
          createElement(App),
          createElement(MockControls),
        ),
      ),
    )
  } else {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
})
