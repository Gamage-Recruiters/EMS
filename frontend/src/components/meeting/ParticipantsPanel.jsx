import React, { useMemo, useState } from "react";
import { CheckCircle, Circle, X, User, Search } from "lucide-react";

const ParticipantsPanel = ({
  users,
  selectedParticipants,
  onToggleParticipant,
}) => {
  const [search, setSearch] = useState("");

  const term = search.toLowerCase().trim();

  // ===== FILTERED USERS =====
  const filteredUsers = useMemo(() => {
    if (!term) return users;

    return users.filter((u) => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (
        name.includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
      );
    });
  }, [users, term]);

  // ===== SPLIT SELECTED / AVAILABLE =====
  const selectedUsers = filteredUsers.filter((u) =>
    selectedParticipants.some((p) => p.email === u.email)
  );

  const unselectedUsers = filteredUsers.filter(
    (u) => !selectedParticipants.some((p) => p.email === u.email)
  );

  const renderAvatar = (user) => {
    if (user.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
        <User size={16} className="text-slate-500" />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Participants</h2>

      {/* ================= SEARCH ================= */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-[420px] overflow-auto pr-1 space-y-4">
        {/* ================= SELECTED ================= */}
        {selectedUsers.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 mb-2">Selected</p>

            <div className="space-y-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-xl border bg-blue-50 border-blue-300"
                >
                  <div className="flex items-center gap-3">
                    {renderAvatar(user)}
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleParticipant(user)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= AVAILABLE ================= */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Available</p>

          <div className="space-y-2">
            {unselectedUsers.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => onToggleParticipant(user)}
                className="w-full flex items-center justify-between p-3 rounded-xl border bg-white hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {renderAvatar(user)}
                  <div className="text-left">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                  </div>
                </div>

                <Circle size={18} className="text-slate-400" />
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                No users match your search
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPanel;
