import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import DirectMessageSearch from "./DirectMessageSearch";
import EditTeamModal from "./EditTeamModal";

export default function TeamSidebar({
  channels,
  users,
  activeId,
  setActiveId,
  onCreate,
  onUpdateChannel,
  onDeleteChannel,
  currentUser, // ← now passed from parent
}) {
  const [editingChannel, setEditingChannel] = useState(null);

  const regular = Array.isArray(channels)
    ? channels.filter((c) => c.type === "regular")
    : [];
  const notice = Array.isArray(channels)
    ? channels.filter((c) => c.type === "notice")
    : [];
  const privateChats = Array.isArray(channels)
    ? channels.filter((c) => c.type === "private")
    : [];

  const handleDelete = (channelId) => {
    if (!window.confirm("Are you sure you want to delete this channel?"))
      return;
    onDeleteChannel(channelId);
  };

  const getDisplayName = (channel) => {
    if (channel.type !== "private") return channel.name;

    // For private: show the OTHER person's name
    const other = channel.members?.find((m) => m?._id !== currentUser?._id);

    if (other) {
      return `${other.firstName} ${other.lastName}`;
    }

    return channel.name || "Private Chat";
  };

  const Item = ({ c, editable = false, deletable = false }) => (
    <div
      className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm mb-1
        ${activeId === c._id ? "bg-gray-200" : "hover:bg-gray-100"}`}
      onClick={() => setActiveId(c._id)}
    >
      <span className="truncate">{getDisplayName(c)}</span>

      <div className="flex gap-2">
        {editable && (
          <Pencil
            size={14}
            className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setEditingChannel(c);
            }}
          />
        )}

        {deletable && (
          <Trash2
            size={14}
            className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(c._id);
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
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
            <Item key={c._id} c={c} editable />
          ))}

          <p className="text-xs text-gray-400 mt-3">DM</p>
          {privateChats.map((c) => (
            <Item key={c._id} c={c} deletable />
          ))}

          <p className="text-xs text-gray-400 mt-3">SYSTEM</p>
          {notice.map((c) => (
            <Item key={c._id} c={c} deletable />
          ))}
        </div>
      </div>

      {editingChannel && (
        <EditTeamModal
          channel={editingChannel}
          users={users}
          onUpdate={onUpdateChannel}
          onDelete={onDeleteChannel}
          onClose={() => setEditingChannel(null)}
        />
      )}
    </>
  );
}
