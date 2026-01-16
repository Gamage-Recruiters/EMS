import { useState } from "react";

export default function UserManager({ room, users, setRooms }) {
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState([]);

  const removeUser = (id) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id
          ? { ...r, members: r.members.filter((m) => m !== id) }
          : r
      )
    );
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addUsers = () => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id
          ? { ...r, members: [...new Set([...r.members, ...selected])] }
          : r
      )
    );
    setSelected([]);
    setShowAdd(false);
  };

  const availableUsers = users.filter((u) => !room.members.includes(u.id));

  return (
    <div className="w-64 bg-[#FFFFFF] border-l border-[#E0E0E0] flex flex-col">
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#E0E0E0]">
        <span className="font-semibold text-[#1F1F1F]">Members</span>
        {availableUsers.length > 0 && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-[#3676E0] text-xs"
          >
            + Add
          </button>
        )}
      </div>

      {showAdd && (
        <div className="p-3 border-b border-[#E0E0E0]">
          {availableUsers.map((u) => (
            <div key={u.id} className="flex justify-between mb-1 text-sm">
              <span>{u.name}</span>
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggleSelect(u.id)}
              />
            </div>
          ))}
          <button
            onClick={addUsers}
            className="mt-2 w-full py-1 bg-[#34C759] text-white rounded"
          >
            Add Selected
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        {room.members.map((id) => {
          const user = users.find((u) => u.id === id);
          return (
            <div
              key={id}
              className="flex justify-between items-center mb-2 text-sm"
            >
              <span className="text-[#4D4D4D]">{user.name}</span>
              <button
                onClick={() => removeUser(id)}
                className="text-[#E53935] text-xs"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
