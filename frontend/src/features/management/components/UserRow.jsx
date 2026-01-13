import React from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function UserRow({ user, onView, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      CEO: "bg-red-100 text-red-800",
      SystemAdmin: "bg-purple-100 text-purple-800",
      TL: "bg-blue-100 text-blue-800",
      ATL: "bg-indigo-100 text-indigo-800",
      PM: "bg-amber-100 text-amber-800",
      Developer: "bg-cyan-100 text-cyan-800",
      Unassigned: "bg-gray-100 text-gray-800",
    };
    return colors[role] || colors["Unassigned"];
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
      {/* Name */}
      <td className="px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {(user.firstName?.[0] || user.name?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                user.name ||
                "-"}
            </p>
            <p className="text-xs text-gray-500">{user.email || "-"}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
            user.role
          )}`}
        >
          {user.role || "Unassigned"}
        </span>
      </td>

      {/* Contact Number */}
      <td className="px-6 py-2">
        <p className="text-gray-700 font-medium">{user.contactNumber || '-'}</p>
      </td>

      {/* City */}
      <td className="px-6 py-2">
        <p className="text-gray-700 font-medium">{user.city || '-'}</p>
      </td>

      {/* Designation */}
      <td className="px-6 py-2">
        <p className="text-gray-700 font-medium">{user.designation || '-'}</p>
      </td>
      
      {/* Joined Date */}
      <td className="px-6 py-2">
        <p className="text-gray-700 font-medium">
          {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : '-'}
        </p>
      </td>

      {/* Status */}
      <td className="px-6 py-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            user.status
          )}`}
        >
          {user.status || "Active"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(user._id || user.id)}
            className="inline-flex items-center justify-center w-9 h-9 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View profile"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit?.(user._id || user.id)}
            className="inline-flex items-center justify-center w-9 h-9 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
            title="Edit profile"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(user._id || user.id)}
            className="inline-flex items-center justify-center w-9 h-9 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete profile"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
