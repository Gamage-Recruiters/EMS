import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, User, Mail, Phone, Users, AlertCircle, Plus, ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

export default function LeaveForm() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [leaves, setLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  // Form State
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [team, setTeam] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch leaves on mount and when returning to list view
  useEffect(() => {
    if (view === 'list') {
      fetchLeaves();
    }
  }, [view]);

  const fetchLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const response = await api.get('/leaves/my-leaves');
      setLeaves(response.data);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      // Optional: set a global error state or toast
    } finally {
      setLoadingLeaves(false);
    }
  };

  const calculateDays = (from, to) => {
    if (from && to) {
      const start = new Date(from);
      const end = new Date(to);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setDays(diff > 0 ? `${diff} ${diff === 1 ? 'Day' : 'Days'}` : '');
    }
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
    calculateDays(e.target.value, toDate);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
    calculateDays(fromDate, e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);

    // Client-side validation
    const isValid = validateForm();
    if (!isValid) {
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        startDate: fromDate,
        endDate: toDate,
        leaveType,
        reason,
      };

      await api.post('/leaves', payload);
      setSuccess(true);
      // Don't auto-switch immediately so user sees success message
    } catch (err) {
      console.error("Leave submission error:", err);
      setError(err.response?.data?.message || "Failed to submit leave request. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const validateEmail = (value) => {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
  };

  const validateForm = () => {
    const errors = {};

    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!validateEmail(email.trim())) errors.email = 'Enter a valid email address.';
    if (!phone.trim()) errors.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(phone)) errors.phone = 'Phone number must be 10 digits.';
    if (!team) errors.team = 'Please select a team.';
    if (!leaveType) errors.leaveType = 'Please select a leave type.';
    if (!fromDate) errors.fromDate = 'From date is required.';
    if (!toDate) errors.toDate = 'To date is required.';
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (end < start) errors.toDate = 'To date cannot be before From date.';
    }
    if (!reason.trim()) errors.reason = 'Please provide a reason for leave.';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setDays('');
    setLeaveType('');
    setReason('');
    setSelectedFile(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setTeam('');
    setAdditionalNotes('');
    setValidationErrors({});
    setError(null);
    setSuccess(false);
    setFormLoading(false);
  };

  const handleBackToList = () => {
    handleReset();
    setView('list');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  // --- Views ---

  const renderListView = () => (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dashboard Stats (Optional Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium">Total Leaves</div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{leaves.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium">Pending</div>
          <div className="text-3xl font-bold text-amber-600 mt-2">
            {leaves.filter(l => l.status === 'Pending').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 text-sm font-medium">Approved</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {leaves.filter(l => l.status === 'Approved').length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-xl font-bold text-slate-800">My Leave Requests</h2>
          <button
            onClick={() => setView('form')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        <div className="p-0">
          {loadingLeaves ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Leave Requests</h3>
              <p className="text-slate-500">You haven't submitted any leave requests yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Dates</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Reason</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Applied On</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-800 font-medium">{leave.leaveType}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={leave.reason}>
                        {leave.reason}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(leave.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFormView = () => {
    if (success) {
      return (
        <div className="max-w-md mx-auto mt-10">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h2>
            <p className="text-slate-600 mb-6">
              Your leave request has been successfully submitted and is pending approval.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBackToList}
                className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleReset}
                className="w-full px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-all"
              >
                Create Another Request
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">New Leave Application</h2>
                <p className="text-blue-100 text-sm mt-0.5">Please fill in all required fields</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all ${validationErrors.fullName ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@company.com"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all ${validationErrors.email ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setPhone(cleaned);
                      }}
                      placeholder="Enter 10-digit phone number"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all ${validationErrors.phone ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Team */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Team / Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={team}
                      onChange={(e) => setTeam(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer ${validationErrors.team ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                    >
                      <option value="" disabled>Select your team</option>
                      <option>Frontend Team</option>
                      <option>Backend Team</option>
                      <option>Mobile App Team</option>
                      <option>QA Team</option>
                      <option>DevOps Team</option>
                      <option>UI/UX Design Team</option>
                      <option>Product Management</option>
                      <option>Other</option>
                    </select>
                    {validationErrors.team && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.team}</p>
                    )}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-8"></div>

            {/* Leave Details Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-900">Leave Details</h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {/* Leave Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer ${validationErrors.leaveType ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                    >
                      <option value="" disabled>Select leave type</option>
                      <option value="Sick Leave">Sick Leave (Illness or Injury)</option>
                      <option value="Annual Leave">Annual Leave / Vacation</option>
                      <option value="Personal Leave">Personal Leave</option>
                      <option value="Bereavement Leave">Bereavement Leave (Immediate Family)</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                      <option value="Study Leave">Study Leave</option>
                      <option value="Unpaid Leave">Leave Without Pay</option>
                      <option value="Other">Other</option>
                    </select>
                    {validationErrors.leaveType && (
                      <p className="text-sm text-red-600 mt-1">{validationErrors.leaveType}</p>
                    )}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={fromDate}
                          onChange={handleFromDateChange}
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all ${validationErrors.fromDate ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                        />
                        {validationErrors.fromDate && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.fromDate}</p>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          value={toDate}
                          onChange={handleToDateChange}
                          className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all ${validationErrors.toDate ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                        />
                        {validationErrors.toDate && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.toDate}</p>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Total Days
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={days}
                        readOnly
                        placeholder="Auto-calculated"
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                    Reason for Leave <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a detailed reason for your leave request..."
                    rows={4}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all resize-none ${validationErrors.reason ? 'border-red-300 focus:border-red-400' : 'border-slate-200'}`}
                  />
                  {validationErrors.reason && (
                    <p className="text-sm text-red-600 mt-1">{validationErrors.reason}</p>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Additional Notes <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional information or special circumstances..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Attach Supporting Document <span className="text-slate-400 text-xs">(Optional - PDF, JPG, PNG)</span>
                  </label>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-6 text-center cursor-pointer hover:bg-slate-100 hover:border-indigo-300 transition-all group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                          <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                            Click to upload file
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            PDF, JPG, PNG (Max 10MB)
                          </p>
                        </div>
                      </div>
                    </label>

                    {/* Selected File Display */}
                    {selectedFile && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-all"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 mb-8">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Important Information</p>
                <p className="text-blue-700">Please ensure all information is accurate. Your leave request will be reviewed by your manager within 24-48 hours.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <button
                onClick={handleReset}
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 order-2 sm:order-1"
              >
                Clear Form
              </button>

              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 order-1 sm:order-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {formLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <main className="flex-1 p-6 md:p-8 lg:p-10">
        {view === 'list' ? renderListView() : renderFormView()}
      </main>
    </div>
  );
}