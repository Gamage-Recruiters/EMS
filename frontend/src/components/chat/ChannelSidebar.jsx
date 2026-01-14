import { Hash, Lock } from "lucide-react";

export default function ChannelSidebar({
  rooms,
  activeChannel,
  setActiveChannel,
}) {
  // Group channels by type for better UX
  const noticeChannels = rooms.filter((r) => r.type === "notice");
  const regularChannels = rooms.filter((r) => r.type === "regular");
  const privateChannels = rooms.filter((r) => r.type === "private");

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase">
        Channels
      </h2>

      {/* Notice Channels */}
      {noticeChannels.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-600 mb-2">Notices</div>
          {noticeChannels.map((room) => (
            <div
              key={room._id}
              onClick={() => setActiveChannel(room)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1
                ${
                  activeChannel?._id === room._id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Lock size={14} className="text-gray-500" />
              {room.name}
            </div>
          ))}
        </>
      )}

      {/* Regular Channels */}
      {regularChannels.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-600 mt-4 mb-2">
            Team
          </div>
          {regularChannels.map((room) => (
            <div
              key={room._id}
              onClick={() => setActiveChannel(room)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1
                ${
                  activeChannel?._id === room._id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Hash size={14} />
              {room.name}
            </div>
          ))}
        </>
      )}

      {/* Private Chats */}
      {privateChannels.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-600 mt-4 mb-2">
            Messages
          </div>
          {privateChannels.map((room) => (
            <div
              key={room._id}
              onClick={() => setActiveChannel(room)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1
                ${
                  activeChannel?._id === room._id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span className="text-gray-500">👤</span>
              {room.name || "Private Chat"}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
