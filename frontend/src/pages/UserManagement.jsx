import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function UserManagement() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Developer",
      team: "Frontend",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Team Lead",
      team: "Backend",
      status: "Pending",
    },
  ];

  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/user-profile/${id}`);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ================= SIDEBAR ================= */}
      <Sidebar/>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <Link to="/profile">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Add Developer
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { title: "Total Users", value: 120 },
            { title: "Active Users", value: 98 },
            { title: "Team Leads", value: 12 },
            { title: "Pending Setup", value: 10 },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-semibold mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role Level</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.team}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        user.status === "Active"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(user.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
