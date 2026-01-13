import React, { useState } from 'react';
import { Bell, Calendar, ChevronRight, Clock, MapPin, Users } from 'lucide-react';

export default function DashboardOverview() {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const stats = [
    { label: 'Active Developer', value: '47', icon: '👤', color: 'bg-blue-50', iconBg: 'bg-blue-100' , change: '+12%'  },
    { label: 'Active Team', value: '8', icon: '⚡', color: 'bg-teal-50', iconBg: 'bg-teal-100' , change: '+5%' },
    { label: 'Pending Approvals', value: '3', icon: '⚠️', color: 'bg-yellow-50', iconBg: 'bg-yellow-100', change: '-2%' },
    { label: 'Schedule Meeting', value: '12', icon: '📋', color: 'bg-red-50', iconBg: 'bg-red-100' , change: '+3' },
  ]; 

  

  const projects = [
    { name: 'Project AAT', progress: 75, color: 'bg-blue-500', date: '12 June 2024' },
    { name: 'Project DMZ - Mobile App Redesign', progress: 60, color: 'bg-yellow-500', date: '15 June 2024' },
    { name: 'Project Garena - Backend API Migration', progress: 40, color: 'bg-red-500', date: '20 June 2024' },
  ];

  const deadlines = [
    { date: '20', day: 'Tue', title: 'Q2 Report UI Vendor Database', tag: 'Design', tagColor: 'bg-orange-100 text-orange-600' },
    { date: '22', day: 'Thu', title: 'E-Commerce Platform Launch', tag: 'Development', tagColor: 'bg-green-100 text-green-600' },
    { date: '04', day: 'Fri', title: 'Sprint Review Meeting', tag: 'Meeting', tagColor: 'bg-blue-100 text-blue-600' },
    { date: '05', day: 'Sat', title: 'Mobile App Redesign Completion', tag: 'Design', tagColor: 'bg-purple-100 text-purple-600' },
  ];

  const meetings = [
    { title: 'Daily Standup - Team 01', time: '09:00 - 09:30', attendees: 8, color: 'bg-blue-500' },
    { title: 'Weekly Planning - Project AAT', time: '14:00 - 15:00', attendees: 12, color: 'bg-teal-500' },
    { title: 'Scrum Review Session', time: '10:00 - 11:30', attendees: 15, color: 'bg-purple-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="font-bold text-lg">DevTeam Manager</span>
        </div>
        
        <nav className="space-y-1">
          {[
            { icon: '📊', label: 'IT Dashboard', active: true },
            { icon: '👤', label: 'User Attendance Setup' },
            { icon: '✅', label: 'Task List Occupation by Team' },
            { icon: '📅', label: 'Schedule Meeting' },
            { icon: '📈', label: 'General Result/s' },
            { icon: '👁️', label: 'Overview Progress View' },
            { icon: '📋', label: 'Weekly Team Progress' },
            { icon: '📄', label: 'Final Result Details' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-xl p-4 relative`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`${stat.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-xl`}>
                  {stat.icon}
                </div>
                {i === 3 && (
                  <button className="text-blue-600 text-sm font-medium">
                    View All
                  </button>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* --Notifications and Quick Actions-- */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell size={20} className="text-red-500" />
                6 Notifications
              </h2>
              <button className="text-blue-600 text-sm font-medium">View all</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">Overdue Task</div>
                  <div className="text-xs text-gray-500">Project AAT - UI Design needs immediate attention</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">Updates (new)</div>
                  <div className="text-xs text-gray-500">New comment on Project DMZ redesign</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl p-6 text-white relative overflow-hidden">
            <h2 className="text-lg font-bold mb-4">QUICK ACTIONS</h2>
            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-3 flex items-center gap-3 text-left transition-colors">
                <Calendar size={20} />
                <span className="text-sm">Schedule Meeting</span>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-3 flex items-center gap-3 text-left transition-colors">
                <Users size={20} />
                <span className="text-sm">Add New Members</span>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg p-3 flex items-center gap-3 text-left transition-colors">
                <span className="text-lg">📋</span>
                <span className="text-sm">Add Assignment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project Progress Summary */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">📊 Project Progress Summary</h2>
          </div>
          <div className="space-y-6">
            {projects.map((project, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{project.name}</span>
                  <span className="text-xs text-gray-500">{project.date}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${project.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              📅 Upcoming Deadlines
            </h2>
            <div className="space-y-3">
              {deadlines.map((deadline, i) => (
                <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{deadline.date}</div>
                    <div className="text-xs text-gray-500">{deadline.day}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">{deadline.title}</div>
                    <span className={`text-xs px-2 py-1 rounded ${deadline.tagColor}`}>
                      {deadline.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meetings This Week */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              📅 Meetings This Week
            </h2>
            <div className="space-y-3">
              {meetings.map((meeting, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-1 h-12 ${meeting.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">{meeting.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {meeting.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {meeting.attendees}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}