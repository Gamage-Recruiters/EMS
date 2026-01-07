import React from 'react'
import TeamHierarchyView from '../components/TeamHierarchyView'

const sampleTeams = [
  {
    id: 1,
    name: 'Frontend Team Alpha',
    lead: 'Sarah Johnson',
    members: [
      { name: 'Alex Chen', role: 'Senior Developer' },
      { name: 'Maria Garcia', role: 'Developer' },
      { name: 'Tom Wilson', role: 'Junior Developer' },
      { name: 'Lisa Brown', role: 'Developer' },
      { name: 'John Smith', role: 'Developer' },
    ],
  },
  {
    id: 2,
    name: 'Backend Core',
    lead: 'Michael Chen',
    members: [
      { name: 'David Lee', role: 'Senior Developer' },
      { name: 'Emma Davis', role: 'Developer' },
      { name: '...more', role: 'Developer' },
    ],
  },
]

export default function TeamHierarchyPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="flex">
        {/* Sidebar (same structure as TeamManagementPage) */}
        <aside className="w-64 bg-white border-r min-h-screen flex flex-col justify-between">
          <div>
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-blue-600">Team Manager</h1>
              <div className="text-xs text-gray-500">System Owner Portal</div>
            </div>
            <nav className="p-4 space-y-1">
              <div className="flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-blue-50 font-medium">Dashboard</div>
              <div className="flex items-center gap-3 p-3 rounded-lg text-blue-600">Teams</div>
              <div className="flex items-center gap-3 p-3 rounded-lg text-gray-700">User Management</div>
            </nav>
          </div>
          <div className="p-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">CO</div>
              <div>
                <div className="font-medium">Chamodi</div>
                <div className="text-xs text-gray-400">System Owner</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Team Hierarchy</h2>
              <div className="text-sm text-gray-500">Visual overview of team structure and reporting lines</div>
            </div>
          </div>

          <div className="mt-6">
            {sampleTeams.map(t => (
              <TeamHierarchyView key={t.id} team={t} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
