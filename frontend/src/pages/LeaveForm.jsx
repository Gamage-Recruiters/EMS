import React, { useState } from 'react';
import { Calendar, Clock, FileText, User, Mail, Phone, Users, AlertCircle, Menu, Bell, Search } from 'lucide-react';

import Sidebar from '../components/layout/Sidebar';
import TopHeader from '../components/layout/Header';


export default function LeaveForm() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [days, setDays] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 lg:p-10">
        <TopHeader />

        {/* Form Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Leave Application Form</h2>
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
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
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
                        placeholder="john.doe@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
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
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Team */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      Team / Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer">
                        <option value="" disabled selected>Select your team</option>
                        <option>Frontend Team</option>
                        <option>Backend Team</option>
                        <option>Mobile App Team</option>
                        <option>QA Team</option>
                        <option>DevOps Team</option>
                        <option>UI/UX Design Team</option>
                        <option>Product Management</option>
                        <option>Other</option>
                      </select>
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
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer">
                        <option value="" disabled selected>Select leave type</option>
                        <option>Sick Leave (Illness or Injury)</option>
                        <option>Annual Leave / Vacation</option>
                        <option>Personal Leave</option>
                        <option>Bereavement Leave (Immediate Family)</option>
                        <option>Bereavement Leave (Other)</option>
                        <option>Emergency Leave</option>
                        <option>Jury Duty / Legal Leave</option>
                        <option>Study Leave</option>
                        <option>Leave Without Pay</option>
                        <option>Other</option>
                      </select>
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all"
                        />
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
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all"
                        />
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
                      placeholder="Please provide a detailed reason for your leave request..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Additional Notes <span className="text-slate-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
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
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

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
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 order-2 sm:order-1">
                  Clear Form
                </button>

                <button className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 order-1 sm:order-2">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}