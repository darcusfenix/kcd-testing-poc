import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { UsersPage } from '@/pages/UsersPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { PurchasesPage } from '@/pages/PurchasesPage'
import type { Page } from '@/components/Nav'
import './App.css'

function App() {
  const [page, setPage] = useState<Page>('users')

  return (
    <>
      <Nav current={page} onNavigate={setPage} />
      <div className="app-content">
        {page === 'users'     && <UsersPage />}
        {page === 'profile'   && <ProfilePage />}
        {page === 'purchases' && <PurchasesPage />}
      </div>
    </>
  )
}

export default App
