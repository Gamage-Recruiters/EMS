import React, { useState, useEffect } from 'react';
// import { useAttendance } from '../context/AttendanceContext';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { getAllAttendance } from '../services/attendanceService';

const AttendancePage = () => {
    // const { getAllAttendance } = useAttendance();
    const [allAttendanceData, setAllAttendanceData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('daily');
    const [monthlyStats, setMonthlyStats] = useState(null);

    // Fetch all attendance data once
    useEffect(() => {
        const fetchAllAttendance = async () => {
            try {
                setLoading(true);
                const response = await getAllAttendance();
                if (response.success){
                    setAllAttendanceData(response.data.data || []);
                }else {
                    setError(response.error || 'Failed to load attendance data.');
                }
                
            } catch (err) {
                console.error('Error fetching attendance:', err);
                setError('Failed to load attendance data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllAttendance();
    }, []);

    // Filter data when date or view mode changes
    useEffect(() => {
        if (allAttendanceData.length === 0) return;

        if (viewMode === 'daily') {
            // Filter by selected date
            const filtered = allAttendanceData.filter(record => {
                if (!record.date) return false;
                const recordDate = new Date(record.date).toISOString().split('T')[0];
                return recordDate === selectedDate;
            });
            console.log(`Filtered records for ${selectedDate}:`, filtered);
            setEmployees(filtered);
        } else {
            // Monthly view
            const [year, month] = selectedDate.split('-');
            const filtered = allAttendanceData.filter(record => {
                if (!record.date) return false;
                const recordDate = new Date(record.date);
                return recordDate.getFullYear() === parseInt(year) && 
                       recordDate.getMonth() === parseInt(month) - 1;
            });
            console.log(`Filtered records for ${year}-${month}:`, filtered);
            setEmployees(filtered);
            calculateMonthlyStats(filtered);
        }
    }, [selectedDate, viewMode, allAttendanceData]);

    // Calculate monthly statistics
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
            
            // Count by status
            if (record.status === 'Present') stats.present++;
            else if (record.status === 'Absent') stats.absent++;
            else if (record.status === 'Late') stats.late++;
            else if (record.status === 'leave') stats.leave++;

            // Per employee stats
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

    // Helper function for Status badge
    const getStatusBadge = (status) => {
        let text = 'N/A';
        let colorClass = 'bg-gray-400 text-gray-800';

        switch (status) {
            case 'Present':
                text = 'Present';
                colorClass = 'bg-green-100 text-green-700 font-medium';
                break;
            case 'Absent':
                text = 'Absent';
                colorClass = 'bg-red-100 text-red-700 font-medium';
                break;
            case 'Late':
                text = 'Late';
                colorClass = 'bg-orange-100 text-orange-700 font-medium';
                break;
            case 'leave':
                text = 'On Leave';
                colorClass = 'bg-yellow-100 text-yellow-700 font-medium';
                break;
            default:
                break;
        }

        return (
            <span className={`px-3 py-1 text-xs rounded-full ${colorClass}`}>
                {text}
            </span>
        );
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return '-';
        const time = new Date(timeString);
        return time.toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading attendance...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex-grow">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h2>
                <p className="text-gray-500">
                    {viewMode === 'daily' 
                        ? `Showing records for ${formatDate(selectedDate)}` 
                        : 'Monthly attendance overview'}
                </p>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('daily')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                viewMode === 'daily'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Clock className="inline w-4 h-4 mr-2" />
                            Daily View
                        </button>
                        <button
                            onClick={() => setViewMode('monthly')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                viewMode === 'monthly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <TrendingUp className="inline w-4 h-4 mr-2" />
                            Monthly View
                        </button>
                    </div>

                    {/* Date Picker */}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <input
                            type={viewMode === 'daily' ? 'date' : 'month'}
                            value={selectedDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Quick Date Buttons */}
                    {viewMode === 'daily' && (
                        <button
                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                        >
                            Today
                        </button>
                    )}
                </div>
            </div>

            {/* Monthly Statistics */}
            {viewMode === 'monthly' && monthlyStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                        <div className="text-sm text-gray-600 mb-1">Present</div>
                        <div className="text-2xl font-bold text-green-600">{monthlyStats.present}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
                        <div className="text-sm text-gray-600 mb-1">Late</div>
                        <div className="text-2xl font-bold text-orange-600">{monthlyStats.late}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
                        <div className="text-sm text-gray-600 mb-1">On Leave</div>
                        <div className="text-2xl font-bold text-yellow-600">{monthlyStats.leave}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
                        <div className="text-sm text-gray-600 mb-1">Absent</div>
                        <div className="text-2xl font-bold text-red-600">{monthlyStats.absent}</div>
                    </div>
                </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    {employees.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-lg font-medium mb-1">No attendance records found</p>
                            <p className="text-sm">
                                {viewMode === 'daily' 
                                    ? `No records for ${formatDate(selectedDate)}` 
                                    : 'No records for this month'}
                            </p>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-in</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-out</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Reason</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map(emp => (
                                    <tr key={emp._id} className="hover:bg-blue-50/50 transition duration-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {emp.employee?.firstName} {emp.employee?.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {formatDate(emp.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                            {formatTime(emp.checkInTime)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                                            {formatTime(emp.checkOutTime)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {getStatusBadge(emp.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {emp.leaveReason || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;