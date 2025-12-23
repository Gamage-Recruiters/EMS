import React from 'react'

function MemberCard({ member }) {
  return (
    <div className="flex items-center gap-3 bg-white border rounded-lg p-3 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"> 
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </div>
      <div>
        <div className="font-medium text-sm">{member.name}</div>
        <div className="text-xs text-gray-400">{member.role}</div>
      </div>
    </div>
  )
}

export default function TeamHierarchyView({ team }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4H2v16h5M9 10a4 4 0 018 0M9 20v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>
          </div>
          <div>
            <div className="font-semibold text-lg">{team.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Team Lead</span>
              <div className="text-sm text-gray-600">{team.lead}</div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{team.members.length}</div>
          <div className="text-xs text-gray-400">Members</div>
        </div>
      </div>

      <div className="border-t my-4" />

      <div className="grid grid-cols-2 gap-4">
        {team.members.map((m, idx) => (
          <MemberCard key={idx} member={m} />
        ))}
      </div>
    </div>
  )
}
