import { useState } from "react";

export default function EditTeamModal({
  room,
  users,
  onUpdate,
  onDelete,
  onClose,
}) {
  const [name, setName] = useState(room.name);
  const [members, setMembers] = useState(room.members);

  const toggleUser = (id) => {
    setMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const save = () => {
    onUpdate({ ...room, name, members });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Edit Team</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        <div className="max-h-40 overflow-y-auto border rounded p-2 mb-3">
          {users.map((u) => (
            <div key={u.id} className="flex justify-between mb-1">
              <span>{u.name}</span>
              <input
                type="checkbox"
                checked={members.includes(u.id)}
                onChange={() => toggleUser(u.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={() => onDelete(room.id)} className="text-red-500">
            Delete
          </button>

          <div className="flex gap-2">
            <button onClick={onClose}>Cancel</button>
            <button
              onClick={save}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
