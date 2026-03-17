import { useState } from "react";
import { getSocket } from "../socket";

export default function DirectMessageSearch({ users = [], onOpenChannel }) {
  const [query, setQuery] = useState("");

  const results = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return u.role !== "CEO" && fullName.includes(query.toLowerCase());
  });

  // DirectMessageSearch.jsx
  const startDM = (user) => {
    console.log("Starting DM with:", user._id);

    const socket = getSocket();

    if (!socket) {
      console.error("Socket instance not created");
      alert("Chat system not initialized");
      return;
    }

    if (!socket.connected) {
      console.warn("Socket not connected yet");
      alert("Connecting to chat... please wait a moment and try again");
      socket.connect(); // try to force reconnect
      return;
    }

    socket.emit("private:create", { recipientId: user._id }, (res) => {
      console.log("private:create response:", res);
      if (!res?.success) {
        alert(res?.error || "Failed to create private chat");
        return;
      }
      onOpenChannel(res.channel._id);
      setQuery("");
    });
  };

  return (
    <div className="p-3 border-b">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search employee..."
        className="w-full px-3 py-2 text-sm border rounded-lg"
      />

      {query && (
        <div className="mt-2 max-h-48 overflow-y-auto">
          {results.length === 0 && (
            <p className="text-xs text-gray-400 px-2">No employees found</p>
          )}

          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => startDM(u)}
              className="px-2 py-1 text-sm cursor-pointer rounded hover:bg-gray-100"
            >
              {u.firstName} {u.lastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
