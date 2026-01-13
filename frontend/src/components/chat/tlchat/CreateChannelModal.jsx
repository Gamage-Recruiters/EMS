import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../../services/api";
import { toast } from "react-hot-toast";

export default function CreateChannelModal({ users, onCreate, onClose }) {
  const { user } = useAuth(); // logged-in user
  const [name, setName] = useState("");
  const [type, setType] = useState("regular");
  const [selected, setSelected] = useState([]);

  // ✅ Only active users can be assigned
  const assignableUsers = users.filter((u) => u.status === "Active");

  // Reset modal when opened
  useEffect(() => {
    setName("");
    setType("regular");
    setSelected([]);
  }, []);

  // Toggle user selection
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Create channel
  const create = async () => {
    if (!name.trim()) {
      toast.error("Channel name is required");
      return;
    }

    try {
      const payload = {
        name,
        type,
      };

      // Only send members for regular channels
      if (type === "regular") {
        payload.memberIds = selected;
      }

      const { data } = await api.post("/chat/channels", payload);

      toast.success("Channel created successfully!");
      onCreate(data.channel); // add channel to UI
      onClose();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to create channel");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Create Channel</h3>

        {/* Channel type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 border rounded px-3 py-2"
        >
          <option value="regular">Team</option>
          <option value="notice">Notice</option>
        </select>

        {/* Channel name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Channel name"
          className="w-full mb-3 border px-3 py-2 rounded"
        />

        {/* Assign members only for regular channels */}
        {type === "regular" && (
          <>
            <p className="text-sm font-medium mb-1">Assign Team Members</p>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {assignableUsers.length === 0 && (
                <p className="text-xs text-gray-400">
                  No assignable users available
                </p>
              )}

              {assignableUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex justify-between items-center mb-1"
                >
                  <span>
                    {u.firstName} {u.lastName}
                  </span>
                  <input
                    type="checkbox"
                    checked={selected.includes(u._id)}
                    onChange={() => toggle(u._id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={create}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
