import { useState } from "react";
import socket from "../socket";

export default function DirectMessageSearch({ users, onOpenChannel }) {
  const [query, setQuery] = useState("");

  const results = users.filter(
    (u) =>
      ["Developer", "ATL", "PM"].includes(u.role) &&
      u.name.toLowerCase().includes(query.toLowerCase())
  );

  const startDM = (user) => {
    socket.emit("private:send", { recipientId: user._id, text: "" }, (res) => {
      onOpenChannel(res.channelId);
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
        <div className="mt-2">
          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => startDM(u)}
              className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
            >
              {u.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
