import { useState, useEffect } from "react";

export default function CreateChannelModal({
  users,
  currentUser,
  onCreate,
  onClose,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("regular");
  const [selected, setSelected] = useState([]);

  // ✅ ALL ACTIVE USERS ARE ASSIGNABLE
  const assignableUsers = users.filter((u) => u.status === "Active");

  // Reset modal fields on open
  useEffect(() => {
    setName("");
    setType("regular");
    setSelected([]);
  }, [users]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const create = () => {
    if (!name.trim()) return;

    onCreate({
      name,
      type,
      members: type === "regular" ? [...selected, currentUser._id] : [],
    });
    onClose(); // close after creation
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Create Channel</h3>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-3 border rounded px-3 py-2"
        >
          <option value="regular">Team</option>
          <option value="notice">Notice</option>
        </select>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Channel name"
          className="w-full mb-3 border px-3 py-2 rounded"
        />

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
