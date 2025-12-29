export default function TeamSidebar({
  rooms,
  activeRoomId,
  setActiveRoomId,
  onCreateTeam,
}) {
  const textChannels = rooms.filter(
    (r) => r.type === "team" || r.type === "general"
  );

  const systemChannels = rooms.filter((r) => r.type !== "team");

  const ChannelItem = ({ room }) => {
    const icon =
      room.type === "team" ? "#" : room.type === "notice" ? "📢" : "🚨";

    return (
      <div
        onClick={() => setActiveRoomId(room.id)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1
          ${
            activeRoomId === room.id
              ? "bg-[#F0F0F0] text-[#1F1F1F]"
              : "text-[#4D4D4D] hover:bg-[#F0F0F0]"
          }`}
      >
        <span className="text-[#7A7A7A]">{icon}</span>
        <span className="truncate">{room.name}</span>
      </div>
    );
  };

  return (
    <div className="w-64 bg-[#FFFFFF] border-r border-[#E0E0E0] flex flex-col">
      {/* HEADER */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#E0E0E0]">
        <span className="font-semibold text-[#1F1F1F]">Channels</span>
        <button onClick={onCreateTeam} className="text-[#3676E0] font-bold">
          +
        </button>
      </div>

      {/* CHANNEL LIST */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* TEXT CHANNELS */}
        <div className="mb-3">
          <p className="text-xs uppercase text-[#7A7A7A] px-2 mb-1">
            Text Channels
          </p>
          {textChannels.map((room) => (
            <ChannelItem key={room.id} room={room} />
          ))}
        </div>

        {/* SYSTEM CHANNELS */}
        <div>
          <p className="text-xs uppercase text-[#7A7A7A] px-2 mb-1">System</p>
          {systemChannels.map((room) => (
            <ChannelItem key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
}
