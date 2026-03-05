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

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
