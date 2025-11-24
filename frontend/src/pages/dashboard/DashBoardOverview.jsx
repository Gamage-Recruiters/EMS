import React, { useState } from 'react';
import { Bell, Calendar, Users, FileText, Clock, ChevronRight, Plus, Download, Share2, Settings } from 'lucide-react';

export default function DashboardOverview() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'overdue', title: 'Overdue Task', message: 'You have 3 overdue tasks pending review', time: '2h ago', read: false },
    { id: 2, type: 'deadline', title: 'Deadline Alert!', message: 'Project ABC deadline is approaching', time: '5h ago', read: false }
  ]);

  const stats = [
    { label: 'Total', value: '47', icon: FileText, color: 'bg-blue-50 text-blue-600', change: '+12%' },
    { label: 'In Progress', value: '8', icon: Clock, color: 'bg-green-50 text-green-600', change: '+5%' },
    { label: 'Completed', value: '3', icon: Users, color: 'bg-cyan-50 text-cyan-600', change: '-2%' },
    { label: 'Overdue', value: '12', icon: Bell, color: 'bg-red-50 text-red-600', change: '+3' }
  ];

  const projects = [
    { name: 'Project XYZ', progress: 75, color: 'bg-blue-500', status: 'On Track', date: 'Dec 30, 2024' },
    { name: 'Project DMZ - Review App Redesign', progress: 60, color: 'bg-yellow-500', status: 'At Risk', date: 'Jan 5, 2025' },
    { name: 'Project Olympus - Backend API Migration', progress: 30, color: 'bg-red-500', status: 'Delayed', date: 'Dec 22, 2024' }
  ];

  const deadlines = [
    { id: 1, date: '22', month: 'Dec', title: 'Q4 Financial Report Submission', type: 'High Priority', color: 'bg-red-100 text-red-700' },
    { id: 2, date: '25', month: 'Dec', title: 'E-Commerce Platform Launch', type: 'Medium Priority', color: 'bg-yellow-100 text-yellow-700' },
    { id: 3, date: '28', month: 'Dec', title: 'Cybersecurity Training Session', type: 'Low Priority', color: 'bg-blue-100 text-blue-700' },
    { id: 4, date: '30', month: 'Dec', title: 'Mobile App Prototype Completion', type: 'High Priority', color: 'bg-green-100 text-green-700' }
  ];

  const meetings = [
    { title: 'Daily Standup - Team 06', time: '09:00', attendees: ['/api/placeholder/32/32', '/api/placeholder/32/32'] },
    { title: 'Project Planning - Project XYZ', time: '14:00', attendees: ['/api/placeholder/32/32'] },
    { title: 'Scrum Review Session', time: '16:00', attendees: ['/api/placeholder/32/32', '/api/placeholder/32/32'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
          <span className="font-bold text-xl">DevTeam Manager</span>
        </div>
        
        <nav className="space-y-2">
          {['IT Dashboard', 'User Foundation Setup', 'Task List (Detailed) in Team', 'Innovate Brainstorm', 'Second-hand Jobs', 'Project Files', 'Customer Progress View', 'Weekly Report Progress', 'Post Recent Results'].map((item, idx) => (
            <a key={idx} href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${idx === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
              <span className="text-sm">{item}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
              <span className="font-medium text-sm">JA</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-medium ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{notif.title}</div>
                        <div className="text-sm text-gray-600">{notif.message}</div>
                      </div>
                      <span className="text-xs text-gray-500">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Project Progress Summary</h2>
                <div className="space-y-6">
                  {projects.map((project, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{project.name}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded ${project.status === 'On Track' ? 'bg-green-100 text-green-700' : project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {project.status}
                          </span>
                          <span className="text-sm text-gray-500">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${project.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Due: {project.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Deadlines
                  </h2>
                </div>
                <div className="space-y-3">
                  {deadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="text-center min-w-[50px]">
                        <div className="text-2xl font-bold text-gray-900">{deadline.date}</div>
                        <div className="text-xs text-gray-500">{deadline.month}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{deadline.title}</div>
                        <span className={`text-xs px-2 py-1 rounded ${deadline.color}`}>
                          {deadline.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions & Meetings */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 transition-all">
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add New Project</span>
                  </button>
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 transition-all">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">View Schedule Calendar</span>
                  </button>
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 transition-all">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Generate Reports</span>
                  </button>
                  <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Edit Workspace</span>
                  </button>
                </div>
              </div>

              {/* Meetings */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Meetings This Week</h2>
                </div>
                <div className="space-y-4">
                  {meetings.map((meeting, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{meeting.title}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          {meeting.attendees.map((_, i) => (
                            <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}