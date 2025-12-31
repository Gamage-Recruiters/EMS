import DirectMessageSearch from "./DirectMessageSearch";

export default function TeamSidebar({
  rooms,
  users,
  activeRoomId,
  setActiveRoomId,
  onStartDM,
}) {
  const teamChannels = rooms.filter((r) => r.type === "team");
  const systemChannels = rooms.filter(
    (r) => r.type === "notice" || r.type === "complaint"
  );
  const dmChannels = rooms.filter((r) => r.type === "dm");

  const ChannelItem = ({ room }) => (
    <div
      onClick={() => setActiveRoomId(room.id)}
      className={`px-3 py-2 rounded-md cursor-pointer text-sm mb-1
        ${
          activeRoomId === room.id
            ? "bg-[#F0F0F0] text-black"
            : "text-[#4D4D4D] hover:bg-[#F0F0F0]"
        }`}
    >
      {room.name}
    </div>
  );

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="h-14 px-4 flex items-center border-b">
        <span className="font-semibold">Channels</span>
      </div>

      {/* 🔍 DM SEARCH */}
      <DirectMessageSearch users={users} onStartDM={onStartDM} />

      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-xs uppercase text-gray-400 mb-1">Team</p>
        {teamChannels.map((r) => (
          <ChannelItem key={r.id} room={r} />
        ))}

        <p className="text-xs uppercase text-gray-400 mt-3 mb-1">
          Direct Messages
        </p>
        {dmChannels.map((r) => (
          <ChannelItem key={r.id} room={r} />
        ))}

        <p className="text-xs uppercase text-gray-400 mt-3 mb-1">System</p>
        {systemChannels.map((r) => (
          <ChannelItem key={r.id} room={r} />
        ))}
      </div>
    </div>
  );
}
