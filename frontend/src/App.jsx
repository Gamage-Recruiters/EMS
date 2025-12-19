import { useState } from 'react'
import TeamManagementPage from './features/management/pages/TeamManagementPage'
import TeamHierarchyPage from './features/management/pages/TeamHierarchyPage'

function App() {
  const [page, setPage] = useState('management')

  return (
    <div>
      <div className="p-4 bg-white border-b flex gap-2">
        <button onClick={() => setPage('management')} className={`px-3 py-1 rounded ${page === 'management' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
          Team Management
        </button>
        <button onClick={() => setPage('hierarchy')} className={`px-3 py-1 rounded ${page === 'hierarchy' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
          Team Hierarchy
        </button>
      </div>

      {page === 'management' ? <TeamManagementPage /> : <TeamHierarchyPage />}
    </div>
  )
}

export default App
