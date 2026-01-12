import React from "react";
import { FiUsers, FiUserCheck } from "react-icons/fi";

function MemberCard({ member }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 flex-shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900">
            {member.name || member.firstName}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {member.role || member.designation}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamHierarchyView({ team }) {
  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FiUsers className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{team.name}</h2>
              <div className="flex items-center gap-2 mt-2 opacity-90">
                <FiUserCheck className="w-4 h-4" />
                <span className="text-sm">Led by {team.lead}</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <div className="text-3xl font-bold">{team.members.length}</div>
            <div className="text-sm opacity-90">Members</div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Members
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.members.map((m, idx) => (
            <MemberCard key={idx} member={m} />
          ))}
        </div>
        {team.members.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No members in this team yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
