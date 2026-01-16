import { useState, useEffect, useMemo } from "react";
import api from "../../../../services/api";
import { toast } from "react-hot-toast";

export default function EditTeamModal({
  channel,
  users,
  onUpdate,
  onDelete,
  onClose,
}) {
  // Get current logged-in user from localStorage (same as other components)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [name, setName] = useState(channel?.name || "");
  const [members, setMembers] = useState(
    channel?.members?.map((m) => m._id) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state when channel prop changes
  useEffect(() => {
    if (channel) {
      setName(channel.name || "");
      setMembers(channel.members?.map((m) => m._id) || []);
    }
  }, [channel]);

  // Only show active users for selection
  const activeUsers = useMemo(
    () => users.filter((u) => u.status === "Active"),
    [users]
  );

  // Group active users by role
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

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return toast.error("Channel name is required");
    }

    setIsSubmitting(true);
    try {
      const res = await api.put(`/chat/channels/${channel._id}`, {
        name: name.trim(),
        memberIds: members,
      });

      toast.success("Channel updated successfully");
      onUpdate(res.data.channel);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update channel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Delete this channel permanently? This cannot be undone.")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/chat/channels/${channel._id}`);
      toast.success("Channel deleted");
      onDelete(channel._id);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err.response?.data?.message || "Failed to delete channel");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!channel) return null;

  const hasChanges =
    name.trim() !== (channel.name || "") ||
    JSON.stringify([...members].sort()) !==
      JSON.stringify([...(channel.members?.map((m) => m._id) || [])].sort());

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">
            Edit Channel: {channel.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Update name or team members
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Channel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Development Team"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Members Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Team Members
            </label>

            {activeUsers.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                No active users available to assign
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                {Object.entries(usersByRole).map(([role, roleUsers]) =>
                  roleUsers.length > 0 ? (
                    <div key={role}>
                      {/* Role Header */}
                      <div className="bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 flex justify-between items-center">
                        <span>{role}</span>
                        <span className="text-xs text-gray-500">
                          {roleUsers.length} active
                        </span>
                      </div>

                      {/* Users List */}
                      {roleUsers.map((u) => {
                        const isCurrentUser = u._id === currentUser?._id;
                        return (
                          <label
                            key={u._id}
                            className={`flex items-center px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${
                              isCurrentUser ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={members.includes(u._id)}
                              onChange={() => toggleMember(u._id)}
                              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2 truncate">
                                {u.firstName} {u.lastName}
                                {isCurrentUser && (
                                  <span className="text-xs text-blue-600 font-normal">
                                    (You)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                <span className="truncate">{u.email}</span>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                    u.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {u.status}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Channel"}
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !hasChanges || !name.trim()}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
