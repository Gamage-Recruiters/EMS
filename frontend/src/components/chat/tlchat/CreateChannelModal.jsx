import { useState } from "react";

export default function CreateChannelModal({ users, onCreate, onClose }) {
  const [channelName, setChannelName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [type, setType] = useState("team"); // default type

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const createChannel = () => {
    if (!channelName.trim()) return;

    let members = [];
    if (type === "team") members = selectedUsers;
    else if (type === "notice") members = users.map((u) => u.id); // all users
    else if (type === "complaint")
      members = users.filter((u) => u.role !== "Developer").map((u) => u.id); // PM/TL

    onCreate({
      id: Date.now().toString(),
      name: channelName,
      type,
      members,
      messages: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#FFFFFF] w-96 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-[#1F1F1F] mb-4">
          Create Channel
        </h3>

        <div className="mb-3">
          <label className="text-sm font-medium text-[#4D4D4D] mb-1 block">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2"
          >
            <option value="team">Team</option>
            <option value="notice">Notice</option>
            <option value="complaint">Complaint</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium text-[#4D4D4D] mb-1 block">
            Name
          </label>
          <input
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel name"
            className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2"
          />
        </div>

        {type === "team" && (
          <div className="mb-3">
            <p className="text-sm font-medium text-[#4D4D4D] mb-1">
              Assign Developers
            </p>
            <div className="max-h-32 overflow-y-auto border border-[#E0E0E0] rounded-lg p-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between items-center mb-1"
                >
                  <span>{u.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 text-[#7A7A7A]">
            Cancel
          </button>
          <button
            onClick={createChannel}
            className="px-4 py-2 bg-[#34C759] text-white rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
