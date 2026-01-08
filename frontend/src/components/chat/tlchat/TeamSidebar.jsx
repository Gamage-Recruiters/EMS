import DirectMessageSearch from "./DirectMessageSearch";

export default function TeamSidebar({
  channels,
  users,
  activeId,
  setActiveId,
  onCreate,
}) {
  const regular = Array.isArray(channels)
    ? channels.filter((c) => c.type === "regular")
    : [];
  const notice = Array.isArray(channels)
    ? channels.filter((c) => c.type === "notice")
    : [];
  const privateChats = Array.isArray(channels)
    ? channels.filter((c) => c.type === "private")
    : [];

  const Item = ({ c }) => (
    <div
      onClick={() => setActiveId(c._id)}
      className={`px-3 py-2 rounded-md cursor-pointer text-sm mb-1
        ${activeId === c._id ? "bg-gray-200" : "hover:bg-gray-100"}`}
    >
      {c.name}
    </div>
  );

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="h-14 px-4 flex justify-between items-center border-b">
        <span className="font-semibold">Channels</span>
        <button onClick={onCreate} className="text-blue-600 text-lg">
          +
        </button>
      </div>

      <DirectMessageSearch users={users} onOpenChannel={setActiveId} />

      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-xs text-gray-400">TEAM</p>
        {regular.map((c) => (
          <Item key={c._id} c={c} />
        ))}

        <p className="text-xs text-gray-400 mt-3">DM</p>
        {privateChats.map((c) => (
          <Item key={c._id} c={c} />
        ))}

        <p className="text-xs text-gray-400 mt-3">SYSTEM</p>
        {notice.map((c) => (
          <Item key={c._id} c={c} />
        ))}
      </div>
    </div>
  );
}
