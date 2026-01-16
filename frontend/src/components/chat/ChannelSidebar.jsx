import { Hash, Lock, User } from "lucide-react";
import { useMemo } from "react";

export default function ChannelSidebar({
  rooms,
  activeChannel,
  setActiveChannel,
}) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser._id;

  // Filter regular channels: only those where user is a member
  const visibleRegularChannels = useMemo(() => {
    return rooms.filter((room) => {
      if (room.type !== "regular") return false;
      // Check if current user is in members array
      return room.members?.some(
        (member) => member._id === userId || member === userId
      );
    });
  }, [rooms, userId]);

  // Notice channels: everyone can see
  const noticeChannels = useMemo(
    () => rooms.filter((r) => r.type === "notice"),
    [rooms]
  );

  // Private channels: already filtered by backend
  const privateChannels = useMemo(
    () => rooms.filter((r) => r.type === "private"),
    [rooms]
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
        Channels
      </h2>

      {/* Notices – visible to all */}
      {noticeChannels.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <Lock size={14} className="text-gray-500" />
            Notices
          </div>
          {noticeChannels.map((room) => (
            <div
              key={room._id}
              onClick={() => setActiveChannel(room)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1 transition-colors
                ${
                  activeChannel?._id === room._id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Lock size={14} className="text-gray-500" />
              <span className="truncate">{room.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Team / Regular Channels – only where user is member */}
      {visibleRegularChannels.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <Hash size={14} className="text-gray-500" />
            Team Channels
          </div>
          {visibleRegularChannels.map((room) => (
            <div
              key={room._id}
              onClick={() => setActiveChannel(room)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1 transition-colors
                ${
                  activeChannel?._id === room._id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Hash size={14} className="text-gray-500" />
              <span className="truncate">{room.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Private Messages */}
      {privateChannels.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <User size={14} className="text-gray-500" />
            Messages
          </div>
          {privateChannels.map((room) => (
            <div
              key={room._id}
              onClick={() => setActiveChannel(room)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm mb-1 transition-colors
                ${
                  activeChannel?._id === room._id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <User size={14} className="text-gray-500" />
              <span className="truncate">{room.name || "Private Chat"}</span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {noticeChannels.length === 0 &&
        visibleRegularChannels.length === 0 &&
        privateChannels.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            No channels available yet
          </div>
        )}
    </div>
  );
}
