import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Check, X, Eye, Calendar, Clock, User, Mail, Building2, FileText, Bell, ChevronDown, MoreHorizontal, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

// TopHeader component (Kept as is or imported if available)
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
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leaves');
      setLeaveRequests(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
      setError("Failed to load leave requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });

      // Update local state to reflect change immediately
      setLeaveRequests(prev => prev.map(req =>
        req._id === id ? { ...req, status: status } : req
      ));

      // If selected, update it too
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(prev => ({ ...prev, status: status }));
      }

      alert(`Leave request ${status.toLowerCase()} successfully.`);
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} request:`, err);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleApprove = (request) => {
    if (window.confirm(`Are you sure you want to approve leave for ${request.employee?.firstName}?`)) {
      handleUpdateStatus(request._id, 'Approved');
    }
  };

  const handleReject = (request) => {
    if (window.confirm(`Are you sure you want to reject leave for ${request.employee?.firstName}?`)) {
      handleUpdateStatus(request._id, 'Rejected');
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
  };

  const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const filteredRequests = leaveRequests.filter(req => {
    const employeeName = req.employee ? `${req.employee.firstName} ${req.employee.lastName}`.toLowerCase() : '';
    const employeeEmail = req.employee?.email?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      employeeName.includes(searchLower) ||
      employeeEmail.includes(searchLower) ||
      req.leaveType.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' || req.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
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
            <div className="text-xs text-slate-500 mt-1">All time</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Pending</div>
            <div className="text-2xl font-semibold text-amber-600">{pendingCount}</div>
            <div className="text-xs text-slate-500 mt-1">Awaiting review</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Approved</div>
            <div className="text-2xl font-semibold text-green-600">{approvedCount}</div>
            <div className="text-xs text-slate-500 mt-1">Total approved</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-sm text-slate-600 mb-1">Rejected</div>
            <div className="text-2xl font-semibold text-red-600">{rejectedCount}</div>
            <div className="text-xs text-slate-500 mt-1">Total rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or leave type..."
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
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Role</th>
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
                      <tr key={request._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm text-slate-900">
                            {request.employee?.firstName} {request.employee?.lastName}
                          </div>
                          <div className="text-xs text-slate-500">{request.employee?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{request.employee?.role || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{request.leaveType}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatDate(request.startDate)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatDate(request.endDate)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {calculateDays(request.startDate, request.endDate)}
                        </td>
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
          )}
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
                    <p className="text-sm font-medium text-slate-900">
                      {selectedRequest.employee?.firstName} {selectedRequest.employee?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Role</label>
                    <p className="text-sm font-medium text-slate-900">{selectedRequest.employee?.role}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Email</label>
                    <p className="text-sm text-slate-700">{selectedRequest.employee?.email}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Leave Information</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Leave Type</label>
                      <p className="text-sm text-slate-700">{selectedRequest.leaveType}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Duration</label>
                      <p className="text-sm text-slate-700">{calculateDays(selectedRequest.startDate, selectedRequest.endDate)} day(s)</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">From Date</label>
                      <p className="text-sm text-slate-700">{formatDate(selectedRequest.startDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">To Date</label>
                      <p className="text-sm text-slate-700">{formatDate(selectedRequest.endDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Applied On</label>
                      <p className="text-sm text-slate-700">{formatDate(selectedRequest.createdAt)}</p>
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
                        <p className="text-sm text-slate-700">
                          {selectedRequest.approvedBy ? `${selectedRequest.approvedBy.firstName} ${selectedRequest.approvedBy.lastName}` : 'N/A'}
                        </p>
                      </div>
                      {/* Review Date is not strictly stored in this model unless we use updatedAt, which changes on any update */}
                    </div>
                  </div>
                )}

                {selectedRequest.status === 'Pending' && (
                  <div className="border-t border-slate-200 pt-6 flex gap-3">
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest);
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest);
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