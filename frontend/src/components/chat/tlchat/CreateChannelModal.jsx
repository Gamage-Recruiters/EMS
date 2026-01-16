import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../../services/api";
import { toast } from "react-hot-toast";

export default function CreateChannelModal({ users, onCreate, onClose }) {
  const { user: currentUser } = useAuth(); // logged-in user (for reference)
  const [name, setName] = useState("");
  const [type, setType] = useState("regular");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Filter only active users
  const activeUsers = useMemo(
    () => users.filter((u) => u.status === "Active"),
    [users]
  );

  // Group users by role for display
  const usersByRole = useMemo(() => {
    const groups = {
      CEO: [],
      SystemAdmin: [],
      TL: [],
      ATL: [],
      PM: [],
      Developer: [],
      Unassigned: [],
    };

    activeUsers.forEach((u) => {
      if (groups[u.role]) {
        groups[u.role].push(u);
      } else {
        groups.Unassigned.push(u);
      }
    });

    return groups;
  }, [activeUsers]);

  // Reset form when modal opens
  useEffect(() => {
    setName("");
    setType("regular");
    setSelectedMembers([]);
  }, []);

  // Toggle member selection
  const toggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Create channel handler
  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Channel name is required");
      return;
    }

    if (type === "regular" && selectedMembers.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        type,
      };

      if (type === "regular") {
        payload.memberIds = selectedMembers;
      }

      const { data } = await api.post("/chat/channels", payload);

      toast.success("Channel created successfully!");
      onCreate(data.channel);
      onClose();
    } catch (err) {
      console.error("Channel creation error:", err);
      toast.error(err.response?.data?.message || "Failed to create channel");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">
            Create New Channel
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Set up a team, notice, or announcement channel
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Channel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="regular">Team Channel</option>
              <option value="notice">Notice / Announcement</option>
            </select>
            <p className="mt-1.5 text-xs text-gray-500">
              {type === "regular"
                ? "Team members can chat and collaborate"
                : "Official notices — only admins can post"}
            </p>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Development Team, Company Updates"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Member Selection - only for regular channels */}
          {type === "regular" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Assign Team Members <span className="text-red-500">*</span>
              </label>

              {activeUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                  No active users available to assign
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {Object.entries(usersByRole).map(([role, roleUsers]) =>
                    roleUsers.length > 0 ? (
                      <div key={role} className="border-b last:border-b-0">
                        <div className="bg-gray-50 px-4 py-2 font-medium text-sm text-gray-700 flex items-center justify-between">
                          <span>{role}</span>
                          <span className="text-xs text-gray-500">
                            {roleUsers.length} members
                          </span>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                          {roleUsers.map((u) => (
                            <label
                              key={u._id}
                              className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-t first:border-t-0 ${
                                u._id === currentUser._id ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedMembers.includes(u._id)}
                                onChange={() => toggleMember(u._id)}
                                disabled={u.status !== "Active"}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="ml-3 flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {u.firstName} {u.lastName}
                                  {u._id === currentUser._id && (
                                    <span className="ml-2 text-xs text-blue-600">
                                      (You)
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <span>{u.email}</span>
                                  <span
                                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                                      u.status === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {u.status}
                                  </span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={
              !name.trim() ||
              (type === "regular" && selectedMembers.length === 0)
            }
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
}
