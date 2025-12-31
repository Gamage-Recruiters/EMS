
import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/attendanceService';

const AttendancePage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees(); // fetch from mock or real backend
                setEmployees(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load employee data.');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Helper function for Status badge
    const getStatusBadge = (status) => {
        let text = 'N/A';
        let colorClass = 'bg-gray-400 text-gray-800';

        switch (status) {
            case 'active':
                text = 'Active';
                colorClass = 'bg-green-100 text-green-700 font-medium';
                break;
            case 'inactive':
                text = 'Inactive';
                colorClass = 'bg-red-100 text-red-700 font-medium';
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

    if (loading) return <div className="p-6 text-gray-500">Loading employees...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex-grow">
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h2>
            <p className="text-gray-500 mb-6 border-b pb-4">
                Overview of all employees' check-in, check-out, and leave status.
            </p>

            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-in</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-out</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Reason</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-blue-50/50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.team}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{emp.checkIn || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{emp.checkOut || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(emp.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.leaveReason || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;