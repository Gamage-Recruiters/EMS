import React, { useState } from 'react';
import { Search, Download, Filter, Check, X, Eye, Calendar, Clock, User, Mail, Building2, FileText, Bell, ChevronDown, MoreHorizontal, AlertCircle } from 'lucide-react';

// import Sidebar from '../components/Sidebar';
// import TopHeader from '../components/TopHeader';

// Mock Sidebar and TopHeader components
// Sidebar component
function MenuItem({ label, active }) {
  return (
    <div className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${active ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white" : "text-slate-300 hover:bg-slate-700"}`}>
      {label}
    </div>
  );
}

// TopHeader component
function TopHeader() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leave Approval Management</h1>
            <p className="text-sm text-slate-600 mt-0.5">Review and process employee leave requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function LeaveApproval() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const leaveRequests = [
    {
      id: 1,
      name: "Kasun Perera",
      employeeId: "EMP001",
      email: "kasun.perera@company.lk",
      team: "Backend Development",
      type: "Sick Leave",
      fromDate: "2024-12-18",
      toDate: "2024-12-20",
      days: 3,
      status: "Pending",
      reason: "Medical checkup and recovery period as advised by physician",
      appliedOn: "2024-12-15",
      remainingLeaves: 12
    },
    {
      id: 2,
      name: "Nimali Fernando",
      employeeId: "EMP002",
      email: "nimali.fernando@company.lk",
      team: "Frontend Development",
      type: "Study Leave",
      fromDate: "2024-12-28",
      toDate: "2025-01-02",
      days: 6,
      status: "Pending",
      reason: "Professional certification exam preparation and examination",
      appliedOn: "2024-12-10",
      remainingLeaves: 8
    },
    {
      id: 3,
      name: "Dinuka Silva",
      employeeId: "EMP003",
      email: "dinuka.silva@company.lk",
      team: "Quality Assurance",
      type: "Personal Leave",
      fromDate: "2024-12-22",
      toDate: "2024-12-22",
      days: 1,
      status: "Approved",
      reason: "Personal matter to attend",
      appliedOn: "2024-12-18",
      reviewedOn: "2024-12-19",
      reviewedBy: "Sarah Thompson",
      remainingLeaves: 14
    },
    {
      id: 4,
      name: "Chamod Jayasinghe",
      employeeId: "EMP004",
      email: "chamod.j@company.lk",
      team: "DevOps",
      type: "Emergency Leave",
      fromDate: "2024-12-15",
      toDate: "2024-12-15",
      days: 1,
      status: "Rejected",
      reason: "Urgent family matter requiring immediate attention",
      appliedOn: "2024-12-14",
      reviewedOn: "2024-12-14",
      reviewedBy: "John Anderson",
      rejectionReason: "Insufficient notice period as per company policy",
      remainingLeaves: 15
    },
    {
      id: 5,
      name: "Tharindu Wickramasinghe",
      employeeId: "EMP005",
      email: "tharindu.w@company.lk",
      team: "Mobile Development",
      type: "Annual Leave",
      fromDate: "2025-01-05",
      toDate: "2025-01-10",
      days: 6,
      status: "Pending",
      reason: "Pre-planned family vacation",
      appliedOn: "2024-12-20",
      remainingLeaves: 10
    }
  ];

  const filteredRequests = leaveRequests.filter(req => {
    const matchesSearch = 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.team.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || req.status.toLowerCase() === statusFilter;
    const matchesTeam = teamFilter === 'all' || req.team.toLowerCase().includes(teamFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesTeam;
  });

  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;

  const handleApprove = (request) => {
    alert(`Leave request approved for ${request.name} (${request.employeeId})`);
  };

  const handleReject = (request) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      alert(`Leave request rejected for ${request.name}. Reason: ${reason}`);
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
  };

  const handleExport = () => {
    alert('Exporting leave data to CSV...');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
     

      <main className="flex-1 p-8">
        <TopHeader />

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Total Requests</div>
            <div className="text-2xl font-semibold text-slate-900">{leaveRequests.length}</div>
            <div className="text-xs text-slate-500 mt-1">Current period</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Pending</div>
            <div className="text-2xl font-semibold text-amber-600">{pendingCount}</div>
            <div className="text-xs text-slate-500 mt-1">Awaiting review</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Approved</div>
            <div className="text-2xl font-semibold text-green-600">{approvedCount}</div>
            <div className="text-xs text-slate-500 mt-1">This week</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Rejected</div>
            <div className="text-2xl font-semibold text-red-600">{rejectedCount}</div>
            <div className="text-xs text-slate-500 mt-1">This week</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, employee ID, email, or team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 bg-white"
            >
              <option value="all">All Teams</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="qa">QA</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Mobile</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-slate-900 text-white rounded text-sm font-medium hover:bg-slate-800 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-slate-900">{request.name}</div>
                        <div className="text-xs text-slate-500">{request.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{request.team}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{request.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{formatDate(request.fromDate)}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{formatDate(request.toDate)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{request.days}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(request)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
                          >
                            View
                          </button>
                          {request.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 border border-green-600 rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Leave Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Employee Name</label>
                    <p className="text-sm font-medium text-slate-900">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Employee ID</label>
                    <p className="text-sm font-medium text-slate-900">{selectedRequest.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Email</label>
                    <p className="text-sm text-slate-700">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Department</label>
                    <p className="text-sm text-slate-700">{selectedRequest.team}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Leave Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Leave Type</label>
                      <p className="text-sm text-slate-700">{selectedRequest.type}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Duration</label>
                      <p className="text-sm text-slate-700">{selectedRequest.days} day(s)</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">From Date</label>
                      <p className="text-sm text-slate-700">{formatDate(selectedRequest.fromDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">To Date</label>
                      <p className="text-sm text-slate-700">{formatDate(selectedRequest.toDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Applied On</label>
                      <p className="text-sm text-slate-700">{formatDate(selectedRequest.appliedOn)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Status</label>
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Reason</label>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedRequest.reason}</p>
                </div>

                {selectedRequest.status !== 'Pending' && (
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Review Details</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Reviewed By</label>
                        <p className="text-sm text-slate-700">{selectedRequest.reviewedBy}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Review Date</label>
                        <p className="text-sm text-slate-700">{formatDate(selectedRequest.reviewedOn)}</p>
                      </div>
                    </div>
                    {selectedRequest.rejectionReason && (
                      <div className="mt-4">
                        <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Rejection Reason</label>
                        <p className="text-sm text-slate-700">{selectedRequest.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedRequest.status === 'Pending' && (
                  <div className="border-t border-slate-200 pt-6 flex gap-3">
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50"
                    >
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        Approved
      </span>
    );
  }
  
  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
        Rejected
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
      Pending
    </span>
  );
}