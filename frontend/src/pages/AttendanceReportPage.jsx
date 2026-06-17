import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAttendanceReport } from "../services/attendanceService";
import { Download, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "-";
  return new Date(timeString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const generatePDF = (report) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text("Employee Attendance Report", pageWidth / 2, margin + 10, {
    align: "center",
  });

  // Employee Info Section
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  let yPosition = margin + 25;

  doc.text("Employee Information:", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const employee = report.employee;
  doc.text(`Name: ${employee.firstName} ${employee.lastName}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`Email: ${employee.email}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`Role: ${employee.role || "N/A"}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`Position: ${employee.designation || "N/A"}`, margin + 5, yPosition);
  yPosition += 6;
  doc.text(`Department: ${employee.department || "N/A"}`, margin + 5, yPosition);
  yPosition += 10;

  // Summary Section
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text("Attendance Summary:", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const summary = report.summary;
  const summaryData = [
    [`Total Days:`, `${summary.totalDays}`],
    [`Present:`, `${summary.present}`],
    [`Late:`, `${summary.late}`],
    [`On Leave:`, `${summary.leave}`],
    [`Absent:`, `${summary.absent}`],
    [`Total Hours:`, `${summary.totalWorkingHours.toFixed(2)}`],
  ];

  summaryData.forEach((item) => {
    doc.text(`${item[0]} ${item[1]}`, margin + 5, yPosition);
    yPosition += 6;
  });

  yPosition += 5;

  // Attendance Table
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text("Detailed Attendance Records:", margin, yPosition);
  yPosition += 10;

  const tableData = report.attendanceRecords.map((record) => [
    formatDate(record.date),
    formatTime(record.checkInTime),
    formatTime(record.checkOutTime),
    record.status || "N/A",
    (record.workingHours ?? "-").toString(),
  ]);

  autoTable(doc, {
    head: [["Date", "Check In", "Check Out", "Status", "Hours"]],
    body: tableData,
    startY: yPosition,
    margin: margin,
    theme: "striped",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      textColor: [50, 50, 50],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
    },
  });

  // Footer
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Download
  const filename = `attendance-report-${employee.email}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};

export default function AttendanceReportPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setReport(null);

    if (!email.trim()) {
      setError("Please enter the employee's email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await getAttendanceReport(email.trim(), startDate, endDate);
      if (!response.success) {
        setError(response.error || "Unable to load attendance report.");
      } else {
        setReport(response.data);
      }
    } catch (err) {
      setError("An unexpected error occurred while generating the report.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">CEO Attendance Report</h1>
              <p className="text-sm text-slate-500 mt-2">
                Search by employee email and generate a full attendance record for that member.
              </p>
            </div>
            <div className="text-sm text-slate-600">
              Signed in as <strong>{user?.firstName} {user?.lastName}</strong> (CEO)
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Employee Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:col-span-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Search className="w-4 h-4" />
              {loading ? "Loading report…" : "Generate Report"}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {report && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Attendance Report</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Full record for <strong>{report.employee.email}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => generatePDF(report)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">Name</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{report.employee.firstName} {report.employee.lastName}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">Total Days</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{report.summary.totalDays}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">Present</p>
                <p className="mt-2 text-lg font-semibold text-emerald-700">{report.summary.present}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">Late</p>
                <p className="mt-2 text-lg font-semibold text-amber-700">{report.summary.late}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">On Leave</p>
                <p className="mt-2 text-lg font-semibold text-blue-700">{report.summary.leave}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">Absent</p>
                <p className="mt-2 text-lg font-semibold text-red-700">{report.summary.absent}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200">
                <p className="text-sm text-slate-500">Total Hours</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{report.summary.totalWorkingHours}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100 text-left text-sm uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Check In</th>
                    <th className="px-5 py-4">Check Out</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {report.attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 text-sm text-slate-800">{formatDate(record.date)}</td>
                      <td className="px-5 py-4 text-sm text-slate-800">{formatTime(record.checkInTime)}</td>
                      <td className="px-5 py-4 text-sm text-slate-800">{formatTime(record.checkOutTime)}</td>
                      <td className="px-5 py-4 text-sm text-slate-800">{record.status || "N/A"}</td>
                      <td className="px-5 py-4 text-sm text-slate-800">{record.workingHours ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
