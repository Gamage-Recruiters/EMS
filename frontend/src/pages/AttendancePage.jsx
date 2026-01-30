import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, TrendingUp, Trash2, Eye } from 'lucide-react';
import { getAllAttendance, deleteAttendanceRecord } from '../services/attendanceService';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


const AttendancePage = () => {
    const { user } = useAuth();

    const [allAttendanceData, setAllAttendanceData] = useState([]);
    const [employees, setEmployees] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('daily');
    const [monthlyStats, setMonthlyStats] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

     // 🔐 ROLE GUARD
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!["PM", "TL", "CEO"].includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // Fetch all attendance data
    useEffect(() => {
        fetchAllAttendance();
    }, []);


    const fetchAllAttendance = async () => {
        try {
            // setLoading(true);
            const response = await getAllAttendance();
            if (response.success) {
                setAllAttendanceData(response.data.data || []);
            } else {
                setError(response.error || 'Failed to load attendance data.');
            }
        } catch (err) {
            console.error('Error fetching attendance:', err);
            setError('Failed to load attendance data.');
        }
    };

    // Filter data when date or view mode changes
    useEffect(() => {
        if (allAttendanceData.length === 0) return;

        if (viewMode === 'daily') {
            const filtered = allAttendanceData.filter(record => {
                if (!record.date) return false;
                const recordDate = new Date(record.date).toISOString().split('T')[0];
                return recordDate === selectedDate;
            });
            setEmployees(filtered);
        } else {
            const [year, month] = selectedDate.split('-');
            const filtered = allAttendanceData.filter(record => {
                if (!record.date) return false;
                const recordDate = new Date(record.date);
                return recordDate.getFullYear() === parseInt(year) && 
                       recordDate.getMonth() === parseInt(month) - 1;
            });
            setEmployees(filtered);
            calculateMonthlyStats(filtered);
        }
    }, [selectedDate, viewMode, allAttendanceData]);

    const calculateMonthlyStats = (records) => {
        const stats = {
            totalDays: 0,
            present: 0,
            absent: 0,
            late: 0,
            leave: 0,
            employees: {}
        };

        records.forEach(record => {
            stats.totalDays++;
            
            if (record.status === 'Present') stats.present++;
            else if (record.status === 'Absent') stats.absent++;
            else if (record.status === 'Late') stats.late++;
            else if (record.status === 'leave') stats.leave++;

            const empId = record.employee?._id;
            if (empId) {
                if (!stats.employees[empId]) {
                    stats.employees[empId] = {
                        name: `${record.employee?.firstName} ${record.employee?.lastName}`,
                        present: 0,
                        absent: 0,
                        late: 0,
                        leave: 0
                    };
                }
                if (record.status === 'Present') stats.employees[empId].present++;
                else if (record.status === 'Absent') stats.employees[empId].absent++;
                else if (record.status === 'Late') stats.employees[empId].late++;
                else if (record.status === 'leave') stats.employees[empId].leave++;
            }
        });

        setMonthlyStats(stats);
    };

    const handleDelete = async (id, employeeName) => {
        if (!window.confirm(`Are you sure you want to delete ${employeeName}'s attendance record?`)) {
            return;
        }

        try {
            setDeleteLoading(id);
            const response = await deleteAttendanceRecord(id);
            
            if (response.success) {
                // Remove from local state
                setAllAttendanceData(prev => prev.filter(record => record._id !== id));
                alert('Attendance record deleted successfully!');
            } else {
                alert(response.error || 'Failed to delete record');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete attendance record');
        } finally {
            setDeleteLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Present: 'bg-green-100 text-green-700 border border-green-200',
            Absent: 'bg-red-100 text-red-700 border border-red-200',
            Late: 'bg-orange-100 text-orange-700 border border-orange-200',
            leave: 'bg-blue-100 text-blue-700 border border-blue-200'
        };

        const labels = {
            Present: 'Present',
            Absent: 'Absent',
            Late: 'Late',
            leave: 'On Leave'
        };

        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                {labels[status] || 'N/A'}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return new Date(timeString).toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    Attendance Management
                </h2>
                <p className="text-gray-600">
                    {viewMode === 'daily' 
                        ? `Showing records for ${formatDate(selectedDate)}` 
                        : 'Monthly attendance overview'}
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* View Mode Toggle */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('daily')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                viewMode === 'daily'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Clock className="inline w-4 h-4 mr-2" />
                            Daily
                        </button>
                        <button
                            onClick={() => setViewMode('monthly')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                viewMode === 'monthly'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <TrendingUp className="inline w-4 h-4 mr-2" />
                            Monthly
                        </button>
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <input
                            type={viewMode === 'daily' ? 'date' : 'month'}
                            value={selectedDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-1 border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                        />
                    </div>

                    {/* Today Button */}
                    {viewMode === 'daily' && (
                        <button
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                        >
                            Today
                        </button>
                    )}
                </div>
            </div>

            {/* Monthly Statistics */}
            {viewMode === 'monthly' && monthlyStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition">
                        <div className="text-sm text-gray-600 mb-1 font-semibold">Present</div>
                        <div className="text-3xl font-bold text-green-600">{monthlyStats.present}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500 hover:shadow-lg transition">
                        <div className="text-sm text-gray-600 mb-1 font-semibold">Late</div>
                        <div className="text-3xl font-bold text-orange-600">{monthlyStats.late}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition">
                        <div className="text-sm text-gray-600 mb-1 font-semibold">On Leave</div>
                        <div className="text-3xl font-bold text-blue-600">{monthlyStats.leave}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500 hover:shadow-lg transition">
                        <div className="text-sm text-gray-600 mb-1 font-semibold">Absent</div>
                        <div className="text-3xl font-bold text-red-600">{monthlyStats.absent}</div>
                    </div>
                </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    {employees.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-xl font-semibold mb-2 text-gray-700">No Records Found</p>
                            <p className="text-sm text-gray-500">
                                {viewMode === 'daily' 
                                    ? `No attendance records for ${formatDate(selectedDate)}` 
                                    : 'No records available for this month'}
                            </p>
                        </div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Check In</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Check Out</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map(emp => (
                                    <tr key={emp._id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                                    {emp.employee?.firstName?.charAt(0)}{emp.employee?.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {emp.employee?.firstName} {emp.employee?.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {emp.employee?.role || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            {formatDate(emp.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            {formatTime(emp.checkInTime)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                                            {formatTime(emp.checkOutTime)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(emp.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(emp._id, `${emp.employee?.firstName} ${emp.employee?.lastName}`)}
                                                    disabled={deleteLoading === emp._id}
                                                    className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                                                        deleteLoading === emp._id
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md'
                                                    }`}
                                                >
                                                    {deleteLoading === emp._id ? (
                                                        <>
                                                            <div className="animate-spin h-3 w-3 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Total Records Count */}
            {employees.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                    Showing <span className="font-semibold text-blue-600">{employees.length}</span> record{employees.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default AttendancePage;