import React from 'react'

const teams = [
  { id: 1, name: 'Frontend Team Alpha', lead: 'Sarah Johnson', dept: 'Engineering', members: 6, projects: 3, status: 'active' },
  { id: 2, name: 'Backend Core', lead: 'Michael Chen', dept: 'Engineering', members: 8, projects: 5, status: 'active' },
  { id: 3, name: 'Mobile Development', lead: 'Unassigned', dept: 'Engineering', members: 4, projects: 2, status: 'pending' },
  { id: 4, name: 'DevOps Squad', lead: 'Alex Kumar', dept: 'DevOps', members: 5, projects: 8, status: 'active' },
  { id: 5, name: 'Design System Team', lead: 'Emma Wilson', dept: 'Design', members: 4, projects: 2, status: 'active' },
  { id: 6, name: 'Data Engineering', lead: 'Unassigned', dept: 'Engineering', members: 3, projects: 1, status: 'pending' },
  { id: 7, name: 'QA Automation', lead: 'James Park', dept: 'Engineering', members: 5, projects: 4, status: 'active' },
  { id: 8, name: 'Platform Team', lead: 'Lisa Anderson', dept: 'Engineering', members: 7, projects: 6, status: 'active' },
]

function StatCard({ title, value, highlight }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`mt-2 text-2xl font-semibold ${highlight ? 'text-green-600' : 'text-gray-900'}`}>{value}</div>
    </div>
  )
}

function StatusPill({ status }) {
  const classes = status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
  return <span className={`px-3 py-1 rounded-full text-sm ${classes}`}>{status}</span>
}

export default function TeamManagementPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen flex flex-col justify-between">
          <div>
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-blue-600">Team Manager</h1>
              <div className="text-xs text-gray-500">System Owner Portal</div>
            </div>
            <nav className="p-4 space-y-1">
              <a className="flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-blue-50 font-medium" href="#"> 
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18"/></svg>
                Dashboard
              </a>
              <a className="flex items-center gap-3 p-3 rounded-lg text-blue-600" href="#"> 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18"/></svg>
                Teams
              </a>
              <a className="flex items-center gap-3 p-3 rounded-lg text-gray-700" href="#">User Management</a>
              <a className="flex items-center gap-3 p-3 rounded-lg text-gray-700" href="#">Team Hierarchy</a>
            </nav>
          </div>
          <div className="p-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">JO</div>
              <div>
                <div className="font-medium">John</div>
                <div className="text-xs text-gray-500">System Owner</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Team Management</h2>
              <div className="text-sm text-gray-500">View and manage all development teams</div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">+ Create Team</button>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <StatCard title="Total Teams" value="12" />
            <StatCard title="Active Teams" value="10" highlight />
            <StatCard title="Pending Setup" value="2" />
            <StatCard title="Total Members" value="48" />
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <input className="flex-1 border rounded-lg p-3 text-sm text-gray-700" placeholder="Search teams by name, lead, or department..." />
              <div className="text-sm text-gray-500">Sort:</div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3">Team Name</th>
                    <th className="py-3">Team Lead</th>
                    <th className="py-3">Department</th>
                    <th className="py-3">Members</th>
                    <th className="py-3">Projects</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map(team => (
                    <tr key={team.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center text-blue-600"> 
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                          </div>
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-xs text-gray-400">{team.dept}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-700">{team.lead}</td>
                      <td className="py-4 text-sm text-gray-700">{team.dept}</td>
                      <td className="py-4 text-sm text-gray-700">{team.members}</td>
                      <td className="py-4 text-sm text-gray-700">{team.projects}</td>
                      <td className="py-4"><StatusPill status={team.status} /></td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-sm text-blue-600 px-3 py-1 border rounded">View</button>
                          {team.lead === 'Unassigned' ? (
                            <button className="text-sm text-blue-600 px-3 py-1 border rounded">Assign Lead</button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
