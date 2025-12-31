import { useState } from "react";

export default function DirectMessageSearch({ users, onStartDM }) {
  const [query, setQuery] = useState("");

  const results = users.filter(
    (u) =>
      u.role === "Developer" &&
      u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-3 border-b border-[#E0E0E0]">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search developer..."
        className="w-full px-3 py-2 text-sm border rounded-lg"
      />

      {query && (
        <div className="mt-2 space-y-1">
          {results.map((u) => (
            <div
              key={u.id}
              onClick={() => {
                onStartDM(u);
                setQuery("");
              }}
              className="px-2 py-1 text-sm rounded cursor-pointer hover:bg-[#F0F0F0]"
            >
              {u.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
